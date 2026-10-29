import {
  AnswerEvaluation,
  DifficultyLevel,
  PronunciationCheckResult,
  QuestionInstance,
  QuestionType,
  VocabularyWord,
  WordContextBreakdown,
} from '../types/learning';
import {
  createEnrichedWordFallback,
  CURATED_DICTIONARY,
  generateDynamicWordSentences,
} from '../data/seedVocabulary';

export interface WordExampleItem {
  english: string;
  hindiTranslation: string;
  categoryLabel: string;
}

export async function enrichVocabularyBatch(
  rawWords: string[],
  difficulty: DifficultyLevel
): Promise<VocabularyWord[]> {
  const initialList = rawWords.map((w, idx) => createEnrichedWordFallback(w, idx + 1));
  const unknownWords = initialList
    .filter((item) => !CURATED_DICTIONARY[item.word.toLowerCase()])
    .map((item) => item.word);

  if (unknownWords.length === 0) {
    return initialList;
  }

  try {
    const res = await fetch('/api/ai/enrich-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: unknownWords, difficulty }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.enriched)) {
        const enrichedMap = new Map<string, any>();
        for (const item of data.enriched) {
          if (item.word) {
            enrichedMap.set(item.word.toLowerCase().trim(), item);
          }
        }

        return initialList.map((w) => {
          const aiData = enrichedMap.get(w.word.toLowerCase());
          if (!aiData) return w;
          return {
            ...w,
            hindiMeaning: aiData.hindiMeaning || w.hindiMeaning,
            phoneticHindi: aiData.phoneticHindi || w.phoneticHindi,
            pronunciationTipHindi: aiData.pronunciationTipHindi || w.pronunciationTipHindi,
            usageExplanationHindi: aiData.usageExplanationHindi || w.usageExplanationHindi,
            simpleSentence: aiData.simpleSentence || w.simpleSentence,
            realLifeSentence: aiData.realLifeSentence || w.realLifeSentence,
            questionPromptEn: aiData.questionPromptEn || w.questionPromptEn,
            questionTypeA_HindiToEn: aiData.questionTypeA_HindiToEn || w.questionTypeA_HindiToEn,
            questionTypeB_FillBlank: aiData.questionTypeB_FillBlank || w.questionTypeB_FillBlank,
            questionTypeC_SituationHindi:
              aiData.questionTypeC_SituationHindi || w.questionTypeC_SituationHindi,
            questionTypeD_MeaningHindi:
              aiData.questionTypeD_MeaningHindi || w.questionTypeD_MeaningHindi,
          };
        });
      }
    }
  } catch {
    // Keep fallback
  }

  return initialList;
}

export async function evaluateLearnerAnswer(
  question: QuestionInstance,
  userAnswer: string,
  difficulty: DifficultyLevel,
  hindiRatio: number,
  isSpoken: boolean
): Promise<AnswerEvaluation> {
  const cleanUser = userAnswer.trim();

  try {
    const res = await fetch('/api/ai/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: question.word.word,
        hindiMeaning: question.word.hindiMeaning,
        questionType: question.type,
        questionPrompt: `${question.promptHindi} ${question.promptEnglish || ''}`,
        expectedAnswer: question.expectedAnswer,
        userAnswer: cleanUser,
        difficulty,
        hindiRatio,
        isSpoken,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.status) {
        return data as AnswerEvaluation;
      }
    }
  } catch {
    // Fallback locally
  }

  return evaluateLocallyFallback(question, cleanUser);
}

