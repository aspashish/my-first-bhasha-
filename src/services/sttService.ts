import { voiceDiagnostics } from './voiceDiagnostics';

export interface STTResult {
  transcript: string;
  audioDataUrl?: string;
  audioBase64?: string;
  mimeType?: string;
  providerUsed: 'web-speech' | 'gemini-transcribe' | 'fallback';
  durationMs?: number;
}

export class ModularSpeechRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recognition: any = null;
  private webSpeechTranscript: string = '';
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private pcmChunks: Float32Array[] = [];
  private volumeCallback: ((volume: number) => void) | null = null;
  private volumeAnimFrame: number | null = null;
  private startTime: number = 0;

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public async start(
    onInterimTranscript?: (text: string) => void,
    onError?: (errMessage: string) => void,
    onVolumeChange?: (volume: number) => void
  ): Promise<boolean> {
    this.audioChunks = [];
    this.pcmChunks = [];
    this.webSpeechTranscript = '';
    this.volumeCallback = onVolumeChange || null;
    this.startTime = Date.now();

    voiceDiagnostics.log('MIC', 'info', 'Initializing microphone recording session...');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errMsg =
        'इस ब्राउज़र में ऑडियो रिकॉर्डिंग उपलब्ध नहीं है। कृपया Chrome/Edge का उपयोग करें या नीचे टाइप करके उत्तर दें।';
      voiceDiagnostics.log('MIC', 'error', 'navigator.mediaDevices.getUserMedia is unavailable.');
      onError?.(errMsg);
      return false;
    }

    // Check permission state in advance if supported
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        voiceDiagnostics.log('MIC', 'info', `Current microphone permission query state: "${permStatus.state}"`);
        if (permStatus.state === 'denied') {
          const deniedMsg =
            'Microphone permission blocked! कृपया ब्राउज़र एड्रेस बार में लॉक (Lock/Settings) आइकन पर क्लिक करके Microphone को Allow करें, फिर दोबारा टैप करें।';
          voiceDiagnostics.log('MIC', 'error', 'Microphone permission explicitly denied by user/browser.');
          onError?.(deniedMsg);
          return false;
        }
      } catch {
        // Permissions query not supported for microphone on some browsers, continue to getUserMedia
      }
    }

    try {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        voiceDiagnostics.log('MIC', 'success', 'Microphone stream acquired with full acoustic processing.');
      } catch (constraintErr: any) {
        voiceDiagnostics.log(
          'MIC',
          'warn',
          `Optimal audio constraints failed (${constraintErr?.name}), falling back to { audio: true }...`,
          constraintErr
        );
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        voiceDiagnostics.log('MIC', 'success', 'Microphone stream acquired with basic audio constraint.');
      }

      const audioTrack = this.stream.getAudioTracks()[0];
      if (audioTrack) {
        voiceDiagnostics.log('MIC', 'info', `Active audio track: "${audioTrack.label}", readyState: ${audioTrack.readyState}, enabled: ${audioTrack.enabled}`);
      }
    } catch (err: any) {
      voiceDiagnostics.log('MIC', 'error', `getUserMedia failed with ${err?.name}: ${err?.message}`, err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'SecurityError') {
        onError?.(
          'Microphone permission blocked! कृपया ब्राउज़र एड्रेस बार में लॉक (Lock/Settings) आइकन पर क्लिक करके Microphone को Allow करें, फिर दोबारा टैप करें।'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        onError?.('कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक जोड़ें या नीचे टाइप करके उत्तर दें।');
      } else if (err.name === 'NotReadableError') {
        onError?.('माइक्रोफ़ोन किसी अन्य ऐप द्वारा उपयोग में है। कृपया अन्य ऐप्स बंद करें और फिर आज़माएँ।');
      } else {
        onError?.('माइक्रोफ़ोन एक्सेस नहीं मिला। आप नीचे टाइप करके भी जवाब दे सकते हैं।');
      }
      return false;
    }

    this.isRecording = true;

    // Start volume analyzer for live visual waveform feedback
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        try {
          this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
          this.scriptProcessor.onaudioprocess = (e) => {
            if (!this.isRecording) return;
            const channel = e.inputBuffer.getChannelData(0);
            this.pcmChunks.push(new Float32Array(channel));
          };
          source.connect(this.scriptProcessor);
          this.scriptProcessor.connect(this.audioContext.destination);
        } catch (procErr) {
          voiceDiagnostics.log('MIC', 'warn', 'ScriptProcessor PCM capture unavailable:', procErr);
        }

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!this.isRecording || !this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          this.volumeCallback?.(normalized);
          this.volumeAnimFrame = requestAnimationFrame(checkVolume);
        };
        this.volumeAnimFrame = requestAnimationFrame(checkVolume);
        voiceDiagnostics.log('MIC', 'info', 'Real-time audio visualizer initialized.');
      }
    } catch (analyserErr) {
      voiceDiagnostics.log('MIC', 'warn', 'Volume analyzer initialization warning:', analyserErr);
    }

    // Supported clean MIME type detection for MediaRecorder
    let mimeType = 'audio/webm';
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      try {
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.start(200);
        voiceDiagnostics.log('MIC', 'info', `MediaRecorder active with MIME: ${mimeType}`);
      } catch (recErr) {
        voiceDiagnostics.log('MIC', 'warn', `MediaRecorder init with ${mimeType} failed, trying default:`, recErr);
        try {
          this.mediaRecorder = new MediaRecorder(this.stream);
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };
          this.mediaRecorder.start(200);
          voiceDiagnostics.log('MIC', 'info', 'MediaRecorder active with browser default configuration.');
        } catch (fallbackErr) {
          voiceDiagnostics.log('MIC', 'error', 'MediaRecorder completely unavailable on this device.', fallbackErr);
        }
      }
    }

    // Web Speech API for real-time speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-IN';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
          let finalText = '';
          let interimText = '';
          for (let i = 0; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcriptPiece + ' ';
            } else {
              interimText += transcriptPiece;
            }
          }
          const combined = (finalText + interimText).trim();
          if (combined) {
            this.webSpeechTranscript = combined;
            voiceDiagnostics.log('STT', 'info', `WebSpeech partial recognition: "${combined}"`);
            onInterimTranscript?.(combined);
          }
        };

        this.recognition.onend = () => {
          if (this.isRecording) {
            try {
              this.recognition?.start();
            } catch {
              // ignore
            }
          }
        };

        this.recognition.onerror = (e: any) => {
          if (e.error === 'no-speech' || e.error === 'aborted') {
            voiceDiagnostics.log('STT', 'info', `WebSpeech recognition listening (${e.error}).`);
            return;
          }
          voiceDiagnostics.log('STT', 'warn', `WebSpeech recognition event: ${e.error}`);
          if (e.error === 'not-allowed') {
            onError?.('Microphone permission blocked! ब्राउज़र सेटिंग्स में माइक को Allow करें।');
          }
        };

        this.recognition.onstart = () => {
          voiceDiagnostics.log('STT', 'info', 'WebSpeech recognition listening.');
        };

        this.recognition.start();
      } catch (recognitionInitErr) {
        voiceDiagnostics.log('STT', 'warn', 'WebSpeech recognition could not be started:', recognitionInitErr);
      }
    } else {
      voiceDiagnostics.log('STT', 'info', 'SpeechRecognition API not available in browser; will rely on Gemini STT.');
    }

    return true;
  }

  public async stop(preferGeminiSTT: boolean = false): Promise<STTResult> {
    const totalDurationMs = Date.now() - this.startTime;
    voiceDiagnostics.log('MIC', 'info', `Stopping recording session (duration: ${totalDurationMs}ms)...`);
    this.isRecording = false;

    if (this.volumeAnimFrame) {
      cancelAnimationFrame(this.volumeAnimFrame);
      this.volumeAnimFrame = null;
    }
    this.volumeCallback?.(0);

    // Stop recognition with grace period
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      await new Promise((r) => setTimeout(r, 200));
      this.recognition = null;
    }

    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect();
      } catch {
        // ignore
      }
      this.scriptProcessor = null;
    }

    let audioBlob: Blob | null = null;
    let mimeType = 'audio/wav';

    // 1. Prefer pristine 16kHz mono WAV from AudioContext PCM chunks
    if (this.pcmChunks.length > 0) {
      try {
        audioBlob = encodePcmToWav(this.pcmChunks, this.audioContext?.sampleRate || 44100, 16000);
        mimeType = 'audio/wav';
        voiceDiagnostics.log('MIC', 'info', `Encoded 16kHz mono WAV: ${audioBlob.size} bytes`);
      } catch (wavErr) {
        voiceDiagnostics.log('MIC', 'warn', 'PCM to WAV encoding failed, falling back to MediaRecorder:', wavErr);
      }
    }

    // 2. Fall back to MediaRecorder chunks if WAV was not created
    if (!audioBlob || audioBlob.size < 200) {
      mimeType = 'audio/webm';
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        mimeType = (this.mediaRecorder.mimeType || 'audio/webm').split(';')[0].trim();
        try {
          this.mediaRecorder.requestData?.();
        } catch {
          // ignore
        }

        const recorderStopPromise = new Promise<Blob | null>((resolve) => {
          if (!this.mediaRecorder) return resolve(null);
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: mimeType });
            resolve(blob);
          };
          try {
            this.mediaRecorder.stop();
          } catch {
            resolve(new Blob(this.audioChunks, { type: mimeType }));
          }
        });

        const timeoutPromise = new Promise<Blob | null>((resolve) => {
          setTimeout(() => resolve(new Blob(this.audioChunks, { type: mimeType })), 600);
        });

        audioBlob = await Promise.race([recorderStopPromise, timeoutPromise]);
      } else if (this.audioChunks.length > 0) {
        audioBlob = new Blob(this.audioChunks, { type: mimeType });
      }
    }

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
      this.analyser = null;
    }

    let audioDataUrl: string | undefined;
    let audioBase64: string | undefined;

    if (audioBlob && audioBlob.size > 200) {
      voiceDiagnostics.log('MIC', 'info', `Captured audio blob: ${audioBlob.size} bytes (${mimeType})`);
      audioDataUrl = await this.blobToDataUrl(audioBlob);
      audioBase64 = audioDataUrl.split(',')[1];
    } else {
      voiceDiagnostics.log('MIC', 'warn', `Recorded audio blob is empty or too small: ${audioBlob ? audioBlob.size : 0} bytes.`);
    }

    // 1. If Web Speech successfully recognized text: ALWAYS use it immediately!
    // Real-time client-side speech recognition has zero network latency and no cloud rate limits.
    if (this.webSpeechTranscript.trim()) {
      voiceDiagnostics.log('STT', 'success', `Using WebSpeech transcript: "${this.webSpeechTranscript.trim()}"`);
      return {
        transcript: this.webSpeechTranscript.trim(),
        audioDataUrl,
        audioBase64,
        mimeType,
        providerUsed: 'web-speech',
        durationMs: totalDurationMs,
      };
    }

    // 2. If Web Speech was silent or browser lacks SpeechRecognition: send clean WAV to backend /api/ai/stt
    if (audioBase64) {
      voiceDiagnostics.log('API', 'info', `Sending audio to /api/ai/stt for AI transcription (${mimeType})...`);
      try {
        const cleanMime = mimeType.split(';')[0].trim() || 'audio/wav';
        const sttFetchStart = Date.now();
        const res = await fetch('/api/ai/stt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64, mimeType: cleanMime }),
        });

        const sttElapsed = Date.now() - sttFetchStart;

        if (res.ok) {
          const data = await res.json();
          if (data.transcript && data.transcript.trim()) {
            voiceDiagnostics.log(
              'STT',
              'success',
              `Gemini STT transcript received in ${sttElapsed}ms: "${data.transcript.trim()}"`
            );
            return {
              transcript: data.transcript.trim(),
              audioDataUrl,
              audioBase64,
              mimeType: cleanMime,
              providerUsed: 'gemini-transcribe',
              durationMs: totalDurationMs,
            };
          }
        } else {
          voiceDiagnostics.log('API', 'warn', `/api/ai/stt returned status ${res.status} (${sttElapsed}ms)`);
        }
      } catch (err: any) {
        voiceDiagnostics.log('API', 'error', `Gemini audio transcription error: ${err?.message}`, err);
      }
    }

    // 3. Fallback to whatever web speech got, even if partial
    const finalFallback = this.webSpeechTranscript.trim();
    voiceDiagnostics.log(
      'STT',
      finalFallback ? 'info' : 'warn',
      finalFallback ? `Falling back to WebSpeech: "${finalFallback}"` : 'No transcript detected.'
    );

    return {
      transcript: finalFallback,
      audioDataUrl,
      audioBase64,
      mimeType,
      providerUsed: finalFallback ? 'web-speech' : 'fallback',
      durationMs: totalDurationMs,
    };
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * Encodes captured PCM Float32 audio chunks into a standard 16kHz 16-bit mono WAV Blob.
 */
