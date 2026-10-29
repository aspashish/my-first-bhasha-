/**
 * Verb Conjugation & Sentence Generation Engine for BhashaGuru
 * 
 * Accurately handles irregular and regular verb forms across:
 * - Present Simple (Base, 3rd Person -s/-es)
 * - Past Simple (V2)
 * - Future Simple (will + Base)
 * - Present Continuous (am/is/are + V-ing)
 * - Present Perfect (have/has + V3)
 * 
 * Supports Positive (+), Negative (-), and Question (?) forms across
 * Beginner, Practice, and Challenge levels with natural, idiomatically translated Hindi.
 */

import { TenseKey, FormType, TenseLevel, TenseExercise } from '../data/fiveTensesData';
import { VocabularyWord } from '../types/learning';
import { shuffleChips } from './sentenceGrammarEngine';

export interface VerbConjugationForms {
  base: string;           // V1 (e.g., 'write')
  thirdPerson: string;    // V1+s/es (e.g., 'writes')
  past: string;           // V2 (e.g., 'wrote')
  pastParticiple: string; // V3 (e.g., 'written')
  presentParticiple: string; // V-ing (e.g., 'writing')
  hindiBase: string;      // e.g., 'लिखना'
}

/**
 * Irregular verb forms table covering all irregular verbs in BhashaGuru 659 vocabulary
 */
export const IRREGULAR_VERBS: Record<string, Omit<VerbConjugationForms, 'hindiBase'>> = {
  say: { base: 'say', thirdPerson: 'says', past: 'said', pastParticiple: 'said', presentParticiple: 'saying' },
  get: { base: 'get', thirdPerson: 'gets', past: 'got', pastParticiple: 'got', presentParticiple: 'getting' },
  make: { base: 'make', thirdPerson: 'makes', past: 'made', pastParticiple: 'made', presentParticiple: 'making' },
  go: { base: 'go', thirdPerson: 'goes', past: 'went', pastParticiple: 'gone', presentParticiple: 'going' },
  know: { base: 'know', thirdPerson: 'knows', past: 'knew', pastParticiple: 'known', presentParticiple: 'knowing' },
  take: { base: 'take', thirdPerson: 'takes', past: 'took', pastParticiple: 'taken', presentParticiple: 'taking' },
  see: { base: 'see', thirdPerson: 'sees', past: 'saw', pastParticiple: 'seen', presentParticiple: 'seeing' },
  come: { base: 'come', thirdPerson: 'comes', past: 'came', pastParticiple: 'come', presentParticiple: 'coming' },
  think: { base: 'think', thirdPerson: 'thinks', past: 'thought', pastParticiple: 'thought', presentParticiple: 'thinking' },
  give: { base: 'give', thirdPerson: 'gives', past: 'gave', pastParticiple: 'given', presentParticiple: 'giving' },
  find: { base: 'find', thirdPerson: 'finds', past: 'found', pastParticiple: 'found', presentParticiple: 'finding' },
  tell: { base: 'tell', thirdPerson: 'tells', past: 'told', pastParticiple: 'told', presentParticiple: 'telling' },
  feel: { base: 'feel', thirdPerson: 'feels', past: 'felt', pastParticiple: 'felt', presentParticiple: 'feeling' },
  leave: { base: 'leave', thirdPerson: 'leaves', past: 'left', pastParticiple: 'left', presentParticiple: 'leaving' },
  keep: { base: 'keep', thirdPerson: 'keeps', past: 'kept', pastParticiple: 'kept', presentParticiple: 'keeping' },
  hold: { base: 'hold', thirdPerson: 'holds', past: 'held', pastParticiple: 'held', presentParticiple: 'holding' },
  begin: { base: 'begin', thirdPerson: 'begins', past: 'began', pastParticiple: 'begun', presentParticiple: 'beginning' },
  bring: { base: 'bring', thirdPerson: 'brings', past: 'brought', pastParticiple: 'brought', presentParticiple: 'bringing' },
  run: { base: 'run', thirdPerson: 'runs', past: 'ran', pastParticiple: 'run', presentParticiple: 'running' },
  write: { base: 'write', thirdPerson: 'writes', past: 'wrote', pastParticiple: 'written', presentParticiple: 'writing' },
  set: { base: 'set', thirdPerson: 'sets', past: 'set', pastParticiple: 'set', presentParticiple: 'setting' },
  pay: { base: 'pay', thirdPerson: 'pays', past: 'paid', pastParticiple: 'paid', presentParticiple: 'paying' },
  hear: { base: 'hear', thirdPerson: 'hears', past: 'heard', pastParticiple: 'heard', presentParticiple: 'hearing' },
  meet: { base: 'meet', thirdPerson: 'meets', past: 'met', pastParticiple: 'met', presentParticiple: 'meeting' },
  lead: { base: 'lead', thirdPerson: 'leads', past: 'led', pastParticiple: 'led', presentParticiple: 'leading' },
  stand: { base: 'stand', thirdPerson: 'stands', past: 'stood', pastParticiple: 'stood', presentParticiple: 'standing' },
  sit: { base: 'sit', thirdPerson: 'sits', past: 'sat', pastParticiple: 'sat', presentParticiple: 'sitting' },
  let: { base: 'let', thirdPerson: 'lets', past: 'let', pastParticiple: 'let', presentParticiple: 'letting' },
  read: { base: 'read', thirdPerson: 'reads', past: 'read', pastParticiple: 'read', presentParticiple: 'reading' },
  lose: { base: 'lose', thirdPerson: 'loses', past: 'lost', pastParticiple: 'lost', presentParticiple: 'losing' },
  fall: { base: 'fall', thirdPerson: 'falls', past: 'fell', pastParticiple: 'fallen', presentParticiple: 'falling' },
  buy: { base: 'buy', thirdPerson: 'buys', past: 'bought', pastParticiple: 'bought', presentParticiple: 'buying' },
  speak: { base: 'speak', thirdPerson: 'speaks', past: 'spoke', pastParticiple: 'spoken', presentParticiple: 'speaking' },
  send: { base: 'send', thirdPerson: 'sends', past: 'sent', pastParticiple: 'sent', presentParticiple: 'sending' },
  win: { base: 'win', thirdPerson: 'wins', past: 'won', pastParticiple: 'won', presentParticiple: 'winning' },
  understand: { base: 'understand', thirdPerson: 'understands', past: 'understood', pastParticiple: 'understood', presentParticiple: 'understanding' },
  build: { base: 'build', thirdPerson: 'builds', past: 'built', pastParticiple: 'built', presentParticiple: 'building' },
  spend: { base: 'spend', thirdPerson: 'spends', past: 'spent', pastParticiple: 'spent', presentParticiple: 'spending' },
  draw: { base: 'draw', thirdPerson: 'draws', past: 'drew', pastParticiple: 'drawn', presentParticiple: 'drawing' },
  sell: { base: 'sell', thirdPerson: 'sells', past: 'sold', pastParticiple: 'sold', presentParticiple: 'selling' },
  break: { base: 'break', thirdPerson: 'breaks', past: 'broke', pastParticiple: 'broken', presentParticiple: 'breaking' },
  grow: { base: 'grow', thirdPerson: 'grows', past: 'grew', pastParticiple: 'grown', presentParticiple: 'growing' },
  cut: { base: 'cut', thirdPerson: 'cuts', past: 'cut', pastParticiple: 'cut', presentParticiple: 'cutting' },
  cost: { base: 'cost', thirdPerson: 'costs', past: 'cost', pastParticiple: 'cost', presentParticiple: 'costing' },
  eat: { base: 'eat', thirdPerson: 'eats', past: 'ate', pastParticiple: 'eaten', presentParticiple: 'eating' },
  drink: { base: 'drink', thirdPerson: 'drinks', past: 'drank', pastParticiple: 'drunk', presentParticiple: 'drinking' },
  sleep: { base: 'sleep', thirdPerson: 'sleeps', past: 'slept', pastParticiple: 'slept', presentParticiple: 'sleeping' },
  teach: { base: 'teach', thirdPerson: 'teaches', past: 'taught', pastParticiple: 'taught', presentParticiple: 'teaching' },
  catch: { base: 'catch', thirdPerson: 'catches', past: 'caught', pastParticiple: 'caught', presentParticiple: 'catching' },
  drive: { base: 'drive', thirdPerson: 'drives', past: 'drove', pastParticiple: 'driven', presentParticiple: 'driving' },
  become: { base: 'become', thirdPerson: 'becomes', past: 'became', pastParticiple: 'become', presentParticiple: 'becoming' },
  choose: { base: 'choose', thirdPerson: 'chooses', past: 'chose', pastParticiple: 'chosen', presentParticiple: 'choosing' },
  forget: { base: 'forget', thirdPerson: 'forgets', past: 'forgot', pastParticiple: 'forgotten', presentParticiple: 'forgetting' },
  ring: { base: 'ring', thirdPerson: 'rings', past: 'rang', pastParticiple: 'rung', presentParticiple: 'ringing' },
  rise: { base: 'rise', thirdPerson: 'rises', past: 'rose', pastParticiple: 'risen', presentParticiple: 'rising' },
  swim: { base: 'swim', thirdPerson: 'swims', past: 'swam', pastParticiple: 'swum', presentParticiple: 'swimming' },
};

