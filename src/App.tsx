import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  Mic,
  Calendar,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Activity,
  Sparkles,
  Clock,
  Headphones,
} from 'lucide-react';
import {
  ActiveTab,
  AnswerEvaluation,
  AppSettings,
  AudioHistoryEntry,
  DifficultyLevel,
  LearnerMemory,
  VocabCategory,
  VocabularyWord,
  WordMasteryStatus,
} from './types/learning';
import { getInitialSuppliedVocabulary } from './data/suppliedVocabulary';
import {
  createEnrichedWordFallback,
  isTemplatedOrBrokenSentence,
} from './data/seedVocabulary';
import {
  buildVocabularyWordFromParsed,
  parseFlexibleVocabularyInput,
} from './services/vocabParser';
import { enrichVocabularyBatch } from './services/aiService';
import { updateWordSpacedRepetition } from './services/spacedRepetition';
import { OnboardingFlow } from './components/OnboardingFlow';
import { VocabularyImportManager } from './components/VocabularyImportManager';
import { AITeacherConversation } from './components/AITeacherConversation';
import { DailyPracticeSession } from './components/DailyPracticeSession';
import { TenDayCourseView } from './components/TenDayCourseView';
import { TutorAvatar } from './components/TutorAvatar';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SettingsView } from './components/SettingsView';
import { AudioDiagnosticModal } from './components/AudioDiagnosticModal';
import { SentenceBuilder } from './components/SentenceBuilder';
import { FiveTensesPractice } from './components/FiveTensesPractice';
import { ListeningShadowingStudio } from './components/ListeningShadowingStudio';

const STORAGE_KEYS = {
  WORDS_V2: 'bhashaguru_vocab_v2',
  WORDS: 'bhashaguru_vocab_v1',
  SETTINGS: 'bhashaguru_settings_v1',
  MEMORY: 'bhashaguru_memory_v1',
  AUDIO_HISTORY: 'bhashaguru_audio_history_v1',
  ONBOARDED: 'bhashaguru_onboarded_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  ttsProvider: 'gemini-tts',
  sttProvider: 'web-speech-plus-gemini',
  aiVoiceName: 'Kore',
  voiceGender: 'Female',
  speakingSpeed: 'normal',
  autoPlayTeacherVoice: true,
  hindiExplanationRatio: 70,
  difficulty: DifficultyLevel.BEGINNER,
  saveAudioHistory: false,
  darkMode: true,
};

const DEFAULT_MEMORY: LearnerMemory = {
  streakDays: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  totalQuestionsAnswered: 8,
  totalCorrectAnswers: 7,
  accuracyHistory: [84],
  pronunciationScores: [78, 82],
  grammarScores: [81, 85],
  speakingScores: [79, 84],
  commonGrammarMistakes: [
    'Past tense after "yesterday" (went instead of go)',
    'Using "borrow" instead of "take" for temporary items',
  ],
  pronunciationDifficulties: ['beautiful', 'environment'],
};

