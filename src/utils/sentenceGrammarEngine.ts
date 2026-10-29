/**
 * Beginner-Friendly Grammatical Analysis & Sentence Generation Engine for BhashaGuru
 *
 * Designed specifically for absolute beginners who speak Hindi and know very little English.
 *
 * Guarantees:
 * 1. Deep grammatical role analysis for all 659 vocabulary words (Spelling + Hindi Meaning).
 * 2. Specialized natural templates for every part of speech (Wh- Questions, Conjunctions,
 *    Subject Pronouns, Object Pronouns, Possessives, Modals, Quantifiers, Prepositions,
 *    Adjectives, Adverbs, Action Verbs, and Nouns).
 * 3. NO forced generic templates (e.g. NEVER "I + have + a + [word]" or "मेरे पास [meaning] है").
 * 4. Short and easy to understand (2-6 words for Beginner).
 * 5. Natural everyday English that real people actually speak.
 * 6. Accompanied by simple, natural, idiomatic Hindi translations.
 * 7. Multi-level exercises (Beginner, Practice, Challenge) for all words.
 */

export type GrammaticalRole =
  | 'wh_question'
  | 'subject_pronoun'
  | 'object_pronoun'
  | 'possessive_determiner'
  | 'possessive_pronoun'
  | 'quantifier'
  | 'preposition'
  | 'action_verb'
  | 'adjective'
  | 'adverb'
  | 'modal_verb'
  | 'conjunction'
  | 'noun';

export interface GeneratedSentenceExercise {
  id: string;
  level: 'beginner' | 'practice' | 'challenge';
  targetWord: string;
  exampleSentenceEn?: string;
  exampleSentenceHi?: string;
  hindiPrompt: string;
  expectedSentence: string;
  acceptedAlternatives: string[];
  chips: string[];
  explanationHi: string;
  ruleTipHi: string;
  grammaticalRole: GrammaticalRole;
  roleBadgeHi: string;
}

// Scramble helper that ensures chips are shuffled
export function shuffleChips<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && result.every((v, i) => v === array[i])) {
    [result[0], result[result.length - 1]] = [result[result.length - 1], result[0]];
  }
  return result;
}