/**
 * Regular English verb inflection generator
 */
export function getVerbForms(verb: string, hindiMeaning: string): VerbConjugationForms {
  const v = verb.toLowerCase().trim();
  const hindiBase = hindiMeaning.trim();

  if (IRREGULAR_VERBS[v]) {
    return {
      ...IRREGULAR_VERBS[v],
      hindiBase,
    };
  }

  // Regular 3rd person -s / -es / -ies
  let thirdPerson = `${v}s`;
  if (v.endsWith('ch') || v.endsWith('sh') || v.endsWith('ss') || v.endsWith('x') || v.endsWith('zz') || v.endsWith('o')) {
    thirdPerson = `${v}es`;
  } else if (v.endsWith('y') && !/[aeiou]y$/.test(v)) {
    thirdPerson = `${v.slice(0, -1)}ies`;
  }

  // Regular Past & Past Participle -ed / -d / -ied
  let past = `${v}ed`;
  if (v.endsWith('e')) {
    past = `${v}d`;
  } else if (v.endsWith('y') && !/[aeiou]y$/.test(v)) {
    past = `${v.slice(0, -1)}ied`;
  } else if (
    v.length >= 3 &&
    /[^aeiou][aeiou][^aeiouwyz]$/.test(v) &&
    !['open', 'happen', 'listen', 'visit', 'offer', 'enter', 'order'].includes(v)
  ) {
    // Double consonant for CVC short words (e.g. stop -> stopped, fit -> fitted)
    past = `${v}${v[v.length - 1]}ed`;
  }

  const pastParticiple = past;

  // Regular Present Participle -ing
  let presentParticiple = `${v}ing`;
  if (v.endsWith('ie')) {
    presentParticiple = `${v.slice(0, -2)}ying`;
  } else if (v.endsWith('e') && !v.endsWith('ee') && v !== 'be') {
    presentParticiple = `${v.slice(0, -1)}ing`;
  } else if (
    v.length >= 3 &&
    /[^aeiou][aeiou][^aeiouwyz]$/.test(v) &&
    !['open', 'happen', 'listen', 'visit', 'offer', 'enter', 'order'].includes(v)
  ) {
    presentParticiple = `${v}${v[v.length - 1]}ing`;
  }

  return {
    base: v,
    thirdPerson,
    past,
    pastParticiple,
    presentParticiple,
    hindiBase,
  };
}

/**
 * Filter non-verbs from vocabulary words to strictly yield legitimate verbs.
 * Excludes nouns, adjectives, pronouns, and prepositions while keeping verbs
 * that learners can practice in tense sentences.
 */
export const NON_ACTION_WORDS = new Set([
  'month', 'factory', 'military', 'knee', 'abattoir', 'old', 'warm', 'double', 'triple',
  'without', 'be', 'have', 'do', 'will', 'can', 'should', 'would', 'could', 'may', 'might',
  'must', 'shall', 'inside', 'outside', 'near', 'far', 'sorry', 'seem', 'appear', 'happen'
]);

export function isLegitimateVerb(word: VocabularyWord): boolean {
  if (!word || !word.word) return false;
  const wl = word.word.toLowerCase().trim();
  const hl = (word.hindiMeaning || '').trim();

  if (NON_ACTION_WORDS.has(wl)) return false;

  // Known irregular verbs or common action verbs are always verbs
  if (IRREGULAR_VERBS[wl]) return true;

  // Known verb indicators in Hindi
  if (
    hl.endsWith('ना') ||
    hl.includes(' करना') ||
    hl.includes(' देना') ||
    hl.includes(' लेना') ||
    hl.includes(' पाना') ||
    hl.includes(' कहना') ||
    hl.includes(' बनाना') ||
    hl.includes(' जाना') ||
    hl.includes(' आना') ||
    hl.includes(' धोना') ||
    hl.includes(' सोना') ||
    hl.includes(' पढ़ना') ||
    hl.includes(' लिखना') ||
    hl.includes(' बोलना') ||
    hl.includes(' देखना') ||
    hl.includes(' सुनना') ||
    hl.includes(' रखना')
  ) {
    return true;
  }

  return false;
}

/**
 * Creates chips for a sentence by tokenizing words, stripping punctuation,
 * and scrambling the order.
 */
