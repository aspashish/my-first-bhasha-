/**
 * Comprehensive 5 Tenses Practice Sentence Bank for BhashaGuru
 * 
 * 300+ Distinct, natural, beginner-friendly English sentences with Hindi meanings:
 * - 60 exercises for Present Simple (20 Beginner, 20 Practice, 20 Challenge)
 * - 60 exercises for Past Simple (20 Beginner, 20 Practice, 20 Challenge)
 * - 60 exercises for Future Simple (20 Beginner, 20 Practice, 20 Challenge)
 * - 60 exercises for Present Continuous (20 Beginner, 20 Practice, 20 Challenge)
 * - 60 exercises for Present Perfect (20 Beginner, 20 Practice, 20 Challenge)
 * 
 * Covering positive (+), negative (-), and question (?) forms across diverse everyday situations.
 */

export type TenseKey =
  | 'present_simple'
  | 'past_simple'
  | 'future_simple'
  | 'present_continuous'
  | 'present_perfect';

export type FormType = 'positive' | 'negative' | 'question';
export type TenseLevel = 'beginner' | 'practice' | 'challenge';

export interface TenseExercise {
  id: string;
  tenseKey: TenseKey;
  level: TenseLevel;
  formType: FormType;
  hindiPrompt: string;
  expectedSentence: string;
  acceptedAlternatives: string[];
  chips: string[];
  structureFormula: string;
  explanationHi: string;
  vocabularyFocus?: string[];
  situationContextHi: string;
}

export interface TenseDefinition {
  key: TenseKey;
  englishTitle: string;
  hindiTitle: string;
  shortTag: string;
  colorScheme: {
    badge: string;
    border: string;
    bg: string;
    activeTab: string;
    text: string;
    ring: string;
  };
  identificationHi: string;
  whenToUseHi: string;
  coreExampleEn: string;
  coreExampleHi: string;
  structure: {
    positive: string;
    negative: string;
    question: string;
  };
  exercises: TenseExercise[];
}