function evaluateLocallyFallback(
  question: QuestionInstance,
  userAnswer: string
): AnswerEvaluation {
  const lower = userAnswer.toLowerCase().trim();
  const targetWord = question.word.word.toLowerCase();

  if (/yesterday/i.test(lower) && /\b(am go|is go|go|goes|borrow|decide)\b/i.test(lower) && !/\b(did|didn't|wanted|went|borrowed|decided)\b/i.test(lower)) {
    const corrected = userAnswer
      .replace(/\bam go\b/i, 'went')
      .replace(/\bgo\b/i, 'went');
    return {
      status: 'NEEDS_CORRECTION',
      isAccepted: false,
      requiresRetry: true,
      feedbackHindi: 'अच्छी कोशिश! लेकिन यहाँ past tense चाहिए क्योंकि आपने बीते हुए समय (yesterday) की बात की है।',
      correctedSentence: corrected !== userAnswer ? corrected : question.word.simpleSentence,
      primaryErrorCategory: 'TENSE',
      errorHighlightWrong: userAnswer,
      errorHighlightRight: corrected !== userAnswer ? corrected : question.word.simpleSentence,
      grammarScore: 62,
      pronunciationScore: 80,
      pronunciationTipHindi: question.word.pronunciationTipHindi,
      spokenTeacherResponse: `अच्छी कोशिश! लेकिन यहाँ past tense आएगा। सही वाक्य है: ${
        corrected !== userAnswer ? corrected : question.word.simpleSentence
      }. अब एक बार सही sentence बोलिए।`,
    };
  }

  if (targetWord === 'borrow' && /\btake\b/i.test(lower) && !/\bborrow\b/i.test(lower)) {
    return {
      status: 'NEEDS_CORRECTION',
      isAccepted: false,
      requiresRetry: true,
      feedbackHindi:
        'आपने यहाँ "take" का इस्तेमाल किया है, लेकिन किसी से कुछ समय के लिए कोई चीज़ उधार लेने के लिए "borrow" बेहतर शब्द है।',
      correctedSentence: question.word.simpleSentence,
      primaryErrorCategory: 'VOCABULARY',
      errorHighlightWrong: 'take',
      errorHighlightRight: 'borrow',
      grammarScore: 70,
      pronunciationScore: 84,
      pronunciationTipHindi: question.word.pronunciationTipHindi,
      spokenTeacherResponse: `यहाँ उधार लेने के लिए 'borrow' सही शब्द है। सही sentence है: ${question.word.simpleSentence}.`,
    };
  }

  if (question.type === QuestionType.FILL_IN_THE_BLANK) {
    if (lower.includes(targetWord)) {
      return {
        status: 'CORRECT_NATURAL',
        isAccepted: true,
        requiresRetry: false,
        feedbackHindi: `बहुत बढ़िया! "${question.word.word}" बिल्कुल सही जवाब है।`,
        correctedSentence: question.word.simpleSentence,
        primaryErrorCategory: 'NONE',
        errorHighlightWrong: '',
        errorHighlightRight: question.word.word,
        grammarScore: 96,
        pronunciationScore: 92,
        pronunciationTipHindi: question.word.pronunciationTipHindi,
        spokenTeacherResponse: `Excellent! "${question.word.word}" बिल्कुल सही जवाब है।`,
      };
    }
  }

  if (lower.includes(targetWord)) {
    const wordCount = lower.split(/\s+/).length;
    if (wordCount >= 3) {
      return {
        status: 'CORRECT_NATURAL',
        isAccepted: true,
        requiresRetry: false,
        feedbackHindi: `Excellent! आपका वाक्य "${userAnswer}" व्याकरण और अर्थ के हिसाब से सही है।`,
        correctedSentence: userAnswer,
        primaryErrorCategory: 'NONE',
        errorHighlightWrong: '',
        errorHighlightRight: '',
        grammarScore: 95,
        pronunciationScore: 90,
        pronunciationTipHindi: question.word.pronunciationTipHindi,
        spokenTeacherResponse: `Excellent! Correct sentence. चलिए अगले शब्द पर चलते हैं।`,
      };
    } else {
      return {
        status: 'NEEDS_CORRECTION',
        isAccepted: false,
        requiresRetry: true,
        feedbackHindi: `कृपया इसे पूरे English sentence में बोलिए, जैसे "${question.word.simpleSentence}"।`,
        correctedSentence: question.word.simpleSentence,
        primaryErrorCategory: 'GRAMMAR',
        errorHighlightWrong: userAnswer,
        errorHighlightRight: question.word.simpleSentence,
        grammarScore: 65,
        pronunciationScore: 82,
        pronunciationTipHindi: question.word.pronunciationTipHindi,
        spokenTeacherResponse: `कृपया पूरा वाक्य बोलिए, जैसे: "${question.word.simpleSentence}"`,
      };
    }
  }

  return {
    status: 'NEEDS_CORRECTION',
    isAccepted: false,
    requiresRetry: true,
    feedbackHindi: `इस वाक्य में "${question.word.word}" (${question.word.hindiMeaning}) का उपयोग करने की कोशिश करें।`,
    correctedSentence: question.word.simpleSentence,
    primaryErrorCategory: 'VOCABULARY',
    errorHighlightWrong: userAnswer,
    errorHighlightRight: question.word.simpleSentence,
    grammarScore: 58,
    pronunciationScore: 76,
    pronunciationTipHindi: question.word.pronunciationTipHindi,
    spokenTeacherResponse: `यहाँ "${question.word.word}" शब्द का उपयोग करना बेहतर होगा। सही sentence है: "${question.word.simpleSentence}".`,
  };
}

export async function analyzePronunciation(
  wordObj: VocabularyWord,
  targetText: string,
  spokenTranscript: string,
  audioBase64?: string,
  mimeType?: string
): Promise<PronunciationCheckResult> {
  try {
    const res = await fetch('/api/ai/check-pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetText,
        spokenTranscript,
        word: wordObj.word,
        phoneticHindi: wordObj.phoneticHindi,
        audioBase64,
        mimeType,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.status) {
        return data as PronunciationCheckResult;
      }
    }
  } catch {
    // Fallback
  }

  const isMatch =
    spokenTranscript.toLowerCase().includes(wordObj.word.toLowerCase()) ||
    spokenTranscript.length >= 3;

  return {
    status: isMatch ? 'CORRECT' : 'NEEDS_PRACTICE',
    score: isMatch ? 92 : 68,
    syllableBreakdownEn: wordObj.word,
    syllableBreakdownHi: wordObj.phoneticHindi,
    feedbackHindi: isMatch
      ? `बहुत बढ़िया उच्चारण! आपने "${wordObj.word}" (${wordObj.phoneticHindi}) को साफ़ बोला है।`
      : `बहुत अच्छा प्रयास था। सिर्फ "${wordObj.phoneticHindi}" के sound पर थोड़ा ध्यान देना है। ${wordObj.pronunciationTipHindi}`,
    focusSound: wordObj.phoneticHindi,
  };
}

