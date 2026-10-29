import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  BookOpen,
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  Info,
  Check,
  Award,
  Clock,
  Headphones,
} from 'lucide-react';
import { AppSettings, VocabularyWord } from '../types/learning';
import { ttsService } from '../services/ttsService';
import { FiveTensesPractice } from './FiveTensesPractice';
import {
  generateGrammaticallySoundExercises,
  analyzeGrammaticalRole,
  getRoleBadgeHi,
} from '../utils/sentenceGrammarEngine';

export type SentenceDifficulty = 'beginner' | 'practice' | 'challenge';

export interface SentenceExercise {
  id: string;
  level: SentenceDifficulty;
  exampleSentenceEn?: string;
  exampleSentenceHi?: string;
  hindiPrompt: string;
  expectedSentence: string;
  acceptedAlternatives: string[];
  subject?: string;
  verb?: string;
  object?: string;
  chips: string[];
  targetWord?: string;
  explanationHi: string;
  ruleTipHi?: string;
  suitabilityNoteHi?: string;
  roleBadgeHi?: string;
}

interface SentenceBuilderProps {
  words: VocabularyWord[];
  settings: AppSettings;
  initialSelectedWord?: VocabularyWord | null;
  onClearInitialWord?: () => void;
  onSentenceCreated?: (sentenceEn: string, isCorrect: boolean) => void;
  onBackToWords?: () => void;
  onOpenTensesPractice?: () => void;
  onOpenListeningShadowing?: () => void;
}

