import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2,
  RotateCcw,
  Mic,
  MicOff,
  CheckCircle2,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  Eye,
  EyeOff,
  Sparkles,
  Gauge,
  Flame,
  Award,
  BookOpen,
  VolumeX,
  Play,
  Square,
  AlertCircle,
  HelpCircle,
  Layers,
  Check,
} from 'lucide-react';
import { AppSettings, VocabularyWord } from '../types/learning';
import { ttsService } from '../services/ttsService';
import { speechRecorder } from '../services/sttService';
import { generateGrammaticallySoundExercises } from '../utils/sentenceGrammarEngine';

export type ShadowingLevel = 'beginner' | 'practice' | 'challenge';

export interface ListeningSentenceItem {
  id: string;
  en: string;
  hi: string;
  level: ShadowingLevel;
  category: 'greetings' | 'introductions' | 'food' | 'family' | 'school' | 'shopping' | 'help' | 'daily' | 'saved_vocab';
  categoryHi: string;
  contextHi?: string;
  focusWord?: string;
  phoneticHi?: string;
}

// Beginner, Practice, and Challenge curated everyday sentences
const CURATED_LISTENING_SENTENCES: ListeningSentenceItem[] = [
  // BEGINNER - Greetings & Introductions
  {
    id: 'b-greet-1',
    en: 'Hello, how are you?',
    hi: 'नमस्ते, आप कैसे हैं?',
    level: 'beginner',
    category: 'greetings',
    categoryHi: 'अभिवादन (Greetings)',
    contextHi: 'किसी से मिलते समय सामान्य अभिवादन',
    phoneticHi: 'हैलो, हाउ आर यू?',
  },
  {
    id: 'b-greet-2',
    en: 'I am fine, thank you.',
    hi: 'मैं ठीक हूँ, धन्यवाद।',
    level: 'beginner',
    category: 'greetings',
    categoryHi: 'अभिवादन (Greetings)',
    contextHi: 'हाल-चाल का विनम्र उत्तर देना',
    phoneticHi: 'आई एम फाइन, थैंक यू।',
  },
  {
    id: 'b-greet-3',
    en: 'Good morning, have a nice day!',
    hi: 'शुभ प्रभात, आपका दिन शुभ हो!',
    level: 'beginner',
    category: 'greetings',
    categoryHi: 'अभिवादन (Greetings)',
    contextHi: 'सुबह की शुभकामना देना',
    phoneticHi: 'गुड मॉर्निंग, हैव अ नाइस डे!',
  },
  {
    id: 'b-intro-1',
    en: 'My name is Amit.',
    hi: 'मेरा नाम अमित है।',
    level: 'beginner',
    category: 'introductions',
    categoryHi: 'परिचय (Introductions)',
    contextHi: 'अपना नाम बताना',
    phoneticHi: 'माई नेम इज़ अमित।',
  },
  {
    id: 'b-intro-2',
    en: 'Nice to meet you.',
    hi: 'आपसे मिलकर बहुत खुशी हुई।',
    level: 'beginner',
    category: 'introductions',
    categoryHi: 'परिचय (Introductions)',
    contextHi: 'नए व्यक्ति से मिलते समय शिष्टाचार',
    phoneticHi: 'नाइस टू मीट यू।',
  },
  {
    id: 'b-intro-3',
    en: 'I am from Delhi.',
    hi: 'मैं दिल्ली से हूँ।',
    level: 'beginner',
    category: 'introductions',
    categoryHi: 'परिचय (Introductions)',
    contextHi: 'अपना शहर या मूल स्थान बताना',
    phoneticHi: 'आई एम फ्रॉम डेली।',
  },

  // BEGINNER - Food & Dining
  {
    id: 'b-food-1',
    en: 'I like hot tea.',
    hi: 'मुझे गर्म चाय पसंद है।',
    level: 'beginner',
    category: 'food',
    categoryHi: 'खान-पान (Food)',
    contextHi: 'पसंदीदा पेय बताना',
    phoneticHi: 'आई लाइक हॉट टी।',
  },
  {
    id: 'b-food-2',
    en: 'Please give me a glass of water.',
    hi: 'कृपया मुझे एक गिलास पानी दीजिए।',
    level: 'beginner',
    category: 'food',
    categoryHi: 'खान-पान (Food)',
    contextHi: 'विनम्रता से पानी मांगना',
    phoneticHi: 'प्लीज़ गिव मी अ ग्लास ऑफ़ वॉटर।',
  },
  {
    id: 'b-food-3',
    en: 'The food is very delicious.',
    hi: 'खाना बहुत स्वादिष्ट है।',
    level: 'beginner',
    category: 'food',
    categoryHi: 'खान-पान (Food)',
    contextHi: 'भोजन की प्रशंसा करना',
    phoneticHi: 'द फ़ूड इज़ वेरी डेलिशस।',
  },
  {
    id: 'b-food-4',
    en: 'I eat fresh fruits every morning.',
    hi: 'मैं रोज़ सुबह ताज़े फल खाता हूँ।',
    level: 'beginner',
    category: 'food',
    categoryHi: 'खान-पान (Food)',
    contextHi: 'स्वस्थ खान-पान की आदत बताना',
    phoneticHi: 'आई ईट फ्रेश फ्रूट्स एव्री मॉर्निंग।',
  },

  // BEGINNER - Family & Home
  {
    id: 'b-fam-1',
    en: 'This is my family.',
    hi: 'यह मेरा परिवार है।',
    level: 'beginner',
    category: 'family',
    categoryHi: 'परिवार (Family)',
    contextHi: 'परिवार का परिचय कराना',
    phoneticHi: 'दिस इज़ माई फ़ैमिली।',
  },
  {
    id: 'b-fam-2',
    en: 'I live with my parents.',
    hi: 'मैं अपने माता-पिता के साथ रहता हूँ।',
    level: 'beginner',
    category: 'family',
    categoryHi: 'परिवार (Family)',
    contextHi: 'रहने का विवरण देना',
    phoneticHi: 'आई लिव विद माई पेरेंट्स।',
  },
  {
    id: 'b-fam-3',
    en: 'My mother is a teacher.',
    hi: 'मेरी माँ एक शिक्षिका हैं।',
    level: 'beginner',
    category: 'family',
    categoryHi: 'परिवार (Family)',
    contextHi: 'परिवार के सदस्य का पेशा बताना',
    phoneticHi: 'माई मदर इज़ अ टीचर।',
  },
  {
    id: 'b-fam-4',
    en: 'We are very happy together.',
    hi: 'हम एक साथ बहुत खुश हैं।',
    level: 'beginner',
    category: 'family',
    categoryHi: 'परिवार (Family)',
    contextHi: 'परिवार की भावना व्यक्त करना',
    phoneticHi: 'वी आर वेरी हैप्पी टुगेदर।',
  },

  // BEGINNER - School & Daily Routine
  {
    id: 'b-sch-1',
    en: 'I wake up at six o’clock.',
    hi: 'मैं सुबह छह बजे उठता हूँ।',
    level: 'beginner',
    category: 'school',
    categoryHi: 'दिनचर्या (Daily Routine)',
    contextHi: 'सुबह उठने का समय बताना',
    phoneticHi: 'आई वेक अप एट सिक्स ओ क्लॉक।',
  },
  {
    id: 'b-sch-2',
    en: 'He reads a book every night.',
    hi: 'वह हर रात एक किताब पढ़ता है।',
    level: 'beginner',
    category: 'school',
    categoryHi: 'दिनचर्या (Daily Routine)',
    contextHi: 'रात में पढ़ने की आदत',
    phoneticHi: 'ही रीड्स अ बुक एव्री नाइट।',
  },
  {
    id: 'b-sch-3',
    en: 'The students are sitting in the classroom.',
    hi: 'छात्र कक्षा में बैठे हैं।',
    level: 'beginner',
    category: 'school',
    categoryHi: 'स्कूल (School)',
    contextHi: 'कक्षा का दृश्य बताना',
    phoneticHi: 'द स्टूडेंट्स आर सिटिंग इन द क्लासरूम।',
  },

  // BEGINNER - Shopping & Asking for Help
  {
    id: 'b-shop-1',
    en: 'How much is this book?',
    hi: 'यह किताब कितने की है?',
    level: 'beginner',
    category: 'shopping',
    categoryHi: 'खरीददारी (Shopping)',
    contextHi: 'दुकानदार से कीमत पूछना',
    phoneticHi: 'हाउ मच इज़ दिस बुक?',
  },
  {
    id: 'b-shop-2',
    en: 'Can you please help me?',
    hi: 'क्या आप कृपया मेरी मदद कर सकते हैं?',
    level: 'beginner',
    category: 'help',
    categoryHi: 'मदद मांगना (Asking for Help)',
    contextHi: 'विनम्रता से सहायता का अनुरोध',
    phoneticHi: 'कैन यू प्लीज़ हेल्प मी?',
  },
  {
    id: 'b-shop-3',
    en: 'Where is the bus stop?',
    hi: 'बस स्टॉप कहाँ है?',
    level: 'beginner',
    category: 'help',
    categoryHi: 'मदद मांगना (Asking for Help)',
    contextHi: 'रास्ते की जानकारी पूछना',
    phoneticHi: 'व्हेयर इज़ द बस स्टॉप?',
  },
  {
    id: 'b-shop-4',
    en: 'Excuse me, what time is it now?',
    hi: 'माफ़ कीजिए, अभी क्या समय हुआ है?',
    level: 'beginner',
    category: 'help',
    categoryHi: 'मदद मांगना (Asking for Help)',
    contextHi: 'समय पूछना',
    phoneticHi: 'एक्सक्यूज़ मी, व्हॉट टाइम इज़ इट नाउ?',
  },

  // PRACTICE LEVEL - Slightly Longer Daily Conversation Sentences
  {
    id: 'p-daily-1',
    en: 'I usually wake up early and go for a morning walk in the park.',
    hi: 'मैं आमतौर पर जल्दी उठता हूँ और पार्क में सुबह की सैर पर जाता हूँ।',
    level: 'practice',
    category: 'daily',
    categoryHi: 'दैनिक बातचीत (Daily Life)',
    contextHi: 'अपनी रोज़ की स्वस्थ दिनचर्या साझा करना',
    phoneticHi: 'आई यूज़ुअली वेक अप अर्ली एंड गो फ़ॉर अ मॉर्निंग वॉक इन द पार्क।',
  },
  {
    id: 'p-daily-2',
    en: 'Could you please tell me how to reach the nearest bank?',
    hi: 'क्या आप कृपया मुझे बता सकते हैं कि निकटतम बैंक कैसे पहुँचना है?',
    level: 'practice',
    category: 'help',
    categoryHi: 'मदद व दिशा (Directions)',
    contextHi: 'सड़क पर किसी से रास्ता पूछना',
    phoneticHi: 'कुड यू प्लीज़ टेल मी हाउ टू रीच द नियरेस्ट बैंक?',
  },
  {
    id: 'p-daily-3',
    en: 'I need to buy some fresh vegetables and fruits from the market.',
    hi: 'मुझे बाज़ार से कुछ ताज़ी सब्ज़ियाँ और फल खरीदने की ज़रूरत है।',
    level: 'practice',
    category: 'shopping',
    categoryHi: 'खरीददारी (Shopping)',
    contextHi: 'बाज़ार जाने की योजना बताना',
    phoneticHi: 'आई नीड टू बाय सम फ्रेश वेजिटेबल्स एंड फ्रूट्स फ्रॉम द मार्केट।',
  },
  {
    id: 'p-daily-4',
    en: 'My friend is preparing for an important examination this week.',
    hi: 'मेरा दोस्त इस हफ़्ते एक महत्वपूर्ण परीक्षा की तैयारी कर रहा है।',
    level: 'practice',
    category: 'school',
    categoryHi: 'अध्ययन (Studies)',
    contextHi: 'दोस्त की पढ़ाई के बारे में बताना',
    phoneticHi: 'माई फ्रेंड इज़ प्रिपेयरिंग फ़ॉर एन इम्पोर्टेंट एग्ज़ामिनेशन दिस वीक।',
  },
  {
    id: 'p-daily-5',
    en: 'Let us meet in the evening and have a cup of tea together.',
    hi: 'आइए शाम को मिलते हैं और साथ में एक कप चाय पीते हैं।',
    level: 'practice',
    category: 'food',
    categoryHi: 'मिलन व बातचीत (Social)',
    contextHi: 'दोस्त को मिलने व चाय पीने का आमंत्रण',
    phoneticHi: 'लेट अस मीट इन द इवनिंग एंड हैव अ कप ऑफ़ टी टुगेदर।',
  },
  {
    id: 'p-daily-6',
    en: 'I do not drink cold water when I have a cough.',
    hi: 'जब मुझे खाँसी होती है तो मैं ठंडा पानी नहीं पीता।',
    level: 'practice',
    category: 'food',
    categoryHi: 'स्वास्थ्य व आदत (Health)',
    contextHi: 'स्वास्थ्य संबंधी सावधानी व्यक्त करना',
    phoneticHi: 'आई डू नॉट ड्रिंक कोल्ड वॉटर व्हेन आई हैव अ कफ़।',
  },

  // CHALLENGE LEVEL - Natural Conversations with More Detail
  {
    id: 'c-adv-1',
    en: 'If you have any difficulty with your lessons, please feel free to ask me anytime.',
    hi: 'यदि आपको अपने पाठ में कोई भी कठिनाई हो, तो कृपया किसी भी समय मुझसे बेझिझक पूछें।',
    level: 'challenge',
    category: 'help',
    categoryHi: 'सहानुभूति व सहायता (Support)',
    contextHi: 'किसी को सहजता से सहायता की पेशकश करना',
    phoneticHi: 'इफ़ यू हैव एनी डिफ़िकल्टी विद योर लेसन्स, प्लीज़ फ़ील फ्री टू आस्क मी एनीटाइम।',
  },
  {
    id: 'c-adv-2',
    en: 'Although it was raining heavily outside, we managed to reach the office on time.',
    hi: 'हालाँकि बाहर भारी बारिश हो रही थी, फिर भी हम समय पर दफ़्तर पहुँचने में सफल रहे।',
    level: 'challenge',
    category: 'daily',
    categoryHi: 'अनुभव साझा करना (Stories)',
    contextHi: 'विपरीत परिस्थितियों के बावजूद काम पूरा होने का विवरण',
    phoneticHi: 'ऑलदो इट वॉज़ रेनिंग हेविली आउटसाइड, वी मैनेज्ड टू रीच द ऑफ़िस ऑन टाइम।',
  },
  {
    id: 'c-adv-3',
    en: 'Which train goes directly to the central station without stopping at every stop?',
    hi: 'कौन सी ट्रेन हर स्टेशन पर रुके बिना सीधे सेंट्रल स्टेशन जाती है?',
    level: 'challenge',
    category: 'help',
    categoryHi: 'यात्रा व स्टेशन (Travel)',
    contextHi: 'रेलवे स्टेशन पर सीधी ट्रेन की पूछताछ',
    phoneticHi: 'व्हिच ट्रेन गोज़ डाइरेक्टली टू द सेंट्रल स्टेशन विदाउट स्टॉपिंग एट एव्री स्टॉप?',
  },
  {
    id: 'c-adv-4',
    en: 'Unless you practice speaking English aloud every single day, it is difficult to build confidence.',
    hi: 'जब तक आप रोज़ाना अंग्रेज़ी ज़ोर से बोलने का अभ्यास नहीं करेंगे, आत्मविश्वास बनाना कठिन होगा।',
    level: 'challenge',
    category: 'school',
    categoryHi: 'सीखने की सलाह (Learning Tip)',
    contextHi: 'भाषा सीखने के लिए निरंतर अभ्यास का महत्व समझाना',
    phoneticHi: 'अनलेस यू प्रैक्टिस स्पीकिंग इंग्लिश अलाउड एव्री सिंगल डे, इट इज़ डिफ़िकल्ट टू बिल्ड कॉन्फ़िडेंस।',
  },
  {
    id: 'c-adv-5',
    en: 'I would really appreciate it if you could kindly share your notes with me before tomorrow.',
    hi: 'मैं वास्तव में बहुत आभारी रहूँगा यदि आप कल से पहले अपने नोट्स मेरे साथ साझा कर सकें।',
    level: 'challenge',
    category: 'school',
    categoryHi: 'विनम्र अनुरोध (Polite Request)',
    contextHi: 'औपचारिक व विनम्र शैली में सामग्री मांगना',
    phoneticHi: 'आई वुड रियली अप्रिशिएट इट इफ़ यू कुड काइंडली शेयर योर नोट्स विद मी बिफ़ोर टुमॉरो।',
  },
];

