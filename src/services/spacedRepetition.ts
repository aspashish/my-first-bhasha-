import { DifficultyLevel, QuestionInstance, QuestionType, VocabularyWord, WordMasteryStatus } from '../types/learning';

export function updateWordSpacedRepetition(
  word: VocabularyWord,
  isCorrect: boolean,
  isSpoken: boolean,
  errorCategory?: string
): VocabularyWord {
  const now = Date.now();
  const attempts = word.attempts + 1;
  const correctCount = isCorrect ? word.correctCount + 1 : word.correctCount;
  const wrongCount = isCorrect ? word.wrongCount : word.wrongCount + 1;
  const speakingCorrectCount =
    isCorrect && isSpoken ? word.speakingCorrectCount + 1 : word.speakingCorrectCount;

  let easeFactor = word.easeFactor;
  let intervalDays = word.intervalDays;

  if (isCorrect) {
    easeFactor = Math.min(3.0, easeFactor + 0.12);
    if (intervalDays === 0) intervalDays = 1;
    else if (intervalDays === 1) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor);
  } else {
    easeFactor = Math.max(1.3, easeFactor - 0.25);
    intervalDays = 0;
  }

  let status = word.status;
  if (!isCorrect) {
    status = WordMasteryStatus.NEEDS_PRACTICE;
  } else if (correctCount >= 3 && (speakingCorrectCount >= 1 || correctCount > wrongCount + 1)) {
    status = WordMasteryStatus.MASTERED;
  } else if (correctCount >= 1) {
    status = wrongCount > correctCount ? WordMasteryStatus.NEEDS_PRACTICE : WordMasteryStatus.LEARNING;
  }

  const nextReviewDelayMs = isCorrect
    ? Math.max(1, intervalDays) * 60 * 60 * 1000
    : 5 * 60 * 1000;

  return {
    ...word,
    attempts,
    correctCount,
    wrongCount,
    speakingCorrectCount,
    status,
    easeFactor,
    intervalDays,
    lastPracticedAt: now,
    nextReviewAt: now + nextReviewDelayMs,
    lastErrorType: !isCorrect && errorCategory && errorCategory !== 'NONE' ? errorCategory : word.lastErrorType,
  };
}

export function selectOrderedWordsForSession(words: VocabularyWord[]): VocabularyWord[] {
  const unpracticed = words.filter((w) => w.attempts === 0).sort((a, b) => a.index - b.index);
  const needsPractice = words
    .filter((w) => w.attempts > 0 && w.status === WordMasteryStatus.NEEDS_PRACTICE)
    .sort((a, b) => (a.nextReviewAt || 0) - (b.nextReviewAt || 0));
  const learning = words
    .filter((w) => w.attempts > 0 && w.status === WordMasteryStatus.LEARNING)
    .sort((a, b) => a.index - b.index);
  const mastered = words
    .filter((w) => w.status === WordMasteryStatus.MASTERED)
    .sort((a, b) => a.index - b.index);

  return [...unpracticed, ...needsPractice, ...learning, ...mastered];
}

const QUESTION_TYPES_ROTATION: QuestionType[] = [
  QuestionType.SITUATION_BASED,
  QuestionType.HINDI_TO_ENGLISH,
  QuestionType.FILL_IN_THE_BLANK,
  QuestionType.MAKE_SENTENCE,
  QuestionType.MEANING,
  QuestionType.REVERSE_RECALL,
];