// ================= CURATED GENERAL EXERCISES BY LEVEL =================
const GENERAL_EXERCISES: Record<SentenceDifficulty, SentenceExercise[]> = {
  beginner: [
    {
      id: 'gen-beg-1',
      level: 'beginner',
      exampleSentenceEn: 'I eat rice.',
      exampleSentenceHi: 'मैं चावल खाता हूँ।',
      hindiPrompt: 'मैं खाना खाता हूँ।',
      expectedSentence: 'I eat food.',
      acceptedAlternatives: [
        'I eat food',
        'I eat the food.',
        'I eat the food',
        'I am eating food.',
      ],
      subject: 'I',
      verb: 'eat',
      object: 'food',
      chips: ['food', 'I', 'eat'],
      targetWord: 'Food',
      explanationHi:
        'अंग्रेज़ी SVO नियम: कर्ता (I) + क्रिया (eat) + कर्म (food)। हिंदी में क्रिया अंत में आती है, अंग्रेज़ी में क्रिया बीच में आती है।',
      ruleTipHi: 'Subject (I) + Verb (eat) + Object (food)',
    },
    {
      id: 'gen-beg-2',
      level: 'beginner',
      exampleSentenceEn: 'I have a book.',
      exampleSentenceHi: 'मेरे पास एक किताब है।',
      hindiPrompt: 'वह (स्त्री) किताब पढ़ती है।',
      expectedSentence: 'She reads a book.',
      acceptedAlternatives: [
        'She reads a book',
        'She reads books.',
        'She reads books',
        'She reads the book.',
      ],
      subject: 'She',
      verb: 'reads',
      object: 'a book',
      chips: ['a book', 'She', 'reads'],
      targetWord: 'Book',
      explanationHi:
        'He/She के साथ Present Simple में क्रिया में "s" लगता है: She + reads + a book।',
      ruleTipHi: 'She + reads + a book',
    },
    {
      id: 'gen-beg-3',
      level: 'beginner',
      exampleSentenceEn: 'We are friends.',
      exampleSentenceHi: 'हम दोस्त हैं।',
      hindiPrompt: 'वे क्रिकेट खेलते हैं।',
      expectedSentence: 'They play cricket.',
      acceptedAlternatives: [
        'They play cricket',
        'They are playing cricket.',
        'They play the cricket.',
      ],
      subject: 'They',
      verb: 'play',
      object: 'cricket',
      chips: ['cricket', 'play', 'They'],
      targetWord: 'Play',
      explanationHi:
        'They बहुवचन कर्ता है, इसलिए क्रिया में "s" नहीं लगेगा: They + play + cricket।',
      ruleTipHi: 'They + play + cricket',
    },
    {
      id: 'gen-beg-4',
      level: 'beginner',
      exampleSentenceEn: 'Please give me water.',
      exampleSentenceHi: 'कृपया मुझे पानी दें।',
      hindiPrompt: 'हम पानी पीते हैं।',
      expectedSentence: 'We drink water.',
      acceptedAlternatives: [
        'We drink water',
        'We drink the water.',
        'We are drinking water.',
      ],
      subject: 'We',
      verb: 'drink',
      object: 'water',
      chips: ['water', 'drink', 'We'],
      targetWord: 'Water',
      explanationHi:
        'Subject (We) + Verb (drink) + Object (water)। पानी (water) क्रिया के बाद आएगा।',
      ruleTipHi: 'We + drink + water',
    },
    {
      id: 'gen-beg-5',
      level: 'beginner',
      exampleSentenceEn: 'I speak Hindi.',
      exampleSentenceHi: 'मैं हिंदी बोलता हूँ।',
      hindiPrompt: 'तुम अंग्रेज़ी बोलते हो।',
      expectedSentence: 'You speak English.',
      acceptedAlternatives: [
        'You speak English',
        'You do speak English.',
        'You are speaking English.',
      ],
      subject: 'You',
      verb: 'speak',
      object: 'English',
      chips: ['English', 'You', 'speak'],
      targetWord: 'Speak',
      explanationHi:
        'You (Subject) + speak (Verb) + English (Object)।',
      ruleTipHi: 'You + speak + English',
    },
    {
      id: 'gen-beg-6',
      level: 'beginner',
      exampleSentenceEn: 'He likes tea.',
      exampleSentenceHi: 'वह चाय पसंद करता है।',
      hindiPrompt: 'वह (पुरुष) चाय पसंद करता है।',
      expectedSentence: 'He likes tea.',
      acceptedAlternatives: ['He likes tea', 'He likes the tea.'],
      subject: 'He',
      verb: 'likes',
      object: 'tea',
      chips: ['tea', 'likes', 'He'],
      targetWord: 'Tea',
      explanationHi:
        'He एकवचन है, इसलिए like में "s" लगकर "likes" बन गया: He likes tea।',
      ruleTipHi: 'He + likes + tea',
    },
  ],
  practice: [
    {
      id: 'gen-prac-1',
      level: 'practice',
      hindiPrompt: 'मैं खाना नहीं खाता हूँ।',
      expectedSentence: 'I do not eat food.',
      acceptedAlternatives: [
        "I don't eat food.",
        "I don't eat food",
        'I do not eat food',
        'I do not eat the food.',
        "I don't eat the food.",
      ],
      subject: 'I',
      verb: 'do not eat',
      object: 'food',
      chips: ['food', 'do not', 'eat', 'I'],
      targetWord: 'Eat',
      explanationHi:
        'नकारात्मक वाक्य: I के साथ "do not" (या "don\'t") + Verb (eat) + Object (food)।',
      ruleTipHi: 'I + do not + eat + food',
    },
    {
      id: 'gen-prac-2',
      level: 'practice',
      hindiPrompt: 'वह किताब नहीं पढ़ती है।',
      expectedSentence: 'She does not read a book.',
      acceptedAlternatives: [
        "She doesn't read a book.",
        "She doesn't read a book",
        'She does not read a book',
        'She does not read books.',
        "She doesn't read books.",
      ],
      subject: 'She',
      verb: 'does not read',
      object: 'a book',
      chips: ['a book', 'does not', 'read', 'She'],
      targetWord: 'Read',
      explanationHi:
        'He/She के साथ नकारात्मक वाक्य में "does not" आता है और क्रिया में "s" नहीं लगता।',
      ruleTipHi: 'She + does not + read + a book',
    },
    {
      id: 'gen-prac-3',
      level: 'practice',
      hindiPrompt: 'क्या तुम क्रिकेट खेलते हो?',
      expectedSentence: 'Do you play cricket?',
      acceptedAlternatives: ['Do you play cricket', 'Do you play cricket?'],
      subject: 'you',
      verb: 'play',
      object: 'cricket',
      chips: ['cricket', 'Do', 'you', 'play?'],
      targetWord: 'Play',
      explanationHi:
        'प्रश्नवाचक वाक्य: Present Simple में Do सबसे पहले आता है: Do + you + play + cricket?',
      ruleTipHi: 'Do + you + play + cricket?',
    },
    {
      id: 'gen-prac-4',
      level: 'practice',
      hindiPrompt: 'वे अंग्रेज़ी नहीं बोलते हैं।',
      expectedSentence: 'They do not speak English.',
      acceptedAlternatives: [
        "They don't speak English.",
        "They don't speak English",
        'They do not speak English',
      ],
      subject: 'They',
      verb: 'do not speak',
      object: 'English',
      chips: ['English', 'speak', 'do not', 'They'],
      targetWord: 'Speak',
      explanationHi:
        'They के साथ नकारात्मक वाक्य में "do not" (don\'t) का प्रयोग होता है।',
      ruleTipHi: 'They + do not + speak + English',
    },
    {
      id: 'gen-prac-5',
      level: 'practice',
      hindiPrompt: 'क्या वह यहाँ रहता है?',
      expectedSentence: 'Does he live here?',
      acceptedAlternatives: ['Does he live here', 'Does he live here?'],
      subject: 'he',
      verb: 'live',
      object: 'here',
      chips: ['here', 'Does', 'he', 'live?'],
      targetWord: 'Live',
      explanationHi:
        'He/She के प्रश्न में "Does" पहले आता है और मुख्य क्रिया में "s" नहीं लगता।',
      ruleTipHi: 'Does + he + live + here?',
    },
    {
      id: 'gen-prac-6',
      level: 'practice',
      hindiPrompt: 'हम चाय नहीं पीते हैं।',
      expectedSentence: 'We do not drink tea.',
      acceptedAlternatives: [
        "We don't drink tea.",
        "We don't drink tea",
        'We do not drink tea',
      ],
      subject: 'We',
      verb: 'do not drink',
      object: 'tea',
      chips: ['tea', 'drink', 'do not', 'We'],
      targetWord: 'Tea',
      explanationHi:
        'We के साथ नकारात्मक रूप में "do not" आता है: We do not drink tea।',
      ruleTipHi: 'We + do not + drink + tea',
    },
  ],
  challenge: [
    {
      id: 'gen-chal-1',
      level: 'challenge',
      hindiPrompt: 'मैं अपनी अंग्रेज़ी सुधारने के लिए रोज़ अभ्यास करता हूँ।',
      expectedSentence: 'I practice daily to improve my English.',
      acceptedAlternatives: [
        'I practice daily to improve my English',
        'I practice every day to improve my English.',
        'I practice every day to improve my English',
        'Every day I practice to improve my English.',
      ],
      subject: 'I',
      verb: 'practice',
      object: 'daily to improve my English',
      chips: ['to improve', 'I', 'practice daily', 'my English'],
      targetWord: 'Practice',
      explanationHi:
        'I (Subject) + practice daily (Verb+Adverb) + to improve my English (उद्देश्य बताने के लिए infinitive)।',
      ruleTipHi: 'I + practice daily + to improve my English',
    },
    {
      id: 'gen-chal-2',
      level: 'challenge',
      hindiPrompt: 'वह बाज़ार से ताज़ी सब्ज़ियाँ खरीदती है।',
      expectedSentence: 'She buys fresh vegetables from the market.',
      acceptedAlternatives: [
        'She buys fresh vegetables from the market',
        'She buys fresh vegetables from market.',
      ],
      subject: 'She',
      verb: 'buys',
      object: 'fresh vegetables from the market',
      chips: ['fresh vegetables', 'She', 'buys', 'from the market'],
      targetWord: 'Market',
      explanationHi:
        'She (Subject) + buys (Verb with s) + fresh vegetables (Object) + from the market (स्थान)।',
      ruleTipHi: 'She + buys + fresh vegetables + from the market',
    },
    {
      id: 'gen-chal-3',
      level: 'challenge',
      hindiPrompt: 'हम अपने परिवार और दोस्तों के साथ समय बिताते हैं।',
      expectedSentence: 'We spend time with our family and friends.',
      acceptedAlternatives: [
        'We spend time with our family and friends',
        'We spend time with our friends and family.',
      ],
      subject: 'We',
      verb: 'spend',
      object: 'time with our family and friends',
      chips: ['time with', 'spend', 'We', 'our family and friends'],
      targetWord: 'Family',
      explanationHi:
        'Subject (We) + Verb (spend) + Object (time) + with our family and friends।',
      ruleTipHi: 'We + spend + time + with our family and friends',
    },
    {
      id: 'gen-chal-4',
      level: 'challenge',
      hindiPrompt: 'आपको रोज़ाना साफ़ पानी पीना चाहिए।',
      expectedSentence: 'You should drink clean water every day.',
      acceptedAlternatives: [
        'You should drink clean water every day',
        'You should drink clean water daily.',
        'You ought to drink clean water every day.',
      ],
      subject: 'You',
      verb: 'should drink',
      object: 'clean water every day',
      chips: ['clean water', 'You should', 'drink', 'every day'],
      targetWord: 'Water',
      explanationHi:
        'सलाह देने के लिए "should + Verb 1st form" का प्रयोग होता है: You should drink clean water every day।',
      ruleTipHi: 'You + should drink + clean water + every day',
    },
  ],
};

