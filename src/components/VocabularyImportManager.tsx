import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Trash2,
  Edit3,
  Volume2,
  Plus,
  Check,
  X,
  Sparkles,
  RotateCcw,
  Mic,
  MicOff,
  Compass,
  AlertCircle,
  Search,
  ChevronDown,
  Undo2,
  RefreshCw,
  Trophy,
  BookOpen,
  Clock,
  Headphones,
} from 'lucide-react';
import { SentenceBuilder } from './SentenceBuilder';
import { FiveTensesPractice } from './FiveTensesPractice';
import { ListeningShadowingStudio } from './ListeningShadowingStudio';
import {
  AppSettings,
  PronunciationCheckResult,
  VocabCategory,
  VocabularyWord,
  WordContextBreakdown,
  WordMasteryStatus,
} from '../types/learning';
import { parseFlexibleVocabularyInput } from '../services/vocabParser';
import { ttsService } from '../services/ttsService';
import { speechRecorder } from '../services/sttService';
import {
  analyzePronunciation,
  generateSemanticBreakdownLocal,
  getWordContextBreakdown,
} from '../services/aiService';

interface VocabularyImportManagerProps {
  words: VocabularyWord[];
  settings: AppSettings;
  isEnriching: boolean;
  initialSelectedWord?: VocabularyWord | null;
  onClearSelectedWord?: () => void;
  onImportWords: (rawText: string) => Promise<void>;
  onUpdateWord: (id: string, newWordText: string, newHindiMeaning: string, newPhonetic?: string) => void;
  onUpdateWordCategory: (id: string, category: VocabCategory) => void;
  onDeleteWord: (id: string) => void;
  onClearList: () => void;
  onRecordPronunciationScore?: (wordId: string, score: number) => void;
}

