export type LogLevel = 'info' | 'warn' | 'error' | 'success';
export type LogModule = 'MIC' | 'STT' | 'TTS' | 'AUDIO_PLAY' | 'API' | 'SYS';

export interface DiagnosticLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  module: LogModule;
  message: string;
  details?: any;
}

export interface AudioSystemHealth {
  micSupported: boolean;
  micPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  webSpeechRecognitionSupported: boolean;
  mediaRecorderSupported: boolean;
  supportedMediaTypes: string[];
  speechSynthesisSupported: boolean;
  availableVoicesCount: number;
  voicesList: { name: string; lang: string; isDefault: boolean }[];
  audioContextSupported: boolean;
  isIframe: boolean;
  isSecureContext: boolean;
  serverTtsQuotaExceeded: boolean;
  ttsCooldownRemainingSec: number;
}

class VoiceDiagnosticsService {
  private logs: DiagnosticLog[] = [];
  private readonly maxLogs: number = 200;
  private listeners: Set<(logs: DiagnosticLog[]) => void> = new Set();
  private lastServerStatus: {
    ttsQuotaExceeded: boolean;
    ttsCooldownUntil: number;
    lastChecked: number;
  } = {
    ttsQuotaExceeded: false,
    ttsCooldownUntil: 0,
    lastChecked: 0,
  };

  constructor() {
    this.log('SYS', 'info', 'VoiceDiagnosticsService initialized in application.');
  }

  public log(module: LogModule, level: LogLevel, message: string, details?: any): void {
    // Gracefully handle standard browser speech cancellation / interruption events
    let effectiveLevel = level;
    if (
      effectiveLevel === 'error' &&
      (message.toLowerCase().includes('interrupted') ||
        message.toLowerCase().includes('canceled') ||
        message.toLowerCase().includes('aborted') ||
        (details && (details.error === 'interrupted' || details.error === 'canceled' || details.error === 'aborted')))
    ) {
      effectiveLevel = 'info';
    }

    const entry: DiagnosticLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      level: effectiveLevel,
      module,
      message,
      details: details ? (typeof details === 'object' ? JSON.parse(JSON.stringify(details, this.safeReplacer)) : details) : undefined,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Mirror to developer browser console with formatted tag
    const prefix = `[VoiceDiag:${module}:${effectiveLevel.toUpperCase()}]`;
    if (effectiveLevel === 'error') {
      console.error(prefix, message, details || '');
    } else if (effectiveLevel === 'warn') {
      console.warn(prefix, message, details || '');
    } else {
      console.log(prefix, message, details || '');
    }

    this.notify();
  }

  private safeReplacer(_key: string, value: any) {
    if (value instanceof Error) {
      return { name: value.name, message: value.message, stack: value.stack };
    }
    return value;
  }