export default function App() {
  const [words, setWords] = useState<VocabularyWord[]>(() => {
    try {
      const initialSupplied = getInitialSuppliedVocabulary();
      const savedV2 = localStorage.getItem(STORAGE_KEYS.WORDS_V2);
      const savedV1 = localStorage.getItem(STORAGE_KEYS.WORDS);
      const savedRaw = savedV2 || savedV1;

      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Build map of user progress, categories, edits, and scores
          const userProgressMap = new Map<string, Partial<VocabularyWord>>();
          parsed.forEach((w: VocabularyWord) => {
            if (!w) return;
            let cat = w.category;
            if (!cat) {
              if (w.status === WordMasteryStatus.MASTERED) cat = 'mastered';
              else if (w.status === WordMasteryStatus.NEEDS_PRACTICE) cat = 'confusion';
              else cat = 'to_learn';
            }
            const progressData: Partial<VocabularyWord> = {
              category: cat,
              status: w.status,
              speakingCorrectCount: w.speakingCorrectCount,
              attempts: w.attempts,
              correctCount: w.correctCount,
              wrongCount: w.wrongCount,
              lastPracticedAt: w.lastPracticedAt,
              nextReviewAt: w.nextReviewAt,
              easeFactor: w.easeFactor,
              intervalDays: w.intervalDays,
              hindiMeaning: w.hindiMeaning,
              phoneticHindi: w.phoneticHindi,
            };
            if (w.id) userProgressMap.set(w.id, progressData);
            if (w.word) userProgressMap.set(w.word.toLowerCase().trim(), progressData);
          });

          // 1. Ensure all 654 foundational words are ALWAYS present and ordered correctly
          const baseMap = new Set<string>();
          const merged: VocabularyWord[] = initialSupplied.map((item, idx) => {
            baseMap.add(item.word.toLowerCase().trim());
            const saved =
              userProgressMap.get(item.id) ||
              userProgressMap.get(item.word.toLowerCase().trim());
            if (saved) {
              return {
                ...item,
                index: idx + 1,
                category: saved.category || item.category,
                status: saved.status || item.status,
                speakingCorrectCount:
                  saved.speakingCorrectCount ?? item.speakingCorrectCount,
                attempts: saved.attempts ?? item.attempts,
                correctCount: saved.correctCount ?? item.correctCount,
                wrongCount: saved.wrongCount ?? item.wrongCount,
                lastPracticedAt: saved.lastPracticedAt ?? item.lastPracticedAt,
                nextReviewAt: saved.nextReviewAt ?? item.nextReviewAt,
                easeFactor: saved.easeFactor ?? item.easeFactor,
                intervalDays: saved.intervalDays ?? item.intervalDays,
                hindiMeaning: saved.hindiMeaning || item.hindiMeaning,
                phoneticHindi: saved.phoneticHindi || item.phoneticHindi,
              };
            }
            return {
              ...item,
              index: idx + 1,
            };
          });

          // 2. If the user previously imported custom words that are not part of the 654 list (and not the 10 demo sample words), preserve them
          const DEMO_WORDS = new Set(['borrow', 'careful', 'discover', 'experience']);
          const customUserWords: VocabularyWord[] = [];
          parsed.forEach((w: VocabularyWord) => {
            if (w && w.word) {
              const clean = w.word.toLowerCase().trim();
              if (!baseMap.has(clean) && !DEMO_WORDS.has(clean)) {
                baseMap.add(clean);
                customUserWords.push({
                  ...w,
                  index: merged.length + customUserWords.length + 1,
                });
              }
            }
          });

          const finalList = [...merged, ...customUserWords];

          // Store back to both storage keys to guarantee consistency
          try {
            localStorage.setItem(STORAGE_KEYS.WORDS_V2, JSON.stringify(finalList));
            localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(finalList));
          } catch {}

          return finalList;
        }
      }

      // No saved words found, initialize with complete 654 vocabulary
      try {
        localStorage.setItem(
          STORAGE_KEYS.WORDS_V2,
          JSON.stringify(initialSupplied)
        );
        localStorage.setItem(
          STORAGE_KEYS.WORDS,
          JSON.stringify(initialSupplied)
        );
      } catch {}
      return initialSupplied;
    } catch {
      return getInitialSuppliedVocabulary();
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [memory, setMemory] = useState<LearnerMemory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORY);
      if (saved) return { ...DEFAULT_MEMORY, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_MEMORY;
  });

  const [audioHistory, setAudioHistory] = useState<AudioHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIO_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('words');
  const [isEnriching, setIsEnriching] = useState<boolean>(false);
  const [pronunciationTargetWord, setPronunciationTargetWord] =
    useState<VocabularyWord | null>(null);
  const [showGlobalAudioDiagnostics, setShowGlobalAudioDiagnostics] =
    useState<boolean>(false);
  const [teacherScenarioTopic, setTeacherScenarioTopic] =
    useState<string>('Open Fluency Coach');
  const [teacherStarterPrompt, setTeacherStarterPrompt] =
    useState<string>('');
  const [dailyViewMode, setDailyViewMode] =
    useState<'10day' | 'vocab' | 'sentence_builder' | 'tenses' | 'listening_shadowing'>('10day');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORDS_V2, JSON.stringify(words));
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    } catch {
      // ignore
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(memory));
    } catch {
      // ignore
    }
  }, [memory]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.AUDIO_HISTORY,
        JSON.stringify(audioHistory)
      );
    } catch {
      // ignore
    }
  }, [audioHistory]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleImportWords = async (rawText: string) => {
    const parsedItems = parseFlexibleVocabularyInput(rawText);
    if (parsedItems.length === 0) return;

    setIsEnriching(true);
    const englishWordStrings = parsedItems.map((p) => p.englishWord);
    const enrichedNew = await enrichVocabularyBatch(
      englishWordStrings,
      settings.difficulty
    );

    // Merge parsed meanings if user provided explicit Hindi meanings
    const enrichedWithUserHints = enrichedNew.map((w, idx) => {
      const orig =
        parsedItems.find(
          (p) => p.englishWord.toLowerCase() === w.word.toLowerCase()
        ) || parsedItems[idx];
      return {
        ...w,
        hindiMeaning: orig?.hindiMeaning || w.hindiMeaning,
        phoneticHindi: orig?.hindiPhonetic || w.phoneticHindi,
      };
    });

    setWords((prev) => {
      const existingMap = new Map<string, VocabularyWord>();
      for (const w of prev) {
        existingMap.set(w.word.toLowerCase(), w);
      }
      for (const nw of enrichedWithUserHints) {
        if (!existingMap.has(nw.word.toLowerCase())) {
          existingMap.set(nw.word.toLowerCase(), nw);
        } else {
          // If word existed, update with new hints if provided
          const prevWord = existingMap.get(nw.word.toLowerCase())!;
          existingMap.set(nw.word.toLowerCase(), {
            ...prevWord,
            hindiMeaning: nw.hindiMeaning || prevWord.hindiMeaning,
            phoneticHindi: nw.phoneticHindi || prevWord.phoneticHindi,
          });
        }
      }
      return Array.from(existingMap.values()).map((item, idx) => ({
        ...item,
        index: idx + 1,
      }));
    });
    setIsEnriching(false);
  };

  const handleOnboardingCreateLesson = async (rawText: string) => {
    await handleImportWords(rawText);
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  };

  const handleUpdateWordCategory = (id: string, category: VocabCategory) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        let newStatus = w.status;
        if (category === 'mastered') {
          newStatus = WordMasteryStatus.MASTERED;
        } else if (category === 'confusion') {
          newStatus = WordMasteryStatus.NEEDS_PRACTICE;
        } else {
          newStatus = WordMasteryStatus.NEW;
        }
        return {
          ...w,
          category,
          status: newStatus,
        };
      })
    );
  };

  const handleUpdateWord = (
    id: string,
    newWordText: string,
    newHindiMeaning: string,
    newPhonetic?: string
  ) => {
    setWords((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              word: newWordText,
              hindiMeaning: newHindiMeaning || w.hindiMeaning,
              phoneticHindi: newPhonetic || w.phoneticHindi,
            }
          : w
      )
    );
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) =>
      prev
        .filter((w) => w.id !== id)
        .map((w, idx) => ({ ...w, index: idx + 1 }))
    );
  };

  const handleClearList = () => {
    // Reset back to foundational 654 vocabulary instead of empty
    setWords(getInitialSuppliedVocabulary());
  };

  const handleWordEvaluated = (
    wordId: string,
    evaluation: AnswerEvaluation,
    userAnswer: string,
    expectedAnswer: string,
    isSpoken: boolean,
    audioDataUrl?: string
  ) => {
    const isCorrect = evaluation.isAccepted && !evaluation.requiresRetry;

    setWords((prev) =>
      prev.map((w) =>
        w.id === wordId
          ? updateWordSpacedRepetition(
              w,
              isCorrect,
              isSpoken,
              evaluation.primaryErrorCategory
            )
          : w
      )
    );

    setMemory((prev) => {
      const totalQ = prev.totalQuestionsAnswered + 1;
      const totalC = isCorrect
        ? prev.totalCorrectAnswers + 1
        : prev.totalCorrectAnswers;
      const newMistakes =
        !isCorrect && evaluation.feedbackHindi
          ? [
              evaluation.feedbackHindi,
              ...prev.commonGrammarMistakes.filter(
                (m) => m !== evaluation.feedbackHindi
              ),
            ].slice(0, 6)
          : prev.commonGrammarMistakes;

      return {
        ...prev,
        totalQuestionsAnswered: totalQ,
        totalCorrectAnswers: totalC,
        grammarScores: [...prev.grammarScores.slice(-19), evaluation.grammarScore],
        pronunciationScores: [
          ...prev.pronunciationScores.slice(-19),
          evaluation.pronunciationScore,
        ],
        speakingScores: isSpoken
          ? [
              ...prev.speakingScores.slice(-19),
              Math.round(
                (evaluation.grammarScore + evaluation.pronunciationScore) / 2
              ),
            ]
          : prev.speakingScores,
        commonGrammarMistakes: newMistakes,
      };
    });

    const newEntry: AudioHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: Date.now(),
      wordOrContext: wordId,
      expectedSentence: expectedAnswer,
      recognizedText: userAnswer,
      audioDataUrl: settings.saveAudioHistory ? audioDataUrl : undefined,
      pronunciationScore: evaluation.pronunciationScore,
      grammarScore: evaluation.grammarScore,
      feedbackHindi: evaluation.feedbackHindi,
    };

    setAudioHistory((prev) => [newEntry, ...prev.slice(0, 29)]);
  };

  const handleRecordPronunciationScore = (wordId: string, score: number) => {
    setMemory((prev) => ({
      ...prev,
      pronunciationScores: [...prev.pronunciationScores.slice(-19), score],
      speakingScores: [...prev.speakingScores.slice(-19), score],
    }));

    if (score >= 80) {
      setWords((prev) =>
        prev.map((w) =>
          w.id === wordId
            ? { ...w, speakingCorrectCount: w.speakingCorrectCount + 1 }
            : w
        )
      );
    }
  };

  const handleRecordSpeakingScore = (
    grammarScore: number,
    speakingScore: number,
    mistakeText?: string
  ) => {
    setMemory((prev) => ({
      ...prev,
      grammarScores: [...prev.grammarScores.slice(-19), grammarScore],
      speakingScores: [...prev.speakingScores.slice(-19), speakingScore],
      commonGrammarMistakes: mistakeText
        ? [
            mistakeText,
            ...prev.commonGrammarMistakes.filter((m) => m !== mistakeText),
          ].slice(0, 6)
        : prev.commonGrammarMistakes,
    }));
  };

  const handleCompleteDailyPractice = (accuracy: number) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setMemory((prev) => ({
      ...prev,
      streakDays:
        prev.dailyPracticeCompletedDate === todayStr
          ? prev.streakDays
          : prev.streakDays + 1,
      dailyPracticeCompletedDate: todayStr,
      accuracyHistory: [...prev.accuracyHistory, accuracy],
    }));
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'words', label: 'Words', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'daily', label: 'Learn (अभ्यास)', icon: <Sparkles className="w-5 h-5" /> },
    {
      id: 'teacher',
      label: 'AI Coach',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'dashboard',
      label: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className={`min-h-screen bg-[#FAF9F5] dark:bg-[#050c1a] text-slate-900 dark:text-slate-100 flex flex-col ${activeTab === 'teacher' ? 'p-0 overflow-hidden h-[100dvh]' : 'pb-20 md:pb-12'} transition-colors`}>
        {/* Top Bar - hidden during full-screen AI coach session */}
        {activeTab !== 'teacher' && (
          <header className="sticky top-0 z-30 h-14 bg-[#050c1a]/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
            <a
            href="#words"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('words');
            }}
            className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            BhashaGuru
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-8 decoration-2'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                updateSettings({ darkMode: !settings.darkMode })
              }
              className="min-h-[40px] min-w-[40px] rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowGlobalAudioDiagnostics(true)}
              className="min-h-[38px] min-w-[38px] px-2.5 rounded-xl bg-[#0e1d35] border border-slate-700/60 text-[#38bdf8] hover:bg-[#152542] flex items-center justify-center transition-colors cursor-pointer"
              title="Voice & Audio Diagnostics"
            >
              <Activity className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === 'settings' ? 'words' : 'settings')
              }
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-slate-900" />
              <span>Settings</span>
            </button>
          </div>
        </header>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 w-full ${
            activeTab === 'teacher'
              ? 'p-0 m-0 max-w-none h-full overflow-hidden'
              : 'max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8'
          }`}
        >
          {activeTab !== 'onboarding' && activeTab !== 'teacher' && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 pb-3 border-b border-slate-200/70 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span>AI English Teacher for Hindi Speakers</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {words.length} Words Active
                </span>
                <span aria-hidden="true">·</span>
                <span>Level: {settings.difficulty}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('onboarding')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                Open 3-Step Lesson Wizard →
              </button>
            </div>
          )}

          {activeTab === 'onboarding' && (
            <OnboardingFlow
              onImportAndCreateLesson={handleOnboardingCreateLesson}
              onStartNow={() => setActiveTab('words')}
              wordCount={words.length}
              isEnriching={isEnriching}
            />
          )}

          {activeTab === 'words' && (
            <div className="space-y-4">
              <VocabularyImportManager
                words={words}
                settings={settings}
                isEnriching={isEnriching}
                initialSelectedWord={pronunciationTargetWord}
                onClearSelectedWord={() => setPronunciationTargetWord(null)}
                onImportWords={handleImportWords}
                onUpdateWord={handleUpdateWord}
                onUpdateWordCategory={handleUpdateWordCategory}
                onDeleteWord={handleDeleteWord}
                onClearList={handleClearList}
                onRecordPronunciationScore={handleRecordPronunciationScore}
              />
            </div>
          )}



          {activeTab === 'teacher' && (
            <AITeacherConversation
              words={words}
              settings={settings}
              memory={memory}
              initialScenarioTopic={teacherScenarioTopic}
              initialStarterPrompt={teacherStarterPrompt}
              onUpdateSettings={updateSettings}
              onRecordSpeakingScore={handleRecordSpeakingScore}
              onExitSession={() => setActiveTab('words')}
            />
          )}



          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max pb-0.5">
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('10day')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      dailyViewMode === '10day'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    10-Day Speaking Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('vocab')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      dailyViewMode === 'vocab'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Vocabulary Drill (Spaced Repetition)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('sentence_builder')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      dailyViewMode === 'sentence_builder'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sentence Builder (वाक्य बनाना सीखें)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('tenses')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      dailyViewMode === 'tenses'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>5 Tenses Practice (काल अभ्यास)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDailyViewMode('listening_shadowing')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      dailyViewMode === 'listening_shadowing'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Listening & Shadowing (सुनो और बोलो)</span>
                  </button>
                </div>
              </div>

              {dailyViewMode === '10day' ? (
                <TenDayCourseView
                  settings={settings}
                  words={words}
                  onOpenTeacherConversation={(scenario, starter) => {
                    if (scenario) setTeacherScenarioTopic(scenario);
                    if (starter) setTeacherStarterPrompt(starter);
                    setActiveTab('teacher');
                  }}
                  onRecordSpeakingScore={handleRecordSpeakingScore}
                />
              ) : dailyViewMode === 'vocab' ? (
                <DailyPracticeSession
                  words={words}
                  settings={settings}
                  isCompletedToday={memory.dailyPracticeCompletedDate === todayStr}
                  onCompleteDailyPractice={handleCompleteDailyPractice}
                  onJumpToTeacher={() => setActiveTab('teacher')}
                />
              ) : dailyViewMode === 'listening_shadowing' ? (
                <ListeningShadowingStudio
                  words={words}
                  settings={settings}
                  onSentencePracticed={() => {
                    setMemory((prev) => ({
                      ...prev,
                      totalCorrectAnswers: prev.totalCorrectAnswers + 1,
                      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
                    }));
                  }}
                  onBackToLearnMenu={() => setDailyViewMode('10day')}
                />
              ) : dailyViewMode === 'tenses' ? (
                <FiveTensesPractice
                  words={words}
                  settings={settings}
                  onSentenceCreated={(sentence, isCorrect) => {
                    if (isCorrect) {
                      setMemory((prev) => ({
                        ...prev,
                        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
                        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
                      }));
                    } else {
                      setMemory((prev) => ({
                        ...prev,
                        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
                      }));
                    }
                  }}
                  onBackToSentenceBuilder={() => setDailyViewMode('sentence_builder')}
                />
              ) : (
                <SentenceBuilder
                  words={words}
                  settings={settings}
                  onSentenceCreated={(sentence, isCorrect) => {
                    if (isCorrect) {
                      setMemory((prev) => ({
                        ...prev,
                        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
                        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
                      }));
                    } else {
                      setMemory((prev) => ({
                        ...prev,
                        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
                      }));
                    }
                  }}
                  onOpenTensesPractice={() => setDailyViewMode('tenses')}
                  onOpenListeningShadowing={() => setDailyViewMode('listening_shadowing')}
                  onBackToWords={() => setDailyViewMode('10day')}
                />
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <ProgressDashboard
              words={words}
              memory={memory}
              audioHistory={audioHistory}
              settings={settings}
              onPracticeWord={(word) => {
                setPronunciationTargetWord(word);
                setActiveTab('words');
              }}
              onChangeDifficulty={(level) =>
                updateSettings({ difficulty: level })
              }
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={updateSettings}
              onClearAudioHistory={() => setAudioHistory([])}
              audioHistoryCount={audioHistory.length}
            />
          )}
        </main>

        {/* Mobile Navigation - hidden during full-screen AI coach session */}
        {activeTab !== 'teacher' && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] tracking-tight mt-0.5 truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <AudioDiagnosticModal
        isOpen={showGlobalAudioDiagnostics}
        onClose={() => setShowGlobalAudioDiagnostics(false)}
      />
    </div>
  );
}