export const TENSES_DATA: Record<TenseKey, TenseDefinition> = {
  "present_simple": {
    "key": "present_simple",
    "englishTitle": "Present Simple",
    "hindiTitle": "सामान्य वर्तमान काल",
    "shortTag": "1. Present Simple",
    "colorScheme": {
      "badge": "bg-emerald-950 text-emerald-300 border-emerald-800",
      "border": "border-emerald-600/40",
      "bg": "bg-emerald-950/20",
      "activeTab": "bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-950/50",
      "text": "text-emerald-400",
      "ring": "ring-emerald-500"
    },
    "identificationHi": "वाक्य के अंत में \"ता हूँ, ती हूँ, ते हैं, ता है\" आता है।",
    "whenToUseHi": "रोज़मर्रा की आदतें (habits), दिनचर्या (routine) या सार्वभौमिक सत्य (facts) बताने के लिए।",
    "coreExampleEn": "I play cricket.",
    "coreExampleHi": "मैं क्रिकेट खेलता/खेलती हूँ।",
    "structure": {
      "positive": "Subject + Verb (1st form) + Object  (He/She/It के साथ Verb + s/es)",
      "negative": "Subject + do not / does not + Verb (1st form) + Object",
      "question": "Do / Does + Subject + Verb (1st form) + Object?"
    },
    "exercises": [
      {
        "id": "ps-beg-1",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं क्रिकेट खेलता हूँ।",
        "expectedSentence": "I play cricket.",
        "acceptedAlternatives": [
          "I play cricket",
          "I play the cricket."
        ],
        "chips": [
          "cricket",
          "play",
          "I"
        ],
        "structureFormula": "I + play + cricket",
        "explanationHi": "Present Simple में \"I\" के साथ क्रिया का पहला रूप (V1: play) आता है।",
        "vocabularyFocus": [
          "play",
          "cricket"
        ],
        "situationContextHi": "दैनिक खेल और आदत"
      },
      {
        "id": "ps-beg-2",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हम पानी पीते हैं।",
        "expectedSentence": "We drink water.",
        "acceptedAlternatives": [
          "We drink water"
        ],
        "chips": [
          "water",
          "drink",
          "We"
        ],
        "structureFormula": "We + drink + water",
        "explanationHi": "यहाँ \"We\" बहुवचन है, इसलिए क्रिया का मूल रूप \"drink\" आता है।",
        "vocabularyFocus": [
          "we",
          "drink",
          "water"
        ],
        "situationContextHi": "दैनिक आवश्यकता"
      },
      {
        "id": "ps-beg-3",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह किताबें पढ़ती है।",
        "expectedSentence": "She reads books.",
        "acceptedAlternatives": [
          "She reads books"
        ],
        "chips": [
          "books",
          "reads",
          "She"
        ],
        "structureFormula": "She + reads (verb+s) + books",
        "explanationHi": "She/He/It के साथ Verb में \"s/es\" जुड़ता है: read → reads।",
        "vocabularyFocus": [
          "she",
          "read",
          "book"
        ],
        "situationContextHi": "पढ़ने की अच्छी आदत"
      },
      {
        "id": "ps-beg-4",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह तेज़ चलता है।",
        "expectedSentence": "He walks fast.",
        "acceptedAlternatives": [
          "He walks fast"
        ],
        "chips": [
          "fast",
          "walks",
          "He"
        ],
        "structureFormula": "He + walks + fast",
        "explanationHi": "He के साथ \"walks\" आता है।",
        "vocabularyFocus": [
          "he",
          "walk",
          "fast"
        ],
        "situationContextHi": "चलने का तरीका"
      },
      {
        "id": "ps-beg-5",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे यहाँ रहते हैं।",
        "expectedSentence": "They live here.",
        "acceptedAlternatives": [
          "They live here"
        ],
        "chips": [
          "here",
          "live",
          "They"
        ],
        "structureFormula": "They + live + here",
        "explanationHi": "They बहुवचन है, इसलिए मूल क्रिया \"live\" आती है।",
        "vocabularyFocus": [
          "they",
          "live",
          "here"
        ],
        "situationContextHi": "निवास स्थान"
      },
      {
        "id": "ps-beg-6",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मुझे चाय पसंद है।",
        "expectedSentence": "I like tea.",
        "acceptedAlternatives": [
          "I like tea"
        ],
        "chips": [
          "tea",
          "like",
          "I"
        ],
        "structureFormula": "I + like + tea",
        "explanationHi": "पसंद बताने के लिए \"I like...\" का प्रयोग होता है।",
        "vocabularyFocus": [
          "like",
          "tea"
        ],
        "situationContextHi": "पसंद-नापसंद"
      },
      {
        "id": "ps-beg-7",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "सूरज उगता है।",
        "expectedSentence": "The sun rises.",
        "acceptedAlternatives": [
          "The sun rises"
        ],
        "chips": [
          "rises",
          "The sun"
        ],
        "structureFormula": "The sun + rises",
        "explanationHi": "शाश्वत सत्य (Universal Truth) में Present Simple आता है: rise → rises।",
        "vocabularyFocus": [
          "sun",
          "rise"
        ],
        "situationContextHi": "प्राकृतिक सत्य"
      },
      {
        "id": "ps-beg-8",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "मैं नहीं दौड़ता हूँ।",
        "expectedSentence": "I do not run.",
        "acceptedAlternatives": [
          "I don't run.",
          "I do not run",
          "I don't run"
        ],
        "chips": [
          "run",
          "do not",
          "I"
        ],
        "structureFormula": "I + do not + run",
        "explanationHi": "I के साथ नकारात्मक में \"do not\" आता है।",
        "vocabularyFocus": [
          "run",
          "not"
        ],
        "situationContextHi": "गतिविधि का अभाव"
      },
      {
        "id": "ps-beg-9",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह नहीं रोता है।",
        "expectedSentence": "He does not cry.",
        "acceptedAlternatives": [
          "He doesn't cry.",
          "He does not cry",
          "He doesn't cry"
        ],
        "chips": [
          "cry",
          "does not",
          "He"
        ],
        "structureFormula": "He + does not + cry",
        "explanationHi": "He के साथ \"does not\" आता है और verb से s हट जाता है।",
        "vocabularyFocus": [
          "he",
          "cry"
        ],
        "situationContextHi": "भावना व्यक्त करना"
      },
      {
        "id": "ps-beg-10",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम खेलते हो?",
        "expectedSentence": "Do you play?",
        "acceptedAlternatives": [
          "Do you play"
        ],
        "chips": [
          "play?",
          "you",
          "Do"
        ],
        "structureFormula": "Do + you + play?",
        "explanationHi": "You के साथ प्रश्न \"Do\" से शुरू होता है: Do + you + Verb?",
        "vocabularyFocus": [
          "you",
          "play"
        ],
        "situationContextHi": "खेल के बारे में पूछना"
      },
      {
        "id": "ps-beg-11",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वह जानता है?",
        "expectedSentence": "Does he know?",
        "acceptedAlternatives": [
          "Does he know"
        ],
        "chips": [
          "know?",
          "he",
          "Does"
        ],
        "structureFormula": "Does + he + know?",
        "explanationHi": "He के साथ प्रश्न में \"Does\" आता है: Does + he + Verb?",
        "vocabularyFocus": [
          "he",
          "know"
        ],
        "situationContextHi": "जानकारी पूछना"
      },
      {
        "id": "ps-prac-1",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हम रोज़ सुबह ताज़े फल खाते हैं।",
        "expectedSentence": "We eat fresh fruits every morning.",
        "acceptedAlternatives": [
          "We eat fresh fruits every morning",
          "Every morning we eat fresh fruits."
        ],
        "chips": [
          "every morning",
          "fresh fruits",
          "eat",
          "We"
        ],
        "structureFormula": "We + eat + fresh fruits + every morning",
        "explanationHi": "दैनिक आदत: We + eat (V1) + fresh fruits + time।",
        "vocabularyFocus": [
          "eat",
          "fresh",
          "fruit",
          "morning"
        ],
        "situationContextHi": "स्वास्थ्य और नाश्ता"
      },
      {
        "id": "ps-prac-2",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मेरी बहन स्वादिष्ट खाना बनाती है।",
        "expectedSentence": "My sister cooks tasty food.",
        "acceptedAlternatives": [
          "My sister cooks tasty food",
          "My sister cooks delicious food."
        ],
        "chips": [
          "tasty food",
          "cooks",
          "My sister"
        ],
        "structureFormula": "My sister + cooks + tasty food",
        "explanationHi": "My sister (एकवचन) के साथ क्रिया में \"s\" लगता है: cooks।",
        "vocabularyFocus": [
          "sister",
          "cook",
          "food"
        ],
        "situationContextHi": "पारिवारिक दिनचर्या"
      },
      {
        "id": "ps-prac-3",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह एक अस्पताल में काम करता है।",
        "expectedSentence": "He works in a hospital.",
        "acceptedAlternatives": [
          "He works in a hospital"
        ],
        "chips": [
          "in a hospital",
          "works",
          "He"
        ],
        "structureFormula": "He + works + in a hospital",
        "explanationHi": "He + works (Verb+s) + स्थान।",
        "vocabularyFocus": [
          "he",
          "work",
          "hospital"
        ],
        "situationContextHi": "पेशा और कार्यस्थल"
      },
      {
        "id": "ps-prac-4",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वे हिंदी और अंग्रेज़ी बोलते हैं।",
        "expectedSentence": "They speak Hindi and English.",
        "acceptedAlternatives": [
          "They speak Hindi and English"
        ],
        "chips": [
          "Hindi and English",
          "speak",
          "They"
        ],
        "structureFormula": "They + speak + Hindi and English",
        "explanationHi": "भाषा बोलने की क्षमता: They + speak + languages।",
        "vocabularyFocus": [
          "they",
          "speak",
          "English"
        ],
        "situationContextHi": "भाषा कौशल"
      },
      {
        "id": "ps-prac-5",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं छह बजे उठता हूँ।",
        "expectedSentence": "I wake up at six.",
        "acceptedAlternatives": [
          "I wake up at six",
          "I wake up at six o clock.",
          "I wake up at 6."
        ],
        "chips": [
          "at six",
          "wake up",
          "I"
        ],
        "structureFormula": "I + wake up + at six",
        "explanationHi": "समय बताने के लिए \"at\" का प्रयोग होता है: at six।",
        "vocabularyFocus": [
          "wake",
          "time"
        ],
        "situationContextHi": "सुबह की दिनचर्या"
      },
      {
        "id": "ps-prac-6",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "मैं कॉफ़ी नहीं पीता हूँ।",
        "expectedSentence": "I do not drink coffee.",
        "acceptedAlternatives": [
          "I don't drink coffee.",
          "I do not drink coffee",
          "I don't drink coffee"
        ],
        "chips": [
          "coffee",
          "drink",
          "do not",
          "I"
        ],
        "structureFormula": "I + do not + drink + coffee",
        "explanationHi": "I do not + drink (मूल क्रिया) + coffee।",
        "vocabularyFocus": [
          "drink",
          "coffee"
        ],
        "situationContextHi": "पेय पदार्थ नापसंद"
      },
      {
        "id": "ps-prac-7",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "वह टीवी नहीं देखती है।",
        "expectedSentence": "She does not watch TV.",
        "acceptedAlternatives": [
          "She doesn't watch TV.",
          "She does not watch TV",
          "She doesn't watch TV"
        ],
        "chips": [
          "TV",
          "watch",
          "does not",
          "She"
        ],
        "structureFormula": "She + does not + watch + TV",
        "explanationHi": "She के साथ \"does not\" और मूल क्रिया \"watch\" आती है।",
        "vocabularyFocus": [
          "she",
          "watch"
        ],
        "situationContextHi": "समय का उपयोग"
      },
      {
        "id": "ps-prac-8",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "हम समय बर्बाद नहीं करते हैं।",
        "expectedSentence": "We do not waste time.",
        "acceptedAlternatives": [
          "We don't waste time.",
          "We do not waste time",
          "We don't waste time"
        ],
        "chips": [
          "time",
          "waste",
          "do not",
          "We"
        ],
        "structureFormula": "We + do not + waste + time",
        "explanationHi": "We के साथ नकारात्मक में \"do not\" आता है।",
        "vocabularyFocus": [
          "waste",
          "time"
        ],
        "situationContextHi": "अच्छी आदत"
      },
      {
        "id": "ps-prac-9",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आप अंग्रेज़ी बोलते हैं?",
        "expectedSentence": "Do you speak English?",
        "acceptedAlternatives": [
          "Do you speak English"
        ],
        "chips": [
          "English?",
          "speak",
          "you",
          "Do"
        ],
        "structureFormula": "Do + you + speak + English?",
        "explanationHi": "सामान्य पूछताछ: Do you speak English?",
        "vocabularyFocus": [
          "speak",
          "English",
          "you"
        ],
        "situationContextHi": "बातचीत की शुरुआत"
      },
      {
        "id": "ps-prac-10",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वह दिल्ली में रहती है?",
        "expectedSentence": "Does she live in Delhi?",
        "acceptedAlternatives": [
          "Does she live in Delhi"
        ],
        "chips": [
          "in Delhi?",
          "live",
          "she",
          "Does"
        ],
        "structureFormula": "Does + she + live + in Delhi?",
        "explanationHi": "एकवचन कर्ता के साथ \"Does\" से सवाल शुरू होता है।",
        "vocabularyFocus": [
          "she",
          "live"
        ],
        "situationContextHi": "निवास के बारे में पूछना"
      },
      {
        "id": "ps-prac-11",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वे स्कूल जाते हैं?",
        "expectedSentence": "Do they go to school?",
        "acceptedAlternatives": [
          "Do they go to school"
        ],
        "chips": [
          "to school?",
          "go",
          "they",
          "Do"
        ],
        "structureFormula": "Do + they + go + to school?",
        "explanationHi": "They के साथ प्रश्न \"Do\" से बनता है।",
        "vocabularyFocus": [
          "they",
          "go",
          "school"
        ],
        "situationContextHi": "दैनिक स्कूल दिनचर्या"
      },
      {
        "id": "ps-chal-1",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "ट्रेन रोज़ समय पर आती है।",
        "expectedSentence": "The train arrives on time every day.",
        "acceptedAlternatives": [
          "The train arrives on time every day",
          "Every day the train arrives on time."
        ],
        "chips": [
          "every day",
          "on time",
          "arrives",
          "The train"
        ],
        "structureFormula": "The train + arrives + on time + every day",
        "explanationHi": "गाड़ियों और समय-सारणी (Timetable) के लिए Present Simple आता है।",
        "vocabularyFocus": [
          "train",
          "arrive",
          "time",
          "day"
        ],
        "situationContextHi": "स्टेशन और समय-सारणी"
      },
      {
        "id": "ps-chal-2",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह हमेशा मुसीबत में अपने दोस्तों की मदद करता है।",
        "expectedSentence": "He always helps his friends in trouble.",
        "acceptedAlternatives": [
          "He always helps his friends in trouble"
        ],
        "chips": [
          "in trouble",
          "his friends",
          "helps",
          "always",
          "He"
        ],
        "structureFormula": "He + always + helps + his friends + in trouble",
        "explanationHi": "Always का स्थान मुख्य क्रिया से पहले होता है: He always helps।",
        "vocabularyFocus": [
          "always",
          "help",
          "friend"
        ],
        "situationContextHi": "सच्ची दोस्ती"
      },
      {
        "id": "ps-chal-3",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "मेरे माता-पिता शाम को टहलने जाते हैं।",
        "expectedSentence": "My parents go for a walk in the evening.",
        "acceptedAlternatives": [
          "My parents go for a walk in the evening"
        ],
        "chips": [
          "in the evening",
          "for a walk",
          "go",
          "My parents"
        ],
        "structureFormula": "My parents + go + for a walk + in the evening",
        "explanationHi": "My parents बहुवचन है, इसलिए \"go\" आता है।",
        "vocabularyFocus": [
          "parents",
          "walk",
          "evening"
        ],
        "situationContextHi": "शाम की सेहतमंद आदत"
      },
      {
        "id": "ps-chal-4",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वह रात में मसालेदार खाना नहीं खाता है।",
        "expectedSentence": "He does not eat spicy food at night.",
        "acceptedAlternatives": [
          "He doesn't eat spicy food at night.",
          "He does not eat spicy food at night",
          "He doesn't eat spicy food at night"
        ],
        "chips": [
          "at night",
          "spicy food",
          "eat",
          "does not",
          "He"
        ],
        "structureFormula": "He + does not + eat + spicy food + at night",
        "explanationHi": "He + does not + eat (मूल क्रिया) + कर्म + समय।",
        "vocabularyFocus": [
          "he",
          "eat",
          "night"
        ],
        "situationContextHi": "रात के खानपान की आदत"
      },
      {
        "id": "ps-chal-5",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वे रविवार को दुकान नहीं खोलते हैं।",
        "expectedSentence": "They do not open the shop on Sundays.",
        "acceptedAlternatives": [
          "They don't open the shop on Sundays.",
          "They do not open the shop on Sundays",
          "They don't open the shop on Sundays"
        ],
        "chips": [
          "on Sundays",
          "the shop",
          "open",
          "do not",
          "They"
        ],
        "structureFormula": "They + do not + open + the shop + on Sundays",
        "explanationHi": "दिनों के नाम से पहले \"on\" आता है: on Sundays।",
        "vocabularyFocus": [
          "they",
          "open",
          "shop"
        ],
        "situationContextHi": "दुकान की साप्ताहिक छुट्टी"
      },
      {
        "id": "ps-chal-6",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "मेरा भाई कार नहीं चलाता है।",
        "expectedSentence": "My brother does not drive a car.",
        "acceptedAlternatives": [
          "My brother doesn't drive a car.",
          "My brother does not drive a car",
          "My brother doesn't drive a car"
        ],
        "chips": [
          "a car",
          "drive",
          "does not",
          "My brother"
        ],
        "structureFormula": "My brother + does not + drive + a car",
        "explanationHi": "My brother (एकवचन) के साथ \"does not + drive\" आता है।",
        "vocabularyFocus": [
          "brother",
          "drive",
          "car"
        ],
        "situationContextHi": "ड्राइविंग कौशल"
      },
      {
        "id": "ps-chal-7",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आप जानते हैं स्टेशन कहाँ है?",
        "expectedSentence": "Do you know where the station is?",
        "acceptedAlternatives": [
          "Do you know where the station is"
        ],
        "chips": [
          "the station is?",
          "where",
          "know",
          "you",
          "Do"
        ],
        "structureFormula": "Do you know + where + the station is?",
        "explanationHi": "विनम्र पूछताछ: Do you know + where the station is?",
        "vocabularyFocus": [
          "you",
          "know",
          "where"
        ],
        "situationContextHi": "रास्ता पूछना"
      },
      {
        "id": "ps-chal-8",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आप इतनी जल्दी क्यों उठते हैं?",
        "expectedSentence": "Why do you wake up so early?",
        "acceptedAlternatives": [
          "Why do you wake up so early"
        ],
        "chips": [
          "so early?",
          "wake up",
          "you",
          "do",
          "Why"
        ],
        "structureFormula": "Why + do + you + wake up + so early?",
        "explanationHi": "WH-Question संरचना: Why + do + Subject + Verb?",
        "vocabularyFocus": [
          "why",
          "wake",
          "early"
        ],
        "situationContextHi": "सुबह उठने का कारण पूछना"
      },
      {
        "id": "ps-chal-9",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपके पिताजी दफ्तर में काम करते हैं?",
        "expectedSentence": "Does your father work in an office?",
        "acceptedAlternatives": [
          "Does your father work in an office"
        ],
        "chips": [
          "in an office?",
          "work",
          "your father",
          "Does"
        ],
        "structureFormula": "Does + your father + work + in an office?",
        "explanationHi": "Your father एकवचन है, इसलिए प्रश्न \"Does\" से शुरू होता है।",
        "vocabularyFocus": [
          "father",
          "work",
          "office"
        ],
        "situationContextHi": "पारिवारिक काम के बारे में पूछना"
      },
      {
        "id": "ps-chal-10",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आप अपनी किराने का सामान कहाँ से खरीदते हैं?",
        "expectedSentence": "Where do you buy your groceries?",
        "acceptedAlternatives": [
          "Where do you buy your groceries"
        ],
        "chips": [
          "your groceries?",
          "buy",
          "you",
          "do",
          "Where"
        ],
        "structureFormula": "Where + do + you + buy + your groceries?",
        "explanationHi": "Where (कहाँ) + do + you + buy + object?",
        "vocabularyFocus": [
          "where",
          "buy",
          "you"
        ],
        "situationContextHi": "किराने की खरीदारी"
      },
      {
        "id": "ps-beg-12",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "बिल्लियाँ दूध पीती हैं।",
        "expectedSentence": "Cats drink milk.",
        "acceptedAlternatives": [
          "Cats drink milk",
          "The cats drink milk."
        ],
        "chips": [
          "drink",
          "milk",
          "Cats",
          "drinks"
        ],
        "structureFormula": "Subject (Plural) + Verb (V1) + Object",
        "situationContextHi": "जानवरों की सामान्य आदत",
        "explanationHi": "Plural subject (Cats) के साथ क्रिया का मूल रूप (V1: drink) आता है।",
        "vocabularyFocus": [
          "drink",
          "milk",
          "cat"
        ]
      },
      {
        "id": "ps-beg-13",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "तारे रात में चमकते हैं।",
        "expectedSentence": "Stars shine at night.",
        "acceptedAlternatives": [
          "Stars shine at night",
          "The stars shine at night."
        ],
        "chips": [
          "at",
          "shine",
          "night",
          "Stars",
          "shines"
        ],
        "structureFormula": "Subject + V1 + Time phrase",
        "situationContextHi": "प्राकृतिक सत्य",
        "explanationHi": "Stars बहुवचन है इसलिए V1 \"shine\" आएगा।",
        "vocabularyFocus": [
          "shine",
          "night",
          "star"
        ]
      },
      {
        "id": "ps-beg-14",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं संगीत सुनता हूँ।",
        "expectedSentence": "I listen to music.",
        "acceptedAlternatives": [
          "I listen to music"
        ],
        "chips": [
          "to",
          "music",
          "listen",
          "I",
          "listens"
        ],
        "structureFormula": "I + listen to + Object",
        "situationContextHi": "शौक और आदत",
        "explanationHi": "I के साथ V1 \"listen\" आता है और इसके बाद \"to\" लगता है।",
        "vocabularyFocus": [
          "music",
          "listen"
        ]
      },
      {
        "id": "ps-beg-15",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम चाय पसंद करते हो?",
        "expectedSentence": "Do you like tea?",
        "acceptedAlternatives": [
          "Do you like tea",
          "Do you like tea?"
        ],
        "chips": [
          "Do",
          "tea",
          "you",
          "like",
          "Does"
        ],
        "structureFormula": "Do + Subject (you) + V1 + Object?",
        "situationContextHi": "पसंद पूछना",
        "explanationHi": "You के साथ प्रश्न बनाने के लिए \"Do\" वाक्य की शुरुआत में आता है।",
        "vocabularyFocus": [
          "tea",
          "like"
        ]
      },
      {
        "id": "ps-beg-16",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह मांस नहीं खाता है।",
        "expectedSentence": "He does not eat meat.",
        "acceptedAlternatives": [
          "He doesn't eat meat.",
          "He doesn't eat meat",
          "He does not eat meat"
        ],
        "chips": [
          "meat",
          "eat",
          "He",
          "does",
          "not",
          "do"
        ],
        "structureFormula": "He + does not + V1 + Object",
        "situationContextHi": "खान-पान की आदत",
        "explanationHi": "He के साथ नकारात्मक में \"does not\" और मूल क्रिया \"eat\" आती है।",
        "vocabularyFocus": [
          "eat",
          "meat"
        ]
      },
      {
        "id": "ps-beg-17",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह बहुत अच्छा नाचती है।",
        "expectedSentence": "She dances very well.",
        "acceptedAlternatives": [
          "She dances very well"
        ],
        "chips": [
          "dances",
          "very",
          "well",
          "She",
          "dance"
        ],
        "structureFormula": "She + V1+s + Adverb",
        "situationContextHi": "हुनर या कला",
        "explanationHi": "She एकवचन है इसलिए dance में \"s\" लगकर \"dances\" बन गया।",
        "vocabularyFocus": [
          "dance",
          "well"
        ]
      },
      {
        "id": "ps-beg-18",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हम भारत में रहते हैं।",
        "expectedSentence": "We live in India.",
        "acceptedAlternatives": [
          "We live in India"
        ],
        "chips": [
          "India",
          "in",
          "live",
          "We",
          "lives"
        ],
        "structureFormula": "We + V1 + in + Place",
        "situationContextHi": "निवास स्थान",
        "explanationHi": "We बहुवचन है इसलिए V1 \"live\" आता है।",
        "vocabularyFocus": [
          "live",
          "India"
        ]
      },
      {
        "id": "ps-beg-19",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "हम देर से नहीं सोते हैं।",
        "expectedSentence": "We do not sleep late.",
        "acceptedAlternatives": [
          "We don't sleep late.",
          "We do not sleep late"
        ],
        "chips": [
          "late",
          "sleep",
          "not",
          "We",
          "do",
          "does"
        ],
        "structureFormula": "We + do not + V1 + late",
        "situationContextHi": "सोने की दिनचर्या",
        "explanationHi": "We के साथ नकारात्मक में \"do not\" का प्रयोग होता है।",
        "vocabularyFocus": [
          "sleep",
          "late"
        ]
      },
      {
        "id": "ps-beg-20",
        "tenseKey": "present_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वे यहाँ काम करते हैं?",
        "expectedSentence": "Do they work here?",
        "acceptedAlternatives": [
          "Do they work here",
          "Do they work here?"
        ],
        "chips": [
          "Do",
          "work",
          "here",
          "they",
          "Does"
        ],
        "structureFormula": "Do + they + V1 + here?",
        "situationContextHi": "कार्यस्थल के बारे में पूछना",
        "explanationHi": "They के साथ प्रश्नवाचक वाक्य में \"Do\" आगे आता है।",
        "vocabularyFocus": [
          "work",
          "here"
        ]
      },
      {
        "id": "ps-prac-12",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "पुस्तकालय शाम छह बजे बंद होता है।",
        "expectedSentence": "The library closes at six in the evening.",
        "acceptedAlternatives": [
          "The library closes at six in the evening",
          "The library closes at 6 in the evening."
        ],
        "chips": [
          "closes",
          "at",
          "six",
          "in",
          "the",
          "evening",
          "The",
          "library"
        ],
        "structureFormula": "Singular Noun + V1+s + Time phrase",
        "situationContextHi": "समय सारणी (Timetable)",
        "explanationHi": "The library एकवचन है इसलिए close में \"s\" लगकर \"closes\" आता है।",
        "vocabularyFocus": [
          "library",
          "close",
          "evening"
        ]
      },
      {
        "id": "ps-prac-13",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "वह संदेशों का तुरंत उत्तर नहीं देता है।",
        "expectedSentence": "He does not reply to messages immediately.",
        "acceptedAlternatives": [
          "He doesn't reply to messages immediately.",
          "He does not reply to messages immediately"
        ],
        "chips": [
          "does",
          "not",
          "reply",
          "to",
          "messages",
          "immediately",
          "He",
          "replies"
        ],
        "structureFormula": "He + does not + V1 + to + Object + Adverb",
        "situationContextHi": "संचार की आदत",
        "explanationHi": "He के साथ does not आता है और reply में \"s\" या \"es\" नहीं लगता।",
        "vocabularyFocus": [
          "reply",
          "message",
          "immediately"
        ]
      },
      {
        "id": "ps-prac-14",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वे नियमित रूप से कॉलेज जाते हैं?",
        "expectedSentence": "Do they attend college regularly?",
        "acceptedAlternatives": [
          "Do they attend college regularly",
          "Do they attend college regularly?"
        ],
        "chips": [
          "Do",
          "they",
          "attend",
          "college",
          "regularly",
          "Does"
        ],
        "structureFormula": "Do + they + V1 + Object + regularly?",
        "situationContextHi": "शिक्षा और दिनचर्या",
        "explanationHi": "They के साथ प्रश्न में \"Do\" आता है और V1 \"attend\" रहता है।",
        "vocabularyFocus": [
          "attend",
          "college",
          "regularly"
        ]
      },
      {
        "id": "ps-prac-15",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मेरे पिताजी हर सुबह अखबार पढ़ते हैं।",
        "expectedSentence": "My father reads the newspaper every morning.",
        "acceptedAlternatives": [
          "My father reads the newspaper every morning"
        ],
        "chips": [
          "My",
          "father",
          "reads",
          "the",
          "newspaper",
          "every",
          "morning",
          "read"
        ],
        "structureFormula": "Subject (Singular) + V1+s + Object + Time phrase",
        "situationContextHi": "पारिवारिक दिनचर्या",
        "explanationHi": "My father एकवचन है इसलिए read में \"s\" लगकर \"reads\" आता है।",
        "vocabularyFocus": [
          "father",
          "read",
          "newspaper",
          "morning"
        ]
      },
      {
        "id": "ps-prac-16",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह पूरे परिवार के लिए स्वादिष्ट भोजन बनाती है।",
        "expectedSentence": "She cooks delicious food for the whole family.",
        "acceptedAlternatives": [
          "She cooks delicious food for the whole family"
        ],
        "chips": [
          "She",
          "cooks",
          "delicious",
          "food",
          "for",
          "the",
          "whole",
          "family"
        ],
        "structureFormula": "She + V1+s + Adjective + Object + Preposition phrase",
        "situationContextHi": "घरेलू जीवन",
        "explanationHi": "She के साथ क्रिया cook में \"s\" लगता है।",
        "vocabularyFocus": [
          "cook",
          "delicious",
          "family"
        ]
      },
      {
        "id": "ps-prac-17",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "हम देर रात तक टेलीविज़न नहीं देखते हैं।",
        "expectedSentence": "We do not watch television late at night.",
        "acceptedAlternatives": [
          "We don't watch television late at night.",
          "We do not watch television late at night"
        ],
        "chips": [
          "We",
          "do",
          "not",
          "watch",
          "television",
          "late",
          "at",
          "night",
          "watches"
        ],
        "structureFormula": "We + do not + V1 + Object + Time phrase",
        "situationContextHi": "घर की आदतें",
        "explanationHi": "We के साथ नकारात्मक वाक्य में \"do not\" का प्रयोग होता है।",
        "vocabularyFocus": [
          "watch",
          "television",
          "night"
        ]
      },
      {
        "id": "ps-prac-18",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या यह बस मेट्रो स्टेशन के पास रुकती है?",
        "expectedSentence": "Does this bus stop near the metro station?",
        "acceptedAlternatives": [
          "Does this bus stop near the metro station",
          "Does this bus stop near the metro station?"
        ],
        "chips": [
          "Does",
          "this",
          "bus",
          "stop",
          "near",
          "the",
          "metro",
          "station",
          "Do"
        ],
        "structureFormula": "Does + Singular Subject + V1 + Preposition phrase?",
        "situationContextHi": "सार्वजनिक परिवहन की पूछताछ",
        "explanationHi": "This bus एकवचन है इसलिए प्रश्न में \"Does\" आता है।",
        "vocabularyFocus": [
          "bus",
          "stop",
          "near",
          "station"
        ]
      },
      {
        "id": "ps-prac-19",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "माली हर शाम पौधों को पानी देता है।",
        "expectedSentence": "The gardener waters the plants every evening.",
        "acceptedAlternatives": [
          "The gardener waters the plants every evening"
        ],
        "chips": [
          "The",
          "gardener",
          "waters",
          "the",
          "plants",
          "every",
          "evening",
          "water"
        ],
        "structureFormula": "Subject + V1+s (verb \"to water\") + Object + Time phrase",
        "situationContextHi": "बागवानी और काम",
        "explanationHi": "Water यहाँ क्रिया के रूप में है, The gardener एकवचन है इसलिए \"waters\" आया।",
        "vocabularyFocus": [
          "water",
          "plant",
          "gardener"
        ]
      },
      {
        "id": "ps-prac-20",
        "tenseKey": "present_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं अपनी डायरी में नए अंग्रेज़ी शब्द लिखता हूँ।",
        "expectedSentence": "I write new English words in my diary.",
        "acceptedAlternatives": [
          "I write new English words in my diary"
        ],
        "chips": [
          "I",
          "write",
          "new",
          "English",
          "words",
          "in",
          "my",
          "diary",
          "writes"
        ],
        "structureFormula": "I + V1 + Adjective + Object + in my diary",
        "situationContextHi": "भाषा सीखने की आदत",
        "explanationHi": "I के साथ V1 \"write\" आता है।",
        "vocabularyFocus": [
          "write",
          "words",
          "English",
          "diary"
        ]
      },
      {
        "id": "ps-chal-11",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "कुछ छात्र सार्वजनिक रूप से अंग्रेज़ी बोलने में क्यों झिझकते हैं?",
        "expectedSentence": "Why do some students hesitate to speak English in public?",
        "acceptedAlternatives": [
          "Why do some students hesitate to speak English in public",
          "Why do some students hesitate to speak English in public?"
        ],
        "chips": [
          "Why",
          "do",
          "some",
          "students",
          "hesitate",
          "to",
          "speak",
          "English",
          "in",
          "public",
          "does"
        ],
        "structureFormula": "Why + do + Plural Subject + V1 + Infinitive + Preposition phrase?",
        "situationContextHi": "सीखने की चुनौतियाँ",
        "explanationHi": "Why के बाद do + plural subject (some students) + V1 (hesitate) आता है।",
        "vocabularyFocus": [
          "hesitate",
          "speak",
          "public",
          "students"
        ]
      },
      {
        "id": "ps-chal-12",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह अस्पताल में काम के भारी दबाव के बारे में शायद ही कभी शिकायत करती है।",
        "expectedSentence": "She rarely complains about the heavy workload at the hospital.",
        "acceptedAlternatives": [
          "She rarely complains about the heavy workload at the hospital"
        ],
        "chips": [
          "She",
          "rarely",
          "complains",
          "about",
          "the",
          "heavy",
          "workload",
          "at",
          "hospital",
          "complain"
        ],
        "structureFormula": "Subject + Adverb of Frequency + V1+s + Preposition phrase",
        "situationContextHi": "पेशेवर ज़िम्मेदारी",
        "explanationHi": "Rarely क्रिया (complains) से पहले आता है और She के साथ \"s\" लगता है।",
        "vocabularyFocus": [
          "rarely",
          "complain",
          "heavy",
          "workload"
        ]
      },
      {
        "id": "ps-chal-13",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हमारी कंपनी उत्पादन में अंतरराष्ट्रीय गुणवत्ता मानकों का कड़ाई से पालन करती है।",
        "expectedSentence": "Our company strictly follows international quality standards in production.",
        "acceptedAlternatives": [
          "Our company strictly follows international quality standards in production"
        ],
        "chips": [
          "Our",
          "company",
          "strictly",
          "follows",
          "international",
          "quality",
          "standards",
          "in",
          "production",
          "follow"
        ],
        "structureFormula": "Subject + Adverb + V1+s + Object + in production",
        "situationContextHi": "व्यावसायिक नियम",
        "explanationHi": "Our company एकवचन संस्था है इसलिए follow में \"s\" लगकर \"follows\" आता है।",
        "vocabularyFocus": [
          "strictly",
          "follow",
          "quality",
          "standards"
        ]
      },
      {
        "id": "ps-chal-14",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "नवीकरणीय ऊर्जा को बढ़ावा देने के लिए सरकार क्या कदम उठाती है?",
        "expectedSentence": "What steps does the government take to promote renewable energy?",
        "acceptedAlternatives": [
          "What steps does the government take to promote renewable energy",
          "What steps does the government take to promote renewable energy?"
        ],
        "chips": [
          "What",
          "steps",
          "does",
          "the",
          "government",
          "take",
          "to",
          "promote",
          "renewable",
          "energy",
          "do"
        ],
        "structureFormula": "What + Noun + does + Subject + V1 + Infinitive?",
        "situationContextHi": "पर्यावरण और नीतियाँ",
        "explanationHi": "The government एकवचन है इसलिए प्रश्न में \"does\" आता है और मुख्य क्रिया \"take\" रहती है।",
        "vocabularyFocus": [
          "government",
          "promote",
          "renewable",
          "energy"
        ]
      },
      {
        "id": "ps-chal-15",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह बड़े अनुशासन के साथ अपनी नौकरी और संगीत के शौक को संतुलित करता है।",
        "expectedSentence": "He balances his job and passion for music with great discipline.",
        "acceptedAlternatives": [
          "He balances his job and passion for music with great discipline"
        ],
        "chips": [
          "He",
          "balances",
          "his",
          "job",
          "and",
          "passion",
          "for",
          "music",
          "with",
          "great",
          "discipline"
        ],
        "structureFormula": "Subject + V1+s + Object + with discipline",
        "situationContextHi": "जीवन और संतुलन",
        "explanationHi": "He के साथ balance में \"s\" लगकर \"balances\" आता है।",
        "vocabularyFocus": [
          "balance",
          "passion",
          "discipline"
        ]
      },
      {
        "id": "ps-chal-16",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपका विश्वविद्यालय अंतरराष्ट्रीय छात्रों को छात्रवृत्ति प्रदान करता है?",
        "expectedSentence": "Does your university offer scholarships to international students?",
        "acceptedAlternatives": [
          "Does your university offer scholarships to international students",
          "Does your university offer scholarships to international students?"
        ],
        "chips": [
          "Does",
          "your",
          "university",
          "offer",
          "scholarships",
          "to",
          "international",
          "students",
          "Do"
        ],
        "structureFormula": "Does + Singular Subject + V1 + Object + to recipients?",
        "situationContextHi": "उच्च शिक्षा और दाखिला",
        "explanationHi": "Your university एकवचन है इसलिए प्रश्न में \"Does\" आता है।",
        "vocabularyFocus": [
          "university",
          "offer",
          "scholarships",
          "international"
        ]
      },
      {
        "id": "ps-chal-17",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वे उचित सत्यापन के बिना अजनबियों पर आसानी से भरोसा नहीं करते हैं।",
        "expectedSentence": "They do not easily trust strangers without proper verification.",
        "acceptedAlternatives": [
          "They don't easily trust strangers without proper verification.",
          "They do not easily trust strangers without proper verification"
        ],
        "chips": [
          "They",
          "do",
          "not",
          "easily",
          "trust",
          "strangers",
          "without",
          "proper",
          "verification",
          "does"
        ],
        "structureFormula": "They + do not + Adverb + V1 + Object + without + Noun",
        "situationContextHi": "सुरक्षा और सावधानी",
        "explanationHi": "They के साथ do not आता है। Adverb \"easily\" क्रिया trust से पहले है।",
        "vocabularyFocus": [
          "trust",
          "strangers",
          "proper",
          "verification"
        ]
      },
      {
        "id": "ps-chal-18",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आपकी टीम डेटाबेस को कितनी बार अपडेट करती है?",
        "expectedSentence": "How often does your team update the database?",
        "acceptedAlternatives": [
          "How often does your team update the database",
          "How often does your team update the database?"
        ],
        "chips": [
          "How",
          "often",
          "does",
          "your",
          "team",
          "update",
          "the",
          "database",
          "do"
        ],
        "structureFormula": "How often + does + Team + V1 + Object?",
        "situationContextHi": "तकनीकी कार्यप्रणाली",
        "explanationHi": "Your team collective noun (एकवचन) के रूप में \"does\" लेती है।",
        "vocabularyFocus": [
          "often",
          "team",
          "update",
          "database"
        ]
      },
      {
        "id": "ps-chal-19",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "नियमित सुबह का ध्यान मन को शांत करता है और एकाग्रता बढ़ाता है।",
        "expectedSentence": "Regular morning meditation calms the mind and improves focus.",
        "acceptedAlternatives": [
          "Regular morning meditation calms the mind and improves focus"
        ],
        "chips": [
          "Regular",
          "morning",
          "meditation",
          "calms",
          "the",
          "mind",
          "and",
          "improves",
          "focus"
        ],
        "structureFormula": "Subject + V1+s + Object + and + V1+s + Object",
        "situationContextHi": "स्वास्थ्य और मानसिक शांति",
        "explanationHi": "Meditation एकवचन है इसलिए दोनों क्रियाओं में \"s\" लगा: calms और improves।",
        "vocabularyFocus": [
          "meditation",
          "calm",
          "improve",
          "focus"
        ]
      },
      {
        "id": "ps-chal-20",
        "tenseKey": "present_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वह तनावपूर्ण कार्यस्थल की परिस्थितियों में भी आसानी से अपना आपा नहीं खोता है।",
        "expectedSentence": "He does not easily lose his temper even in stressful situations.",
        "acceptedAlternatives": [
          "He doesn't easily lose his temper even in stressful situations.",
          "He does not easily lose his temper even in stressful situations"
        ],
        "chips": [
          "He",
          "does",
          "not",
          "easily",
          "lose",
          "his",
          "temper",
          "even",
          "in",
          "stressful",
          "situations"
        ],
        "structureFormula": "He + does not + easily + V1 + Object + Preposition phrase",
        "situationContextHi": "सहनशीलता और धैर्य",
        "explanationHi": "He के साथ does not lose आता है। मुहावरा \"lose one's temper\" का अर्थ आपा खोना है।",
        "vocabularyFocus": [
          "lose",
          "temper",
          "stressful",
          "situations"
        ]
      }
    ]
  },
  "past_simple": {
    "key": "past_simple",
    "englishTitle": "Past Simple",
    "hindiTitle": "सामान्य भूतकाल",
    "shortTag": "2. Past Simple",
    "colorScheme": {
      "badge": "bg-amber-950 text-amber-300 border-amber-800",
      "border": "border-amber-600/40",
      "bg": "bg-amber-950/20",
      "activeTab": "bg-amber-600 text-white ring-2 ring-amber-400 shadow-lg shadow-amber-950/50",
      "text": "text-amber-400",
      "ring": "ring-amber-500"
    },
    "identificationHi": "वाक्य के अंत में \"खेला, गया, देखा, खाया, आए, दी\" (आ/ई/ए की ध्वनि) आता है।",
    "whenToUseHi": "भूतकाल में किसी निश्चित समय पर पूरा हो चुका काम (Completed action in the past) बताने के लिए।",
    "coreExampleEn": "I played cricket yesterday.",
    "coreExampleHi": "मैंने कल क्रिकेट खेला।",
    "structure": {
      "positive": "Subject + Verb (2nd form, e.g. played, went, ate) + Object",
      "negative": "Subject + did not (didn't) + Verb (1st form) + Object",
      "question": "Did + Subject + Verb (1st form) + Object?"
    },
    "exercises": [
      {
        "id": "past-beg-1",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने कल क्रिकेट खेला।",
        "expectedSentence": "I played cricket yesterday.",
        "acceptedAlternatives": [
          "I played cricket yesterday",
          "Yesterday I played cricket.",
          "Yesterday I played cricket"
        ],
        "chips": [
          "yesterday",
          "cricket",
          "played",
          "I"
        ],
        "structureFormula": "I + played (V2) + cricket + yesterday",
        "explanationHi": "Past Simple के सकारात्मक वाक्य में क्रिया का दूसरा रूप (V2: play → played) आता है।",
        "vocabularyFocus": [
          "play",
          "cricket",
          "yesterday"
        ],
        "situationContextHi": "कल का बीता खेल"
      },
      {
        "id": "past-beg-2",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हमने एक फिल्म देखी।",
        "expectedSentence": "We saw a movie.",
        "acceptedAlternatives": [
          "We saw a movie",
          "We watched a movie."
        ],
        "chips": [
          "a movie",
          "saw",
          "We"
        ],
        "structureFormula": "We + saw (V2 of see) + a movie",
        "explanationHi": "See की 2nd form \"saw\" होती है: see → saw → seen।",
        "vocabularyFocus": [
          "we",
          "see",
          "movie"
        ],
        "situationContextHi": "मनोरंजन का अनुभव"
      },
      {
        "id": "past-beg-3",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने एक सेब खाया।",
        "expectedSentence": "She ate an apple.",
        "acceptedAlternatives": [
          "She ate an apple"
        ],
        "chips": [
          "an apple",
          "ate",
          "She"
        ],
        "structureFormula": "She + ate (V2 of eat) + an apple",
        "explanationHi": "Eat की 2nd form \"ate\" होती है।",
        "vocabularyFocus": [
          "she",
          "eat",
          "apple"
        ],
        "situationContextHi": "फल खाना"
      },
      {
        "id": "past-beg-4",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह घर गया।",
        "expectedSentence": "He went home.",
        "acceptedAlternatives": [
          "He went home"
        ],
        "chips": [
          "home",
          "went",
          "He"
        ],
        "structureFormula": "He + went (V2 of go) + home",
        "explanationHi": "Go की 2nd form \"went\" होती है: go → went → gone।",
        "vocabularyFocus": [
          "he",
          "go",
          "home"
        ],
        "situationContextHi": "घर लौटना"
      },
      {
        "id": "past-beg-5",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे जल्दी पहुँचे।",
        "expectedSentence": "They arrived early.",
        "acceptedAlternatives": [
          "They arrived early"
        ],
        "chips": [
          "early",
          "arrived",
          "They"
        ],
        "structureFormula": "They + arrived + early",
        "explanationHi": "Arrive की 2nd form \"arrived\" है।",
        "vocabularyFocus": [
          "they",
          "arrive",
          "early"
        ],
        "situationContextHi": "समय पर पहुँचना"
      },
      {
        "id": "past-beg-6",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने एक पेन खरीदा।",
        "expectedSentence": "I bought a pen.",
        "acceptedAlternatives": [
          "I bought a pen"
        ],
        "chips": [
          "a pen",
          "bought",
          "I"
        ],
        "structureFormula": "I + bought (V2 of buy) + a pen",
        "explanationHi": "Buy की 2nd form \"bought\" होती है।",
        "vocabularyFocus": [
          "buy",
          "pen"
        ],
        "situationContextHi": "छोटी खरीदारी"
      },
      {
        "id": "past-beg-7",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने मुझे फोन किया।",
        "expectedSentence": "He called me.",
        "acceptedAlternatives": [
          "He called me"
        ],
        "chips": [
          "me",
          "called",
          "He"
        ],
        "structureFormula": "He + called + me",
        "explanationHi": "Call की 2nd form \"called\" है।",
        "vocabularyFocus": [
          "he",
          "call",
          "me"
        ],
        "situationContextHi": "फोन पर बातचीत"
      },
      {
        "id": "past-beg-8",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "मैं नहीं रोया।",
        "expectedSentence": "I did not cry.",
        "acceptedAlternatives": [
          "I didn't cry.",
          "I did not cry",
          "I didn't cry"
        ],
        "chips": [
          "cry",
          "did not",
          "I"
        ],
        "structureFormula": "I + did not + cry",
        "explanationHi": "भूतकाल में \"did not\" के बाद Verb का पहला रूप (V1: cry) आता है।",
        "vocabularyFocus": [
          "cry",
          "not"
        ],
        "situationContextHi": "भावना का अभाव"
      },
      {
        "id": "past-beg-9",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह नहीं आई।",
        "expectedSentence": "She did not come.",
        "acceptedAlternatives": [
          "She didn't come.",
          "She did not come",
          "She didn't come"
        ],
        "chips": [
          "come",
          "did not",
          "She"
        ],
        "structureFormula": "She + did not + come",
        "explanationHi": "Did not के साथ हमेशा V1 (come) आता है, came नहीं।",
        "vocabularyFocus": [
          "she",
          "come"
        ],
        "situationContextHi": "अनुपस्थिति"
      },
      {
        "id": "past-beg-10",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुमने खाया?",
        "expectedSentence": "Did you eat?",
        "acceptedAlternatives": [
          "Did you eat"
        ],
        "chips": [
          "eat?",
          "you",
          "Did"
        ],
        "structureFormula": "Did + you + eat?",
        "explanationHi": "Past Simple का प्रश्न \"Did\" से शुरू होता है: Did + you + V1?",
        "vocabularyFocus": [
          "you",
          "eat"
        ],
        "situationContextHi": "खाने की पूछताछ"
      },
      {
        "id": "past-beg-11",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या उसने फोन किया?",
        "expectedSentence": "Did he call?",
        "acceptedAlternatives": [
          "Did he call"
        ],
        "chips": [
          "call?",
          "he",
          "Did"
        ],
        "structureFormula": "Did + he + call?",
        "explanationHi": "Did + he + call? (Did आने पर क्रिया V1 में रहती है)।",
        "vocabularyFocus": [
          "he",
          "call"
        ],
        "situationContextHi": "कॉल की पुष्टि"
      },
      {
        "id": "past-prac-1",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैंने पिछले रविवार अपने दादा-दादी से मुलाकात की।",
        "expectedSentence": "I visited my grandparents last Sunday.",
        "acceptedAlternatives": [
          "I visited my grandparents last Sunday"
        ],
        "chips": [
          "last Sunday",
          "my grandparents",
          "visited",
          "I"
        ],
        "structureFormula": "I + visited + my grandparents + last Sunday",
        "explanationHi": "Visit की 2nd form \"visited\" है। समय: last Sunday।",
        "vocabularyFocus": [
          "visit",
          "grandparents",
          "Sunday"
        ],
        "situationContextHi": "परिवार से मिलना"
      },
      {
        "id": "past-prac-2",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसने कल स्वादिष्ट खाना बनाया।",
        "expectedSentence": "She cooked delicious food yesterday.",
        "acceptedAlternatives": [
          "She cooked delicious food yesterday",
          "She cooked tasty food yesterday."
        ],
        "chips": [
          "yesterday",
          "delicious food",
          "cooked",
          "She"
        ],
        "structureFormula": "She + cooked + delicious food + yesterday",
        "explanationHi": "Cook की 2nd form \"cooked\" होती है।",
        "vocabularyFocus": [
          "she",
          "cook",
          "food",
          "yesterday"
        ],
        "situationContextHi": "घर पर खाना बनाना"
      },
      {
        "id": "past-prac-3",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हमने समय पर अपना गृहकार्य पूरा किया।",
        "expectedSentence": "We finished our homework on time.",
        "acceptedAlternatives": [
          "We finished our homework on time"
        ],
        "chips": [
          "on time",
          "our homework",
          "finished",
          "We"
        ],
        "structureFormula": "We + finished + our homework + on time",
        "explanationHi": "Finish की 2nd form \"finished\" होती है।",
        "vocabularyFocus": [
          "we",
          "finish",
          "homework",
          "time"
        ],
        "situationContextHi": "पढ़ाई का कार्य पूरा करना"
      },
      {
        "id": "past-prac-4",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसने पिछले हफ्ते एक नई साइकिल खरीदी।",
        "expectedSentence": "He bought a new bicycle last week.",
        "acceptedAlternatives": [
          "He bought a new bicycle last week",
          "He bought a new cycle last week."
        ],
        "chips": [
          "last week",
          "a new bicycle",
          "bought",
          "He"
        ],
        "structureFormula": "He + bought + a new bicycle + last week",
        "explanationHi": "Buy का V2 \"bought\" है। समय: last week।",
        "vocabularyFocus": [
          "he",
          "buy",
          "new",
          "week"
        ],
        "situationContextHi": "नई चीज़ की खरीदारी"
      },
      {
        "id": "past-prac-5",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उन्होंने सुबह घर साफ किया।",
        "expectedSentence": "They cleaned the house in the morning.",
        "acceptedAlternatives": [
          "They cleaned the house in the morning"
        ],
        "chips": [
          "in the morning",
          "the house",
          "cleaned",
          "They"
        ],
        "structureFormula": "They + cleaned + the house + in the morning",
        "explanationHi": "Clean की 2nd form \"cleaned\" है।",
        "vocabularyFocus": [
          "they",
          "clean",
          "house",
          "morning"
        ],
        "situationContextHi": "घर की सफाई"
      },
      {
        "id": "past-prac-6",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "मैं कल बाज़ार नहीं गया।",
        "expectedSentence": "I did not go to the market yesterday.",
        "acceptedAlternatives": [
          "I didn't go to the market yesterday.",
          "I did not go to the market yesterday",
          "I didn't go to the market yesterday"
        ],
        "chips": [
          "yesterday",
          "to the market",
          "go",
          "did not",
          "I"
        ],
        "structureFormula": "I + did not + go + to the market + yesterday",
        "explanationHi": "Did not + go (V1) का प्रयोग होता है, went का नहीं।",
        "vocabularyFocus": [
          "go",
          "market",
          "yesterday"
        ],
        "situationContextHi": "बाज़ार न जाने का कारण"
      },
      {
        "id": "past-prac-7",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "उसने आज सुबह दूध नहीं पिया।",
        "expectedSentence": "He did not drink milk this morning.",
        "acceptedAlternatives": [
          "He didn't drink milk this morning.",
          "He did not drink milk this morning",
          "He didn't drink milk this morning"
        ],
        "chips": [
          "this morning",
          "milk",
          "drink",
          "did not",
          "He"
        ],
        "structureFormula": "He + did not + drink + milk + this morning",
        "explanationHi": "Did not + drink (मूल रूप) + milk।",
        "vocabularyFocus": [
          "he",
          "drink",
          "milk",
          "morning"
        ],
        "situationContextHi": "सुबह का नाश्ता"
      },
      {
        "id": "past-prac-8",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "हमें चाबियाँ नहीं मिलीं।",
        "expectedSentence": "We did not find the keys.",
        "acceptedAlternatives": [
          "We didn't find the keys.",
          "We did not find the keys",
          "We didn't find the keys"
        ],
        "chips": [
          "the keys",
          "find",
          "did not",
          "We"
        ],
        "structureFormula": "We + did not + find + the keys",
        "explanationHi": "Find की V1 \"find\" Did not के साथ आती है।",
        "vocabularyFocus": [
          "we",
          "find",
          "keys"
        ],
        "situationContextHi": "खोई वस्तु की खोज"
      },
      {
        "id": "past-prac-9",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आप कल राहुल से मिले?",
        "expectedSentence": "Did you meet Rahul yesterday?",
        "acceptedAlternatives": [
          "Did you meet Rahul yesterday"
        ],
        "chips": [
          "yesterday?",
          "Rahul",
          "meet",
          "you",
          "Did"
        ],
        "structureFormula": "Did + you + meet + Rahul + yesterday?",
        "explanationHi": "Did + you + meet (V1) + Rahul + yesterday?",
        "vocabularyFocus": [
          "you",
          "meet",
          "yesterday"
        ],
        "situationContextHi": "दोस्त से मिलने की बात"
      },
      {
        "id": "past-prac-10",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या उसने आपको सच बताया?",
        "expectedSentence": "Did she tell you the truth?",
        "acceptedAlternatives": [
          "Did she tell you the truth"
        ],
        "chips": [
          "the truth?",
          "you",
          "tell",
          "she",
          "Did"
        ],
        "structureFormula": "Did + she + tell + you + the truth?",
        "explanationHi": "Did she tell (V1) you the truth?",
        "vocabularyFocus": [
          "she",
          "tell",
          "truth"
        ],
        "situationContextHi": "सच्चाई जानना"
      },
      {
        "id": "past-prac-11",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या उन्होंने पार्टी का आनंद लिया?",
        "expectedSentence": "Did they enjoy the party?",
        "acceptedAlternatives": [
          "Did they enjoy the party"
        ],
        "chips": [
          "the party?",
          "enjoy",
          "they",
          "Did"
        ],
        "structureFormula": "Did + they + enjoy + the party?",
        "explanationHi": "Did + they + enjoy (V1) + the party?",
        "vocabularyFocus": [
          "they",
          "enjoy",
          "party"
        ],
        "situationContextHi": "उत्सव का आनंद"
      },
      {
        "id": "past-chal-1",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "शिक्षक ने पाठ बहुत स्पष्ट रूप से समझाया।",
        "expectedSentence": "The teacher explained the lesson very clearly.",
        "acceptedAlternatives": [
          "The teacher explained the lesson very clearly"
        ],
        "chips": [
          "very clearly",
          "the lesson",
          "explained",
          "The teacher"
        ],
        "structureFormula": "The teacher + explained (V2) + the lesson + very clearly",
        "explanationHi": "Explain की 2nd form \"explained\" होती है।",
        "vocabularyFocus": [
          "teacher",
          "explain",
          "lesson"
        ],
        "situationContextHi": "कक्षा में पढ़ाई"
      },
      {
        "id": "past-chal-2",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हमने चालीस मिनट तक बस का इंतज़ार किया।",
        "expectedSentence": "We waited for the bus for forty minutes.",
        "acceptedAlternatives": [
          "We waited for the bus for forty minutes",
          "We waited for the bus for 40 minutes."
        ],
        "chips": [
          "for forty minutes",
          "for the bus",
          "waited",
          "We"
        ],
        "structureFormula": "We + waited + for the bus + for forty minutes",
        "explanationHi": "Wait का V2 \"waited\" है। समय की अवधि के लिए \"for\" आता है।",
        "vocabularyFocus": [
          "we",
          "wait",
          "bus",
          "time"
        ],
        "situationContextHi": "बस स्टॉप पर इंतज़ार"
      },
      {
        "id": "past-chal-3",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "उसने सभी सवालों के सही जवाब दिए।",
        "expectedSentence": "She answered all the questions correctly.",
        "acceptedAlternatives": [
          "She answered all the questions correctly"
        ],
        "chips": [
          "correctly",
          "all the questions",
          "answered",
          "She"
        ],
        "structureFormula": "She + answered + all the questions + correctly",
        "explanationHi": "Answer की 2nd form \"answered\" होती है।",
        "vocabularyFocus": [
          "she",
          "answer",
          "question"
        ],
        "situationContextHi": "परीक्षा में सफलता"
      },
      {
        "id": "past-chal-4",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "मुझे कल आपका ईमेल नहीं मिला।",
        "expectedSentence": "I did not receive your email yesterday.",
        "acceptedAlternatives": [
          "I didn't receive your email yesterday.",
          "I did not receive your email yesterday",
          "I didn't receive your email yesterday"
        ],
        "chips": [
          "yesterday",
          "your email",
          "receive",
          "did not",
          "I"
        ],
        "structureFormula": "I + did not + receive + your email + yesterday",
        "explanationHi": "Did not + receive (V1) + your email।",
        "vocabularyFocus": [
          "receive",
          "email",
          "yesterday"
        ],
        "situationContextHi": "दफ्तर का पत्राचार"
      },
      {
        "id": "past-chal-5",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वे निर्देशों को नहीं समझे।",
        "expectedSentence": "They did not understand the instructions.",
        "acceptedAlternatives": [
          "They didn't understand the instructions.",
          "They did not understand the instructions",
          "They didn't understand the instructions"
        ],
        "chips": [
          "the instructions",
          "understand",
          "did not",
          "They"
        ],
        "structureFormula": "They + did not + understand + the instructions",
        "explanationHi": "Did not + understand (मूल क्रिया) आता है।",
        "vocabularyFocus": [
          "they",
          "understand"
        ],
        "situationContextHi": "नियम समझना"
      },
      {
        "id": "past-chal-6",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वह कल शाम बैठक में शामिल नहीं हुआ।",
        "expectedSentence": "He did not attend the meeting last evening.",
        "acceptedAlternatives": [
          "He didn't attend the meeting last evening.",
          "He did not attend the meeting last evening",
          "He didn't attend the meeting last evening",
          "He did not attend the meeting yesterday evening."
        ],
        "chips": [
          "last evening",
          "the meeting",
          "attend",
          "did not",
          "He"
        ],
        "structureFormula": "He + did not + attend + the meeting + last evening",
        "explanationHi": "Did not + attend (V1) + the meeting।",
        "vocabularyFocus": [
          "he",
          "attend",
          "meeting"
        ],
        "situationContextHi": "दफ्तर की बैठक"
      },
      {
        "id": "past-chal-7",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "तुम कल देर से क्यों आए?",
        "expectedSentence": "Why did you come late yesterday?",
        "acceptedAlternatives": [
          "Why did you come late yesterday"
        ],
        "chips": [
          "yesterday?",
          "late",
          "come",
          "you",
          "did",
          "Why"
        ],
        "structureFormula": "Why + did + you + come + late + yesterday?",
        "explanationHi": "Why + did + Subject + V1 (come) + late + time?",
        "vocabularyFocus": [
          "why",
          "come",
          "late",
          "yesterday"
        ],
        "situationContextHi": "देरी का कारण पूछना"
      },
      {
        "id": "past-chal-8",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "तुमने यह सुंदर कमीज़ कहाँ से खरीदी?",
        "expectedSentence": "Where did you buy this beautiful shirt?",
        "acceptedAlternatives": [
          "Where did you buy this beautiful shirt"
        ],
        "chips": [
          "this beautiful shirt?",
          "buy",
          "you",
          "did",
          "Where"
        ],
        "structureFormula": "Where + did + you + buy + this beautiful shirt?",
        "explanationHi": "Where + did + you + buy (V1) + object?",
        "vocabularyFocus": [
          "where",
          "buy",
          "beautiful"
        ],
        "situationContextHi": "कपड़ों की तारीफ और पूछताछ"
      },
      {
        "id": "past-chal-9",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपके भाई ने ड्राइविंग टेस्ट पास कर लिया?",
        "expectedSentence": "Did your brother pass his driving test?",
        "acceptedAlternatives": [
          "Did your brother pass his driving test"
        ],
        "chips": [
          "his driving test?",
          "pass",
          "your brother",
          "Did"
        ],
        "structureFormula": "Did + your brother + pass + his driving test?",
        "explanationHi": "Did + your brother + pass (V1) + driving test?",
        "vocabularyFocus": [
          "brother",
          "pass"
        ],
        "situationContextHi": "टेस्ट का परिणाम पूछना"
      },
      {
        "id": "past-chal-10",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "तुमने यह कठिन पहेली कैसे हल की?",
        "expectedSentence": "How did you solve this difficult puzzle?",
        "acceptedAlternatives": [
          "How did you solve this difficult puzzle"
        ],
        "chips": [
          "this difficult puzzle?",
          "solve",
          "you",
          "did",
          "How"
        ],
        "structureFormula": "How + did + you + solve + this difficult puzzle?",
        "explanationHi": "How + did + you + solve (V1) + puzzle?",
        "vocabularyFocus": [
          "how",
          "solve",
          "difficult"
        ],
        "situationContextHi": "पहेली सुलझाना"
      },
      {
        "id": "past-beg-12",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने पिछले महीने जयपुर का दौरा किया।",
        "expectedSentence": "I visited Jaipur last month.",
        "acceptedAlternatives": [
          "I visited Jaipur last month"
        ],
        "chips": [
          "visited",
          "Jaipur",
          "last",
          "month",
          "I",
          "visit"
        ],
        "structureFormula": "I + V2 (visited) + Place + last month",
        "situationContextHi": "यात्रा का अनुभव",
        "explanationHi": "Past Simple में क्रिया का दूसरा रूप (V2: visited) आता है।",
        "vocabularyFocus": [
          "visit",
          "month",
          "Jaipur"
        ]
      },
      {
        "id": "past-beg-13",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने एक नई पोशाक खरीदी।",
        "expectedSentence": "She bought a new dress.",
        "acceptedAlternatives": [
          "She bought a new dress"
        ],
        "chips": [
          "bought",
          "a",
          "new",
          "dress",
          "She",
          "buy"
        ],
        "structureFormula": "She + V2 (bought) + Object",
        "situationContextHi": "खरीदारी",
        "explanationHi": "Buy का past form \"bought\" (V2) होता है।",
        "vocabularyFocus": [
          "buy",
          "dress",
          "new"
        ]
      },
      {
        "id": "past-beg-14",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हमने कल एक फिल्म देखी।",
        "expectedSentence": "We watched a movie yesterday.",
        "acceptedAlternatives": [
          "We watched a movie yesterday",
          "We watched a film yesterday."
        ],
        "chips": [
          "watched",
          "a",
          "movie",
          "yesterday",
          "We",
          "watch"
        ],
        "structureFormula": "We + V2 (watched) + Object + yesterday",
        "situationContextHi": "मनोरंजन",
        "explanationHi": "Watch का past form \"watched\" होता है। कल के लिए \"yesterday\" आया।",
        "vocabularyFocus": [
          "watch",
          "movie",
          "yesterday"
        ]
      },
      {
        "id": "past-beg-15",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "उसने मुझे फोन नहीं किया।",
        "expectedSentence": "He did not call me.",
        "acceptedAlternatives": [
          "He didn't call me.",
          "He did not call me"
        ],
        "chips": [
          "did",
          "not",
          "call",
          "me",
          "He",
          "called"
        ],
        "structureFormula": "He + did not + V1 (call) + Object",
        "situationContextHi": "बातचीत न होना",
        "explanationHi": "Did not के बाद हमेशा क्रिया का पहला रूप (V1: call) आता है, \"called\" नहीं।",
        "vocabularyFocus": [
          "call"
        ]
      },
      {
        "id": "past-beg-16",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुमने वह पक्षी देखा?",
        "expectedSentence": "Did you see that bird?",
        "acceptedAlternatives": [
          "Did you see that bird",
          "Did you see that bird?"
        ],
        "chips": [
          "Did",
          "you",
          "see",
          "that",
          "bird",
          "saw"
        ],
        "structureFormula": "Did + you + V1 (see) + Object?",
        "situationContextHi": "कुछ देखने के बारे में पूछना",
        "explanationHi": "Did से शुरू होने वाले प्रश्न में V1 \"see\" आता है।",
        "vocabularyFocus": [
          "see",
          "bird"
        ]
      },
      {
        "id": "past-beg-17",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उन्होंने दोपहर में खाना खाया।",
        "expectedSentence": "They ate lunch at noon.",
        "acceptedAlternatives": [
          "They ate lunch at noon"
        ],
        "chips": [
          "ate",
          "lunch",
          "at",
          "noon",
          "They",
          "eat"
        ],
        "structureFormula": "They + V2 (ate) + Object + at noon",
        "situationContextHi": "दोपहर का भोजन",
        "explanationHi": "Eat की past form \"ate\" (V2) होती है।",
        "vocabularyFocus": [
          "eat",
          "lunch",
          "noon"
        ]
      },
      {
        "id": "past-beg-18",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने कल अपनी चाबियाँ खो दीं।",
        "expectedSentence": "I lost my keys yesterday.",
        "acceptedAlternatives": [
          "I lost my keys yesterday"
        ],
        "chips": [
          "lost",
          "my",
          "keys",
          "yesterday",
          "I",
          "lose"
        ],
        "structureFormula": "I + V2 (lost) + Object + yesterday",
        "situationContextHi": "चीज खो जाना",
        "explanationHi": "Lose की past tense form \"lost\" होती है।",
        "vocabularyFocus": [
          "lose",
          "keys"
        ]
      },
      {
        "id": "past-beg-19",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या उसने अपना गृहकार्य पूरा किया?",
        "expectedSentence": "Did she finish her homework?",
        "acceptedAlternatives": [
          "Did she finish her homework",
          "Did she finish her homework?"
        ],
        "chips": [
          "Did",
          "she",
          "finish",
          "her",
          "homework",
          "finished"
        ],
        "structureFormula": "Did + she + V1 + Object?",
        "situationContextHi": "पढ़ाई की पूछताछ",
        "explanationHi": "Did के साथ V1 \"finish\" आता है।",
        "vocabularyFocus": [
          "finish",
          "homework"
        ]
      },
      {
        "id": "past-beg-20",
        "tenseKey": "past_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "हम बाहर नहीं गए।",
        "expectedSentence": "We did not go outside.",
        "acceptedAlternatives": [
          "We didn't go outside.",
          "We did not go outside"
        ],
        "chips": [
          "did",
          "not",
          "go",
          "outside",
          "We",
          "went"
        ],
        "structureFormula": "We + did not + V1 (go) + outside",
        "situationContextHi": "घर पर रुकना",
        "explanationHi": "Did not के साथ go (V1) आता है, \"went\" नहीं।",
        "vocabularyFocus": [
          "go",
          "outside"
        ]
      },
      {
        "id": "past-prac-12",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हमारे निकलने से पहले बारिश रुक गई।",
        "expectedSentence": "The rain stopped before we left.",
        "acceptedAlternatives": [
          "The rain stopped before we left",
          "The rain stopped before we left home."
        ],
        "chips": [
          "The",
          "rain",
          "stopped",
          "before",
          "we",
          "left",
          "stop"
        ],
        "structureFormula": "Subject + V2 (stopped) + before + Subject + V2 (left)",
        "situationContextHi": "मौसम और प्रस्थान",
        "explanationHi": "Stop का V2 \"stopped\" और leave का V2 \"left\" है।",
        "vocabularyFocus": [
          "rain",
          "stop",
          "leave"
        ]
      },
      {
        "id": "past-prac-13",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसने बैठक के लिए एक शानदार प्रस्तुति तैयार की।",
        "expectedSentence": "She prepared a wonderful presentation for the meeting.",
        "acceptedAlternatives": [
          "She prepared a wonderful presentation for the meeting"
        ],
        "chips": [
          "She",
          "prepared",
          "a",
          "wonderful",
          "presentation",
          "for",
          "the",
          "meeting"
        ],
        "structureFormula": "She + V2 + Object + for the meeting",
        "situationContextHi": "कार्यालय कार्य",
        "explanationHi": "Prepare का past form \"prepared\" है।",
        "vocabularyFocus": [
          "prepare",
          "presentation",
          "meeting"
        ]
      },
      {
        "id": "past-prac-14",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपके भाई ने कल ड्राइविंग टेस्ट पास किया?",
        "expectedSentence": "Did your brother pass the driving test yesterday?",
        "acceptedAlternatives": [
          "Did your brother pass the driving test yesterday",
          "Did your brother pass the driving test yesterday?"
        ],
        "chips": [
          "Did",
          "your",
          "brother",
          "pass",
          "the",
          "driving",
          "test",
          "yesterday"
        ],
        "structureFormula": "Did + Subject + V1 (pass) + Object + yesterday?",
        "situationContextHi": "परीक्षा का परिणाम पूछना",
        "explanationHi": "Did के साथ V1 \"pass\" आता है।",
        "vocabularyFocus": [
          "pass",
          "driving",
          "test",
          "brother"
        ]
      },
      {
        "id": "past-prac-15",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हमने दो हफ्ते पहले ट्रेन के टिकट बुक किए थे।",
        "expectedSentence": "We booked train tickets two weeks ago.",
        "acceptedAlternatives": [
          "We booked train tickets two weeks ago"
        ],
        "chips": [
          "We",
          "booked",
          "train",
          "tickets",
          "two",
          "weeks",
          "ago",
          "book"
        ],
        "structureFormula": "We + V2 (booked) + Object + time phrase ago",
        "situationContextHi": "यात्रा की योजना",
        "explanationHi": "Past time expression \"ago\" के साथ Past Simple (booked) आता है।",
        "vocabularyFocus": [
          "book",
          "tickets",
          "train"
        ]
      },
      {
        "id": "past-prac-16",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "उसे समय पर महत्वपूर्ण पैकेज नहीं मिला।",
        "expectedSentence": "He did not receive the important package on time.",
        "acceptedAlternatives": [
          "He didn't receive the important package on time.",
          "He did not receive the important package on time"
        ],
        "chips": [
          "He",
          "did",
          "not",
          "receive",
          "the",
          "important",
          "package",
          "on",
          "time"
        ],
        "structureFormula": "He + did not + V1 (receive) + Object + on time",
        "situationContextHi": "पार्सल की डिलीवरी",
        "explanationHi": "Did not के बाद V1 \"receive\" आता है।",
        "vocabularyFocus": [
          "receive",
          "important",
          "package"
        ]
      },
      {
        "id": "past-prac-17",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "शिक्षक ने धैर्यपूर्वक हमारे सभी प्रश्नों के उत्तर दिए।",
        "expectedSentence": "The teacher answered all our questions patiently.",
        "acceptedAlternatives": [
          "The teacher answered all our questions patiently",
          "The teacher answered all our doubts patiently."
        ],
        "chips": [
          "The",
          "teacher",
          "answered",
          "all",
          "our",
          "questions",
          "patiently"
        ],
        "structureFormula": "Subject + V2 (answered) + Object + Adverb (patiently)",
        "situationContextHi": "कक्षा का अनुभव",
        "explanationHi": "Answer का past form \"answered\" है।",
        "vocabularyFocus": [
          "teacher",
          "answer",
          "patiently"
        ]
      },
      {
        "id": "past-prac-18",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उन्होंने करीबी दोस्तों के साथ अपनी सालगिरह मनाई।",
        "expectedSentence": "They celebrated their anniversary with close friends.",
        "acceptedAlternatives": [
          "They celebrated their anniversary with close friends"
        ],
        "chips": [
          "They",
          "celebrated",
          "their",
          "anniversary",
          "with",
          "close",
          "friends"
        ],
        "structureFormula": "Subject + V2 (celebrated) + Object + with friends",
        "situationContextHi": "उत्सव और खुशी",
        "explanationHi": "Celebrate का past form \"celebrated\" है।",
        "vocabularyFocus": [
          "celebrate",
          "anniversary",
          "friends"
        ]
      },
      {
        "id": "past-prac-19",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपने जाने से पहले मुख्य दरवाजे पर ताला लगाया?",
        "expectedSentence": "Did you lock the main door before leaving?",
        "acceptedAlternatives": [
          "Did you lock the main door before leaving",
          "Did you lock the main door before leaving?"
        ],
        "chips": [
          "Did",
          "you",
          "lock",
          "the",
          "main",
          "door",
          "before",
          "leaving"
        ],
        "structureFormula": "Did + you + V1 (lock) + Object + before leaving?",
        "situationContextHi": "घर की सुरक्षा",
        "explanationHi": "Did के साथ V1 \"lock\" आता है।",
        "vocabularyFocus": [
          "lock",
          "door",
          "leave"
        ]
      },
      {
        "id": "past-prac-20",
        "tenseKey": "past_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैंने सोमवार दोपहर को किताब वापस कर दी।",
        "expectedSentence": "I returned the book on Monday afternoon.",
        "acceptedAlternatives": [
          "I returned the book on Monday afternoon"
        ],
        "chips": [
          "I",
          "returned",
          "the",
          "book",
          "on",
          "Monday",
          "afternoon"
        ],
        "structureFormula": "I + V2 (returned) + Object + on Monday afternoon",
        "situationContextHi": "पुस्तकालय या सामान लौटाना",
        "explanationHi": "Return का past form \"returned\" है।",
        "vocabularyFocus": [
          "return",
          "book",
          "Monday"
        ]
      },
      {
        "id": "past-chal-11",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "मौसम खराब होने के बावजूद बचाव दल सुरक्षित रूप से गांव पहुंच गया।",
        "expectedSentence": "Despite bad weather, the rescue team reached the village safely.",
        "acceptedAlternatives": [
          "Despite bad weather, the rescue team reached the village safely"
        ],
        "chips": [
          "Despite",
          "bad",
          "weather,",
          "the",
          "rescue",
          "team",
          "reached",
          "the",
          "village",
          "safely"
        ],
        "structureFormula": "Preposition phrase + Subject + V2 (reached) + Object + Adverb",
        "situationContextHi": "राहत और बचाव कार्य",
        "explanationHi": "Reach का past form \"reached\" है।",
        "vocabularyFocus": [
          "weather",
          "rescue",
          "team",
          "reached",
          "safely"
        ]
      },
      {
        "id": "past-chal-12",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "प्रबंधन ने बिना किसी पूर्व सूचना के सम्मेलन को क्यों स्थगित किया?",
        "expectedSentence": "Why did the management postpone the conference without notice?",
        "acceptedAlternatives": [
          "Why did the management postpone the conference without notice",
          "Why did the management postpone the conference without notice?"
        ],
        "chips": [
          "Why",
          "did",
          "the",
          "management",
          "postpone",
          "the",
          "conference",
          "without",
          "notice"
        ],
        "structureFormula": "Why + did + Subject + V1 (postpone) + Object + without notice?",
        "situationContextHi": "प्रशासनिक निर्णय",
        "explanationHi": "Why did के बाद V1 \"postpone\" आता है।",
        "vocabularyFocus": [
          "management",
          "postpone",
          "conference",
          "notice"
        ]
      },
      {
        "id": "past-chal-13",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वैज्ञानिक ने प्रयोगशाला परीक्षण के दौरान प्रत्येक अवलोकन दर्ज किया।",
        "expectedSentence": "The scientist recorded every single observation during the trial.",
        "acceptedAlternatives": [
          "The scientist recorded every single observation during the trial"
        ],
        "chips": [
          "The",
          "scientist",
          "recorded",
          "every",
          "single",
          "observation",
          "during",
          "the",
          "trial"
        ],
        "structureFormula": "Subject + V2 (recorded) + Object + during the trial",
        "situationContextHi": "वैज्ञानिक शोध",
        "explanationHi": "Record का past form \"recorded\" है।",
        "vocabularyFocus": [
          "scientist",
          "record",
          "observation",
          "trial"
        ]
      },
      {
        "id": "past-chal-14",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "उसने आकर्षक नौकरी के प्रस्ताव को स्वीकार नहीं किया क्योंकि उसे शहर बदलना पड़ता।",
        "expectedSentence": "She did not accept the job offer because it required relocation.",
        "acceptedAlternatives": [
          "She didn't accept the job offer because it required relocation.",
          "She did not accept the job offer because it required relocation"
        ],
        "chips": [
          "She",
          "did",
          "not",
          "accept",
          "the",
          "job",
          "offer",
          "because",
          "it",
          "required",
          "relocation"
        ],
        "structureFormula": "Clause 1 (did not accept) + because + Clause 2 (required)",
        "situationContextHi": "करियर का फैसला",
        "explanationHi": "Did not accept के साथ पहला खंड Past Simple में है।",
        "vocabularyFocus": [
          "accept",
          "offer",
          "require",
          "relocation"
        ]
      },
      {
        "id": "past-chal-15",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "राजधानी में दुर्घटनाएं कम करने के लिए सरकार ने कड़े यातायात नियम लागू किए।",
        "expectedSentence": "The government introduced strict traffic rules to reduce accidents.",
        "acceptedAlternatives": [
          "The government introduced strict traffic rules to reduce accidents"
        ],
        "chips": [
          "The",
          "government",
          "introduced",
          "strict",
          "traffic",
          "rules",
          "to",
          "reduce",
          "accidents"
        ],
        "structureFormula": "Subject + V2 (introduced) + Object + Infinitive of Purpose",
        "situationContextHi": "सरकारी नियम और सुरक्षा",
        "explanationHi": "Introduce का past form \"introduced\" है।",
        "vocabularyFocus": [
          "government",
          "introduce",
          "traffic",
          "accidents"
        ]
      },
      {
        "id": "past-chal-16",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपके विभाग ने समय सीमा से पहले ऑडिट रिपोर्ट प्रस्तुत की?",
        "expectedSentence": "Did your department submit the audit report before the deadline?",
        "acceptedAlternatives": [
          "Did your department submit the audit report before the deadline",
          "Did your department submit the audit report before the deadline?"
        ],
        "chips": [
          "Did",
          "your",
          "department",
          "submit",
          "the",
          "audit",
          "report",
          "before",
          "the",
          "deadline"
        ],
        "structureFormula": "Did + Subject + V1 (submit) + Object + before deadline?",
        "situationContextHi": "वित्तीय समीक्षा",
        "explanationHi": "Did के साथ V1 \"submit\" का प्रयोग हुआ।",
        "vocabularyFocus": [
          "department",
          "submit",
          "audit",
          "deadline"
        ]
      },
      {
        "id": "past-chal-17",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "छह महीने के परीक्षण के बाद उन्होंने सफलतापूर्वक अपना एप्लिकेशन लॉन्च किया।",
        "expectedSentence": "They successfully launched their application after six months of testing.",
        "acceptedAlternatives": [
          "They successfully launched their application after six months of testing"
        ],
        "chips": [
          "They",
          "successfully",
          "launched",
          "their",
          "application",
          "after",
          "six",
          "months",
          "of",
          "testing"
        ],
        "structureFormula": "Subject + Adverb + V2 (launched) + Object + Time phrase",
        "situationContextHi": "सॉफ्टवेयर रिलीज",
        "explanationHi": "Launch का past form \"launched\" है।",
        "vocabularyFocus": [
          "successfully",
          "launch",
          "application",
          "testing"
        ]
      },
      {
        "id": "past-chal-18",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "उसने बजट की कमी के बावजूद गुणवत्ता से समझौता नहीं किया।",
        "expectedSentence": "He did not compromise on quality despite budget limits.",
        "acceptedAlternatives": [
          "He didn't compromise on quality despite budget limits.",
          "He did not compromise on quality despite budget limits"
        ],
        "chips": [
          "He",
          "did",
          "not",
          "compromise",
          "on",
          "quality",
          "despite",
          "budget",
          "limits"
        ],
        "structureFormula": "Subject + did not + V1 (compromise) + on quality + despite phrase",
        "situationContextHi": "व्यावसायिक मूल्य",
        "explanationHi": "Did not compromise में V1 \"compromise\" आता है।",
        "vocabularyFocus": [
          "compromise",
          "quality",
          "budget"
        ]
      },
      {
        "id": "past-chal-19",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "समुदाय ने पुस्तकालय के नवीनीकरण के लिए पर्याप्त धन जुटाया।",
        "expectedSentence": "The community raised sufficient funds to renovate the library.",
        "acceptedAlternatives": [
          "The community raised sufficient funds to renovate the library"
        ],
        "chips": [
          "The",
          "community",
          "raised",
          "sufficient",
          "funds",
          "to",
          "renovate",
          "the",
          "library"
        ],
        "structureFormula": "Subject + V2 (raised) + Object + Infinitive",
        "situationContextHi": "सामुदायिक प्रयास",
        "explanationHi": "Raise का past form \"raised\" है।",
        "vocabularyFocus": [
          "community",
          "raise",
          "funds",
          "renovate"
        ]
      },
      {
        "id": "past-chal-20",
        "tenseKey": "past_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "प्राचीन लोगों ने आधुनिक मशीनों के बिना इतने बड़े मंदिर कैसे बनाए?",
        "expectedSentence": "How did ancient people build such huge temples without modern machines?",
        "acceptedAlternatives": [
          "How did ancient people build such huge temples without modern machines",
          "How did ancient people build such huge temples without modern machines?"
        ],
        "chips": [
          "How",
          "did",
          "ancient",
          "people",
          "build",
          "such",
          "huge",
          "temples",
          "without",
          "modern",
          "machines"
        ],
        "structureFormula": "How + did + Subject + V1 (build) + Object + without phrase?",
        "situationContextHi": "इतिहास और वास्तुकला",
        "explanationHi": "How did के साथ V1 \"build\" आता है, \"built\" नहीं।",
        "vocabularyFocus": [
          "ancient",
          "build",
          "temple",
          "machine"
        ]
      }
    ]
  },
  "future_simple": {
    "key": "future_simple",
    "englishTitle": "Future Simple",
    "hindiTitle": "सामान्य भविष्यत् काल",
    "shortTag": "3. Future Simple",
    "colorScheme": {
      "badge": "bg-cyan-950 text-cyan-300 border-cyan-800",
      "border": "border-cyan-600/40",
      "bg": "bg-cyan-950/20",
      "activeTab": "bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-lg shadow-cyan-950/50",
      "text": "text-cyan-400",
      "ring": "ring-cyan-500"
    },
    "identificationHi": "वाक्य के अंत में \"खेलूँगा, जाऊँगा, करेगा, करेंगे, आएगी\" आता है।",
    "whenToUseHi": "आने वाले समय (भविष्य) में होने वाले काम, निर्णय या वादे के लिए।",
    "coreExampleEn": "I will play cricket tomorrow.",
    "coreExampleHi": "मैं कल क्रिकेट खेलूँगा/खेलूँगी।",
    "structure": {
      "positive": "Subject + will + Verb (1st form) + Object",
      "negative": "Subject + will not (won't) + Verb (1st form) + Object",
      "question": "Will + Subject + Verb (1st form) + Object?"
    },
    "exercises": [
      {
        "id": "fut-beg-1",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं कल क्रिकेट खेलूँगा।",
        "expectedSentence": "I will play cricket tomorrow.",
        "acceptedAlternatives": [
          "I will play cricket tomorrow",
          "Tomorrow I will play cricket.",
          "I'll play cricket tomorrow."
        ],
        "chips": [
          "tomorrow",
          "cricket",
          "play",
          "will",
          "I"
        ],
        "structureFormula": "I + will + play + cricket + tomorrow",
        "explanationHi": "Future Simple में हमेशा \"will + Verb (V1)\" आता है।",
        "vocabularyFocus": [
          "play",
          "cricket",
          "tomorrow"
        ],
        "situationContextHi": "कल का आगामी प्लान"
      },
      {
        "id": "fut-beg-2",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हम जीतेंगे।",
        "expectedSentence": "We will win.",
        "acceptedAlternatives": [
          "We will win",
          "We'll win."
        ],
        "chips": [
          "win",
          "will",
          "We"
        ],
        "structureFormula": "We + will + win",
        "explanationHi": "We will win (जीत का पक्का विश्वास)।",
        "vocabularyFocus": [
          "we",
          "win"
        ],
        "situationContextHi": "हौसला और विश्वास"
      },
      {
        "id": "fut-beg-3",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह आपकी मदद करेगी।",
        "expectedSentence": "She will help you.",
        "acceptedAlternatives": [
          "She will help you",
          "She'll help you."
        ],
        "chips": [
          "you",
          "help",
          "will",
          "She"
        ],
        "structureFormula": "She + will + help + you",
        "explanationHi": "She + will + help (V1) + you।",
        "vocabularyFocus": [
          "she",
          "help",
          "you"
        ],
        "situationContextHi": "मदद का भरोसा"
      },
      {
        "id": "fut-beg-4",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह जल्द आएगा।",
        "expectedSentence": "He will come soon.",
        "acceptedAlternatives": [
          "He will come soon",
          "He'll come soon."
        ],
        "chips": [
          "soon",
          "come",
          "will",
          "He"
        ],
        "structureFormula": "He + will + come + soon",
        "explanationHi": "He + will + come + soon (जल्द)।",
        "vocabularyFocus": [
          "he",
          "come",
          "soon"
        ],
        "situationContextHi": "आगमन की सूचना"
      },
      {
        "id": "fut-beg-5",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे दूध खरीदेंगे।",
        "expectedSentence": "They will buy milk.",
        "acceptedAlternatives": [
          "They will buy milk",
          "They'll buy milk."
        ],
        "chips": [
          "milk",
          "buy",
          "will",
          "They"
        ],
        "structureFormula": "They + will + buy + milk",
        "explanationHi": "They + will + buy + milk।",
        "vocabularyFocus": [
          "they",
          "buy",
          "milk"
        ],
        "situationContextHi": "किराने का सामान"
      },
      {
        "id": "fut-beg-6",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं तुम्हें फोन करूँगा।",
        "expectedSentence": "I will call you.",
        "acceptedAlternatives": [
          "I will call you",
          "I'll call you."
        ],
        "chips": [
          "you",
          "call",
          "will",
          "I"
        ],
        "structureFormula": "I + will + call + you",
        "explanationHi": "I will call you (संपर्क करने का वादा)।",
        "vocabularyFocus": [
          "call",
          "you"
        ],
        "situationContextHi": "फोन करने का वादा"
      },
      {
        "id": "fut-beg-7",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "आज बारिश होगी।",
        "expectedSentence": "It will rain today.",
        "acceptedAlternatives": [
          "It will rain today",
          "It'll rain today."
        ],
        "chips": [
          "today",
          "rain",
          "will",
          "It"
        ],
        "structureFormula": "It + will + rain + today",
        "explanationHi": "मौसम की भविष्यवाणी के लिए \"It will rain\" आता है।",
        "vocabularyFocus": [
          "rain",
          "today"
        ],
        "situationContextHi": "मौसम का अनुमान"
      },
      {
        "id": "fut-beg-8",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "मैं नहीं जाऊँगा।",
        "expectedSentence": "I will not go.",
        "acceptedAlternatives": [
          "I won't go.",
          "I will not go",
          "I won't go"
        ],
        "chips": [
          "go",
          "will not",
          "I"
        ],
        "structureFormula": "I + will not + go",
        "explanationHi": "Will not को बोलचाल में \"won't\" भी कहते हैं।",
        "vocabularyFocus": [
          "go",
          "not"
        ],
        "situationContextHi": "न जाने का निर्णय"
      },
      {
        "id": "fut-beg-9",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह इंतज़ार नहीं करेगी।",
        "expectedSentence": "She will not wait.",
        "acceptedAlternatives": [
          "She won't wait.",
          "She will not wait",
          "She won't wait"
        ],
        "chips": [
          "wait",
          "will not",
          "She"
        ],
        "structureFormula": "She + will not + wait",
        "explanationHi": "She + will not + wait (V1)।",
        "vocabularyFocus": [
          "she",
          "wait"
        ],
        "situationContextHi": "इंतज़ार न करना"
      },
      {
        "id": "fut-beg-10",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम आओगे?",
        "expectedSentence": "Will you come?",
        "acceptedAlternatives": [
          "Will you come"
        ],
        "chips": [
          "come?",
          "you",
          "Will"
        ],
        "structureFormula": "Will + you + come?",
        "explanationHi": "भविष्य का प्रश्न \"Will\" से शुरू होता है: Will + you + V1?",
        "vocabularyFocus": [
          "you",
          "come"
        ],
        "situationContextHi": "आने के लिए पूछना"
      },
      {
        "id": "fut-beg-11",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वह मदद करेगा?",
        "expectedSentence": "Will he help?",
        "acceptedAlternatives": [
          "Will he help"
        ],
        "chips": [
          "help?",
          "he",
          "Will"
        ],
        "structureFormula": "Will + he + help?",
        "explanationHi": "Will + he + help? (मदद की संभावना पूछना)",
        "vocabularyFocus": [
          "he",
          "help"
        ],
        "situationContextHi": "सहायता की उम्मीद"
      },
      {
        "id": "fut-prac-1",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हम आपसे कल सुबह मिलेंगे।",
        "expectedSentence": "We will meet you tomorrow morning.",
        "acceptedAlternatives": [
          "We will meet you tomorrow morning",
          "We'll meet you tomorrow morning.",
          "Tomorrow morning we will meet you."
        ],
        "chips": [
          "tomorrow morning",
          "you",
          "meet",
          "will",
          "We"
        ],
        "structureFormula": "We + will + meet + you + tomorrow morning",
        "explanationHi": "We will meet (हम मिलेंगे) + you + tomorrow morning।",
        "vocabularyFocus": [
          "we",
          "meet",
          "you",
          "tomorrow",
          "morning"
        ],
        "situationContextHi": "मिलने का समय तय करना"
      },
      {
        "id": "fut-prac-2",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं अगले सोमवार अपनी नई नौकरी शुरू करूँगा।",
        "expectedSentence": "I will start my new job next Monday.",
        "acceptedAlternatives": [
          "I will start my new job next Monday",
          "I'll start my new job next Monday."
        ],
        "chips": [
          "next Monday",
          "my new job",
          "start",
          "will",
          "I"
        ],
        "structureFormula": "I + will + start + my new job + next Monday",
        "explanationHi": "भविष्य की योजना: I will start + object + time।",
        "vocabularyFocus": [
          "start",
          "new",
          "job"
        ],
        "situationContextHi": "नया करियर"
      },
      {
        "id": "fut-prac-3",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह आज रात रिपोर्ट भेजेगी।",
        "expectedSentence": "She will send the report tonight.",
        "acceptedAlternatives": [
          "She will send the report tonight",
          "She'll send the report tonight."
        ],
        "chips": [
          "tonight",
          "the report",
          "send",
          "will",
          "She"
        ],
        "structureFormula": "She + will + send + the report + tonight",
        "explanationHi": "She + will + send + report + tonight (आज रात)।",
        "vocabularyFocus": [
          "she",
          "send",
          "tonight"
        ],
        "situationContextHi": "दफ्तर का काम"
      },
      {
        "id": "fut-prac-4",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वे अगले महीने जयपुर की यात्रा करेंगे।",
        "expectedSentence": "They will travel to Jaipur next month.",
        "acceptedAlternatives": [
          "They will travel to Jaipur next month",
          "They'll travel to Jaipur next month."
        ],
        "chips": [
          "next month",
          "to Jaipur",
          "travel",
          "will",
          "They"
        ],
        "structureFormula": "They + will + travel + to Jaipur + next month",
        "explanationHi": "They + will + travel + स्थान + समय।",
        "vocabularyFocus": [
          "they",
          "travel",
          "month"
        ],
        "situationContextHi": "छुट्टियों की यात्रा"
      },
      {
        "id": "fut-prac-5",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह हमें अंग्रेज़ी सिखाएगा।",
        "expectedSentence": "He will teach us English.",
        "acceptedAlternatives": [
          "He will teach us English",
          "He'll teach us English."
        ],
        "chips": [
          "English",
          "us",
          "teach",
          "will",
          "He"
        ],
        "structureFormula": "He + will + teach + us + English",
        "explanationHi": "He + will + teach (सिखाना) + us + English।",
        "vocabularyFocus": [
          "he",
          "teach",
          "English"
        ],
        "situationContextHi": "अंग्रेज़ी सीखना"
      },
      {
        "id": "fut-prac-6",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "मैं आपकी मदद नहीं भूलूँगा।",
        "expectedSentence": "I will not forget your help.",
        "acceptedAlternatives": [
          "I won't forget your help.",
          "I will not forget your help",
          "I won't forget your help"
        ],
        "chips": [
          "your help",
          "forget",
          "will not",
          "I"
        ],
        "structureFormula": "I + will not + forget + your help",
        "explanationHi": "I will not (won't) + forget + your help (आभार)।",
        "vocabularyFocus": [
          "forget",
          "help",
          "your"
        ],
        "situationContextHi": "कृतज्ञता और वादा"
      },
      {
        "id": "fut-prac-7",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "हम कल समारोह में शामिल नहीं होंगे।",
        "expectedSentence": "We will not attend the function tomorrow.",
        "acceptedAlternatives": [
          "We won't attend the function tomorrow.",
          "We will not attend the function tomorrow",
          "We won't attend the function tomorrow"
        ],
        "chips": [
          "tomorrow",
          "the function",
          "attend",
          "will not",
          "We"
        ],
        "structureFormula": "We + will not + attend + the function + tomorrow",
        "explanationHi": "We will not + attend (शामिल होना) + object।",
        "vocabularyFocus": [
          "we",
          "attend",
          "tomorrow"
        ],
        "situationContextHi": "कार्यक्रम में असमर्थता"
      },
      {
        "id": "fut-prac-8",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "वह रात में गाड़ी नहीं चलाएगा।",
        "expectedSentence": "He will not drive at night.",
        "acceptedAlternatives": [
          "He won't drive at night.",
          "He will not drive at night",
          "He won't drive at night"
        ],
        "chips": [
          "at night",
          "drive",
          "will not",
          "He"
        ],
        "structureFormula": "He + will not + drive + at night",
        "explanationHi": "He + will not + drive + at night।",
        "vocabularyFocus": [
          "he",
          "drive",
          "night"
        ],
        "situationContextHi": "सुरक्षा का नियम"
      },
      {
        "id": "fut-prac-9",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या तुम कल हमारे साथ क्रिकेट खेलोगे?",
        "expectedSentence": "Will you play cricket with us tomorrow?",
        "acceptedAlternatives": [
          "Will you play cricket with us tomorrow"
        ],
        "chips": [
          "tomorrow?",
          "with us",
          "cricket",
          "play",
          "you",
          "Will"
        ],
        "structureFormula": "Will you + play + cricket + with us + tomorrow?",
        "explanationHi": "Will you play cricket with us tomorrow? (आमंत्रण)",
        "vocabularyFocus": [
          "you",
          "play",
          "cricket",
          "tomorrow"
        ],
        "situationContextHi": "खेल के लिए बुलाना"
      },
      {
        "id": "fut-prac-10",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वह ऑनलाइन कक्षा में शामिल होगी?",
        "expectedSentence": "Will she join the online class?",
        "acceptedAlternatives": [
          "Will she join the online class"
        ],
        "chips": [
          "the online class?",
          "join",
          "she",
          "Will"
        ],
        "structureFormula": "Will + she + join + the online class?",
        "explanationHi": "Will + she + join + class? (शामिल होने की पुष्टि)",
        "vocabularyFocus": [
          "she",
          "join",
          "online"
        ],
        "situationContextHi": "ऑनलाइन पढ़ाई"
      },
      {
        "id": "fut-prac-11",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वे कल दुकान खोलेंगे?",
        "expectedSentence": "Will they open the shop tomorrow?",
        "acceptedAlternatives": [
          "Will they open the shop tomorrow"
        ],
        "chips": [
          "tomorrow?",
          "the shop",
          "open",
          "they",
          "Will"
        ],
        "structureFormula": "Will + they + open + the shop + tomorrow?",
        "explanationHi": "Will + they + open + shop + tomorrow?",
        "vocabularyFocus": [
          "they",
          "open",
          "shop",
          "tomorrow"
        ],
        "situationContextHi": "दुकान का समय"
      },
      {
        "id": "fut-chal-1",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "डॉक्टर दस मिनट में मरीज़ की जांच करेंगे।",
        "expectedSentence": "The doctor will check the patient in ten minutes.",
        "acceptedAlternatives": [
          "The doctor will check the patient in ten minutes",
          "The doctor will check the patient in 10 minutes."
        ],
        "chips": [
          "in ten minutes",
          "the patient",
          "check",
          "will",
          "The doctor"
        ],
        "structureFormula": "The doctor + will + check + the patient + in ten minutes",
        "explanationHi": "समय अवधि में: in ten minutes (दस मिनट में)।",
        "vocabularyFocus": [
          "doctor",
          "check",
          "time"
        ],
        "situationContextHi": "अस्पताल में जांच"
      },
      {
        "id": "fut-chal-2",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "आपके घर लौटने से पहले मैं रात का खाना तैयार कर लूँगा।",
        "expectedSentence": "I will prepare dinner before you return home.",
        "acceptedAlternatives": [
          "I will prepare dinner before you return home"
        ],
        "chips": [
          "return home",
          "before you",
          "dinner",
          "prepare",
          "will",
          "I"
        ],
        "structureFormula": "I will prepare dinner + before you return home",
        "explanationHi": "भविष्य का वादा: I will prepare dinner + time clause।",
        "vocabularyFocus": [
          "prepare",
          "dinner",
          "home"
        ],
        "situationContextHi": "रात का खाना तैयार करना"
      },
      {
        "id": "fut-chal-3",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हम इस परियोजना में निश्चित रूप से आपका समर्थन करेंगे।",
        "expectedSentence": "We will definitely support you in this project.",
        "acceptedAlternatives": [
          "We will definitely support you in this project"
        ],
        "chips": [
          "in this project",
          "support you",
          "definitely",
          "will",
          "We"
        ],
        "structureFormula": "We will definitely support you + in this project",
        "explanationHi": "Definitely (निश्चित रूप से) will और मुख्य क्रिया के बीच आता है।",
        "vocabularyFocus": [
          "we",
          "support",
          "project"
        ],
        "situationContextHi": "परियोजना में सहयोग"
      },
      {
        "id": "fut-chal-4",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "प्रबंधक यह छुट्टी का आवेदन स्वीकृत नहीं करेगा।",
        "expectedSentence": "The manager will not approve this leave application.",
        "acceptedAlternatives": [
          "The manager won't approve this leave application.",
          "The manager will not approve this leave application",
          "The manager won't approve this leave application"
        ],
        "chips": [
          "this leave application",
          "approve",
          "will not",
          "The manager"
        ],
        "structureFormula": "The manager + will not + approve + this leave application",
        "explanationHi": "The manager + will not + approve (स्वीकृत करना)।",
        "vocabularyFocus": [
          "manager",
          "leave"
        ],
        "situationContextHi": "कार्यालय में छुट्टी"
      },
      {
        "id": "fut-chal-5",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वे इस साल अपनी पुरानी कार नहीं बेचेंगे।",
        "expectedSentence": "They will not sell their old car this year.",
        "acceptedAlternatives": [
          "They won't sell their old car this year.",
          "They will not sell their old car this year",
          "They won't sell their old car this year"
        ],
        "chips": [
          "this year",
          "their old car",
          "sell",
          "will not",
          "They"
        ],
        "structureFormula": "They + will not + sell + their old car + this year",
        "explanationHi": "They will not + sell (बेचना) + object + time।",
        "vocabularyFocus": [
          "they",
          "sell",
          "car",
          "year"
        ],
        "situationContextHi": "कार बेचने का फैसला"
      },
      {
        "id": "fut-chal-6",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "मैं दोबारा वही गलती नहीं करूँगा।",
        "expectedSentence": "I will not make the same mistake again.",
        "acceptedAlternatives": [
          "I won't make the same mistake again.",
          "I will not make the same mistake again",
          "I won't make the same mistake again"
        ],
        "chips": [
          "again",
          "the same mistake",
          "make",
          "will not",
          "I"
        ],
        "structureFormula": "I + will not + make + the same mistake + again",
        "explanationHi": "गलती सुधारने का संकल्प: I will not make the same mistake again।",
        "vocabularyFocus": [
          "make",
          "mistake",
          "again"
        ],
        "situationContextHi": "सुधार का संकल्प"
      },
      {
        "id": "fut-chal-7",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "एक्सप्रेस ट्रेन प्लेटफॉर्म पर कब आएगी?",
        "expectedSentence": "When will the express train arrive at the platform?",
        "acceptedAlternatives": [
          "When will the express train arrive at the platform"
        ],
        "chips": [
          "at the platform?",
          "arrive",
          "the express train",
          "will",
          "When"
        ],
        "structureFormula": "When + will + the express train + arrive + at the platform?",
        "explanationHi": "When + will + Subject + arrive + place?",
        "vocabularyFocus": [
          "when",
          "train",
          "arrive"
        ],
        "situationContextHi": "ट्रेन का समय पूछना"
      },
      {
        "id": "fut-chal-8",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "कॉलेज के बाद आप क्या करेंगे?",
        "expectedSentence": "What will you do after college?",
        "acceptedAlternatives": [
          "What will you do after college"
        ],
        "chips": [
          "after college?",
          "do",
          "you",
          "will",
          "What"
        ],
        "structureFormula": "What + will + you + do + after college?",
        "explanationHi": "भविष्य की योजना पूछना: What will you do after college?",
        "vocabularyFocus": [
          "what",
          "do",
          "college"
        ],
        "situationContextHi": "करियर योजना पर चर्चा"
      },
      {
        "id": "fut-chal-9",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपका परिवार अगली गर्मियों में मुंबई जाएगा?",
        "expectedSentence": "Will your family visit Mumbai next summer?",
        "acceptedAlternatives": [
          "Will your family visit Mumbai next summer",
          "Will your family go to Mumbai next summer?"
        ],
        "chips": [
          "next summer?",
          "Mumbai",
          "visit",
          "your family",
          "Will"
        ],
        "structureFormula": "Will + your family + visit + Mumbai + next summer?",
        "explanationHi": "Will your family visit + स्थान + next summer?",
        "vocabularyFocus": [
          "family",
          "visit",
          "summer"
        ],
        "situationContextHi": "गर्मियों की छुट्टियाँ"
      },
      {
        "id": "fut-chal-10",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "हम इस गंभीर समस्या को कैसे हल करेंगे?",
        "expectedSentence": "How will we solve this serious problem?",
        "acceptedAlternatives": [
          "How will we solve this serious problem"
        ],
        "chips": [
          "this serious problem?",
          "solve",
          "we",
          "will",
          "How"
        ],
        "structureFormula": "How + will + we + solve + this serious problem?",
        "explanationHi": "How + will + we + solve (हल करना) + problem?",
        "vocabularyFocus": [
          "how",
          "solve",
          "problem"
        ],
        "situationContextHi": "समस्या का समाधान खोजना"
      },
      {
        "id": "fut-beg-12",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं तुम्हें कल फोन करूँगा।",
        "expectedSentence": "I will call you tomorrow.",
        "acceptedAlternatives": [
          "I will call you tomorrow",
          "I'll call you tomorrow."
        ],
        "chips": [
          "will",
          "call",
          "you",
          "tomorrow",
          "I",
          "called"
        ],
        "structureFormula": "I + will + V1 (call) + Object + tomorrow",
        "situationContextHi": "संपर्क करने का वादा",
        "explanationHi": "Future Simple में will के साथ क्रिया का मूल रूप (V1: call) आता है।",
        "vocabularyFocus": [
          "call",
          "tomorrow"
        ]
      },
      {
        "id": "fut-beg-13",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह एक साइकिल खरीदेगी।",
        "expectedSentence": "She will buy a bicycle.",
        "acceptedAlternatives": [
          "She will buy a bicycle",
          "She'll buy a bicycle."
        ],
        "chips": [
          "will",
          "buy",
          "a",
          "bicycle",
          "She",
          "buys"
        ],
        "structureFormula": "She + will + V1 (buy) + Object",
        "situationContextHi": "खरीदारी का इरादा",
        "explanationHi": "Will के बाद V1 \"buy\" आता है।",
        "vocabularyFocus": [
          "buy",
          "bicycle"
        ]
      },
      {
        "id": "fut-beg-14",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हम यह मैच जीतेंगे।",
        "expectedSentence": "We will win this match.",
        "acceptedAlternatives": [
          "We will win this match",
          "We'll win this match."
        ],
        "chips": [
          "will",
          "win",
          "this",
          "match",
          "We",
          "won"
        ],
        "structureFormula": "We + will + V1 (win) + this match",
        "situationContextHi": "खेल और जीत का विश्वास",
        "explanationHi": "Will के साथ क्रिया का मूल रूप \"win\" आता है।",
        "vocabularyFocus": [
          "win",
          "match"
        ]
      },
      {
        "id": "fut-beg-15",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह झूठ नहीं बोलेगा।",
        "expectedSentence": "He will not tell a lie.",
        "acceptedAlternatives": [
          "He won't tell a lie.",
          "He will not tell a lie"
        ],
        "chips": [
          "will",
          "not",
          "tell",
          "a",
          "lie",
          "He",
          "told"
        ],
        "structureFormula": "He + will not + V1 (tell) + a lie",
        "situationContextHi": "सच्चाई का भरोसा",
        "explanationHi": "Will not (या won't) के साथ V1 \"tell\" आता है।",
        "vocabularyFocus": [
          "tell",
          "lie"
        ]
      },
      {
        "id": "fut-beg-16",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम मेरे साथ आओगे?",
        "expectedSentence": "Will you come with me?",
        "acceptedAlternatives": [
          "Will you come with me",
          "Will you come with me?"
        ],
        "chips": [
          "Will",
          "you",
          "come",
          "with",
          "me",
          "Do"
        ],
        "structureFormula": "Will + you + V1 (come) + with me?",
        "situationContextHi": "साथ चलने का निमंत्रण",
        "explanationHi": "भविष्य के प्रश्न में \"Will\" सबसे आगे आता है।",
        "vocabularyFocus": [
          "come",
          "with"
        ]
      },
      {
        "id": "fut-beg-17",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे जल्द ही पहुंचेंगे।",
        "expectedSentence": "They will arrive soon.",
        "acceptedAlternatives": [
          "They will arrive soon",
          "They'll arrive soon."
        ],
        "chips": [
          "will",
          "arrive",
          "soon",
          "They",
          "arrives"
        ],
        "structureFormula": "They + will + V1 (arrive) + soon",
        "situationContextHi": "पहुंचने की सूचना",
        "explanationHi": "Arrive का अर्थ पहुंचना है, will के बाद मूल रूप V1 आता है।",
        "vocabularyFocus": [
          "arrive",
          "soon"
        ]
      },
      {
        "id": "fut-beg-18",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं अपने भाई की मदद करूँगा।",
        "expectedSentence": "I will help my brother.",
        "acceptedAlternatives": [
          "I will help my brother",
          "I'll help my brother."
        ],
        "chips": [
          "will",
          "help",
          "my",
          "brother",
          "I",
          "helped"
        ],
        "structureFormula": "I + will + V1 (help) + Object",
        "situationContextHi": "मदद करने का इरादा",
        "explanationHi": "Will + V1 (help) भविष्य में मदद का संकेत देता है।",
        "vocabularyFocus": [
          "help",
          "brother"
        ]
      },
      {
        "id": "fut-beg-19",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वह गाना गाएगी?",
        "expectedSentence": "Will she sing a song?",
        "acceptedAlternatives": [
          "Will she sing a song",
          "Will she sing a song?"
        ],
        "chips": [
          "Will",
          "she",
          "sing",
          "a",
          "song",
          "Does"
        ],
        "structureFormula": "Will + she + V1 (sing) + Object?",
        "situationContextHi": "गाने के बारे में पूछना",
        "explanationHi": "प्रश्न में Will + Subject + V1 आता है।",
        "vocabularyFocus": [
          "sing",
          "song"
        ]
      },
      {
        "id": "fut-beg-20",
        "tenseKey": "future_simple",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "हम इसे नहीं भूलेंगे।",
        "expectedSentence": "We will not forget this.",
        "acceptedAlternatives": [
          "We won't forget this.",
          "We will not forget this"
        ],
        "chips": [
          "will",
          "not",
          "forget",
          "this",
          "We",
          "forgot"
        ],
        "structureFormula": "We + will not + V1 (forget) + this",
        "situationContextHi": "याद रखने का वादा",
        "explanationHi": "Will not के साथ मूल रूप \"forget\" आता है।",
        "vocabularyFocus": [
          "forget",
          "this"
        ]
      },
      {
        "id": "fut-prac-12",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "डॉक्टर सुबह मरीजों की जांच करेंगे।",
        "expectedSentence": "The doctor will examine the patients in the morning.",
        "acceptedAlternatives": [
          "The doctor will examine the patients in the morning"
        ],
        "chips": [
          "The",
          "doctor",
          "will",
          "examine",
          "the",
          "patients",
          "in",
          "the",
          "morning"
        ],
        "structureFormula": "Subject + will + V1 (examine) + Object + Time phrase",
        "situationContextHi": "चिकित्सीय दिनचर्या",
        "explanationHi": "Will के साथ क्रिया का मूल रूप \"examine\" आता है।",
        "vocabularyFocus": [
          "doctor",
          "examine",
          "patients",
          "morning"
        ]
      },
      {
        "id": "fut-prac-13",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह प्रबंधक को समय बदलने के बारे में सूचित करेगी।",
        "expectedSentence": "She will inform the manager about the schedule change.",
        "acceptedAlternatives": [
          "She will inform the manager about the schedule change"
        ],
        "chips": [
          "She",
          "will",
          "inform",
          "the",
          "manager",
          "about",
          "the",
          "schedule",
          "change"
        ],
        "structureFormula": "She + will + V1 (inform) + Object + about phrase",
        "situationContextHi": "कार्यालय की सूचना",
        "explanationHi": "Will के बाद V1 \"inform\" आता है।",
        "vocabularyFocus": [
          "inform",
          "manager",
          "schedule"
        ]
      },
      {
        "id": "fut-prac-14",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपके माता-पिता आपके दीक्षांत समारोह में शामिल होंगे?",
        "expectedSentence": "Will your parents attend your graduation ceremony?",
        "acceptedAlternatives": [
          "Will your parents attend your graduation ceremony",
          "Will your parents attend your graduation ceremony?"
        ],
        "chips": [
          "Will",
          "your",
          "parents",
          "attend",
          "your",
          "graduation",
          "ceremony"
        ],
        "structureFormula": "Will + Subject + V1 (attend) + Object?",
        "situationContextHi": "पारिवारिक कार्यक्रम",
        "explanationHi": "भविष्य के प्रश्न में Will पहले आता है और क्रिया attend V1 रहती है।",
        "vocabularyFocus": [
          "parents",
          "attend",
          "graduation"
        ]
      },
      {
        "id": "fut-prac-15",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हम अगले सप्ताहांत एक वृक्षारोपण अभियान का आयोजन करेंगे।",
        "expectedSentence": "We will organize a tree plantation drive next weekend.",
        "acceptedAlternatives": [
          "We will organize a tree plantation drive next weekend"
        ],
        "chips": [
          "We",
          "will",
          "organize",
          "a",
          "tree",
          "plantation",
          "drive",
          "next",
          "weekend"
        ],
        "structureFormula": "We + will + V1 (organize) + Object + next weekend",
        "situationContextHi": "पर्यावरण गतिविधि",
        "explanationHi": "Will के साथ V1 \"organize\" आता है।",
        "vocabularyFocus": [
          "organize",
          "plantation",
          "weekend"
        ]
      },
      {
        "id": "fut-prac-16",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "चोट के कारण वह टूर्नामेंट में भाग नहीं लेगा।",
        "expectedSentence": "He will not participate in the tournament due to injury.",
        "acceptedAlternatives": [
          "He won't participate in the tournament due to injury.",
          "He will not participate in the tournament due to injury"
        ],
        "chips": [
          "He",
          "will",
          "not",
          "participate",
          "in",
          "the",
          "tournament",
          "due",
          "to",
          "injury"
        ],
        "structureFormula": "Subject + will not + V1 + in tournament + due to injury",
        "situationContextHi": "खेल और चोट",
        "explanationHi": "Will not के बाद मूल क्रिया \"participate\" आती है।",
        "vocabularyFocus": [
          "participate",
          "tournament",
          "injury"
        ]
      },
      {
        "id": "fut-prac-17",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "ट्रेन शीघ्र ही प्लेटफॉर्म नंबर तीन पर पहुंचेगी।",
        "expectedSentence": "The train will arrive at platform three shortly.",
        "acceptedAlternatives": [
          "The train will arrive at platform three shortly",
          "The train will arrive at platform 3 shortly."
        ],
        "chips": [
          "The",
          "train",
          "will",
          "arrive",
          "at",
          "platform",
          "three",
          "shortly"
        ],
        "structureFormula": "Subject + will + V1 (arrive) + at platform + shortly",
        "situationContextHi": "रेलवे घोषणा",
        "explanationHi": "Will arrive से भविष्य की निकट घटना बताई जाती है।",
        "vocabularyFocus": [
          "train",
          "arrive",
          "platform",
          "shortly"
        ]
      },
      {
        "id": "fut-prac-18",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वे हमारे पड़ोस में एक नई दुकान खोलेंगे।",
        "expectedSentence": "They will open a new shop in our neighborhood.",
        "acceptedAlternatives": [
          "They will open a new shop in our neighborhood"
        ],
        "chips": [
          "They",
          "will",
          "open",
          "a",
          "new",
          "shop",
          "in",
          "our",
          "neighborhood"
        ],
        "structureFormula": "They + will + V1 (open) + Object + in neighborhood",
        "situationContextHi": "व्यापार और पड़ोस",
        "explanationHi": "Will open से भविष्य की योजना व्यक्त होती है।",
        "vocabularyFocus": [
          "open",
          "shop",
          "neighborhood"
        ]
      },
      {
        "id": "fut-prac-19",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आप शुक्रवार से पहले परियोजना रिपोर्ट जमा करेंगे?",
        "expectedSentence": "Will you submit the project report before Friday?",
        "acceptedAlternatives": [
          "Will you submit the project report before Friday",
          "Will you submit the project report before Friday?"
        ],
        "chips": [
          "Will",
          "you",
          "submit",
          "the",
          "project",
          "report",
          "before",
          "Friday"
        ],
        "structureFormula": "Will + you + V1 (submit) + Object + before Friday?",
        "situationContextHi": "कार्य की समय सीमा",
        "explanationHi": "Will के साथ V1 \"submit\" आता है।",
        "vocabularyFocus": [
          "submit",
          "project",
          "report",
          "Friday"
        ]
      },
      {
        "id": "fut-prac-20",
        "tenseKey": "future_simple",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं आपको आज ईमेल के माध्यम से लिंक भेजूंगा।",
        "expectedSentence": "I will send you the link by email today.",
        "acceptedAlternatives": [
          "I will send you the link by email today",
          "I'll send you the link by email today."
        ],
        "chips": [
          "I",
          "will",
          "send",
          "you",
          "the",
          "link",
          "by",
          "email",
          "today"
        ],
        "structureFormula": "I + will + V1 (send) + you + link + by email + today",
        "situationContextHi": "डिजिटल संचार",
        "explanationHi": "Will send भविष्य की सामान्य क्रिया है।",
        "vocabularyFocus": [
          "send",
          "link",
          "email",
          "today"
        ]
      },
      {
        "id": "fut-chal-11",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "यदि मौसम अनुकूल रहा, तो निर्माण दल समय से पहले पुल पूरा कर लेगा।",
        "expectedSentence": "The construction team will complete the bridge ahead of schedule if weather permits.",
        "acceptedAlternatives": [
          "The construction team will complete the bridge ahead of schedule if weather permits"
        ],
        "chips": [
          "The",
          "construction",
          "team",
          "will",
          "complete",
          "the",
          "bridge",
          "ahead",
          "of",
          "schedule",
          "if",
          "weather",
          "permits"
        ],
        "structureFormula": "Subject + will + V1 (complete) + Object + condition clause",
        "situationContextHi": "शहरी विकास और निर्माण",
        "explanationHi": "Main clause में will + complete आता है और if clause में Present Simple आता है।",
        "vocabularyFocus": [
          "construction",
          "complete",
          "bridge",
          "schedule"
        ]
      },
      {
        "id": "fut-chal-12",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आर्टिफिशियल इंटेलिजेंस अगले दशक में स्वास्थ्य सेवाओं को कैसे बदलेगा?",
        "expectedSentence": "How will artificial intelligence reshape healthcare over the next decade?",
        "acceptedAlternatives": [
          "How will artificial intelligence reshape healthcare over the next decade",
          "How will artificial intelligence reshape healthcare over the next decade?"
        ],
        "chips": [
          "How",
          "will",
          "artificial",
          "intelligence",
          "reshape",
          "healthcare",
          "over",
          "the",
          "next",
          "decade"
        ],
        "structureFormula": "How + will + Subject + V1 (reshape) + Object + Time phrase?",
        "situationContextHi": "भविष्य की तकनीक",
        "explanationHi": "How will के बाद subject और V1 \"reshape\" आता है।",
        "vocabularyFocus": [
          "artificial",
          "intelligence",
          "reshape",
          "healthcare"
        ]
      },
      {
        "id": "fut-chal-13",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "नगर निगम सभी आवासीय क्षेत्रों में स्मार्ट अपशिष्ट प्रणाली लागू करेगा।",
        "expectedSentence": "The municipality will implement smart waste management across all areas.",
        "acceptedAlternatives": [
          "The municipality will implement smart waste management across all areas"
        ],
        "chips": [
          "The",
          "municipality",
          "will",
          "implement",
          "smart",
          "waste",
          "management",
          "across",
          "all",
          "areas"
        ],
        "structureFormula": "Subject + will + V1 (implement) + Object + across phrase",
        "situationContextHi": "स्मार्ट सिटी योजना",
        "explanationHi": "Will implement से भविष्य का आधिकारिक निर्णय दिखता है।",
        "vocabularyFocus": [
          "municipality",
          "implement",
          "waste",
          "management"
        ]
      },
      {
        "id": "fut-chal-14",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वह कानूनी सलाह के बिना समझौते पर हस्ताक्षर नहीं करेगी।",
        "expectedSentence": "She will not sign the agreement without legal advice.",
        "acceptedAlternatives": [
          "She won't sign the agreement without legal advice.",
          "She will not sign the agreement without legal advice"
        ],
        "chips": [
          "She",
          "will",
          "not",
          "sign",
          "the",
          "agreement",
          "without",
          "legal",
          "advice"
        ],
        "structureFormula": "She + will not + V1 (sign) + Object + without phrase",
        "situationContextHi": "कानूनी सावधानी",
        "explanationHi": "Will not के साथ V1 \"sign\" आता है।",
        "vocabularyFocus": [
          "sign",
          "agreement",
          "legal",
          "advice"
        ]
      },
      {
        "id": "fut-chal-15",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या यह व्यापार वार्ता दोनों देशों के विवादों को सुलझाएगी?",
        "expectedSentence": "Will these trade talks resolve the disputes between both countries?",
        "acceptedAlternatives": [
          "Will these trade talks resolve the disputes between both countries",
          "Will these trade talks resolve the disputes between both countries?"
        ],
        "chips": [
          "Will",
          "these",
          "trade",
          "talks",
          "resolve",
          "the",
          "disputes",
          "between",
          "both",
          "countries"
        ],
        "structureFormula": "Will + Plural Subject + V1 (resolve) + Object + between phrase?",
        "situationContextHi": "अंतरराष्ट्रीय संबंध",
        "explanationHi": "Will के साथ क्रिया का पहला रूप \"resolve\" आता है।",
        "vocabularyFocus": [
          "trade",
          "resolve",
          "disputes",
          "countries"
        ]
      },
      {
        "id": "fut-chal-16",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हमारी शोध टीम अगले महीने नवीकरणीय ऊर्जा पर एक पत्र प्रकाशित करेगी।",
        "expectedSentence": "Our research team will publish a paper on renewable energy next month.",
        "acceptedAlternatives": [
          "Our research team will publish a paper on renewable energy next month"
        ],
        "chips": [
          "Our",
          "research",
          "team",
          "will",
          "publish",
          "a",
          "paper",
          "on",
          "renewable",
          "energy",
          "next",
          "month"
        ],
        "structureFormula": "Subject + will + V1 (publish) + Object + next month",
        "situationContextHi": "वैज्ञानिक शोध",
        "explanationHi": "Will publish भविष्य के प्रकाशन को दर्शाता है।",
        "vocabularyFocus": [
          "research",
          "publish",
          "renewable",
          "energy"
        ]
      },
      {
        "id": "fut-chal-17",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "कंपनी इस अवधि के दौरान नए विज्ञापनों में निवेश नहीं करेगी।",
        "expectedSentence": "The company will not invest in new advertisements during this period.",
        "acceptedAlternatives": [
          "The company won't invest in new advertisements during this period.",
          "The company will not invest in new advertisements during this period"
        ],
        "chips": [
          "The",
          "company",
          "will",
          "not",
          "invest",
          "in",
          "new",
          "advertisements",
          "during",
          "this",
          "period"
        ],
        "structureFormula": "Subject + will not + V1 (invest) + in phrase + during period",
        "situationContextHi": "व्यावसायिक बजट",
        "explanationHi": "Will not के साथ V1 \"invest\" आता है।",
        "vocabularyFocus": [
          "invest",
          "advertisements",
          "period"
        ]
      },
      {
        "id": "fut-chal-18",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "छात्र इस इंटर्नशिप कार्यक्रम के माध्यम से व्यावहारिक अनुभव प्राप्त करेंगे।",
        "expectedSentence": "Students will gain practical experience through this internship program.",
        "acceptedAlternatives": [
          "Students will gain practical experience through this internship program"
        ],
        "chips": [
          "Students",
          "will",
          "gain",
          "practical",
          "experience",
          "through",
          "this",
          "internship",
          "program"
        ],
        "structureFormula": "Subject + will + V1 (gain) + Object + through phrase",
        "situationContextHi": "कौशल विकास",
        "explanationHi": "Will के साथ क्रिया का मूल रूप \"gain\" आता है।",
        "vocabularyFocus": [
          "gain",
          "practical",
          "experience",
          "internship"
        ]
      },
      {
        "id": "fut-chal-19",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "उड्डयन प्राधिकरण उड़ान सुरक्षा बढ़ाने के लिए नए रडार लगाएगा।",
        "expectedSentence": "The aviation authority will install modern radars to improve flight safety.",
        "acceptedAlternatives": [
          "The aviation authority will install modern radars to improve flight safety"
        ],
        "chips": [
          "The",
          "aviation",
          "authority",
          "will",
          "install",
          "modern",
          "radars",
          "to",
          "improve",
          "flight",
          "safety"
        ],
        "structureFormula": "Subject + will + V1 (install) + Object + Infinitive",
        "situationContextHi": "हवाई सुरक्षा",
        "explanationHi": "Will install भविष्य का तकनीकी सुधार बताता है।",
        "vocabularyFocus": [
          "aviation",
          "install",
          "safety",
          "flight"
        ]
      },
      {
        "id": "fut-chal-20",
        "tenseKey": "future_simple",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "अर्थशास्त्री क्या भविष्यवाणी करते हैं कि बाजार कब स्थिर होगा?",
        "expectedSentence": "When will the market stabilize according to financial analysts?",
        "acceptedAlternatives": [
          "When will the market stabilize according to financial analysts",
          "When will the market stabilize according to financial analysts?"
        ],
        "chips": [
          "When",
          "will",
          "the",
          "market",
          "stabilize",
          "according",
          "to",
          "financial",
          "analysts"
        ],
        "structureFormula": "When + will + Subject + V1 (stabilize) + according to phrase?",
        "situationContextHi": "आर्थिक परिदृश्य",
        "explanationHi": "When will के साथ V1 \"stabilize\" आता है।",
        "vocabularyFocus": [
          "market",
          "stabilize",
          "financial",
          "analysts"
        ]
      }
    ]
  },
  "present_continuous": {
    "key": "present_continuous",
    "englishTitle": "Present Continuous",
    "hindiTitle": "अपूर्ण वर्तमान काल",
    "shortTag": "4. Present Continuous",
    "colorScheme": {
      "badge": "bg-purple-950 text-purple-300 border-purple-800",
      "border": "border-purple-600/40",
      "bg": "bg-purple-950/20",
      "activeTab": "bg-purple-600 text-white ring-2 ring-purple-400 shadow-lg shadow-purple-950/50",
      "text": "text-purple-400",
      "ring": "ring-purple-500"
    },
    "identificationHi": "वाक्य के अंत में \"रहा हूँ, रही हूँ, रहे हैं, रहा है\" आता है।",
    "whenToUseHi": "जो काम इस समय (अभी) आपकी आँखों के सामने चल रहा है (Happening right now)।",
    "coreExampleEn": "I am playing cricket now.",
    "coreExampleHi": "मैं अभी क्रिकेट खेल रहा/रही हूँ।",
    "structure": {
      "positive": "Subject + is / am / are + Verb-ing + Object",
      "negative": "Subject + is / am / are + not + Verb-ing + Object",
      "question": "Is / Am / Are + Subject + Verb-ing + Object?"
    },
    "exercises": [
      {
        "id": "pc-beg-1",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं अभी क्रिकेट खेल रहा हूँ।",
        "expectedSentence": "I am playing cricket now.",
        "acceptedAlternatives": [
          "I am playing cricket now",
          "I'm playing cricket now.",
          "I'm playing cricket now"
        ],
        "chips": [
          "now",
          "cricket",
          "playing",
          "am",
          "I"
        ],
        "structureFormula": "I + am + playing (Verb-ing) + cricket + now",
        "explanationHi": "\"I\" के साथ हमेशा \"am\" आता है, और Verb में \"-ing\" (play → playing) जुड़ता है।",
        "vocabularyFocus": [
          "play",
          "cricket",
          "now"
        ],
        "situationContextHi": "मैदान पर खेल"
      },
      {
        "id": "pc-beg-2",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह एक किताब पढ़ रही है।",
        "expectedSentence": "She is reading a book.",
        "acceptedAlternatives": [
          "She is reading a book",
          "She's reading a book."
        ],
        "chips": [
          "a book",
          "reading",
          "is",
          "She"
        ],
        "structureFormula": "She + is + reading + a book",
        "explanationHi": "She/He/It के साथ \"is\" और Verb-ing आता है।",
        "vocabularyFocus": [
          "she",
          "read",
          "book"
        ],
        "situationContextHi": "किताब पढ़ना"
      },
      {
        "id": "pc-beg-3",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हम अंग्रेज़ी सीख रहे हैं।",
        "expectedSentence": "We are learning English.",
        "acceptedAlternatives": [
          "We are learning English",
          "We're learning English."
        ],
        "chips": [
          "English",
          "learning",
          "are",
          "We"
        ],
        "structureFormula": "We + are + learning + English",
        "explanationHi": "We/You/They के साथ \"are\" आता है: We are learning।",
        "vocabularyFocus": [
          "we",
          "learn",
          "English"
        ],
        "situationContextHi": "अंग्रेज़ी सीखना"
      },
      {
        "id": "pc-beg-4",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह दोपहर का खाना खा रहा है।",
        "expectedSentence": "He is eating lunch.",
        "acceptedAlternatives": [
          "He is eating lunch",
          "He's eating lunch."
        ],
        "chips": [
          "lunch",
          "eating",
          "is",
          "He"
        ],
        "structureFormula": "He + is + eating + lunch",
        "explanationHi": "He is eating lunch (वर्तमान में भोजन)।",
        "vocabularyFocus": [
          "he",
          "eat",
          "lunch"
        ],
        "situationContextHi": "दोपहर का भोजन"
      },
      {
        "id": "pc-beg-5",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे तेज़ दौड़ रहे हैं।",
        "expectedSentence": "They are running fast.",
        "acceptedAlternatives": [
          "They are running fast",
          "They're running fast."
        ],
        "chips": [
          "fast",
          "running",
          "are",
          "They"
        ],
        "structureFormula": "They + are + running + fast",
        "explanationHi": "They + are + running (run → running)।",
        "vocabularyFocus": [
          "they",
          "run",
          "fast"
        ],
        "situationContextHi": "दौड़ना"
      },
      {
        "id": "pc-beg-6",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "बाहर बारिश हो रही है।",
        "expectedSentence": "It is raining outside.",
        "acceptedAlternatives": [
          "It is raining outside",
          "It's raining outside."
        ],
        "chips": [
          "outside",
          "raining",
          "is",
          "It"
        ],
        "structureFormula": "It + is + raining + outside",
        "explanationHi": "बारिश के लिए \"It is raining\" का प्रयोग होता है।",
        "vocabularyFocus": [
          "rain",
          "outside"
        ],
        "situationContextHi": "मौसम की स्थिति"
      },
      {
        "id": "pc-beg-7",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "माँ खाना बना रही हैं।",
        "expectedSentence": "Mother is cooking food.",
        "acceptedAlternatives": [
          "Mother is cooking food",
          "Mom is cooking food."
        ],
        "chips": [
          "food",
          "cooking",
          "is",
          "Mother"
        ],
        "structureFormula": "Mother + is + cooking + food",
        "explanationHi": "Mother (एकवचन) + is + cooking।",
        "vocabularyFocus": [
          "cook",
          "food"
        ],
        "situationContextHi": "रसोई में खाना"
      },
      {
        "id": "pc-beg-8",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "मैं सो नहीं रहा हूँ।",
        "expectedSentence": "I am not sleeping.",
        "acceptedAlternatives": [
          "I'm not sleeping.",
          "I am not sleeping",
          "I'm not sleeping"
        ],
        "chips": [
          "sleeping",
          "not",
          "am",
          "I"
        ],
        "structureFormula": "I + am + not + sleeping",
        "explanationHi": "I am not + Verb-ing (नकारात्मक रूप)।",
        "vocabularyFocus": [
          "sleep",
          "not"
        ],
        "situationContextHi": "जागते रहना"
      },
      {
        "id": "pc-beg-9",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह नहीं रो रहा है।",
        "expectedSentence": "He is not crying.",
        "acceptedAlternatives": [
          "He isn't crying.",
          "He is not crying",
          "He isn't crying"
        ],
        "chips": [
          "crying",
          "not",
          "is",
          "He"
        ],
        "structureFormula": "He + is + not + crying",
        "explanationHi": "He + is + not + crying (cry-ing)।",
        "vocabularyFocus": [
          "he",
          "cry"
        ],
        "situationContextHi": "सकारात्मक स्थिति"
      },
      {
        "id": "pc-beg-10",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम सुन रहे हो?",
        "expectedSentence": "Are you listening?",
        "acceptedAlternatives": [
          "Are you listening"
        ],
        "chips": [
          "listening?",
          "you",
          "Are"
        ],
        "structureFormula": "Are + you + listening?",
        "explanationHi": "You के साथ प्रश्न \"Are\" से शुरू होता है: Are + you + Verb-ing?",
        "vocabularyFocus": [
          "you",
          "listen"
        ],
        "situationContextHi": "ध्यान आकर्षित करना"
      },
      {
        "id": "pc-beg-11",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वह आ रही है?",
        "expectedSentence": "Is she coming?",
        "acceptedAlternatives": [
          "Is she coming"
        ],
        "chips": [
          "coming?",
          "she",
          "Is"
        ],
        "structureFormula": "Is + she + coming?",
        "explanationHi": "She के साथ प्रश्न \"Is\" से शुरू होता है: Is + she + coming?",
        "vocabularyFocus": [
          "she",
          "come"
        ],
        "situationContextHi": "आगमन की पूछताछ"
      },
      {
        "id": "pc-prac-1",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "बच्चे बगीचे में खेल रहे हैं।",
        "expectedSentence": "The children are playing in the garden.",
        "acceptedAlternatives": [
          "The children are playing in the garden"
        ],
        "chips": [
          "in the garden",
          "playing",
          "are",
          "The children"
        ],
        "structureFormula": "The children + are + playing + in the garden",
        "explanationHi": "The children बहुवचन है, इसलिए \"are + playing\" आता है।",
        "vocabularyFocus": [
          "children",
          "play",
          "garden"
        ],
        "situationContextHi": "बगीचे में बच्चे"
      },
      {
        "id": "pc-prac-2",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं अभी एक महत्वपूर्ण ईमेल लिख रहा हूँ।",
        "expectedSentence": "I am writing an important email right now.",
        "acceptedAlternatives": [
          "I am writing an important email right now",
          "I'm writing an important email right now."
        ],
        "chips": [
          "right now",
          "an important email",
          "writing",
          "am",
          "I"
        ],
        "structureFormula": "I + am + writing + an important email + right now",
        "explanationHi": "I am writing + object + right now (ठीक अभी)।",
        "vocabularyFocus": [
          "write",
          "email",
          "important",
          "now"
        ],
        "situationContextHi": "दफ्तर का ईमेल"
      },
      {
        "id": "pc-prac-3",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह अपने हाथ ठीक से धो रहा है।",
        "expectedSentence": "He is washing his hands properly.",
        "acceptedAlternatives": [
          "He is washing his hands properly"
        ],
        "chips": [
          "properly",
          "his hands",
          "washing",
          "is",
          "He"
        ],
        "structureFormula": "He + is + washing + his hands + properly",
        "explanationHi": "He + is + washing + hands + properly (ठीक से)।",
        "vocabularyFocus": [
          "he",
          "wash",
          "hands"
        ],
        "situationContextHi": "सफाई और स्वच्छता"
      },
      {
        "id": "pc-prac-4",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हम एक साथ क्रिकेट मैच देख रहे हैं।",
        "expectedSentence": "We are watching the cricket match together.",
        "acceptedAlternatives": [
          "We are watching the cricket match together",
          "We're watching the cricket match together."
        ],
        "chips": [
          "together",
          "the cricket match",
          "watching",
          "are",
          "We"
        ],
        "structureFormula": "We + are + watching + the cricket match + together",
        "explanationHi": "We are watching + match + together (एक साथ)।",
        "vocabularyFocus": [
          "we",
          "watch",
          "cricket",
          "match"
        ],
        "situationContextHi": "मैच का आनंद"
      },
      {
        "id": "pc-prac-5",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह फोन पर बात कर रही है।",
        "expectedSentence": "She is talking on the phone.",
        "acceptedAlternatives": [
          "She is talking on the phone",
          "She's talking on the phone."
        ],
        "chips": [
          "on the phone",
          "talking",
          "is",
          "She"
        ],
        "structureFormula": "She + is + talking + on the phone",
        "explanationHi": "She + is + talking + on the phone।",
        "vocabularyFocus": [
          "she",
          "talk",
          "phone"
        ],
        "situationContextHi": "फोन कॉल"
      },
      {
        "id": "pc-prac-6",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "मैं अभी टेलीविज़न नहीं देख रहा हूँ।",
        "expectedSentence": "I am not watching television right now.",
        "acceptedAlternatives": [
          "I am not watching television right now",
          "I'm not watching television right now.",
          "I am not watching TV right now."
        ],
        "chips": [
          "right now",
          "television",
          "watching",
          "not",
          "am",
          "I"
        ],
        "structureFormula": "I + am + not + watching + television + right now",
        "explanationHi": "I am not + watching + TV + right now।",
        "vocabularyFocus": [
          "watch",
          "not",
          "now"
        ],
        "situationContextHi": "टीवी न देखना"
      },
      {
        "id": "pc-prac-7",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "वे कोई शोर नहीं मचा रहे हैं।",
        "expectedSentence": "They are not making any noise.",
        "acceptedAlternatives": [
          "They aren't making any noise.",
          "They are not making any noise",
          "They aren't making any noise"
        ],
        "chips": [
          "any noise",
          "making",
          "not",
          "are",
          "They"
        ],
        "structureFormula": "They + are + not + making + any noise",
        "explanationHi": "शोर मचाना = make noise। They are not making any noise।",
        "vocabularyFocus": [
          "they",
          "make",
          "noise"
        ],
        "situationContextHi": "शांति बनाए रखना"
      },
      {
        "id": "pc-prac-8",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "वह आज अपनी कार नहीं चला रहा है।",
        "expectedSentence": "He is not driving his car today.",
        "acceptedAlternatives": [
          "He isn't driving his car today.",
          "He is not driving his car today",
          "He isn't driving his car today"
        ],
        "chips": [
          "today",
          "his car",
          "driving",
          "not",
          "is",
          "He"
        ],
        "structureFormula": "He + is + not + driving + his car + today",
        "explanationHi": "He + is not + driving + car + today।",
        "vocabularyFocus": [
          "he",
          "drive",
          "car",
          "today"
        ],
        "situationContextHi": "यात्रा का तरीका"
      },
      {
        "id": "pc-prac-9",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आप सुबह की बस का इंतज़ार कर रहे हैं?",
        "expectedSentence": "Are you waiting for the morning bus?",
        "acceptedAlternatives": [
          "Are you waiting for the morning bus"
        ],
        "chips": [
          "the morning bus?",
          "waiting for",
          "you",
          "Are"
        ],
        "structureFormula": "Are + you + waiting for + the morning bus?",
        "explanationHi": "इंतज़ार करना = wait for। Are you waiting for...?",
        "vocabularyFocus": [
          "you",
          "wait",
          "bus",
          "morning"
        ],
        "situationContextHi": "बस स्टॉप पर पूछताछ"
      },
      {
        "id": "pc-prac-10",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपकी बहन परीक्षा के लिए पढ़ रही है?",
        "expectedSentence": "Is your sister studying for the exam?",
        "acceptedAlternatives": [
          "Is your sister studying for the exam"
        ],
        "chips": [
          "for the exam?",
          "studying",
          "your sister",
          "Is"
        ],
        "structureFormula": "Is + your sister + studying + for the exam?",
        "explanationHi": "Your sister (एकवचन) के लिए \"Is\" से सवाल शुरू होगा।",
        "vocabularyFocus": [
          "sister",
          "study",
          "exam"
        ],
        "situationContextHi": "परीक्षा की तैयारी"
      },
      {
        "id": "pc-prac-11",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वे नए दफ्तर में काम कर रहे हैं?",
        "expectedSentence": "Are they working in the new office?",
        "acceptedAlternatives": [
          "Are they working in the new office"
        ],
        "chips": [
          "in the new office?",
          "working",
          "they",
          "Are"
        ],
        "structureFormula": "Are + they + working + in the new office?",
        "explanationHi": "Are + they + working (काम कर रहे हैं) + स्थान?",
        "vocabularyFocus": [
          "they",
          "work",
          "new",
          "office"
        ],
        "situationContextHi": "कार्यस्थल की पूछताछ"
      },
      {
        "id": "pc-chal-1",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "मज़दूर हमारे घर के पास सड़क की मरम्मत कर रहे हैं।",
        "expectedSentence": "The workers are repairing the road near our house.",
        "acceptedAlternatives": [
          "The workers are repairing the road near our house"
        ],
        "chips": [
          "near our house",
          "the road",
          "repairing",
          "are",
          "The workers"
        ],
        "structureFormula": "The workers + are + repairing + the road + near our house",
        "explanationHi": "The workers बहुवचन है, इसलिए \"are repairing\" आता है।",
        "vocabularyFocus": [
          "repair",
          "road",
          "house"
        ],
        "situationContextHi": "सड़क निर्माण कार्य"
      },
      {
        "id": "pc-chal-2",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह अपनी प्रवेश परीक्षा के लिए कड़ी तैयारी कर रहा है।",
        "expectedSentence": "He is preparing hard for his entrance examination.",
        "acceptedAlternatives": [
          "He is preparing hard for his entrance examination",
          "He is preparing hard for his entrance exam."
        ],
        "chips": [
          "entrance examination",
          "for his",
          "hard",
          "preparing",
          "is",
          "He"
        ],
        "structureFormula": "He + is + preparing hard + for his entrance examination",
        "explanationHi": "He is preparing hard (कड़ी तैयारी कर रहा है)।",
        "vocabularyFocus": [
          "he",
          "prepare",
          "hard",
          "exam"
        ],
        "situationContextHi": "प्रतियोगी परीक्षा"
      },
      {
        "id": "pc-chal-3",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "पेड़ों पर पक्षी मीठे गीत गा रहे हैं।",
        "expectedSentence": "The birds are singing sweet songs in the trees.",
        "acceptedAlternatives": [
          "The birds are singing sweet songs in the trees"
        ],
        "chips": [
          "in the trees",
          "sweet songs",
          "singing",
          "are",
          "The birds"
        ],
        "structureFormula": "The birds + are + singing + sweet songs + in the trees",
        "explanationHi": "The birds + are + singing (गा रहे हैं)।",
        "vocabularyFocus": [
          "sing",
          "sweet",
          "song",
          "trees"
        ],
        "situationContextHi": "प्रकृति का दृश्य"
      },
      {
        "id": "pc-chal-4",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "मरीज़ को अभी कोई दर्द महसूस नहीं हो रहा है।",
        "expectedSentence": "The patient is not feeling any pain right now.",
        "acceptedAlternatives": [
          "The patient isn't feeling any pain right now.",
          "The patient is not feeling any pain right now",
          "The patient isn't feeling any pain right now"
        ],
        "chips": [
          "right now",
          "any pain",
          "feeling",
          "not",
          "is",
          "The patient"
        ],
        "structureFormula": "The patient + is + not + feeling + any pain + right now",
        "explanationHi": "The patient + is not + feeling (महसूस कर रहा है) + pain।",
        "vocabularyFocus": [
          "patient",
          "feel",
          "pain",
          "now"
        ],
        "situationContextHi": "मरीज़ की स्थिति"
      },
      {
        "id": "pc-chal-5",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "छात्र व्याख्यान पर ध्यान नहीं दे रहे हैं।",
        "expectedSentence": "The students are not paying attention to the lecture.",
        "acceptedAlternatives": [
          "The students aren't paying attention to the lecture.",
          "The students are not paying attention to the lecture",
          "The students aren't paying attention to the lecture"
        ],
        "chips": [
          "to the lecture",
          "attention",
          "paying",
          "not",
          "are",
          "The students"
        ],
        "structureFormula": "The students + are not + paying attention + to the lecture",
        "explanationHi": "ध्यान देना = pay attention। बहुवचन: are not paying attention।",
        "vocabularyFocus": [
          "students",
          "pay",
          "attention"
        ],
        "situationContextHi": "कक्षा में ध्यान"
      },
      {
        "id": "pc-chal-6",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "हम अब पुराने कंप्यूटर का उपयोग नहीं कर रहे हैं।",
        "expectedSentence": "We are not using the old computer anymore.",
        "acceptedAlternatives": [
          "We aren't using the old computer anymore.",
          "We are not using the old computer anymore",
          "We aren't using the old computer anymore"
        ],
        "chips": [
          "anymore",
          "the old computer",
          "using",
          "not",
          "are",
          "We"
        ],
        "structureFormula": "We + are not + using + the old computer + anymore",
        "explanationHi": "Anymore (अब और नहीं): We are not using... anymore।",
        "vocabularyFocus": [
          "we",
          "use",
          "old",
          "computer"
        ],
        "situationContextHi": "तकनीकी उपकरण"
      },
      {
        "id": "pc-chal-7",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आप ठंडे मौसम में बाहर क्यों खड़े हैं?",
        "expectedSentence": "Why are you standing outside in the cold weather?",
        "acceptedAlternatives": [
          "Why are you standing outside in the cold weather"
        ],
        "chips": [
          "cold weather?",
          "in the",
          "standing outside",
          "you",
          "are",
          "Why"
        ],
        "structureFormula": "Why + are + you + standing + outside + in the cold weather?",
        "explanationHi": "Why + are + you + standing (खड़े हैं) + स्थान?",
        "vocabularyFocus": [
          "why",
          "you",
          "stand",
          "outside",
          "cold"
        ],
        "situationContextHi": "ठंड में बाहर खड़ा होना"
      },
      {
        "id": "pc-chal-8",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आप आज रात के खाने के लिए क्या तैयार कर रहे हैं?",
        "expectedSentence": "What are you preparing for tonight dinner?",
        "acceptedAlternatives": [
          "What are you preparing for tonight dinner",
          "What are you preparing for tonight's dinner?",
          "What are you preparing for tonight's dinner"
        ],
        "chips": [
          "tonight dinner?",
          "for",
          "preparing",
          "you",
          "are",
          "What"
        ],
        "structureFormula": "What + are + you + preparing + for tonight dinner?",
        "explanationHi": "What + are + you + preparing (तैयार कर रहे हैं)?",
        "vocabularyFocus": [
          "what",
          "you",
          "prepare",
          "dinner"
        ],
        "situationContextHi": "रात के खाने की तैयारी"
      },
      {
        "id": "pc-chal-9",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "अभी सामने के दरवाज़े पर कौन दस्तक दे रहा है?",
        "expectedSentence": "Who is knocking on the front door right now?",
        "acceptedAlternatives": [
          "Who is knocking on the front door right now"
        ],
        "chips": [
          "right now?",
          "the front door",
          "knocking on",
          "is",
          "Who"
        ],
        "structureFormula": "Who + is + knocking + on the front door + right now?",
        "explanationHi": "दरवाज़ा खटखटाना = knock on the door। Who is knocking...?",
        "vocabularyFocus": [
          "who",
          "door",
          "now"
        ],
        "situationContextHi": "दरवाज़े पर आहट"
      },
      {
        "id": "pc-chal-10",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या वैज्ञानिक कोई नया प्रयोग कर रहे हैं?",
        "expectedSentence": "Are the scientists conducting a new experiment?",
        "acceptedAlternatives": [
          "Are the scientists conducting a new experiment"
        ],
        "chips": [
          "a new experiment?",
          "conducting",
          "the scientists",
          "Are"
        ],
        "structureFormula": "Are + the scientists + conducting + a new experiment?",
        "explanationHi": "प्रयोग करना = conduct an experiment। Are the scientists conducting...?",
        "vocabularyFocus": [
          "scientist",
          "new",
          "experiment"
        ],
        "situationContextHi": "वैज्ञानिक अनुसंधान"
      },
      {
        "id": "pc-beg-12",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैं अभी पानी पी रहा हूँ।",
        "expectedSentence": "I am drinking water now.",
        "acceptedAlternatives": [
          "I am drinking water now",
          "I'm drinking water now."
        ],
        "chips": [
          "am",
          "drinking",
          "water",
          "now",
          "I",
          "drinks"
        ],
        "structureFormula": "I + am + V-ing (drinking) + Object + now",
        "situationContextHi": "अभी चल रही क्रिया",
        "explanationHi": "I के साथ am + V-ing आता है। अभी के लिए \"now\" का प्रयोग होता है।",
        "vocabularyFocus": [
          "drink",
          "water",
          "now"
        ]
      },
      {
        "id": "pc-beg-13",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह चावल पका रही है।",
        "expectedSentence": "She is cooking rice.",
        "acceptedAlternatives": [
          "She is cooking rice",
          "She's cooking rice."
        ],
        "chips": [
          "is",
          "cooking",
          "rice",
          "She",
          "cooks"
        ],
        "structureFormula": "She + is + V-ing (cooking) + Object",
        "situationContextHi": "रसोई में चल रहा काम",
        "explanationHi": "She के साथ is + V-ing \"cooking\" आता है।",
        "vocabularyFocus": [
          "cook",
          "rice"
        ]
      },
      {
        "id": "pc-beg-15",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "वह सो नहीं रहा है।",
        "expectedSentence": "He is not sleeping.",
        "acceptedAlternatives": [
          "He isn't sleeping.",
          "He is not sleeping"
        ],
        "chips": [
          "is",
          "not",
          "sleeping",
          "He",
          "sleep"
        ],
        "structureFormula": "He + is not + V-ing (sleeping)",
        "situationContextHi": "वर्तमान अवस्था",
        "explanationHi": "He के साथ is not + V-ing आता है।",
        "vocabularyFocus": [
          "sleep"
        ]
      },
      {
        "id": "pc-beg-16",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुम टीवी देख रहे हो?",
        "expectedSentence": "Are you watching TV?",
        "acceptedAlternatives": [
          "Are you watching TV",
          "Are you watching TV?"
        ],
        "chips": [
          "Are",
          "you",
          "watching",
          "TV",
          "Do"
        ],
        "structureFormula": "Are + you + V-ing (watching) + Object?",
        "situationContextHi": "वर्तमान गतिविधि पूछना",
        "explanationHi": "You के प्रश्न में \"Are\" आगे आता है और क्रिया में ing लगता है।",
        "vocabularyFocus": [
          "watch",
          "TV"
        ]
      },
      {
        "id": "pc-beg-17",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे मैदान में दौड़ रहे हैं।",
        "expectedSentence": "They are running in the field.",
        "acceptedAlternatives": [
          "They are running in the field"
        ],
        "chips": [
          "are",
          "running",
          "in",
          "the",
          "field",
          "They",
          "run"
        ],
        "structureFormula": "They + are + V-ing (running) + in the field",
        "situationContextHi": "दौड़ना और खेलना",
        "explanationHi": "They के साथ are + V-ing (running) आता है। Run में n डबल हो जाता है।",
        "vocabularyFocus": [
          "run",
          "field"
        ]
      },
      {
        "id": "pc-beg-18",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "बच्चा रो रहा है।",
        "expectedSentence": "The baby is crying.",
        "acceptedAlternatives": [
          "The baby is crying"
        ],
        "chips": [
          "The",
          "baby",
          "is",
          "crying",
          "cry"
        ],
        "structureFormula": "The baby (Singular) + is + V-ing (crying)",
        "situationContextHi": "शिशु की स्थिति",
        "explanationHi": "The baby एकवचन है इसलिए is + crying आता है।",
        "vocabularyFocus": [
          "baby",
          "cry"
        ]
      },
      {
        "id": "pc-beg-19",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या बाहर बारिश हो रही है?",
        "expectedSentence": "Is it raining outside?",
        "acceptedAlternatives": [
          "Is it raining outside",
          "Is it raining outside?"
        ],
        "chips": [
          "Is",
          "it",
          "raining",
          "outside",
          "Does"
        ],
        "structureFormula": "Is + it + V-ing (raining) + outside?",
        "situationContextHi": "मौसम की जानकारी",
        "explanationHi": "मौसम के लिए dummy subject \"it\" आता है और प्रश्न में \"Is it raining\" बनता है।",
        "vocabularyFocus": [
          "rain",
          "outside"
        ]
      },
      {
        "id": "pc-beg-20",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "हम समय बर्बाद नहीं कर रहे हैं।",
        "expectedSentence": "We are not wasting time.",
        "acceptedAlternatives": [
          "We aren't wasting time.",
          "We are not wasting time"
        ],
        "chips": [
          "are",
          "not",
          "wasting",
          "time",
          "We",
          "waste"
        ],
        "structureFormula": "We + are not + V-ing (wasting) + time",
        "situationContextHi": "समय का सदुपयोग",
        "explanationHi": "We के साथ are not + wasting आता है।",
        "vocabularyFocus": [
          "waste",
          "time"
        ]
      },
      {
        "id": "pc-prac-12",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "शिक्षक छात्रों को एक महत्वपूर्ण पाठ समझा रहे हैं।",
        "expectedSentence": "The teacher is explaining an important lesson to the students.",
        "acceptedAlternatives": [
          "The teacher is explaining an important lesson to the students"
        ],
        "chips": [
          "The",
          "teacher",
          "is",
          "explaining",
          "an",
          "important",
          "lesson",
          "to",
          "the",
          "students"
        ],
        "structureFormula": "Subject + is + V-ing (explaining) + Object + to students",
        "situationContextHi": "कक्षा में शिक्षण",
        "explanationHi": "The teacher एकवचन है इसलिए is explaining आता है।",
        "vocabularyFocus": [
          "teacher",
          "explain",
          "lesson",
          "students"
        ]
      },
      {
        "id": "pc-prac-13",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वह बैठक के लिए एक सुंदर प्रस्तुति तैयार कर रही है।",
        "expectedSentence": "She is preparing a beautiful presentation for the meeting.",
        "acceptedAlternatives": [
          "She is preparing a beautiful presentation for the meeting"
        ],
        "chips": [
          "She",
          "is",
          "preparing",
          "a",
          "beautiful",
          "presentation",
          "for",
          "the",
          "meeting"
        ],
        "structureFormula": "She + is + V-ing (preparing) + Object + for meeting",
        "situationContextHi": "दफ्तर में तैयारी",
        "explanationHi": "She के साथ is + preparing आता है।",
        "vocabularyFocus": [
          "prepare",
          "presentation",
          "meeting"
        ]
      },
      {
        "id": "pc-prac-14",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या वे इस महीने अपने पुराने घर की मरम्मत कर रहे हैं?",
        "expectedSentence": "Are they renovating their old house this month?",
        "acceptedAlternatives": [
          "Are they renovating their old house this month",
          "Are they renovating their old house this month?"
        ],
        "chips": [
          "Are",
          "they",
          "renovating",
          "their",
          "old",
          "house",
          "this",
          "month"
        ],
        "structureFormula": "Are + they + V-ing (renovating) + Object + this month?",
        "situationContextHi": "घर की मरम्मत",
        "explanationHi": "They के प्रश्न में Are + they + renovating आता है।",
        "vocabularyFocus": [
          "renovate",
          "house",
          "month"
        ]
      },
      {
        "id": "pc-prac-15",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हम आज एक रक्तदान शिविर का आयोजन कर रहे हैं।",
        "expectedSentence": "We are organizing a blood donation camp today.",
        "acceptedAlternatives": [
          "We are organizing a blood donation camp today"
        ],
        "chips": [
          "We",
          "are",
          "organizing",
          "a",
          "blood",
          "donation",
          "camp",
          "today"
        ],
        "structureFormula": "We + are + V-ing (organizing) + Object + today",
        "situationContextHi": "सामाजिक सेवा",
        "explanationHi": "We के साथ are organizing आता है।",
        "vocabularyFocus": [
          "organize",
          "donation",
          "camp",
          "today"
        ]
      },
      {
        "id": "pc-prac-16",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "सिरदर्द के कारण वह कक्षा में शामिल नहीं हो रहा है।",
        "expectedSentence": "He is not attending class due to a headache.",
        "acceptedAlternatives": [
          "He isn't attending class due to a headache.",
          "He is not attending class due to a headache"
        ],
        "chips": [
          "He",
          "is",
          "not",
          "attending",
          "class",
          "due",
          "to",
          "a",
          "headache"
        ],
        "structureFormula": "He + is not + V-ing (attending) + Object + due to phrase",
        "situationContextHi": "स्वास्थ्य कारण",
        "explanationHi": "He is not attending वर्तमान में गैर-मौजूदगी को बताता है।",
        "vocabularyFocus": [
          "attend",
          "class",
          "headache"
        ]
      },
      {
        "id": "pc-prac-17",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "शेफ रसोई में ताज़ी कुकीज़ बेक कर रहा है।",
        "expectedSentence": "The chef is baking fresh cookies in the kitchen.",
        "acceptedAlternatives": [
          "The chef is baking fresh cookies in the kitchen"
        ],
        "chips": [
          "The",
          "chef",
          "is",
          "baking",
          "fresh",
          "cookies",
          "in",
          "the",
          "kitchen"
        ],
        "structureFormula": "Subject + is + V-ing (baking) + Object + in kitchen",
        "situationContextHi": "रेस्तरां और भोजन",
        "explanationHi": "The chef एकवचन है इसलिए is baking आता है।",
        "vocabularyFocus": [
          "chef",
          "bake",
          "cookies",
          "kitchen"
        ]
      },
      {
        "id": "pc-prac-18",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वे स्टेशन पर ट्रेन का इंतज़ार कर रहे हैं।",
        "expectedSentence": "They are waiting for the train at the station.",
        "acceptedAlternatives": [
          "They are waiting for the train at the station"
        ],
        "chips": [
          "They",
          "are",
          "waiting",
          "for",
          "the",
          "train",
          "at",
          "the",
          "station"
        ],
        "structureFormula": "They + are + waiting for + Object + at station",
        "situationContextHi": "यात्रा और इंतज़ार",
        "explanationHi": "Wait के बाद preposition \"for\" लगता है: waiting for the train।",
        "vocabularyFocus": [
          "wait",
          "train",
          "station"
        ]
      },
      {
        "id": "pc-prac-19",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या तुम्हारी बहन कमरे में गिटार बजा रही है?",
        "expectedSentence": "Is your sister playing the guitar in her room?",
        "acceptedAlternatives": [
          "Is your sister playing the guitar in her room",
          "Is your sister playing the guitar in her room?"
        ],
        "chips": [
          "Is",
          "your",
          "sister",
          "playing",
          "the",
          "guitar",
          "in",
          "her",
          "room"
        ],
        "structureFormula": "Is + Singular Subject + V-ing (playing) + Object + in room?",
        "situationContextHi": "संगीत का अभ्यास",
        "explanationHi": "Your sister एकवचन है इसलिए Is से प्रश्न शुरू हुआ।",
        "vocabularyFocus": [
          "sister",
          "play",
          "guitar",
          "room"
        ]
      },
      {
        "id": "pc-prac-20",
        "tenseKey": "present_continuous",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैं एक ज्ञानवर्धक किताब पढ़ रहा हूँ।",
        "expectedSentence": "I am reading an informative book right now.",
        "acceptedAlternatives": [
          "I am reading an informative book right now",
          "I am reading an informative book."
        ],
        "chips": [
          "I",
          "am",
          "reading",
          "an",
          "informative",
          "book",
          "right",
          "now"
        ],
        "structureFormula": "I + am + reading + Object + right now",
        "situationContextHi": "किताब पढ़ना",
        "explanationHi": "I के साथ am reading आता है। Informative स्वर ध्वनि है इसलिए \"an\" लगा।",
        "vocabularyFocus": [
          "read",
          "informative",
          "book"
        ]
      },
      {
        "id": "pc-chal-11",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "जब तक तकनीशियन सर्वर को अपडेट कर रहे हैं, पोर्टल बंद रहेगा।",
        "expectedSentence": "While technicians are updating the server, the website remains offline.",
        "acceptedAlternatives": [
          "While technicians are updating the server, the website remains offline"
        ],
        "chips": [
          "While",
          "technicians",
          "are",
          "updating",
          "the",
          "server,",
          "the",
          "website",
          "remains",
          "offline"
        ],
        "structureFormula": "While + Subject + are + V-ing + main clause",
        "situationContextHi": "तकनीकी रखरखाव",
        "explanationHi": "While के साथ जारी प्रक्रिया में Present Continuous (are updating) का प्रयोग होता है।",
        "vocabularyFocus": [
          "technicians",
          "update",
          "server",
          "offline"
        ]
      },
      {
        "id": "pc-chal-12",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "कंपनियां दूरदराज के इंजीनियरों को सक्रिय रूप से क्यों नियुक्त कर रही हैं?",
        "expectedSentence": "Why are companies actively hiring remote engineers these days?",
        "acceptedAlternatives": [
          "Why are companies actively hiring remote engineers these days",
          "Why are companies actively hiring remote engineers these days?"
        ],
        "chips": [
          "Why",
          "are",
          "companies",
          "actively",
          "hiring",
          "remote",
          "engineers",
          "these",
          "days"
        ],
        "structureFormula": "Why + are + Plural Subject + Adverb + V-ing + Object?",
        "situationContextHi": "आधुनिक रोजगार का रुझान",
        "explanationHi": "Why are companies actively hiring में Adverb क्रिया से पहले आया है।",
        "vocabularyFocus": [
          "companies",
          "actively",
          "hire",
          "remote",
          "engineers"
        ]
      },
      {
        "id": "pc-chal-13",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "पर्यावरण समिति प्रदूषण कम करने के लिए दिशानिर्देश तैयार कर रही है।",
        "expectedSentence": "The committee is formulating actionable guidelines to reduce pollution.",
        "acceptedAlternatives": [
          "The committee is formulating actionable guidelines to reduce pollution"
        ],
        "chips": [
          "The",
          "committee",
          "is",
          "formulating",
          "actionable",
          "guidelines",
          "to",
          "reduce",
          "pollution"
        ],
        "structureFormula": "Subject + is + V-ing (formulating) + Object + Infinitive",
        "situationContextHi": "पर्यावरण नीति",
        "explanationHi": "The committee एकवचन समूह के रूप में is formulating लेती है।",
        "vocabularyFocus": [
          "committee",
          "formulate",
          "guidelines",
          "pollution"
        ]
      },
      {
        "id": "pc-chal-14",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "वह बाजार में सुधार होने तक कोई बड़ा वित्तीय जोखिम नहीं ले रही है।",
        "expectedSentence": "She is not taking any major financial risks until markets stabilize.",
        "acceptedAlternatives": [
          "She isn't taking any major financial risks until markets stabilize.",
          "She is not taking any major financial risks until markets stabilize"
        ],
        "chips": [
          "She",
          "is",
          "not",
          "taking",
          "any",
          "major",
          "financial",
          "risks",
          "until",
          "markets",
          "stabilize"
        ],
        "structureFormula": "She + is not + V-ing (taking) + Object + until clause",
        "situationContextHi": "वित्तीय निर्णय",
        "explanationHi": "Is not taking वर्तमान में संयम बरतने को दर्शाता है।",
        "vocabularyFocus": [
          "financial",
          "risks",
          "stabilize"
        ]
      },
      {
        "id": "pc-chal-15",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या शोधकर्ता इस नए टीके पर नैदानिक परीक्षण कर रहे हैं?",
        "expectedSentence": "Are researchers conducting clinical trials on this new vaccine?",
        "acceptedAlternatives": [
          "Are researchers conducting clinical trials on this new vaccine",
          "Are researchers conducting clinical trials on this new vaccine?"
        ],
        "chips": [
          "Are",
          "researchers",
          "conducting",
          "clinical",
          "trials",
          "on",
          "this",
          "new",
          "vaccine"
        ],
        "structureFormula": "Are + Plural Subject + V-ing (conducting) + Object + on vaccine?",
        "situationContextHi": "चिकित्सीय परीक्षण",
        "explanationHi": "Researchers बहुवचन है इसलिए Are + conducting आता है।",
        "vocabularyFocus": [
          "researchers",
          "conduct",
          "clinical",
          "trials",
          "vaccine"
        ]
      },
      {
        "id": "pc-chal-16",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हमारे इंजीनियर वरिष्ठ नागरिकों के लिए एक आसान ऐप विकसित कर रहे हैं।",
        "expectedSentence": "Our engineers are developing an intuitive mobile application for seniors.",
        "acceptedAlternatives": [
          "Our engineers are developing an intuitive mobile application for seniors"
        ],
        "chips": [
          "Our",
          "engineers",
          "are",
          "developing",
          "an",
          "intuitive",
          "mobile",
          "application",
          "for",
          "seniors"
        ],
        "structureFormula": "Subject + are + V-ing (developing) + Object + for seniors",
        "situationContextHi": "ऐप विकास",
        "explanationHi": "Our engineers बहुवचन है इसलिए are developing आया।",
        "vocabularyFocus": [
          "engineers",
          "develop",
          "application",
          "seniors"
        ]
      },
      {
        "id": "pc-chal-17",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "प्रतिनिधि वर्तमान में सम्मेलन में स्थायी जलवायु नीतियों पर चर्चा कर रहे हैं।",
        "expectedSentence": "Delegates are currently discussing sustainable climate policies at the summit.",
        "acceptedAlternatives": [
          "Delegates are currently discussing sustainable climate policies at the summit"
        ],
        "chips": [
          "Delegates",
          "are",
          "currently",
          "discussing",
          "sustainable",
          "climate",
          "policies",
          "at",
          "the",
          "summit"
        ],
        "structureFormula": "Subject + are + currently + V-ing (discussing) + Object + at summit",
        "situationContextHi": "अंतरराष्ट्रीय कूटनीति",
        "explanationHi": "Currently क्रिया से पहले आता है: are currently discussing।",
        "vocabularyFocus": [
          "delegates",
          "discuss",
          "sustainable",
          "climate",
          "summit"
        ]
      },
      {
        "id": "pc-chal-18",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "प्रशासन इन क्षेत्रों में अनधिकृत निर्माण की अनुमति नहीं दे रहा है।",
        "expectedSentence": "The administration is not allowing unauthorized construction in these areas.",
        "acceptedAlternatives": [
          "The administration isn't allowing unauthorized construction in these areas.",
          "The administration is not allowing unauthorized construction in these areas"
        ],
        "chips": [
          "The",
          "administration",
          "is",
          "not",
          "allowing",
          "unauthorized",
          "construction",
          "in",
          "these",
          "areas"
        ],
        "structureFormula": "Subject + is not + V-ing (allowing) + Object + in areas",
        "situationContextHi": "शहरी नियम और कानून",
        "explanationHi": "The administration एकवचन है इसलिए is not allowing आया।",
        "vocabularyFocus": [
          "administration",
          "allow",
          "unauthorized",
          "construction"
        ]
      },
      {
        "id": "pc-chal-19",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "यातायात पुलिस राजमार्ग पर तेज गति वाले वाहनों की निगरानी कर रही है।",
        "expectedSentence": "Traffic police are strictly monitoring speeding vehicles along the highway.",
        "acceptedAlternatives": [
          "Traffic police are strictly monitoring speeding vehicles along the highway"
        ],
        "chips": [
          "Traffic",
          "police",
          "are",
          "strictly",
          "monitoring",
          "speeding",
          "vehicles",
          "along",
          "the",
          "highway"
        ],
        "structureFormula": "Police (Plural) + are + strictly + V-ing + Object",
        "situationContextHi": "सड़क सुरक्षा",
        "explanationHi": "Police को अंग्रेज़ी में बहुवचन माना जाता है इसलिए \"are strictly monitoring\" आया।",
        "vocabularyFocus": [
          "police",
          "monitor",
          "speeding",
          "highway"
        ]
      },
      {
        "id": "pc-chal-20",
        "tenseKey": "present_continuous",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह पारिवारिक काम संभालते हुए सिविल सेवा परीक्षा की तैयारी कर रहा है।",
        "expectedSentence": "He is diligently preparing for competitive exams while managing family duties.",
        "acceptedAlternatives": [
          "He is diligently preparing for competitive exams while managing family duties"
        ],
        "chips": [
          "He",
          "is",
          "diligently",
          "preparing",
          "for",
          "competitive",
          "exams",
          "while",
          "managing",
          "family",
          "duties"
        ],
        "structureFormula": "He + is + Adverb + V-ing + for exams + while managing duties",
        "situationContextHi": "कड़ा परिश्रम और पढ़ाई",
        "explanationHi": "He is diligently preparing में Adverb \"diligently\" क्रिया से पहले लगा है।",
        "vocabularyFocus": [
          "diligently",
          "prepare",
          "competitive",
          "exams"
        ]
      },
      {
        "id": "pc-beg-14",
        "tenseKey": "present_continuous",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह अपनी कार धो रहा है।",
        "expectedSentence": "He is washing his car.",
        "acceptedAlternatives": [
          "He is washing his car",
          "He's washing his car."
        ],
        "chips": [
          "is",
          "washing",
          "his",
          "car",
          "He",
          "wash"
        ],
        "structureFormula": "He + is + V-ing (washing) + his car",
        "situationContextHi": "सफाई का काम चल रहा है",
        "explanationHi": "He के साथ is + V-ing \"washing\" आता है।",
        "vocabularyFocus": [
          "wash",
          "car"
        ]
      }
    ]
  },
  "present_perfect": {
    "key": "present_perfect",
    "englishTitle": "Present Perfect",
    "hindiTitle": "पूर्ण वर्तमान काल",
    "shortTag": "5. Present Perfect",
    "colorScheme": {
      "badge": "bg-rose-950 text-rose-300 border-rose-800",
      "border": "border-rose-600/40",
      "bg": "bg-rose-950/20",
      "activeTab": "bg-rose-600 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-950/50",
      "text": "text-rose-400",
      "ring": "ring-rose-500"
    },
    "identificationHi": "वाक्य के अंत में \"चुका हूँ, चुकी है, चुके हैं, लिया है, दिया है, देखा है\" आता है।",
    "whenToUseHi": "जो काम हाल ही में या अभी-अभी पूरा हुआ है और उसका प्रभाव वर्तमान में मौजूद है।",
    "coreExampleEn": "I have finished my work.",
    "coreExampleHi": "मैंने अपना काम पूरा कर लिया है।",
    "structure": {
      "positive": "Subject + have / has + Verb (3rd form, e.g. finished, done, seen) + Object",
      "negative": "Subject + have not / has not + Verb (3rd form) + Object",
      "question": "Have / Has + Subject + Verb (3rd form) + Object?"
    },
    "exercises": [
      {
        "id": "perf-beg-1",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने अपना काम पूरा कर लिया है।",
        "expectedSentence": "I have finished my work.",
        "acceptedAlternatives": [
          "I have finished my work",
          "I've finished my work.",
          "I've finished my work"
        ],
        "chips": [
          "my work",
          "finished",
          "have",
          "I"
        ],
        "structureFormula": "I + have + finished (V3) + my work",
        "explanationHi": "Present Perfect में \"have\" के साथ क्रिया का तीसरा रूप (V3: finish → finished) आता है।",
        "vocabularyFocus": [
          "work",
          "finish",
          "my"
        ],
        "situationContextHi": "कार्य की पूर्णता"
      },
      {
        "id": "perf-beg-2",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हमने दोपहर का खाना खा लिया है।",
        "expectedSentence": "We have eaten lunch.",
        "acceptedAlternatives": [
          "We have eaten lunch",
          "We've eaten lunch.",
          "We have eaten our lunch."
        ],
        "chips": [
          "lunch",
          "eaten",
          "have",
          "We"
        ],
        "structureFormula": "We + have + eaten (V3 of eat) + lunch",
        "explanationHi": "Eat की 3rd Form \"eaten\" होती है: eat → ate → eaten।",
        "vocabularyFocus": [
          "we",
          "eat",
          "lunch"
        ],
        "situationContextHi": "भोजन संपन्न होना"
      },
      {
        "id": "perf-beg-3",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने यह किताब पढ़ ली है।",
        "expectedSentence": "She has read this book.",
        "acceptedAlternatives": [
          "She has read this book",
          "She's read this book."
        ],
        "chips": [
          "this book",
          "read",
          "has",
          "She"
        ],
        "structureFormula": "She + has + read (V3) + this book",
        "explanationHi": "She/He के साथ \"has\" आता है। Read का तीसरा रूप \"read\" (उच्चारण रेड) होता है।",
        "vocabularyFocus": [
          "she",
          "read",
          "book"
        ],
        "situationContextHi": "किताब पूरी पढ़ना"
      },
      {
        "id": "perf-beg-4",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वह बाहर गया है।",
        "expectedSentence": "He has gone out.",
        "acceptedAlternatives": [
          "He has gone out",
          "He's gone out."
        ],
        "chips": [
          "out",
          "gone",
          "has",
          "He"
        ],
        "structureFormula": "He + has + gone (V3 of go) + out",
        "explanationHi": "Go की 3rd Form \"gone\" है: go → went → gone।",
        "vocabularyFocus": [
          "he",
          "go",
          "out"
        ],
        "situationContextHi": "बाहर जाना"
      },
      {
        "id": "perf-beg-5",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे यहाँ पहुँच चुके हैं।",
        "expectedSentence": "They have arrived here.",
        "acceptedAlternatives": [
          "They have arrived here",
          "They've arrived here."
        ],
        "chips": [
          "here",
          "arrived",
          "have",
          "They"
        ],
        "structureFormula": "They + have + arrived + here",
        "explanationHi": "They के साथ \"have\" और V3 \"arrived\" आता है।",
        "vocabularyFocus": [
          "they",
          "arrive",
          "here"
        ],
        "situationContextHi": "पहुँचने की सूचना"
      },
      {
        "id": "perf-beg-6",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने यह फिल्म देखी है।",
        "expectedSentence": "I have seen this movie.",
        "acceptedAlternatives": [
          "I have seen this movie",
          "I've seen this movie."
        ],
        "chips": [
          "this movie",
          "seen",
          "have",
          "I"
        ],
        "structureFormula": "I + have + seen (V3 of see) + this movie",
        "explanationHi": "See की 3rd Form \"seen\" है: see → saw → seen।",
        "vocabularyFocus": [
          "see",
          "movie"
        ],
        "situationContextHi": "फिल्म का अनुभव"
      },
      {
        "id": "perf-beg-7",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने अपना पेन खो दिया है।",
        "expectedSentence": "He has lost his pen.",
        "acceptedAlternatives": [
          "He has lost his pen",
          "He's lost his pen."
        ],
        "chips": [
          "his pen",
          "lost",
          "has",
          "He"
        ],
        "structureFormula": "He + has + lost (V3 of lose) + his pen",
        "explanationHi": "Lose की 3rd Form \"lost\" है।",
        "vocabularyFocus": [
          "he",
          "lose",
          "pen"
        ],
        "situationContextHi": "वस्तु खोना"
      },
      {
        "id": "perf-beg-8",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "मैंने अभी तक नहीं खाया है।",
        "expectedSentence": "I have not eaten yet.",
        "acceptedAlternatives": [
          "I haven't eaten yet.",
          "I have not eaten yet",
          "I haven't eaten yet"
        ],
        "chips": [
          "yet",
          "eaten",
          "have not",
          "I"
        ],
        "structureFormula": "I + have not + eaten + yet",
        "explanationHi": "नकारात्मक में \"have not\" आता है और \"yet\" (अभी तक) वाक्य के अंत में लगता है।",
        "vocabularyFocus": [
          "eat",
          "have",
          "not"
        ],
        "situationContextHi": "अधूरा काम"
      },
      {
        "id": "perf-beg-9",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "उसने फोन नहीं किया है।",
        "expectedSentence": "She has not called.",
        "acceptedAlternatives": [
          "She hasn't called.",
          "She has not called",
          "She hasn't called"
        ],
        "chips": [
          "called",
          "has not",
          "She"
        ],
        "structureFormula": "She + has not + called",
        "explanationHi": "She के साथ \"has not\" + V3 (called) आता है।",
        "vocabularyFocus": [
          "she",
          "call",
          "not"
        ],
        "situationContextHi": "कॉल न आना"
      },
      {
        "id": "perf-beg-10",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या आपने पूरा कर लिया है?",
        "expectedSentence": "Have you finished?",
        "acceptedAlternatives": [
          "Have you finished"
        ],
        "chips": [
          "finished?",
          "you",
          "Have"
        ],
        "structureFormula": "Have + you + finished?",
        "explanationHi": "You के लिए प्रश्न \"Have\" से शुरू होता है: Have you + V3?",
        "vocabularyFocus": [
          "you",
          "finish"
        ],
        "situationContextHi": "समाप्ति की पूछताछ"
      },
      {
        "id": "perf-beg-11",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या वह आ गया है?",
        "expectedSentence": "Has he arrived?",
        "acceptedAlternatives": [
          "Has he arrived"
        ],
        "chips": [
          "arrived?",
          "he",
          "Has"
        ],
        "structureFormula": "Has + he + arrived?",
        "explanationHi": "He के लिए प्रश्न \"Has\" से शुरू होता है: Has he + V3?",
        "vocabularyFocus": [
          "he",
          "arrive"
        ],
        "situationContextHi": "आगमन की पुष्टि"
      },
      {
        "id": "perf-prac-1",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैंने आज अपना शयनकक्ष साफ किया है।",
        "expectedSentence": "I have cleaned my bedroom today.",
        "acceptedAlternatives": [
          "I have cleaned my bedroom today",
          "I've cleaned my bedroom today."
        ],
        "chips": [
          "today",
          "my bedroom",
          "cleaned",
          "have",
          "I"
        ],
        "structureFormula": "I + have + cleaned + my bedroom + today",
        "explanationHi": "I have + cleaned (V3) + my bedroom + today।",
        "vocabularyFocus": [
          "clean",
          "room",
          "today"
        ],
        "situationContextHi": "कमरे की सफाई"
      },
      {
        "id": "perf-prac-2",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसने हमारे लिए एक खास व्यंजन बनाया है।",
        "expectedSentence": "She has cooked a special dish for us.",
        "acceptedAlternatives": [
          "She has cooked a special dish for us",
          "She's cooked a special dish for us."
        ],
        "chips": [
          "for us",
          "a special dish",
          "cooked",
          "has",
          "She"
        ],
        "structureFormula": "She + has + cooked + a special dish + for us",
        "explanationHi": "She + has + cooked (V3) + dish + for us।",
        "vocabularyFocus": [
          "she",
          "cook",
          "special"
        ],
        "situationContextHi": "स्वादिष्ट खाना बनाना"
      },
      {
        "id": "perf-prac-3",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हमने पहले ही ट्रेन के टिकट खरीद लिए हैं।",
        "expectedSentence": "We have already bought the train tickets.",
        "acceptedAlternatives": [
          "We have already bought the train tickets",
          "We've already bought the train tickets."
        ],
        "chips": [
          "the train tickets",
          "bought",
          "already",
          "have",
          "We"
        ],
        "structureFormula": "We + have + already + bought + the train tickets",
        "explanationHi": "Already (पहले ही) have और V3 के बीच में आता है।",
        "vocabularyFocus": [
          "we",
          "buy",
          "train",
          "ticket"
        ],
        "situationContextHi": "यात्रा की तैयारी"
      },
      {
        "id": "perf-prac-4",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसे अपनी खोई हुई घड़ी मिल गई है।",
        "expectedSentence": "He has found his lost watch.",
        "acceptedAlternatives": [
          "He has found his lost watch",
          "He's found his lost watch."
        ],
        "chips": [
          "his lost watch",
          "found",
          "has",
          "He"
        ],
        "structureFormula": "He + has + found (V3 of find) + his lost watch",
        "explanationHi": "Find की 3rd Form \"found\" है: find → found → found।",
        "vocabularyFocus": [
          "he",
          "find",
          "watch"
        ],
        "situationContextHi": "खोई चीज़ मिलना"
      },
      {
        "id": "perf-prac-5",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "वे दो बार ताजमहल देख चुके हैं।",
        "expectedSentence": "They have visited the Taj Mahal twice.",
        "acceptedAlternatives": [
          "They have visited the Taj Mahal twice",
          "They've visited the Taj Mahal twice."
        ],
        "chips": [
          "twice",
          "the Taj Mahal",
          "visited",
          "have",
          "They"
        ],
        "structureFormula": "They + have + visited + the Taj Mahal + twice",
        "explanationHi": "जीवन का अनुभव बताने के लिए Present Perfect आता है: have visited।",
        "vocabularyFocus": [
          "they",
          "visit",
          "twice"
        ],
        "situationContextHi": "पर्यटन का अनुभव"
      },
      {
        "id": "perf-prac-6",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "मुझे अभी तक पार्सल नहीं मिला है।",
        "expectedSentence": "I have not received the parcel yet.",
        "acceptedAlternatives": [
          "I haven't received the parcel yet.",
          "I have not received the parcel yet",
          "I haven't received the parcel yet"
        ],
        "chips": [
          "yet",
          "the parcel",
          "received",
          "have not",
          "I"
        ],
        "structureFormula": "I + have not + received + the parcel + yet",
        "explanationHi": "I have not + received (V3) + object + yet (अभी तक)।",
        "vocabularyFocus": [
          "receive",
          "parcel",
          "yet"
        ],
        "situationContextHi": "पार्सल की डिलीवरी"
      },
      {
        "id": "perf-prac-7",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "उसने मेरे संदेश का उत्तर नहीं दिया है।",
        "expectedSentence": "He has not answered my message.",
        "acceptedAlternatives": [
          "He hasn't answered my message.",
          "He has not answered my message",
          "He hasn't answered my message"
        ],
        "chips": [
          "my message",
          "answered",
          "has not",
          "He"
        ],
        "structureFormula": "He + has not + answered + my message",
        "explanationHi": "He + has not + answered (V3) + my message।",
        "vocabularyFocus": [
          "he",
          "answer",
          "message"
        ],
        "situationContextHi": "संदेश का उत्तर न मिलना"
      },
      {
        "id": "perf-prac-8",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "हमने सोमवार से उसे नहीं देखा है।",
        "expectedSentence": "We have not seen him since Monday.",
        "acceptedAlternatives": [
          "We haven't seen him since Monday.",
          "We have not seen him since Monday",
          "We haven't seen him since Monday"
        ],
        "chips": [
          "since Monday",
          "him",
          "seen",
          "have not",
          "We"
        ],
        "structureFormula": "We + have not + seen + him + since Monday",
        "explanationHi": "निश्चित बिंदु (Monday) के लिए \"since\" आता है।",
        "vocabularyFocus": [
          "we",
          "see",
          "since"
        ],
        "situationContextHi": "किसी से लंबे समय तक न मिलना"
      },
      {
        "id": "perf-prac-9",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपने आज अपनी दवा ली है?",
        "expectedSentence": "Have you taken your medicine today?",
        "acceptedAlternatives": [
          "Have you taken your medicine today"
        ],
        "chips": [
          "today?",
          "your medicine",
          "taken",
          "you",
          "Have"
        ],
        "structureFormula": "Have you + taken (V3 of take) + your medicine + today?",
        "explanationHi": "Take की 3rd Form \"taken\" होती है: take → took → taken।",
        "vocabularyFocus": [
          "you",
          "take",
          "medicine",
          "today"
        ],
        "situationContextHi": "दवा लेने की पुष्टि"
      },
      {
        "id": "perf-prac-10",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या उसने अपना स्कूल प्रोजेक्ट पूरा कर लिया है?",
        "expectedSentence": "Has she completed her school project?",
        "acceptedAlternatives": [
          "Has she completed her school project"
        ],
        "chips": [
          "her school project?",
          "completed",
          "she",
          "Has"
        ],
        "structureFormula": "Has + she + completed + her school project?",
        "explanationHi": "Has + she + completed (V3) + project?",
        "vocabularyFocus": [
          "she",
          "complete",
          "school",
          "project"
        ],
        "situationContextHi": "स्कूल प्रोजेक्ट की प्रगति"
      },
      {
        "id": "perf-prac-11",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या उन्होंने मुख्य दरवाज़ा बंद कर लिया है?",
        "expectedSentence": "Have they locked the main door?",
        "acceptedAlternatives": [
          "Have they locked the main door"
        ],
        "chips": [
          "the main door?",
          "locked",
          "they",
          "Have"
        ],
        "structureFormula": "Have + they + locked + the main door?",
        "explanationHi": "Have + they + locked (V3) + the main door?",
        "vocabularyFocus": [
          "they",
          "lock",
          "door"
        ],
        "situationContextHi": "घर की सुरक्षा"
      },
      {
        "id": "perf-chal-1",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "कंपनी ने बिल्कुल नया उत्पाद लॉन्च किया है।",
        "expectedSentence": "The company has launched a brand new product.",
        "acceptedAlternatives": [
          "The company has launched a brand new product"
        ],
        "chips": [
          "a brand new product",
          "launched",
          "has",
          "The company"
        ],
        "structureFormula": "The company + has + launched + a brand new product",
        "explanationHi": "The company (एकवचन) + has launched (V3) + object।",
        "vocabularyFocus": [
          "company",
          "launch",
          "new",
          "product"
        ],
        "situationContextHi": "व्यापार और उत्पाद"
      },
      {
        "id": "perf-chal-2",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "हमारी टीम ने लगातार तीन मैच जीते हैं।",
        "expectedSentence": "Our team has won three matches in a row.",
        "acceptedAlternatives": [
          "Our team has won three matches in a row"
        ],
        "chips": [
          "in a row",
          "three matches",
          "won",
          "has",
          "Our team"
        ],
        "structureFormula": "Our team + has + won (V3 of win) + three matches + in a row",
        "explanationHi": "Win की 3rd Form \"won\" है। In a row = लगातार।",
        "vocabularyFocus": [
          "team",
          "win",
          "match"
        ],
        "situationContextHi": "खेल में शानदार जीत"
      },
      {
        "id": "perf-chal-3",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "वह दस साल से इस शहर में रहा है।",
        "expectedSentence": "He has lived in this city for ten years.",
        "acceptedAlternatives": [
          "He has lived in this city for ten years",
          "He has lived in this city for 10 years."
        ],
        "chips": [
          "for ten years",
          "in this city",
          "lived",
          "has",
          "He"
        ],
        "structureFormula": "He + has + lived + in this city + for ten years",
        "explanationHi": "अवधि के लिए \"for\" आता है: for ten years।",
        "vocabularyFocus": [
          "he",
          "live",
          "city",
          "years"
        ],
        "situationContextHi": "लंबे समय का निवास"
      },
      {
        "id": "perf-chal-4",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "ट्रेन अभी तक प्लेटफॉर्म पर नहीं आई है।",
        "expectedSentence": "The train has not arrived at the platform yet.",
        "acceptedAlternatives": [
          "The train hasn't arrived at the platform yet.",
          "The train has not arrived at the platform yet",
          "The train hasn't arrived at the platform yet"
        ],
        "chips": [
          "yet",
          "at the platform",
          "arrived",
          "has not",
          "The train"
        ],
        "structureFormula": "The train + has not + arrived + at the platform + yet",
        "explanationHi": "The train + has not + arrived + at the platform + yet।",
        "vocabularyFocus": [
          "train",
          "arrive",
          "yet"
        ],
        "situationContextHi": "रेलवे प्लेटफॉर्म"
      },
      {
        "id": "perf-chal-5",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "उन्होंने इस महीने बिजली का बिल नहीं भरा है।",
        "expectedSentence": "They have not paid the electricity bill this month.",
        "acceptedAlternatives": [
          "They haven't paid the electricity bill this month.",
          "They have not paid the electricity bill this month",
          "They haven't paid the electricity bill this month"
        ],
        "chips": [
          "this month",
          "the electricity bill",
          "paid",
          "have not",
          "They"
        ],
        "structureFormula": "They + have not + paid (V3 of pay) + the electricity bill + this month",
        "explanationHi": "Pay की 3rd Form \"paid\" होती है।",
        "vocabularyFocus": [
          "they",
          "pay",
          "bill",
          "month"
        ],
        "situationContextHi": "घरेलू बिल भुगतान"
      },
      {
        "id": "perf-chal-6",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "उसने अभी तक तय नहीं किया है कि कौन सा कोर्स चुनना है।",
        "expectedSentence": "She has not decided which course to choose.",
        "acceptedAlternatives": [
          "She hasn't decided which course to choose.",
          "She has not decided which course to choose",
          "She hasn't decided which course to choose"
        ],
        "chips": [
          "to choose",
          "which course",
          "decided",
          "has not",
          "She"
        ],
        "structureFormula": "She + has not + decided + which course to choose",
        "explanationHi": "Decide की 3rd Form \"decided\" है।",
        "vocabularyFocus": [
          "she",
          "decide",
          "course",
          "choose"
        ],
        "situationContextHi": "शिक्षा का फैसला"
      },
      {
        "id": "perf-chal-7",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या आपने पहले कभी हवाई जहाज़ से यात्रा की है?",
        "expectedSentence": "Have you ever traveled by airplane before?",
        "acceptedAlternatives": [
          "Have you ever traveled by airplane before",
          "Have you ever travelled by airplane before?",
          "Have you ever travelled by plane before?"
        ],
        "chips": [
          "before?",
          "by airplane",
          "traveled",
          "ever",
          "you",
          "Have"
        ],
        "structureFormula": "Have you + ever + traveled + by airplane + before?",
        "explanationHi": "जीवन के अनूठे अनुभव के लिए \"Have you ever + V3...?\" आता है।",
        "vocabularyFocus": [
          "you",
          "ever",
          "travel",
          "before"
        ],
        "situationContextHi": "हवाई यात्रा का अनुभव पूछना"
      },
      {
        "id": "perf-chal-8",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आपने मेरे पत्र का उत्तर क्यों नहीं दिया है?",
        "expectedSentence": "Why have you not replied to my letter?",
        "acceptedAlternatives": [
          "Why haven't you replied to my letter?",
          "Why have you not replied to my letter",
          "Why haven't you replied to my letter"
        ],
        "chips": [
          "to my letter?",
          "replied",
          "not",
          "you",
          "have",
          "Why"
        ],
        "structureFormula": "Why + have + you + not + replied + to my letter?",
        "explanationHi": "Why have you not + replied (V3) + to my letter?",
        "vocabularyFocus": [
          "why",
          "you",
          "reply",
          "letter"
        ],
        "situationContextHi": "जवाब न मिलने पर पूछना"
      },
      {
        "id": "perf-chal-9",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "उन्होंने अतिरिक्त चाबियाँ कहाँ रखी हैं?",
        "expectedSentence": "Where have they kept the spare keys?",
        "acceptedAlternatives": [
          "Where have they kept the spare keys"
        ],
        "chips": [
          "the spare keys?",
          "kept",
          "they",
          "have",
          "Where"
        ],
        "structureFormula": "Where + have + they + kept (V3 of keep) + the spare keys?",
        "explanationHi": "Keep की 3rd Form \"kept\" है: keep → kept → kept।",
        "vocabularyFocus": [
          "where",
          "they",
          "keep",
          "keys"
        ],
        "situationContextHi": "चाबियों की तलाश"
      },
      {
        "id": "perf-chal-10",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "आपने अपनी पढ़ाई के लिए कितने पैसे बचाए हैं?",
        "expectedSentence": "How much money have you saved for your studies?",
        "acceptedAlternatives": [
          "How much money have you saved for your studies"
        ],
        "chips": [
          "for your studies?",
          "saved",
          "you",
          "have",
          "How much money"
        ],
        "structureFormula": "How much money + have + you + saved + for your studies?",
        "explanationHi": "How much money + have you + saved (V3) + for your studies?",
        "vocabularyFocus": [
          "how",
          "money",
          "you",
          "save",
          "studies"
        ],
        "situationContextHi": "भविष्य की बचत"
      },
      {
        "id": "pp-beg-12",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने रात का खाना खा लिया है।",
        "expectedSentence": "I have eaten dinner.",
        "acceptedAlternatives": [
          "I have eaten dinner",
          "I've eaten dinner."
        ],
        "chips": [
          "have",
          "eaten",
          "dinner",
          "I",
          "ate"
        ],
        "structureFormula": "I + have + V3 (eaten) + Object",
        "situationContextHi": "भोजन पूरा होना",
        "explanationHi": "Present Perfect में have के साथ क्रिया का तीसरा रूप (V3: eaten) आता है।",
        "vocabularyFocus": [
          "eat",
          "dinner"
        ]
      },
      {
        "id": "pp-beg-13",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "उसने अपना फोन खो दिया है।",
        "expectedSentence": "She has lost her phone.",
        "acceptedAlternatives": [
          "She has lost her phone",
          "She's lost her phone."
        ],
        "chips": [
          "has",
          "lost",
          "her",
          "phone",
          "She",
          "have"
        ],
        "structureFormula": "She + has + V3 (lost) + her phone",
        "situationContextHi": "सामान खोने का वर्तमान असर",
        "explanationHi": "She के साथ has + V3 \"lost\" आता है।",
        "vocabularyFocus": [
          "lose",
          "phone"
        ]
      },
      {
        "id": "pp-beg-14",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "हमने मैच जीत लिया है।",
        "expectedSentence": "We have won the match.",
        "acceptedAlternatives": [
          "We have won the match",
          "We've won the match."
        ],
        "chips": [
          "have",
          "won",
          "the",
          "match",
          "We",
          "win"
        ],
        "structureFormula": "We + have + V3 (won) + the match",
        "situationContextHi": "जीत का परिणाम",
        "explanationHi": "We के साथ have + V3 \"won\" आता है।",
        "vocabularyFocus": [
          "win",
          "match"
        ]
      },
      {
        "id": "pp-beg-15",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "उसने मुझे अभी तक फोन नहीं किया है।",
        "expectedSentence": "He has not called me yet.",
        "acceptedAlternatives": [
          "He hasn't called me yet.",
          "He has not called me yet"
        ],
        "chips": [
          "has",
          "not",
          "called",
          "me",
          "yet",
          "He",
          "have"
        ],
        "structureFormula": "He + has not + V3 (called) + me + yet",
        "situationContextHi": "अब तक कोई कार्य न होना",
        "explanationHi": "Present Perfect negative में वाक्य के अंत में \"yet\" (अभी तक) लगता है।",
        "vocabularyFocus": [
          "call",
          "yet"
        ]
      },
      {
        "id": "pp-beg-16",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या तुमने यह फिल्म देखी है?",
        "expectedSentence": "Have you seen this movie?",
        "acceptedAlternatives": [
          "Have you seen this movie",
          "Have you seen this movie?"
        ],
        "chips": [
          "Have",
          "you",
          "seen",
          "this",
          "movie",
          "saw"
        ],
        "structureFormula": "Have + you + V3 (seen) + Object?",
        "situationContextHi": "जीवन का अनुभव पूछना",
        "explanationHi": "You के साथ प्रश्न में \"Have\" आगे आता है और see का V3 \"seen\" लगता है।",
        "vocabularyFocus": [
          "see",
          "movie"
        ]
      },
      {
        "id": "pp-beg-17",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "वे दिल्ली पहुंच चुके हैं।",
        "expectedSentence": "They have arrived in Delhi.",
        "acceptedAlternatives": [
          "They have arrived in Delhi",
          "They've arrived in Delhi."
        ],
        "chips": [
          "have",
          "arrived",
          "in",
          "Delhi",
          "They",
          "has"
        ],
        "structureFormula": "They + have + V3 (arrived) + in Delhi",
        "situationContextHi": "यात्रा पूरी होना",
        "explanationHi": "They के साथ have + arrived (V3) आता है।",
        "vocabularyFocus": [
          "arrive",
          "Delhi"
        ]
      },
      {
        "id": "pp-beg-18",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "positive",
        "hindiPrompt": "मैंने यह किताब पढ़ ली है।",
        "expectedSentence": "I have read this book.",
        "acceptedAlternatives": [
          "I have read this book",
          "I've read this book."
        ],
        "chips": [
          "have",
          "read",
          "this",
          "book",
          "I",
          "has"
        ],
        "structureFormula": "I + have + V3 (read) + this book",
        "situationContextHi": "पढ़ने का कार्य पूरा होना",
        "explanationHi": "Read की V3 spelling \"read\" ही रहती है (उच्चारण \"रेड\" होता है)।",
        "vocabularyFocus": [
          "read",
          "book"
        ]
      },
      {
        "id": "pp-beg-19",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "question",
        "hindiPrompt": "क्या उसने अपना कमरा साफ कर लिया है?",
        "expectedSentence": "Has she cleaned her room?",
        "acceptedAlternatives": [
          "Has she cleaned her room",
          "Has she cleaned her room?"
        ],
        "chips": [
          "Has",
          "she",
          "cleaned",
          "her",
          "room",
          "Have"
        ],
        "structureFormula": "Has + she + V3 (cleaned) + Object?",
        "situationContextHi": "सफाई की पुष्टि",
        "explanationHi": "She के साथ प्रश्न में \"Has\" वाक्य के शुरू में आता है।",
        "vocabularyFocus": [
          "clean",
          "room"
        ]
      },
      {
        "id": "pp-beg-20",
        "tenseKey": "present_perfect",
        "level": "beginner",
        "formType": "negative",
        "hindiPrompt": "हम तुम्हारी मदद नहीं भूले हैं।",
        "expectedSentence": "We have not forgotten your help.",
        "acceptedAlternatives": [
          "We haven't forgotten your help.",
          "We have not forgotten your help"
        ],
        "chips": [
          "have",
          "not",
          "forgotten",
          "your",
          "help",
          "We",
          "forgot"
        ],
        "structureFormula": "We + have not + V3 (forgotten) + Object",
        "situationContextHi": "कृतज्ञता और याद",
        "explanationHi": "Forget का V3 \"forgotten\" होता है। We के साथ have not आता है।",
        "vocabularyFocus": [
          "forget",
          "help"
        ]
      },
      {
        "id": "pp-prac-12",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "डॉक्टर ने सभी मरीजों की जांच कर ली है।",
        "expectedSentence": "The doctor has examined all the patients.",
        "acceptedAlternatives": [
          "The doctor has examined all the patients"
        ],
        "chips": [
          "The",
          "doctor",
          "has",
          "examined",
          "all",
          "the",
          "patients",
          "have"
        ],
        "structureFormula": "Subject + has + V3 (examined) + all the patients",
        "situationContextHi": "अस्पताल में कार्य समापन",
        "explanationHi": "The doctor एकवचन है इसलिए has + examined (V3) आया।",
        "vocabularyFocus": [
          "doctor",
          "examine",
          "patients"
        ]
      },
      {
        "id": "pp-prac-13",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उसने छात्रवृत्ति के लिए अपना आवेदन पहले ही जमा कर दिया है।",
        "expectedSentence": "She has already submitted her application for the scholarship.",
        "acceptedAlternatives": [
          "She has already submitted her application for the scholarship"
        ],
        "chips": [
          "She",
          "has",
          "already",
          "submitted",
          "her",
          "application",
          "for",
          "the",
          "scholarship"
        ],
        "structureFormula": "She + has + already + V3 (submitted) + Object + for scholarship",
        "situationContextHi": "शिक्षा और आवेदन",
        "explanationHi": "Already has और V3 क्रिया के बीच आता है: has already submitted।",
        "vocabularyFocus": [
          "already",
          "submit",
          "application",
          "scholarship"
        ]
      },
      {
        "id": "pp-prac-14",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपके रिश्तेदार स्टेशन पर सुरक्षित पहुंच गए हैं?",
        "expectedSentence": "Have your relatives arrived safely at the station?",
        "acceptedAlternatives": [
          "Have your relatives arrived safely at the station",
          "Have your relatives arrived safely at the station?"
        ],
        "chips": [
          "Have",
          "your",
          "relatives",
          "arrived",
          "safely",
          "at",
          "the",
          "station",
          "Has"
        ],
        "structureFormula": "Have + Plural Subject + V3 (arrived) + safely + at station?",
        "situationContextHi": "कुशलक्षेम पूछना",
        "explanationHi": "Your relatives बहुवचन है इसलिए Have + arrived आता है।",
        "vocabularyFocus": [
          "relatives",
          "arrive",
          "safely",
          "station"
        ]
      },
      {
        "id": "pp-prac-15",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "हमने अपने बगीचे में बीस पौधे लगाए हैं।",
        "expectedSentence": "We have planted twenty saplings in our garden.",
        "acceptedAlternatives": [
          "We have planted twenty saplings in our garden"
        ],
        "chips": [
          "We",
          "have",
          "planted",
          "twenty",
          "saplings",
          "in",
          "our",
          "garden"
        ],
        "structureFormula": "We + have + V3 (planted) + Object + in garden",
        "situationContextHi": "बागवानी का कार्य",
        "explanationHi": "Plant का V3 \"planted\" है। We के साथ have लगता है।",
        "vocabularyFocus": [
          "plant",
          "garden",
          "twenty"
        ]
      },
      {
        "id": "pp-prac-16",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "negative",
        "hindiPrompt": "उसने याद दिलाने के बावजूद मेरे ईमेल का उत्तर नहीं दिया है।",
        "expectedSentence": "He has not replied to my email despite reminders.",
        "acceptedAlternatives": [
          "He hasn't replied to my email despite reminders.",
          "He has not replied to my email despite reminders"
        ],
        "chips": [
          "He",
          "has",
          "not",
          "replied",
          "to",
          "my",
          "email",
          "despite",
          "reminders"
        ],
        "structureFormula": "He + has not + V3 (replied) + to email + despite reminders",
        "situationContextHi": "उत्तर न मिलना",
        "explanationHi": "He के साथ has not replied आता है।",
        "vocabularyFocus": [
          "reply",
          "email",
          "reminders"
        ]
      },
      {
        "id": "pp-prac-17",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "ट्रेन अभी-अभी प्लेटफॉर्म नंबर दो से रवाना हुई है।",
        "expectedSentence": "The train has just departed from platform two.",
        "acceptedAlternatives": [
          "The train has just departed from platform two",
          "The train has just departed from platform 2."
        ],
        "chips": [
          "The",
          "train",
          "has",
          "just",
          "departed",
          "from",
          "platform",
          "two"
        ],
        "structureFormula": "Subject + has + just + V3 (departed) + from platform",
        "situationContextHi": "अभी-अभी घटी घटना",
        "explanationHi": "अभी-अभी के लिए \"just\" has और V3 departed के बीच आता है।",
        "vocabularyFocus": [
          "train",
          "just",
          "depart",
          "platform"
        ]
      },
      {
        "id": "pp-prac-18",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "उन्होंने अपने कमरे को नए फर्नीचर से सजाया है।",
        "expectedSentence": "They have decorated their room with new furniture.",
        "acceptedAlternatives": [
          "They have decorated their room with new furniture"
        ],
        "chips": [
          "They",
          "have",
          "decorated",
          "their",
          "room",
          "with",
          "new",
          "furniture"
        ],
        "structureFormula": "They + have + V3 (decorated) + Object + with furniture",
        "situationContextHi": "कमरे की सजावट",
        "explanationHi": "They के साथ have + decorated आता है। Furniture हमेशा uncountably singular रहता है।",
        "vocabularyFocus": [
          "decorate",
          "room",
          "furniture"
        ]
      },
      {
        "id": "pp-prac-19",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "question",
        "hindiPrompt": "क्या आपने कभी उच्च शिक्षा के लिए विदेश यात्रा की है?",
        "expectedSentence": "Have you ever traveled abroad for higher education?",
        "acceptedAlternatives": [
          "Have you ever traveled abroad for higher education",
          "Have you ever traveled abroad for higher education?"
        ],
        "chips": [
          "Have",
          "you",
          "ever",
          "traveled",
          "abroad",
          "for",
          "higher",
          "education"
        ],
        "structureFormula": "Have + you + ever + V3 (traveled) + abroad + for education?",
        "situationContextHi": "जीवन का अनुभव (Life Experience)",
        "explanationHi": "जीवन के अनुभव पूछने के लिए \"Have you ever + V3\" का प्रयोग किया जाता है।",
        "vocabularyFocus": [
          "ever",
          "travel",
          "abroad",
          "education"
        ]
      },
      {
        "id": "pp-prac-20",
        "tenseKey": "present_perfect",
        "level": "practice",
        "formType": "positive",
        "hindiPrompt": "मैंने कल के लिए अपना सारा गृहकार्य पूरा कर लिया है।",
        "expectedSentence": "I have finished all my homework for tomorrow.",
        "acceptedAlternatives": [
          "I have finished all my homework for tomorrow"
        ],
        "chips": [
          "I",
          "have",
          "finished",
          "all",
          "my",
          "homework",
          "for",
          "tomorrow"
        ],
        "structureFormula": "I + have + V3 (finished) + all my homework + for tomorrow",
        "situationContextHi": "गृहकार्य पूरा होना",
        "explanationHi": "Have + finished से काम की पूर्णता और तैयारी का भाव है।",
        "vocabularyFocus": [
          "finish",
          "homework",
          "tomorrow"
        ]
      },
      {
        "id": "pp-chal-11",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "इंजीनियरिंग विभाग ने किसानों के लिए सौर सिंचाई प्रणाली विकसित की है।",
        "expectedSentence": "The engineering team has developed a solar irrigation system for farmers.",
        "acceptedAlternatives": [
          "The engineering team has developed a solar irrigation system for farmers"
        ],
        "chips": [
          "The",
          "engineering",
          "team",
          "has",
          "developed",
          "a",
          "solar",
          "irrigation",
          "system",
          "for",
          "farmers"
        ],
        "structureFormula": "Subject + has + V3 (developed) + Object + for farmers",
        "situationContextHi": "कृषि तकनीक नवाचार",
        "explanationHi": "The engineering team एकवचन संस्था है इसलिए has + developed आया।",
        "vocabularyFocus": [
          "engineering",
          "develop",
          "solar",
          "irrigation",
          "farmers"
        ]
      },
      {
        "id": "pp-chal-12",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "निवेशकों ने हाल ही में इस स्टार्टअप से अपना पैसा क्यों वापस ले लिया है?",
        "expectedSentence": "Why have investors recently withdrawn their funds from this startup?",
        "acceptedAlternatives": [
          "Why have investors recently withdrawn their funds from this startup",
          "Why have investors recently withdrawn their funds from this startup?"
        ],
        "chips": [
          "Why",
          "have",
          "investors",
          "recently",
          "withdrawn",
          "their",
          "funds",
          "from",
          "this",
          "startup"
        ],
        "structureFormula": "Why + have + Plural Subject + recently + V3 (withdrawn) + Object?",
        "situationContextHi": "व्यावसायिक निवेश",
        "explanationHi": "Withdraw का V3 \"withdrawn\" होता है। Investors बहुवचन है इसलिए have लगा।",
        "vocabularyFocus": [
          "investors",
          "recently",
          "withdraw",
          "funds",
          "startup"
        ]
      },
      {
        "id": "pp-chal-13",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "शोध दल ने संक्रमण के इलाज पर अभूतपूर्व निष्कर्ष प्रकाशित किए हैं।",
        "expectedSentence": "The research team has published breakthrough findings on treating infections.",
        "acceptedAlternatives": [
          "The research team has published breakthrough findings on treating infections"
        ],
        "chips": [
          "The",
          "research",
          "team",
          "has",
          "published",
          "breakthrough",
          "findings",
          "on",
          "treating",
          "infections"
        ],
        "structureFormula": "Subject + has + V3 (published) + Object + on gerund phrase",
        "situationContextHi": "चिकित्सा अनुसंधान",
        "explanationHi": "The research team के साथ has + published आता है।",
        "vocabularyFocus": [
          "research",
          "publish",
          "breakthrough",
          "infections"
        ]
      },
      {
        "id": "pp-chal-14",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "negative",
        "hindiPrompt": "उसने राजनीतिक दबाव के बावजूद अपनी निष्पक्षता से समझौता नहीं किया है।",
        "expectedSentence": "She has not compromised her integrity despite political pressure.",
        "acceptedAlternatives": [
          "She hasn't compromised her integrity despite political pressure.",
          "She has not compromised her integrity despite political pressure"
        ],
        "chips": [
          "She",
          "has",
          "not",
          "compromised",
          "her",
          "integrity",
          "despite",
          "political",
          "pressure"
        ],
        "structureFormula": "She + has not + V3 (compromised) + Object + despite phrase",
        "situationContextHi": "नैतिक मूल्य और पत्रकारिता",
        "explanationHi": "Has not compromised से वर्तमान तक की सत्यनिष्ठा का बोध होता है।",
        "vocabularyFocus": [
          "compromise",
          "integrity",
          "political",
          "pressure"
        ]
      },
      {
        "id": "pp-chal-15",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "क्या जलवायु सम्मेलनों से अब तक कार्बन उत्सर्जन में वास्तविक कमी आई है?",
        "expectedSentence": "Have climate summits produced real reductions in carbon emissions so far?",
        "acceptedAlternatives": [
          "Have climate summits produced real reductions in carbon emissions so far",
          "Have climate summits produced real reductions in carbon emissions so far?"
        ],
        "chips": [
          "Have",
          "climate",
          "summits",
          "produced",
          "real",
          "reductions",
          "in",
          "carbon",
          "emissions",
          "so",
          "far"
        ],
        "structureFormula": "Have + Plural Subject + V3 (produced) + Object + so far?",
        "situationContextHi": "वैश्विक पर्यावरण बहस",
        "explanationHi": "So far (अब तक) के साथ Present Perfect (Have climate summits produced) आता है।",
        "vocabularyFocus": [
          "climate",
          "summits",
          "produce",
          "emissions",
          "so far"
        ]
      },
      {
        "id": "pp-chal-16",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "नगरपालिका ने शहर में तीन नए पैदल पुलों का निर्माण पूरा कर लिया है।",
        "expectedSentence": "The municipality has completed the construction of three new pedestrian bridges.",
        "acceptedAlternatives": [
          "The municipality has completed the construction of three new pedestrian bridges"
        ],
        "chips": [
          "The",
          "municipality",
          "has",
          "completed",
          "the",
          "construction",
          "of",
          "three",
          "new",
          "pedestrian",
          "bridges"
        ],
        "structureFormula": "Subject + has + V3 (completed) + Object of noun phrase",
        "situationContextHi": "शहरी बुनियादी ढांचा",
        "explanationHi": "The municipality एकवचन है इसलिए has completed आया।",
        "vocabularyFocus": [
          "municipality",
          "complete",
          "construction",
          "pedestrian",
          "bridges"
        ]
      },
      {
        "id": "pp-chal-17",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "question",
        "hindiPrompt": "प्रशासन ने इस सत्र में अनिवार्य कंप्यूटर पाठ्यक्रम शुरू करने का फैसला क्यों किया है?",
        "expectedSentence": "Why has the administration decided to introduce mandatory digital courses this term?",
        "acceptedAlternatives": [
          "Why has the administration decided to introduce mandatory digital courses this term",
          "Why has the administration decided to introduce mandatory digital courses this term?"
        ],
        "chips": [
          "Why",
          "has",
          "the",
          "administration",
          "decided",
          "to",
          "introduce",
          "mandatory",
          "digital",
          "courses",
          "this",
          "term"
        ],
        "structureFormula": "Why + has + Subject + V3 (decided) + Infinitive + Object?",
        "situationContextHi": "शैक्षणिक नीति",
        "explanationHi": "Why has the administration decided में decide का V3 \"decided\" है।",
        "vocabularyFocus": [
          "administration",
          "decide",
          "mandatory",
          "digital",
          "courses"
        ]
      },
      {
        "id": "pp-chal-18",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "उन्होंने पिछले सात वर्षों में क्लाउड कंप्यूटिंग में व्यापक अनुभव प्राप्त किया है।",
        "expectedSentence": "He has gained extensive expertise in cloud computing over seven years.",
        "acceptedAlternatives": [
          "He has gained extensive expertise in cloud computing over seven years",
          "He has gained extensive expertise in cloud computing over the past seven years."
        ],
        "chips": [
          "He",
          "has",
          "gained",
          "extensive",
          "expertise",
          "in",
          "cloud",
          "computing",
          "over",
          "seven",
          "years"
        ],
        "structureFormula": "He + has + V3 (gained) + Object + over time period",
        "situationContextHi": "पेशेवर महारत",
        "explanationHi": "He के साथ has gained आता है। Over seven years समय अवधि को दर्शाता है।",
        "vocabularyFocus": [
          "gain",
          "extensive",
          "expertise",
          "computing"
        ]
      },
      {
        "id": "pp-chal-19",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "संस्थान ने समुद्र तट पर हजारों लुप्तप्राय कछुओं की रक्षा की है।",
        "expectedSentence": "The foundation has protected thousands of endangered sea turtles along the coast.",
        "acceptedAlternatives": [
          "The foundation has protected thousands of endangered sea turtles along the coast"
        ],
        "chips": [
          "The",
          "foundation",
          "has",
          "protected",
          "thousands",
          "of",
          "endangered",
          "sea",
          "turtles",
          "along",
          "the",
          "coast"
        ],
        "structureFormula": "Subject + has + V3 (protected) + Object + along coast",
        "situationContextHi": "वन्यजीव संरक्षण",
        "explanationHi": "The foundation एकवचन है इसलिए has protected आया।",
        "vocabularyFocus": [
          "foundation",
          "protect",
          "endangered",
          "turtles",
          "coast"
        ]
      },
      {
        "id": "pp-chal-20",
        "tenseKey": "present_perfect",
        "level": "challenge",
        "formType": "positive",
        "hindiPrompt": "आर्थिक सुधारों ने दूरसंचार क्षेत्र में विदेशी निवेश में काफी वृद्धि की है।",
        "expectedSentence": "Economic reforms have substantially increased foreign investment in telecommunications.",
        "acceptedAlternatives": [
          "Economic reforms have substantially increased foreign investment in telecommunications"
        ],
        "chips": [
          "Economic",
          "reforms",
          "have",
          "substantially",
          "increased",
          "foreign",
          "investment",
          "in",
          "telecommunications"
        ],
        "structureFormula": "Plural Subject + have + Adverb + V3 (increased) + Object + in field",
        "situationContextHi": "अर्थव्यवस्था और विकास",
        "explanationHi": "Economic reforms बहुवचन है इसलिए have substantially increased आया।",
        "vocabularyFocus": [
          "reforms",
          "substantially",
          "increase",
          "investment",
          "telecommunications"
        ]
      }
    ]
  }
};