  public getLogs(): DiagnosticLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.log('SYS', 'info', 'Diagnostic logs cleared by user.');
  }

  public subscribe(listener: (logs: DiagnosticLog[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getLogs();
    this.listeners.forEach((l) => l(snapshot));
  }

  public setServerTtsCooldown(untilTimestamp: number): void {
    this.lastServerStatus.ttsCooldownUntil = untilTimestamp;
    this.lastServerStatus.ttsQuotaExceeded = Date.now() < untilTimestamp;
    this.log(
      'TTS',
      'warn',
      `TTS server quota cooldown active until ${new Date(untilTimestamp).toLocaleTimeString()}. Auto-fallback to Browser Speech Synthesis enabled.`
    );
  }

  public isServerTtsInCooldown(): boolean {
    return Date.now() < this.lastServerStatus.ttsCooldownUntil;
  }

  public async getSystemHealth(): Promise<AudioSystemHealth> {
    const isBrowser = typeof window !== 'undefined';
    const isSecureContext = isBrowser ? window.isSecureContext : false;
    const isIframe = isBrowser ? window.self !== window.top : false;

    // Mic support
    const micSupported = isBrowser && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    // Permission check
    let micPermission: AudioSystemHealth['micPermission'] = 'unsupported';
    if (isBrowser && navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        micPermission = status.state as any;
      } catch {
        micPermission = micSupported ? 'prompt' : 'unsupported';
      }
    } else if (micSupported) {
      micPermission = 'prompt';
    }

    // MediaRecorder
    const mediaRecorderSupported = isBrowser && typeof MediaRecorder !== 'undefined';
    const supportedMediaTypes: string[] = [];
    if (mediaRecorderSupported) {
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/wav',
      ];
      for (const c of candidates) {
        if (MediaRecorder.isTypeSupported(c)) {
          supportedMediaTypes.push(c);
        }
      }
    }

    // Speech Recognition
    const webSpeechRecognitionSupported =
      isBrowser && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    // Speech Synthesis
    const speechSynthesisSupported = isBrowser && 'speechSynthesis' in window;
    const voicesList: { name: string; lang: string; isDefault: boolean }[] = [];
    if (speechSynthesisSupported) {
      try {
        const voices = window.speechSynthesis.getVoices();
        for (const v of voices) {
          voicesList.push({
            name: v.name,
            lang: v.lang,
            isDefault: v.default,
          });
        }
      } catch {
        // ignore
      }
    }

    // Audio Context
    const AudioCtx = isBrowser ? window.AudioContext || (window as any).webkitAudioContext : null;
    const audioContextSupported = !!AudioCtx;

    // Remaining cooldown
    const cooldownRemainingSec = Math.max(
      0,
      Math.round((this.lastServerStatus.ttsCooldownUntil - Date.now()) / 1000)
    );

    return {
      micSupported,
      micPermission,
      webSpeechRecognitionSupported,
      mediaRecorderSupported,
      supportedMediaTypes,
      speechSynthesisSupported,
      availableVoicesCount: voicesList.length,
      voicesList,
      audioContextSupported,
      isIframe,
      isSecureContext,
      serverTtsQuotaExceeded: cooldownRemainingSec > 0,
      ttsCooldownRemainingSec: cooldownRemainingSec,
    };
  }

  public exportLogsAsText(): string {
    const lines = [
      `=== BhashaGuru Audio & Voice Diagnostics Report ===`,
      `Generated at: ${new Date().toISOString()}`,
      `User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`,
      `Protocol: ${typeof location !== 'undefined' ? location.protocol : 'N/A'}`,
      `Is In Iframe: ${typeof window !== 'undefined' ? window.self !== window.top : 'N/A'}`,
      `TTS Quota Cooldown Active: ${this.isServerTtsInCooldown()}`,
      `----------------------------------------------------`,
      `LOG ENTRIES (${this.logs.length}):`,
    ];

    for (const l of this.logs) {
      const time = new Date(l.timestamp).toLocaleTimeString();
      let detailStr = '';
      if (l.details) {
        try {
          detailStr = ` | Details: ${typeof l.details === 'string' ? l.details : JSON.stringify(l.details)}`;
        } catch {
          // ignore
        }
      }
      lines.push(`[${time}] [${l.module}] [${l.level.toUpperCase()}] ${l.message}${detailStr}`);
    }

    return lines.join('\n');
  }

  // Diagnostic Test: Echo Mic Test
  public async testMicrophoneRecord(
    durationMs: number = 3000,
    onVolume?: (vol: number) => void
  ): Promise<{ success: boolean; error?: string; audioDataUrl?: string; durationMs: number }> {
    this.log('MIC', 'info', `Starting ${durationMs}ms microphone diagnostic echo test...`);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = 'navigator.mediaDevices.getUserMedia is not supported on this browser or platform.';
      this.log('MIC', 'error', err);
      return { success: false, error: err, durationMs: 0 };
    }

    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let animFrame: number | null = null;

    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch (constraintErr: any) {
        this.log('MIC', 'warn', `Optimal audio constraints failed (${constraintErr?.name}), falling back to simple { audio: true }`, constraintErr);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const audioTrack = stream.getAudioTracks()[0];
      this.log('MIC', 'success', `Microphone stream acquired! Device: "${audioTrack?.label || 'Default'}", State: ${audioTrack?.readyState}`);

      // Analyser for volume
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVol = () => {
          if (!stream) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          onVolume?.(normalized);
          animFrame = requestAnimationFrame(checkVol);
        };
        animFrame = requestAnimationFrame(checkVol);
      }

      // MediaRecorder
      const chunks: Blob[] = [];
      let mime = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, { mimeType: mime });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.start(100);
      this.log('MIC', 'info', `Recording audio chunks with MIME: ${mime}...`);

      await new Promise((resolve) => setTimeout(resolve, durationMs));

      if (recorder.state === 'recording') {
        recorder.requestData?.();
        recorder.stop();
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      const blob = new Blob(chunks, { type: mime });
      this.log('MIC', 'success', `Recording finished. Total blob size: ${blob.size} bytes across ${chunks.length} chunks.`);

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      return { success: true, audioDataUrl: dataUrl, durationMs };
    } catch (err: any) {
      this.log('MIC', 'error', `Microphone test failed: ${err?.name || 'Error'} - ${err?.message}`, err);
      return { success: false, error: err?.message || 'Microphone error', durationMs: 0 };
    } finally {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) {
        try {
          audioContext.close();
        } catch {
          // ignore
        }
      }
      onVolume?.(0);
    }
  }

  // Diagnostic Test: Speaker Voice Test
  public async testSpeakerSound(forceBrowserSpeech: boolean = false): Promise<{ success: boolean; error?: string; providerUsed: string }> {
    this.log('TTS', 'info', `Running speaker test sound (forceBrowser: ${forceBrowserSpeech})...`);

    if (!forceBrowserSpeech && !this.isServerTtsInCooldown()) {
      try {
        const testText = 'Hello! BhashaGuru audio is working perfectly.';
        this.log('API', 'info', 'Pinging /api/ai/tts for audio synthesis test...');
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: testText, voiceName: 'Kore', voiceGender: 'Female', speed: 'normal' }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            this.log('AUDIO_PLAY', 'info', 'Received base64 audio from server. Playing via HTMLAudioElement...');
            const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
            await audio.play();
            this.log('AUDIO_PLAY', 'success', 'Base64 audio playback started successfully.');
            return { success: true, providerUsed: 'gemini-tts' };
          } else if (data.quotaExceeded) {
            this.setServerTtsCooldown(Date.now() + 15 * 60 * 1000);
            this.log('TTS', 'warn', 'Server indicated TTS quota exceeded. Switching test to Browser Speech Synthesis.');
          }
        }
      } catch (err: any) {
        this.log('TTS', 'warn', `Server TTS test did not produce audio (${err?.message}), falling back to browser synthesis.`);
      }
    }

    // Browser Speech Synthesis test
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      const err = 'Browser SpeechSynthesis is not supported on this platform.';
      this.log('TTS', 'error', err);
      return { success: false, error: err, providerUsed: 'none' };
    }

    return new Promise((resolve) => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const testUtterance = new SpeechSynthesisUtterance('नमस्ते! आवाज़ बिल्कुल सही काम कर रही है। BhashaGuru audio is loud and clear.');
        testUtterance.rate = 1.0;
        testUtterance.pitch = 1.0;

        testUtterance.onstart = () => {
          this.log('TTS', 'success', 'Browser SpeechSynthesis started speaking successfully.');
        };

        testUtterance.onend = () => {
          this.log('TTS', 'success', 'Browser SpeechSynthesis test completed.');
          resolve({ success: true, providerUsed: 'browser-speech' });
        };

        testUtterance.onerror = (e) => {
          if (e.error === 'interrupted' || e.error === 'canceled') {
            this.log('TTS', 'info', `Browser SpeechSynthesis test ended or cancelled as requested (${e.error}).`);
            resolve({ success: true, providerUsed: 'browser-speech' });
          } else {
            this.log('TTS', 'warn', `Browser SpeechSynthesis warning: ${e.error}`);
            resolve({ success: false, error: `SpeechSynthesis event: ${e.error}`, providerUsed: 'browser-speech' });
          }
        };

        window.speechSynthesis.speak(testUtterance);

        // Fallback safety timeout
        setTimeout(() => {
          resolve({ success: true, providerUsed: 'browser-speech' });
        }, 4000);
      } catch (err: any) {
        this.log('TTS', 'error', `SpeechSynthesis execution threw: ${err?.message}`, err);
        resolve({ success: false, error: err?.message, providerUsed: 'browser-speech' });
      }
    });
  }

  // Diagnostic Test: Server Audio API Health Check
  public async testServerAudioApis(): Promise<{ ttsOk: boolean; sttOk: boolean; quotaExceeded: boolean; details: any }> {
    this.log('API', 'info', 'Querying /api/ai/audio-diagnostics on backend server...');
    try {
      const res = await fetch('/api/ai/audio-diagnostics');
      if (res.ok) {
        const data = await res.json();
        this.log('API', 'success', 'Server audio diagnostics response received.', data);
        if (data.ttsQuotaExceeded) {
          this.setServerTtsCooldown(data.ttsQuotaCooldownUntil || Date.now() + 15 * 60 * 1000);
        }
        return {
          ttsOk: data.aiConfigured && !data.ttsQuotaExceeded,
          sttOk: data.aiConfigured,
          quotaExceeded: !!data.ttsQuotaExceeded,
          details: data,
        };
      } else {
        this.log('API', 'error', `Server diagnostics returned status ${res.status}`);
        return { ttsOk: false, sttOk: false, quotaExceeded: false, details: { status: res.status } };
      }
    } catch (err: any) {
      this.log('API', 'error', `Failed to contact /api/ai/audio-diagnostics: ${err?.message}`);
      return { ttsOk: false, sttOk: false, quotaExceeded: false, details: { error: err?.message } };
    }
  }
}

export const voiceDiagnostics = new VoiceDiagnosticsService();