export async function generateWordExamples(
  word: string,
  hindiMeaning?: string,
  difficulty?: DifficultyLevel
): Promise<WordExampleItem[]> {
  try {
    const res = await fetch('/api/ai/generate-examples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: word.trim(),
        hindiMeaning,
        difficulty: difficulty || DifficultyLevel.BEGINNER,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.examples) && data.examples.length > 0) {
        return data.examples;
      }
    }
  } catch (err) {
    console.warn('AI word examples fetch failed, falling back to local generator:', err);
  }

  // Local fallback with rich natural sentences
  const dynamic = generateDynamicWordSentences(word);
  return [
    {
      english: dynamic.simpleSentence,
      hindiTranslation: `दैनिक बातचीत: "${word}" का सरल व्यावहारिक प्रयोग`,
      categoryLabel: 'Daily Life',
    },
    {
      english: dynamic.realLifeSentence,
      hindiTranslation: `बातचीत / अनुरोध: "${word}" का स्वाभाविक वाक्य`,
      categoryLabel: 'Conversation',
    },
    {
      english: dynamic.questionPromptEn,
      hindiTranslation: `प्रश्न शैली: "${word}" का संवादात्मक रूप`,
      categoryLabel: 'Question Practice',
    },
  ];
}

// ----------------------------------------------------
// Deep Semantic Word & Context Breakdown Engine
// ----------------------------------------------------
export const SEMANTIC_CURATED_WORDS: Record<string, Partial<WordContextBreakdown>> = {
  borrow: {
    partOfSpeech: 'Verb (क्रिया)',
    primaryHindiMeaning: 'उधार लेना / कुछ समय के लिए मांगना',
    phoneticHindi: 'बॉरो',
    pronunciationTipHindi: 'शुरुआत में "बॉ" बोलें और अंत में "रो" — "बॉ-रो"। "बोरो" न बोलें।',
    situationContext: 'Weather & Rainy Day (बारिश व मौसम)',
    primaryExampleEn: "Can I borrow your umbrella? It's raining outside.",
    primaryExampleHi: 'क्या मैं आपकी छतरी ले सकता हूँ? बाहर बारिश हो रही है।',
    whyUsedHindi: 'यहाँ borrow का अर्थ किसी से कोई चीज़ कुछ समय के लिए मांगना और उपयोग के बाद लौटाना है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'ऋण लेना / पैसे उधार लेना',
      secondaryContext: 'Financial Need (पैसों की आवश्यकता)',
      secondaryExampleEn: 'He had to borrow money from his friend to pay the fees.',
      secondaryExampleHi: 'फीस भरने के लिए उसे अपने दोस्त से पैसे उधार लेने पड़े।',
      secondaryWhyUsedHindi: 'वस्तुओं के साथ-साथ वित्तीय सहायता मांगने पर भी borrow का उपयोग होता है।',
    },
    practicalTip: 'ध्यान दें: "Borrow" का मतलब किसी से उधार लेना है, जबकि किसी को उधार देने को "Lend" कहते हैं।',
  },
  exhausted: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'बहुत थका हुआ / पूरी तरह थका हुआ',
    phoneticHindi: 'एग्ज़ॉस्टेड',
    pronunciationTipHindi: '"एग-ज़ॉ-स्टेड" बोलें। "x" की आवाज़ "ग्ज़" जैसी निकलती है।',
    situationContext: 'Work & Long Shift (दिनभर की कड़ी मेहनत)',
    primaryExampleEn: 'After working all day, she was completely exhausted.',
    primaryExampleHi: 'दिनभर काम करने के बाद, वह पूरी तरह थक चुकी थी।',
    whyUsedHindi: 'यहाँ exhausted का मतलब सिर्फ साधारण "tired" नहीं बल्कि ऊर्जा पूरी तरह समाप्त होना (अत्यधिक थका हुआ) है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'संसाधन या विकल्प समाप्त होना',
      secondaryContext: 'Resources & Solutions (विकल्प खत्म होना)',
      secondaryExampleEn: 'We have exhausted all other options and must decide now.',
      secondaryExampleHi: 'हमने बाकी सभी विकल्पों को परख लिया है और वे समाप्त हो चुके हैं।',
      secondaryWhyUsedHindi: 'जब प्रयास, संसाधन या धैर्य खत्म हो जाए, तब भी exhausted का प्रयोग किया जाता है।',
    },
    practicalTip: 'यदि आप बहुत अधिक थके हैं, तो "I am very tired" के स्थान पर "I am exhausted!" बोलना अधिक स्वाभाविक है।',
  },
  watch: {
    partOfSpeech: 'Verb / Noun (क्रिया व संज्ञा)',
    primaryHindiMeaning: 'ध्यान से देखना (स्क्रीन / खेल / दृश्य)',
    phoneticHindi: 'वॉच',
    pronunciationTipHindi: 'होंठों को हल्का गोल करके "वॉ-च" बोलें।',
    situationContext: 'Entertainment & Sports (मनोरंजन व मैच)',
    primaryExampleEn: 'I watched an exciting cricket match last night.',
    primaryExampleHi: 'मैंने कल रात एक रोमांचक क्रिकेट मैच देखा।',
    whyUsedHindi: 'जब किसी गतिशील चीज़ या गतिविधि को ध्यानपूर्वक कुछ समय तक देखा जाता है, तो "watch" कहते हैं (see या look नहीं)।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'हाथ की घड़ी (कलाई घड़ी)',
      secondaryContext: 'Everyday Device (समय व घड़ी)',
      secondaryExampleEn: 'My watch stopped working this morning.',
      secondaryExampleHi: 'आज सुबह मेरी कलाई घड़ी बंद हो गई।',
      secondaryWhyUsedHindi: 'संज्ञा (Noun) के रूप में "watch" का अर्थ हाथ पर बाँधने वाली घड़ी होता है।',
    },
    practicalTip: '"See" सामान्य नज़र पड़ने के लिए, "Look at" किसी स्थिर चीज़ की ओर देखने के लिए, और "Watch" चलती-फिरती चीज़ को ध्यान से देखने के लिए आता है।',
  },
  them: {
    partOfSpeech: 'Pronoun (कर्म कारक सर्वनाम - Object Pronoun)',
    primaryHindiMeaning: 'उन्हें / उनको / उनसे',
    phoneticHindi: 'देम',
    pronunciationTipHindi: 'नरम "द" (voiced th sound) से "देम" बोलें।',
    situationContext: 'Friends & Gathering (घर पर भोजन व आमंत्रण)',
    primaryExampleEn: 'I invited them to our home for dinner tonight.',
    primaryExampleHi: 'मैंने आज रात उन्हें अपने घर रात के खाने पर आमंत्रित किया है।',
    whyUsedHindi: 'जब वाक्य में एक से अधिक लोगों को क्रिया का लक्ष्य (object) बनाया जाता है, तो "they" के स्थान पर "them" आता है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'किसी को निर्देश या सामान देना',
      secondaryContext: 'Handing Over Items (सामान या चाबी सौंपना)',
      secondaryExampleEn: 'Could you please give them these house keys?',
      secondaryExampleHi: 'क्या आप कृपया उन्हें घर की ये चाबियाँ दे सकते हैं?',
      secondaryWhyUsedHindi: 'किसी अन्य व्यक्ति को कुछ सौंपने का अनुरोध करते समय "them" सहज अभिव्यक्ति है।',
    },
    practicalTip: 'वाक्य की शुरुआत में Subject के रूप में "They" (जैसे: They are coming) और अंत में Object के रूप में "Them" (जैसे: Call them) आता है।',
  },
  book: {
    partOfSpeech: 'Noun / Verb (संज्ञा व क्रिया)',
    primaryHindiMeaning: 'किताब / पुस्तक',
    phoneticHindi: 'बुक',
    pronunciationTipHindi: 'छोटा "उ" बोलें — "बुक"।',
    situationContext: 'Reading & Study (पढ़ाई और ज्ञान)',
    primaryExampleEn: 'I am reading an interesting book about ancient history.',
    primaryExampleHi: 'मैं प्राचीन इतिहास के बारे में एक दिलचस्प किताब पढ़ रहा हूँ।',
    whyUsedHindi: 'संज्ञा के रूप में यह किसी मुद्रित पुस्तक या ग्रंथ को दर्शाता है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'आरक्षित करना / सीट या टिकट बुक करना',
      secondaryContext: 'Travel Booking (यात्रा टिकट)',
      secondaryExampleEn: 'We should book our train tickets before the festival begins.',
      secondaryExampleHi: 'त्यौहार शुरू होने से पहले हमें ट्रेन के टिकट बुक कर लेने चाहिए।',
      secondaryWhyUsedHindi: 'क्रिया (Verb) के रूप में "book" का मतलब किसी सीट, होटल या सेवा को पहले से रिज़र्व करना होता है।',
    },
    practicalTip: '"Book a ticket" और "Read a book" — दोनों में संदर्भ से अर्थ तुरंत स्पष्ट हो जाता है।',
  },
  light: {
    partOfSpeech: 'Noun / Adjective (संज्ञा व विशेषण)',
    primaryHindiMeaning: 'रोशनी / प्रकाश',
    phoneticHindi: 'लाइट',
    pronunciationTipHindi: '"ला-इट" — "t" को स्पष्ट रखें।',
    situationContext: 'Home & Room (कमरे की बत्ती)',
    primaryExampleEn: 'Could you please turn on the light in the hallway?',
    primaryExampleHi: 'क्या आप कृपया दालान (हॉल) की बत्ती जला सकते हैं?',
    whyUsedHindi: 'यहाँ light कमरे के प्रकाश या विद्युत बल्ब को दर्शाती है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'हल्का (वज़न में कम)',
      secondaryContext: 'Luggage & Weight (सामान का वज़न)',
      secondaryExampleEn: 'This travel backpack is very light and easy to carry.',
      secondaryExampleHi: 'यह यात्रा बैग बहुत हल्का और उठाने में आसान है।',
      secondaryWhyUsedHindi: 'विशेषण (Adjective) के रूप में heavy (भारी) का विलोम शब्द light (हल्का) होता है।',
    },
  },
  patient: {
    partOfSpeech: 'Adjective / Noun (विशेषण व संज्ञा)',
    primaryHindiMeaning: 'धैर्यवान / सहनशील (सब्र रखने वाला)',
    phoneticHindi: 'पेशेंट',
    pronunciationTipHindi: '"पे-शेंट" बोलें। बीच में "श" की आवाज़ आती है, "स" नहीं।',
    situationContext: 'Waiting & Daily Life (प्रतीक्षा व धैर्य)',
    primaryExampleEn: 'Please be patient; the doctor will see you soon.',
    primaryExampleHi: 'कृपया थोड़ा धैर्य रखें; डॉक्टर कुछ ही समय में आपको देखेंगे।',
    whyUsedHindi: 'यहाँ patient का उपयोग किसी को शांत और संयमित रहकर प्रतीक्षा करने के लिए कहने में हुआ है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'मरीज़ / बीमार व्यक्ति',
      secondaryContext: 'Hospital & Healthcare (अस्पताल व स्वास्थ्य)',
      secondaryExampleEn: 'The doctor spent thirty minutes examining each patient.',
      secondaryExampleHi: 'डॉक्टर ने प्रत्येक मरीज़ की जाँच में तीस मिनट का समय दिया।',
      secondaryWhyUsedHindi: 'संज्ञा (Noun) के रूप में "patient" का अर्थ अस्पताल में इलाज करा रहा मरीज़ होता है।',
    },
    practicalTip: '"Learning a new language requires you to be patient with yourself." — अंग्रेज़ी सीखते समय अपने प्रति धैर्यवान रहें।',
  },
  beautiful: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'सुंदर / मनमोहक',
    phoneticHindi: 'ब्यूटीफुल',
    pronunciationTipHindi: '"ब्यू-टी-फुल" — तीन स्पष्ट हिस्सों में बोलें।',
    situationContext: 'Nature & Sunset (प्रकृति और सूर्यास्त)',
    primaryExampleEn: 'The sunset over the mountain looked breathtakingly beautiful.',
    primaryExampleHi: 'पहाड़ों के ऊपर सूर्यास्त का नज़ारा बेहद खूबसूरत लग रहा था।',
    whyUsedHindi: 'जब कोई दृश्य, व्यक्ति या रचना आँखों को अत्यंत आकर्षित करे, तब beautiful का उपयोग होता है।',
  },
  careful: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'सावधान / सतर्क',
    phoneticHindi: 'केयरफुल',
    pronunciationTipHindi: '"के-यर-फुल" बोलें।',
    situationContext: 'Safety & Driving (सड़क सुरक्षा व ड्राइविंग)',
    primaryExampleEn: 'Please be careful while driving on the wet road.',
    primaryExampleHi: 'कृपया गीली सड़क पर गाड़ी चलाते समय सावधान रहें।',
    whyUsedHindi: 'यहाँ दुर्घटना या गलती से बचने के लिए सतर्कता बरतने की सलाह दी गई है।',
  },
  decide: {
    partOfSpeech: 'Verb (क्रिया)',
    primaryHindiMeaning: 'तय करना / निर्णय लेना',
    phoneticHindi: 'डिसाइड',
    pronunciationTipHindi: '"डि-सा-इड" — अंत में स्पष्ट "ड" बोलें।',
    situationContext: 'Career & Planning (करियर व योजना)',
    primaryExampleEn: 'Take your time to decide which career path suits you best.',
    primaryExampleHi: 'यह तय करने के लिए थोड़ा समय लें कि कौन सा करियर आपके लिए सबसे उपयुक्त है।',
    whyUsedHindi: 'कई विकल्पों में से किसी एक को चुनने का संकल्प लेने के लिए decide कहते हैं।',
  },
  experience: {
    partOfSpeech: 'Noun & Verb (संज्ञा व क्रिया)',
    primaryHindiMeaning: 'अनुभव / तजुर्बा',
    phoneticHindi: 'एक्सपीरियंस',
    pronunciationTipHindi: '"इक्स-पी-रि-अंस" चार ध्वनियों में धाराप्रवाह बोलें।',
    situationContext: 'Work Interview (नौकरी व साक्षात्कार)',
    primaryExampleEn: 'She has five years of practical experience in digital marketing.',
    primaryExampleHi: 'उनके पास डिजिटल मार्केटिंग में पाँच साल का व्यावहारिक अनुभव है।',
    whyUsedHindi: 'कार्यक्षेत्र में वर्षों के दौरान सीखे गए हुनर और ज्ञान को experience कहा जाता है।',
  },
  without: {
    partOfSpeech: 'Preposition (संबंधबोधक अव्यय - के बिना)',
    primaryHindiMeaning: 'के बिना / बिना',
    phoneticHindi: 'विदाउट',
    pronunciationTipHindi: '"वि-दा-उट" बोलें (wɪðˈaʊt)। शुरुआत में "वि" और अंत में स्पष्ट "आउट"।',
    situationContext: 'Daily Habit & Tea (दैनिक आदत व दिनचर्या)',
    primaryExampleEn: 'I cannot start my morning without a hot cup of tea.',
    primaryExampleHi: 'मैं एक कप गर्म चाय के बिना अपनी सुबह शुरू नहीं कर सकता।',
    whyUsedHindi: 'यहाँ "without" सुबह की चाय की अनुपस्थिति (के बिना) को स्वाभाविक रूप से दर्शा रहा है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'नियम या अनुमति के बिना',
      secondaryContext: 'Office Application (दस्तावेज़ व नियम)',
      secondaryExampleEn: 'Please do not submit your application without checking the documents.',
      secondaryExampleHi: 'कृपया दस्तावेज़ों की जाँच किए बिना अपना आवेदन जमा न करें।',
      secondaryWhyUsedHindi: 'किसी शर्त या जाँच के पूरे न होने की स्थिति में "without" का उपयोग हुआ है।',
    },
    practicalTip: '"Without" के बाद हमेशा कोई Noun (जैसे without sugar) या क्रिया का ing रूप (जैसे without asking) आता है।',
  },
};

