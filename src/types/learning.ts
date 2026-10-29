export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum QuestionType {
  HINDI_TO_ENGLISH = 'HINDI_TO_ENGLISH', // Type A
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK', // Type B
  SITUATION_BASED = 'SITUATION_BASED', // Type C
  MEANING = 'MEANING', // Type D
  MAKE_SENTENCE = 'MAKE_SENTENCE', // Type E
  REVERSE_RECALL = 'REVERSE_RECALL', // Type F
}

export enum WordMasteryStatus {
  NEW = 'New',
  LEARNING = 'Learning',
  NEEDS_PRACTICE = 'Needs Practice',
  MASTERED = 'Mastered',
}

export type VocabCategory = 'to_learn' | 'confusion' | 'mastered';

export interface VocabularyWord {
  id: string;
  index: number;
  word: string;
  hindiMeaning: string;
  phoneticHindi: string;
  pronunciationTipHindi: string;
  usageExplanationHindi: string;
  simpleSentence: string;
  realLifeSentence: string;
  questionPromptEn: string;
  questionTypeA_HindiToEn: string;
  questionTypeB_FillBlank: string;
  questionTypeC_SituationHindi: string;
  questionTypeD_MeaningHindi: string;
  category?: VocabCategory;
  status: WordMasteryStatus;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  speakingCorrectCount: number;
  lastPracticedAt?: number;
  nextReviewAt?: number;
  easeFactor: number;
  intervalDays: number;
  lastErrorType?: string;
}

export interface QuestionInstance {
  id: string;
  wordId: string;
  word: VocabularyWord;
  type: QuestionType;
  typeLabel: string;
  promptHindi: string;
  promptEnglish?: string;
  expectedAnswer: string;
  hintText: string;
  requiresSpeaking?: boolean;
}

export interface AnswerEvaluation {
  status: 'CORRECT_NATURAL' | 'CORRECT_ALT' | 'GRAMMATICALLY_CORRECT_UNNATURAL' | 'NEEDS_CORRECTION';
  isAccepted: boolean;
  requiresRetry: boolean;
  feedbackHindi: string;
  correctedSentence: string;
  primaryErrorCategory: string;
  errorHighlightWrong: string;
  errorHighlightRight: string;
  grammarScore: number;
  pronunciationScore: number;
  pronunciationTipHindi: string;
  spokenTeacherResponse: string;
}

export interface PronunciationCheckResult {
  status: 'CORRECT' | 'NEEDS_PRACTICE';
  score: number;
  syllableBreakdownEn: string;
  syllableBreakdownHi: string;
  feedbackHindi: string;
  focusSound: string;
}

export interface ConversationMessage {
  id: string;
  role: 'teacher' | 'learner';
  content: string;
  timestamp: number;
  targetWordsUsed?: string[];
  hadMistake?: boolean;
  correctedEnglishSentence?: string;
  mistakeExplanationHindi?: string;
  askToRepeatCorrection?: boolean;
  englishPromptOrExample?: string;
  audioUrl?: string;
}

export interface AudioHistoryEntry {
  id: string;
  timestamp: number;
  wordOrContext: string;
  expectedSentence: string;
  recognizedText: string;
  audioDataUrl?: string;
  pronunciationScore: number;
  grammarScore: number;
  feedbackHindi: string;
}

export interface LearnerLevelMeta {
  code: DifficultyLevel;
  cefr: string;
  nameHi: string;
  descriptionHi: string;
  badgeColor: string;
}

export const LEARNER_LEVELS: Record<DifficultyLevel, LearnerLevelMeta> = {
  [DifficultyLevel.BEGINNER]: {
    code: DifficultyLevel.BEGINNER,
    cefr: 'Pre-A1 / A1',
    nameHi: 'शुरुआती स्तर (Foundation)',
    descriptionHi: 'रोज़मर्रा के 654 बुनियादी शब्द, SVO वाक्य और सरल अभिवादन।',
    badgeColor: 'emerald',
  },
  [DifficultyLevel.INTERMEDIATE]: {
    code: DifficultyLevel.INTERMEDIATE,
    cefr: 'A2 / B1',
    nameHi: 'बुनियादी व व्यावहारिक स्तर',
    descriptionHi: '5 मुख्य काल (Tenses), रोज़मर्रा के संवाद और आत्मविश्वास से बातचीत।',
    badgeColor: 'sky',
  },
  [DifficultyLevel.ADVANCED]: {
    code: DifficultyLevel.ADVANCED,
    cefr: 'B2',
    nameHi: 'उन्नत स्तर (Fluent)',
    descriptionHi: 'जटिल वाक्य, मुहावरेदार बोलचाल और सहज धाराप्रवाह अंग्रेज़ी।',
    badgeColor: 'indigo',
  },
};

export interface PlacementQuestion {
  id: string;
  category: 'vocabulary' | 'grammar' | 'listening' | 'comprehension';
  questionHi: string;
  audioPromptEn?: string;
  options: string[];
  correctIndex: number;
  explanationHi: string;
}

export interface AppSettings {
  ttsProvider: 'gemini-tts' | 'browser-speech';
  sttProvider: 'web-speech-plus-gemini' | 'gemini-transcribe';
  aiVoiceName: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';
  voiceGender: 'Female' | 'Male';
  speakingSpeed: 'normal' | 'slow';
  autoPlayTeacherVoice: boolean;
  hindiExplanationRatio: number;
  difficulty: DifficultyLevel;
  saveAudioHistory: boolean;
  darkMode: boolean;
  dailyGoalMinutes?: number;
}

export interface LearnerMemory {
  streakDays: number;
  lastActiveDate: string;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  accuracyHistory: number[];
  pronunciationScores: number[];
  grammarScores: number[];
  speakingScores: number[];
  commonGrammarMistakes: string[];
  pronunciationDifficulties: string[];
  dailyPracticeCompletedDate?: string;
  recommendedLevel?: DifficultyLevel;
  placementAssessment?: {
    completed: boolean;
    date: string;
    score: number;
    total: number;
    assignedLevel: DifficultyLevel;
    breakdown: {
      vocabulary: number;
      grammar: number;
      listening: number;
    };
  };
  todayMinutesSpent?: {
    date: string;
    vocabularyMinutes: number;
    sentenceMinutes: number;
    listeningMinutes: number;
    speakingMinutes: number;
  };
  completed10DayLessons?: number[];
  fiftySentenceSprintHistory?: {
    date: string;
    sentencesCreated: number;
    score: number;
  }[];
}

export interface WordContextBreakdown {
  word: string;
  partOfSpeech: string;
  primaryHindiMeaning: string;
  phoneticHindi: string;
  pronunciationTipHindi?: string;
  situationContext: string;
  primaryExampleEn: string;
  primaryExampleHi: string;
  whyUsedHindi: string;
  difficultyLevel?: DifficultyLevel;
  secondaryUsage?: {
    hasSecondaryMeaning: boolean;
    secondaryMeaningHindi: string;
    secondaryContext: string;
    secondaryExampleEn: string;
    secondaryExampleHi: string;
    secondaryWhyUsedHindi: string;
  };
  practicalTip?: string;
}

export type ActiveTab =
  | 'onboarding'
  | 'words'
  | 'daily'
  | 'teacher'
  | 'dashboard'
  | 'settings';
