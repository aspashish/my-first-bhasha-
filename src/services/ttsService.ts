import { AppSettings, DifficultyLevel } from '../types/learning';
import { voiceDiagnostics } from './voiceDiagnostics';

export class ModularTTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenText: string = '';
  private isSpeaking: boolean = false;
  private onStateChangeListeners: Set<(speaking: boolean) => void> = new Set();
  private keepAliveTimer: any = null;
  private static quotaCooldownUntil: number = 0;

  public subscribeState(listener: (speaking: boolean) => void): () => void {
    this.onStateChangeListeners.add(listener);
    return () => this.onStateChangeListeners.delete(listener);
  }

  private notifyState(speaking: boolean): void {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stop(): void {
    voiceDiagnostics.log('TTS', 'info', 'Stopping current voice playback.');
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.currentUtterance = null;
    this.notifyState(false);
  }

  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }

  public static getQuotaCooldownRemainingSeconds(): number {
    return Math.max(0, Math.round((ModularTTSService.quotaCooldownUntil - Date.now()) / 1000));
  }

  public static isQuotaCooldownActive(): boolean {
    return Date.now() < ModularTTSService.quotaCooldownUntil;
  }

  public async speak(
    text: string,
    settings?: Partial<AppSettings>,
    overrideSpeed?: 'normal' | 'slow'
  ): Promise<void> {
    if (!text || !text.trim()) {
      voiceDiagnostics.log('TTS', 'warn', 'speak() called with empty text.');
      return;
    }
    this.stop();
    this.lastSpokenText = text;
    this.notifyState(true);

    const safeSettings: AppSettings = {
      ttsProvider: settings?.ttsProvider || 'gemini-tts',
      sttProvider: settings?.sttProvider || 'web-speech-plus-gemini',
      aiVoiceName: settings?.aiVoiceName || 'Kore',
      voiceGender: settings?.voiceGender || 'Female',
      speakingSpeed: settings?.speakingSpeed || 'normal',
      autoPlayTeacherVoice: settings?.autoPlayTeacherVoice ?? true,
      hindiExplanationRatio: settings?.hindiExplanationRatio ?? 0.5,
      difficulty: settings?.difficulty || DifficultyLevel.BEGINNER,
      saveAudioHistory: settings?.saveAudioHistory ?? true,
      darkMode: settings?.darkMode ?? false,
    };

    const speed = overrideSpeed || safeSettings.speakingSpeed;
    const isGeminiProvider = safeSettings.ttsProvider === 'gemini-tts';
    const isCoolingDown = Date.now() < ModularTTSService.quotaCooldownUntil;

    voiceDiagnostics.log('TTS', 'info', `Requested speak("${text.slice(0, 45)}...")`, {
      provider: safeSettings.ttsProvider,
      speed,
      voiceName: safeSettings.aiVoiceName,
      gender: safeSettings.voiceGender,
      isCoolingDown,
    });

    if (isGeminiProvider && !isCoolingDown) {
      try {
        voiceDiagnostics.log('API', 'info', 'Sending TTS request to /api/ai/tts...');
        const fetchStartTime = Date.now();
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            voiceName: safeSettings.aiVoiceName,
            voiceGender: safeSettings.voiceGender,
            speed,
          }),
        });

        const fetchDuration = Date.now() - fetchStartTime;

        if (res.ok) {
          const data = await res.json();

          if (data.quotaExceeded) {
            ModularTTSService.quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
            voiceDiagnostics.setServerTtsCooldown(ModularTTSService.quotaCooldownUntil);
            voiceDiagnostics.log(
              'TTS',
              'warn',
              `Gemini TTS returned quotaExceeded (${fetchDuration}ms). Auto-switching to device speech synthesis.`
            );
          }

          if (data.audioBase64) {
            voiceDiagnostics.log(
              'AUDIO_PLAY',
              'info',
              `TTS audio received (${data.audioBase64.length} chars, ${fetchDuration}ms). Initializing audio playback...`
            );
            const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
            audio.playbackRate = speed === 'slow' ? 0.8 : 1.0;
            this.currentAudio = audio;

            audio.onended = () => {
              voiceDiagnostics.log('AUDIO_PLAY', 'success', 'Audio playback finished.');
              this.currentAudio = null;
              this.notifyState(false);
            };
            audio.onerror = (e) => {
              voiceDiagnostics.log('AUDIO_PLAY', 'error', 'Audio element playback error event fired.', e);
              this.currentAudio = null;
              this.notifyState(false);
            };

            try {
              await audio.play();
              voiceDiagnostics.log('AUDIO_PLAY', 'success', 'Audio playback started successfully.');
              return;
            } catch (playErr: any) {
              voiceDiagnostics.log(
                'AUDIO_PLAY',
                'warn',
                `audio.play() was prevented by browser policy (${playErr?.name || playErr?.message}). Falling back to SpeechSynthesis.`,
                playErr
              );
              // Audio element play failed (e.g. autoplay restriction), fallback immediately
            }
          }
        } else if (res.status === 429) {
          ModularTTSService.quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
          voiceDiagnostics.setServerTtsCooldown(ModularTTSService.quotaCooldownUntil);
          voiceDiagnostics.log(
            'TTS',
            'warn',
            `TTS endpoint returned 429 Quota Exceeded (${fetchDuration}ms). Falling back to browser speech synthesis.`
          );
        } else {
          voiceDiagnostics.log(
            'API',
            'warn',
            `TTS endpoint returned status ${res.status} (${fetchDuration}ms). Falling back to browser synthesis.`
          );
        }
      } catch (err: any) {
        voiceDiagnostics.log(
          'API',
          'error',
          `Network/Fetch error in /api/ai/tts: ${err?.message}. Falling back to browser synthesis.`,
          err
        );
      }
    } else if (isCoolingDown) {
      voiceDiagnostics.log(
        'TTS',
        'info',
        `TTS quota cooldown active (${ModularTTSService.getQuotaCooldownRemainingSeconds()}s remaining). Using high-fidelity browser speech synthesis.`
      );
    }

    // Fallback smoothly to browser speech synthesis
    this.speakWithBrowserSynthesis(text, safeSettings, speed);
  }

  private speakWithBrowserSynthesis(
    text: string,
    settings: AppSettings,
    speed: 'normal' | 'slow'
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      voiceDiagnostics.log('TTS', 'error', 'SpeechSynthesis is not available in window.');
      this.notifyState(false);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch (cancelErr) {
      voiceDiagnostics.log('TTS', 'warn', 'Error while resetting speechSynthesis:', cancelErr);
    }

    const loadAndSpeak = () => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        // Retain instance reference on class to avoid Chrome garbage collection bug
        this.currentUtterance = utterance;

        const voices = window.speechSynthesis.getVoices();
        const hasDevanagari = /[\u0900-\u097F]/.test(text);
        const isMale = settings.voiceGender === 'Male';

        let chosenVoice: SpeechSynthesisVoice | undefined;

        if (hasDevanagari) {
          // Find Hindi voices
          const hindiVoices = voices.filter(
            (v) => v.lang.startsWith('hi') || /hindi/i.test(v.name)
          );

          if (isMale) {
            chosenVoice =
              hindiVoices.find((v) => /male|madhav|hemant|ravi|rishi|amit|neel/i.test(v.name)) ||
              hindiVoices.find((v) => !/female|kalpana|swara|priya|zira|lekha/i.test(v.name)) ||
              hindiVoices[0];
          } else {
            chosenVoice =
              hindiVoices.find((v) => /female|kalpana|swara|priya|zira|lekha/i.test(v.name)) ||
              hindiVoices[0];
          }

          if (!chosenVoice) {
            chosenVoice = voices.find((v) => v.lang === 'en-IN') || voices[0];
          }
          utterance.lang = 'hi-IN';
        } else {
          // English voices
          const englishVoices = voices.filter(
            (v) => v.lang.startsWith('en') || v.lang === 'en-IN' || v.lang === 'en-US'
          );

          if (isMale) {
            chosenVoice =
              englishVoices.find((v) => /male|david|mark|george|alex|daniel|guy|rishi|tom/i.test(v.name)) ||
              englishVoices.find((v) => !/female|zira|samantha|karen|veena|priya|heera|catherine/i.test(v.name)) ||
              englishVoices[0];
          } else {
            chosenVoice =
              englishVoices.find((v) => /female|zira|samantha|karen|veena|priya|heera|catherine/i.test(v.name)) ||
              englishVoices[0];
          }
          utterance.lang = 'en-US';
        }

        if (chosenVoice) {
          utterance.voice = chosenVoice;
          voiceDiagnostics.log('TTS', 'info', `Using browser voice: "${chosenVoice.name}" (${chosenVoice.lang})`);
        } else {
          voiceDiagnostics.log('TTS', 'warn', 'No specific voice matched; using default browser voice.');
        }

        utterance.rate = speed === 'slow' ? 0.72 : 0.95;
        utterance.pitch = isMale ? 0.75 : 1.15;

        utterance.onstart = () => {
          voiceDiagnostics.log('TTS', 'success', 'Browser speech synthesis started speaking.');
          if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
          // Chrome SpeechSynthesis keep-alive: pause & resume briefly every 8s prevents 15s freeze
          this.keepAliveTimer = setInterval(() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 8000);
        };

        utterance.onend = () => {
          voiceDiagnostics.log('TTS', 'success', 'Browser speech synthesis completed.');
          if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
          this.currentUtterance = null;
          this.notifyState(false);
        };

        utterance.onerror = (e) => {
          if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
          if (e.error === 'interrupted' || e.error === 'canceled') {
            voiceDiagnostics.log('TTS', 'info', `Browser speech synthesis stopped or superseded as requested (${e.error}).`);
          } else {
            voiceDiagnostics.log('TTS', 'warn', `Browser speech synthesis event: ${e.error}`, e);
          }
          this.currentUtterance = null;
          this.notifyState(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err: any) {
        voiceDiagnostics.log('TTS', 'warn', `Exception in speakWithBrowserSynthesis: ${err?.message}`, err);
        this.currentUtterance = null;
        this.notifyState(false);
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadAndSpeak();
    } else {
      voiceDiagnostics.log('TTS', 'info', 'Voices not loaded yet; waiting for onvoiceschanged...');
      window.speechSynthesis.onvoiceschanged = () => {
        loadAndSpeak();
      };
      setTimeout(loadAndSpeak, 150);
    }
  }
}

export const ttsService = new ModularTTSService();
