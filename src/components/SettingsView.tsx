import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  Trash2,
  Moon,
  Sun,
  Sparkles,
  Gauge,
  Check,
  Activity,
  Wrench,
  Mic,
} from 'lucide-react';
import { AppSettings, DifficultyLevel } from '../types/learning';
import { ttsService } from '../services/ttsService';
import { AudioDiagnosticModal } from './AudioDiagnosticModal';
import { voiceDiagnostics } from '../services/voiceDiagnostics';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onClearAudioHistory: () => void;
  audioHistoryCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearAudioHistory,
  audioHistoryCount,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);
  const [showAudioDiagnostics, setShowAudioDiagnostics] = useState<boolean>(false);

  useEffect(() => {
    const unsub = ttsService.subscribeState((speaking) => {
      setIsPlayingTest(speaking);
    });
    return unsub;
  }, []);

  const handleGenderToggle = (gender: 'Male' | 'Female') => {
    if (gender === 'Male') {
      onUpdateSettings({
        voiceGender: 'Male',
        aiVoiceName: 'Puck', // Default male voice
      });
    } else {
      onUpdateSettings({
        voiceGender: 'Female',
        aiVoiceName: 'Kore', // Default female voice
      });
    }
  };

  const handleVoicePersonaChange = (voice: AppSettings['aiVoiceName']) => {
    const isMale = ['Puck', 'Charon', 'Fenrir'].includes(voice);
    onUpdateSettings({
      aiVoiceName: voice,
      voiceGender: isMale ? 'Male' : 'Female',
    });
  };

  const testHindiSpeech = () => {
    const text =
      settings.voiceGender === 'Male'
        ? 'नमस्ते! मैं आपका AI English Teacher हूँ। आज हम पूरे आत्मविश्वास के साथ English बोलना सीखेंगे।'
        : 'नमस्ते! मैं आपकी AI English Teacher हूँ। आज हम मिलकर आपकी English vocabulary और उच्चारण को बेहतर बनाएंगे।';
    ttsService.speak(text, settings);
  };

  const testEnglishSpeech = () => {
    const text =
      settings.voiceGender === 'Male'
        ? 'Hello! I am your AI English Teacher. Practice speaking with me every day to become fluent.'
        : 'Hello! I am your AI English Teacher. Let us practice English pronunciation and sentences together.';
    ttsService.speak(text, settings);
  };

  const stopAudio = () => {
    ttsService.stop();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Top Header with Dark/Light Mode */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Voice & Curriculum Preferences
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
              AI Teacher & Voice Settings
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors ${
              settings.darkMode
                ? 'bg-slate-800 text-amber-300 border border-slate-700'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            {settings.darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-8 pt-6">
          {/* Difficulty Level Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-base text-slate-900 dark:text-white">
                Difficulty Level (सिखाने का स्तर)
              </label>
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Active: {settings.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              अपनी सुविधा के अनुसार स्तर चुनें। यह स्तर सवालों की जटिलता और वाक्यों की लंबाई तय करता है।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  level: DifficultyLevel.BEGINNER,
                  title: 'BEGINNER (शुरुआती)',
                  desc: 'सरल दैनिक वाक्य · पूरा हिंदी सहारा · आसान शब्दावली',
                },
                {
                  level: DifficultyLevel.INTERMEDIATE,
                  title: 'INTERMEDIATE (मध्यम)',
                  desc: 'व्यावहारिक बातचीत · संतुलित हिंदी और English · पूरे वाक्य',
                },
                {
                  level: DifficultyLevel.ADVANCED,
                  title: 'ADVANCED (उन्नत)',
                  desc: 'अधिकतर English · तेज़ गति · उन्नत व्याकरण व शब्दावली',
                },
              ].map((item) => {
                const active = settings.difficulty === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => onUpdateSettings({ difficulty: item.level })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      {active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Ratio Slider */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="hindi-ratio-slider" className="font-semibold text-base text-slate-900 dark:text-white">
                Hindi / English Explanation Ratio
              </label>
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {settings.hindiExplanationRatio}% Hindi · {100 - settings.hindiExplanationRatio}% English
              </span>
            </div>
            <input
              id="hindi-ratio-slider"
              type="range"
              min={20}
              max={90}
              step={10}
              value={settings.hindiExplanationRatio}
              onChange={(e) => onUpdateSettings({ hindiExplanationRatio: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>More English (कम हिंदी)</span>
              <span>Balanced (संतुलित)</span>
              <span>More Hindi (अधिक हिंदी)</span>
            </div>
          </div>

          {/* Voice Gender & Engine Selection */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div>
              <label className="block font-semibold text-base text-slate-900 dark:text-white mb-2">
                Voice Gender (आवाज़: Male / Female)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                पुरुष (Male) या महिला (Female) आवाज़ चुनें:
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleGenderToggle('Male')}
                  className={`min-h-[50px] px-5 py-3 rounded-2xl text-sm font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    settings.voiceGender === 'Male'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Male Voice (पुरुष आवाज़)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderToggle('Female')}
                  className={`min-h-[50px] px-5 py-3 rounded-2xl text-sm font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    settings.voiceGender === 'Female'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Female Voice (महिला आवाज़)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Voice Persona Dropdown */}
              <div>
                <label className="block font-semibold text-sm text-slate-900 dark:text-white mb-1">
                  AI Teacher Voice Persona
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  वर्तमान आवाज़: <strong className="text-indigo-600 dark:text-indigo-400">{settings.aiVoiceName}</strong> ({settings.voiceGender})
                </p>
                <select
                  value={settings.aiVoiceName}
                  onChange={(e) => handleVoicePersonaChange(e.target.value as AppSettings['aiVoiceName'])}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                >
                  <optgroup label="Male Voices (पुरुष आवाज़ें)">
                    <option value="Puck">Puck (Male · Energetic & Friendly Teacher)</option>
                    <option value="Charon">Charon (Male · Deep & Patient Teacher)</option>
                    <option value="Fenrir">Fenrir (Male · Authoritative & Clear)</option>
                  </optgroup>
                  <optgroup label="Female Voices (महिला आवाज़ें)">
                    <option value="Kore">Kore (Female · Warm & Encouraging Teacher)</option>
                    <option value="Zephyr">Zephyr (Female · Soft & Conversational)</option>
                  </optgroup>
                </select>
              </div>

              {/* TTS Provider & Speed */}
              <div>
                <label className="block font-semibold text-sm text-slate-900 dark:text-white mb-1">
                  Voice Engine & Speed
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  आवाज़ का प्रकार और बोलने की गति:
                </p>
                <div className="flex items-center gap-2">
                  <select
                    value={settings.ttsProvider}
                    onChange={(e) => onUpdateSettings({ ttsProvider: e.target.value as AppSettings['ttsProvider'] })}
                    className="flex-1 min-h-[46px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="gemini-tts">AI Voice (Gemini Natural)</option>
                    <option value="browser-speech">Device Voice (System TTS)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        speakingSpeed: settings.speakingSpeed === 'normal' ? 'slow' : 'normal',
                      })
                    }
                    className="min-h-[46px] px-4 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 cursor-pointer whitespace-nowrap"
                  >
                    Speed: {settings.speakingSpeed === 'slow' ? 'Slow (0.8x)' : 'Normal (1.0x)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Test AI Voice Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="font-semibold text-sm text-slate-900 dark:text-white block">
                  Test Current Teacher Voice
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  सुनें कि चुनी गई आवाज़ ({settings.voiceGender} - {settings.aiVoiceName}) कैसी सुनाई देती है:
                </span>
              </div>
              {isPlayingTest && (
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Playing Voice...</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={testHindiSpeech}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Test Hindi Speech (हिंदी आवाज़)</span>
              </button>

              <button
                type="button"
                onClick={testEnglishSpeech}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Test English Speech (English आवाज़)</span>
              </button>

              {isPlayingTest && (
                <button
                  type="button"
                  onClick={stopAudio}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-900"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Audio</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio & Speech Diagnostics Hub */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Audio & Voice Diagnostics Center</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  माइक अनुमति, आवाज़ और स्पीच रिकग्निशन के लाइव लॉग्स व 3-सेकंड इको टेस्ट
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAudioDiagnostics(true)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Open Audio Diagnostics</span>
              </button>
            </div>
          </div>

          {/* Audio History Storage */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Preserve Spoken Audio Recordings</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ({audioHistoryCount} audio clips stored in browser memory)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ saveAudioHistory: !settings.saveAudioHistory })}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  settings.saveAudioHistory
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {settings.saveAudioHistory ? 'Storage: ON' : 'Storage: OFF'}
              </button>

              {audioHistoryCount > 0 && (
                <button
                  type="button"
                  onClick={onClearAudioHistory}
                  className="min-h-[40px] px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AudioDiagnosticModal
        isOpen={showAudioDiagnostics}
        onClose={() => setShowAudioDiagnostics(false)}
      />
    </div>
  );
};