function encodePcmToWav(
  chunks: Float32Array[],
  inputSampleRate: number,
  targetSampleRate: number = 16000
): Blob {
  let totalLength = 0;
  for (let i = 0; i < chunks.length; i++) totalLength += chunks[i].length;
  const merged = new Float32Array(totalLength);
  let offset = 0;
  for (let i = 0; i < chunks.length; i++) {
    merged.set(chunks[i], offset);
    offset += chunks[i].length;
  }

  let downsampled: Int16Array;
  if (inputSampleRate !== targetSampleRate && inputSampleRate > 0) {
    const ratio = inputSampleRate / targetSampleRate;
    const newLen = Math.max(1, Math.round(totalLength / ratio));
    downsampled = new Int16Array(newLen);
    for (let i = 0; i < newLen; i++) {
      const srcIdx = Math.min(Math.floor(i * ratio), totalLength - 1);
      const s = Math.max(-1, Math.min(1, merged[srcIdx]));
      downsampled[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  } else {
    downsampled = new Int16Array(totalLength);
    for (let i = 0; i < totalLength; i++) {
      const s = Math.max(-1, Math.min(1, merged[i]));
      downsampled[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  const wavBuffer = new ArrayBuffer(44 + downsampled.length * 2);
  const view = new DataView(wavBuffer);
  // RIFF identifier
  view.setUint8(0, 0x52); view.setUint8(1, 0x49); view.setUint8(2, 0x46); view.setUint8(3, 0x46);
  view.setUint32(4, 36 + downsampled.length * 2, true);
  // WAVE
  view.setUint8(8, 0x57); view.setUint8(9, 0x41); view.setUint8(10, 0x56); view.setUint8(11, 0x45);
  // fmt
  view.setUint8(12, 0x66); view.setUint8(13, 0x6d); view.setUint8(14, 0x74); view.setUint8(15, 0x20);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * 2, true); // byte rate (16000 * 2)
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // 16 bits per sample
  // data
  view.setUint8(36, 0x64); view.setUint8(37, 0x61); view.setUint8(38, 0x74); view.setUint8(39, 0x61);
  view.setUint32(40, downsampled.length * 2, true);

  let pcmOffset = 44;
  for (let i = 0; i < downsampled.length; i++) {
    view.setInt16(pcmOffset, downsampled[i], true);
    pcmOffset += 2;
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

export const speechRecorder = new ModularSpeechRecorder();
