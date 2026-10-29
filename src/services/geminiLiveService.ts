/**
 * Gemini Live API Client Service for BhashaGuru
 * Handles real-time bidirectional audio streaming via WebSocket to the server bridge,
 * Web Audio capture (16kHz PCM), hardware AEC, voice frequency enhancement filters,
 * dynamic noise gate, background noise & speaker bleed shielding, and interruption handling.
 */

export type LiveConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'speaking' // Teacher is speaking
  | 'listening' // Teacher listening to learner (VAD active)
  | 'interrupted'
  | 'error'
  | 'disconnected';

export type BargeInMode = 'shielded' | 'sensitive' | 'tap-only';

export interface LiveTranscriptEvent {
  role: 'teacher' | 'learner';
  text: string;
  isFinal: boolean;
}

export interface LiveServiceCallbacks {
  onStateChange: (state: LiveConnectionState) => void;
  onTranscript: (event: LiveTranscriptEvent) => void;
  onVolumeChange: (volume: number) => void; // 0 to 1
  onError: (errorMessage: string) => void;
  onTurnComplete?: () => void;
}

export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private outputGainNode: GainNode | null = null;
  private outputAnalyserNode: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;
  private voiceFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;

  private state: LiveConnectionState = 'idle';
  private callbacks: Partial<LiveServiceCallbacks> = {};
  private isMuted: boolean = false;
  private isTeacherSpeaking: boolean = false;
  private nextStartTime: number = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private teacherSpeechTimeout: any = null;

  // Background Noise & Speaker Bleed Protection
  // Mode:
  // - 'shielded' (default): background voices, TV, room noise and speaker bleed are filtered out.
  //   Only loud intentional voice (>= 0.28 sustained) or manual button tap can interrupt.
  // - 'sensitive': normal voice threshold (0.18+) interrupts.
  // - 'tap-only': voice barge-in disabled; teacher always finishes speech 100% without cut-off unless user taps Interrupt.
  private bargeInMode: BargeInMode = 'shielded';
  private ambientNoiseFloor: number = 0.03;
  private bargeInConsecutiveFrames: number = 0;
  private hangoverFramesRemaining: number = 0;
  private modelTurnComplete: boolean = false;

  public subscribe(callbacks: Partial<LiveServiceCallbacks>) {
    this.callbacks = callbacks;
  }

  public getState(): LiveConnectionState {
    return this.state;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getBargeInMode(): BargeInMode {
    return this.bargeInMode;
  }

  public setBargeInMode(mode: BargeInMode) {
    this.bargeInMode = mode;
  }

  private setState(newState: LiveConnectionState) {
    this.state = newState;
    this.callbacks.onStateChange?.(newState);
  }

  /**
   * Start Live Voice Call with Gemini 3.8 Live API
   */
  public async startCall(config: {
    topic?: string;
    scenarioLabel?: string;
    starterPrompt?: string;
    difficulty?: string;
  }): Promise<boolean> {
    try {
      this.setState('connecting');
      this.isTeacherSpeaking = false;
      this.nextStartTime = 0;
      this.activeSources.clear();
      this.bargeInConsecutiveFrames = 0;
      this.hangoverFramesRemaining = 0;
      this.ambientNoiseFloor = 0.03;
      this.modelTurnComplete = false;

      // 1. Initialize Web Audio Contexts
      // Input: 16kHz for mic capture as required by Gemini Live API
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      // Output: 24kHz for Gemini Live audio playback
      this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
      this.outputGainNode = this.outputAudioCtx.createGain();
      this.outputAnalyserNode = this.outputAudioCtx.createAnalyser();
      this.outputAnalyserNode.fftSize = 256;
      this.outputAnalyserNode.smoothingTimeConstant = 0.35;
      this.outputGainNode.connect(this.outputAnalyserNode);
      this.outputAnalyserNode.connect(this.outputAudioCtx.destination);

      if (this.inputAudioCtx.state === 'suspended') {
        await this.inputAudioCtx.resume();
      }
      if (this.outputAudioCtx.state === 'suspended') {
        await this.outputAudioCtx.resume();
      }

      // 2. Request user microphone with hardware echo cancellation and noise suppression
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      // 3. Connect WebSocket to server bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // Send initial call configuration to server
        this.ws?.send(
          JSON.stringify({
            type: 'init',
            topic: config.topic,
            scenarioLabel: config.scenarioLabel,
            starterPrompt: config.starterPrompt,
            difficulty: config.difficulty,
          })
        );
      };

      this.ws.onmessage = (event) => {
        this.handleServerMessage(event.data);
      };

      this.ws.onerror = (_e) => {
        this.setState('error');
        this.callbacks.onError?.('WebSocket connection error with Gemini Live server.');
      };

      this.ws.onclose = () => {
        if (this.state !== 'idle') {
          this.setState('disconnected');
        }
      };

      // 4. Setup enhanced microphone capture pipeline with DSP filters and noise gate
      this.setupMicrophonePipeline();

      return true;
    } catch (err: any) {
      console.error('[GeminiLiveService] Failed to start call:', err);
      const errMsg =
        err?.name === 'NotAllowedError'
          ? 'माइक की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
          : err?.message || 'कॉल शुरू करने में असमर्थ। कृपया पुनः प्रयास करें।';
      this.setState('error');
      this.callbacks.onError?.(errMsg);
      this.cleanup();
      return false;
    }
  }

  /**
   * Continuous mic processing using Web Audio API ScriptProcessorNode (1024 buffer = 64ms latency)
   * Enhanced with 4-stage DSP chain:
   * 1. Highpass Filter (100Hz) - kills AC hum, desk bumps, sub-bass rumble
   * 2. Voice Presence Peaking Filter (1800Hz, +3.5dB) - sharpens learner vocal clarity
   * 3. Lowpass Filter (4200Hz) - eliminates background fan noise and high hiss
   * 4. Dynamics Compressor - levels soft speech and prevents clipping
   * Shielded mode guarantees the AI teacher completes 100% of speech without premature cutoff.
   * Trailing silence streaming ensures Gemini Live VAD detects turn-end rapidly without delay.
   */
  private setupMicrophonePipeline() {
    if (!this.inputAudioCtx || !this.mediaStream) return;

    this.sourceNode = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);

    // Stage 1: Highpass Filter at 100Hz (eliminates electrical hum, handling thumps, HVAC rumble)
    this.highpassFilter = this.inputAudioCtx.createBiquadFilter();
    this.highpassFilter.type = 'highpass';
    this.highpassFilter.frequency.value = 100;
    this.highpassFilter.Q.value = 0.7;

    // Stage 2: Voice Formant Peaking Filter at 1800Hz (boosts human vocal presence and articulation)
    this.voiceFilter = this.inputAudioCtx.createBiquadFilter();
    this.voiceFilter.type = 'peaking';
    this.voiceFilter.frequency.value = 1800;
    this.voiceFilter.Q.value = 1.0;
    this.voiceFilter.gain.value = 3.5;

    // Stage 3: Lowpass Filter at 4200Hz (cuts off high-frequency hiss, PC fans, background squeaks)
    this.lowpassFilter = this.inputAudioCtx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.value = 4200;
    this.lowpassFilter.Q.value = 0.7;

    // Stage 4: Dynamics Compressor (smoothly levels learner's voice, boosting quiet syllables)
    this.compressorNode = this.inputAudioCtx.createDynamicsCompressor();
    this.compressorNode.threshold.value = -24;
    this.compressorNode.knee.value = 30;
    this.compressorNode.ratio.value = 4;
    this.compressorNode.attack.value = 0.003;
    this.compressorNode.release.value = 0.25;

    // Fast 1024-sample buffer gives ultra-low ~64ms latency at 16kHz
    this.processorNode = this.inputAudioCtx.createScriptProcessor(1024, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0);

      // Compute RMS volume for live audio level meter
      let sum = 0;
      for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i];
      }
      const rms = Math.sqrt(sum / channelData.length);
      const normalizedVolume = Math.min(1, rms * 5.0);
      this.callbacks.onVolumeChange?.(normalizedVolume);

      // If muted, drop mic chunks completely
      if (this.isMuted) {
        return;
      }

      // =========================================================================
      // SCENARIO 1: TEACHER IS ACTIVELY SPEAKING
      // 100% SHIELD AGAINST FALSE CUTOFFS (Speaker Bleed, Background Chatter, TV)
      // =========================================================================
      if (this.isTeacherSpeaking) {
        // In shielded (default) and tap-only modes:
        // NEVER send mic audio to Gemini Live while teacher is speaking.
        // This ensures the teacher ALWAYS finishes her sentence completely!
        // No room voices, other people talking, or speaker playback can cut her off.
        if (this.bargeInMode !== 'sensitive') {
          return;
        }

        // In sensitive mode, only allow deliberate loud speech (>= 0.45 for 6+ frames = ~384ms)
        if (normalizedVolume >= 0.45) {
          this.bargeInConsecutiveFrames++;
        } else {
          this.bargeInConsecutiveFrames = 0;
        }

        if (this.bargeInConsecutiveFrames < 6) {
          return;
        }
      } else {
        // =========================================================================
        // SCENARIO 2: TEACHER IS LISTENING TO LEARNER
        // HIGH-RESPONSIVE VOICE TRANSMISSION + RAPID VAD TRAILING SILENCE
        // =========================================================================
        this.bargeInConsecutiveFrames = 0;
        // Ultra-sensitive speech detection (0.012 minimum gate) ensures every learner syllable reaches Gemini
        const speechGate = Math.max(0.012, this.ambientNoiseFloor * 1.15);

        if (normalizedVolume < speechGate) {
          // Volume is below speech threshold: adapt ambient noise floor gently
          this.ambientNoiseFloor = this.ambientNoiseFloor * 0.98 + normalizedVolume * 0.02;

          // Keep 20 hangover frames (~1.28 seconds of natural speech pauses / trailing room audio)
          // This gives Gemini Live VAD and ASR model sufficient context to accurately transcribe all spoken words
          if (this.hangoverFramesRemaining > 0) {
            this.hangoverFramesRemaining--;
          } else {
            // Stream low-energy frame occasionally so Gemini Live keeps connection alive and detects continuous presence
            return;
          }
        } else {
          // Learner is speaking: maintain generous 20-frame (~1.28s) hangover trailing window
          this.hangoverFramesRemaining = 20;
        }
      }

      // Convert Float32 to 16-bit PCM little endian
      const pcm16Buffer = this.floatTo16BitPCM(channelData);
      const base64Audio = this.arrayBufferToBase64(pcm16Buffer);

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          })
        );
      }
    };

    // Connect DSP filter chain:
    // source -> highpass (100Hz) -> voicePeaking (1800Hz) -> lowpass (4200Hz) -> compressor -> processor -> destination
    this.sourceNode.connect(this.highpassFilter);
    this.highpassFilter.connect(this.voiceFilter);
    this.voiceFilter.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.compressorNode);
    this.compressorNode.connect(this.processorNode);
    this.processorNode.connect(this.inputAudioCtx.destination);
  }

  /**
   * Handle incoming messages from the WebSocket server
   */
  private handleServerMessage(rawData: string) {
    try {
      const msg = JSON.parse(rawData);

      switch (msg.type) {
        case 'status':
          if (msg.status === 'connected' || msg.status === 'ready') {
            if (!this.isTeacherSpeaking) {
              this.setState('listening');
            }
          } else if (msg.status === 'connecting') {
            this.setState('connecting');
          }
          break;

        case 'audio':
          if (msg.audio) {
            this.playAudioChunk(msg.audio);
          }
          break;

        case 'transcript':
          if (msg.text) {
            this.callbacks.onTranscript?.({
              role: msg.role || 'teacher',
              text: msg.text,
              isFinal: !!msg.isFinal,
            });
          }
          break;

        case 'interrupted':
          // Only honor interrupt if user was in sensitive mode or explicitly triggered it
          if (this.bargeInMode === 'sensitive') {
            console.log('[GeminiLive] Interruption event received from server');
            this.stopAudioPlayback();
            this.setState('interrupted');
            setTimeout(() => {
              if (this.state === 'interrupted') {
                this.setState('listening');
              }
            }, 250);
          }
          break;

        case 'turnComplete':
          // Model finished transmitting turn chunks; let scheduled audio play out completely
          this.modelTurnComplete = true;
          this.checkTurnPlaybackFinished();
          break;

        case 'error':
          console.warn('[GeminiLive Notice]:', msg.message);
          this.setState('error');
          this.callbacks.onError?.(msg.message || 'Gemini Live encountered an error');
          break;

        case 'closed':
          this.setState('disconnected');
          break;
      }
    } catch (err) {
      console.warn('[GeminiLive Parse Notice]:', err);
    }
  }

  /**
   * Schedules gapless playback of incoming 24kHz 16-bit PCM audio chunks.
   * Employs an initial jitter buffer cushion to prevent network stalls and premature cut-off.
   */
  private playAudioChunk(base64Audio: string) {
    if (!this.outputAudioCtx) return;

    if (this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume();
    }

    try {
      const audioBuffer = this.base64ToAudioBuffer(this.outputAudioCtx, base64Audio);
      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      if (this.outputGainNode) {
        source.connect(this.outputGainNode);
      } else {
        source.connect(this.outputAudioCtx.destination);
      }

      const currentTime = this.outputAudioCtx.currentTime;

      // Initial 65ms jitter cushion on fresh playback
      if (this.activeSources.size === 0 || this.nextStartTime < currentTime) {
        this.nextStartTime = Math.max(currentTime + 0.065, this.nextStartTime);
      }

      const startTime = Math.max(currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.add(source);
      this.isTeacherSpeaking = true;
      this.modelTurnComplete = false;
      this.setState('speaking');

      source.onended = () => {
        this.activeSources.delete(source);
        this.checkTurnPlaybackFinished();
      };
    } catch (err) {
      console.warn('[GeminiLive Audio Notice]:', err);
    }
  }

  /**
   * Verifies that all scheduled audio buffers have finished playing out completely
   * AND model turn transmission is complete before switching the teacher back to listening state.
   */
  private checkTurnPlaybackFinished() {
    if (!this.outputAudioCtx) return;

    clearTimeout(this.teacherSpeechTimeout);

    // Wait until output time has caught up with scheduled audio duration
    const currentTime = this.outputAudioCtx.currentTime;
    const remainingTimeMs = Math.max(0, (this.nextStartTime - currentTime) * 1000);

    this.teacherSpeechTimeout = setTimeout(() => {
      // Only transition to listening if model turn is complete AND no sources remain
      if (
        this.modelTurnComplete &&
        this.activeSources.size === 0 &&
        (!this.outputAudioCtx || this.outputAudioCtx.currentTime >= this.nextStartTime - 0.05)
      ) {
        this.isTeacherSpeaking = false;
        this.nextStartTime = 0;
        this.bargeInConsecutiveFrames = 0;
        if (this.state === 'speaking') {
          this.setState('listening');
        }
        this.callbacks.onTurnComplete?.();
      } else if (!this.modelTurnComplete && this.activeSources.size === 0) {
        // Model turn still streaming; keep waiting
        this.teacherSpeechTimeout = setTimeout(() => {
          this.checkTurnPlaybackFinished();
        }, 150);
      }
    }, Math.max(160, remainingTimeMs + 40));
  }

  /**
   * Stop audio playback immediately upon user-initiated interrupt
   */
  public stopAudioPlayback() {
    this.activeSources.forEach((src) => {
      try {
        src.stop();
      } catch {
        // ignore
      }
    });
    this.activeSources.clear();
    this.nextStartTime = 0;
    this.isTeacherSpeaking = false;
    this.bargeInConsecutiveFrames = 0;
    clearTimeout(this.teacherSpeechTimeout);
  }

  /**
   * Real-time audio output amplitude (0.0 to 1.0) of AI teacher voice playback.
   * Driven directly by Web Audio AnalyserNode frequency analysis on actual playback.
   * Returns 0 immediately when audio playback stops, ends, or is interrupted.
   */
  public getTeacherAudioOutputLevel(): number {
    if (
      !this.outputAnalyserNode ||
      !this.isTeacherSpeaking ||
      this.activeSources.size === 0
    ) {
      return 0;
    }
    const dataArray = new Uint8Array(this.outputAnalyserNode.frequencyBinCount);
    this.outputAnalyserNode.getByteFrequencyData(dataArray);

    // Human vocal range frequency bins (typically 150Hz - 3400Hz, first 36 bins at 24kHz)
    let sum = 0;
    const count = Math.min(dataArray.length, 36);
    for (let i = 2; i < count; i++) {
      sum += dataArray[i];
    }
    const avg = sum / (count - 2);
    // Scale smoothly to 0.0 - 1.0 speech amplitude envelope
    const normalized = Math.min(1.0, Math.max(0, (avg - 12) / 88));
    return normalized;
  }

  /**
   * User explicitly tapped "Tap to Interrupt"
   */
  public interrupt() {
    this.stopAudioPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
    this.setState('listening');
  }

  /**
   * Toggle or set microphone mute state
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted;
      });
    }
  }

  /**
   * Send text message via overlay transcript input
   */
  public sendTextMessage(text: string) {
    const clean = text.trim();
    if (!clean || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.stopAudioPlayback();
    this.ws.send(
      JSON.stringify({
        type: 'text',
        text: clean,
      })
    );
  }

  /**
   * Cleanly terminate voice call
   */
  public endCall() {
    this.stopAudioPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'close' }));
      this.ws.close();
    }
    this.cleanup();
    this.setState('idle');
  }

  private cleanup() {
    if (this.processorNode) {
      try {
        this.processorNode.disconnect();
      } catch {}
      this.processorNode = null;
    }
    if (this.voiceFilter) {
      try {
        this.voiceFilter.disconnect();
      } catch {}
      this.voiceFilter = null;
    }
    if (this.lowpassFilter) {
      try {
        this.lowpassFilter.disconnect();
      } catch {}
      this.lowpassFilter = null;
    }
    if (this.compressorNode) {
      try {
        this.compressorNode.disconnect();
      } catch {}
      this.compressorNode = null;
    }
    if (this.highpassFilter) {
      try {
        this.highpassFilter.disconnect();
      } catch {}
      this.highpassFilter = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioCtx) {
      try {
        this.inputAudioCtx.close();
      } catch {}
      this.inputAudioCtx = null;
    }
    if (this.outputGainNode) {
      try {
        this.outputGainNode.disconnect();
      } catch {}
      this.outputGainNode = null;
    }
    if (this.outputAnalyserNode) {
      try {
        this.outputAnalyserNode.disconnect();
      } catch {}
      this.outputAnalyserNode = null;
    }
    if (this.outputAudioCtx) {
      try {
        this.outputAudioCtx.close();
      } catch {}
      this.outputAudioCtx = null;
    }
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch {}
      this.ws = null;
    }
    this.isTeacherSpeaking = false;
    this.nextStartTime = 0;
    this.activeSources.clear();
    clearTimeout(this.teacherSpeechTimeout);
  }

  // --- Audio Utility Converters ---

  private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
    }
    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToAudioBuffer(ctx: AudioContext, base64: string): AudioBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }
    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);
    return audioBuffer;
  }
}

export const geminiLiveService = new GeminiLiveService();