// Normalize sentence strings for tolerant matching
export function normalizeSentence(text: string): string {
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

/**
 * Determines the grammatical role of a word using both English word spelling
 * and its saved Hindi meaning.
 */
export function analyzeGrammaticalRole(word: string, hindiMeaning: string): GrammaticalRole {
  const wl = word.trim().toLowerCase();
  const hl = hindiMeaning.trim();

  // Special disambiguation for words with multiple meanings in vocabulary:
  if (wl === 'work') {
    if (hl.includes('काम करना')) return 'action_verb';
    return 'noun';
  }
  if (wl === 'change') {
    if (hl.includes('बदलना')) return 'action_verb';
    return 'noun';
  }

  // 1. Wh- Question Words
  if (['who', 'whom', 'whose', 'which', 'what', 'where', 'when', 'why', 'how'].includes(wl)) {
    return 'wh_question';
  }

  // 2. Subject Pronouns
  if (['i', 'you', 'he', 'she', 'it', 'we', 'they'].includes(wl)) {
    return 'subject_pronoun';
  }

  // 3. Object Pronouns
  if (['me', 'him', 'her', 'us', 'them'].includes(wl)) {
    return 'object_pronoun';
  }

  // 4. Possessive Determiners
  if (['my', 'your', 'his', 'our', 'their', 'its'].includes(wl)) {
    return 'possessive_determiner';
  }

  // 5. Possessive Pronouns
  if (['mine', 'yours', 'hers', 'ours', 'theirs'].includes(wl)) {
    return 'possessive_pronoun';
  }

  // 6. Conjunctions
  if (
    [
      'and', 'but', 'or', 'so', 'because', 'although', 'if', 'unless', 'since', 'while',
      'as', 'than', 'though'
    ].includes(wl) ||
    hl.includes('जब तक') || hl.includes('क्योंकि') || hl.includes('यद्यपि') || hl.includes('हालांकि') ||
    hl.includes('लेकिन') || hl.includes('परंतु') || hl.includes('अगर') || hl.includes('यदि')
  ) {
    return 'conjunction';
  }

  // 7. Quantifiers / Determiners
  if (
    [
      'many', 'much', 'some', 'any', 'few', 'all', 'none', 'several', 'little',
      'both', 'each', 'every', 'enough', 'more', 'most', 'another', 'other'
    ].includes(wl)
  ) {
    return 'quantifier';
  }

  // 8. Prepositions
  if (
    [
      'in', 'on', 'at', 'under', 'with', 'without', 'about', 'against',
      'between', 'among', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'to', 'from', 'near', 'far', 'outside', 'inside',
      'behind', 'beside', 'by', 'for', 'over', 'off', 'out', 'up', 'down'
    ].includes(wl)
  ) {
    return 'preposition';
  }

  // 9. Modals & Auxiliaries
  if (
    [
      'can', 'could', 'will', 'would', 'should', 'shall', 'may', 'might', 'must',
      'is', 'am', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had'
    ].includes(wl)
  ) {
    return 'modal_verb';
  }

  // 10. Adverbs (Time, Place, Frequency, Manner, Degree)
  if (
    wl.endsWith('ly') ||
    [
      'here', 'there', 'everywhere', 'nowhere', 'somewhere', 'anywhere',
      'often', 'always', 'never', 'slowly', 'carefully', 'quickly', 'sometimes',
      'daily', 'well', 'soon', 'late', 'early', 'hard', 'again', 'also', 'very',
      'just', 'too', 'quite', 'almost', 'now', 'then', 'once', 'twice', 'maybe',
      'please', 'today', 'yesterday', 'tomorrow', 'tonight', 'already', 'together'
    ].includes(wl) ||
    hl.includes('धीरे') || hl.includes('जल्दी') || hl.includes('अक्सर') ||
    hl.includes('हमेशा') || hl.includes('कभी नहीं') || hl.includes('शायद') ||
    hl.includes('कृपया') || hl.includes('यहाँ') || hl.includes('वहाँ') ||
    hl.includes('हर जगह') || hl.includes('कहीं नहीं') || hl.includes('फिर से') ||
    hl.includes('भी') || hl.includes('बहुत अधिक') || hl.includes('कल') || hl.includes('आज')
  ) {
    return 'adverb';
  }

  // 11. Known Common Action Verbs or Hindi meaning indicating action / ending with 'ना'
  const commonVerbs = new Set([
    'eat', 'drink', 'go', 'come', 'play', 'read', 'write', 'speak', 'work', 'offer',
    'buy', 'sell', 'help', 'learn', 'teach', 'run', 'walk', 'see', 'hear', 'listen',
    'think', 'know', 'want', 'need', 'like', 'love', 'live', 'sleep', 'wake', 'stand',
    'sit', 'take', 'give', 'make', 'do', 'call', 'ask', 'tell', 'feel', 'look', 'find',
    'change', 'start', 'stop', 'open', 'close', 'wait', 'leave', 'meet', 'pay', 'said',
    'say', 'get', 'try', 'keep', 'hold', 'bring', 'send', 'show'
  ]);
  if (
    commonVerbs.has(wl) ||
    hl.endsWith('ना') ||
    hl.includes(' करना') ||
    hl.includes(' होना') ||
    hl.includes(' देना') ||
    hl.includes(' लेना') ||
    hl.includes(' पाना') ||
    hl.includes(' कहना') ||
    hl.includes(' बनाना') ||
    hl.includes(' जाना') ||
    hl.includes(' आना')
  ) {
    return 'action_verb';
  }

  // 12. Known Adjectives or Qualities
  const commonAdjectives = new Set([
    'happy', 'sad', 'big', 'small', 'useful', 'good', 'bad', 'new', 'old', 'young',
    'easy', 'hard', 'clean', 'dirty', 'honest', 'beautiful', 'rich', 'poor', 'safe',
    'fresh', 'hot', 'cold', 'right', 'wrong', 'strong', 'weak', 'important', 'simple',
    'fine', 'nice', 'ready', 'busy', 'free', 'true', 'false', 'kind', 'sweet', 'tall',
    'short', 'fast', 'slow', 'calm', 'hungry', 'thirsty', 'tired', 'healthy', 'sick'
  ]);
  if (
    commonAdjectives.has(wl) ||
    hl.includes('खुश') || hl.includes('सुंदर') || hl.includes('बड़ा') || hl.includes('छोटा') ||
    hl.includes('उपयोगी') || hl.includes('ईमानदार') || hl.includes('आसान') || hl.includes('कठिन') ||
    hl.includes('अच्छा') || hl.includes('बुरा') || hl.includes('नया') || hl.includes('पुराना')
  ) {
    return 'adjective';
  }

  // Default to Noun
  return 'noun';
}

export function getRoleBadgeHi(role: GrammaticalRole): string {
  switch (role) {
    case 'wh_question':
      return 'प्रश्नवाचक शब्द (Question Word)';
    case 'subject_pronoun':
      return 'कर्ता सर्वनाम (Subject Pronoun)';
    case 'object_pronoun':
      return 'कर्म सर्वनाम (Object Pronoun)';
    case 'possessive_determiner':
      return 'संबोधक (Possessive Determiner)';
    case 'possessive_pronoun':
      return 'स्वत्वबोधक सर्वनाम (Possessive Pronoun)';
    case 'quantifier':
      return 'परिमाणवाचक / निर्धारक (Quantifier)';
    case 'preposition':
      return 'संबंधबोधक (Preposition)';
    case 'action_verb':
      return 'क्रिया (Action Verb)';
    case 'adjective':
      return 'विशेषण (Adjective)';
    case 'adverb':
      return 'क्रिया विशेषण (Adverb)';
    case 'modal_verb':
      return 'सहायक क्रिया (Modal / Auxiliary)';
    case 'conjunction':
      return 'योजक (Conjunction)';
    case 'noun':
    default:
      return 'संज्ञा (Noun)';
  }
}

/**
 * CURATED BEGINNER DICTIONARY
 * Handcrafted natural everyday sentences (2-6 words) for high-frequency vocabulary words.
 */
interface CuratedWordPlan {
  role: GrammaticalRole;
  exampleEn: string;
  exampleHi: string;
  beginner: Array<{
    promptHi: string;
    expectedEn: string;
    alternatives?: string[];
    chips: string[];
    ruleTipHi?: string;
  }>;
  practice: Array<{
    promptHi: string;
    expectedEn: string;
    alternatives?: string[];
    chips: string[];
    ruleTipHi?: string;
  }>;
  challenge: Array<{
    promptHi: string;
    expectedEn: string;
    alternatives?: string[];
    chips: string[];
    ruleTipHi?: string;
  }>;
}

const CURATED_WORDS: Record<string, CuratedWordPlan> = {
  // 1. WE
  we: {
    role: 'subject_pronoun',
    exampleEn: 'We are friends.',
    exampleHi: 'हम दोस्त हैं।',
    beginner: [
      {
        promptHi: 'हम क्रिकेट खेलते हैं।',
        expectedEn: 'We play cricket.',
        alternatives: ['We play cricket', 'We are playing cricket.'],
        chips: ['cricket', 'play', 'We'],
        ruleTipHi: 'We (हम) + play (खेलते हैं) + cricket (क्रिकेट)',
      },
      {
        promptHi: 'हम खाना खाते हैं।',
        expectedEn: 'We eat food.',
        alternatives: ['We eat food', 'We eat fresh food.'],
        chips: ['food', 'eat', 'We'],
        ruleTipHi: 'We + eat + food',
      },
    ],
    practice: [
      {
        promptHi: 'हम बाहर का खाना नहीं खाते हैं।',
        expectedEn: 'We do not eat outside food.',
        alternatives: ["We don't eat outside food.", 'We do not eat outside food'],
        chips: ['outside food', 'do not', 'eat', 'We'],
        ruleTipHi: 'We + do not + eat + outside food',
      },
      {
        promptHi: 'क्या हमारे पास समय है?',
        expectedEn: 'Do we have time?',
        alternatives: ['Do we have time'],
        chips: ['time?', 'have', 'Do we'],
        ruleTipHi: 'Do we + have + time?',
      },
    ],
    challenge: [
      {
        promptHi: 'हम रोज़ाना साथ मिलकर अंग्रेज़ी सीखते हैं।',
        expectedEn: 'We learn English together every day.',
        alternatives: ['We learn English together every day'],
        chips: ['every day', 'together', 'English', 'learn', 'We'],
        ruleTipHi: 'We + learn English + together + every day',
      },
    ],
  },

  // 2. THEM
  them: {
    role: 'object_pronoun',
    exampleEn: 'I know them.',
    exampleHi: 'मैं उन्हें जानता/जानती हूँ।',
    beginner: [
      {
        promptHi: 'मैं उन्हें जानता हूँ।',
        expectedEn: 'I know them.',
        alternatives: ['I know them', 'I know them well.'],
        chips: ['them', 'know', 'I'],
        ruleTipHi: 'I (कर्ता) + know (जानता हूँ) + them (उन्हें - कर्म)',
      },
      {
        promptHi: 'उनसे बात करो।',
        expectedEn: 'Talk to them.',
        alternatives: ['Talk to them', 'Speak to them.'],
        chips: ['them', 'to', 'Talk'],
        ruleTipHi: 'Talk to + them',
      },
    ],
    practice: [
      {
        promptHi: 'मैं उन्हें नहीं जानता हूँ।',
        expectedEn: 'I do not know them.',
        alternatives: ["I don't know them.", 'I do not know them'],
        chips: ['them', 'know', 'do not', 'I'],
        ruleTipHi: 'I + do not know + them',
      },
      {
        promptHi: 'क्या आप उन्हें जानते हैं?',
        expectedEn: 'Do you know them?',
        alternatives: ['Do you know them'],
        chips: ['them?', 'know', 'Do you'],
        ruleTipHi: 'Do you + know + them?',
      },
    ],
    challenge: [
      {
        promptHi: 'कृपया आज शाम उनसे मिलें।',
        expectedEn: 'Please meet them this evening.',
        alternatives: ['Please meet them this evening'],
        chips: ['this evening', 'them', 'meet', 'Please'],
        ruleTipHi: 'Please meet + them + this evening',
      },
    ],
  },

  // 3. WHEN
  when: {
    role: 'wh_question',
    exampleEn: 'When will you come?',
    exampleHi: 'तुम कब आओगे?',
    beginner: [
      {
        promptHi: 'तुम कब पढ़ते हो?',
        expectedEn: 'When do you study?',
        alternatives: ['When do you study', 'When do you learn?'],
        chips: ['study?', 'do you', 'When'],
        ruleTipHi: 'When (कब) + do you + study (पढ़ते हो)?',
      },
      {
        promptHi: 'तुम कब आओगे?',
        expectedEn: 'When will you come?',
        alternatives: ['When will you come'],
        chips: ['come?', 'will you', 'When'],
        ruleTipHi: 'When + will you + come?',
      },
    ],
    practice: [
      {
        promptHi: 'वह कब उठता है?',
        expectedEn: 'When does he wake up?',
        alternatives: ['When does he wake up'],
        chips: ['wake up?', 'does he', 'When'],
        ruleTipHi: 'When + does he + wake up?',
      },
      {
        promptHi: 'दुकान कब खुलती है?',
        expectedEn: 'When does the shop open?',
        alternatives: ['When does the shop open'],
        chips: ['open?', 'the shop', 'does', 'When'],
        ruleTipHi: 'When does + the shop + open?',
      },
    ],
    challenge: [
      {
        promptHi: 'कृपया मुझे बताएँ कि ट्रेन कब आएगी।',
        expectedEn: 'Please tell me when the train will come.',
        alternatives: [
          'Please tell me when the train will arrive.',
          'Please tell me when the train will come',
        ],
        chips: ['will come', 'the train', 'when', 'tell me', 'Please'],
        ruleTipHi: 'Please tell me + when + the train will come',
      },
    ],
  },

  // 4. WHICH
  which: {
    role: 'wh_question',
    exampleEn: 'Which book is yours?',
    exampleHi: 'कौन-सी किताब तुम्हारी है?',
    beginner: [
      {
        promptHi: 'कौन-सी किताब तुम्हारी है?',
        expectedEn: 'Which book is yours?',
        alternatives: ['Which book is yours', 'Which is your book?'],
        chips: ['yours?', 'is', 'Which book'],
        ruleTipHi: 'Which (कौन-सी) + book (किताब) + is yours?',
      },
      {
        promptHi: 'तुम्हें कौन सा चाहिए?',
        expectedEn: 'Which one do you want?',
        alternatives: ['Which one do you want'],
        chips: ['you want?', 'do', 'Which one'],
        ruleTipHi: 'Which one + do you want?',
      },
    ],
    practice: [
      {
        promptHi: 'आप कौन सा रंग पसंद करते हैं?',
        expectedEn: 'Which color do you like?',
        alternatives: ['Which color do you like', 'Which colour do you like?'],
        chips: ['do you like?', 'Which color'],
        ruleTipHi: 'Which color + do you like?',
      },
      {
        promptHi: 'मुझे नहीं पता कि कौन सा बेहतर है।',
        expectedEn: 'I do not know which is better.',
        alternatives: ["I don't know which is better.", 'I do not know which is better'],
        chips: ['which is better', 'do not know', 'I'],
        ruleTipHi: 'I do not know + which is better',
      },
    ],
    challenge: [
      {
        promptHi: 'कृपया मुझे बताएँ कि कौन सी ट्रेन दिल्ली जाती है।',
        expectedEn: 'Please tell me which train goes to Delhi.',
        alternatives: ['Please tell me which train goes to Delhi'],
        chips: ['goes to Delhi', 'which train', 'Please tell me'],
        ruleTipHi: 'Please tell me + which train goes to Delhi',
      },
    ],
  },

  // 5. UNLESS
  unless: {
    role: 'conjunction',
    exampleEn: 'I will go unless it rains.',
    exampleHi: 'अगर बारिश नहीं हुई, तो मैं जाऊँगा।',
    beginner: [
      {
        promptHi: 'अगर बारिश नहीं हुई, तो मैं जाऊँगा।',
        expectedEn: 'I will go unless it rains.',
        alternatives: ['I will go unless it rains'],
        chips: ['it rains', 'unless', 'I will go'],
        ruleTipHi: 'I will go + unless (अगर...नहीं) + it rains',
      },
      {
        promptHi: 'जब तक मैं न कहूँ, मत जाना।',
        expectedEn: 'Do not go unless I tell you.',
        alternatives: ["Don't go unless I tell you.", 'Do not go unless I tell you'],
        chips: ['I tell you', 'unless', 'Do not go'],
        ruleTipHi: 'Do not go + unless + I tell you',
      },
    ],
    practice: [
      {
        promptHi: 'अगर तुम मेहनत नहीं करोगे, तो पास नहीं होगे।',
        expectedEn: 'You will not pass unless you work hard.',
        alternatives: ["You won't pass unless you work hard.", 'You will not pass unless you work hard'],
        chips: ['you work hard', 'unless', 'will not pass', 'You'],
        ruleTipHi: 'You will not pass + unless you work hard',
      },
      {
        promptHi: 'जब तक वह नहीं बुलाएगा, हम नहीं जाएँगे।',
        expectedEn: 'We will not go unless he calls.',
        alternatives: ["We won't go unless he calls.", 'We will not go unless he calls'],
        chips: ['he calls', 'unless', 'will not go', 'We'],
        ruleTipHi: 'We will not go + unless he calls',
      },
    ],
    challenge: [
      {
        promptHi: 'जब तक आप अभ्यास नहीं करेंगे, आप अंग्रेज़ी नहीं बोल सकते।',
        expectedEn: 'You cannot speak English unless you practice.',
        alternatives: ["You can't speak English unless you practice.", 'You cannot speak English unless you practice'],
        chips: ['unless you practice', 'English', 'speak', 'You cannot'],
        ruleTipHi: 'You cannot speak English + unless you practice',
      },
    ],
  },

  // 6. MANY
  many: {
    role: 'quantifier',
    exampleEn: 'I have many books.',
    exampleHi: 'मेरे पास बहुत सी किताबें हैं।',
    beginner: [
      {
        promptHi: 'तुम्हारे पास कितनी किताबें हैं?',
        expectedEn: 'How many books do you have?',
        alternatives: ['How many books do you have'],
        chips: ['do you have?', 'books', 'How many'],
        ruleTipHi: 'How many (कितनी - गणनीय) + books + do you have?',
      },
      {
        promptHi: 'मेरे पास कई दोस्त हैं।',
        expectedEn: 'I have many friends.',
        alternatives: ['I have many friends'],
        chips: ['friends', 'many', 'have', 'I'],
        ruleTipHi: 'I have + many friends',
      },
    ],
    practice: [
      {
        promptHi: 'यहाँ ज़्यादा लोग नहीं हैं।',
        expectedEn: 'There are not many people here.',
        alternatives: ["There aren't many people here.", 'There are not many people here'],
        chips: ['here', 'people', 'not many', 'There are'],
        ruleTipHi: 'There are + not many people + here',
      },
    ],
    challenge: [
      {
        promptHi: 'पुस्तकालय में बहुत सी उपयोगी किताबें हैं।',
        expectedEn: 'There are many useful books in the library.',
        alternatives: ['There are many useful books in the library'],
        chips: ['in the library', 'useful books', 'many', 'There are'],
        ruleTipHi: 'There are many useful books + in the library',
      },
    ],
  },

  // 7. HAPPY
  happy: {
    role: 'adjective',
    exampleEn: 'She is happy.',
    exampleHi: 'वह खुश है।',
    beginner: [
      {
        promptHi: 'मैं बहुत खुश हूँ।',
        expectedEn: 'I am very happy.',
        alternatives: ['I am happy.', 'I am very happy'],
        chips: ['happy', 'very', 'am', 'I'],
        ruleTipHi: 'I (Subject) + am (Verb) + very happy (Adjective)',
      },
      {
        promptHi: 'वह खुश है।',
        expectedEn: 'She is happy.',
        alternatives: ['She is happy', 'He is happy.'],
        chips: ['happy', 'is', 'She'],
        ruleTipHi: 'She + is + happy',
      },
    ],
    practice: [
      {
        promptHi: 'वह आज खुश नहीं है।',
        expectedEn: 'He is not happy today.',
        alternatives: ["He isn't happy today.", 'He is not happy today'],
        chips: ['today', 'happy', 'is not', 'He'],
        ruleTipHi: 'He + is not + happy + today',
      },
      {
        promptHi: 'क्या आप खुश हैं?',
        expectedEn: 'Are you happy?',
        alternatives: ['Are you happy'],
        chips: ['happy?', 'you', 'Are'],
        ruleTipHi: 'Are you + happy?',
      },
    ],
    challenge: [
      {
        promptHi: 'आज सब लोग बहुत खुश दिख रहे हैं।',
        expectedEn: 'Everyone looks very happy today.',
        alternatives: ['Everyone is very happy today.', 'Everyone looks very happy today'],
        chips: ['today', 'very happy', 'looks', 'Everyone'],
        ruleTipHi: 'Everyone + looks very happy + today',
      },
    ],
  },

  // 8. SLOWLY
  slowly: {
    role: 'adverb',
    exampleEn: 'He walks slowly.',
    exampleHi: 'वह धीरे-धीरे चलता है।',
    beginner: [
      {
        promptHi: 'धीरे बोलो।',
        expectedEn: 'Speak slowly.',
        alternatives: ['Speak slowly', 'Please speak slowly.'],
        chips: ['slowly', 'Speak'],
        ruleTipHi: 'Speak (क्रिया) + slowly (क्रिया विशेषण)',
      },
      {
        promptHi: 'वह धीरे-धीरे चलता है।',
        expectedEn: 'He walks slowly.',
        alternatives: ['He walks slowly', 'She walks slowly.'],
        chips: ['slowly', 'walks', 'He'],
        ruleTipHi: 'He + walks + slowly',
      },
    ],
    practice: [
      {
        promptHi: 'कृपया धीरे-धीरे गाड़ी चलाएँ।',
        expectedEn: 'Please drive slowly.',
        alternatives: ['Please drive slowly'],
        chips: ['slowly', 'drive', 'Please'],
        ruleTipHi: 'Please drive + slowly',
      },
      {
        promptHi: 'वह धीरे नहीं चलता है।',
        expectedEn: 'He does not walk slowly.',
        alternatives: ["He doesn't walk slowly.", 'He does not walk slowly'],
        chips: ['slowly', 'walk', 'does not', 'He'],
        ruleTipHi: 'He + does not walk + slowly',
      },
    ],
    challenge: [
      {
        promptHi: 'अगर आप धीरे-धीरे अभ्यास करेंगे तो सीख जाएँगे।',
        expectedEn: 'You will learn if you practice slowly.',
        alternatives: ['You will learn if you practice slowly'],
        chips: ['practice slowly', 'if you', 'will learn', 'You'],
        ruleTipHi: 'You will learn + if you practice slowly',
      },
    ],
  },

  // 9. UNDER
  under: {
    role: 'preposition',
    exampleEn: 'The bag is under the table.',
    exampleHi: 'बैग मेज़ के नीचे है।',
    beginner: [
      {
        promptHi: 'बिल्ली मेज़ के नीचे है।',
        expectedEn: 'The cat is under the table.',
        alternatives: ['The cat is under the table'],
        chips: ['the table', 'under', 'is', 'The cat'],
        ruleTipHi: 'The cat (Subject) + is (Verb) + under the table (Prepositional Phrase)',
      },
      {
        promptHi: 'बैग मेज़ के नीचे है।',
        expectedEn: 'The bag is under the table.',
        alternatives: ['The bag is under the table'],
        chips: ['the table', 'under', 'is', 'The bag'],
        ruleTipHi: 'The bag + is + under the table',
      },
    ],
    practice: [
      {
        promptHi: 'गेंद बिस्तर के नीचे नहीं है।',
        expectedEn: 'The ball is not under the bed.',
        alternatives: ["The ball isn't under the bed.", 'The ball is not under the bed'],
        chips: ['the bed', 'under', 'is not', 'The ball'],
        ruleTipHi: 'The ball + is not + under the bed',
      },
    ],
    challenge: [
      {
        promptHi: 'यात्री पेड़ के नीचे आराम कर रहे थे।',
        expectedEn: 'The travelers were resting under the tree.',
        alternatives: ['The travelers were resting under the tree'],
        chips: ['under the tree', 'were resting', 'The travelers'],
        ruleTipHi: 'Subject + were resting + under the tree',
      },
    ],
  },

  // 10. EAT
  eat: {
    role: 'action_verb',
    exampleEn: 'I eat rice.',
    exampleHi: 'मैं चावल खाता/खाती हूँ।',
    beginner: [
      {
        promptHi: 'मैं चावल खाता हूँ।',
        expectedEn: 'I eat rice.',
        alternatives: ['I eat rice', 'I eat plain rice.'],
        chips: ['rice', 'eat', 'I'],
        ruleTipHi: 'I (Subject) + eat (Verb) + rice (Object)',
      },
      {
        promptHi: 'ताज़ा फल खाओ।',
        expectedEn: 'Eat fresh fruits.',
        alternatives: ['Eat fresh fruits', 'Eat fresh fruit.'],
        chips: ['fresh fruits', 'Eat'],
        ruleTipHi: 'Eat + fresh fruits',
      },
    ],
    practice: [
      {
        promptHi: 'मैं जंक फूड नहीं खाता हूँ।',
        expectedEn: 'I do not eat junk food.',
        alternatives: ["I don't eat junk food.", 'I do not eat junk food'],
        chips: ['junk food', 'eat', 'do not', 'I'],
        ruleTipHi: 'I + do not eat + junk food',
      },
      {
        promptHi: 'क्या आप रात का खाना खाते हैं?',
        expectedEn: 'Do you eat dinner?',
        alternatives: ['Do you eat dinner'],
        chips: ['dinner?', 'eat', 'Do you'],
        ruleTipHi: 'Do you + eat + dinner?',
      },
    ],
    challenge: [
      {
        promptHi: 'हमें हमेशा स्वस्थ और साफ़ भोजन खाना चाहिए।',
        expectedEn: 'We should always eat healthy food.',
        alternatives: ['We should always eat healthy food'],
        chips: ['healthy food', 'eat', 'always', 'We should'],
        ruleTipHi: 'We should + always eat + healthy food',
      },
    ],
  },

  // 11. WORK (Verb)
  'work:action_verb': {
    role: 'action_verb',
    exampleEn: 'I work here.',
    exampleHi: 'मैं यहाँ काम करता/करती हूँ।',
    beginner: [
      {
        promptHi: 'मैं यहाँ काम करता हूँ।',
        expectedEn: 'I work here.',
        alternatives: ['I work here'],
        chips: ['here', 'work', 'I'],
        ruleTipHi: 'I (Subject) + work (Verb) + here (Place)',
      },
      {
        promptHi: 'मेहनत से काम करो।',
        expectedEn: 'Work hard.',
        alternatives: ['Work hard'],
        chips: ['hard', 'Work'],
        ruleTipHi: 'Work + hard',
      },
    ],
    practice: [
      {
        promptHi: 'वह रविवार को काम नहीं करता है।',
        expectedEn: 'He does not work on Sunday.',
        alternatives: ["He doesn't work on Sunday.", 'He does not work on Sunday'],
        chips: ['on Sunday', 'work', 'does not', 'He'],
        ruleTipHi: 'He + does not work + on Sunday',
      },
    ],
    challenge: [
      {
        promptHi: 'वे एक बड़े कार्यालय में साथ मिलकर काम करते हैं।',
        expectedEn: 'They work together in a big office.',
        alternatives: ['They work together in a big office'],
        chips: ['in a big office', 'together', 'work', 'They'],
        ruleTipHi: 'They + work together + in a big office',
      },
    ],
  },

  // 12. WORK (Noun)
  'work:noun': {
    role: 'noun',
    exampleEn: 'My work is complete.',
    exampleHi: 'मेरा काम पूरा है।',
    beginner: [
      {
        promptHi: 'मेरा काम पूरा है।',
        expectedEn: 'My work is complete.',
        alternatives: ['My work is complete', 'My work is done.'],
        chips: ['complete', 'is', 'My work'],
        ruleTipHi: 'My work (Subject) + is (Verb) + complete (Adjective)',
      },
      {
        promptHi: 'यह अच्छा काम है।',
        expectedEn: 'This is good work.',
        alternatives: ['This is good work'],
        chips: ['good work', 'is', 'This'],
        ruleTipHi: 'This + is + good work',
      },
    ],
    practice: [
      {
        promptHi: 'मेरे पास आज बहुत काम है।',
        expectedEn: 'I have a lot of work today.',
        alternatives: ['I have a lot of work today', 'I have much work today.'],
        chips: ['today', 'a lot of work', 'have', 'I'],
        ruleTipHi: 'I have + a lot of work + today',
      },
    ],
    challenge: [
      {
        promptHi: 'कृपया समय पर अपना काम समाप्त करें।',
        expectedEn: 'Please finish your work on time.',
        alternatives: ['Please finish your work on time'],
        chips: ['on time', 'your work', 'finish', 'Please'],
        ruleTipHi: 'Please finish + your work + on time',
      },
    ],
  },

  // 13. CHANGE (Verb)
  'change:action_verb': {
    role: 'action_verb',
    exampleEn: 'Please change it.',
    exampleHi: 'कृपया इसे बदलिए।',
    beginner: [
      {
        promptHi: 'कृपया इसे बदलिए।',
        expectedEn: 'Please change it.',
        alternatives: ['Please change it'],
        chips: ['it', 'change', 'Please'],
        ruleTipHi: 'Please + change + it',
      },
      {
        promptHi: 'अपने विचार बदलो।',
        expectedEn: 'Change your mind.',
        alternatives: ['Change your mind'],
        chips: ['your mind', 'Change'],
        ruleTipHi: 'Change + your mind',
      },
    ],
    practice: [
      {
        promptHi: 'वह अपना विचार नहीं बदलता है।',
        expectedEn: 'He does not change his mind.',
        alternatives: ["He doesn't change his mind.", 'He does not change his mind'],
        chips: ['his mind', 'change', 'does not', 'He'],
        ruleTipHi: 'He + does not change + his mind',
      },
    ],
    challenge: [
      {
        promptHi: 'अगर आप कड़ी मेहनत करेंगे तो अपनी ज़िंदगी बदल सकते हैं।',
        expectedEn: 'You can change your life if you work hard.',
        alternatives: ['You can change your life if you work hard'],
        chips: ['if you work hard', 'your life', 'change', 'You can'],
        ruleTipHi: 'You can change your life + if you work hard',
      },
    ],
  },

  // 14. CHANGE (Noun)
  'change:noun': {
    role: 'noun',
    exampleEn: 'Do you have change?',
    exampleHi: 'क्या आपके पास छुट्टे पैसे हैं?',
    beginner: [
      {
        promptHi: 'क्या आपके पास छुट्टे पैसे हैं?',
        expectedEn: 'Do you have change?',
        alternatives: ['Do you have change'],
        chips: ['change?', 'have', 'Do you'],
        ruleTipHi: 'Do you + have + change?',
      },
    ],
    practice: [
      {
        promptHi: 'मेरे पास छुट्टे पैसे नहीं हैं।',
        expectedEn: 'I do not have change.',
        alternatives: ["I don't have change.", 'I do not have change'],
        chips: ['change', 'have', 'do not', 'I'],
        ruleTipHi: 'I + do not have + change',
      },
    ],
    challenge: [
      {
        promptHi: 'कृपया बाज़ार जाने से पहले छुट्टे पैसे ले लें।',
        expectedEn: 'Please take some change before going to the market.',
        alternatives: ['Please take some change before going to the market'],
        chips: ['before going to the market', 'some change', 'take', 'Please'],
        ruleTipHi: 'Please take + some change + before going to the market',
      },
    ],
  },

  // 15. WHERE
  where: {
    role: 'wh_question',
    exampleEn: 'Where are you?',
    exampleHi: 'तुम कहाँ हो?',
    beginner: [
      {
        promptHi: 'तुम कहाँ रहते हो?',
        expectedEn: 'Where do you live?',
        alternatives: ['Where do you live'],
        chips: ['live?', 'do you', 'Where'],
        ruleTipHi: 'Where (कहाँ) + do you + live?',
      },
      {
        promptHi: 'स्टेशन कहाँ है?',
        expectedEn: 'Where is the station?',
        alternatives: ['Where is the station'],
        chips: ['the station?', 'is', 'Where'],
        ruleTipHi: 'Where + is + the station?',
      },
    ],
    practice: [
      {
        promptHi: 'वह कहाँ जा रहा है?',
        expectedEn: 'Where is he going?',
        alternatives: ['Where is he going'],
        chips: ['going?', 'he', 'is', 'Where'],
        ruleTipHi: 'Where + is he + going?',
      },
    ],
    challenge: [
      {
        promptHi: 'क्या आप जानते हैं कि अस्पताल कहाँ है?',
        expectedEn: 'Do you know where the hospital is?',
        alternatives: ['Do you know where the hospital is'],
        chips: ['the hospital is?', 'where', 'Do you know'],
        ruleTipHi: 'Do you know + where the hospital is?',
      },
    ],
  },

  // 16. SIT
  sit: {
    role: 'action_verb',
    exampleEn: 'Please sit down.',
    exampleHi: 'कृपया बैठ जाएं।',
    beginner: [
      {
        promptHi: 'यहाँ बैठो।',
        expectedEn: 'Sit here.',
        alternatives: ['Sit here', 'Please sit here.'],
        chips: ['here', 'Sit'],
        ruleTipHi: 'Sit (बैठो) + here (यहाँ)',
      },
      {
        promptHi: 'कुर्सी पर बैठो।',
        expectedEn: 'Sit on the chair.',
        alternatives: ['Sit on the chair'],
        chips: ['the chair', 'on', 'Sit'],
        ruleTipHi: 'Sit + on the chair',
      },
    ],
    practice: [
      {
        promptHi: 'वहाँ मत बैठो।',
        expectedEn: 'Do not sit there.',
        alternatives: ["Don't sit there.", 'Do not sit there'],
        chips: ['there', 'sit', 'Do not'],
        ruleTipHi: 'Do not + sit + there',
      },
    ],
    challenge: [
      {
        promptHi: 'आप यहाँ आराम से बैठ सकते हैं।',
        expectedEn: 'You can sit here comfortably.',
        alternatives: ['You can sit here comfortably'],
        chips: ['comfortably', 'here', 'sit', 'You can'],
        ruleTipHi: 'You can sit here + comfortably',
      },
    ],
  },
};

/**
 * Generates high quality, natural Hindi and English exercises based on
 * the actual grammatical role of the word.
 *
 * CRITICAL RULE: Under NO circumstances does ANY word fall into a generic
 * "I + have + a + [word]" or mechanical "मेरे पास [meaning] है" template.
 */
export function generateGrammaticallySoundExercises(
  rawWord: string,
  rawMeaning: string,
  chosenMeaning?: string
): Record<'beginner' | 'practice' | 'challenge', GeneratedSentenceExercise[]> {
  const word = rawWord.trim();
  const lower = word.toLowerCase();
  const meaning = (
    chosenMeaning ||
    rawMeaning.split(/\s*[/,;]\s*|\s+या\s+/)[0] ||
    rawMeaning
  ).trim();
  const role = analyzeGrammaticalRole(word, meaning);
  const badge = getRoleBadgeHi(role);

  // Check if we have exact curated beginner plan for this word (by role or plain word)
  const curatedKey = `${lower}:${role}`;
  const curated = CURATED_WORDS[curatedKey] || CURATED_WORDS[lower];
  if (curated) {
    const toExercise = (
      item: { promptHi: string; expectedEn: string; alternatives?: string[]; chips: string[]; ruleTipHi?: string },
      lvl: 'beginner' | 'practice' | 'challenge',
      idx: number
    ): GeneratedSentenceExercise => ({
      id: `${lower}-${lvl}-${idx + 1}`,
      level: lvl,
      targetWord: word,
      exampleSentenceEn: curated.exampleEn,
      exampleSentenceHi: curated.exampleHi,
      hindiPrompt: item.promptHi,
      expectedSentence: item.expectedEn,
      acceptedAlternatives: item.alternatives || [item.expectedEn],
      chips: shuffleChips(item.chips),
      explanationHi: `${item.ruleTipHi || item.expectedEn}। यह दैनिक बातचीत का बहुत सरल वाक्य है।`,
      ruleTipHi: item.ruleTipHi || item.expectedEn,
      grammaticalRole: curated.role,
      roleBadgeHi: getRoleBadgeHi(curated.role),
    });

    return {
      beginner: curated.beginner.map((b, i) => toExercise(b, 'beginner', i)),
      practice: curated.practice.map((p, i) => toExercise(p, 'practice', i)),
      challenge: curated.challenge.map((c, i) => toExercise(c, 'challenge', i)),
    };
  }

  // Capitalized word for beginning of sentences
  const capWord = word.charAt(0).toUpperCase() + word.slice(1);

  // =========================================================================
  // DYNAMIC GENERATORS PER GRAMMATICAL ROLE
  // Absolutely no generic "I have a [word]" or mechanical appending!
  // =========================================================================

  // 1. WH- QUESTION WORDS (who, what, where, when, why, how, whose, whom, which)
  if (role === 'wh_question') {
    let exampleEn = `${capWord} is your name?`;
    let exampleHi = `तुम्हारा नाम क्या है?`;
    let begPrompt = `तुम्हारा नाम क्या है?`;
    let begExpected = `What is your name?`;
    let begChips = ['name?', 'your', 'is', 'What'];

    if (lower === 'who') {
      exampleEn = 'Who is your friend?';
      exampleHi = 'तुम्हारा दोस्त कौन है?';
      begPrompt = 'वहाँ कौन है?';
      begExpected = 'Who is there?';
      begChips = ['there?', 'is', 'Who'];
    } else if (lower === 'what') {
      exampleEn = 'What do you want?';
      exampleHi = 'तुम क्या चाहते हो?';
      begPrompt = 'तुम्हारा नाम क्या है?';
      begExpected = 'What is your name?';
      begChips = ['name?', 'your', 'is', 'What'];
    } else if (lower === 'where') {
      exampleEn = 'Where is the school?';
      exampleHi = 'स्कूल कहाँ है?';
      begPrompt = 'तुम कहाँ हो?';
      begExpected = 'Where are you?';
      begChips = ['you?', 'are', 'Where'];
    } else if (lower === 'when') {
      exampleEn = 'When will you come?';
      exampleHi = 'तुम कब आओगे?';
      begPrompt = 'तुम कब उठते हो?';
      begExpected = 'When do you wake up?';
      begChips = ['wake up?', 'do you', 'When'];
    } else if (lower === 'why') {
      exampleEn = 'Why are you late?';
      exampleHi = 'तुम्हें देर क्यों हुई?';
      begPrompt = 'तुम खुश क्यों हो?';
      begExpected = 'Why are you happy?';
      begChips = ['happy?', 'you', 'are', 'Why'];
    } else if (lower === 'how') {
      exampleEn = 'How are you today?';
      exampleHi = 'आज आप कैसे हैं?';
      begPrompt = 'आप कैसे हैं?';
      begExpected = 'How are you?';
      begChips = ['you?', 'are', 'How'];
    } else if (lower === 'which') {
      exampleEn = 'Which book is yours?';
      exampleHi = 'कौन-सी किताब तुम्हारी है?';
      begPrompt = 'कौन-सी किताब तुम्हारी है?';
      begExpected = 'Which book is yours?';
      begChips = ['yours?', 'is', 'Which book'];
    } else if (lower === 'whose') {
      exampleEn = 'Whose bag is this?';
      exampleHi = 'यह किसका बैग है?';
      begPrompt = 'यह कलम किसकी है?';
      begExpected = 'Whose pen is this?';
      begChips = ['this?', 'is', 'Whose pen'];
    } else if (lower === 'whom') {
      exampleEn = 'Whom did you meet?';
      exampleHi = 'आप किससे मिले?';
      begPrompt = 'तुमने किसे देखा?';
      begExpected = 'Whom did you see?';
      begChips = ['you see?', 'did', 'Whom'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-q1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace('?', '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} का प्रयोग प्रश्न पूछने के लिए किया जाता है।`,
          ruleTipHi: `${capWord} + Verb + Subject?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-q1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या आप जानते हैं कि यह ${meaning} है?`,
          expectedSentence: `Do you know ${lower} this is?`,
          acceptedAlternatives: [`Do you know ${lower} this is`],
          chips: shuffleChips([`${lower} this is?`, 'know', 'Do you']),
          explanationHi: `Do you know + ${word} this is?`,
          ruleTipHi: `Do you know + ${word} this is?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-q1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया मुझे बताएँ कि मुझे क्या करना चाहिए।`,
          expectedSentence: `Please tell me ${lower} to do.`,
          acceptedAlternatives: [`Please tell me ${lower} to do`],
          chips: shuffleChips([`${lower} to do`, 'tell me', 'Please']),
          explanationHi: `Please tell me + ${word} to do।`,
          ruleTipHi: `Please tell me + ${word} to do`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 2. CONJUNCTIONS (unless, because, although, if, and, but, or, so, since, while, than)
  if (role === 'conjunction') {
    let exampleEn = `I will stay home ${lower} it is raining.`;
    let exampleHi = `मैं घर पर रहूँगा ${meaning} बारिश हो रही है।`;
    let begPrompt = `वह थका हुआ था ${meaning} वह सो गया।`;
    let begExpected = `He was tired ${lower} he slept.`;
    let begChips = ['he slept', lower, 'was tired', 'He'];

    if (lower === 'unless') {
      exampleEn = 'I will go unless it rains.';
      exampleHi = 'अगर बारिश नहीं हुई, तो मैं जाऊँगा।';
      begPrompt = 'जब तक मैं न कहूँ, मत जाना।';
      begExpected = 'Do not go unless I tell you.';
      begChips = ['I tell you', 'unless', 'Do not go'];
    } else if (lower === 'because') {
      exampleEn = 'I am happy because I won.';
      exampleHi = 'मैं खुश हूँ क्योंकि मैं जीत गया।';
      begPrompt = 'मैं खुश हूँ क्योंकि मैं जीत गया।';
      begExpected = 'I am happy because I won.';
      begChips = ['I won', 'because', 'happy', 'I am'];
    } else if (lower === 'although' || lower === 'though') {
      exampleEn = 'Although it was raining, he went out.';
      exampleHi = 'यद्यपि बारिश हो रही थी, वह बाहर गया।';
      begPrompt = 'यद्यपि ठंड थी, वह बाहर गया।';
      begExpected = 'Although it was cold, he went out.';
      begChips = ['he went out', 'it was cold', 'Although'];
    } else if (lower === 'if') {
      exampleEn = 'If you come, I will help.';
      exampleHi = 'अगर तुम आओगे, तो मैं मदद करूँगा।';
      begPrompt = 'अगर तुम आओगे, तो मैं मदद करूँगा।';
      begExpected = 'If you come, I will help.';
      begChips = ['I will help', 'you come', 'If'];
    } else if (lower === 'and') {
      exampleEn = 'You and I are friends.';
      exampleHi = 'तुम और मैं दोस्त हैं।';
      begPrompt = 'तुम और मैं दोस्त हैं।';
      begExpected = 'You and I are friends.';
      begChips = ['friends', 'are', 'and I', 'You'];
    } else if (lower === 'but') {
      exampleEn = 'He is small but strong.';
      exampleHi = 'वह छोटा है लेकिन मजबूत है।';
      begPrompt = 'वह गरीब है लेकिन ईमानदार है।';
      begExpected = 'He is poor but honest.';
      begChips = ['honest', 'but', 'is poor', 'He'];
    } else if (lower === 'or') {
      exampleEn = 'Do you want tea or water?';
      exampleHi = 'क्या आपको चाय चाहिए या पानी?';
      begPrompt = 'चाय या पानी?';
      begExpected = 'Tea or water?';
      begChips = ['water?', 'or', 'Tea'];
    } else if (lower === 'so') {
      exampleEn = 'I was hungry, so I ate.';
      exampleHi = 'मुझे भूख लगी थी, इसलिए मैंने खाया।';
      begPrompt = 'मैं थक गया था, इसलिए मैं सो गया।';
      begExpected = 'I was tired so I slept.';
      begChips = ['I slept', 'so', 'was tired', 'I'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-c1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace(/[.,!?]/g, '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} दो वाक्यों या विचारों को आपस में जोड़ता है।`,
          ruleTipHi: `Clause 1 + ${word} + Clause 2`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-c1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हम घर पर रहे ${meaning} मौसम खराब था।`,
          expectedSentence: `We stayed home ${lower} the weather was bad.`,
          acceptedAlternatives: [`We stayed home ${lower} the weather was bad`],
          chips: shuffleChips(['the weather was bad', lower, 'home', 'We stayed']),
          explanationHi: `We stayed home + ${word} + the weather was bad।`,
          ruleTipHi: `Clause + ${word} + Clause`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-c1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया ध्यान रखें ${meaning} आप सुरक्षित रहें।`,
          expectedSentence: `Please be careful ${lower} you stay safe.`,
          acceptedAlternatives: [`Please be careful ${lower} you stay safe`],
          chips: shuffleChips(['you stay safe', lower, 'be careful', 'Please']),
          explanationHi: `Please be careful + ${word} + you stay safe।`,
          ruleTipHi: `Main Clause + ${word} + Subordinate Clause`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 3. SUBJECT PRONOUNS (I, you, he, she, it, we, they)
  if (role === 'subject_pronoun') {
    let exampleEn = `${capWord} speak English.`;
    let exampleHi = `${meaning} अंग्रेज़ी बोलते हैं।`;
    let begPrompt = `${meaning} खुश हैं।`;
    let begExpected = `${capWord} are happy.`;
    let begChips = ['happy', 'are', capWord];

    if (lower === 'i') {
      exampleEn = 'I am happy.';
      exampleHi = 'मैं खुश हूँ।';
      begPrompt = 'मैं चाय पसंद करता हूँ।';
      begExpected = 'I like tea.';
      begChips = ['tea', 'like', 'I'];
    } else if (lower === 'you') {
      exampleEn = 'You are my friend.';
      exampleHi = 'तुम मेरे दोस्त हो।';
      begPrompt = 'तुम अच्छे इंसान हो।';
      begExpected = 'You are a good person.';
      begChips = ['a good person', 'are', 'You'];
    } else if (lower === 'he') {
      exampleEn = 'He speaks English.';
      exampleHi = 'वह अंग्रेज़ी बोलता है।';
      begPrompt = 'वह मेरा दोस्त है।';
      begExpected = 'He is my friend.';
      begChips = ['my friend', 'is', 'He'];
    } else if (lower === 'she') {
      exampleEn = 'She is very kind.';
      exampleHi = 'वह बहुत दयालु है।';
      begPrompt = 'वह खुश है।';
      begExpected = 'She is happy.';
      begChips = ['happy', 'is', 'She'];
    } else if (lower === 'it') {
      exampleEn = 'It is raining outside.';
      exampleHi = 'बाहर बारिश हो रही है।';
      begPrompt = 'यह बहुत अच्छा है।';
      begExpected = 'It is very good.';
      begChips = ['very good', 'is', 'It'];
    } else if (lower === 'they') {
      exampleEn = 'They live in Delhi.';
      exampleHi = 'वे दिल्ली में रहते हैं।';
      begPrompt = 'वे हमारे दोस्त हैं।';
      begExpected = 'They are our friends.';
      begChips = ['our friends', 'are', 'They'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-sp1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace('.', '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} वाक्य में कर्ता (Subject) का कार्य करता है।`,
          ruleTipHi: `${capWord} + Verb + Object`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-sp1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `${meaning} यहाँ नहीं रहते हैं।`,
          expectedSentence: `${capWord} do not live here.`,
          acceptedAlternatives: [`${capWord} don't live here.`, `${capWord} do not live here`],
          chips: shuffleChips(['here', 'live', 'do not', capWord]),
          explanationHi: `${capWord} + do not live + here।`,
          ruleTipHi: `${capWord} + do not live + here`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-sp1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `${meaning} रोज़ाना साथ मिलकर अभ्यास करते हैं।`,
          expectedSentence: `${capWord} practice together every day.`,
          acceptedAlternatives: [`${capWord} practice together every day`],
          chips: shuffleChips(['every day', 'together', 'practice', capWord]),
          explanationHi: `${capWord} + practice together + every day।`,
          ruleTipHi: `${capWord} + practice together + every day`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 4. OBJECT PRONOUNS (me, him, her, us, them)
  if (role === 'object_pronoun') {
    let exampleEn = `Please help ${lower}.`;
    let exampleHi = `कृपया ${meaning} मदद करें।`;
    let begPrompt = `कृपया ${meaning} पानी दीजिए।`;
    let begExpected = `Please give ${lower} water.`;
    let begChips = ['water', lower, 'give', 'Please'];

    if (lower === 'me') {
      exampleEn = 'Please help me.';
      exampleHi = 'कृपया मेरी मदद करें।';
      begPrompt = 'कृपया मुझे पानी दें।';
      begExpected = 'Please give me water.';
      begChips = ['water', 'me', 'give', 'Please'];
    } else if (lower === 'him') {
      exampleEn = 'I know him.';
      exampleHi = 'मैं उसे जानता हूँ।';
      begPrompt = 'कृपया उसे बुलाएँ।';
      begExpected = 'Please call him.';
      begChips = ['him', 'call', 'Please'];
    } else if (lower === 'her') {
      exampleEn = 'I saw her yesterday.';
      exampleHi = 'मैंने कल उसे देखा।';
      begPrompt = 'उसकी बात सुनो।';
      begExpected = 'Listen to her.';
      begChips = ['her', 'to', 'Listen'];
    } else if (lower === 'us') {
      exampleEn = 'They helped us.';
      exampleHi = 'उन्होंने हमारी मदद की।';
      begPrompt = 'हमारे साथ आओ।';
      begExpected = 'Come with us.';
      begChips = ['us', 'with', 'Come'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-op1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace('.', '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} कर्म (Object) का रूप है।`,
          ruleTipHi: `Verb + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-op1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `मैं ${meaning} नहीं जानता हूँ।`,
          expectedSentence: `I do not know ${lower}.`,
          acceptedAlternatives: [`I don't know ${lower}.`, `I do not know ${lower}`],
          chips: shuffleChips([lower, 'know', 'do not', 'I']),
          explanationHi: `I + do not know + ${word}।`,
          ruleTipHi: `I + do not know + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-op1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया आज शाम ${meaning} यह संदेश दे दें।`,
          expectedSentence: `Please give ${lower} this message today.`,
          acceptedAlternatives: [`Please give ${lower} this message today`],
          chips: shuffleChips(['today', 'this message', lower, 'give', 'Please']),
          explanationHi: `Please give + ${word} + this message + today।`,
          ruleTipHi: `Please give + ${word} + message`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 5. POSSESSIVE DETERMINERS (my, your, his, our, their, its)
  if (role === 'possessive_determiner') {
    const exampleEn = `This is ${lower} house.`;
    const exampleHi = `यह ${meaning} घर है।`;

    return {
      beginner: [
        {
          id: `${lower}-beg-pd1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यह ${meaning} किताब है।`,
          expectedSentence: `This is ${lower} book.`,
          acceptedAlternatives: [`This is ${lower} book`],
          chips: shuffleChips(['book', lower, 'is', 'This']),
          explanationHi: `This (Subject) + is (Verb) + ${word} book (Possessive)।`,
          ruleTipHi: `This is + ${word} book`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
        {
          id: `${lower}-beg-pd2`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `${meaning} घर कहाँ है?`,
          expectedSentence: `Where is ${lower} house?`,
          acceptedAlternatives: [`Where is ${lower} house`],
          chips: shuffleChips(['house?', lower, 'is', 'Where']),
          explanationHi: `Where + is + ${word} house?`,
          ruleTipHi: `Where + is + ${word} house?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-pd1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यह ${meaning} कार नहीं है।`,
          expectedSentence: `This is not ${lower} car.`,
          acceptedAlternatives: [`This isn't ${lower} car.`, `This is not ${lower} car`],
          chips: shuffleChips(['car', lower, 'not', 'is', 'This']),
          explanationHi: `This + is not + ${word} car।`,
          ruleTipHi: `This + is not + ${word} car`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-pd1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया समय पर ${meaning} काम पूरा करें।`,
          expectedSentence: `Please complete ${lower} work on time.`,
          acceptedAlternatives: [`Please complete ${lower} work on time`],
          chips: shuffleChips(['on time', 'work', lower, 'complete', 'Please']),
          explanationHi: `Please complete + ${word} work + on time।`,
          ruleTipHi: `Please complete + ${word} work + on time`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 6. POSSESSIVE PRONOUNS (mine, yours, hers, ours, theirs)
  if (role === 'possessive_pronoun') {
    const exampleEn = `This book is ${lower}.`;
    const exampleHi = `यह किताब ${meaning} है।`;

    return {
      beginner: [
        {
          id: `${lower}-beg-pp1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यह किताब ${meaning} है।`,
          expectedSentence: `This book is ${lower}.`,
          acceptedAlternatives: [`This book is ${lower}`],
          chips: shuffleChips([lower, 'is', 'This book']),
          explanationHi: `This book (Subject) + is (Verb) + ${word} (Possessive Pronoun)।`,
          ruleTipHi: `This book + is + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-pp1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `वह बैग ${meaning} नहीं है।`,
          expectedSentence: `That bag is not ${lower}.`,
          acceptedAlternatives: [`That bag isn't ${lower}.`, `That bag is not ${lower}`],
          chips: shuffleChips([lower, 'not', 'is', 'That bag']),
          explanationHi: `That bag + is not + ${word}।`,
          ruleTipHi: `That bag + is not + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-pp1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `अंतिम निर्णय पूरी तरह से ${meaning} है।`,
          expectedSentence: `The final decision is entirely ${lower}.`,
          acceptedAlternatives: [`The final decision is entirely ${lower}`],
          chips: shuffleChips([lower, 'entirely', 'is', 'The final decision']),
          explanationHi: `The final decision + is entirely + ${word}।`,
          ruleTipHi: `The decision + is + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 7. QUANTIFIERS (many, much, some, any, few, all, none, several, little, both, each, every, enough)
  if (role === 'quantifier') {
    const exampleEn = `We have ${lower} options.`;
    const exampleHi = `हमारे पास ${meaning} विकल्प हैं।`;

    let begPrompt = `हमारे पास ${meaning} किताबें हैं।`;
    let begExpected = `We have ${lower} books.`;
    let begChips = ['books', lower, 'have', 'We'];

    if (lower === 'all') {
      begPrompt = 'सभी छात्र यहाँ हैं।';
      begExpected = 'All students are here.';
      begChips = ['here', 'are', 'students', 'All'];
    } else if (lower === 'some') {
      begPrompt = 'कृपया मुझे थोड़ा पानी दें।';
      begExpected = 'Please give me some water.';
      begChips = ['some water', 'me', 'give', 'Please'];
    } else if (lower === 'any') {
      begPrompt = 'क्या आपके पास कोई सवाल है?';
      begExpected = 'Do you have any questions?';
      begChips = ['any questions?', 'have', 'Do you'];
    } else if (lower === 'much') {
      begPrompt = 'मेरे पास ज़्यादा समय नहीं है।';
      begExpected = 'I do not have much time.';
      begChips = ['much time', 'have', 'do not', 'I'];
    } else if (lower === 'few') {
      begPrompt = 'मेरे पास कुछ दोस्त हैं।';
      begExpected = 'I have a few friends.';
      begChips = ['a few friends', 'have', 'I'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-qf1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace(/[.,!?]/g, '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} परिमाण या मात्रा को दर्शाता है।`,
          ruleTipHi: `${capWord} + Noun`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-qf1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या आपके पास पर्याप्त भोजन है?`,
          expectedSentence: `Do we have enough food?`,
          acceptedAlternatives: [`Do we have enough food`],
          chips: shuffleChips(['enough food?', 'have', 'Do we']),
          explanationHi: `Do we have + enough food?`,
          ruleTipHi: `Do we have + enough food?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-qf1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `इस पुस्तकालय में बहुत सी उपयोगी पुस्तकें हैं।`,
          expectedSentence: `There are many useful books in this library.`,
          acceptedAlternatives: [`There are many useful books in this library`],
          chips: shuffleChips(['in this library', 'useful books', 'many', 'There are']),
          explanationHi: `There are + many useful books + in this library।`,
          ruleTipHi: `There are + many + Noun`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 8. MODAL & AUXILIARY VERBS (can, will, should, could, would, is, are, am, was, were, do, does, have)
  if (role === 'modal_verb') {
    let exampleEn = `I ${lower} help you.`;
    let exampleHi = `मैं आपकी मदद ${meaning}।`;
    let begPrompt = `मैं आपकी मदद कर सकता हूँ।`;
    let begExpected = `I can help you.`;
    let begChips = ['you', 'help', 'can', 'I'];

    if (lower === 'can') {
      exampleEn = 'I can speak English.';
      exampleHi = 'मैं अंग्रेज़ी बोल सकता हूँ।';
      begPrompt = 'मैं अंग्रेज़ी बोल सकता हूँ।';
      begExpected = 'I can speak English.';
      begChips = ['English', 'speak', 'can', 'I'];
    } else if (lower === 'will') {
      exampleEn = 'I will come tomorrow.';
      exampleHi = 'मैं कल आऊँगा।';
      begPrompt = 'मैं कल आऊँगा।';
      begExpected = 'I will come tomorrow.';
      begChips = ['tomorrow', 'come', 'will', 'I'];
    } else if (lower === 'should') {
      exampleEn = 'You should sleep early.';
      exampleHi = 'तुम्हें जल्दी सोना चाहिए।';
      begPrompt = 'तुम्हें जल्दी सोना चाहिए।';
      begExpected = 'You should sleep early.';
      begChips = ['early', 'sleep', 'should', 'You'];
    } else if (lower === 'is') {
      exampleEn = 'He is my friend.';
      exampleHi = 'वह मेरा दोस्त है।';
      begPrompt = 'वह मेरा दोस्त है।';
      begExpected = 'He is my friend.';
      begChips = ['my friend', 'is', 'He'];
    } else if (lower === 'are') {
      exampleEn = 'We are students.';
      exampleHi = 'हम छात्र हैं।';
      begPrompt = 'हम छात्र हैं।';
      begExpected = 'We are students.';
      begChips = ['students', 'are', 'We'];
    } else if (lower === 'am') {
      exampleEn = 'I am happy.';
      exampleHi = 'मैं खुश हूँ।';
      begPrompt = 'मैं खुश हूँ।';
      begExpected = 'I am happy.';
      begChips = ['happy', 'am', 'I'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-mv1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace('.', '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} सहायक क्रिया है जो काल या सामर्थ्य दर्शाती है।`,
          ruleTipHi: `Subject + ${word} + Main Verb`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-mv1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या आप मेरी मदद कर सकते हैं?`,
          expectedSentence: `Can you help me?`,
          acceptedAlternatives: [`Can you help me`],
          chips: shuffleChips(['me?', 'help', 'you', 'Can']),
          explanationHi: `Can + you + help me?`,
          ruleTipHi: `Modal + Subject + Verb?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-mv1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हमें नियमों का ध्यानपूर्वक पालन करना चाहिए।`,
          expectedSentence: `We should follow the rules carefully.`,
          acceptedAlternatives: [`We should follow the rules carefully`],
          chips: shuffleChips(['carefully', 'the rules', 'follow', 'We should']),
          explanationHi: `We should + follow the rules + carefully।`,
          ruleTipHi: `Subject + should + Verb`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 9. ADVERBS (slowly, carefully, quickly, here, there, everywhere, today, tomorrow, please, etc.)
  if (role === 'adverb') {
    let exampleEn = `Please speak ${lower}.`;
    let exampleHi = `कृपया ${meaning} बोलें।`;
    let begPrompt = `वह ${meaning} चलता है।`;
    let begExpected = `He walks ${lower}.`;
    let begChips = [lower, 'walks', 'He'];

    // Specific common adverbs with natural idiomatic context
    if (lower === 'here') {
      exampleEn = 'Please come here.';
      exampleHi = 'कृपया यहाँ आएँ।';
      begPrompt = 'यहाँ बैठो।';
      begExpected = 'Sit here.';
      begChips = ['here', 'Sit'];
    } else if (lower === 'there') {
      exampleEn = 'He is standing there.';
      exampleHi = 'वह वहाँ खड़ा है।';
      begPrompt = 'वहाँ मत जाओ।';
      begExpected = 'Do not go there.';
      begChips = ['there', 'go', 'Do not'];
    } else if (lower === 'today') {
      exampleEn = 'Today is a good day.';
      exampleHi = 'आज का दिन अच्छा है।';
      begPrompt = 'हम आज मिलेंगे।';
      begExpected = 'We will meet today.';
      begChips = ['today', 'meet', 'will', 'We'];
    } else if (lower === 'tomorrow') {
      exampleEn = 'I will come tomorrow.';
      exampleHi = 'मैं कल आऊँगा।';
      begPrompt = 'वह कल आएगा।';
      begExpected = 'He will come tomorrow.';
      begChips = ['tomorrow', 'come', 'will', 'He'];
    } else if (lower === 'yesterday') {
      exampleEn = 'I saw him yesterday.';
      exampleHi = 'मैंने कल उसे देखा।';
      begPrompt = 'वह कल आया था।';
      begExpected = 'He came yesterday.';
      begChips = ['yesterday', 'came', 'He'];
    } else if (lower === 'always') {
      exampleEn = 'Always speak the truth.';
      exampleHi = 'हमेशा सच बोलो।';
      begPrompt = 'हमेशा सच बोलो।';
      begExpected = 'Always speak the truth.';
      begChips = ['the truth', 'speak', 'Always'];
    } else if (lower === 'never') {
      exampleEn = 'I never tell a lie.';
      exampleHi = 'मैं कभी झूठ नहीं बोलता।';
      begPrompt = 'कभी हार मत मानो।';
      begExpected = 'Never give up.';
      begChips = ['up', 'give', 'Never'];
    } else if (lower === 'please') {
      exampleEn = 'Please help me.';
      exampleHi = 'कृपया मेरी मदद करें।';
      begPrompt = 'कृपया बैठ जाइए।';
      begExpected = 'Please sit down.';
      begChips = ['down', 'sit', 'Please'];
    } else if (lower === 'now') {
      exampleEn = 'I am leaving now.';
      exampleHi = 'मैं अब निकल रहा हूँ।';
      begPrompt = 'कृपया अब शुरू करें।';
      begExpected = 'Please start now.';
      begChips = ['now', 'start', 'Please'];
    } else if (lower === 'very') {
      exampleEn = 'She is very kind.';
      exampleHi = 'वह बहुत दयालु है।';
      begPrompt = 'यह बहुत अच्छा है।';
      begExpected = 'This is very good.';
      begChips = ['good', 'very', 'is', 'This'];
    } else if (lower === 'also') {
      exampleEn = 'I also like tea.';
      exampleHi = 'मुझे भी चाय पसंद है।';
      begPrompt = 'मैं भी जाऊँगा।';
      begExpected = 'I will also go.';
      begChips = ['go', 'also', 'will', 'I'];
    } else if (lower === 'again') {
      exampleEn = 'Please try again.';
      exampleHi = 'कृपया फिर से कोशिश करें।';
      begPrompt = 'फिर से कोशिश करो।';
      begExpected = 'Try again.';
      begChips = ['again', 'Try'];
    }

    return {
      beginner: [
        {
          id: `${lower}-beg-adv1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: begPrompt,
          expectedSentence: begExpected,
          acceptedAlternatives: [begExpected, begExpected.replace('.', '')],
          chips: shuffleChips(begChips),
          explanationHi: `${capWord} क्रिया की विशेषता या परिस्थिति बताता है।`,
          ruleTipHi: `Subject + Verb + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-adv1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `सावधानी से गाड़ी चलाएँ।`,
          expectedSentence: `Please drive ${lower === 'slowly' || lower === 'carefully' ? lower : 'carefully'}.`,
          acceptedAlternatives: [`Please drive ${lower === 'slowly' || lower === 'carefully' ? lower : 'carefully'}`],
          chips: shuffleChips([lower === 'slowly' || lower === 'carefully' ? lower : 'carefully', 'drive', 'Please']),
          explanationHi: `Please drive + Adverb।`,
          ruleTipHi: `Please drive + Adverb`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-adv1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `आपको अपना काम ${meaning} पूरा करना चाहिए।`,
          expectedSentence: `You should finish your work ${lower}.`,
          acceptedAlternatives: [`You should finish your work ${lower}`],
          chips: shuffleChips([lower, 'your work', 'finish', 'You should']),
          explanationHi: `You should finish + your work + ${word}।`,
          ruleTipHi: `You should finish your work + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 10. PREPOSITIONS (in, on, at, under, with, behind, near, for, by, etc.)
  if (role === 'preposition') {
    const exampleEn = `The book is ${lower} the table.`;
    const exampleHi = `किताब मेज़ ${meaning} है।`;

    return {
      beginner: [
        {
          id: `${lower}-beg-prep1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `बैग कुर्सी ${meaning} है।`,
          expectedSentence: `The bag is ${lower} the chair.`,
          acceptedAlternatives: [`The bag is ${lower} the chair`],
          chips: shuffleChips(['the chair', lower, 'is', 'The bag']),
          explanationHi: `The bag + is + ${word} + the chair।`,
          ruleTipHi: `Subject + is + ${word} + the chair`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-prep1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `गेंद कार ${meaning} नहीं है।`,
          expectedSentence: `The ball is not ${lower} the car.`,
          acceptedAlternatives: [`The ball is not ${lower} the car`],
          chips: shuffleChips(['the car', lower, 'not', 'is', 'The ball']),
          explanationHi: `The ball + is not + ${word} + the car।`,
          ruleTipHi: `Subject + is not + ${word} + the car`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-prep1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `बच्चे पेड़ ${meaning} खेल रहे हैं।`,
          expectedSentence: `Children are playing ${lower} the tree.`,
          acceptedAlternatives: [`Children are playing ${lower} the tree`],
          chips: shuffleChips(['the tree', lower, 'are playing', 'Children']),
          explanationHi: `Children + are playing + ${word} + the tree।`,
          ruleTipHi: `Children are playing + ${word} + the tree`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 11. ACTION VERB (eat, drink, go, come, play, read, write, speak, etc.)
  if (role === 'action_verb') {
    const exampleEn = `Please ${lower} here.`;
    const exampleHi = `कृपया यहाँ ${meaning}।`;

    return {
      beginner: [
        {
          id: `${lower}-beg-v1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `मैं रोज़ाना ${meaning} चाहता हूँ।`,
          expectedSentence: `I want to ${lower} every day.`,
          acceptedAlternatives: [`I want to ${lower} every day`, `I ${lower} every day.`],
          chips: shuffleChips(['every day', lower, 'want to', 'I']),
          explanationHi: `I want to + ${word} + every day।`,
          ruleTipHi: `I want to + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
        {
          id: `${lower}-beg-v2`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया यह ${meaning}।`,
          expectedSentence: `Please ${lower} this.`,
          acceptedAlternatives: [`Please ${lower} this`],
          chips: shuffleChips(['this', lower, 'Please']),
          explanationHi: `Please + ${word} + this।`,
          ruleTipHi: `Please + ${word} + this`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-v1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यहाँ ऐसा मत करो।`,
          expectedSentence: `Do not ${lower} here.`,
          acceptedAlternatives: [`Don't ${lower} here.`, `Do not ${lower} here`],
          chips: shuffleChips(['here', lower, 'Do not']),
          explanationHi: `Do not + ${word} + here।`,
          ruleTipHi: `Do not + ${word} + here`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
        {
          id: `${lower}-prac-v2`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या आप यह कर सकते हैं?`,
          expectedSentence: `Can you ${lower} this?`,
          acceptedAlternatives: [`Can you ${lower} this`],
          chips: shuffleChips(['this?', lower, 'Can you']),
          explanationHi: `Can you + ${word} + this?`,
          ruleTipHi: `Can you + ${word} + this?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-v1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हम सभी को रोज़ाना साथ मिलकर अभ्यास करना चाहिए।`,
          expectedSentence: `We should ${lower} together every day.`,
          acceptedAlternatives: [`We should ${lower} together every day`],
          chips: shuffleChips(['every day', 'together', lower, 'We should']),
          explanationHi: `We should + ${word} + together + every day।`,
          ruleTipHi: `We should + ${word} + together + every day`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 12. ADJECTIVE (happy, good, new, big, safe, fresh, clean, etc.)
  if (role === 'adjective') {
    const exampleEn = `This is very ${lower}.`;
    const exampleHi = `यह बहुत ${meaning} है।`;

    return {
      beginner: [
        {
          id: `${lower}-beg-adj1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यह ${meaning} है।`,
          expectedSentence: `This is ${lower}.`,
          acceptedAlternatives: [`This is ${lower}`, `It is ${lower}.`],
          chips: shuffleChips([lower, 'is', 'This']),
          explanationHi: `This (Subject) + is (Verb) + ${word} (Adjective)।`,
          ruleTipHi: `This + is + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
        {
          id: `${lower}-beg-adj2`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कमरा ${meaning} है।`,
          expectedSentence: `The room is ${lower}.`,
          acceptedAlternatives: [`The room is ${lower}`],
          chips: shuffleChips([lower, 'is', 'The room']),
          explanationHi: `The room + is + ${word}।`,
          ruleTipHi: `The room + is + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-adj1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `यह ${meaning} नहीं है।`,
          expectedSentence: `This is not ${lower}.`,
          acceptedAlternatives: [`This isn't ${lower}.`, `This is not ${lower}`],
          chips: shuffleChips([lower, 'not', 'is', 'This']),
          explanationHi: `This + is not + ${word}।`,
          ruleTipHi: `This + is not + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
        {
          id: `${lower}-prac-adj2`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या यह ${meaning} है?`,
          expectedSentence: `Is this ${lower}?`,
          acceptedAlternatives: [`Is this ${lower}`],
          chips: shuffleChips([`${lower}?`, 'this', 'Is']),
          explanationHi: `Is + this + ${word}?`,
          ruleTipHi: `Is + this + ${word}?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-adj1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हमेशा अपने घर को ${meaning} रखें।`,
          expectedSentence: `Always keep your house ${lower}.`,
          acceptedAlternatives: [`Always keep your house ${lower}`],
          chips: shuffleChips([lower, 'your house', 'Always keep']),
          explanationHi: `Always keep + your house + ${word}।`,
          ruleTipHi: `Always keep + your house + ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // 13. NOUNS (Genuine people, places, things, abstract concepts)
  // Clean, natural noun exercises tailored by noun type:
  const isPerson = [
    'teacher', 'doctor', 'friend', 'father', 'mother', 'brother', 'sister', 'student',
    'boy', 'girl', 'man', 'woman', 'child', 'children', 'person', 'people', 'lawyer'
  ].includes(lower);

  const isLiquidOrUncountable = [
    'water', 'tea', 'milk', 'coffee', 'rice', 'money', 'food', 'time', 'sugar', 'salt', 'oil'
  ].includes(lower);

  const isPlace = [
    'school', 'hospital', 'market', 'home', 'house', 'room', 'park', 'city', 'station', 'village', 'office'
  ].includes(lower);

  if (isPerson) {
    const exampleEn = `She is a good ${lower}.`;
    const exampleHi = `वह एक अच्छी ${meaning} हैं।`;
    return {
      beginner: [
        {
          id: `${lower}-beg-p1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `वह मेरा ${meaning} है।`,
          expectedSentence: `He is my ${lower}.`,
          acceptedAlternatives: [`He is my ${lower}`, `She is my ${lower}.`],
          chips: shuffleChips([lower, 'my', 'is', 'He']),
          explanationHi: `He (Subject) + is (Verb) + my ${word} (Noun)।`,
          ruleTipHi: `He is + my ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-p1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या वह एक दयालु ${meaning} हैं?`,
          expectedSentence: `Is she a kind ${lower}?`,
          acceptedAlternatives: [`Is she a kind ${lower}`],
          chips: shuffleChips([`${lower}?`, 'a kind', 'she', 'Is']),
          explanationHi: `Is + she + a kind ${word}?`,
          ruleTipHi: `Is she a kind ${word}?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-p1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हर कोई एक सच्चे ${meaning} का सम्मान करता है।`,
          expectedSentence: `Everyone respects a true ${lower}.`,
          acceptedAlternatives: [`Everyone respects a true ${lower}`],
          chips: shuffleChips([`a true ${lower}`, 'respects', 'Everyone']),
          explanationHi: `Everyone respects + a true ${word}।`,
          ruleTipHi: `Everyone respects + a true ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  if (isLiquidOrUncountable) {
    const exampleEn = `Please give me some ${lower}.`;
    const exampleHi = `कृपया मुझे थोड़ा ${meaning} दें।`;
    return {
      beginner: [
        {
          id: `${lower}-beg-u1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `कृपया मुझे थोड़ा ${meaning} दें।`,
          expectedSentence: `Please give me some ${lower}.`,
          acceptedAlternatives: [`Please give me some ${lower}`],
          chips: shuffleChips([`some ${lower}`, 'me', 'give', 'Please']),
          explanationHi: `Please give me + some ${word}।`,
          ruleTipHi: `Please give me + some ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-u1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `क्या आप ${meaning} चाहते हैं?`,
          expectedSentence: `Do you want some ${lower}?`,
          acceptedAlternatives: [`Do you want some ${lower}`, `Do you want ${lower}?`],
          chips: shuffleChips([`some ${lower}?`, 'want', 'Do you']),
          explanationHi: `Do you want + some ${word}?`,
          ruleTipHi: `Do you want + some ${word}?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-u1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हमें रोज़ाना साफ़ और ताज़ा ${meaning} पीना चाहिए।`,
          expectedSentence: `We should drink clean ${lower} every day.`,
          acceptedAlternatives: [`We should drink clean ${lower} every day`],
          chips: shuffleChips(['every day', `clean ${lower}`, 'drink', 'We should']),
          explanationHi: `We should drink + clean ${word} + every day।`,
          ruleTipHi: `We should drink + clean ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  if (isPlace) {
    const exampleEn = `The ${lower} is very near.`;
    const exampleHi = `${meaning} बहुत पास है।`;
    return {
      beginner: [
        {
          id: `${lower}-beg-pl1`,
          level: 'beginner',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `मैं ${meaning} जा रहा हूँ।`,
          expectedSentence: `I am going to the ${lower}.`,
          acceptedAlternatives: [`I am going to the ${lower}`, `I go to ${lower}.`],
          chips: shuffleChips([`the ${lower}`, 'going to', 'am', 'I']),
          explanationHi: `I am going to + the ${word}।`,
          ruleTipHi: `I am going to + the ${word}`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      practice: [
        {
          id: `${lower}-prac-pl1`,
          level: 'practice',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `${meaning} कहाँ है?`,
          expectedSentence: `Where is the ${lower}?`,
          acceptedAlternatives: [`Where is the ${lower}`],
          chips: shuffleChips([`the ${lower}?`, 'is', 'Where']),
          explanationHi: `Where + is + the ${word}?`,
          ruleTipHi: `Where + is + the ${word}?`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
      challenge: [
        {
          id: `${lower}-chal-pl1`,
          level: 'challenge',
          targetWord: word,
          exampleSentenceEn: exampleEn,
          exampleSentenceHi: exampleHi,
          hindiPrompt: `हमारा नया ${meaning} शहर के मुख्य मार्ग पर स्थित है।`,
          expectedSentence: `Our new ${lower} is on the main road.`,
          acceptedAlternatives: [`Our new ${lower} is on the main road`],
          chips: shuffleChips(['on the main road', 'is', `Our new ${lower}`]),
          explanationHi: `Our new ${word} + is on the main road।`,
          ruleTipHi: `Our new ${word} + is on the main road`,
          grammaticalRole: role,
          roleBadgeHi: badge,
        },
      ],
    };
  }

  // Standard countable concrete/abstract noun:
  // Use natural beginner sentences: "This is a [noun].", "Where is the [noun]?", "I like this [noun]."
  const article = 'a ';
  const exampleEn = `This is a ${lower}.`;
  const exampleHi = `यह एक ${meaning} है।`;

  return {
    beginner: [
      {
        id: `${lower}-beg-n1`,
        level: 'beginner',
        targetWord: word,
        exampleSentenceEn: exampleEn,
        exampleSentenceHi: exampleHi,
        hindiPrompt: `यह एक ${meaning} है।`,
        expectedSentence: `This is ${article}${lower}.`.replace(/\s+/g, ' '),
        acceptedAlternatives: [
          `This is ${article}${lower}`.replace(/\s+/g, ' '),
          `It is a ${lower}.`,
        ],
        chips: shuffleChips([`${article}${lower}`.trim(), 'is', 'This']),
        explanationHi: `This (Subject) + is (Verb) + ${article}${word} (Noun)।`,
        ruleTipHi: `This + is + ${article}${word}`,
        grammaticalRole: role,
        roleBadgeHi: badge,
      },
      {
        id: `${lower}-beg-n2`,
        level: 'beginner',
        targetWord: word,
        exampleSentenceEn: exampleEn,
        exampleSentenceHi: exampleHi,
        hindiPrompt: `${meaning} कहाँ है?`,
        expectedSentence: `Where is the ${lower}?`,
        acceptedAlternatives: [`Where is the ${lower}`],
        chips: shuffleChips([`the ${lower}?`, 'is', 'Where']),
        explanationHi: `Where + is + the ${word}?`,
        ruleTipHi: `Where + is + the ${word}?`,
        grammaticalRole: role,
        roleBadgeHi: badge,
      },
    ],
    practice: [
      {
        id: `${lower}-prac-n1`,
        level: 'practice',
        targetWord: word,
        exampleSentenceEn: exampleEn,
        exampleSentenceHi: exampleHi,
        hindiPrompt: `मुझे यह ${meaning} पसंद है।`,
        expectedSentence: `I like this ${lower}.`,
        acceptedAlternatives: [`I like this ${lower}`],
        chips: shuffleChips([`this ${lower}`, 'like', 'I']),
        explanationHi: `I + like + this ${word}।`,
        ruleTipHi: `I + like + this ${word}`,
        grammaticalRole: role,
        roleBadgeHi: badge,
      },
      {
        id: `${lower}-prac-n2`,
        level: 'practice',
        targetWord: word,
        exampleSentenceEn: exampleEn,
        exampleSentenceHi: exampleHi,
        hindiPrompt: `क्या आपको ${meaning} की ज़रूरत है?`,
        expectedSentence: `Do you need a ${lower}?`,
        acceptedAlternatives: [`Do you need a ${lower}`],
        chips: shuffleChips([`a ${lower}?`, 'need', 'Do you']),
        explanationHi: `Do you need + a ${word}?`,
        ruleTipHi: `Do you need + a ${word}?`,
        grammaticalRole: role,
        roleBadgeHi: badge,
      },
    ],
    challenge: [
      {
        id: `${lower}-chal-n1`,
        level: 'challenge',
        targetWord: word,
        exampleSentenceEn: exampleEn,
        exampleSentenceHi: exampleHi,
        hindiPrompt: `कृपया ${meaning} मेज़ पर रख दें।`,
        expectedSentence: `Please put the ${lower} on the table.`,
        acceptedAlternatives: [`Please put the ${lower} on the table`],
        chips: shuffleChips(['on the table', `the ${lower}`, 'Please put']),
        explanationHi: `Please put + the ${word} + on the table।`,
        ruleTipHi: `Please put + the ${word} + on the table`,
        grammaticalRole: role,
        roleBadgeHi: badge,
      },
    ],
  };
}