export function createChipsForSentence(sentence: string, extraWords: string[] = []): string[] {
  const cleaned = sentence
    .replace(/[.,!?;:'"()]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const combined = [...cleaned, ...extraWords];
  return shuffleChips(combined);
}

/**
 * Custom handcrafted sentences for high-frequency vocabulary verbs across all 5 tenses
 * to provide maximum naturalness, practical real-life usage, and accurate Hindi meanings.
 */
interface VerbTenseSentenceTemplate {
  tenseKey: TenseKey;
  level: TenseLevel;
  formType: FormType;
  expectedSentence: string;
  hindiPrompt: string;
  structureFormula: string;
  explanationHi: string;
  situationContextHi: string;
  extraDistractors?: string[];
}

export const VERB_SPECIAL_EXERCISES: Record<string, VerbTenseSentenceTemplate[]> = {
  // 1. WRITE
  write: [
    // Present Simple
    {
      tenseKey: 'present_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I write in my notebook every day.',
      hindiPrompt: 'मैं रोज़ अपनी नोटबुक में लिखता हूँ।',
      structureFormula: 'Subject (I) + V1 (write) + Object/Adverbial',
      explanationHi: 'नियमित आदत के लिए Present Simple (V1 write) का प्रयोग होता है।',
      situationContextHi: 'दैनिक दिनचर्या और पढ़ाई',
      extraDistractors: ['wrote', 'writing'],
    },
    {
      tenseKey: 'present_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He does not write letters anymore.',
      hindiPrompt: 'वह अब पत्र नहीं लिखता है।',
      structureFormula: 'Subject (He) + does not + V1 (write) + Object',
      explanationHi: 'He/She के साथ नकारात्मक में does not + base verb (write) आता है।',
      situationContextHi: 'नकारात्मक आदत',
      extraDistractors: ['writes', 'did not'],
    },
    {
      tenseKey: 'present_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Do you write daily in your personal diary?',
      hindiPrompt: 'क्या आप रोज़ अपनी व्यक्तिगत डायरी में लिखते हैं?',
      structureFormula: 'Do + Subject (you) + V1 (write) + Object + ?',
      explanationHi: 'सवाल पूछने के लिए Do + you + base verb का प्रयोग होता है।',
      situationContextHi: 'व्यक्तिगत आदत के बारे में प्रश्न',
      extraDistractors: ['Does', 'writing'],
    },

    // Past Simple
    {
      tenseKey: 'past_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I wrote a letter yesterday.',
      hindiPrompt: 'मैंने कल एक पत्र लिखा।',
      structureFormula: 'Subject (I) + V2 (wrote) + Object + Time (yesterday)',
      explanationHi: 'बीते हुए कल के कार्य के लिए Past Simple (V2 wrote) लगता है।',
      situationContextHi: 'कल का पूरा हुआ काम',
      extraDistractors: ['write', 'written'],
    },
    {
      tenseKey: 'past_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She did not write the answer on the board.',
      hindiPrompt: 'उसने बोर्ड पर उत्तर नहीं लिखा।',
      structureFormula: 'Subject (She) + did not + V1 (write) + Object',
      explanationHi: 'Past Simple नकारात्मक में did not के बाद हमेशा base form (write) आती है।',
      situationContextHi: 'कक्षा की स्थिति',
      extraDistractors: ['wrote', 'does not'],
    },
    {
      tenseKey: 'past_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Did you write that email to the manager yesterday?',
      hindiPrompt: 'क्या आपने कल मैनेजर को वह ईमेल लिखा था?',
      structureFormula: 'Did + Subject (you) + V1 (write) + Object + ?',
      explanationHi: 'भूतकाल के सवाल में Did + Subject + V1 (write) आता है।',
      situationContextHi: 'कार्यालय कार्य की पुष्टि',
      extraDistractors: ['Do', 'wrote'],
    },

    // Future Simple
    {
      tenseKey: 'future_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I will write to my friend tomorrow.',
      hindiPrompt: 'मैं कल अपने दोस्त को लिखूंगा।',
      structureFormula: 'Subject (I) + will + V1 (write) + Object + Time (tomorrow)',
      explanationHi: 'भविष्य के कार्य के लिए will + V1 (write) का प्रयोग होता है।',
      situationContextHi: 'कल का वादा',
      extraDistractors: ['wrote', 'am writing'],
    },
    {
      tenseKey: 'future_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'They will not write the exam next week.',
      hindiPrompt: 'वे अगले सप्ताह परीक्षा नहीं लिखेंगे।',
      structureFormula: 'Subject (They) + will not + V1 (write) + Object',
      explanationHi: 'भविष्य के नकारात्मक वाक्य में will not (won\'t) + V1 आता है।',
      situationContextHi: 'परीक्षा की योजना',
      extraDistractors: ['do not', 'wrote'],
    },
    {
      tenseKey: 'future_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Will you write a review for our new project?',
      hindiPrompt: 'क्या आप हमारे नए प्रोजेक्ट के लिए समीक्षा लिखेंगे?',
      structureFormula: 'Will + Subject (you) + V1 (write) + Object + ?',
      explanationHi: 'भविष्य के सवाल में Will पहले आता है।',
      situationContextHi: 'प्रोजेक्ट सहयोग का अनुरोध',
      extraDistractors: ['Did', 'written'],
    },

    // Present Continuous
    {
      tenseKey: 'present_continuous',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I am writing a letter now.',
      hindiPrompt: 'मैं अभी एक पत्र लिख रहा हूँ।',
      structureFormula: 'Subject (I) + am + V-ing (writing) + Object + now',
      explanationHi: 'अभी चल रहे कार्य के लिए am + writing का प्रयोग होता है।',
      situationContextHi: 'वर्तमान में चल रहा कार्य',
      extraDistractors: ['write', 'wrote'],
    },
    {
      tenseKey: 'present_continuous',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She is not writing her homework right now.',
      hindiPrompt: 'वह इस समय अपना गृहकार्य नहीं लिख रही है।',
      structureFormula: 'Subject (She) + is not + V-ing (writing) + Object',
      explanationHi: 'वर्तमान में न हो रहे कार्य के लिए is not + V-ing आता है।',
      situationContextHi: 'अध्ययन समय',
      extraDistractors: ['does not', 'wrote'],
    },
    {
      tenseKey: 'present_continuous',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Are you writing notes during the lecture?',
      hindiPrompt: 'क्या आप व्याख्यान के दौरान नोट्स लिख रहे हैं?',
      structureFormula: 'Are + Subject (you) + V-ing (writing) + Object + ?',
      explanationHi: 'वर्तमान में जारी क्रिया का सवाल Are + you + V-ing से बनता है।',
      situationContextHi: 'कक्षा व्याख्यान',
      extraDistractors: ['Do', 'write'],
    },

    // Present Perfect
    {
      tenseKey: 'present_perfect',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I have written three sentences.',
      hindiPrompt: 'मैंने तीन वाक्य लिख लिए हैं।',
      structureFormula: 'Subject (I) + have + V3 (written) + Object',
      explanationHi: 'काम अभी-अभी पूरा हुआ है, इसलिए have + V3 (written) आता है।',
      situationContextHi: 'अभ्यास कार्य पूरा होना',
      extraDistractors: ['wrote', 'writing'],
    },
    {
      tenseKey: 'present_perfect',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He has not written his feedback yet.',
      hindiPrompt: 'उसने अभी तक अपनी प्रतिक्रिया नहीं लिखी है।',
      structureFormula: 'Subject (He) + has not + V3 (written) + yet',
      explanationHi: 'He के साथ has not + V3 (written) का प्रयोग होता है।',
      situationContextHi: 'प्रतिक्रिया की स्थिति',
      extraDistractors: ['did not', 'wrote'],
    },
    {
      tenseKey: 'present_perfect',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Have you written the final report for the client?',
      hindiPrompt: 'क्या आपने क्लाइंट के लिए अंतिम रिपोर्ट लिख ली है?',
      structureFormula: 'Have + Subject (you) + V3 (written) + Object + ?',
      explanationHi: 'Present Perfect प्रश्न में Have + you + V3 (written) का प्रयोग होता है।',
      situationContextHi: 'कार्यालय की अंतिम रिपोर्ट',
      extraDistractors: ['Did', 'write'],
    },
  ],

  // 2. READ
  read: [
    {
      tenseKey: 'present_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I read the newspaper every morning.',
      hindiPrompt: 'मैं रोज़ सुबह अख़बार पढ़ता हूँ।',
      structureFormula: 'Subject (I) + V1 (read) + Object + every morning',
      explanationHi: 'दैनिक आदत के लिए Present Simple (read) आता है।',
      situationContextHi: 'सुबह की आदत',
    },
    {
      tenseKey: 'present_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She does not read books in the dark.',
      hindiPrompt: 'वह अंधेरे में किताबें नहीं पढ़ती है।',
      structureFormula: 'Subject (She) + does not + V1 (read) + Object',
      explanationHi: 'She के साथ नकारात्मक में does not + base verb लगता है।',
      situationContextHi: 'पढ़ने की अच्छी आदत',
    },
    {
      tenseKey: 'present_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Do you read English articles to improve your vocabulary?',
      hindiPrompt: 'क्या आप अपनी शब्दावली सुधारने के लिए अंग्रेज़ी लेख पढ़ते हैं?',
      structureFormula: 'Do + you + V1 (read) + Object + Infinitive',
      explanationHi: 'आदत पूछने के लिए Do you read आता है।',
      situationContextHi: 'भाषा सीखने का अभ्यास',
    },
    {
      tenseKey: 'past_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I read an interesting story yesterday.',
      hindiPrompt: 'मैंने कल एक दिलचस्प कहानी पढ़ी।',
      structureFormula: 'Subject (I) + V2 (read [उच्चारण रेड]) + Object + yesterday',
      explanationHi: 'Past form spelling वही "read" रहती है लेकिन उच्चारण "रेड" होता है।',
      situationContextHi: 'कल पढ़ी गई कहानी',
    },
    {
      tenseKey: 'past_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'We did not read that message yesterday.',
      hindiPrompt: 'हमने कल वह संदेश नहीं पढ़ा।',
      structureFormula: 'Subject (We) + did not + V1 (read) + Object',
      explanationHi: 'did not के साथ हमेशा V1 आता है।',
      situationContextHi: 'छूटा हुआ संदेश',
    },
    {
      tenseKey: 'past_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Did you read the instructions carefully before starting?',
      hindiPrompt: 'क्या आपने शुरू करने से पहले निर्देशों को ध्यान से पढ़ा?',
      structureFormula: 'Did + you + V1 (read) + Object + Adverb',
      explanationHi: 'भूतकाल के सवाल में Did + V1 आता है।',
      situationContextHi: 'निर्देशों की जाँच',
    },
    {
      tenseKey: 'future_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I will read this chapter tonight.',
      hindiPrompt: 'मैं आज रात यह पाठ पढूंगा।',
      structureFormula: 'Subject (I) + will + V1 (read) + tonight',
      explanationHi: 'भविष्य के लिए will + V1 लगता है।',
      situationContextHi: 'रात की पढ़ाई',
    },
    {
      tenseKey: 'future_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He will not read the confidential document.',
      hindiPrompt: 'वह गोपनीय दस्तावेज़ नहीं पढ़ेगा।',
      structureFormula: 'Subject (He) + will not + V1 (read) + Object',
      explanationHi: 'भविष्य के नकारात्मक में will not + V1 आता है।',
      situationContextHi: 'गोपनीयता',
    },
    {
      tenseKey: 'future_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Will you read the agreement before signing it?',
      hindiPrompt: 'क्या आप हस्ताक्षर करने से पहले समझौते को पढ़ेंगे?',
      structureFormula: 'Will + you + V1 (read) + Object + before ...',
      explanationHi: 'भविष्य की सावधानी के लिए Will you read...',
      situationContextHi: 'दस्तावेज़ हस्ताक्षर',
    },
    {
      tenseKey: 'present_continuous',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I am reading a good book right now.',
      hindiPrompt: 'मैं अभी एक अच्छी किताब पढ़ रहा हूँ।',
      structureFormula: 'Subject (I) + am + V-ing (reading) + Object',
      explanationHi: 'वर्तमान में जारी काम के लिए am reading लगता है।',
      situationContextHi: 'किताब पढ़ना',
    },
    {
      tenseKey: 'present_continuous',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She is not reading messages during the meeting.',
      hindiPrompt: 'वह बैठक के दौरान संदेश नहीं पढ़ रही है।',
      structureFormula: 'Subject (She) + is not + V-ing (reading)',
      explanationHi: 'बैठक की मर्यादा',
      situationContextHi: 'कार्यालय शिष्टाचार',
    },
    {
      tenseKey: 'present_continuous',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Why are you reading that document so quickly?',
      hindiPrompt: 'आप उस दस्तावेज़ को इतनी जल्दी क्यों पढ़ रहे हैं?',
      structureFormula: 'Why + are + you + V-ing (reading) + Object + Adverb?',
      explanationHi: 'Why + are you reading का उपयोग होता है।',
      situationContextHi: 'जल्दबाज़ी में पढ़ना',
    },
    {
      tenseKey: 'present_perfect',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I have read this book twice.',
      hindiPrompt: 'मैंने यह किताब दो बार पढ़ ली है।',
      structureFormula: 'Subject (I) + have + V3 (read [रेड]) + twice',
      explanationHi: 'अनुभव बताने के लिए have + V3 आता है।',
      situationContextHi: 'किताब का अनुभव',
    },
    {
      tenseKey: 'present_perfect',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'They have not read the latest guidelines yet.',
      hindiPrompt: 'उन्होंने अभी तक नवीनतम दिशा-निर्देश नहीं पढ़े हैं।',
      structureFormula: 'Subject (They) + have not + V3 (read) + yet',
      explanationHi: 'They के साथ have not + V3 लगता है।',
      situationContextHi: 'दिशानिर्देश की जानकारी',
    },
    {
      tenseKey: 'present_perfect',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Have you read the email from our team manager?',
      hindiPrompt: 'क्या आपने हमारी टीम के प्रबंधक का ईमेल पढ़ लिया है?',
      structureFormula: 'Have + you + V3 (read) + Object + ?',
      explanationHi: 'Present Perfect सवाल Have you read से बनता है।',
      situationContextHi: 'टीम संचार',
    },
  ],

  // 3. SPEAK
  speak: [
    {
      tenseKey: 'present_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I speak Hindi and English fluently.',
      hindiPrompt: 'मैं धाराप्रवाह हिंदी और अंग्रेज़ी बोलता हूँ।',
      structureFormula: 'Subject (I) + V1 (speak) + Languages + Adverb',
      explanationHi: 'क्षमता और आदत के लिए Present Simple आता है।',
      situationContextHi: 'भाषा ज्ञान',
    },
    {
      tenseKey: 'present_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He does not speak loudly in the library.',
      hindiPrompt: 'वह पुस्तकालय में ज़ोर से नहीं बोलता है।',
      structureFormula: 'Subject (He) + does not + V1 (speak) + Adverb',
      explanationHi: 'does not speak का प्रयोग होता है।',
      situationContextHi: 'पुस्तकालय शिष्टाचार',
    },
    {
      tenseKey: 'present_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Do you speak English with your friends every day?',
      hindiPrompt: 'क्या आप रोज़ अपने दोस्तों के साथ अंग्रेज़ी बोलते हैं?',
      structureFormula: 'Do + you + V1 (speak) + Object + daily?',
      explanationHi: 'दैनिक बातचीत का अभ्यास पूछने के लिए।',
      situationContextHi: 'अभ्यास की आदत',
    },
    {
      tenseKey: 'past_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'She spoke very clearly on the phone yesterday.',
      hindiPrompt: 'उसने कल फोन पर बहुत स्पष्ट रूप से बात की।',
      structureFormula: 'Subject (She) + V2 (spoke) + Adverb + yesterday',
      explanationHi: 'Past Simple में speak की V2 spoke होती है।',
      situationContextHi: 'फोन पर बातचीत',
    },
    {
      tenseKey: 'past_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'I did not speak to anyone about this secret.',
      hindiPrompt: 'मैंने इस रहस्य के बारे में किसी से बात नहीं की।',
      structureFormula: 'Subject (I) + did not + V1 (speak) + to anyone',
      explanationHi: 'did not के साथ base form speak आती है।',
      situationContextHi: 'रहस्य की सुरक्षा',
    },
    {
      tenseKey: 'past_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Did you speak to the doctor about your health yesterday?',
      hindiPrompt: 'क्या आपने कल डॉक्टर से अपने स्वास्थ्य के बारे में बात की?',
      structureFormula: 'Did + you + V1 (speak) + to doctor + ?',
      explanationHi: 'Did + you + speak का प्रयोग होता है।',
      situationContextHi: 'डॉक्टर से परामर्श',
    },
    {
      tenseKey: 'future_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I will speak at the conference tomorrow.',
      hindiPrompt: 'मैं कल सम्मेलन में बोलूँगा।',
      structureFormula: 'Subject (I) + will + V1 (speak) + tomorrow',
      explanationHi: 'भविष्य के लिए will speak आता है।',
      situationContextHi: 'सम्मेलन प्रस्तुति',
    },
    {
      tenseKey: 'future_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'We will not speak without thinking carefully.',
      hindiPrompt: 'हम बिना सोचे-समझे नहीं बोलेंगे।',
      structureFormula: 'Subject (We) + will not + V1 (speak)',
      explanationHi: 'will not speak का प्रयोग होता है।',
      situationContextHi: 'सावधानी का संकल्प',
    },
    {
      tenseKey: 'future_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Will you speak to your manager about this leave request?',
      hindiPrompt: 'क्या आप इस छुट्टी के अनुरोध के बारे में अपने मैनेजर से बात करेंगे?',
      structureFormula: 'Will + you + V1 (speak) + to manager + ?',
      explanationHi: 'Will you speak... का प्रयोग होता है।',
      situationContextHi: 'कार्यालय की छुट्टी',
    },
    {
      tenseKey: 'present_continuous',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'The teacher is speaking to the students now.',
      hindiPrompt: 'शिक्षक अभी छात्रों से बात कर रहे हैं।',
      structureFormula: 'Subject + is + V-ing (speaking) + now',
      explanationHi: 'is speaking वर्तमान में जारी बातचीत है।',
      situationContextHi: 'कक्षा सत्र',
    },
    {
      tenseKey: 'present_continuous',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'I am not speaking against your proposal.',
      hindiPrompt: 'मैं आपके प्रस्ताव के ख़िलाफ़ नहीं बोल रहा हूँ।',
      structureFormula: 'Subject (I) + am not + V-ing (speaking)',
      explanationHi: 'am not speaking का प्रयोग होता है।',
      situationContextHi: 'सहमति और स्पष्टीकरण',
    },
    {
      tenseKey: 'present_continuous',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Who are you speaking with on the phone right now?',
      hindiPrompt: 'आप अभी फोन पर किससे बात कर रहे हैं?',
      structureFormula: 'Who + are + you + speaking + with + ?',
      explanationHi: 'Who are you speaking with का प्रयोग होता है।',
      situationContextHi: 'फोन कॉल की जानकारी',
    },
    {
      tenseKey: 'present_perfect',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I have spoken with the principal today.',
      hindiPrompt: 'मैंने आज प्रधानाचार्य से बात कर ली है।',
      structureFormula: 'Subject (I) + have + V3 (spoken) + today',
      explanationHi: 'speak की V3 spoken होती है।',
      situationContextHi: 'स्कूल कार्य',
    },
    {
      tenseKey: 'present_perfect',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She has not spoken to her brother since yesterday.',
      hindiPrompt: 'उसने कल से अपने भाई से बात नहीं की है।',
      structureFormula: 'Subject (She) + has not + V3 (spoken)',
      explanationHi: 'has not spoken का प्रयोग होता है।',
      situationContextHi: 'पारिवारिक बातचीत',
    },
    {
      tenseKey: 'present_perfect',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Have you spoken to our support team about this issue?',
      hindiPrompt: 'क्या आपने इस समस्या के बारे में हमारी सहायता टीम से बात की है?',
      structureFormula: 'Have + you + V3 (spoken) + to team + ?',
      explanationHi: 'Have you spoken... का प्रयोग होता है।',
      situationContextHi: 'तकनीकी सहायता',
    },
  ],

  // 4. LEARN
  learn: [
    {
      tenseKey: 'present_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I learn five new English words daily.',
      hindiPrompt: 'मैं रोज़ाना पाँच नए अंग्रेज़ी शब्द सीखता हूँ।',
      structureFormula: 'Subject (I) + V1 (learn) + Object + daily',
      explanationHi: 'नियमित अध्ययन के लिए Present Simple (learn) आता है।',
      situationContextHi: 'दैनिक शब्दावली अध्ययन',
    },
    {
      tenseKey: 'present_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He does not learn grammar rules without examples.',
      hindiPrompt: 'वह बिना उदाहरणों के व्याकरण के नियम नहीं सीखता है।',
      structureFormula: 'Subject (He) + does not + V1 (learn) + Object',
      explanationHi: 'does not learn का प्रयोग होता है।',
      situationContextHi: 'सीखने की सही विधि',
    },
    {
      tenseKey: 'present_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Do you learn new spoken phrases from this app?',
      hindiPrompt: 'क्या आप इस ऐप से नए बोलचाल के वाक्य सीखते हैं?',
      structureFormula: 'Do + you + V1 (learn) + Object + from app?',
      explanationHi: 'Do you learn... का प्रयोग होता है।',
      situationContextHi: 'ऐप द्वारा सीखना',
    },
    {
      tenseKey: 'past_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I learned many useful words yesterday.',
      hindiPrompt: 'मैंने कल कई उपयोगी शब्द सीखे।',
      structureFormula: 'Subject (I) + V2 (learned) + Object + yesterday',
      explanationHi: 'भूतकाल के लिए V2 learned लगता है।',
      situationContextHi: 'कल का पाठ',
    },
    {
      tenseKey: 'past_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'We did not learn French in our school.',
      hindiPrompt: 'हमने अपने स्कूल में फ्रेंच नहीं सीखी।',
      structureFormula: 'Subject (We) + did not + V1 (learn) + Object',
      explanationHi: 'did not learn का प्रयोग होता है।',
      situationContextHi: 'स्कूल की शिक्षा',
    },
    {
      tenseKey: 'past_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Did you learn computer programming during college?',
      hindiPrompt: 'क्या आपने कॉलेज के दौरान कंप्यूटर प्रोग्रामिंग सीखी?',
      structureFormula: 'Did + you + V1 (learn) + Object + ?',
      explanationHi: 'Did you learn... का प्रयोग होता है।',
      situationContextHi: 'कॉलेज का अनुभव',
    },
    {
      tenseKey: 'future_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I will learn English speaking this month.',
      hindiPrompt: 'मैं इस महीने अंग्रेज़ी बोलना सीखूँगा।',
      structureFormula: 'Subject (I) + will + V1 (learn) + Object',
      explanationHi: 'will learn का प्रयोग होता है।',
      situationContextHi: 'महीने का लक्ष्य',
    },
    {
      tenseKey: 'future_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'They will not learn anything without hard work.',
      hindiPrompt: 'वे कड़ी मेहनत के बिना कुछ नहीं सीखेंगे।',
      structureFormula: 'Subject (They) + will not + V1 (learn) + Object',
      explanationHi: 'will not learn का प्रयोग होता है।',
      situationContextHi: 'मेहनत का महत्व',
    },
    {
      tenseKey: 'future_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Will you learn full 5 tenses by next week?',
      hindiPrompt: 'क्या आप अगले सप्ताह तक पूरे 5 काल सीख लेंगे?',
      structureFormula: 'Will + you + V1 (learn) + Object + by next week?',
      explanationHi: 'भविष्य का लक्ष्य पूछने के लिए Will you learn...',
      situationContextHi: 'तय सीमा में सीखना',
    },
    {
      tenseKey: 'present_continuous',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I am learning spoken English right now.',
      hindiPrompt: 'मैं अभी बोलचाल की अंग्रेज़ी सीख रहा हूँ।',
      structureFormula: 'Subject (I) + am + V-ing (learning) + now',
      explanationHi: 'am learning वर्तमान में जारी अध्ययन है।',
      situationContextHi: 'वर्तमान अभ्यास',
    },
    {
      tenseKey: 'present_continuous',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She is not learning wrong habits here.',
      hindiPrompt: 'वह यहाँ गलत आदतें नहीं सीख रही है।',
      structureFormula: 'Subject (She) + is not + V-ing (learning)',
      explanationHi: 'is not learning का प्रयोग होता है।',
      situationContextHi: 'सकारात्मक माहौल',
    },
    {
      tenseKey: 'present_continuous',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Are you learning new conversation techniques in this course?',
      hindiPrompt: 'क्या आप इस कोर्स में बातचीत की नई तकनीकें सीख रहे हैं?',
      structureFormula: 'Are + you + learning + Object + in this course?',
      explanationHi: 'Are you learning... का प्रयोग होता है।',
      situationContextHi: 'कोर्स की उपयोगिता',
    },
    {
      tenseKey: 'present_perfect',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I have learned all regular verb forms.',
      hindiPrompt: 'मैंने क्रिया के सभी नियमित रूप सीख लिए हैं।',
      structureFormula: 'Subject (I) + have + V3 (learned) + Object',
      explanationHi: 'have learned का प्रयोग पूरा हुआ सीखने का कार्य बताता है।',
      situationContextHi: 'सफलता का स्तर',
    },
    {
      tenseKey: 'present_perfect',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He has not learned how to drive safely yet.',
      hindiPrompt: 'उसने अभी तक सुरक्षित गाड़ी चलाना नहीं सीखा है।',
      structureFormula: 'Subject (He) + has not + V3 (learned) + yet',
      explanationHi: 'has not learned का प्रयोग होता है।',
      situationContextHi: 'कौशल की कमी',
    },
    {
      tenseKey: 'present_perfect',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Have you learned how to use these five tenses correctly?',
      hindiPrompt: 'क्या आपने इन पाँचों कालों का सही उपयोग करना सीख लिया है?',
      structureFormula: 'Have + you + V3 (learned) + Object + ?',
      explanationHi: 'Have you learned... का प्रयोग होता है।',
      situationContextHi: 'व्याकरण में दक्षता',
    },
  ],

  // 5. BUY
  buy: [
    {
      tenseKey: 'present_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I buy fresh vegetables from this market.',
      hindiPrompt: 'मैं इस बाज़ार से ताज़ी सब्ज़ियाँ खरीदता हूँ।',
      structureFormula: 'Subject (I) + V1 (buy) + Object + from market',
      explanationHi: 'नियमित आदत के लिए Present Simple (buy) आता है।',
      situationContextHi: 'दैनिक बाज़ार खरीदारी',
    },
    {
      tenseKey: 'present_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He does not buy expensive gadgets online.',
      hindiPrompt: 'वह ऑनलाइन महंगे गैजेट्स नहीं खरीदता है।',
      structureFormula: 'Subject (He) + does not + V1 (buy) + Object',
      explanationHi: 'does not buy का प्रयोग होता है।',
      situationContextHi: 'मितव्ययी आदत',
    },
    {
      tenseKey: 'present_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Do you buy groceries from the local store weekly?',
      hindiPrompt: 'क्या आप हर हफ़्ते स्थानीय दुकान से किराना सामान खरीदते हैं?',
      structureFormula: 'Do + you + V1 (buy) + Object + weekly?',
      explanationHi: 'Do you buy... का प्रयोग होता है।',
      situationContextHi: 'हफ़्तावार खरीदारी',
    },
    {
      tenseKey: 'past_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I bought a new mobile phone yesterday.',
      hindiPrompt: 'मैंने कल एक नया मोबाइल फोन खरीदा।',
      structureFormula: 'Subject (I) + V2 (bought) + Object + yesterday',
      explanationHi: 'buy की V2 bought होती है।',
      situationContextHi: 'कल की खरीदारी',
    },
    {
      tenseKey: 'past_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'She did not buy that dress because it was costly.',
      hindiPrompt: 'उसने वह पोशाक नहीं खरीदी क्योंकि वह महंगी थी।',
      structureFormula: 'Subject (She) + did not + V1 (buy) + Object + reason',
      explanationHi: 'did not buy का प्रयोग होता है।',
      situationContextHi: 'दुकान का निर्णय',
    },
    {
      tenseKey: 'past_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Did you buy your train tickets in advance last week?',
      hindiPrompt: 'क्या आपने पिछले सप्ताह अग्रिम ट्रेन टिकट खरीदे थे?',
      structureFormula: 'Did + you + V1 (buy) + Object + in advance?',
      explanationHi: 'Did you buy... का प्रयोग होता है।',
      situationContextHi: 'यात्रा की तैयारी',
    },
    {
      tenseKey: 'future_simple',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I will buy some fruits this evening.',
      hindiPrompt: 'मैं आज शाम कुछ फल खरीदूँगा।',
      structureFormula: 'Subject (I) + will + V1 (buy) + Object + tonight',
      explanationHi: 'will buy का प्रयोग होता है।',
      situationContextHi: 'शाम की योजना',
    },
    {
      tenseKey: 'future_simple',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'We will not buy items without checking the warranty.',
      hindiPrompt: 'हम वारंटी की जाँच किए बिना सामान नहीं खरीदेंगे।',
      structureFormula: 'Subject (We) + will not + V1 (buy) + Object',
      explanationHi: 'will not buy का प्रयोग होता है।',
      situationContextHi: 'समझदारी भरी खरीदारी',
    },
    {
      tenseKey: 'future_simple',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Will you buy this laptop if they offer a discount?',
      hindiPrompt: 'अगर वे छूट देंगे तो क्या आप यह लैपटॉप खरीदेंगे?',
      structureFormula: 'Will + you + V1 (buy) + Object + conditional?',
      explanationHi: 'Will you buy... का प्रयोग होता है।',
      situationContextHi: 'छूट पर खरीदारी',
    },
    {
      tenseKey: 'present_continuous',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'He is buying milk from the dairy shop.',
      hindiPrompt: 'वह डेयरी की दुकान से दूध खरीद रहा है।',
      structureFormula: 'Subject (He) + is + V-ing (buying) + Object',
      explanationHi: 'is buying वर्तमान में जारी खरीदारी है।',
      situationContextHi: 'डेयरी की दुकान',
    },
    {
      tenseKey: 'present_continuous',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'I am not buying unwanted items right now.',
      hindiPrompt: 'मैं अभी अवांछित सामान नहीं खरीद रहा हूँ।',
      structureFormula: 'Subject (I) + am not + V-ing (buying)',
      explanationHi: 'am not buying का प्रयोग होता है।',
      situationContextHi: 'बजट नियंत्रण',
    },
    {
      tenseKey: 'present_continuous',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Are you buying medicines for your family today?',
      hindiPrompt: 'क्या आप आज अपने परिवार के लिए दवाइयाँ खरीद रहे हैं?',
      structureFormula: 'Are + you + buying + Object + today?',
      explanationHi: 'Are you buying... का प्रयोग होता है।',
      situationContextHi: 'परिवार की देखभाल',
    },
    {
      tenseKey: 'present_perfect',
      level: 'beginner',
      formType: 'positive',
      expectedSentence: 'I have bought all the required books.',
      hindiPrompt: 'मैंने सभी आवश्यक किताबें खरीद ली हैं।',
      structureFormula: 'Subject (I) + have + V3 (bought) + Object',
      explanationHi: 'buy की V3 bought होती है।',
      situationContextHi: 'किताबों की खरीदारी पूरी होना',
    },
    {
      tenseKey: 'present_perfect',
      level: 'practice',
      formType: 'negative',
      expectedSentence: 'He has not bought a replacement battery yet.',
      hindiPrompt: 'उसने अभी तक बदलने वाली बैटरी नहीं खरीदी है।',
      structureFormula: 'Subject (He) + has not + V3 (bought) + yet',
      explanationHi: 'has not bought का प्रयोग होता है।',
      situationContextHi: 'अधूरी खरीदारी',
    },
    {
      tenseKey: 'present_perfect',
      level: 'challenge',
      formType: 'question',
      expectedSentence: 'Have you bought enough supplies for this winter?',
      hindiPrompt: 'क्या आपने इस सर्दी के लिए पर्याप्त सामान खरीद लिया है?',
      structureFormula: 'Have + you + V3 (bought) + Object + ?',
      explanationHi: 'Have you bought... का प्रयोग होता है।',
      situationContextHi: 'सर्दियों की तैयारी',
    },
  ],
};

/**
 * Clean natural Hindi meaning extraction for verbs
 * E.g. 'लिखना', 'काम करना', 'दौड़ना'
 */
function cleanHindiVerbRoot(rawMeaning: string): string {
  const parts = rawMeaning.split(/\s*[/,;]\s*|\s+या\s+/);
  return parts[0].trim() || rawMeaning.trim();
}

/**
 * Universal algorithmic generator for ANY verb from the 659 saved vocabulary.
 * Produces 15 distinct, grammatically accurate sentences (3 forms per tense, across levels)
 * with natural Hindi translations using the correct verb inflection.
 */
export function generateTenseExercisesForVerb(
  verbWord: VocabularyWord,
  targetTenseKey?: TenseKey
): TenseExercise[] {
  const v = verbWord.word.toLowerCase().trim();
  const rawMeaning = verbWord.hindiMeaning || '';
  const rootMeaning = cleanHindiVerbRoot(rawMeaning);
  const forms = getVerbForms(v, rootMeaning);

  // 1. If we have handcrafted curated sentences for this verb, return them!
  if (VERB_SPECIAL_EXERCISES[v]) {
    const curated = VERB_SPECIAL_EXERCISES[v];
    const filtered = targetTenseKey ? curated.filter((c) => c.tenseKey === targetTenseKey) : curated;

    return filtered.map((c, idx) => ({
      id: `custom-verb-${v}-${c.tenseKey}-${c.level}-${c.formType}-${idx + 1}`,
      tenseKey: c.tenseKey,
      level: c.level,
      formType: c.formType,
      expectedSentence: c.expectedSentence,
      hindiPrompt: c.hindiPrompt,
      acceptedAlternatives: [
        c.expectedSentence,
        c.expectedSentence.replace('.', '').replace('?', '').trim(),
      ],
      chips: createChipsForSentence(c.expectedSentence, c.extraDistractors || []),
      structureFormula: c.structureFormula,
      explanationHi: c.explanationHi,
      situationContextHi: c.situationContextHi,
      vocabularyFocus: [verbWord.word],
    }));
  }

  // 2. High-quality algorithmic generation tailored for English & Hindi verbs
  // Hindi verb stem (e.g. 'पसंद करना' -> 'पसंद कर', 'दौड़ना' -> 'दौड़', 'धोना' -> 'धो')
  let hindiStem = rootMeaning;
  if (hindiStem.endsWith('ना')) {
    hindiStem = hindiStem.slice(0, -1);
  }

  const exercises: TenseExercise[] = [];

  // Helper to push exercise
  const addEx = (
    tenseKey: TenseKey,
    level: TenseLevel,
    formType: FormType,
    expectedSentence: string,
    hindiPrompt: string,
    structureFormula: string,
    explanationHi: string,
    situationContextHi: string,
    extraDistractors: string[] = []
  ) => {
    if (targetTenseKey && tenseKey !== targetTenseKey) return;
    exercises.push({
      id: `algo-verb-${v}-${tenseKey}-${level}-${formType}`,
      tenseKey,
      level,
      formType,
      expectedSentence,
      hindiPrompt,
      acceptedAlternatives: [
        expectedSentence,
        expectedSentence.replace(/[.?!]/g, '').trim(),
      ],
      chips: createChipsForSentence(expectedSentence, extraDistractors),
      structureFormula,
      explanationHi,
      situationContextHi,
      vocabularyFocus: [verbWord.word],
    });
  };

  // ---------------- Present Simple ----------------
  // Positive (Beginner)
  addEx(
    'present_simple',
    'beginner',
    'positive',
    `I ${forms.base} every day.`,
    `मैं रोज़ ${hindiStem}ता हूँ।`,
    `Subject (I) + V1 (${forms.base}) + every day`,
    `दैनिक आदत के लिए Present Simple (V1 ${forms.base}) का प्रयोग होता है।`,
    'दैनिक आदत और दिनचर्या',
    [forms.past, forms.presentParticiple]
  );
  // Negative (Practice)
  addEx(
    'present_simple',
    'practice',
    'negative',
    `He does not ${forms.base} here.`,
    `वह यहाँ ${hindiStem}ता नहीं है।`,
    `Subject (He) + does not + V1 (${forms.base}) + here`,
    `He/She के साथ नकारात्मक वाक्य में does not + base verb (${forms.base}) आती है।`,
    'नकारात्मक आदत या स्थिति',
    [forms.thirdPerson, 'did not']
  );
  // Question (Challenge)
  addEx(
    'present_simple',
    'challenge',
    'question',
    `Do you ${forms.base} with your team members?`,
    `क्या आप अपनी टीम के सदस्यों के साथ ${rootMeaning} करते हैं?`,
    `Do + Subject (you) + V1 (${forms.base}) + with team?`,
    `वर्तमान में सवाल पूछने के लिए Do + you + V1 (${forms.base}) का उपयोग किया जाता है।`,
    'टीम सहयोग और आदत',
    ['Does', forms.presentParticiple]
  );

  // ---------------- Past Simple ----------------
  // Positive (Beginner)
  addEx(
    'past_simple',
    'beginner',
    'positive',
    `We ${forms.past} together yesterday.`,
    `हमने कल एक साथ ${rootMeaning} किया।`,
    `Subject (We) + V2 (${forms.past}) + together + yesterday`,
    `बीते हुए कल के कार्य के लिए Past Simple में verb का दूसरा रूप (V2 ${forms.past}) लगता है।`,
    'कल का पूरा हुआ काम',
    [forms.base, forms.pastParticiple]
  );
  // Negative (Practice)
  addEx(
    'past_simple',
    'practice',
    'negative',
    `I did not ${forms.base} that message.`,
    `मैंने वह संदेश ${hindiStem} नहीं किया।`,
    `Subject (I) + did not + V1 (${forms.base}) + Object`,
    `Past Simple के नकारात्मक वाक्य में did not के बाद हमेशा क्रिया का पहला रूप (V1 ${forms.base}) आता है।`,
    'बीती हुई स्थिति का निषेध',
    [forms.past, 'does not']
  );
  // Question (Challenge)
  addEx(
    'past_simple',
    'challenge',
    'question',
    `Did you ${forms.base} this properly yesterday?`,
    `क्या आपने कल इसे ठीक से ${rootMeaning} किया?`,
    `Did + Subject (you) + V1 (${forms.base}) + properly?`,
    `भूतकाल के प्रश्न में Did + Subject + V1 (${forms.base}) का प्रयोग होता है।`,
    'भूतकाल की क्रिया की पुष्टि',
    ['Do', forms.past]
  );

  // ---------------- Future Simple ----------------
  // Positive (Beginner)
  addEx(
    'future_simple',
    'beginner',
    'positive',
    `I will ${forms.base} tomorrow morning.`,
    `मैं कल सुबह ${hindiStem}ऊँगा।`,
    `Subject (I) + will + V1 (${forms.base}) + tomorrow morning`,
    `भविष्य के कार्य को व्यक्त करने के लिए will + V1 (${forms.base}) का प्रयोग किया जाता है।`,
    'कल की योजना',
    [forms.past, forms.presentParticiple]
  );
  // Negative (Practice)
  addEx(
    'future_simple',
    'practice',
    'negative',
    `They will not ${forms.base} without your permission.`,
    `वे आपकी अनुमति के बिना ${rootMeaning} नहीं करेंगे।`,
    `Subject (They) + will not + V1 (${forms.base}) + without permission`,
    `भविष्य के नकारात्मक वाक्य में will not + V1 (${forms.base}) का उपयोग होता है।`,
    'भविष्य का नियम',
    ['do not', forms.past]
  );
  // Question (Challenge)
  addEx(
    'future_simple',
    'challenge',
    'question',
    `Will you ${forms.base} this project with us next week?`,
    `क्या आप अगले सप्ताह हमारे साथ इस प्रोजेक्ट पर ${rootMeaning} करेंगे?`,
    `Will + Subject (you) + V1 (${forms.base}) + with us next week?`,
    `भविष्य की योजना पूछने के लिए Will + you + V1 (${forms.base}) आता है।`,
    'आने वाले सप्ताह की योजना',
    ['Did', forms.pastParticiple]
  );

  // ---------------- Present Continuous ----------------
  // Positive (Beginner)
  addEx(
    'present_continuous',
    'beginner',
    'positive',
    `I am ${forms.presentParticiple} right now.`,
    `मैं अभी ${hindiStem} रहा हूँ।`,
    `Subject (I) + am + V-ing (${forms.presentParticiple}) + right now`,
    `वर्तमान में जारी क्रिया के लिए am/is/are + V-ing (${forms.presentParticiple}) का प्रयोग होता है।`,
    'इस समय चल रहा काम',
    [forms.base, forms.past]
  );
  // Negative (Practice)
  addEx(
    'present_continuous',
    'practice',
    'negative',
    `She is not ${forms.presentParticiple} at this moment.`,
    `वह इस समय ${hindiStem} नहीं रही है।`,
    `Subject (She) + is not + V-ing (${forms.presentParticiple})`,
    `She के साथ वर्तमान में न होने वाले कार्य के लिए is not + V-ing (${forms.presentParticiple}) लगता है।`,
    'वर्तमान समय का निषेध',
    ['does not', forms.base]
  );
  // Question (Challenge)
  addEx(
    'present_continuous',
    'challenge',
    'question',
    `Why are you ${forms.presentParticiple} so loudly right now?`,
    `आप अभी इतनी ज़ोर से ऐसा क्यों ${rootMeaning} कर रहे हैं?`,
    `Why + are + Subject (you) + V-ing (${forms.presentParticiple}) + now?`,
    `चल रही क्रिया पर प्रश्न पूछने के लिए Why are you + V-ing आता है।`,
    'वर्तमान गतिविधि का कारण',
    ['Do', forms.base]
  );

  // ---------------- Present Perfect ----------------
  // Positive (Beginner)
  addEx(
    'present_perfect',
    'beginner',
    'positive',
    `I have ${forms.pastParticiple} this already.`,
    `मैंने यह पहले ही ${rootMeaning} कर लिया है।`,
    `Subject (I) + have + V3 (${forms.pastParticiple}) + already`,
    `हाल ही में पूरे हुए काम के लिए have + V3 (${forms.pastParticiple}) का प्रयोग होता है।`,
    'कार्य की पूर्णता',
    [forms.base, forms.presentParticiple]
  );
  // Negative (Practice)
  addEx(
    'present_perfect',
    'practice',
    'negative',
    `He has not ${forms.pastParticiple} his task yet.`,
    `उसने अभी तक अपना कार्य ${rootMeaning} नहीं किया है।`,
    `Subject (He) + has not + V3 (${forms.pastParticiple}) + yet`,
    `He के साथ Present Perfect में has not + V3 (${forms.pastParticiple}) का उपयोग होता है।`,
    'अधूरा कार्य',
    ['did not', forms.base]
  );
  // Question (Challenge)
  addEx(
    'present_perfect',
    'challenge',
    'question',
    `Have you ${forms.pastParticiple} everything for today?`,
    `क्या आपने आज के लिए सब कुछ ${rootMeaning} कर लिया है?`,
    `Have + Subject (you) + V3 (${forms.pastParticiple}) + everything?`,
    `Present Perfect सवाल Have + you + V3 (${forms.pastParticiple}) से बनता है।`,
    'दिन के काम की जाँच',
    ['Did', forms.base]
  );

  return exercises;
}