export function createQuestionForWord(
  word: VocabularyWord,
  sequenceIndex: number,
  forcedType?: QuestionType,
  difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
): QuestionInstance {
  const typeIndex = (sequenceIndex + word.attempts) % QUESTION_TYPES_ROTATION.length;
  const qType = forcedType || QUESTION_TYPES_ROTATION[typeIndex];

  const isBeginner = difficulty === DifficultyLevel.BEGINNER;
  const isAdvanced = difficulty === DifficultyLevel.ADVANCED;

  switch (qType) {
    case QuestionType.HINDI_TO_ENGLISH:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.HINDI_TO_ENGLISH,
        typeLabel: 'Type A · Hindi to English',
        promptHindi: isAdvanced
          ? `इस वाक्य को अधिक प्राकृतिक और fluent English में अनुवाद करें: "${word.questionTypeA_HindiToEn}"`
          : `इस वाक्य को English में बोलिए या लिखिए: "${word.questionTypeA_HindiToEn}"`,
        promptEnglish: `Target word: "${word.word}" (उच्चारण: [${word.phoneticHindi}], अर्थ: ${word.hindiMeaning})`,
        expectedAnswer: isAdvanced ? word.realLifeSentence : word.simpleSentence,
        hintText: isBeginner
          ? `शुरुआत ऐसे करें: "${word.simpleSentence}"`
          : `Try using "${word.word}" fluently — e.g., "${word.realLifeSentence}"`,
        requiresSpeaking: true,
      };

    case QuestionType.FILL_IN_THE_BLANK:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.FILL_IN_THE_BLANK,
        typeLabel: 'Type B · Fill in the Blank',
        promptHindi: `खाली जगह में सही English शब्द भरिए या पूरा वाक्य बोलिए:`,
        promptEnglish: word.questionTypeB_FillBlank,
        expectedAnswer: word.word,
        hintText: `अर्थ: ${word.hindiMeaning} · उच्चारण: [${word.phoneticHindi}]`,
        requiresSpeaking: false,
      };

    case QuestionType.SITUATION_BASED:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.SITUATION_BASED,
        typeLabel: 'Type C · Real-Life Situation',
        promptHindi: word.questionTypeC_SituationHindi,
        promptEnglish: `Use "${word.word}" in your response (उच्चारण: [${word.phoneticHindi}])`,
        expectedAnswer: isAdvanced ? word.realLifeSentence : word.simpleSentence,
        hintText: `संभावित वाक्य: "${isAdvanced ? word.realLifeSentence : word.simpleSentence}"`,
        requiresSpeaking: true,
      };

    case QuestionType.MEANING:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.MEANING,
        typeLabel: 'Type D · Word Meaning & Usage',
        promptHindi: `"${word.word}" का अर्थ और उच्चारण क्या है? (${word.questionTypeD_MeaningHindi})`,
        promptEnglish: `Explain "${word.word}" in English or simple Hindi`,
        expectedAnswer: `${word.hindiMeaning} - ${word.simpleSentence}`,
        hintText: `उच्चारण: [${word.phoneticHindi}] · उदाहरण: "${word.simpleSentence}"`,
        requiresSpeaking: false,
      };

    case QuestionType.MAKE_SENTENCE:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.MAKE_SENTENCE,
        typeLabel: 'Type E · Make a Sentence',
        promptHindi: isAdvanced
          ? `"${word.word}" (${word.hindiMeaning}) शब्द का उपयोग करके एक complex या practical English sentence बोलिए।`
          : `"${word.word}" (${word.hindiMeaning}) शब्द का उपयोग करके एक नया English sentence बनाइए।`,
        promptEnglish: `Make an English sentence using "${word.word}".`,
        expectedAnswer: word.realLifeSentence,
        hintText: `उदाहरण: "${word.realLifeSentence}"`,
        requiresSpeaking: true,
      };

    case QuestionType.REVERSE_RECALL:
    default:
      return {
        id: `q-${word.id}-${qType}-${Date.now()}`,
        wordId: word.id,
        word,
        type: QuestionType.REVERSE_RECALL,
        typeLabel: 'Type F · Reverse Recall',
        promptHindi: `English शब्द "${word.word}" (उच्चारण: [${word.phoneticHindi}]) का हिंदी में मतलब बताइए।`,
        promptEnglish: `Word: "${word.word}"`,
        expectedAnswer: word.hindiMeaning,
        hintText: `वाक्य में प्रयोग: "${word.simpleSentence}"`,
        requiresSpeaking: false,
      };
  }
}