// ================= SHUFFLE HELPER =================
function shuffleChips<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Ensure not identical to original if length > 1
  if (result.length > 1 && result.every((v, i) => v === array[i])) {
    [result[0], result[result.length - 1]] = [result[result.length - 1], result[0]];
  }
  return result;
}

// Normalize sentences for forgiving comparisons
function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\bdon't\b/g, 'do not')
    .replace(/\bdoesn't\b/g, 'does not')
    .replace(/\bdidn't\b/g, 'did not')
    .replace(/\bcan't\b/g, 'cannot')
    .replace(/\bi'm\b/g, 'i am')
    .replace(/\bwe're\b/g, 'we are')
    .replace(/\bthey're\b/g, 'they are')
    .replace(/\byou're\b/g, 'you are')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/[.,!?;:'"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ================= DYNAMIC EXERCISE GENERATOR FOR ANY WORD =================
export function generateExercisesForWord(
  wordItem: VocabularyWord,
  chosenMeaning?: string
): Record<SentenceDifficulty, SentenceExercise[]> {
  return generateGrammaticallySoundExercises(
    wordItem.word,
    wordItem.hindiMeaning,
    chosenMeaning
  ) as Record<SentenceDifficulty, SentenceExercise[]>;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  words,
  settings,
  initialSelectedWord,
  onClearInitialWord,
  onSentenceCreated,
  onBackToWords,
  onOpenTensesPractice,
  onOpenListeningShadowing,
}) => {
  // Toggle for 5 Tenses Practice mode inside Sentence Builder
  const [showTensesMode, setShowTensesMode] = useState<boolean>(false);

  // Current difficulty level: 'beginner' | 'practice' | 'challenge'
  const [level, setLevel] = useState<SentenceDifficulty>('beginner');

  // Currently selected vocabulary word from the 659 list
  const [selectedVocabWord, setSelectedVocabWord] = useState<VocabularyWord | null>(
    initialSelectedWord || null
  );

  // When word has multiple saved meanings, track chosen meaning
  const [chosenMeaning, setChosenMeaning] = useState<string>('');

  // Exercise variant index (to prevent repeats when user clicks "अगला सवाल")
  const [exerciseVariantIndex, setExerciseVariantIndex] = useState<number>(0);

  // Drawer / modal to browse and pick words from the 659 vocabulary list
  const [isWordPickerOpen, setIsWordPickerOpen] = useState<boolean>(false);
  const [wordSearchQuery, setWordSearchQuery] = useState<string>('');
  const [wordPickerCategory, setWordPickerCategory] = useState<'all' | 'to_learn' | 'confusion' | 'mastered'>('all');

  // Input modes: 'arrange' (word chips) vs 'type' (text input)
  const [inputMode, setInputMode] = useState<'arrange' | 'type'>('arrange');

  // User input states
  const [arrangedChips, setArrangedChips] = useState<string[]>([]);
  const [typedSentence, setTypedSentence] = useState<string>('');

  // Evaluation & Feedback state
  const [feedback, setFeedback] = useState<{
    isSubmitted: boolean;
    isCorrect: boolean;
    encouragementHi: string;
    explanationHi: string;
    correctedSentence: string;
  } | null>(null);

  // Input warning state
  const [inputWarning, setInputWarning] = useState<string>('');

  // TTS status and fallback state
  const [ttsStatus, setTtsStatus] = useState<{
    speaking: boolean;
    fallbackMessage?: string;
  }>({ speaking: false });

  // Genuine progress tracking (never fabricated)
  const [stats, setStats] = useState<{
    completedCount: number;
    correctCount: number;
    streak: number;
  }>({
    completedCount: 0,
    correctCount: 0,
    streak: 0,
  });

  // Guide toggle
  const [showOrderGuide, setShowOrderGuide] = useState<boolean>(true);

  // If initialSelectedWord changes from outside
  useEffect(() => {
    if (initialSelectedWord) {
      setSelectedVocabWord(initialSelectedWord);
      setChosenMeaning('');
      setExerciseVariantIndex(0);
    }
  }, [initialSelectedWord]);

  // Breakdown multiple meanings of selected word if available
  const availableMeanings = useMemo(() => {
    if (!selectedVocabWord) return [];
    const raw = selectedVocabWord.hindiMeaning || '';
    const parts = raw
      .split(/\s*[/,;]\s*|\s+या\s+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : [raw];
  }, [selectedVocabWord]);

  // When selectedVocabWord changes, initialize chosenMeaning
  useEffect(() => {
    if (selectedVocabWord) {
      if (availableMeanings.length > 0 && !chosenMeaning) {
        setChosenMeaning(availableMeanings[0]);
      }
    } else {
      setChosenMeaning('');
    }
  }, [selectedVocabWord, availableMeanings, chosenMeaning]);

  // Generate or select the active exercise
  const currentExercise = useMemo((): SentenceExercise => {
    if (selectedVocabWord) {
      const generatedPool = generateExercisesForWord(
        selectedVocabWord,
        chosenMeaning || availableMeanings[0]
      );
      const listForLevel = generatedPool[level] || generatedPool['beginner'];
      const safeIndex = exerciseVariantIndex % listForLevel.length;
      return listForLevel[safeIndex] || listForLevel[0];
    } else {
      const generalList = GENERAL_EXERCISES[level] || GENERAL_EXERCISES['beginner'];
      const safeIndex = exerciseVariantIndex % generalList.length;
      return generalList[safeIndex] || generalList[0];
    }
  }, [selectedVocabWord, chosenMeaning, availableMeanings, level, exerciseVariantIndex]);

  // Chips for current exercise
  const currentChips = useMemo(() => {
    if (!currentExercise) return [];
    return currentExercise.chips;
  }, [currentExercise]);

  // Reset inputs when exercise, level, or word changes
  const handleResetInputs = () => {
    setArrangedChips([]);
    setTypedSentence('');
    setFeedback(null);
    setInputWarning('');
    setTtsStatus({ speaking: false });
  };

  // Switch difficulty level
  const handleLevelChange = (newLevel: SentenceDifficulty) => {
    setLevel(newLevel);
    setExerciseVariantIndex(0);
    handleResetInputs();
  };

  // Next question ("अगला सवाल") handler
  const handleNextQuestion = () => {
    handleResetInputs();
    setExerciseVariantIndex((prev) => prev + 1);
  };

  const handleChipClick = (chip: string) => {
    if (feedback?.isSubmitted) return;
    setInputWarning('');
    if (arrangedChips.includes(chip)) {
      setArrangedChips((prev) => prev.filter((c) => c !== chip));
    } else {
      setArrangedChips((prev) => [...prev, chip]);
    }
  };

  // Text-To-Speech implementation with genuine fallback message
  const handleSpeakSentence = async (textToSpeak: string) => {
    if (!textToSpeak || !textToSpeak.trim()) return;

    setTtsStatus({ speaking: true, fallbackMessage: undefined });
    try {
      if (typeof window !== 'undefined') {
        const hasSpeech = 'speechSynthesis' in window;
        if (!hasSpeech && settings.ttsProvider === 'browser-speech') {
          setTtsStatus({
            speaking: false,
            fallbackMessage: 'ऑडियो उपलब्ध नहीं है या ब्राउज़र स्पीच समर्थित नहीं है।',
          });
          return;
        }
      }

      await ttsService.speak(textToSpeak, settings);
      setTtsStatus({ speaking: false });
    } catch (err) {
      console.warn('TTS playback issue:', err);
      setTtsStatus({
        speaking: false,
        fallbackMessage: 'ऑडियो उपलब्ध नहीं है या ब्राउज़र स्पीच समर्थित नहीं है।',
      });
    }
  };

  // Check Answer ("उत्तर जाँचें")
  const handleCheckAnswer = () => {
    if (!currentExercise) return;

    const userText =
      inputMode === 'arrange'
        ? arrangedChips.join(' ').trim()
        : typedSentence.trim();

    if (!userText) {
      setInputWarning('कृपया पहले वाक्य बनाने के लिए शब्द चुनें या वाक्य टाइप करें।');
      return;
    }
    setInputWarning('');

    const normUser = normalizeSentence(userText);
    const normExpected = normalizeSentence(currentExercise.expectedSentence);
    const normAlts = currentExercise.acceptedAlternatives.map((alt) =>
      normalizeSentence(alt)
    );

    const isExact = normUser === normExpected;
    const isAlternative = normAlts.includes(normUser);
    const isCorrect = isExact || isAlternative;

    let encouragement = '';
    let explanation = '';

    if (isCorrect) {
      const positiveWords = [
        'शानदार! बिल्कुल सही वाक्य!',
        'बहुत बढ़िया! आपने सटीक क्रम बनाया!',
        'शाबाश! आपका वाक्य बिल्कुल सही है!',
        'उत्कृष्ट! आपने अंग्रेज़ी वाक्य रचना का सही उपयोग किया!',
      ];
      encouragement = positiveWords[Math.floor(Math.random() * positiveWords.length)];
      explanation = currentExercise.explanationHi;

      // Update genuine statistics
      setStats((prev) => ({
        completedCount: prev.completedCount + 1,
        correctCount: prev.correctCount + 1,
        streak: prev.streak + 1,
      }));

      onSentenceCreated?.(userText, true);

      if (settings.autoPlayTeacherVoice) {
        handleSpeakSentence(currentExercise.expectedSentence);
      }
    } else {
      encouragement = 'फिर से कोशिश करें (Try Again)';
      explanation = currentExercise.explanationHi;

      setStats((prev) => ({
        completedCount: prev.completedCount + 1,
        correctCount: prev.correctCount,
        streak: 0,
      }));

      onSentenceCreated?.(userText, false);
    }

    setFeedback({
      isSubmitted: true,
      isCorrect,
      encouragementHi: encouragement,
      explanationHi: explanation,
      correctedSentence: currentExercise.expectedSentence,
    });
  };

  // Word Picker: filter 659 vocabulary list
  const filteredVocabWords = useMemo(() => {
    let list = words;
    if (wordPickerCategory !== 'all') {
      list = list.filter((w) => w.category === wordPickerCategory);
    }
    if (wordSearchQuery.trim()) {
      const q = wordSearchQuery.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.hindiMeaning.toLowerCase().includes(q) ||
          (w.phoneticHindi && w.phoneticHindi.toLowerCase().includes(q))
      );
    }
    return list;
  }, [words, wordPickerCategory, wordSearchQuery]);

  if (showTensesMode) {
    return (
      <FiveTensesPractice
        words={words}
        settings={settings}
        initialSelectedWord={selectedVocabWord}
        onSentenceCreated={onSentenceCreated}
        onBackToSentenceBuilder={() => setShowTensesMode(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ================= 1. HEADER & DIFFICULTY LEVEL SELECTION ================= */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToWords && (
              <button
                type="button"
                onClick={onBackToWords}
                className="w-9 h-9 rounded-xl bg-[#0e1d35] hover:bg-[#152542] border border-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                title="शब्द सूची पर वापस जाएं"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-indigo-950/90 text-indigo-400 border border-indigo-700/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Sentence Builder</span>
                <span className="text-sm font-hindi text-indigo-300 font-normal">
                  (वाक्य बनाना सीखें)
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-hindi mt-0.5">
                हिंदी से अंग्रेज़ी में सही क्रम से वाक्य बनाना सीखें
              </p>
            </div>
          </div>

          {/* Genuine Learning Progress Tracker */}
          <div className="flex items-center gap-2 bg-[#07172b] border border-slate-800 px-3 py-2 rounded-2xl self-start sm:self-auto">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-emerald-400 font-bold">{stats.correctCount}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-slate-300">{stats.completedCount}</span>
              <span className="text-[10px] text-slate-400 font-hindi ml-1">सही</span>
            </div>
            {stats.streak > 1 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 text-[10px] font-bold font-mono">
                🔥 {stats.streak} Streak
              </span>
            )}
          </div>
        </div>

        {/* 5 Tenses Practice Jump Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#081f3b] border border-cyan-800/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-700/60 text-cyan-400 shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white font-hindi">
                  5 Tenses का अभ्यास (5 Tenses Practice)
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/80 font-hindi">
                Present Simple, Past, Future, Continuous & Perfect काल के नियमों का अभ्यास करें
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (onOpenTensesPractice) {
                  onOpenTensesPractice();
                } else {
                  setShowTensesMode(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-hindi text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>काल अभ्यास शुरू करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenListeningShadowing && (
              <button
                type="button"
                onClick={onOpenListeningShadowing}
                className="px-3.5 py-1.5 rounded-xl bg-[#071d33] hover:bg-[#0a2745] text-cyan-300 border border-cyan-800 hover:border-cyan-600 font-bold font-hindi text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>सुनो और बोलो</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Difficulty Level Switcher Tabs (BUG 1 FIX: Real selectable state & visual change) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#07172b] border border-slate-800/80 rounded-2xl">
          {/* Level 1: Beginner */}
          <button
            type="button"
            onClick={() => handleLevelChange('beginner')}
            className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
              level === 'beginner'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 font-extrabold scale-[1.02]'
                : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${level === 'beginner' ? 'bg-white' : 'bg-emerald-400'} hidden sm:inline-block`} />
            <span>1. शुरुआती</span>
            <span className="text-[10px] opacity-90 font-mono">(Beginner)</span>
          </button>

          {/* Level 2: Practice */}
          <button
            type="button"
            onClick={() => handleLevelChange('practice')}
            className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
              level === 'practice'
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 font-extrabold scale-[1.02]'
                : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${level === 'practice' ? 'bg-white' : 'bg-amber-400'} hidden sm:inline-block`} />
            <span>2. अभ्यास</span>
            <span className="text-[10px] opacity-90 font-mono">(Practice)</span>
          </button>

          {/* Level 3: Challenge */}
          <button
            type="button"
            onClick={() => handleLevelChange('challenge')}
            className={`min-h-[46px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer text-center ${
              level === 'challenge'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400 font-extrabold scale-[1.02]'
                : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${level === 'challenge' ? 'bg-white' : 'bg-indigo-400'} hidden sm:inline-block`} />
            <span>3. चुनौती</span>
            <span className="text-[10px] opacity-90 font-mono">(Challenge)</span>
          </button>
        </div>

        {/* Dynamic Level Instruction Banner (BUG 1 FIX: Content changes with level) */}
        <div className={`p-3 rounded-2xl border text-xs font-hindi transition-all ${
          level === 'beginner'
            ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-200'
            : level === 'practice'
            ? 'bg-amber-950/50 border-amber-700/60 text-amber-200'
            : 'bg-indigo-950/50 border-indigo-700/60 text-indigo-200'
        }`}>
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[11px] uppercase px-1.5 py-0.5 rounded-md bg-black/40">
              {level} MODE
            </span>
            <span>
              {level === 'beginner' && 'सरल सकारात्मक वाक्य (Simple Affirmative SVO)'}
              {level === 'practice' && 'नकारात्मक वाक्य और प्रश्नवाचक अभ्यास (Negatives & Questions)'}
              {level === 'challenge' && 'सहेजी गई शब्दावली से लंबे व्यावहारिक वाक्य (Everyday Vocabulary Challenge)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            {level === 'beginner' && 'नियम: कर्ता (Subject: I, You, He, She, We, They) + क्रिया (Verb) + कर्म (Object) का सही क्रम बनाएं।'}
            {level === 'practice' && 'नियम: Do not / Does not का प्रयोग करके नकारात्मक वाक्य या Do / Does / Can से प्रश्न बनाएं।'}
            {level === 'challenge' && 'नियम: रोज़मर्रा के जीवन में काम आने वाले लंबे वाक्य बनाएं और अपनी शब्दावली को मजबूत करें।'}
          </p>
        </div>
      </div>

      {/* ================= 2. SVO CONCEPT & WORD ORDER GUIDE ================= */}
      <div className="bg-[#0b1528] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs sm:text-sm font-hindi">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>हिंदी vs अंग्रेज़ी वाक्य रचना (Word Order):</span>
          </div>
          <button
            type="button"
            onClick={() => setShowOrderGuide(!showOrderGuide)}
            className="text-[11px] text-cyan-400 hover:underline cursor-pointer font-hindi"
          >
            {showOrderGuide ? 'कम देखें (Hide)' : 'नियम समझें (Show Guide)'}
          </button>
        </div>

        {showOrderGuide && (
          <div className="space-y-3 pt-1 text-xs text-slate-300 font-hindi leading-relaxed animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-[#071d18] border border-emerald-600/30 space-y-2">
              <p>
                हिंदी बोलते समय हम कहते हैं: <strong>कर्ता + कर्म + क्रिया</strong> (SOV)। जैसे: <span className="text-white font-semibold">&ldquo;मैं (Subject) खाना (Object) खाता हूँ (Verb)।&rdquo;</span>
              </p>
              <p>
                लेकिन अंग्रेज़ी में नियम हमेशा होता है: <strong>Subject + Verb + Object (SVO)</strong>।
                क्रिया (Verb) कर्म (Object) से पहले आती है: <span className="text-emerald-300 font-bold font-mono">&ldquo;I (S) + eat (V) + food (O).&rdquo;</span>
              </p>
            </div>

            {/* 3 Starter Models for Absolute Beginners */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#09172b] border border-slate-700/70 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">उदाहरण 1:</span>
                <p className="font-bold text-white text-xs">I eat food.</p>
                <p className="text-[11px] text-slate-400">मैं खाना खाता हूँ।</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#09172b] border border-slate-700/70 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">उदाहरण 2:</span>
                <p className="font-bold text-white text-xs">She reads a book.</p>
                <p className="text-[11px] text-slate-400">वह किताब पढ़ती है।</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#09172b] border border-slate-700/70 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">उदाहरण 3:</span>
                <p className="font-bold text-white text-xs">They play cricket.</p>
                <p className="text-[11px] text-slate-400">वे क्रिकेट खेलते हैं।</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. SAVED WORD SELECTION BANNER (BUG 2 FIX) ================= */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-white font-hindi">
              सहेजे गए शब्दों से वाक्य बनाएं (Saved Words: {words.length}):
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsWordPickerOpen(true)}
            className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#0e223d] hover:bg-[#14325a] border border-[#38bdf8]/60 text-[#38bdf8] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-xs active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>शब्द सूची से चुनें ({words.length})</span>
          </button>
        </div>

        {/* Selected Word Active Details Card */}
        {selectedVocabWord ? (
          <div className="p-4 rounded-2xl bg-[#07172b] border border-cyan-600/70 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono font-bold">
                  #{selectedVocabWord.index}
                </span>
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  {selectedVocabWord.word}
                </span>
                <span className="text-xs text-emerald-300 font-hindi">
                  ({selectedVocabWord.phoneticHindi || '—'})
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedVocabWord(null);
                  setChosenMeaning('');
                  setExerciseVariantIndex(0);
                  handleResetInputs();
                  onClearInitialWord?.();
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer font-hindi transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>हटाएं (Clear Word)</span>
              </button>
            </div>

            {/* Multiple Meanings Selector (BUG 2 REQ 6 FIX: Choose intended meaning) */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-hindi font-semibold">
                इच्छित अर्थ चुनें (Selected Meaning):
              </span>
              <div className="flex flex-wrap gap-2">
                {availableMeanings.map((meaning, mIdx) => {
                  const isSelected = (chosenMeaning || availableMeanings[0]) === meaning;
                  return (
                    <button
                      key={mIdx}
                      type="button"
                      onClick={() => {
                        setChosenMeaning(meaning);
                        setExerciseVariantIndex(0);
                        handleResetInputs();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-hindi transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold ring-2 ring-amber-300 shadow-sm'
                          : 'bg-[#182338] hover:bg-[#20304a] border border-slate-700 text-slate-200'
                      }`}
                    >
                      {meaning}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suitability / Instruction Note (BUG 2 REQ 7 FIX) */}
            <div className="text-[11px] text-cyan-200/90 font-hindi bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/60">
              💡 <strong>&ldquo;{selectedVocabWord.word}&rdquo;</strong> से जुड़ा {level === 'beginner' ? 'सरल सकारात्मक' : level === 'practice' ? 'नकारात्मक/प्रश्नवाचक' : 'चुनौतीपूर्ण'} वाक्य नीचे तैयार किया गया है।
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-[#07172b] border border-slate-800 text-xs text-slate-400 font-hindi flex items-center justify-between">
            <span>💡 सामान्य अभ्यास जारी है। विशिष्ट शब्द से वाक्य बनाने के लिए &ldquo;शब्द सूची से चुनें&rdquo; पर टैप करें।</span>
          </div>
        )}
      </div>

      {/* ================= 4. ACTIVE EXERCISE CARD (BUG 2 & 3 FIX: Full interactive exercise) ================= */}
      {currentExercise && (
        <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          {/* Top Exercise Metadata & Speak Sentence Button */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800/80 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                सवाल #{exerciseVariantIndex + 1}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                level === 'beginner'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : level === 'practice'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-700'
              }`}>
                {level}
              </span>
              {currentExercise.targetWord && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Word: {currentExercise.targetWord}
                </span>
              )}
              {currentExercise.roleBadgeHi && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-hindi bg-purple-950 text-purple-300 border border-purple-800/70">
                  {currentExercise.roleBadgeHi}
                </span>
              )}
            </div>

            {/* "Speak this sentence" Button */}
            <button
              type="button"
              disabled={ttsStatus.speaking}
              onClick={() => handleSpeakSentence(currentExercise.expectedSentence)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                ttsStatus.speaking
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-[#0e223d] hover:bg-[#14325a] border border-cyan-700/60 text-cyan-300 active:scale-95'
              }`}
              title="यह वाक्य सुनें"
            >
              <Volume2 className="w-4 h-4" />
              <span>{ttsStatus.speaking ? 'बोल रहे हैं...' : 'वाक्य सुनें (Listen)'}</span>
            </button>
          </div>

          {/* TTS Fallback message if speech engine is unavailable */}
          {ttsStatus.fallbackMessage && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs font-hindi flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{ttsStatus.fallbackMessage}</span>
            </div>
          )}

          {/* One short, natural English example sentence + its correct Hindi meaning */}
          {currentExercise.exampleSentenceEn && (
            <div className="bg-[#08182d] border border-cyan-800/80 rounded-2xl p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 font-hindi flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>सरल उदाहरण (Everyday Example):</span>
                </span>
                <button
                  type="button"
                  disabled={ttsStatus.speaking}
                  onClick={() => handleSpeakSentence(currentExercise.exampleSentenceEn!)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer font-medium active:scale-95"
                  title="उदाहरण वाक्य सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>उदाहरण सुनें</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5">
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  &ldquo;{currentExercise.exampleSentenceEn}&rdquo;
                </span>
                <span className="text-xs sm:text-sm text-emerald-300 font-hindi">
                  ({currentExercise.exampleSentenceHi})
                </span>
              </div>
            </div>
          )}

          {/* Practice Question Prompt */}
          <div className="text-center p-4 sm:p-5 rounded-2xl bg-[#07172b] border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-hindi font-bold">
              <span>🎯 अभ्यास प्रश्न (Practice Question):</span>
            </div>
            <span className="text-xs text-slate-400 font-hindi block">
              इस हिंदी वाक्य का सही अंग्रेज़ी अनुवाद बनाएं:
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-hindi">
              &ldquo;{currentExercise.hindiPrompt}&rdquo;
            </h3>
            {currentExercise.ruleTipHi && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-[11px] font-mono">
                संरचना: {currentExercise.ruleTipHi}
              </span>
            )}
          </div>

          {/* Input Mode Toggle: Arrange Words vs Type Sentence */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-hindi">वाक्य बनाने का तरीका:</span>
            <div className="flex items-center gap-1 bg-[#07172b] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setInputMode('arrange');
                  handleResetInputs();
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
                  handleResetInputs();
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

          {/* ===== 4A. ARRANGE MODE: Drop Area & Clickable Chips ===== */}
          {inputMode === 'arrange' && (
            <div className="space-y-4">
              {/* Drop / Placement Area */}
              <div className="min-h-[72px] p-4 rounded-2xl border-2 border-dashed border-indigo-500/50 bg-[#09152a] flex flex-wrap items-center justify-center gap-2.5 transition-all">
                {arrangedChips.length === 0 ? (
                  <span className="text-xs text-slate-500 font-hindi text-center">
                    नीचे दिए गए शब्दों पर सही क्रम में टैप करके वाक्य बनाएं...
                  </span>
                ) : (
                  arrangedChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={feedback?.isSubmitted}
                      onClick={() => handleChipClick(chip)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md active:scale-95 animate-in zoom-in-95 duration-100"
                      title="हटाने के लिए टैप करें"
                    >
                      {chip}
                    </button>
                  ))
                )}
              </div>

              {/* Available Chips to Tap */}
              <div className="space-y-2 text-center">
                <span className="text-xs text-slate-400 font-hindi">
                  उपलब्ध शब्द (Available Chips - टैप करें):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {currentChips.map((chip, idx) => {
                    const isUsed = arrangedChips.includes(chip);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isUsed || feedback?.isSubmitted}
                        onClick={() => handleChipClick(chip)}
                        className={`min-h-[42px] px-4 py-2 rounded-xl font-bold text-sm sm:text-base border transition-all cursor-pointer shadow-xs ${
                          isUsed
                            ? 'opacity-30 border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed scale-95'
                            : 'border-cyan-600/60 bg-[#0e1d35] hover:bg-[#142642] text-cyan-200 active:scale-95 hover:border-cyan-400'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===== 4B. TYPE MODE: Direct text input ===== */}
          {inputMode === 'type' && (
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 font-hindi">
                यहाँ अंग्रेज़ी वाक्य लिखें:
              </label>
              <input
                type="text"
                value={typedSentence}
                disabled={feedback?.isSubmitted}
                onChange={(e) => {
                  setTypedSentence(e.target.value);
                  setInputWarning('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckAnswer();
                }}
                placeholder="उदा. We play cricket / I eat food..."
                className="w-full px-4 py-3 rounded-2xl bg-[#091426] border border-slate-700 text-white text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Input warning if user attempts to check empty answer */}
          {inputWarning && (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-600 text-amber-200 text-xs font-hindi flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{inputWarning}</span>
            </div>
          )}

          {/* ===== 4C. FEEDBACK DISPLAY (BUG 3 FIX) ===== */}
          {feedback && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-hindi leading-relaxed space-y-2 animate-in fade-in duration-200 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/80 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span>{feedback.encouragementHi}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakSentence(feedback.correctedSentence)}
                  className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  title="सही वाक्य सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>सुनें</span>
                </button>
              </div>

              <p className="text-slate-200">{feedback.explanationHi}</p>

              {/* Show Corrected Example Sentence */}
              <div className="p-3 rounded-xl bg-black/40 border border-slate-700/60 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                  मानक अंग्रेज़ी वाक्य (Corrected Example):
                </span>
                <p className="font-bold text-white text-sm sm:text-base font-mono">
                  &ldquo;{feedback.correctedSentence}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* ===== 4D. ACTION BUTTONS: "उत्तर जाँचें" & "अगला सवाल" (BUG 3 FIX) ===== */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleResetInputs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
            >
              रीसेट (Reset)
            </button>

            <div className="flex items-center gap-2.5">
              {!feedback?.isSubmitted ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span>उत्तर जाँचें</span>
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <span>अगला सवाल</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Skip / Next Question button always available if learner wants another exercise */}
              {!feedback?.isSubmitted && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0e1d35] hover:bg-[#152542] border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="दूसरा सवाल देखें"
                >
                  <span>अगला सवाल</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. VOCABULARY SELECTION MODAL (ALL 659 WORDS) ================= */}
      {isWordPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0b1528] border border-slate-700 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>शब्द चुनें (Select from Saved Words)</span>
                </h3>
                <p className="text-xs text-slate-400 font-hindi mt-0.5">
                  कुल {words.length} सहेजे गए शब्दों में से किसी एक को चुनें
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWordPickerOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="p-4 border-b border-slate-800/80 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={wordSearchQuery}
                  onChange={(e) => setWordSearchQuery(e.target.value)}
                  placeholder="खोजें: English शब्द या हिंदी अर्थ (उदा. We, Book)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#07172b] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-hindi">
                <button
                  type="button"
                  onClick={() => setWordPickerCategory('all')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                    wordPickerCategory === 'all'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'bg-[#0e1d35] text-slate-400 hover:text-white'
                  }`}
                >
                  सभी ({words.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWordPickerCategory('to_learn')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                    wordPickerCategory === 'to_learn'
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-[#0e1d35] text-slate-400 hover:text-white'
                  }`}
                >
                  याद करना है
                </button>
                <button
                  type="button"
                  onClick={() => setWordPickerCategory('confusion')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                    wordPickerCategory === 'confusion'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-[#0e1d35] text-slate-400 hover:text-white'
                  }`}
                >
                  Confusion वाला
                </button>
                <button
                  type="button"
                  onClick={() => setWordPickerCategory('mastered')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                    wordPickerCategory === 'mastered'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-[#0e1d35] text-slate-400 hover:text-white'
                  }`}
                >
                  याद हो गया
                </button>
              </div>
            </div>

            {/* Words List Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredVocabWords.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-hindi">
                  कोई शब्द नहीं मिला।
                </div>
              ) : (
                filteredVocabWords.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#07172b] hover:bg-[#0c223d] border border-slate-800 hover:border-cyan-600/60 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-400 font-mono font-semibold">
                          #{item.index}
                        </span>
                        <span className="font-bold text-white text-sm font-mono truncate">
                          {item.word}
                        </span>
                        <span className="text-xs text-emerald-300 font-hindi">
                          ({item.phoneticHindi || '—'})
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90 font-hindi truncate mt-0.5">
                        {item.hindiMeaning}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVocabWord(item);
                        setChosenMeaning('');
                        setExerciseVariantIndex(0);
                        setIsWordPickerOpen(false);
                        handleResetInputs();
                      }}
                      className="min-h-[36px] px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-hindi flex items-center gap-1 cursor-pointer shrink-0 transition-all shadow-xs active:scale-95"
                    >
                      <span>वाक्य बनाएं</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#07172b] border-t border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-hindi">
                कुल {filteredVocabWords.length} शब्द उपलब्ध
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
