import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Info,
  ThumbsUp,
  HelpCircle,
  Flame,
  Check,
  ChevronRight,
  Layers,
  Award,
  BookmarkCheck,
  Shuffle,
  Eye,
  Settings2,
  X,
  Play,
} from 'lucide-react';
import { AppSettings, VocabularyWord } from '../types/learning';
import { ttsService } from '../services/ttsService';
import { normalizeSentence, shuffleChips } from '../utils/sentenceGrammarEngine';
import {
  TENSES_DATA,
  TenseKey,
  FormType,
  TenseLevel,
  TenseExercise,
  TenseDefinition,
} from '../data/fiveTensesData';
import {
  generateTenseExercisesForVerb,
  isLegitimateVerb,
  getVerbForms,
} from '../utils/verbConjugationEngine';
import { VerbPracticeSelectorModal } from './VerbPracticeSelectorModal';

// Re-export types and data for backward compatibility across the app
export type {
  TenseKey,
  FormType,
  TenseLevel,
  TenseExercise,
  TenseDefinition,
};
export { TENSES_DATA };

interface FiveTensesPracticeProps {
  words: VocabularyWord[];
  settings: AppSettings;
  onSentenceCreated?: (sentence: string, isCorrect: boolean) => void;
  onBackToSentenceBuilder?: () => void;
  initialSelectedWord?: VocabularyWord | null;
}

/**
 * State tracking a specific pool's shuffled presentation queue without replacement.
 */
interface PoolSessionState {
  order: string[];       // Current cycle's shuffled sequence of IDs
  currentIndex: number;  // Current pointer into order (0 <= currentIndex < order.length)
  seenInCycle: string[]; // IDs displayed so far in current cycle
  cycleCount: number;    // Cycle count (1, 2, 3...)
  lastCycleEndId?: string; // ID of the last item in previous cycle
}

/**
 * Robust Fisher-Yates shuffle that prevents the previous cycle's final item
 * from repeating as the very first item of the new cycle when possible.
 */
function shuffleIds(ids: string[], avoidFirstId?: string): string[] {
  const result = [...ids];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (avoidFirstId && result.length > 1 && result[0] === avoidFirstId) {
    const swapIdx = 1 + Math.floor(Math.random() * (result.length - 1));
    [result[0], result[swapIdx]] = [result[swapIdx], result[0]];
  }
  return result;
}