export function generateSemanticBreakdownLocal(
  word: string,
  hintMeaning?: string,
  difficulty: DifficultyLevel = DifficultyLevel.BEGINNER,
  contextTheme?: string
): WordContextBreakdown {
  const clean = word.trim().toLowerCase();
  const curated = SEMANTIC_CURATED_WORDS[clean];

  if (curated && curated.primaryExampleEn) {
    return {
      word: clean,
      partOfSpeech: curated.partOfSpeech || 'Word (शब्द)',
      primaryHindiMeaning: hintMeaning || curated.primaryHindiMeaning || `"${clean}" का अर्थ`,
      phoneticHindi: curated.phoneticHindi || clean,
      pronunciationTipHindi: curated.pronunciationTipHindi,
      situationContext: curated.situationContext || 'Daily Practical Usage',
      primaryExampleEn: curated.primaryExampleEn,
      primaryExampleHi: curated.primaryExampleHi || `"${clean}" का व्यावहारिक वाक्य`,
      whyUsedHindi: curated.whyUsedHindi || `यहाँ "${clean}" का प्रयोग परिस्थिति को स्वाभाविक रूप से व्यक्त करने के लिए हुआ है।`,
      difficultyLevel: difficulty,
      secondaryUsage: curated.secondaryUsage,
      practicalTip: curated.practicalTip,
    };
  }

  // Semantic heuristic classifier to avoid universal boilerplates
  let pos = 'Word (शब्द)';
  let context = 'Daily Communication';
  let enSentence = '';
  let hiSentence = '';
  let whyUsed = '';

  if (clean === 'without') {
    pos = 'Preposition (संबंधबोधक अव्यय - के बिना)';
    context = 'Daily Routine & Habits (दैनिक दिनचर्या)';
    enSentence = 'I cannot start my morning without a hot cup of tea.';
    hiSentence = 'मैं एक कप गर्म चाय के बिना अपनी सुबह शुरू नहीं कर सकता।';
    whyUsed = 'यहाँ "without" किसी चीज़ की अनुपस्थिति (के बिना) को दर्शाने के लिए आया है।';
  } else if (['with', 'about', 'between', 'among', 'under', 'over', 'through', 'before', 'after', 'during'].includes(clean)) {
    pos = 'Preposition (संबंधबोधक अव्यय)';
    context = 'Time & Location (समय व स्थान संबंध)';
    enSentence = `Always ensure safety ${clean} continuing with your journey.`;
    hiSentence = `अपनी यात्रा जारी रखने से पहले हमेशा सुरक्षा सुनिश्चित करें।`;
    whyUsed = `यहाँ "${clean}" दो बातों या परिस्थितियों के बीच संबंध स्पष्ट कर रहा है।`;
  } else if (['because', 'although', 'unless', 'since', 'while'].includes(clean)) {
    pos = 'Conjunction (संयोजक - वाक्य जोड़ने वाला शब्द)';
    context = 'Reason & Context (कारण व संदर्भ)';
    enSentence = `We arrived comfortably on schedule ${clean} we started early in the morning.`;
    hiSentence = `हम आराम से समय पर पहुँच गए क्योंकि हम सुबह जल्दी निकले थे।`;
    whyUsed = `यहाँ "${clean}" दो विचारों को जोड़कर कारण स्पष्ट कर रहा है।`;
  } else if (['run', 'walk', 'jump', 'cook', 'drive', 'swim', 'eat', 'drink', 'write', 'read', 'speak', 'help', 'learn', 'listen', 'watch', 'borrow'].includes(clean)) {
    pos = 'Verb (क्रिया - Action)';
    context = 'Morning Routine & Health (दैनिक दिनचर्या)';
    enSentence = `She prefers to ${clean} around the park before the city gets crowded.`;
    hiSentence = `शहर में भीड़ बढ़ने से पहले वह पार्क के चारों ओर ${clean} करना पसंद करती है।`;
    whyUsed = `यहाँ "${clean}" एक नियमित शारीरिक गतिविधि को स्वाभाविक रूप से दर्शा रहा है।`;
  } else if (clean.endsWith('ing')) {
    pos = 'Continuous Verb / Gerund (क्रिया रूप)';
    context = 'Ongoing Activity (वर्तमान गतिविधि)';
    enSentence = `We spent the entire afternoon ${clean} together at home.`;
    hiSentence = `हमने पूरी दोपहर घर पर साथ मिलकर इस गतिविधि में बिताई।`;
    whyUsed = `यहाँ "${clean}" चल रहे कार्य की निरंतरता को व्यक्त कर रहा है।`;
  } else if (['happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'proud', 'exhausted', 'tired'].includes(clean)) {
    pos = 'Adjective (भाववाचक विशेषण)';
    context = 'Emotions & Feelings (भावनाएँ व मनःस्थिति)';
    enSentence = `Hearing the good news made everyone feel deeply ${clean}.`;
    hiSentence = `अच्छी खबर सुनकर हर किसी ने गहरा ${clean} महसूस किया।`;
    whyUsed = `यहाँ "${clean}" व्यक्ति की आंतरिक मानसिक स्थिति और भावना को सटीक रूप से बयां करता है।`;
  } else if (clean.endsWith('ly') || ['always', 'never', 'often', 'sometimes', 'already'].includes(clean)) {
    pos = 'Adverb (क्रिया विशेषण)';
    context = 'Manner & Communication (कार्य करने का ढंग)';
    enSentence = `Please communicate the instructions ${clean} so that nobody gets confused.`;
    hiSentence = `कृपया निर्देशों को ${clean} साझा करें ताकि किसी को कोई भ्रम न रहे।`;
    whyUsed = `यहाँ "${clean}" क्रिया करने के ढंग और स्पष्टता की व्याख्या कर रहा है।`;
  } else if (clean.endsWith('able') || clean.endsWith('ible')) {
    pos = 'Adjective (विशेषण - योग्यता/संभावना)';
    context = 'Practical Situations (व्यावहारिक स्थिति)';
    enSentence = `This new schedule is completely ${clean} for the entire team.`;
    hiSentence = `यह नया समय-सारणी पूरी टीम के लिए पूरी तरह ${clean} है।`;
    whyUsed = `यहाँ "${clean}" किसी स्थिति के अनुकूल और संभव होने को दर्शाता है।`;
  } else {
    pos = 'Word / Concept (शब्द व अवधारणा)';
    context = 'Real-Life Situation (वास्तविक स्थिति)';
    enSentence = `I made sure to complete the ${clean} before submitting the final documents.`;
    hiSentence = `अंतिम दस्तावेज़ जमा करने से पहले मैंने इसे पूरा करना सुनिश्चित किया।`;
    whyUsed = `यहाँ "${clean}" वास्तविक परिस्थिति में प्रयुक्त मुख्य विषय को इंगित करता है।`;
  }

  return {
    word: clean,
    partOfSpeech: pos,
    primaryHindiMeaning: hintMeaning || `"${clean}"`,
    phoneticHindi: clean,
    pronunciationTipHindi: `इस शब्द ("${clean}") को स्पष्टता से बिना जल्दबाज़ी के बोलें।`,
    situationContext: contextTheme || context,
    primaryExampleEn: enSentence,
    primaryExampleHi: hiSentence,
    whyUsedHindi: whyUsed,
    difficultyLevel: difficulty,
    practicalTip: `किसी शब्द को केवल याद करने के बजाय इस तरह के पूरे वाक्य में बोलकर अभ्यास करें।`,
  };
}

export async function getWordContextBreakdown(
  word: string,
  hindiMeaning?: string,
  difficulty: DifficultyLevel = DifficultyLevel.BEGINNER,
  contextTheme?: string
): Promise<WordContextBreakdown> {
  const clean = word.trim();
  try {
    const res = await fetch('/api/ai/word-context-breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: clean,
        hindiMeaning,
        difficulty,
        contextTheme,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.primaryExampleEn && data.whyUsedHindi) {
        return {
          ...data,
          difficultyLevel: difficulty,
        };
      }
    }
  } catch (err) {
    console.warn('Backend word context breakdown failed, using local semantic engine:', err);
  }

  return generateSemanticBreakdownLocal(clean, hindiMeaning, difficulty, contextTheme);
}


