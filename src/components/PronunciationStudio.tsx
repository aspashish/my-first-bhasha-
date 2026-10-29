import React, { useEffect, useMemo, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Gauge,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Keyboard,
  RefreshCw,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Wrench,
} from 'lucide-react';
import {
  AppSettings,
  PronunciationCheckResult,
  VocabularyWord,
} from '../types/learning';
import { ttsService } from '../services/ttsService';
import { speechRecorder } from '../services/sttService';
import { AudioDiagnosticModal } from './AudioDiagnosticModal';
import {
  analyzePronunciation,
  generateWordExamples,
  WordExampleItem,
} from '../services/aiService';
import {
  createEnrichedWordFallback,
  isTemplatedOrBrokenSentence,
} from '../data/seedVocabulary';

interface PronunciationStudioProps {
  words: VocabularyWord[];
  initialSelectedWord?: VocabularyWord | null;
  settings: AppSettings;
  onRecordPronunciationScore: (wordId: string, score: number) => void;
  onUpdateWord?: (word: VocabularyWord) => void;
}

export type PracticeTabType = 'word' | 'daily' | 'conversation' | 'question' | 'ai-custom';

export const PronunciationStudio: React.FC<PronunciationStudioProps> = ({
  words,
  initialSelectedWord,
  settings,
  onRecordPronunciationScore,
  onUpdateWord,
}) => {
  const [selectedWordState, setSelectedWordState] = useState<VocabularyWord>(
    initialSelectedWord || words[0]
  );
  const [practiceTab, setPracticeTab] = useState<PracticeTabType>('word');
  const [customAiSentence, setCustomAiSentence] = useState<{
    english: string;
    hindiTranslation: string;
  } | null>(null);
  const [isGeneratingAiExample, setIsGeneratingAiExample] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [result, setResult] = useState<PronunciationCheckResult | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | undefined>(undefined);
  const [micError, setMicError] = useState<string>('');
  const [showManualTestInput, setShowManualTestInput] = useState<boolean>(false);
  const [showAudioDiagnostics, setShowAudioDiagnostics] = useState<boolean>(false);

  // Sync if initialSelectedWord changes from external navigation
  useEffect(() => {
    if (initialSelectedWord) {
      setSelectedWordState(initialSelectedWord);
      setCustomAiSentence(null);
      setResult(null);
      setSpokenText('');
    }
  }, [initialSelectedWord]);

  // Clean and upgrade word sentences so canned/broken templates never appear
  const selectedWord = useMemo(() => {
    const raw = selectedWordState || words[0];
    if (!raw) return null;

    const needsUpgrade =
      isTemplatedOrBrokenSentence(raw.simpleSentence, raw.word) ||
      isTemplatedOrBrokenSentence(raw.realLifeSentence, raw.word) ||
      isTemplatedOrBrokenSentence(raw.questionPromptEn, raw.word);

    if (needsUpgrade) {
      const fresh = createEnrichedWordFallback(raw.word, raw.index || 1);
      const upgraded: VocabularyWord = {
        ...raw,
        simpleSentence: fresh.simpleSentence,
        realLifeSentence: fresh.realLifeSentence,
        questionPromptEn: fresh.questionPromptEn,
        phoneticHindi: raw.phoneticHindi && !raw.phoneticHindi.includes('व्यावहारिक') ? raw.phoneticHindi : fresh.phoneticHindi,
        hindiMeaning: raw.hindiMeaning && !raw.hindiMeaning.includes('व्यावहारिक') ? raw.hindiMeaning : fresh.hindiMeaning,
        pronunciationTipHindi: fresh.pronunciationTipHindi || raw.pronunciationTipHindi,
        usageExplanationHindi: fresh.usageExplanationHindi || raw.usageExplanationHindi,
      };
      if (onUpdateWord) {
        onUpdateWord(upgraded);
      }
      return upgraded;
    }
    return raw;
  }, [selectedWordState, words, onUpdateWord]);

  if (!selectedWord) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
        <p className="text-base text-slate-600 dark:text-slate-400">
          कृपया पहले अपने English words लोड करें।
        </p>
      </div>
    );
  }

  // Determine current active text to pronounce & its Hindi explanation
  let targetText = selectedWord.word;
  let targetHindiMeaning = selectedWord.hindiMeaning;
  let targetDescription = 'Single Word Practice';

  if (practiceTab === 'daily') {
    targetText = selectedWord.simpleSentence;
    targetHindiMeaning = `दैनिक वाक्य: "${selectedWord.word}" का स्वाभाविक प्रयोग`;
    targetDescription = 'Everyday Daily Sentence';
  } else if (practiceTab === 'conversation') {
    targetText = selectedWord.realLifeSentence;
    targetHindiMeaning = `बातचीत / अनुरोध: "${selectedWord.word}" का व्यावहारिक वाक्य`;
    targetDescription = 'Real-life Conversation';
  } else if (practiceTab === 'question') {
    targetText = selectedWord.questionPromptEn;
    targetHindiMeaning = `सवाल पूछना: "${selectedWord.word}" का संवादात्मक प्रयोग`;
    targetDescription = 'Practical Question';
  } else if (practiceTab === 'ai-custom' && customAiSentence) {
    targetText = customAiSentence.english;
    targetHindiMeaning = customAiSentence.hindiTranslation;
    targetDescription = 'Fresh AI Example';
  }

  const handleSelectWord = (w: VocabularyWord) => {
    setSelectedWordState(w);
    setPracticeTab('word');
    setCustomAiSentence(null);
    setResult(null);
    setSpokenText('');
    setRecordedAudioUrl(undefined);
    setMicError('');
  };

  const handleGenerateFreshSentence = async () => {
    setIsGeneratingAiExample(true);
    setMicError('');
    try {
      const examples = await generateWordExamples(
        selectedWord.word,
        selectedWord.hindiMeaning,
        settings.difficulty
      );
      if (examples && examples.length > 0) {
        // Pick one or cycle through
        const picked = examples[Math.floor(Math.random() * examples.length)];
        setCustomAiSentence({
          english: picked.english,
          hindiTranslation: picked.hindiTranslation,
        });
        setPracticeTab('ai-custom');
        setResult(null);
        setSpokenText('');

        // Also notify parent if updating word data
        if (onUpdateWord) {
          onUpdateWord({
            ...selectedWord,
            simpleSentence: picked.english,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to generate dynamic example:', err);
    } finally {
      setIsGeneratingAiExample(false);
    }
  };

  const handleToggleRecord = async () => {
    setMicError('');
    if (isRecording) {
      setIsRecording(false);
      setMicVolume(0);
      setIsAnalyzing(true);
      const sttRes = await speechRecorder.stop(
        settings.sttProvider === 'gemini-transcribe'
      );
      setRecordedAudioUrl(sttRes.audioDataUrl);

      const transcriptToCheck = (sttRes.transcript || spokenText || '').trim();
      setSpokenText(transcriptToCheck);

      if (!transcriptToCheck) {
        setIsAnalyzing(false);
        setMicError('आवाज़ स्पष्ट सुनाई नहीं दी (No speech detected)। कृपया माइक के पास बोलें या नीचे दिए गए टेक्स्ट बॉक्स से उच्चारण चेक करें।');
        setShowManualTestInput(true);
        return;
      }

      const analysis = await analyzePronunciation(
        selectedWord,
        targetText,
        transcriptToCheck,
        sttRes.audioBase64,
        sttRes.mimeType
      );
      setResult(analysis);
      setIsAnalyzing(false);
      onRecordPronunciationScore(selectedWord.id, analysis.score);

      if (settings.autoPlayTeacherVoice && analysis.feedbackHindi) {
        ttsService.speak(analysis.feedbackHindi, settings);
      }
    } else {
      ttsService.stop();
      setResult(null);
      const started = await speechRecorder.start(
        (interim) => setSpokenText(interim),
        (err) => {
          setMicError(err);
          setIsRecording(false);
          setMicVolume(0);
          setShowManualTestInput(true);
        },
        (vol) => setMicVolume(vol)
      );
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const handleManualPronunciationCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spokenText.trim()) return;
    setIsAnalyzing(true);
    const analysis = await analyzePronunciation(
      selectedWord,
      targetText,
      spokenText
    );
    setResult(analysis);
    setIsAnalyzing(false);
    onRecordPronunciationScore(selectedWord.id, analysis.score);
    if (settings.autoPlayTeacherVoice && analysis.feedbackHindi) {
      ttsService.speak(analysis.feedbackHindi, settings);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Word List */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
            Select Word to Practice
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
            {words.length} Words
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          किसी भी शब्द पर क्लिक करें — उसका सही उच्चारण और अलग-अलग वाक्य तुरंत बदल जाएंगे।
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto pr-1">
          {words.map((w, idx) => {
            const isSelected = w.id === selectedWord.id || w.word.toLowerCase() === selectedWord.word.toLowerCase();
            return (
              <button
                key={w.id || idx}
                type="button"
                onClick={() => handleSelectWord(w)}
                className={`w-full py-3 px-3 text-left flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm capitalize truncate flex items-center gap-1.5">
                    <span>{idx + 1}. {w.word}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {w.phoneticHindi} · {w.hindiMeaning}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 ml-2 font-mono">
                  {w.status || 'NEW'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Pronunciation Practice Studio */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Header & Modes */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              Active Word: &ldquo;{selectedWord.word}&rdquo; ({selectedWord.phoneticHindi})
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
              Speak Clearly & Practice Sentences
            </h1>
          </div>

          <button
            type="button"
            onClick={handleGenerateFreshSentence}
            disabled={isGeneratingAiExample}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:shadow-sm transition-all"
          >
            {isGeneratingAiExample ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>{isGeneratingAiExample ? 'Generating...' : '✨ New AI Sentence'}</span>
          </button>
        </div>

        {/* Practice Tabs Selector */}
        <div className="pt-4 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPracticeTab('word');
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                practiceTab === 'word'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Word: {selectedWord.word}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeTab('daily');
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                practiceTab === 'daily'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>1. Daily Sentence</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeTab('conversation');
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                practiceTab === 'conversation'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>2. Conversation Sentence</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeTab('question');
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                practiceTab === 'question'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>3. Question Sentence</span>
            </button>

            {customAiSentence && (
              <button
                type="button"
                onClick={() => {
                  setPracticeTab('ai-custom');
                  setResult(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  practiceTab === 'ai-custom'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Custom Example</span>
              </button>
            )}
          </div>
        </div>

        {/* Central Display Card */}
        <div className="py-6 px-4 md:px-6 my-4 rounded-3xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
              {targetDescription}
            </span>
          </div>

          <div className="font-serif text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            &ldquo;{targetText}&rdquo;
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium pt-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              हिंदी उच्चारण: {selectedWord.phoneticHindi}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>{targetHindiMeaning}</span>
          </div>

          {selectedWord.pronunciationTipHindi && (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto pt-1 leading-relaxed">
              💡 <strong>उच्चारण टिप:</strong> {selectedWord.pronunciationTipHindi}
            </p>
          )}

          {/* Sound Listen Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => ttsService.speak(targetText, settings, 'normal')}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Listen ({settings.voiceGender})</span>
            </button>

            <button
              type="button"
              onClick={() => ttsService.speak(targetText, settings, 'slow')}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer border border-amber-200/60 dark:border-amber-900/60"
            >
              <Gauge className="w-4 h-4 text-amber-600" />
              <span>Slow (0.8x गति)</span>
            </button>

            <button
              type="button"
              onClick={() => ttsService.speak(targetText, settings)}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAudioDiagnostics(true)}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60"
              title="Open Audio Diagnostics & Mic Test"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Voice Tools</span>
            </button>
          </div>
        </div>

        {/* Microphone Recording Action Area */}
        <div className="flex flex-col items-center justify-center py-4 border-t border-slate-100 dark:border-slate-800">
          {isRecording && (
            <div className="mb-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 h-8">
                {[0.4, 0.8, 1.2, 0.7, 1.0, 0.6, 0.9, 0.5].map((multiplier, i) => {
                  const height = Math.max(8, Math.min(32, Math.round(micVolume * multiplier * 0.4)));
                  return (
                    <div
                      key={i}
                      className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-pulse">
                🎙️ माइक चालू है... साफ़ आवाज़ में बोलिए (Recording voice...)
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isAnalyzing}
            className={`min-h-[64px] min-w-[260px] px-8 py-3.5 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6" />
                <span>Listening... Tap to Check</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Tap & Speak &ldquo;{targetText}&rdquo;</span>
              </>
            )}
          </button>

          {micError && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs max-w-lg mx-auto">
              <span className="text-amber-800 dark:text-amber-300 font-medium text-center sm:text-left">
                {micError}
              </span>
              <button
                type="button"
                onClick={() => setShowAudioDiagnostics(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Fix Mic / Audio Tools</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowManualTestInput(!showManualTestInput)}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1 underline cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{showManualTestInput ? 'Hide phonetic test input' : 'Simulate / Type spoken sound'}</span>
          </button>

          {showManualTestInput && (
            <form onSubmit={handleManualPronunciationCheck} className="mt-3 flex items-center gap-2 w-full max-w-md">
              <input
                type="text"
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                placeholder={`Speak or type "${targetText}"`}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                Analyze
              </button>
            </form>
          )}
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI आपके उच्चारण का विश्लेषण कर रहा है...</span>
          </div>
        )}

        {/* Pronunciation Feedback Card */}
        {result && (
          <div
            className={`mt-6 p-6 rounded-3xl border transition-all ${
              result.status === 'CORRECT'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                {result.status === 'CORRECT' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                )}
                <span className="font-semibold text-base text-slate-900 dark:text-white">
                  {result.status === 'CORRECT'
                    ? 'शानदार उच्चारण! (Great Job!)'
                    : 'अच्छा प्रयास, थोड़ा सुधार आवश्यक'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Score:</span>
                <span
                  className={`text-lg font-bold font-mono px-3 py-1 rounded-xl ${
                    result.score >= 80
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {result.score}/100
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                  आपने जो बोला (Recognized Audio):
                </div>
                <div className="font-medium text-slate-900 dark:text-white">
                  &ldquo;{spokenText || 'ध्वनि स्पष्ट नहीं मिली'}&rdquo;
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {result.feedbackHindi}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <span className="text-slate-400 block mb-0.5">English Syllables:</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                    {result.syllableBreakdownEn}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <span className="text-slate-400 block mb-0.5">हिंदी ध्वन्यात्मक:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {result.syllableBreakdownHi}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AudioDiagnosticModal
        isOpen={showAudioDiagnostics}
        onClose={() => setShowAudioDiagnostics(false)}
      />
    </div>
  );
};