export const FiveTensesPractice: React.FC<FiveTensesPracticeProps> = ({
  words,
  settings,
  onSentenceCreated,
  onBackToSentenceBuilder,
  initialSelectedWord,
}) => {
  // 1. Tense, Level, and Form Selection State
  const [selectedTenseKey, setSelectedTenseKey] = useState<TenseKey>('present_simple');
  const [selectedLevel, setSelectedLevel] = useState<TenseLevel | 'all'>('beginner');
  const [selectedFormFilter, setSelectedFormFilter] = useState<FormType | 'all'>('all');
  const [prioritizeSavedWords, setPrioritizeSavedWords] = useState<boolean>(false);

  // 1B. "Practice with My Words" / "मेरे शब्दों से अभ्यास" State
  const [isVerbModalOpen, setIsVerbModalOpen] = useState<boolean>(false);
  const [selectedVerbWords, setSelectedVerbWords] = useState<VocabularyWord[]>(() => {
    if (initialSelectedWord && isLegitimateVerb(initialSelectedWord)) {
      return [initialSelectedWord];
    }
    return [];
  });
  const [isMyWordsActive, setIsMyWordsActive] = useState<boolean>(() => {
    return !!(initialSelectedWord && isLegitimateVerb(initialSelectedWord));
  });

  // 2. Separate independent queue & history state per pool (tense + level + form)
  const [poolRecords, setPoolRecords] = useState<Record<string, PoolSessionState>>({});

  // 3. User interaction state
  const [inputMode, setInputMode] = useState<'arrange' | 'type'>('arrange');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect';
    messageHi: string;
    ruleHintHi?: string;
  }>({
    status: 'idle',
    messageHi: '',
  });

  // 4. Session statistics
  const [sessionStats, setSessionStats] = useState<{
    completedCount: number;
    correctCount: number;
    streak: number;
  }>({
    completedCount: 0,
    correctCount: 0,
    streak: 0,
  });

  // 5. TTS and UI state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Current active tense definition
  const currentTense = TENSES_DATA[selectedTenseKey];

  // Helper set of saved word roots
  const savedWordsSet = useMemo(() => {
    if (!words || words.length === 0) return new Set<string>();
    return new Set(words.map((w) => w.word.toLowerCase().trim()));
  }, [words]);

  // Detected verbs in user's saved vocabulary
  const detectedVerbsCount = useMemo(() => {
    return words.filter(isLegitimateVerb).length;
  }, [words]);

  // Dynamically generated tense exercises for user's selected verbs
  const userVerbExercises = useMemo((): TenseExercise[] => {
    if (!isMyWordsActive || selectedVerbWords.length === 0) return [];
    const generated: TenseExercise[] = [];
    for (const vWord of selectedVerbWords) {
      const exs = generateTenseExercisesForVerb(vWord, selectedTenseKey);
      generated.push(...exs);
    }
    return generated;
  }, [isMyWordsActive, selectedVerbWords, selectedTenseKey]);

  // Base list of exercises for current tense (either standard 60-sentence bank OR user verb sentences + bank fallback)
  const baseTenseExercises = useMemo((): TenseExercise[] => {
    if (isMyWordsActive && userVerbExercises.length > 0) {
      // User's verb exercises first, followed by curated bank
      return [...userVerbExercises, ...currentTense.exercises];
    }
    return currentTense.exercises;
  }, [isMyWordsActive, userVerbExercises, currentTense]);

  // Fast O(1) map of all exercises in the current scope
  const exerciseById = useMemo(() => {
    const map = new Map<string, TenseExercise>();
    for (const ex of baseTenseExercises) {
      map.set(ex.id, ex);
    }
    return map;
  }, [baseTenseExercises]);

  // Exercises belonging to current active pool
  const currentPoolExercises = useMemo(() => {
    let list = baseTenseExercises;

    // Filter by level (unless 'all' is selected)
    if (selectedLevel !== 'all') {
      list = list.filter((ex) => ex.level === selectedLevel);
    }

    // Filter by form (positive, negative, question) if specified
    if (selectedFormFilter !== 'all') {
      const formFiltered = list.filter((ex) => ex.formType === selectedFormFilter);
      if (formFiltered.length > 0) {
        list = formFiltered;
      }
    }

    // Sort saved vocabulary to front if user requested
    if (prioritizeSavedWords && savedWordsSet.size > 0 && !isMyWordsActive) {
      list = [...list].sort((a, b) => {
        const aMatches = a.vocabularyFocus?.some((f) => savedWordsSet.has(f.toLowerCase())) ? 1 : 0;
        const bMatches = b.vocabularyFocus?.some((f) => savedWordsSet.has(f.toLowerCase())) ? 1 : 0;
        return bMatches - aMatches;
      });
    }

    return list.length > 0 ? list : baseTenseExercises;
  }, [
    baseTenseExercises,
    selectedLevel,
    selectedFormFilter,
    prioritizeSavedWords,
    savedWordsSet,
    isMyWordsActive,
  ]);

  // Unique key identifying this exact practice pool
  const poolKey = useMemo(() => {
    const verbIds = isMyWordsActive ? selectedVerbWords.map((v) => v.id).sort().join('_') : 'std';
    return `${selectedTenseKey}__${selectedLevel}__${selectedFormFilter}__${verbIds}__${prioritizeSavedWords ? 'saved' : 'norm'}`;
  }, [
    selectedTenseKey,
    selectedLevel,
    selectedFormFilter,
    isMyWordsActive,
    selectedVerbWords,
    prioritizeSavedWords,
  ]);

  // Retrieve current active record or create a consistent fallback
  const activeRecord = useMemo<PoolSessionState>(() => {
    const existing = poolRecords[poolKey];
    if (existing && existing.order.length > 0) {
      return existing;
    }
    const candidateIds = currentPoolExercises.map((e) => e.id);
    const initialOrder = shuffleIds(candidateIds);
    return {
      order: initialOrder,
      currentIndex: 0,
      seenInCycle: initialOrder.length > 0 ? [initialOrder[0]] : [],
      cycleCount: 1,
    };
  }, [poolRecords, poolKey, currentPoolExercises]);

  // Ensure record is saved to state for this poolKey
  useEffect(() => {
    setPoolRecords((prev) => {
      if (prev[poolKey] && prev[poolKey].order.length > 0) return prev;
      const candidateIds = currentPoolExercises.map((e) => e.id);
      const initialOrder = shuffleIds(candidateIds);
      return {
        ...prev,
        [poolKey]: {
          order: initialOrder,
          currentIndex: 0,
          seenInCycle: initialOrder.length > 0 ? [initialOrder[0]] : [],
          cycleCount: 1,
        },
      };
    });
  }, [poolKey, currentPoolExercises]);

  // Safe exercise bound from current pool's shuffled order
  const currentExerciseId = activeRecord.order[activeRecord.currentIndex] || currentPoolExercises[0]?.id;
  const currentExercise: TenseExercise =
    exerciseById.get(currentExerciseId) || currentPoolExercises[0] || baseTenseExercises[0];

  // Total exercises count for currently selected level (before form filter)
  const currentLevelTotalCount = useMemo(() => {
    if (selectedLevel === 'all') return baseTenseExercises.length;
    return baseTenseExercises.filter((ex) => ex.level === selectedLevel).length;
  }, [baseTenseExercises, selectedLevel]);

  // Initialize chips and reset inputs whenever currentExercise changes
  useEffect(() => {
    if (currentExercise) {
      setAvailableChips(shuffleChips([...currentExercise.chips]));
      setSelectedWords([]);
      setTypedInput('');
      setFeedback({ status: 'idle', messageHi: '' });
    }
  }, [currentExercise?.id]);

  // Audio speech handler
  const handleSpeak = (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    ttsService
      .speak(text, settings)
      .catch(() => {})
      .finally(() => {
        setIsSpeaking(false);
      });
  };

  // Chip click handlers
  const handleAddChip = (chip: string, index: number) => {
    if (feedback.status === 'correct') return;
    setSelectedWords((prev) => [...prev, chip]);
    setAvailableChips((prev) => prev.filter((_, i) => i !== index));
    if (feedback.status === 'incorrect') {
      setFeedback({ status: 'idle', messageHi: '' });
    }
  };

  const handleRemoveChip = (chip: string, index: number) => {
    if (feedback.status === 'correct') return;
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableChips((prev) => [...prev, chip]);
    if (feedback.status === 'incorrect') {
      setFeedback({ status: 'idle', messageHi: '' });
    }
  };

  const handleClearInputs = () => {
    setSelectedWords([]);
    setTypedInput('');
    setFeedback({ status: 'idle', messageHi: '' });
    if (currentExercise) {
      setAvailableChips(shuffleChips([...currentExercise.chips]));
    }
  };

  // Switch Tense: preserves that tense's specific queue without reset
  const handleTenseChange = (newTenseKey: TenseKey) => {
    if (newTenseKey === selectedTenseKey) return;
    setSelectedTenseKey(newTenseKey);
    setFeedback({ status: 'idle', messageHi: '' });
  };

  // Switch Level: preserves that level's specific queue without reset
  const handleLevelChange = (newLevel: TenseLevel | 'all') => {
    if (newLevel === selectedLevel) return;
    setSelectedLevel(newLevel);
    setFeedback({ status: 'idle', messageHi: '' });
  };

  // Switch Form Filter
  const handleFormFilterChange = (newForm: FormType | 'all') => {
    if (newForm === selectedFormFilter) return;
    setSelectedFormFilter(newForm);
    setFeedback({ status: 'idle', messageHi: '' });
  };

  // Reshuffle current pool manually
  const handleReshuffleCurrentPool = () => {
    const candidateIds = currentPoolExercises.map((e) => e.id);
    const newShuffledOrder = shuffleIds(candidateIds);
    setPoolRecords((prev) => ({
      ...prev,
      [poolKey]: {
        order: newShuffledOrder,
        currentIndex: 0,
        seenInCycle: newShuffledOrder.length > 0 ? [newShuffledOrder[0]] : [],
        cycleCount: 1,
      },
    }));
    setFeedback({ status: 'idle', messageHi: '' });
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (!currentExercise) return;

    const userText =
      inputMode === 'arrange' ? selectedWords.join(' ').trim() : typedInput.trim();

    if (!userText) {
      setFeedback({
        status: 'incorrect',
        messageHi: 'कृपया पहले वाक्य का क्रम बनाएं या वाक्य टाइप करें।',
      });
      return;
    }

    const normUser = normalizeSentence(userText);
    const normExpected = normalizeSentence(currentExercise.expectedSentence);
    const isAlternative = currentExercise.acceptedAlternatives.some(
      (alt) => normalizeSentence(alt) === normUser
    );

    const isCorrect = normUser === normExpected || isAlternative;

    if (isCorrect) {
      setFeedback({
        status: 'correct',
        messageHi: 'शानदार! बिल्कुल सही वाक्य! (Brilliant! Correct Sentence!)',
        ruleHintHi: currentExercise.explanationHi,
      });

      setSessionStats((prev) => ({
        completedCount: prev.completedCount + 1,
        correctCount: prev.correctCount + 1,
        streak: prev.streak + 1,
      }));

      onSentenceCreated?.(userText, true);

      if (settings.autoPlayTeacherVoice) {
        handleSpeak(currentExercise.expectedSentence);
      }
    } else {
      setFeedback({
        status: 'incorrect',
        messageHi: `गलत क्रम। सही वाक्य है: "${currentExercise.expectedSentence}"`,
        ruleHintHi: `${currentExercise.explanationHi} (संरचना: ${currentExercise.structureFormula})`,
      });

      setSessionStats((prev) => ({
        completedCount: prev.completedCount + 1,
        correctCount: prev.correctCount,
        streak: 0,
      }));

      onSentenceCreated?.(userText, false);
    }
  };

  // Next Sentence logic
  const handleNextQuestion = () => {
    setFeedback({ status: 'idle', messageHi: '' });

    setPoolRecords((prev) => {
      const current = prev[poolKey] || activeRecord;
      const order = current.order;
      const nextIdx = current.currentIndex + 1;

      // 1. Unseen sentence remaining in current cycle
      if (nextIdx < order.length) {
        const nextId = order[nextIdx];
        return {
          ...prev,
          [poolKey]: {
            ...current,
            currentIndex: nextIdx,
            seenInCycle: Array.from(new Set([...current.seenInCycle, nextId])),
          },
        };
      }

      // 2. Pool exhausted! Start a new shuffled cycle without repeating the last shown sentence
      const lastId = order[order.length - 1];
      const candidateIds = currentPoolExercises.map((e) => e.id);
      const newShuffledOrder = shuffleIds(candidateIds, lastId);

      return {
        ...prev,
        [poolKey]: {
          order: newShuffledOrder,
          currentIndex: 0,
          seenInCycle: newShuffledOrder.length > 0 ? [newShuffledOrder[0]] : [],
          cycleCount: current.cycleCount + 1,
          lastCycleEndId: lastId,
        },
      };
    });
  };

  // Previous Question logic
  const handlePreviousQuestion = () => {
    setFeedback({ status: 'idle', messageHi: '' });

    setPoolRecords((prev) => {
      const current = prev[poolKey] || activeRecord;
      if (current.currentIndex > 0) {
        return {
          ...prev,
          [poolKey]: {
            ...current,
            currentIndex: current.currentIndex - 1,
          },
        };
      }
      return prev;
    });
  };

  // Level description text
  const levelDescriptions: Record<TenseLevel | 'all', { badge: string; descHi: string }> = {
    beginner: {
      badge: '🟢 Beginner (शुरुआती)',
      descHi: 'छोटे, सरल और बुनियादी रोज़मर्रा के वाक्य (Short & Easy Everyday Sentences)',
    },
    practice: {
      badge: '🟡 Practice (अभ्यास)',
      descHi: 'मध्यम स्तर के स्वाभाविक दैनिक बातचीत वाले वाक्य (Everyday Conversation Sentences)',
    },
    challenge: {
      badge: '🟣 Challenge (चुनौती)',
      descHi: 'विस्तृत वाक्य, उपयोगी प्रश्न और नकारात्मक संरचनाएं (Longer Sentences, Questions & Negatives)',
    },
    all: {
      badge: '🔵 All Levels (सभी स्तर)',
      descHi: 'इस काल के सभी वाक्य क्रमबद्ध अभ्यास के लिए (Full Sentences Practice)',
    },
  };

  const poolTotal = activeRecord.order.length;
  const poolCurrentNumber = activeRecord.currentIndex + 1;
  const remainingInCycle = Math.max(0, poolTotal - poolCurrentNumber);

  // Apply selected verbs from modal
  const handleApplyVerbsFromModal = (verbs: VocabularyWord[]) => {
    setSelectedVerbWords(verbs);
    setIsMyWordsActive(verbs.length > 0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* ================= HEADER & STATS ================= */}
      <div className="bg-[#0b1528] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white font-hindi flex items-center gap-2">
                  <span>5 Tenses का अभ्यास (5 Tenses Practice)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 border border-cyan-700/60 hidden sm:inline-block">
                    300+ Sentences Bank
                  </span>
                </h2>
                <p className="text-xs text-slate-300 font-hindi">
                  दैनिक जीवन में 90% बातचीत इन 5 कालों से होती है। अब आपकी सहेजी गई {words.length} शब्दावली से जुड़ी क्रियाओं के साथ अभ्यास करें।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Real Stats & Back Button */}
          <div className="flex items-center gap-2 sm:self-center">
            {onBackToSentenceBuilder && (
              <button
                type="button"
                onClick={onBackToSentenceBuilder}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#07172b] hover:bg-[#10233d] border border-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sentence Builder</span>
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#07172b] border border-slate-800">
              <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sessionStats.correctCount}</span>
                <span className="text-[10px] text-slate-400 font-hindi">सही</span>
              </span>
              {sessionStats.streak > 1 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{sessionStats.streak} Streak</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= 1. "PRACTICE WITH MY WORDS" HIGHLIGHT SECTION ================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#091a32] to-[#0c2444] border-2 border-cyan-600/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-bold font-hindi flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>नया फ़ीचर: मेरे शब्दों से अभ्यास (Practice with My Words)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                {detectedVerbsCount} क्रियाएं खोजी गईं
              </span>
            </div>

            <p className="text-xs text-slate-200 font-hindi">
              {isMyWordsActive && selectedVerbWords.length > 0 ? (
                <>
                  सक्रिय: <strong className="text-emerald-300 font-mono">{selectedVerbWords.map((v) => v.word).join(', ')}</strong> ({selectedVerbWords.length} क्रियाएं)। इनके वाक्य 5 Tenses में शामिल हैं।
                </>
              ) : (
                'अपनी सहेजी गई शब्दावली में से क्रियाएं (Verbs) चुनें और उनके Present, Past, Future, Continuous व Perfect वाक्य बनाएं।'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {isMyWordsActive && (
              <button
                type="button"
                onClick={() => {
                  setIsMyWordsActive(false);
                  setSelectedVerbWords([]);
                }}
                className="px-3 py-2 rounded-xl text-xs font-hindi bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700"
              >
                मानक सूची (Standard Bank)
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsVerbModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-hindi bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Settings2 className="w-4 h-4 text-amber-300" />
              <span>मेरे शब्दों से अभ्यास (Practice with My Words)</span>
            </button>
          </div>
        </div>

        {/* Selected Verbs Chips Bar (when active) */}
        {isMyWordsActive && selectedVerbWords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-[#061426] border border-cyan-800/80">
            <span className="text-xs text-cyan-300 font-hindi font-bold mr-1">चयनित क्रियाएं:</span>
            {selectedVerbWords.map((vWord) => (
              <span
                key={vWord.id}
                className="px-2.5 py-1 rounded-lg bg-[#0b213c] border border-cyan-600 text-white text-xs font-mono font-bold flex items-center gap-1"
              >
                <span>{vWord.word}</span>
                <span className="text-[10px] text-amber-300 font-hindi">({vWord.hindiMeaning})</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = selectedVerbWords.filter((w) => w.id !== vWord.id);
                    setSelectedVerbWords(next);
                    if (next.length === 0) setIsMyWordsActive(false);
                  }}
                  className="hover:text-rose-400 cursor-pointer ml-1 text-slate-400"
                  title="हटाएं"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setIsVerbModalOpen(true)}
              className="text-xs text-cyan-400 hover:underline font-hindi ml-auto cursor-pointer"
            >
              + और क्रियाएं जोड़ें
            </button>
          </div>
        )}

        {/* ================= 5 TENSE TABS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {(Object.keys(TENSES_DATA) as TenseKey[]).map((key) => {
            const t = TENSES_DATA[key];
            const isActive = selectedTenseKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTenseChange(key)}
                className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isActive
                    ? t.colorScheme.activeTab
                    : 'bg-[#07172b] hover:bg-[#0d223d] border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                      isActive ? 'text-white/90' : 'text-slate-400'
                    }`}
                  >
                    {t.shortTag}
                  </span>
                  <span
                    className={`text-xs font-extrabold block truncate ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {t.englishTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[11px] font-hindi block truncate ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {t.hindiTitle}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1 rounded-sm ${
                      isActive ? 'bg-white/20 text-white' : 'text-slate-500 bg-slate-800/80'
                    }`}
                  >
                    {isMyWordsActive ? baseTenseExercises.length : t.exercises.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TENSE LESSON GUIDE & CORE EXAMPLE ================= */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border ${currentTense.colorScheme.border} ${currentTense.colorScheme.bg} bg-[#08172c] space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${currentTense.colorScheme.badge}`}
              >
                {currentTense.englishTitle}
              </span>
              <span className="text-sm font-bold text-white font-hindi">
                ({currentTense.hindiTitle})
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                {baseTenseExercises.length} कुल वाक्य
              </span>
            </div>
            <p className="text-xs text-slate-200 font-hindi leading-relaxed">
              <strong>कब इस्तेमाल करें:</strong> {currentTense.whenToUseHi}
            </p>
            <p className="text-xs text-emerald-300 font-hindi">
              <strong>पहचान:</strong> {currentTense.identificationHi}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-xs text-cyan-400 hover:underline cursor-pointer font-hindi self-start sm:self-center flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showFormulaDetails ? 'नियम छुपाएं (Hide Formula)' : 'संरचना देखें (View Formula)'}</span>
          </button>
        </div>

        {/* Detailed Formulas (Positive, Negative, Question) */}
        {showFormulaDetails && (
          <div className="p-3.5 rounded-2xl bg-[#040f1e] border border-slate-700/80 text-xs font-mono text-slate-300 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-baseline gap-2">
              <span className="text-emerald-400 font-bold w-20 shrink-0 font-hindi">1. सकारात्मक (+):</span>
              <span className="text-slate-200">{currentTense.structure.positive}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-amber-400 font-bold w-20 shrink-0 font-hindi">2. नकारात्मक (-):</span>
              <span className="text-slate-200">{currentTense.structure.negative}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-cyan-400 font-bold w-20 shrink-0 font-hindi">3. प्रश्नवाचक (?):</span>
              <span className="text-slate-200">{currentTense.structure.question}</span>
            </div>
          </div>
        )}

        {/* Core Example Card with Audio */}
        <div className="p-3.5 rounded-2xl bg-[#071d33] border border-cyan-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-hindi font-bold text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>मुख्य उदाहरण (Core Example):</span>
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5">
              <span className="text-base sm:text-lg font-bold text-white font-mono">
                &ldquo;{currentTense.coreExampleEn}&rdquo;
              </span>
              <span className="text-xs sm:text-sm text-emerald-300 font-hindi">
                ({currentTense.coreExampleHi})
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isSpeaking}
            onClick={() => handleSpeak(currentTense.coreExampleEn)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all w-fit"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'बोल रहे हैं...' : 'उदाहरण सुनें'}</span>
          </button>
        </div>
      </div>

      {/* ================= EXERCISE AREA ================= */}
      <div className="bg-[#0b1528] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5">
        {/* ================= DIFFICULTY LEVEL BUTTONS ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-hindi font-bold">
              कठिनाई स्तर चुनें (Difficulty Level):
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              इस स्तर में {currentLevelTotalCount} वाक्य उपलब्ध
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#07172b] border border-slate-800/80 rounded-2xl">
            {/* Level 1: Beginner */}
            <button
              type="button"
              onClick={() => handleLevelChange('beginner')}
              className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
                selectedLevel === 'beginner'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 font-extrabold scale-[1.02]'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedLevel === 'beginner' ? 'bg-white' : 'bg-emerald-400'
                } hidden sm:inline-block`}
              />
              <span>1. शुरुआती</span>
              <span className="text-[10px] opacity-90 font-mono">
                ({baseTenseExercises.filter((e) => e.level === 'beginner').length})
              </span>
            </button>

            {/* Level 2: Practice */}
            <button
              type="button"
              onClick={() => handleLevelChange('practice')}
              className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
                selectedLevel === 'practice'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 font-extrabold scale-[1.02]'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedLevel === 'practice' ? 'bg-white' : 'bg-amber-400'
                } hidden sm:inline-block`}
              />
              <span>2. अभ्यास</span>
              <span className="text-[10px] opacity-90 font-mono">
                ({baseTenseExercises.filter((e) => e.level === 'practice').length})
              </span>
            </button>

            {/* Level 3: Challenge */}
            <button
              type="button"
              onClick={() => handleLevelChange('challenge')}
              className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
                selectedLevel === 'challenge'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400 font-extrabold scale-[1.02]'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedLevel === 'challenge' ? 'bg-white' : 'bg-indigo-400'
                } hidden sm:inline-block`}
              />
              <span>3. चुनौती</span>
              <span className="text-[10px] opacity-90 font-mono">
                ({baseTenseExercises.filter((e) => e.level === 'challenge').length})
              </span>
            </button>

            {/* Option 4: All Levels */}
            <button
              type="button"
              onClick={() => handleLevelChange('all')}
              className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
                selectedLevel === 'all'
                  ? 'bg-cyan-600 text-white shadow-md ring-2 ring-cyan-400 font-extrabold scale-[1.02]'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedLevel === 'all' ? 'bg-white' : 'bg-cyan-400'
                } hidden sm:inline-block`}
              />
              <span>4. सभी स्तर</span>
              <span className="text-[10px] opacity-90 font-mono">
                ({baseTenseExercises.length})
              </span>
            </button>
          </div>

          {/* Active Level Description Banner */}
          <div className="px-3.5 py-2 rounded-xl bg-[#071930] border border-slate-800 text-xs text-slate-300 font-hindi flex items-center justify-between">
            <span>{levelDescriptions[selectedLevel].descHi}</span>
            {words && words.length > 0 && !isMyWordsActive && (
              <button
                type="button"
                onClick={() => setPrioritizeSavedWords(!prioritizeSavedWords)}
                className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-hindi font-bold cursor-pointer transition-all border flex items-center gap-1 shrink-0 ${
                  prioritizeSavedWords
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-[#0b1b2d] text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="सहेजे गए शब्दों वाले वाक्यों को प्राथमिकता दें"
              >
                <BookmarkCheck className="w-3 h-3" />
                <span>मेरी शब्दावली ({words.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Form Filter Selector (Positive / Negative / Question / All) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-slate-400 font-hindi mr-1 shrink-0">वाक्य रूप:</span>
            <button
              type="button"
              onClick={() => handleFormFilterChange('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormFilter === 'all'
                  ? 'bg-slate-200 text-slate-900 shadow-xs'
                  : 'bg-[#07172b] hover:bg-[#10233d] text-slate-400 border border-slate-800'
              }`}
            >
              सभी ({currentLevelTotalCount})
            </button>
            <button
              type="button"
              onClick={() => handleFormFilterChange('positive')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormFilter === 'positive'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#07172b] hover:bg-[#10233d] text-slate-400 border border-slate-800'
              }`}
            >
              सकारात्मक (+)
            </button>
            <button
              type="button"
              onClick={() => handleFormFilterChange('negative')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormFilter === 'negative'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-[#07172b] hover:bg-[#10233d] text-slate-400 border border-slate-800'
              }`}
            >
              नकारात्मक (-)
            </button>
            <button
              type="button"
              onClick={() => handleFormFilterChange('question')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormFilter === 'question'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-[#07172b] hover:bg-[#10233d] text-slate-400 border border-slate-800'
              }`}
            >
              प्रश्नवाचक (?)
            </button>
          </div>

          {/* Real Unseen Counter & Reshuffle Control */}
          <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold flex items-center gap-1.5">
              <span>सवाल {poolCurrentNumber} / {poolTotal}</span>
              {activeRecord.cycleCount > 1 && (
                <span className="text-[10px] text-amber-300 bg-amber-950 px-1 py-0.2 rounded border border-amber-800">
                  चक्र {activeRecord.cycleCount}
                </span>
              )}
            </span>
            <span className="text-[11px] font-hindi text-slate-400 hidden md:inline">
              ({remainingInCycle} नए वाक्य बाकी)
            </span>
            <button
              type="button"
              onClick={handleReshuffleCurrentPool}
              className="p-1.5 rounded-lg bg-[#07172b] hover:bg-[#10233d] text-slate-400 hover:text-cyan-300 border border-slate-800 cursor-pointer transition-all"
              title="वाक्यों का क्रम बदलें (Reshuffle)"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Question Display */}
        <div className="text-center p-4 sm:p-6 rounded-2xl bg-[#07172b] border border-slate-700/80 space-y-2 relative">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-hindi text-amber-400 font-bold">
              🎯 हिंदी से अंग्रेज़ी बनाएं:
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {currentExercise.situationContextHi}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 capitalize">
              {currentExercise.level}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 capitalize">
              {currentExercise.formType}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-hindi">
            &ldquo;{currentExercise.hindiPrompt}&rdquo;
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-[11px] font-mono">
              संरचना: {currentExercise.structureFormula}
            </span>
            {currentExercise.vocabularyFocus && currentExercise.vocabularyFocus.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-hindi">
                क्रिया: {currentExercise.vocabularyFocus.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Input Mode Switcher (Arrange Chips vs Type) */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-hindi">अभ्यास का तरीका:</span>
          <div className="flex items-center gap-1 bg-[#07172b] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setInputMode('arrange');
                handleClearInputs();
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                inputMode === 'arrange'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              शब्द जोड़ें (Arrange)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('type');
                handleClearInputs();
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                inputMode === 'type'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              टाइप करें (Type)
            </button>
          </div>
        </div>

        {/* ================= 4A. ARRANGE MODE ================= */}
        {inputMode === 'arrange' && (
          <div className="space-y-4">
            {/* Answer Construction Zone */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061324] border-2 border-dashed border-slate-700/80 min-h-[64px] flex flex-wrap items-center gap-2">
              {selectedWords.length === 0 ? (
                <span className="text-xs text-slate-500 font-hindi italic">
                  नीचे दिए गए शब्दों पर क्लिक करके वाक्य का सही क्रम बनाएं...
                </span>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    type="button"
                    onClick={() => handleRemoveChip(word, idx)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-rose-700 hover:to-rose-600 text-white font-mono font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer group"
                  >
                    <span>{word}</span>
                    <span className="ml-1.5 opacity-60 group-hover:opacity-100 text-xs">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Available Chips Pool */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-hindi">उपलब्ध शब्द (शब्द पर क्लिक करें):</span>
                {selectedWords.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearInputs}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-hindi"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>रीसेट करें</span>
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#07172b] border border-slate-800 flex flex-wrap gap-2">
                {availableChips.map((chip, idx) => (
                  <button
                    key={`${chip}-${idx}`}
                    type="button"
                    onClick={() => handleAddChip(chip, idx)}
                    className="px-3.5 py-2 rounded-xl bg-[#0e1d35] hover:bg-[#162d4e] active:bg-cyan-800 border border-slate-700 text-white font-mono font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer hover:border-cyan-500/70"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4B. TYPE MODE ================= */}
        {inputMode === 'type' && (
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-hindi block">
              अंग्रेज़ी में पूरा वाक्य लिखें:
            </label>
            <div className="relative">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => {
                  setTypedInput(e.target.value);
                  if (feedback.status === 'incorrect') {
                    setFeedback({ status: 'idle', messageHi: '' });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCheckAnswer();
                  }
                }}
                placeholder="यहाँ पूरा अंग्रेज़ी वाक्य टाइप करें (जैसे: I write in my notebook every day.)..."
                className="w-full px-4 py-3 rounded-2xl bg-[#061324] border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-500"
              />
              {typedInput && (
                <button
                  type="button"
                  onClick={() => setTypedInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= 5. FEEDBACK CARD ================= */}
        {feedback.status !== 'idle' && (
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${
              feedback.status === 'correct'
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                : 'bg-rose-950/60 border-rose-800 text-rose-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold font-hindi">
                {feedback.status === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-emerald-300">{feedback.messageHi}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="text-sm text-rose-300">{feedback.messageHi}</span>
                  </>
                )}
              </div>
              {feedback.ruleHintHi && (
                <p className="text-xs text-slate-300 font-hindi leading-relaxed pl-7">
                  {feedback.ruleHintHi}
                </p>
              )}
            </div>

            {/* Pronunciation button on feedback */}
            <button
              type="button"
              disabled={isSpeaking}
              onClick={() => handleSpeak(currentExercise.expectedSentence)}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>वाक्य सुनें</span>
            </button>
          </div>
        )}

        {/* ================= ACTION CONTROLS ================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Check Answer Button */}
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={
              (inputMode === 'arrange' && selectedWords.length === 0) ||
              (inputMode === 'type' && !typedInput.trim())
            }
            className={`min-h-[46px] px-6 py-2.5 rounded-2xl font-bold font-hindi text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              (inputMode === 'arrange' && selectedWords.length > 0) ||
              (inputMode === 'type' && typedInput.trim())
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-98'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>उत्तर जाँचें (Check Answer)</span>
          </button>

          {/* Navigation Controls: Previous Question & Next Sentence */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={activeRecord.currentIndex === 0}
              className="min-h-[46px] px-4 py-2.5 rounded-2xl font-bold font-hindi text-sm bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="पिछला सवाल"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">पिछला</span>
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="min-h-[46px] flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl font-bold font-hindi text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              <span>अगला वाक्य (Next Sentence)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 6. VERB SELECTOR MODAL ================= */}
      <VerbPracticeSelectorModal
        isOpen={isVerbModalOpen}
        onClose={() => setIsVerbModalOpen(false)}
        words={words}
        selectedVerbWords={selectedVerbWords}
        onApplySelectedVerbs={handleApplyVerbsFromModal}
        settings={settings}
      />
    </div>
  );
};