interface ListeningShadowingStudioProps {
  words?: VocabularyWord[];
  settings: AppSettings;
  onSentencePracticed?: (sentenceEn: string) => void;
  onSessionCompleted?: (passageId: string, score: number) => void;
  onBackToLearnMenu?: () => void;
}

export const ListeningShadowingStudio: React.FC<ListeningShadowingStudioProps> = ({
  words = [],
  settings,
  onSentencePracticed,
  onSessionCompleted,
  onBackToLearnMenu,
}) => {
  // Navigation & Filter states
  const [selectedLevel, setSelectedLevel] = useState<ShadowingLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [useSavedVocab, setUseSavedVocab] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Text visibility toggles (for active listening tests)
  const [showEnglishText, setShowEnglishText] = useState<boolean>(true);
  const [showHindiText, setShowHindiText] = useState<boolean>(true);
  const [showPhonetic, setShowPhonetic] = useState<boolean>(true);

  // 4-Step Shadowing sequence: 1 = Listen, 2 = Notice Rhythm, 3 = Speak Aloud, 4 = Speak Along
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Audio Playback states
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow'>('normal');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Microphone recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Session stats with localStorage persistence
  const SHADOWING_STORAGE_KEY = 'bhashaguru_shadowing_completed_ids_v1';
  const [completedSentenceIds, setCompletedSentenceIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SHADOWING_STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [todayPracticedCount, setTodayPracticedCount] = useState<number>(0);
  const [hasActivityCompletedForCurrentSentence, setHasActivityCompletedForCurrentSentence] = useState<boolean>(false);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  // Sync completed IDs
  useEffect(() => {
    try {
      localStorage.setItem(SHADOWING_STORAGE_KEY, JSON.stringify(Array.from(completedSentenceIds)));
    } catch {
      // ignore
    }
  }, [completedSentenceIds]);

  // Generate saved vocabulary sentences dynamically
  const savedVocabSentences = useMemo<ListeningSentenceItem[]>(() => {
    if (!words || words.length === 0) return [];
    const items: ListeningSentenceItem[] = [];
    const sampleWords = words.slice(0, 50);

    for (let i = 0; i < sampleWords.length; i++) {
      const w = sampleWords[i];
      try {
        const exercises = generateGrammaticallySoundExercises(w.word, w.hindiMeaning);
        const list = [
          ...(exercises.beginner || []),
          ...(exercises.practice || []),
          ...(exercises.challenge || []),
        ];
        if (list.length > 0) {
          const ex = list[0];
          items.push({
            id: `sv-${w.id || i}-${w.word}`,
            en: ex.exampleSentenceEn || ex.expectedSentence,
            hi: ex.exampleSentenceHi || ex.hindiPrompt,
            level: ex.level || 'beginner',
            category: 'saved_vocab',
            categoryHi: 'मेरी शब्दावली (Saved Word)',
            contextHi: `शब्द "${w.word}" (${w.hindiMeaning}) पर आधारित प्राकृतिक वाक्य`,
            focusWord: w.word,
            phoneticHi: w.phoneticHindi || undefined,
          });
        }
      } catch {
        // Safe fallback to simple sentence if available
        if (w.simpleSentence && !w.simpleSentence.includes('[') && w.simpleSentence.length > 5) {
          items.push({
            id: `sv-${w.id || i}-${w.word}`,
            en: w.simpleSentence,
            hi: w.hindiMeaning,
            level: 'beginner',
            category: 'saved_vocab',
            categoryHi: 'मेरी शब्दावली (Saved Word)',
            focusWord: w.word,
            phoneticHi: w.phoneticHindi || undefined,
          });
        }
      }
    }
    return items;
  }, [words]);

  // Combine curated and saved vocabulary sentences based on toggle
  const allAvailableSentences = useMemo<ListeningSentenceItem[]>(() => {
    if (useSavedVocab && savedVocabSentences.length > 0) {
      return savedVocabSentences;
    }
    return CURATED_LISTENING_SENTENCES;
  }, [useSavedVocab, savedVocabSentences]);

  // Filtered sentences based on Level and Category
  const filteredSentences = useMemo<ListeningSentenceItem[]>(() => {
    return allAvailableSentences.filter((s) => {
      const matchLevel = selectedLevel === 'all' || s.level === selectedLevel;
      const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchLevel && matchCategory;
    });
  }, [allAvailableSentences, selectedLevel, selectedCategory]);

  // Safe current sentence
  const currentSentence: ListeningSentenceItem | undefined =
    filteredSentences.length > 0
      ? filteredSentences[currentIndex % filteredSentences.length]
      : allAvailableSentences[0];

  // Subscribe to TTS state to show live animation
  useEffect(() => {
    const unsubscribe = ttsService.subscribeState((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      ttsService.stop();
      speechRecorder.stop();
    };
  }, []);

  // Reset steps & recording when changing sentence
  useEffect(() => {
    setActiveStep(1);
    setSpokenTranscript('');
    setRecordedAudioUrl(null);
    setAudioError(null);
    setRecordingError(null);
    setHasActivityCompletedForCurrentSentence(false);
    setCompletionNotice(null);
  }, [currentIndex, selectedLevel, selectedCategory, useSavedVocab]);

  // Play audio safely with real TTS check
  const handlePlayAudio = (speed: 'normal' | 'slow' = playbackSpeed) => {
    if (!currentSentence) return;
    setAudioError(null);
    setHasActivityCompletedForCurrentSentence(true);

    // Verify if speech synthesis is present in browser or backend is accessible
    const hasBrowserTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (!hasBrowserTTS && settings.ttsProvider !== 'gemini-tts') {
      setAudioError(
        'ऑडियो इंजन वर्तमान ब्राउज़र में उपलब्ध नहीं है। कृपया आधुनिक ब्राउज़र (Chrome/Edge/Safari) का उपयोग करें।'
      );
      return;
    }

    try {
      ttsService.speak(currentSentence.en, settings, speed);
    } catch (err: any) {
      setAudioError('ऑडियो चलाने में समस्या आई: ' + (err?.message || 'कृपया दोबारा प्रयास करें।'));
    }
  };

  // Shadowing step action handler
  const handleStepClick = (stepNum: 1 | 2 | 3 | 4) => {
    setActiveStep(stepNum);
    setHasActivityCompletedForCurrentSentence(true);
    if (stepNum === 1) {
      handlePlayAudio('normal');
    } else if (stepNum === 2) {
      handlePlayAudio('slow');
    } else if (stepNum === 4) {
      // Speak along: play normal audio so learner speaks in unison
      handlePlayAudio('normal');
    }
  };

  // Toggle voice recording
  const handleToggleRecord = async () => {
    setRecordingError(null);
    if (isRecording) {
      try {
        const res = await speechRecorder.stop();
        setIsRecording(false);
        setHasActivityCompletedForCurrentSentence(true);
        if (res.transcript) {
          setSpokenTranscript(res.transcript);
        }
        if (res.audioDataUrl) {
          setRecordedAudioUrl(res.audioDataUrl);
        }
      } catch (err: any) {
        setIsRecording(false);
        setRecordingError('रिकॉर्डिंग रोकने में त्रुटि: ' + (err?.message || ''));
      }
    } else {
      setSpokenTranscript('');
      setRecordedAudioUrl(null);
      const ok = await speechRecorder.start(
        (interim) => setSpokenTranscript(interim),
        (errMsg) => {
          setRecordingError(errMsg);
          setIsRecording(false);
        }
      );
      if (ok) {
        setIsRecording(true);
      } else {
        setRecordingError(
          'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति (Permission) दें।'
        );
      }
    }
  };

  // Mark sentence completed only after learner has completed listening/shadowing
  const handleMarkCompleted = () => {
    if (!currentSentence) return;
    const isAlreadyCompleted = completedSentenceIds.has(currentSentence.id);

    if (!hasActivityCompletedForCurrentSentence && !isAlreadyCompleted) {
      setCompletionNotice('कृपया पहले इस वाक्य को सुनें या बोलकर अभ्यास करें, फिर "पूरा हुआ" दबाएं।');
      return;
    }

    setCompletedSentenceIds((prev) => new Set(prev).add(currentSentence.id));
    if (!isAlreadyCompleted) {
      setTodayPracticedCount((prev) => prev + 1);
    }
    setCompletionNotice('शाबाश! आपने यह वाक्य पूरा कर लिया है। 🎉');
    onSentencePracticed?.(currentSentence.en);
  };

  // Next / Previous navigation
  const handleNextSentence = () => {
    if (filteredSentences.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredSentences.length);
    }
  };

  const handlePrevSentence = () => {
    if (filteredSentences.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredSentences.length) % filteredSentences.length);
    }
  };

  const handleShuffle = () => {
    if (filteredSentences.length > 1) {
      let nextIdx = Math.floor(Math.random() * filteredSentences.length);
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % filteredSentences.length;
      }
      setCurrentIndex(nextIdx);
    }
  };

  if (!currentSentence) {
    return (
      <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <Headphones className="w-12 h-12 text-cyan-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">कोई वाक्य नहीं मिला</h3>
        <p className="text-sm text-slate-400 font-hindi">
          कृपया फ़िल्टर रीसेट करें या कोई अन्य श्रेणी चुनें।
        </p>
        <button
          type="button"
          onClick={() => {
            setSelectedLevel('all');
            setSelectedCategory('all');
            setUseSavedVocab(false);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
        >
          सभी वाक्य दिखाएं
        </button>
      </div>
    );
  }

  const isCompleted = completedSentenceIds.has(currentSentence.id);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shadow-xs">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Listening & Shadowing
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
                  सुनो और बोलो
                </span>
              </div>
              <p className="text-xs text-slate-400 font-hindi mt-1">
                पहले ध्यान से सुनें, लय और सुर को समझें, फिर साथ-साथ बोलकर स्वाभाविक प्रवाह बनाएं।
              </p>
            </div>
          </div>

          {/* Stats & Practice Count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#07172b] border border-slate-800 px-3.5 py-2 rounded-2xl">
              <Flame className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">अभ्यास किए गए वाक्य: </span>
                <strong className="text-white font-mono">{todayPracticedCount}</strong>
              </div>
            </div>

            {onBackToLearnMenu && (
              <button
                type="button"
                onClick={onBackToLearnMenu}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                वापस मेनू
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls: Level & Source */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono text-slate-400 mr-1">स्तर:</span>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-400 border border-slate-800'
              }`}
            >
              सभी स्तर ({allAvailableSentences.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('beginner');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'beginner'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-400 border border-slate-800'
              }`}
            >
              Beginner (शुरुआती)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('practice');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'practice'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-400 border border-slate-800'
              }`}
            >
              Practice (मध्यम)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('challenge');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'challenge'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-[#0e1d35] hover:bg-[#142642] text-slate-400 border border-slate-800'
              }`}
            >
              Challenge (कठिन)
            </button>
          </div>

          {/* Saved Vocabulary Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUseSavedVocab(!useSavedVocab);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                useSavedVocab
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                  : 'bg-[#0e1d35] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>मेरी शब्दावली से ({savedVocabSentences.length} शब्द)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Interactive Card */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold uppercase">
              {currentSentence.level}
            </span>
            <span className="text-xs text-slate-400 font-hindi">
              {currentSentence.categoryHi}
            </span>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> अभ्यास पूर्ण
              </span>
            )}
          </div>

          {/* Speed & Text Visibility Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Playback speed toggle */}
            <div className="flex items-center gap-1 bg-[#07172b] p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <button
                type="button"
                onClick={() => setPlaybackSpeed('normal')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  playbackSpeed === 'normal'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1.0x सामान्य
              </button>
              <button
                type="button"
                onClick={() => setPlaybackSpeed('slow')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  playbackSpeed === 'slow'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                0.75x धीमा
              </button>
            </div>

            {/* Visibility Toggles */}
            <button
              type="button"
              onClick={() => setShowEnglishText(!showEnglishText)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showEnglishText
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-transparent border-slate-800 text-slate-500'
              }`}
              title="अंग्रेज़ी टेक्स्ट दिखाएं या छिपाएं"
            >
              {showEnglishText ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">English</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHindiText(!showHindiText)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showHindiText
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-transparent border-slate-800 text-slate-500'
              }`}
              title="हिंदी अर्थ दिखाएं या छिपाएं"
            >
              {showHindiText ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">हिंदी</span>
            </button>
          </div>
        </div>

        {/* 4-Step Shadowing Sequence Flow */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-hindi px-1">
            <span>शैडोइंग की 4-चरणीय वैज्ञानिक विधि (4-Step Shadowing Method):</span>
            <span className="font-mono text-cyan-400 font-bold">चरण {activeStep} / 4</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeStep === 1
                  ? 'bg-cyan-950/90 border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-sm'
                  : 'bg-[#0e1d35] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-cyan-400">Step 1</div>
              <div className="text-xs font-bold text-white mt-0.5">पूरा वाक्य सुनें</div>
              <div className="text-[10px] text-slate-400 font-hindi mt-1">सामान्य गति में ध्यान से सुनें</div>
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeStep === 2
                  ? 'bg-cyan-950/90 border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-sm'
                  : 'bg-[#0e1d35] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-cyan-400">Step 2</div>
              <div className="text-xs font-bold text-white mt-0.5">लय व सुर समझें</div>
              <div className="text-[10px] text-slate-400 font-hindi mt-1">धीमी गति में उतार-चढ़ाव देखें</div>
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeStep === 3
                  ? 'bg-cyan-950/90 border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-sm'
                  : 'bg-[#0e1d35] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-cyan-400">Step 3</div>
              <div className="text-xs font-bold text-white mt-0.5">ज़ोर से बोलें</div>
              <div className="text-[10px] text-slate-400 font-hindi mt-1">स्वयं ज़ोर से उच्चारण करें</div>
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(4)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeStep === 4
                  ? 'bg-cyan-950/90 border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-sm'
                  : 'bg-[#0e1d35] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-cyan-400">Step 4</div>
              <div className="text-xs font-bold text-white mt-0.5">साथ-साथ बोलें</div>
              <div className="text-[10px] text-slate-400 font-hindi mt-1">ऑडियो के साथ आवाज़ मिलाएं</div>
            </button>
          </div>
        </div>

        {/* Active Sentence Display Card */}
        <div className="bg-[#07172b] border border-cyan-900/40 rounded-3xl p-6 sm:p-8 text-center space-y-5">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              वाक्य {((currentIndex % filteredSentences.length) + 1)} / {filteredSentences.length}
            </span>
            {currentSentence.contextHi && (
              <span className="font-hindi text-slate-400 italic">
                {currentSentence.contextHi}
              </span>
            )}
          </div>

          {/* Primary Audio Player Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            <button
              type="button"
              onClick={() => handlePlayAudio('normal')}
              className={`px-6 py-3.5 rounded-2xl flex items-center gap-2.5 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                isSpeaking && playbackSpeed === 'normal'
                  ? 'bg-cyan-500 text-white ring-4 ring-cyan-400/40 animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
              title="सामान्य गति में सुनें"
            >
              <Volume2 className="w-5 h-5" />
              <span>🔊 सुनें (Listen)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlayAudio('slow')}
              className={`px-4 py-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
                isSpeaking && playbackSpeed === 'slow'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/50'
                  : 'bg-[#0e1d35] hover:bg-[#152a4a] text-slate-300 border-slate-700'
              }`}
              title="धीमी गति में स्पष्ट सुनें"
            >
              <span>🐢 धीरे सुनें (Slow)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlayAudio(playbackSpeed)}
              className="p-3.5 rounded-2xl bg-[#0e1d35] hover:bg-[#152a4a] text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="फिर से सुनें"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>फिर से सुनें</span>
            </button>
          </div>

          {/* Real Audio Engine Error Alert (Never pretend audio played) */}
          {audioError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs font-hindi text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>ऑडियो सूचना: </strong>
                {audioError}
              </div>
            </div>
          )}

          {/* English Sentence Display */}
          <div className="py-2">
            {showEnglishText ? (
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight">
                &ldquo;{currentSentence.en}&rdquo;
              </h3>
            ) : (
              <div className="py-4 px-6 rounded-2xl bg-[#091e36]/70 border border-slate-800 text-xs text-slate-400 italic">
                [अंग्रेज़ी टेक्स्ट छिपाया गया है — ध्यान से सुनें और मन में दोहराएं। देखने के लिए ऊपर Eye आइकन दबाएं]
              </div>
            )}

            {/* Phonetic Pronunciation Guide */}
            {showPhonetic && currentSentence.phoneticHi && showEnglishText && (
              <div className="mt-2 text-xs text-cyan-300 font-hindi font-medium">
                उच्चारण: {currentSentence.phoneticHi}
              </div>
            )}
          </div>

          {/* Hindi Meaning Display */}
          {showHindiText && (
            <div className="p-3.5 rounded-2xl bg-[#0b1b33] border border-cyan-950 max-w-xl mx-auto">
              <div className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
                हिंदी अर्थ (Hindi Meaning)
              </div>
              <p className="text-base sm:text-lg font-hindi text-cyan-100 font-medium mt-0.5">
                {currentSentence.hi}
              </p>
            </div>
          )}

          {/* Microphone Recording Area (Step 3 / On-Demand) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="text-xs text-slate-400 font-hindi flex items-center justify-center gap-1.5">
              <span>🎤 माइक्रोफ़ोन से अपनी आवाज़ रिकॉर्ड करके अभ्यास करें:</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'रिकॉर्डिंग रोकें (Stop)' : 'बोलकर रिकॉर्ड करें (Record)'}</span>
              </button>
            </div>

            {/* Recording Error */}
            {recordingError && (
              <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-200 text-xs font-hindi text-left">
                {recordingError}
              </div>
            )}

            {/* Recognized Transcript */}
            {/* Recognized Transcript with Realistic Transparency Note */}
            {spokenTranscript && (
              <div className="p-3.5 rounded-2xl bg-[#0e1d35] text-xs space-y-1.5 max-w-lg mx-auto text-left border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">पहचाने गए शब्द (Speech Recognition):</div>
                <div className="text-white font-medium text-sm">&ldquo;{spokenTranscript}&rdquo;</div>
                <div className="text-[10px] text-slate-400 font-hindi border-t border-slate-800/80 pt-1">
                  नोट: स्पीच रिकॉग्निशन केवल बोले गए शब्दों की पुष्टि करता है। यह कोई बनावटी (fake) उच्चारण स्कोर नहीं देता।
                </div>
              </div>
            )}

            {/* Audio Playback of Learner's Voice */}
            {recordedAudioUrl && (
              <div className="flex flex-col items-center justify-center gap-1.5 pt-2">
                <span className="text-[11px] text-slate-400 font-hindi">अपनी रिकॉर्ड की गई आवाज़ सुनें:</span>
                <audio controls src={recordedAudioUrl} className="h-8 w-64 max-w-full" />
              </div>
            )}
          </div>

          {/* Completion Status Notice / Feedback */}
          {completionNotice && (
            <div
              className={`p-3 rounded-2xl text-xs font-hindi flex items-center justify-center gap-2 transition-all ${
                isCompleted || completionNotice.includes('शाबाश')
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/70 border border-amber-500/50 text-amber-200'
              }`}
            >
              {isCompleted || completionNotice.includes('शाबाश') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{completionNotice}</span>
            </div>
          )}
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Previous Sentence */}
          <button
            type="button"
            onClick={handlePrevSentence}
            disabled={filteredSentences.length <= 1}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← पिछला वाक्य</span>
          </button>

          {/* Middle Actions: Shuffle & Mark Done */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center flex-wrap">
            <button
              type="button"
              onClick={handleShuffle}
              className="px-3.5 py-2.5 rounded-xl bg-[#0e1d35] hover:bg-[#142642] text-slate-300 border border-slate-800 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
              title="रैंडम वाक्य चुनें"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              <span>रैंडम वाक्य</span>
            </button>

            {/* Explicit 'पूरा हुआ' button */}
            <button
              type="button"
              onClick={handleMarkCompleted}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-sm ${
                isCompleted
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                  : hasActivityCompletedForCurrentSentence
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'पूरा हुआ ✓' : 'पूरा हुआ'}</span>
            </button>
          </div>

          {/* Explicit 'अगला वाक्य' Button */}
          <button
            type="button"
            onClick={handleNextSentence}
            disabled={filteredSentences.length <= 1}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>अगला वाक्य →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shadowing Practice Tips Accordion / Guidance */}
        <div className="p-4 rounded-2xl bg-[#07172b] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>शैडोइंग (Shadowing) से अंग्रेज़ी बोलने में निपुणता कैसे पाएँ?</span>
          </div>
          <p className="text-xs text-slate-300 font-hindi leading-relaxed">
            1. <strong>रुक-रुक कर बोलने से बचें:</strong> शब्द-दर-शब्द सोचने के बजाय पूरे वाक्य को एक संगीत या धुन की तरह सुनें।<br />
            2. <strong>मुखर आवाज़ में बोलें:</strong> मन में दोहराने के बजाय मुँह खोलकर आवाज़ निकालें ताकि जीभ और होठों की मांसपेशियों को अंग्रेज़ी ध्वनियों की आदत हो सके।<br />
            3. <strong>जितनी बार चाहें दोहराएं:</strong> एक ही वाक्य को 3-4 बार शैडो करने से वह आपकी स्वाभाविक याददाश्त (Muscle Memory) का हिस्सा बन जाता है।
          </p>
        </div>
      </div>
    </div>
  );
};