export const VocabularyImportManager: React.FC<VocabularyImportManagerProps> = ({
  words,
  settings,
  isEnriching,
  initialSelectedWord,
  onClearSelectedWord,
  onImportWords,
  onUpdateWord,
  onUpdateWordCategory,
  onDeleteWord,
  onClearList,
  onRecordPronunciationScore,
}) => {
  // Category Selection: 'to_learn' | 'confusion' | 'mastered' | 'all'
  const [selectedCategory, setSelectedCategory] = useState<'to_learn' | 'confusion' | 'mastered' | 'all'>('to_learn');

  // Main View Mode: 'words' (Word Cards List) | 'sentence_builder' | 'tenses' | 'listening_shadowing'
  const [viewMode, setViewMode] = useState<'words' | 'sentence_builder' | 'tenses' | 'listening_shadowing'>('words');
  const [builderTargetWord, setBuilderTargetWord] = useState<VocabularyWord | null>(null);

  useEffect(() => {
    if (initialSelectedWord) {
      setBuilderTargetWord(initialSelectedWord);
      setViewMode('sentence_builder');
    }
  }, [initialSelectedWord]);

  // Search & Sorting & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'default' | 'az' | 'za'>('default');
  const [perPage, setPerPage] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Import Drawer / Paste Box State
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState<boolean>(false);
  const [pasteBoxText, setPasteBoxText] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWordVal, setEditWordVal] = useState<string>('');
  const [editMeaningVal, setEditMeaningVal] = useState<string>('');
  const [editPhoneticVal, setEditPhoneticVal] = useState<string>('');

  // Card Expansion State (Sentence examples)
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [wordBreakdowns, setWordBreakdowns] = useState<Record<string, WordContextBreakdown>>({});
  const [loadingBreakdownId, setLoadingBreakdownId] = useState<string | null>(null);

  // Audio Playback Indicator
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  // Delete Confirmation Dialog
  const [confirmDeleteWord, setConfirmDeleteWord] = useState<VocabularyWord | null>(null);

  // Undo Toast State
  const [undoAction, setUndoAction] = useState<{
    wordId: string;
    wordText: string;
    fromCategory: VocabCategory;
    toCategory: VocabCategory;
    toLabel: string;
  } | null>(null);

  // Pronunciation Practice Modal State
  const [activePronounceWord, setActivePronounceWord] = useState<VocabularyWord | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [pronounceResult, setPronounceResult] = useState<PronunciationCheckResult | null>(null);
  const [pronounceError, setPronounceError] = useState<string>('');
  const [pronounceScoresMap, setPronounceScoresMap] = useState<Record<string, number>>({});

  // Inline Pronunciation ("उच्चारण बोलें") State
  const [listeningWordId, setListeningWordId] = useState<string | null>(null);
  const [wordFeedbackMap, setWordFeedbackMap] = useState<
    Record<
      string,
      {
        status: 'correct' | 'try_again' | 'no_speech' | 'error' | 'listening';
        message: string;
        recognizedText?: string;
      }
    >
  >({});
  const listeningTimeoutRef = useRef<any>(null);
  const listeningWordRef = useRef<VocabularyWord | null>(null);
  const speechTranscriptRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
      try {
        speechRecorder.stop();
      } catch {}
    };
  }, []);

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Auto-dismiss undo toast after 6 seconds
  useEffect(() => {
    if (undoAction) {
      const timer = setTimeout(() => {
        setUndoAction(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [undoAction]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, perPage, sortOrder]);

  // Open pronunciation practice modal if navigated with a specific word
  useEffect(() => {
    if (initialSelectedWord) {
      setActivePronounceWord(initialSelectedWord);
      if (onClearSelectedWord) {
        onClearSelectedWord();
      }
    }
  }, [initialSelectedWord, onClearSelectedWord]);

  // Helper to determine exact category
  const getWordCategory = (w: VocabularyWord): VocabCategory => {
    if (w.category) return w.category;
    if (w.status === WordMasteryStatus.MASTERED) return 'mastered';
    if (w.status === WordMasteryStatus.NEEDS_PRACTICE) return 'confusion';
    return 'to_learn';
  };

  // Live Counts for categories
  const categoryCounts = useMemo(() => {
    let toLearn = 0;
    let confusion = 0;
    let mastered = 0;

    for (const w of words) {
      const cat = getWordCategory(w);
      if (cat === 'mastered') mastered++;
      else if (cat === 'confusion') confusion++;
      else toLearn++;
    }

    return {
      to_learn: toLearn,
      confusion,
      mastered,
      total: words.length,
    };
  }, [words]);

  // Filtered & Sorted list
  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = words.filter((item) => {
      // 1. Category filter
      if (selectedCategory !== 'all') {
        const itemCat = getWordCategory(item);
        if (itemCat !== selectedCategory) return false;
      }

      // 2. Search query filter
      if (q) {
        const wordMatch = item.word.toLowerCase().includes(q);
        const phoneticMatch = (item.phoneticHindi || '').toLowerCase().includes(q);
        const meaningMatch = (item.hindiMeaning || '').toLowerCase().includes(q);
        if (!wordMatch && !phoneticMatch && !meaningMatch) {
          return false;
        }
      }

      return true;
    });

    // 3. Sorting
    if (sortOrder === 'az') {
      return [...matches].sort((a, b) => a.word.localeCompare(b.word));
    }
    if (sortOrder === 'za') {
      return [...matches].sort((a, b) => b.word.localeCompare(a.word));
    }

    return matches;
  }, [words, selectedCategory, searchQuery, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / perPage));
  const paginatedWords = useMemo(() => {
    if (perPage >= 9999) return filteredWords;
    const start = (currentPage - 1) * perPage;
    return filteredWords.slice(start, start + perPage);
  }, [filteredWords, currentPage, perPage]);

  // Audio Playback
  const handlePlayAudio = async (wordText: string, wordId?: string, overrideSpeed?: 'normal' | 'slow') => {
    try {
      if (wordId) setSpeakingWordId(wordId);
      await ttsService.speak(wordText, settings, overrideSpeed);
    } finally {
      if (wordId) setSpeakingWordId(null);
    }
  };

  // Immediate category movement
  const handleMoveCategory = (
    word: VocabularyWord,
    targetCategory: VocabCategory,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    const currentCat = getWordCategory(word);
    if (currentCat === targetCategory) return;

    onUpdateWordCategory(word.id, targetCategory);

    const labelMap: Record<VocabCategory, string> = {
      to_learn: 'याद करना है',
      confusion: 'Confusion वाला',
      mastered: 'याद हो गया',
    };

    setUndoAction({
      wordId: word.id,
      wordText: word.word,
      fromCategory: currentCat,
      toCategory: targetCategory,
      toLabel: labelMap[targetCategory],
    });
  };

  const handleUndo = () => {
    if (!undoAction) return;
    onUpdateWordCategory(undoAction.wordId, undoAction.fromCategory);
    setUndoAction(null);
  };

  // Helper: Beginner-Friendly Pronunciation & Phonetic / Homophone Matcher
  const isPronunciationMatch = (
    targetWord: string,
    phoneticHindi: string | undefined,
    spokenText: string
  ): boolean => {
    if (!spokenText || !targetWord) return false;

    const cleanTarget = targetWord.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const cleanSpoken = spokenText.toLowerCase().trim().replace(/[^\w\s]/g, '');

    if (!cleanTarget || !cleanSpoken) return false;

    // 1. Direct exact equality
    if (cleanSpoken === cleanTarget) return true;

    // 2. Tokenized match (e.g. if spoken sentence contains the word: "I said them", "word them")
    const spokenTokens = cleanSpoken.split(/\s+/).filter(Boolean);
    if (spokenTokens.includes(cleanTarget)) return true;

    // 3. Substring match for compound / phrase words
    if (cleanSpoken.includes(cleanTarget)) return true;
    if (cleanTarget.length >= 4 && cleanSpoken.length >= 3 && cleanTarget.includes(cleanSpoken)) {
      return true;
    }

    // 4. Common English Homophones dictionary
    const HOMOPHONES: Record<string, string[]> = {
      their: ['there', "they're", 'thare'],
      there: ['their', "they're"],
      which: ['witch'],
      witch: ['which'],
      hear: ['here'],
      here: ['hear'],
      see: ['sea', 'c'],
      sea: ['see'],
      buy: ['by', 'bye'],
      by: ['buy', 'bye'],
      bye: ['buy', 'by'],
      to: ['too', 'two'],
      too: ['to', 'two'],
      two: ['to', 'too'],
      no: ['know'],
      know: ['no'],
      right: ['write', 'rite'],
      write: ['right', 'rite'],
      son: ['sun'],
      sun: ['son'],
      hour: ['our'],
      our: ['hour'],
      new: ['knew'],
      knew: ['new'],
      weather: ['whether'],
      whether: ['weather'],
      meat: ['meet'],
      meet: ['meat'],
      piece: ['peace'],
      peace: ['piece'],
      wood: ['would'],
      would: ['wood'],
      brake: ['break'],
      break: ['brake'],
      whole: ['hole'],
      hole: ['whole'],
      wait: ['weight'],
      weight: ['wait'],
      week: ['weak'],
      weak: ['week'],
      stair: ['stare'],
      stare: ['stair'],
      pair: ['pear'],
      pear: ['pair'],
      flower: ['flour'],
      flour: ['flower'],
      road: ['rode', 'rowed'],
      rode: ['road'],
      knight: ['night'],
      night: ['knight'],
    };

    const homophones = HOMOPHONES[cleanTarget] || [];
    if (homophones.includes(cleanSpoken) || spokenTokens.some((t) => homophones.includes(t))) {
      return true;
    }

    // 5. Hindi phonetic match (if WebSpeech or STT output in Devanagari script)
    if (phoneticHindi) {
      const cleanPhonetic = phoneticHindi.replace(/[^\u0900-\u097F]/g, '').trim();
      const cleanSpokenHi = spokenText.replace(/[^\u0900-\u097F]/g, '').trim();
      if (cleanPhonetic && cleanSpokenHi) {
        if (
          cleanSpokenHi === cleanPhonetic ||
          cleanSpokenHi.includes(cleanPhonetic) ||
          cleanPhonetic.includes(cleanSpokenHi)
        ) {
          return true;
        }
      }
    }

    // 6. Phonetic normalization (th -> d, wh -> v, ph -> f, ee -> i, oo -> u, collapse repeats)
    const normalizePhonetic = (s: string) =>
      s
        .toLowerCase()
        .replace(/th/g, 'd')
        .replace(/wh/g, 'v')
        .replace(/w/g, 'v')
        .replace(/ph/g, 'f')
        .replace(/ee/g, 'i')
        .replace(/oo/g, 'u')
        .replace(/(.)\1+/g, '$1')
        .replace(/[^a-z0-9]/g, '');

    const normTarget = normalizePhonetic(cleanTarget);
    const normSpoken = normalizePhonetic(cleanSpoken);
    if (normTarget && normSpoken && normTarget === normSpoken) return true;
    if (spokenTokens.some((t) => normalizePhonetic(t) === normTarget)) return true;

    // 7. Beginner-friendly Levenshtein distance for accent variations
    const levenshtein = (a: string, b: string): number => {
      const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          dp[i][j] =
            a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1]
              : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return dp[a.length][b.length];
    };

    for (const token of spokenTokens) {
      const maxDist = cleanTarget.length <= 4 ? 2 : cleanTarget.length <= 8 ? 2 : 3;
      if (levenshtein(token, cleanTarget) <= maxDist) {
        return true;
      }
    }

    return false;
  };

  // Complete Word Speech Evaluation
  const handleFinishWordSpeech = async (wordItem: VocabularyWord) => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }

    setListeningWordId(null);
    listeningWordRef.current = null;

    // Show analyzing state
    setWordFeedbackMap((prev) => ({
      ...prev,
      [wordItem.id]: {
        status: 'listening',
        message: 'जाँच रहे हैं...',
        recognizedText: speechTranscriptRef.current || undefined,
      },
    }));

    try {
      const sttRes = await speechRecorder.stop();
      const rawSpoken = (sttRes.transcript || speechTranscriptRef.current || '').trim();

      if (!rawSpoken) {
        setWordFeedbackMap((prev) => ({
          ...prev,
          [wordItem.id]: {
            status: 'no_speech',
            message: 'आवाज़ साफ़ नहीं सुनाई दी',
          },
        }));
        return;
      }

      const isMatch = isPronunciationMatch(wordItem.word, wordItem.phoneticHindi, rawSpoken);

      if (isMatch) {
        setWordFeedbackMap((prev) => ({
          ...prev,
          [wordItem.id]: {
            status: 'correct',
            message: 'बहुत अच्छा',
            recognizedText: rawSpoken,
          },
        }));
        setPronounceScoresMap((prev) => ({
          ...prev,
          [wordItem.id]: 100,
        }));
        if (onRecordPronunciationScore) {
          onRecordPronunciationScore(wordItem.id, 100);
        }
      } else {
        setWordFeedbackMap((prev) => ({
          ...prev,
          [wordItem.id]: {
            status: 'try_again',
            message: 'फिर से कोशिश करें',
            recognizedText: rawSpoken,
          },
        }));
        setPronounceScoresMap((prev) => ({
          ...prev,
          [wordItem.id]: 40,
        }));
        if (onRecordPronunciationScore) {
          onRecordPronunciationScore(wordItem.id, 40);
        }
      }
    } catch {
      setWordFeedbackMap((prev) => ({
        ...prev,
        [wordItem.id]: {
          status: 'error',
          message: 'आवाज़ रिकॉर्ड करने में समस्या हुई। कृपया दोबारा प्रयास करें।',
        },
      }));
    }
  };

  // Direct "उच्चारण बोलें" Handler: requests mic permission, listens to speech, compares with English word
  const handleToggleWordSpeech = async (wordItem: VocabularyWord, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // 1. If currently listening to THIS word, stop listening to trigger evaluation immediately
    if (listeningWordId === wordItem.id) {
      await handleFinishWordSpeech(wordItem);
      return;
    }

    // 2. If currently listening to another word, finish/stop it first
    if (listeningWordRef.current) {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
      try {
        await speechRecorder.stop();
      } catch {}
      setListeningWordId(null);
      listeningWordRef.current = null;
    }

    // Stop TTS audio if currently playing
    ttsService.stop();

    // Clear previous feedback for this word
    setWordFeedbackMap((prev) => {
      const next = { ...prev };
      delete next[wordItem.id];
      return next;
    });

    setListeningWordId(wordItem.id);
    listeningWordRef.current = wordItem;
    speechTranscriptRef.current = '';

    // Show initial listening feedback
    setWordFeedbackMap((prev) => ({
      ...prev,
      [wordItem.id]: {
        status: 'listening',
        message: 'सुन रहे हैं... बोलिए',
      },
    }));

    try {
      const started = await speechRecorder.start(
        (interimText) => {
          if (interimText && interimText.trim()) {
            speechTranscriptRef.current = interimText.trim();
            setWordFeedbackMap((prev) => ({
              ...prev,
              [wordItem.id]: {
                status: 'listening',
                message: 'सुन रहे हैं...',
                recognizedText: interimText.trim(),
              },
            }));

            // If speech detected, set auto-evaluate after 1.4s pause of silence
            if (listeningTimeoutRef.current) {
              clearTimeout(listeningTimeoutRef.current);
            }
            listeningTimeoutRef.current = setTimeout(() => {
              if (listeningWordRef.current?.id === wordItem.id) {
                handleFinishWordSpeech(wordItem);
              }
            }, 1400);
          }
        },
        (errMessage) => {
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
          }
          setListeningWordId(null);
          listeningWordRef.current = null;
          setWordFeedbackMap((prev) => ({
            ...prev,
            [wordItem.id]: {
              status: 'error',
              message:
                errMessage ||
                'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में Microphone Allow करें।',
            },
          }));
        }
      );

      if (!started) {
        setListeningWordId(null);
        listeningWordRef.current = null;
        return;
      }

      // Automatically evaluate after 5 seconds if user does not manually tap to stop
      listeningTimeoutRef.current = setTimeout(() => {
        if (listeningWordRef.current?.id === wordItem.id) {
          handleFinishWordSpeech(wordItem);
        }
      }, 5000);
    } catch {
      setListeningWordId(null);
      listeningWordRef.current = null;
      setWordFeedbackMap((prev) => ({
        ...prev,
        [wordItem.id]: {
          status: 'error',
          message: 'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया अनुमति जांचें।',
        },
      }));
    }
  };

  // Open Pronunciation Practice Modal for specific word
  const handleOpenPronounceModal = (word: VocabularyWord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePronounceWord(word);
    setIsRecording(false);
    setIsAnalyzing(false);
    setSpokenText('');
    setPronounceResult(null);
    setPronounceError('');
    setMicVolume(0);
  };

  const handleClosePronounceModal = async () => {
    if (isRecording) {
      await speechRecorder.stop();
      setIsRecording(false);
    }
    setActivePronounceWord(null);
    setPronounceResult(null);
    setSpokenText('');
    setPronounceError('');
  };

  // Toggle Recording for Pronunciation Practice
  const handleToggleRecord = async () => {
    if (!activePronounceWord) return;
    setPronounceError('');

    if (isRecording) {
      // STOP recording & analyze
      setIsRecording(false);
      setMicVolume(0);
      setIsAnalyzing(true);

      try {
        const sttRes = await speechRecorder.stop(settings.sttProvider === 'gemini-transcribe');
        const transcriptToCheck = (sttRes.transcript || '').trim();
        setSpokenText(transcriptToCheck);

        if (!transcriptToCheck) {
          setIsAnalyzing(false);
          setPronounceError('आवाज़ साफ़ नहीं सुनाई दी');
          return;
        }

        const cleanTarget = activePronounceWord.word.toLowerCase().trim().replace(/[^\w\s]/g, '');
        const cleanSpoken = transcriptToCheck.toLowerCase().trim().replace(/[^\w\s]/g, '');
        const spokenTokens = cleanSpoken.split(/\s+/);

        const isMatch =
          cleanSpoken === cleanTarget ||
          spokenTokens.includes(cleanTarget) ||
          spokenTokens.some(
            (t) =>
              (t.startsWith(cleanTarget) || cleanTarget.startsWith(t)) &&
              Math.abs(t.length - cleanTarget.length) <= 1
          );

        const score = isMatch ? 100 : 40;
        const analysis: PronunciationCheckResult = {
          status: isMatch ? 'CORRECT' : 'NEEDS_PRACTICE',
          score,
          syllableBreakdownEn: activePronounceWord.word,
          syllableBreakdownHi: activePronounceWord.phoneticHindi || '—',
          feedbackHindi: isMatch ? 'बहुत अच्छा' : 'फिर से कोशिश करें',
          focusSound: activePronounceWord.word,
        };

        setPronounceResult(analysis);
        setPronounceScoresMap((prev) => ({
          ...prev,
          [activePronounceWord.id]: score,
        }));

        if (onRecordPronunciationScore) {
          onRecordPronunciationScore(activePronounceWord.id, score);
        }

        if (settings.autoPlayTeacherVoice && analysis.feedbackHindi) {
          ttsService.speak(analysis.feedbackHindi, settings);
        }
      } catch (err: any) {
        console.warn('Pronunciation error:', err);
        setPronounceError(err?.message || 'उच्चारण का विश्लेषण करने में समस्या आई।');
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // START recording
      ttsService.stop();
      setPronounceResult(null);
      setSpokenText('');
      setPronounceError('');

      const started = await speechRecorder.start(
        (interim) => setSpokenText(interim),
        (err) => setPronounceError(err),
        (vol) => setMicVolume(vol)
      );

      if (!started) {
        setPronounceError('माइक शुरू नहीं हो सका। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति (Microphone Permission) दें।');
        return;
      }

      setIsRecording(true);
    }
  };

  // AI Breakdown Loader for card details
  const handleRegenerateBreakdown = async (
    wordObj: VocabularyWord,
    theme?: string
  ) => {
    setLoadingBreakdownId(wordObj.id);
    try {
      const res = await getWordContextBreakdown(
        wordObj.word,
        wordObj.hindiMeaning,
        settings.difficulty,
        theme
      );
      setWordBreakdowns((prev) => ({
        ...prev,
        [wordObj.word.toLowerCase()]: res,
      }));
    } finally {
      setLoadingBreakdownId(null);
    }
  };

  useEffect(() => {
    if (expandedWordId) {
      const target = words.find((w) => w.id === expandedWordId);
      if (target) {
        const key = target.word.toLowerCase();
        if (!wordBreakdowns[key]) {
          const initial = generateSemanticBreakdownLocal(
            target.word,
            target.hindiMeaning,
            settings.difficulty
          );
          setWordBreakdowns((prev) => ({ ...prev, [key]: initial }));
          handleRegenerateBreakdown(target);
        }
      }
    }
  }, [expandedWordId, words, settings.difficulty]);

  const liveParsed = useMemo(() => {
    return parseFlexibleVocabularyInput(pasteBoxText);
  }, [pasteBoxText]);

  const handlePasteImport = async () => {
    const parsed = parseFlexibleVocabularyInput(pasteBoxText);

    if (parsed.length === 0) {
      setImportError(
        'कोई मान्य शब्द नहीं मिला। कृपया "Word - उच्चारण - अर्थ" या केवल English शब्द लिखें।'
      );
      return;
    }

    setImportError('');
    await onImportWords(pasteBoxText);
    setPasteBoxText('');
    setIsImportDrawerOpen(false);
  };

  const startEdit = (w: VocabularyWord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(w.id);
    setEditWordVal(w.word);
    setEditMeaningVal(w.hindiMeaning);
    setEditPhoneticVal(w.phoneticHindi || '');
  };

  const saveEdit = (id: string) => {
    if (editWordVal.trim()) {
      onUpdateWord(
        id,
        editWordVal.trim(),
        editMeaningVal.trim(),
        editPhoneticVal.trim()
      );
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top View Selector: Vocabulary Words vs Sentence Builder vs 5 Tenses vs Listening & Shadowing */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#0b1528] border border-slate-800 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={() => {
            setViewMode('words');
            onClearSelectedWord?.();
          }}
          className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'words'
              ? 'bg-[#0284c7] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>शब्द सूची ({words.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('sentence_builder')}
          className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'sentence_builder'
              ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sentence Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('tenses')}
          className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'tenses'
              ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>5 Tenses काल</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('listening_shadowing')}
          className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'listening_shadowing'
              ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>सुनो और बोलो</span>
        </button>
      </div>

      {viewMode === 'sentence_builder' ? (
        <SentenceBuilder
          words={words}
          settings={settings}
          initialSelectedWord={builderTargetWord}
          onClearInitialWord={() => {
            setBuilderTargetWord(null);
            onClearSelectedWord?.();
          }}
          onBackToWords={() => setViewMode('words')}
          onOpenTensesPractice={() => setViewMode('tenses')}
          onOpenListeningShadowing={() => setViewMode('listening_shadowing')}
        />
      ) : viewMode === 'tenses' ? (
        <FiveTensesPractice
          words={words}
          settings={settings}
          onBackToSentenceBuilder={() => setViewMode('sentence_builder')}
        />
      ) : viewMode === 'listening_shadowing' ? (
        <ListeningShadowingStudio
          words={words}
          settings={settings}
          onBackToLearnMenu={() => setViewMode('words')}
        />
      ) : (
        <>
          {/* ================= 1. CATEGORY MANAGEMENT CONTAINER (SCREENSHOT 1) ================= */}
      <div className="bg-[#0b1528] border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3.5">
        {/* Top 4 Stacked Category Buttons */}
        <div className="space-y-2.5">
          {/* Button 1: याद करना है (To Learn) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('to_learn')}
            className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
              selectedCategory === 'to_learn'
                ? 'bg-[#0284c7] text-white shadow-md ring-2 ring-[#38bdf8]/40'
                : 'bg-[#101b30] hover:bg-[#152542] text-slate-200 border border-slate-800/80'
            }`}
          >
            <span className="font-bold text-sm sm:text-base">
              याद करना है (To Learn)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tabular-nums ${
                selectedCategory === 'to_learn'
                  ? 'bg-[#38bdf8]/30 text-white'
                  : 'bg-sky-950 text-sky-400 border border-sky-900/60'
              }`}
            >
              {categoryCounts.to_learn}
            </span>
          </button>

          {/* Button 2: Confusion वाला (Need Practice) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('confusion')}
            className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
              selectedCategory === 'confusion'
                ? 'bg-[#d97706] text-white shadow-md ring-2 ring-amber-400/40'
                : 'bg-[#101b30] hover:bg-[#152542] text-slate-200 border border-slate-800/80'
            }`}
          >
            <span className="font-bold text-sm sm:text-base">
              Confusion वाला (Need Practice)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tabular-nums ${
                selectedCategory === 'confusion'
                  ? 'bg-amber-400/30 text-white'
                  : 'bg-[#451a03] text-[#fbbf24] border border-[#d97706]/40'
              }`}
            >
              {categoryCounts.confusion}
            </span>
          </button>

          {/* Button 3: याद हो गया (Mastered) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('mastered')}
            className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
              selectedCategory === 'mastered'
                ? 'bg-[#059669] text-white shadow-md ring-2 ring-emerald-400/40'
                : 'bg-[#101b30] hover:bg-[#152542] text-slate-200 border border-slate-800/80'
            }`}
          >
            <span className="font-bold text-sm sm:text-base">
              याद हो गया (Mastered)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tabular-nums ${
                selectedCategory === 'mastered'
                  ? 'bg-emerald-400/30 text-white'
                  : 'bg-[#063b2a] text-[#34d399] border border-[#059669]/40'
              }`}
            >
              {categoryCounts.mastered}
            </span>
          </button>

          {/* Button 4: सभी शब्द (Show All) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-500'
                : 'bg-[#101b30] hover:bg-[#152542] text-slate-200 border border-slate-800/80'
            }`}
          >
            <span className="font-bold text-sm sm:text-base">
              सभी शब्द (Show All)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tabular-nums ${
                selectedCategory === 'all'
                  ? 'bg-slate-500 text-white'
                  : 'bg-[#1e293b] text-slate-300 border border-slate-700/60'
              }`}
            >
              {categoryCounts.total}
            </span>
          </button>
        </div>

        {/* Subtitle: दिख रहे हैं: X शब्द */}
        <div className="pt-1 text-sm text-slate-400 font-hindi px-1 flex items-center justify-between">
          <div>
            दिख रहे हैं:{' '}
            <span className="font-mono text-slate-200 font-bold">
              {filteredWords.length}
            </span>{' '}
            शब्द
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportDrawerOpen(!isImportDrawerOpen)}
              className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Words</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar (Screenshot 1) */}
        <div className="relative pt-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें: English शब्द, देवनागरी उच्चारण..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-800 bg-[#091426] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Two Select Dropdowns Row (Screenshot 1: मूल सूची क्रम & 30 प्रति पृष्ठ) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Left Dropdown: Order Selection */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full appearance-none bg-[#0e1d35] hover:bg-[#132544] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7] cursor-pointer truncate pr-8"
            >
              <option value="default">
                मूल सूची क्रम (1-{categoryCounts.total})
              </option>
              <option value="az">A → Z (Alphabetical)</option>
              <option value="za">Z → A (Reverse)</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Right Dropdown: Items Per Page */}
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="w-full appearance-none bg-[#0e1d35] hover:bg-[#132544] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7] cursor-pointer truncate pr-8"
            >
              <option value={15}>15 प्रति पृष्ठ</option>
              <option value={30}>30 प्रति पृष्ठ</option>
              <option value={50}>50 प्रति पृष्ठ</option>
              <option value={100}>100 प्रति पृष्ठ</option>
              <option value={99999}>सभी प्रति पृष्ठ (All)</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ================= OPTIONAL IMPORT DRAWER ================= */}
      {isImportDrawerOpen && (
        <div className="bg-[#0b1528] border-2 border-[#0284c7]/70 rounded-3xl p-5 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#38bdf8]" />
              <h3 className="font-bold text-white text-base">
                Add More Vocabulary Words
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsImportDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            नए शब्द <code>Word - उच्चारण - अर्थ</code> या केवल <code>Word</code> प्रारूप में पेस्ट करें:
          </p>
          <textarea
            value={pasteBoxText}
            onChange={(e) => setPasteBoxText(e.target.value)}
            rows={5}
            placeholder={`Always - ऑलवेज - हमेशा\nNever - नेवर - कभी नहीं\nOften - ऑफन - अक्सर`}
            className="w-full rounded-2xl border border-slate-800 bg-[#091426] p-3 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
          {importError && (
            <p className="mt-1 text-xs text-rose-400">{importError}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono">
              {liveParsed.length} शब्द मिले
            </span>
            <button
              type="button"
              onClick={handlePasteImport}
              disabled={isEnriching || !pasteBoxText.trim()}
              className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isEnriching ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Import Words</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= 2. WORD CARDS (WITH PRONOUNCE OPTION FOR EVERY WORD) ================= */}
      {paginatedWords.length === 0 ? (
        <div className="bg-[#0b1528] border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm font-medium">कोई शब्द नहीं मिला।</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#0284c7] text-white text-xs font-bold cursor-pointer"
          >
            सभी शब्द देखें
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {paginatedWords.map((item) => {
            const currentCat = getWordCategory(item);
            const isExpanded = expandedWordId === item.id;
            const isEditing = editingId === item.id;
            const isAudioPlaying = speakingWordId === item.id;
            const wordScore = pronounceScoresMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-[#0a1528] border border-[#152542] rounded-2xl p-3.5 sm:p-4 shadow-md transition-all hover:border-slate-700/80"
              >
                {/* Editing Inline Form */}
                {isEditing ? (
                  <div className="space-y-3 bg-[#081528] p-3.5 rounded-xl border border-slate-700">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editWordVal}
                        onChange={(e) => setEditWordVal(e.target.value)}
                        placeholder="English Word"
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0e1d35] text-white text-sm font-bold"
                      />
                      <input
                        type="text"
                        value={editPhoneticVal}
                        onChange={(e) => setEditPhoneticVal(e.target.value)}
                        placeholder="उच्चारण (Devanagari)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0e1d35] text-emerald-300 text-sm font-hindi"
                      />
                      <input
                        type="text"
                        value={editMeaningVal}
                        onChange={(e) => setEditMeaningVal(e.target.value)}
                        placeholder="हिंदी अर्थ"
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0e1d35] text-amber-200 text-sm font-hindi"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => saveEdit(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* ===== 3 COLOURED BOXES: SIDE-BY-SIDE ON DESKTOP (md:grid-cols-3) & RESPONSIVE ON MOBILE ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {/* ===== BOX 1: ENGLISH WORD (Very Light Blue) ===== */}
                      <div className="bg-sky-50 dark:bg-[#07172b] border border-sky-200 dark:border-[#0284c7]/50 rounded-xl p-3 flex items-center justify-between shadow-xs transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sky-600 dark:text-[#38bdf8] font-mono text-sm sm:text-base font-semibold shrink-0">
                            #{item.index}
                          </span>
                          <span className="text-sky-950 dark:text-white font-bold text-base sm:text-lg tracking-wide truncate">
                            {item.word}
                          </span>
                          {wordScore !== undefined && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 text-[10px] font-bold font-mono shrink-0">
                              🎙️ {wordScore}%
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-[#0c2e4e] text-sky-800 dark:text-[#38bdf8] border border-sky-200 dark:border-[#0284c7]/40 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-mono shrink-0">
                          ENGLISH
                        </span>
                      </div>

                      {/* ===== BOX 2: HINDI PRONUNCIATION (Very Light Green) ===== */}
                      <div className="bg-emerald-50 dark:bg-[#071d18] border border-emerald-200 dark:border-[#059669]/50 rounded-xl p-3 flex items-center justify-between shadow-xs transition-colors">
                        <div className="text-emerald-950 dark:text-[#6ee7b7] text-base font-semibold font-hindi truncate min-w-0 pr-2">
                          {item.phoneticHindi || '—'}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-[#063b2a] text-emerald-800 dark:text-[#34d399] border border-emerald-200 dark:border-[#059669]/40 text-[10px] sm:text-[11px] font-bold font-hindi shrink-0">
                          उच्चारण
                        </span>
                      </div>

                      {/* ===== BOX 3: HINDI MEANING (Very Light Cream / Orange) ===== */}
                      <div className="bg-amber-50 dark:bg-[#241508] border border-amber-200 dark:border-[#d97706]/50 rounded-xl p-3 flex items-center justify-between shadow-xs transition-colors">
                        <div className="text-amber-950 dark:text-[#fde68a] text-base font-medium font-hindi truncate min-w-0 pr-2">
                          {item.hindiMeaning || '—'}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-[#451a03] text-amber-900 dark:text-[#fbbf24] border border-amber-200 dark:border-[#d97706]/40 text-[10px] sm:text-[11px] font-bold font-hindi shrink-0">
                          अर्थ
                        </span>
                      </div>
                    </div>

                    {/* ===== ACTION BUTTONS ROW (WITH PRONOUNCE OPTION FOR EVERY WORD) ===== */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* 1. Audio Playback Button (Listen English) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(item.word, item.id);
                        }}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isAudioPlaying
                            ? 'bg-[#0284c7] text-white animate-pulse ring-2 ring-cyan-400'
                            : 'bg-[#0e1d35] hover:bg-[#152847] border border-slate-700/60 text-[#38bdf8] active:scale-95'
                        }`}
                        title={`Listen "${item.word}" pronunciation`}
                        aria-label={`Listen to ${item.word}`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>

                      {/* 2. DEDICATED PRONOUNCE (बोलें) PRACTICE BUTTON FOR EVERY WORD */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleWordSpeech(item, e)}
                        className={`min-h-[44px] px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                          listeningWordId === item.id
                            ? 'bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse border border-rose-500'
                            : 'bg-[#0e223d] hover:bg-[#14325a] border border-[#38bdf8]/60 text-[#38bdf8]'
                        }`}
                        title={
                          listeningWordId === item.id
                            ? 'बोलना समाप्त करने के लिए टैप करें'
                            : `बोलें "${item.word}" और उच्चारण जाँचें`
                        }
                        aria-label={`Pronounce ${item.word}`}
                      >
                        {listeningWordId === item.id ? (
                          <>
                            <MicOff className="w-4 h-4 text-white animate-pulse" />
                            <span>सुन रहे हैं... बोलिए</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 text-[#38bdf8]" />
                            <span>उच्चारण बोलें</span>
                          </>
                        )}
                      </button>

                      {/* 2B. DEDICATED SENTENCE BUILDER (वाक्य बनाएं) BUTTON */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBuilderTargetWord(item);
                          setViewMode('sentence_builder');
                        }}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs bg-[#1e1b4b] hover:bg-[#2e266d] border border-indigo-500/60 text-indigo-300 active:scale-95 shrink-0"
                        title={`"${item.word}" से वाक्य बनाना सीखें`}
                        aria-label={`Build sentence with ${item.word}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>वाक्य बनाएं</span>
                      </button>

                      {/* 3. Green Checkmark: ✓ याद हो गया */}
                      <button
                        type="button"
                        onClick={(e) => handleMoveCategory(item, 'mastered', e)}
                        className={`flex-1 min-h-[44px] px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          currentCat === 'mastered'
                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                            : 'bg-[#062c21] hover:bg-[#083a2c] border border-emerald-600/70 text-emerald-400 active:scale-95'
                        }`}
                        title="Mark as Mastered (याद हो गया)"
                        aria-label="याद हो गया"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>याद हो गया</span>
                      </button>

                      {/* 4. Amber Alert: ! Confusion */}
                      <button
                        type="button"
                        onClick={(e) => handleMoveCategory(item, 'confusion', e)}
                        className={`flex-1 min-h-[44px] px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          currentCat === 'confusion'
                            ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/50'
                            : 'bg-[#2b1706] hover:bg-[#3a1f09] border border-amber-600/70 text-amber-400 active:scale-95'
                        }`}
                        title="Mark as Need Practice (Confusion वाला)"
                        aria-label="Confusion वाला"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Confusion</span>
                      </button>

                      {/* 5. Return to Learn: if currently in 'mastered' or 'confusion' */}
                      {(currentCat === 'mastered' || currentCat === 'confusion') && (
                        <button
                          type="button"
                          onClick={(e) => handleMoveCategory(item, 'to_learn', e)}
                          className="px-3 min-h-[44px] rounded-xl bg-[#0c1f38] hover:bg-[#122c4f] border border-sky-600/70 text-sky-400 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                          title="Move back to 'याद करना है'"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">याद करना है</span>
                        </button>
                      )}
                    </div>

                    {/* Inline Beginner-Friendly Pronunciation Feedback */}
                    {wordFeedbackMap[item.id] && (
                      <div
                        className={`mt-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 border font-hindi transition-all animate-in fade-in duration-150 ${
                          wordFeedbackMap[item.id].status === 'correct'
                            ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300'
                            : wordFeedbackMap[item.id].status === 'try_again'
                            ? 'bg-amber-950/80 border-amber-600/70 text-amber-300'
                            : wordFeedbackMap[item.id].status === 'no_speech'
                            ? 'bg-orange-950/80 border-orange-600/70 text-orange-300'
                            : wordFeedbackMap[item.id].status === 'listening'
                            ? 'bg-[#09223e]/90 border-[#38bdf8]/70 text-[#7dd3fc]'
                            : 'bg-rose-950/80 border-rose-600/70 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base leading-none">
                            {wordFeedbackMap[item.id].status === 'correct'
                              ? '✅'
                              : wordFeedbackMap[item.id].status === 'try_again'
                              ? '🔄'
                              : wordFeedbackMap[item.id].status === 'no_speech'
                              ? '⚠️'
                              : wordFeedbackMap[item.id].status === 'listening'
                              ? '🎙️'
                              : '❌'}
                          </span>
                          <span className="font-bold text-sm sm:text-base">
                            {wordFeedbackMap[item.id].message}
                          </span>
                          {wordFeedbackMap[item.id].recognizedText && (
                            <span className="text-xs opacity-90 font-mono text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded-md">
                              {wordFeedbackMap[item.id].status === 'listening'
                                ? `(सुना: "${wordFeedbackMap[item.id].recognizedText}")`
                                : `(सुनाई दिया: "${wordFeedbackMap[item.id].recognizedText}")`}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWordFeedbackMap((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          }}
                          className="text-slate-400 hover:text-white p-1 rounded-md text-xs cursor-pointer ml-auto"
                          title="बंद करें"
                          aria-label="Dismiss feedback"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Expand Details Trigger */}
                    <div className="mt-1 flex items-center justify-between px-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => startEdit(item, e)}
                          className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                          title="Edit word"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteWord(item)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete word"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedWordId(isExpanded ? null : item.id)}
                        className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        title={isExpanded ? 'कम देखें' : 'उदाहरण वाक्य देखें'}
                      >
                        <span>{isExpanded ? 'कम देखें' : 'उदाहरण वाक्य'}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-cyan-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Expanded Real-Life Sentences & Pronunciation Tips */}
                    {isExpanded && (() => {
                      const breakdown =
                        wordBreakdowns[item.word.toLowerCase()] ||
                        generateSemanticBreakdownLocal(
                          item.word,
                          item.hindiMeaning,
                          settings.difficulty
                        );
                      const isLoading = loadingBreakdownId === item.id;

                      return (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5" />
                              <span>{breakdown.situationContext || 'दैनिक उपयोग का वाक्य'}</span>
                            </span>
                            {isLoading && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>AI Loading...</span>
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-[#081528] border border-cyan-950 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-white">
                                &ldquo;{breakdown.primaryExampleEn}&rdquo;
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePlayAudio(breakdown.primaryExampleEn)}
                                className="p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                                title="Listen Sentence"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-xs text-emerald-300 font-hindi">
                              हिंदी: {breakdown.primaryExampleHi}
                            </div>
                            <div className="text-[11px] text-slate-400 font-hindi pt-1 border-t border-slate-800/80">
                              💡 उपयोग का कारण: {breakdown.whyUsedHindi}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= PAGINATION CONTROLS ================= */}
      {totalPages > 1 && (
        <div className="bg-[#0b1528] border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-[#101b30] hover:bg-[#152542] border border-slate-800 text-slate-200 disabled:opacity-30 cursor-pointer font-medium"
          >
            ← पिछला (Prev)
          </button>

          <span className="font-mono text-slate-400">
            पृष्ठ <strong className="text-white">{currentPage}</strong> / {totalPages} (कुल {filteredWords.length} शब्द)
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-[#101b30] hover:bg-[#152542] border border-slate-800 text-slate-200 disabled:opacity-30 cursor-pointer font-medium"
          >
            अगला (Next) →
          </button>
        </div>
      )}
        </>
      )}

      {/* ================= 3. INTERACTIVE PRONUNCIATION PRACTICE MODAL (PER WORD) ================= */}
      {activePronounceWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            ref={modalRef}
            className="bg-[#0b1528] border-2 border-[#0284c7]/80 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    उच्चारण अभ्यास (Pronounce Practice)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-hindi">
                    माइक दबाकर बोलें और तुरंत अपना स्कोर देखें
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClosePronounceModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Word Display (3-Box Mini Presentation) */}
            <div className="space-y-2">
              <div className="bg-[#07172b] border border-[#0284c7]/50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[#38bdf8] font-mono text-xs font-semibold mr-2">
                    #{activePronounceWord.index}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {activePronounceWord.word}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(activePronounceWord.word)}
                    className="px-2.5 py-1 rounded-lg bg-[#0e223d] hover:bg-[#14325a] text-[#38bdf8] border border-[#38bdf8]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Listen Normal Speed"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(activePronounceWord.word, undefined, 'slow')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                    title="Listen Slow"
                  >
                    धीमे
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#071d18] border border-[#059669]/50 rounded-xl p-2.5">
                  <div className="text-[10px] text-emerald-400 font-bold mb-0.5">उच्चारण (Hindi)</div>
                  <div className="text-emerald-200 font-semibold font-hindi text-sm">
                    {activePronounceWord.phoneticHindi || '—'}
                  </div>
                </div>
                <div className="bg-[#241508] border border-[#d97706]/50 rounded-xl p-2.5">
                  <div className="text-[10px] text-amber-400 font-bold mb-0.5">हिंदी अर्थ</div>
                  <div className="text-amber-200 font-medium font-hindi text-sm truncate">
                    {activePronounceWord.hindiMeaning || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Big Microphone Recording Control */}
            <div className="py-2 flex flex-col items-center justify-center text-center">
              <button
                type="button"
                onClick={handleToggleRecord}
                disabled={isAnalyzing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30 shadow-rose-950'
                    : isAnalyzing
                    ? 'bg-amber-600 text-white animate-spin'
                    : 'bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white hover:scale-105 active:scale-95 ring-4 ring-cyan-500/30'
                }`}
                title={isRecording ? 'Tap to Stop' : 'Tap to Speak'}
                aria-label="Microphone"
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : isAnalyzing ? (
                  <Sparkles className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              {/* Status Text & Volume Indicator */}
              <div className="mt-3">
                {isRecording ? (
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-rose-400 animate-pulse">
                      🔴 आपकी आवाज़ सुन रहे हैं...
                    </p>
                    <p className="text-xs text-slate-400 font-hindi">
                      स्पष्ट आवाज़ में &ldquo;{activePronounceWord.word}&rdquo; बोलें, फिर बटन दबाएं।
                    </p>
                    {/* Live Waveform / Volume Meter */}
                    <div className="flex items-center justify-center gap-1 h-4 pt-1">
                      {[0.3, 0.7, 1.2, 0.5, 0.9, 1.4, 0.6].map((mult, i) => (
                        <div
                          key={i}
                          className="w-1 bg-rose-400 rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.max(4, Math.min(18, (micVolume * 40 + 4) * mult))}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : isAnalyzing ? (
                  <p className="text-sm font-semibold text-cyan-300 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>उच्चारण का विश्लेषण हो रहा है...</span>
                  </p>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-white">
                      माइक दबाकर बोलें
                    </p>
                    <p className="text-xs text-slate-400 font-hindi mt-0.5">
                      Tap the mic and speak &ldquo;{activePronounceWord.word}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {pronounceError && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-hindi">
                  {pronounceError}
                </div>
              )}
            </div>

            {/* Pronunciation Feedback Result */}
            {pronounceResult && (
              <div className="p-4 rounded-2xl bg-[#081528] border border-slate-700 space-y-3 animate-in zoom-in-95 duration-150">
                {/* Score Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300">
                      उच्चारण परिणाम
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      pronounceResult.score >= 80
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : pronounceResult.score >= 60
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}
                  >
                    स्कोर: {pronounceResult.score}%
                  </div>
                </div>

                {spokenText && (
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">पहचानी गई आवाज़: </span>
                    <strong className="text-white">&ldquo;{spokenText}&rdquo;</strong>
                  </div>
                )}

                {/* Syllable Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0e1d35] p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 mb-0.5">Syllables (English)</div>
                    <div className="font-mono font-bold text-white">
                      {pronounceResult.syllableBreakdownEn || activePronounceWord.word}
                    </div>
                  </div>
                  <div className="bg-[#0e1d35] p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400 mb-0.5">उच्चारण खंड (Devanagari)</div>
                    <div className="font-hindi font-bold text-emerald-300">
                      {pronounceResult.syllableBreakdownHi || activePronounceWord.phoneticHindi}
                    </div>
                  </div>
                </div>

                {/* Hindi Coach Tip */}
                <p className="text-xs text-slate-200 font-hindi leading-relaxed bg-[#0c1a2e] p-2.5 rounded-xl border border-slate-800">
                  💡 {pronounceResult.feedbackHindi}
                </p>

                {/* Quick Mastered / Repeat Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleRecord}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#0e1d35] hover:bg-[#152542] border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>फिर से बोलें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleMoveCategory(activePronounceWord, 'mastered');
                      handleClosePronounceModal();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>याद हो गया में डालें</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClosePronounceModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UNDO TOAST NOTIFICATION ================= */}
      {undoAction && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-200 w-full max-w-sm px-4">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
            <div className="text-xs leading-snug">
              <span className="font-bold text-amber-300">&ldquo;{undoAction.wordText}&rdquo;</span>{' '}
              को <strong>{undoAction.toLabel}</strong> में भेजा गया।
            </div>
            <button
              type="button"
              onClick={handleUndo}
              className="px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs inline-flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      {confirmDeleteWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">
              शब्द हटाएं (Delete Word)?
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              क्या आप <strong>&ldquo;{confirmDeleteWord.word}&rdquo;</strong> (
              {confirmDeleteWord.hindiMeaning}) को अपनी शब्दावली से हटाना चाहते हैं?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDeleteWord(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteWord(confirmDeleteWord.id);
                  setConfirmDeleteWord(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
