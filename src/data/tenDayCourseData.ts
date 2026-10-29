import { VocabularyWord } from '../types/learning';

export interface CourseVocabularyItem {
  word: string;
  hindi: string;
  phonetic: string;
  exampleEn: string;
  exampleHi: string;
}

export interface CoursePhraseItem {
  phrase: string;
  hindi: string;
  tip?: string;
}

export interface QuizQuestion {
  questionHi: string;
  options: string[];
  correctIndex: number;
  explanationHi: string;
}

export interface CourseDay {
  dayNumber: number;
  title: string;
  titleHi: string;
  subtitle: string;
  objectiveHi: string;
  previousReviewHi: string;
  nextStepHi: string;
  grammarFocus: string;
  hindiExplanation: string;
  keyRuleHindi: string;
  vocabulary: CourseVocabularyItem[];
  keyPhrases: CoursePhraseItem[];
  listeningSpeakingPrompt: {
    sentenceEn: string;
    sentenceHi: string;
    guideTipHindi: string;
  };
  roleplayScenario: {
    id: string;
    title: string;
    contextHindi: string;
    aiStarterPromptHindi: string;
    suggestedResponses: string[];
  };
  speakingChallenge: {
    challengePromptHindi: string;
    targetWordCount: string;
    modelAnswerEn: string;
    modelAnswerHi: string;
  };
  reviewQuiz: QuizQuestion[];
}

export const TEN_DAY_COURSE_DATA: CourseDay[] = [
  // DAY 1: Basic High-Frequency Vocabulary & Greetings
  {
    dayNumber: 1,
    title: 'High-Frequency Vocabulary & Greetings',
    titleHi: 'दिन 1: बुनियादी शब्द और अभिवादन',
    subtitle: 'Greetings, personal pronouns (I, You, He, She, We), and simple introductions',
    objectiveHi: 'आज आप किसी से मिलकर आत्मविश्वास से नमस्ते करना, अपना नाम बताना और बुनियादी हाल-चाल पूछना सीख पाएंगे।',
    previousReviewHi: 'यह कोर्स का पहला दिन है। 654 शब्दों की बुनियादी शब्दावली से शुरुआत कर रहे हैं।',
    nextStepHi: 'Day 2 में हम परिवार, काम और पसंद-नापसंद व्यक्त करने वाले दैनिक भाव सीखेंगे।',
    grammarFocus: 'Personal Pronouns (I, You, We, They, He, She) + Simple Greetings',
    hindiExplanation: 'अभिवादन किसी भी भाषा की पहली सीढ़ी है। अंग्रेज़ी में औपचारिक (formal) और अनौपचारिक (informal) दोनों प्रकार के अभिवादन होते हैं। सुबह "Good morning", दोपहर में "Good afternoon" और शाम को "Good evening" कहा जाता है। किसी से पहली बार मिलने पर "Nice to meet you" कहना सबसे अच्छा तरीका है।',
    keyRuleHindi: 'याद रखें: "Good night" केवल विदा लेते समय (अलविदा कहते समय) बोला जाता है, मिलते समय कभी नहीं।',
    vocabulary: [
      { word: 'Hello', hindi: 'नमस्ते / सुनो', phonetic: 'हेलो', exampleEn: 'Hello, nice to meet you.', exampleHi: 'नमस्ते, आपसे मिलकर अच्छा लगा।' },
      { word: 'Name', hindi: 'नाम', phonetic: 'नेम', exampleEn: 'My name is Amit.', exampleHi: 'मेरा नाम अमित है।' },
      { word: 'Live', hindi: 'रहना', phonetic: 'लिव', exampleEn: 'I live in Delhi.', exampleHi: 'मैं दिल्ली में रहता हूँ।' },
      { word: 'Fine', hindi: 'अच्छा / ठीक', phonetic: 'फाइन', exampleEn: 'I am fine, thank you.', exampleHi: 'मैं ठीक हूँ, धन्यवाद।' },
      { word: 'You', hindi: 'तुम / आप', phonetic: 'यू', exampleEn: 'How are you?', exampleHi: 'आप कैसे हैं?' },
    ],
    keyPhrases: [
      { phrase: 'Good morning! How are you doing today?', hindi: 'शुभ प्रभात! आज आपका दिन कैसा चल रहा है?', tip: 'सुबह 12 बजे तक उपयोग करें।' },
      { phrase: 'My name is [Name], and I live in [City].', hindi: 'मेरा नाम [नाम] है और मैं [शहर] में रहता हूँ।', tip: 'सरल और सटीक आत्म-परिचय।' },
      { phrase: 'Nice to meet you! It is a pleasure.', hindi: 'आपसे मिलकर बहुत खुशी हुई!', tip: 'हाथ मिलाते या नमस्ते करते समय।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'Hello! My name is Amit and I live in Delhi.',
      sentenceHi: 'नमस्ते! मेरा नाम अमित है और मैं दिल्ली में रहता हूँ।',
      guideTipHindi: '"Hello" को स्पष्ट बोलें और "Delhi" पर स्वाभाविक ठहराव दें।',
    },
    roleplayScenario: {
      id: 'day1_greetings',
      title: 'First Meeting at an Office',
      contextHindi: 'आप एक नए सहकर्मी से पहली बार मिल रहे हैं। अंग्रेज़ी में अभिवादन करें और अपना परिचय दें।',
      aiStarterPromptHindi: 'Hello! I am John, the new project lead. What is your name?',
      suggestedResponses: [
        'Hello John! My name is Amit, nice to meet you.',
        'Good morning! I am very glad to meet you.',
        'I am from the marketing team, looking forward to working with you.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'अपना नाम, शहर और आज का हालचाल बताते हुए कम से कम 3 अंग्रेज़ी वाक्य बोलें।',
      targetWordCount: '15-25 words',
      modelAnswerEn: 'Hello everyone! My name is Rajesh. I live in Jaipur. I am doing very well today and excited to learn English.',
      modelAnswerHi: 'नमस्ते सभी को! मेरा नाम राजेश है। मैं जयपुर में रहता हूँ। आज मैं बहुत अच्छा महसूस कर रहा हूँ और अंग्रेज़ी सीखने के लिए उत्सुक हूँ।',
    },
    reviewQuiz: [
      {
        questionHi: 'शाम को 7 बजे किसी व्यक्ति से मिलते समय क्या कहना चाहिए?',
        options: ['Good evening (शुभ संध्या)', 'Good night', 'Good morning', 'Good afternoon'],
        correctIndex: 0,
        explanationHi: 'शाम को मिलते समय "Good evening" कहा जाता है। "Good night" केवल विदा लेते समय बोलते हैं।',
      },
      {
        questionHi: '"मेरा नाम पूजा है और मैं मुंबई में रहती हूँ" का सही अनुवाद क्या है?',
        options: ['My name is Pooja and I live in Mumbai.', 'My name Pooja I live Mumbai.', 'I Pooja living in Mumbai.', 'Name is Pooja I am Mumbai.'],
        correctIndex: 0,
        explanationHi: '"My name is Pooja and I live in Mumbai." बिल्कुल सही व्याकरणिक वाक्य है।',
      },
    ],
  },

  // DAY 2: Personal Information, Family & Simple Expressions
  {
    dayNumber: 2,
    title: 'Personal Info, Family & Daily Expressions',
    titleHi: 'दिन 2: व्यक्तिगत जानकारी और परिवार',
    subtitle: 'Talking about family members, profession, hobbies, and simple daily expressions',
    objectiveHi: 'आज आप अपने परिवार के सदस्यों, उनके व्यवसाय और अपनी पसंद-नापसंद के बारे में सरल वाक्य बोल पाएंगे।',
    previousReviewHi: 'Day 1 में हमने Greetings और आत्म-परिचय सीखा था (Hello, My name is...)।',
    nextStepHi: 'Day 3 में हम वाक्य निर्माण का सबसे महत्वपूर्ण नियम: SVO (Subject + Verb + Object) पैटर्न सीखेंगे।',
    grammarFocus: 'Possessive Adjectives (My, Your, Our, Their, His, Her) + Family vocabulary',
    hindiExplanation: 'जब हम परिवार या किसी वस्तु पर अधिकार की बात करते हैं, तो Possessive Pronouns जैसे My (मेरा), His (उसका पुरुष), Her (उसका स्त्री), Our (हमारा) का उपयोग होता है। "I have two brothers" (मेरे दो भाई हैं) या "My mother is a homemaker" जैसे वाक्यों से आप आसानी से बातचीत आगे बढ़ा सकते हैं।',
    keyRuleHindi: 'पुरुष के लिए "His" (हिज़) और स्त्री के लिए "Her" (हर) का प्रयोग करें।',
    vocabulary: [
      { word: 'Family', hindi: 'परिवार', phonetic: 'फैमिली', exampleEn: 'I have a loving family.', exampleHi: 'मेरा एक प्यारा परिवार है।' },
      { word: 'Father', hindi: 'पिता', phonetic: 'फादर', exampleEn: 'My father is a teacher.', exampleHi: 'मेरे पिता एक शिक्षक हैं।' },
      { word: 'Mother', hindi: 'माता', phonetic: 'मदर', exampleEn: 'My mother cooks delicious food.', exampleHi: 'मेरी माँ स्वादिष्ट खाना बनाती हैं।' },
      { word: 'Brother', hindi: 'भाई', phonetic: 'ब्रदर', exampleEn: 'My brother plays cricket.', exampleHi: 'मेरा भाई क्रिकेट खेलता है।' },
      { word: 'Like', hindi: 'पसंद करना', phonetic: 'लाइक', exampleEn: 'I like reading books.', exampleHi: 'मुझे किताबें पढ़ना पसंद है।' },
    ],
    keyPhrases: [
      { phrase: 'There are four members in my family.', hindi: 'मेरे परिवार में चार सदस्य हैं।', tip: 'परिवार का आकार बताने का सबसे सही वाक्य।' },
      { phrase: 'In my free time, I really like listening to music.', hindi: 'अपने खाली समय में मुझे संगीत सुनना बहुत पसंद है।', tip: 'हॉबी बताने के लिए।' },
      { phrase: 'My parents live in our hometown.', hindi: 'मेरे माता-पिता हमारे गृहनगर में रहते हैं।', tip: 'माता-पिता (Parents) एकवचन नहीं, बहुवचन है।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'There are four members in my family: my parents, my sister, and me.',
      sentenceHi: 'मेरे परिवार में चार सदस्य हैं: मेरे माता-पिता, मेरी बहन और मैं।',
      guideTipHindi: '"members" और "parents" का उच्चारण साफ़ रखें।',
    },
    roleplayScenario: {
      id: 'day2_family',
      title: 'Chatting with a Friend about Family',
      contextHindi: 'आपका मित्र आपसे आपके परिवार के बारे में पूछ रहा है। उन्हें अपने माता-पिता और भाई-बहनों के बारे में बताएं।',
      aiStarterPromptHindi: 'Tell me about your family! Do you have any brothers or sisters?',
      suggestedResponses: [
        'Yes, I have one younger brother and an elder sister.',
        'We are a family of four, living together in Delhi.',
        'My father is in government service and my mother is a teacher.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'अपने परिवार के सदस्यों और अपनी किसी एक पसंदीदा हॉबी के बारे में 3 वाक्य बोलें।',
      targetWordCount: '20-30 words',
      modelAnswerEn: 'I live with my parents and my elder brother. My father is an engineer. In my spare time, I love playing badminton with my friends.',
      modelAnswerHi: 'मैं अपने माता-पिता और बड़े भाई के साथ रहता हूँ। मेरे पिता इंजीनियर हैं। खाली समय में मुझे दोस्तों के साथ बैडमिंटन खेलना पसंद है।',
    },
    reviewQuiz: [
      {
        questionHi: '"उसकी बहन (स्त्री की बहन)" के लिए सही अंग्रेज़ी शब्द कौन सा है?',
        options: ['Her sister', 'His sister', 'Its sister', 'Their sister'],
        correctIndex: 0,
        explanationHi: 'स्त्री के संबंध के लिए "Her" (हर्स) का प्रयोग होता है: "Her sister"।',
      },
    ],
  },

  // DAY 3: Present Simple & SVO (Subject-Verb-Object)
  {
    dayNumber: 3,
    title: 'Present Simple & SVO Sentence Patterns',
    titleHi: 'दिन 3: SVO वाक्य रचना और Present Simple',
    subtitle: 'Understanding why English sentence order (SVO) differs from Hindi (SOV)',
    objectiveHi: 'आज आप समझेंगे कि अंग्रेज़ी वाक्य रचना (Subject + Verb + Object) हिंदी से कैसे अलग है, और "I read books", "She likes tea" जैसे सटीक वाक्य बना पाएंगे।',
    previousReviewHi: 'Day 1-2 में हमने बुनियादी शब्द और परिवार के बारे में बोलना सीखा।',
    nextStepHi: 'Day 4 में हम Present Simple के साथ बाकी 4 मुख्य काल (Tenses) का समय-चक्र (Timeline) सीखेंगे।',
    grammarFocus: 'Subject-Verb-Object (SVO) vs Hindi Subject-Object-Verb (SOV) + He/She/It verb-s rule',
    hindiExplanation: 'हिंदी में हम कहते हैं: "मैं (Subject) किताब (Object) पढ़ता हूँ (Verb)" — यानी क्रिया अंत में आती है। लेकिन अंग्रेज़ी में नियम उल्टा है: "Subject + Verb + Object" (I + read + books)। क्रिया हमेशा कर्ता के तुरंत बाद आती है! इसके अलावा, यदि कर्ता He, She, It या कोई एक व्यक्ति हो, तो क्रिया में \'s\' या \'es\' जुड़ता है: "She likes tea", "He plays cricket"।',
    keyRuleHindi: 'गोल्डन रूल: अंग्रेज़ी में क्रिया (Verb) कर्म (Object) से पहले आती है (S-V-O)।',
    vocabulary: [
      { word: 'Read', hindi: 'पढ़ना', phonetic: 'रीड', exampleEn: 'I read books.', exampleHi: 'मैं किताबें पढ़ता हूँ।' },
      { word: 'Play', hindi: 'खेलना', phonetic: 'प्ले', exampleEn: 'We play cricket.', exampleHi: 'हम क्रिकेट खेलते हैं।' },
      { word: 'Like', hindi: 'पसंद करना', phonetic: 'लाइक', exampleEn: 'She likes tea.', exampleHi: 'उसे चाय पसंद है।' },
      { word: 'Speak', hindi: 'बोलना', phonetic: 'स्पीक', exampleEn: 'They speak English.', exampleHi: 'वे अंग्रेज़ी बोलते हैं।' },
      { word: 'Drink', hindi: 'पीना', phonetic: 'ड्रिंक', exampleEn: 'He drinks water.', exampleHi: 'वह पानी पीता है।' },
    ],
    keyPhrases: [
      { phrase: 'I read books in the evening.', hindi: 'मैं शाम को किताबें पढ़ता हूँ।', tip: 'SVO: I (S) + read (V) + books (O)।' },
      { phrase: 'She likes tea without sugar.', hindi: 'उसे बिना चीनी की चाय पसंद है।', tip: 'She के साथ like में \'s\' जुड़ा।' },
      { phrase: 'We play cricket on Sundays.', hindi: 'हम रविवार को क्रिकेट खेलते हैं।', tip: 'We बहुवचन है, इसलिए केवल play आएगा।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'I read English books and she likes hot tea.',
      sentenceHi: 'मैं अंग्रेज़ी किताबें पढ़ता हूँ और उसे गर्म चाय पसंद है।',
      guideTipHindi: 'दो छोटे SVO वाक्यों को "and" से जोड़कर बोलना सीखें।',
    },
    roleplayScenario: {
      id: 'day3_svo',
      title: 'Talking About Daily Habits',
      contextHindi: 'AI शिक्षक आपसे आपकी रोज़मर्रा की आदतों के बारे में पूछ रहा है। सही SVO क्रम में उत्तर दें।',
      aiStarterPromptHindi: 'What do you usually do in the morning? Do you read books or exercise?',
      suggestedResponses: [
        'I read books and I drink fresh water.',
        'I exercise for thirty minutes every morning.',
        'My brother plays football and I like walking.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: '"I read...", "She likes...", और "We play..." पैटर्न पर आधारित 3 पूरे SVO वाक्य बोलें।',
      targetWordCount: '15-25 words',
      modelAnswerEn: 'I read the newspaper every morning. She likes cold coffee. We play cricket together in the evening.',
      modelAnswerHi: 'मैं रोज़ सुबह अख़बार पढ़ता हूँ। उसे कोल्ड कॉफ़ी पसंद है। हम शाम को साथ में क्रिकेट खेलते हैं।',
    },
    reviewQuiz: [
      {
        questionHi: '"वह (स्त्री) चाय पसंद करती है" का सही SVO अंग्रेज़ी अनुवाद क्या है?',
        options: ['She likes tea.', 'She tea likes.', 'Tea likes she.', 'She like tea.'],
        correctIndex: 0,
        explanationHi: 'Subject (She) + Verb-s (likes) + Object (tea) = "She likes tea."।',
      },
    ],
  },

  // DAY 4: Practise Four Additional Core Tenses
  {
    dayNumber: 4,
    title: 'The Five Core Tenses in Daily Life',
    titleHi: 'दिन 4: पाँच मुख्य काल (5 Core Tenses)',
    subtitle: 'Past Simple, Future Simple, Present Continuous, and Present Perfect with timelines',
    objectiveHi: 'आज आप जीवन की 5 मुख्य समय-स्थितियों (रोज़ की आदत, बीती बात, आने वाला कल, अभी चल रहा काम, और हाल ही में पूरा हुआ काम) को बिना भ्रम के व्यक्त कर पाएंगे।',
    previousReviewHi: 'Day 3 में हमने Present Simple SVO क्रम (I read books) सीखा था।',
    nextStepHi: 'Day 5 में हम इन सभी कालों पर आधारित ऑडियो कहानियाँ और बातचीत सुनना सीखेंगे।',
    grammarFocus: 'Past Simple (V2), Future Simple (will), Present Continuous (is/am/are + ing), Present Perfect (has/have + V3)',
    hindiExplanation: 'अंग्रेज़ी में महारत के लिए केवल 5 मुख्य काल सबसे आवश्यक हैं:\n1. Present Simple: रोज़मर्रा की आदत ("I work every day")\n2. Past Simple: बीती बात ("I worked yesterday")\n3. Future Simple: आने वाला कल ("I will work tomorrow")\n4. Present Continuous: अभी चल रहा काम ("I am working right now")\n5. Present Perfect: हाल ही में पूरा हुआ काम ("I have finished my work")',
    keyRuleHindi: 'बीते कल (yesterday) के लिए Past Simple (2nd form), आने वाले कल (tomorrow) के लिए Will + 1st form।',
    vocabulary: [
      { word: 'Yesterday', hindi: 'बीता हुआ कल', phonetic: 'यस्टरडे', exampleEn: 'I worked yesterday.', exampleHi: 'मैंने कल काम किया था।' },
      { word: 'Tomorrow', hindi: 'आने वाला कल', phonetic: 'टुमॉरो', exampleEn: 'I will call you tomorrow.', exampleHi: 'मैं तुम्हें कल फोन करूँगा।' },
      { word: 'Now', hindi: 'अब / अभी', phonetic: 'नाउ', exampleEn: 'I am studying now.', exampleHi: 'मैं अभी पढ़ाई कर रहा हूँ।' },
      { word: 'Finish', hindi: 'पूरा करना', phonetic: 'फिनिश', exampleEn: 'I have finished.', exampleHi: 'मैंने काम पूरा कर लिया है।' },
    ],
    keyPhrases: [
      { phrase: 'I watched a very interesting movie yesterday.', hindi: 'मैंने कल एक बहुत दिलचस्प फ़िल्म देखी।', tip: 'Past Simple (V2: watched)।' },
      { phrase: 'I will start my new project tomorrow.', hindi: 'मैं कल अपना नया प्रोजेक्ट शुरू करूँगा।', tip: 'Future Simple (will start)।' },
      { phrase: 'I have already completed my homework.', hindi: 'मैं पहले ही अपना होमवर्क पूरा कर चुका हूँ।', tip: 'Present Perfect (have completed)।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'Yesterday I cooked dinner, and tomorrow I will visit my friend.',
      sentenceHi: 'कल मैंने रात का खाना बनाया था, और कल मैं अपने दोस्त से मिलने जाऊँगा।',
      guideTipHindi: 'Past (cooked) और Future (will visit) के अंतर को साफ़ महसूस करके बोलें।',
    },
    roleplayScenario: {
      id: 'day4_tenses',
      title: 'Timeline Discussion with AI Coach',
      contextHindi: 'AI शिक्षक आपसे पूछेगा कि आपने कल क्या किया, आप अभी क्या कर रहे हैं, और कल क्या करेंगे।',
      aiStarterPromptHindi: 'What did you do yesterday, and what are your plans for tomorrow?',
      suggestedResponses: [
        'Yesterday I visited my office and met my colleagues.',
        'Right now I am practicing English with you.',
        'Tomorrow I will wake up early and complete my tasks.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'कल बीती बात (Past) और कल होने वाली बात (Future) दोनों का एक-एक वाक्य बोलें।',
      targetWordCount: '20-30 words',
      modelAnswerEn: 'Yesterday I went to the market and bought fresh fruits. Tomorrow I will prepare a presentation for my team.',
      modelAnswerHi: 'कल मैं बाज़ार गया था और ताज़े फल खरीदे थे। कल मैं अपनी टीम के लिए एक प्रेजेंटेशन तैयार करूँगा।',
    },
    reviewQuiz: [
      {
        questionHi: '"कल मैं एक नई कार खरीदूँगा" का सही काल कौन सा है?',
        options: ['I will buy a new car tomorrow.', 'I bought a new car tomorrow.', 'I buy car tomorrow.', 'I am bought car.'],
        correctIndex: 0,
        explanationHi: 'भविष्य (tomorrow) के लिए "will buy" का प्रयोग होता है।',
      },
    ],
  },

  // DAY 5: Comprehensible Listening
  {
    dayNumber: 5,
    title: 'Comprehensible Listening & Stories',
    titleHi: 'दिन 5: समझ के साथ सुनना (Comprehensible Listening)',
    subtitle: 'Short beginner dialogues, audio stories, replay controls, and comprehension checks',
    objectiveHi: 'आज आप सामान्य गति में बोली गई अंग्रेज़ी बातचीत सुनकर मुख्य विचार समझ पाएंगे और पूछे गए सवालों के सही जवाब दे पाएंगे।',
    previousReviewHi: 'Day 4 में हमने 5 Tenses सीखे, जो आज की ऑडियो कहानियों में प्रयोग होंगे।',
    nextStepHi: 'Day 6 में हम शैडोइंग (Shadowing) अभ्यास करेंगे: सुनकर तुरंत हूबहू दोहराना।',
    grammarFocus: 'Listening for Gist (मुख्य भाव) & Specific Information without translating every word',
    hindiExplanation: 'शुरुआती शिक्षार्थियों की सबसे बड़ी समस्या होती है कि वे अंग्रेज़ी सुनते ही दिमाग में हर शब्द का हिंदी अनुवाद करने लगते हैं। ऐसा करने से वे स्पीकर से पीछे छूट जाते हैं। आज का अभ्यास आपको शब्दों के संदर्भ (context) से पूरी बात समझने का अभ्यास कराएगा। पहले ऑडियो सुनें, फिर प्रश्न का उत्तर दें।',
    keyRuleHindi: 'हर एक शब्द का अनुवाद मत करें; वाक्य के पूरे अर्थ और मुख्य शब्दों (Keywords) पर ध्यान दें।',
    vocabulary: [
      { word: 'Listen', hindi: 'सुनना', phonetic: 'लिसन', exampleEn: 'Listen to the audio carefully.', exampleHi: 'ऑडियो को ध्यान से सुनें।' },
      { word: 'Understand', hindi: 'समझना', phonetic: 'अंडरस्टैंड', exampleEn: 'I understand the story.', exampleHi: 'मैं कहानी समझता हूँ।' },
      { word: 'Question', hindi: 'प्रश्न', phonetic: 'क्वेश्चन', exampleEn: 'Answer this question.', exampleHi: 'इस प्रश्न का उत्तर दें।' },
    ],
    keyPhrases: [
      { phrase: 'Could you please say that one more time?', hindi: 'क्या आप कृपया एक बार फिर कह सकते हैं?', tip: 'दोबारा सुनने का विनम्र अनुरोध।' },
      { phrase: 'I understood the main idea of the story.', hindi: 'मुझे कहानी का मुख्य विचार समझ में आ गया।', tip: 'सुनने की समझ व्यक्त करने के लिए।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'A man walked into a grocery shop and bought fresh milk and bread.',
      sentenceHi: 'एक व्यक्ति किराने की दुकान में गया और उसने ताज़ा दूध और ब्रेड खरीदी।',
      guideTipHindi: '"grocery", "bought", और "bread" पर ध्यान दें।',
    },
    roleplayScenario: {
      id: 'day5_listening',
      title: 'Listening and Answering AI Teacher',
      contextHindi: 'AI शिक्षक आपको एक छोटी घटना सुनाएगा। ध्यान से सुनकर उसका जवाब दें।',
      aiStarterPromptHindi: 'Listen carefully: "Pooja went to the railway station at 5 PM to receive her friend." Who did Pooja go to meet?',
      suggestedResponses: [
        'She went to meet her friend.',
        'Pooja went to the station for her friend.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'आज सुनी गई छोटी कहानी को अपने शब्दों में 2 अंग्रेज़ी वाक्यों में बयान करें।',
      targetWordCount: '15-25 words',
      modelAnswerEn: 'Pooja went to the railway station in the evening. She met her best friend and they were very happy.',
      modelAnswerHi: 'पूजा शाम को रेलवे स्टेशन गई। वह अपने सबसे अच्छे दोस्त से मिली और वे बहुत खुश हुए।',
    },
    reviewQuiz: [
      {
        questionHi: '"A man bought fresh milk and bread." व्यक्ति ने क्या खरीदा?',
        options: ['दूध और ब्रेड (Milk and bread)', 'सब्जियां', 'किताबें', 'दवाएं'],
        correctIndex: 0,
        explanationHi: 'वाक्य में "milk and bread" का स्पष्ट उल्लेख है।',
      },
    ],
  },

  // DAY 6: Shadowing Practice
  {
    dayNumber: 6,
    title: 'Shadowing Practice: Stress, Rhythm & Connected Speech',
    titleHi: 'दिन 6: शैडोइंग अभ्यास (Shadowing Practice)',
    subtitle: 'Listen, slow replay, repeat slowly, and speak without the model audio',
    objectiveHi: 'आज आप अंग्रेज़ी की स्वाभाविक लय (Rhythm), कनेक्टेड स्पीच और शब्दों के सही उतार-चढ़ाव (Stress) के साथ बोलना सीख पाएंगे।',
    previousReviewHi: 'Day 5 में हमने Listening समझी; आज हम उसी ऑडियो को हूबहू बोलना सीखेंगे।',
    nextStepHi: 'Day 7 में हम हिंदी भाषियों की सबसे आम 5 गलतियों (Transfer Errors) को ठीक करेंगे।',
    grammarFocus: 'Connected Speech, Sentence-Level Stress & Pronunciation Rhythm',
    hindiExplanation: 'शैडोइंग (Shadowing) दुनिया की सबसे शक्तिशाली स्पीकिंग तकनीक है। इसमें आप किसी मूल वक्ता को सुनते हैं और लगभग उसी क्षण या ठीक बाद में उसी स्वर, गति और भावना के साथ दोहराते हैं। इससे आपकी जीभ अंग्रेज़ी ध्वनियों की आदी हो जाती है और हिचकिचाहट खत्म होती है।',
    keyRuleHindi: 'शब्द-दर-शब्द रोबोट की तरह न बोलें; संगीत की तरह वाक्य के स्वाभाविक प्रवाह में बोलें।',
    vocabulary: [
      { word: 'Repeat', hindi: 'दोहराना', phonetic: 'रिपीट', exampleEn: 'Repeat after me.', exampleHi: 'मेरे बाद दोहराएं।' },
      { word: 'Speak', hindi: 'बोलना', phonetic: 'स्पीक', exampleEn: 'Speak with confidence.', exampleHi: 'आत्मविश्वास से बोलें।' },
      { word: 'Slowly', hindi: 'धीमे से', phonetic: 'स्लोली', exampleEn: 'Please speak slowly.', exampleHi: 'कृपया धीरे बोलें।' },
    ],
    keyPhrases: [
      { phrase: 'I am really looking forward to seeing you.', hindi: 'मैं आपसे मिलने के लिए वास्तव में उत्सुक हूँ।', tip: 'लय के साथ शैडोइंग करें।' },
      { phrase: 'Could you give me a hand with this box?', hindi: 'क्या आप इस डिब्बे के साथ मेरी मदद कर सकते हैं?', tip: '"give me a hand" का मतलब मदद करना है।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'Practice makes a person confident and fluent in speaking.',
      sentenceHi: 'अभ्यास व्यक्ति को बोलने में आत्मविश्वासी और धाराप्रवाह बनाता है।',
      guideTipHindi: '"confident" और "fluent" के उतार-चढ़ाव पर ध्यान दें।',
    },
    roleplayScenario: {
      id: 'day6_shadowing',
      title: 'Rhythm Matching with AI Coach',
      contextHindi: 'AI शिक्षक एक वाक्य बोलेगा। आप हूबहू उसी लय में माइक पर दोहराएं।',
      aiStarterPromptHindi: 'Listen to my rhythm: "It is a beautiful sunny morning in the city." Now, repeat it exactly like that!',
      suggestedResponses: [
        'It is a beautiful sunny morning in the city.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'बिना मॉडल ऑडियो के, पूरे आत्मविश्वास और सही प्रवाह के साथ 2 वाक्य बोलें।',
      targetWordCount: '15-20 words',
      modelAnswerEn: 'It is a wonderful opportunity to learn English and improve our daily communication skills.',
      modelAnswerHi: 'यह अंग्रेज़ी सीखने और अपने दैनिक संचार कौशल को सुधारने का एक शानदार अवसर है।',
    },
    reviewQuiz: [
      {
        questionHi: 'शैडोइंग (Shadowing) तकनीक का मुख्य उद्देश्य क्या है?',
        options: ['बोलने की स्वाभाविक लय और उच्चारण सुधारना', 'व्याकरण के नियम रटना', 'केवल लिखना सीखना', 'शब्दकोश याद करना'],
        correctIndex: 0,
        explanationHi: 'शैडोइंग का मुख्य उद्देश्य बोलने का प्रवाह, लय और आत्मविश्वास बढ़ाना है।',
      },
    ],
  },

  // DAY 7: Common Hindi-to-English Transfer Errors
  {
    dayNumber: 7,
    title: 'Common Hindi-to-English Transfer Errors',
    titleHi: 'दिन 7: हिंदी भाषियों की आम गलतियाँ व सुधार',
    subtitle: 'Fixing "having a car", "discussed about", subject-verb agreement, and prepositions',
    objectiveHi: 'आज आप हिंदी भाषियों द्वारा की जाने वाली सबसे आम 5 गलतियों को हमेशा के लिए पहचानना और शुद्ध मानक अंग्रेज़ी बोलना सीख पाएंगे।',
    previousReviewHi: 'Day 6 में हमने Shadowing और लय सीखी थी।',
    nextStepHi: 'Day 8 में हम वास्तविक जीवन के संवादों (Role-plays) में धाराप्रवाह बोलना शुरू करेंगे।',
    grammarFocus: 'Hindi Transfer Interference: Ownership vs Continuous, Redundant Prepositions, Subject-Verb Agreement',
    hindiExplanation: 'जब हम हिंदी से अंग्रेज़ी बोलते हैं, तो हिंदी व्याकरण का प्रभाव अंग्रेज़ी पर आ जाता है। जैसे:\n1. स्वामित्व के लिए: "I am having a car" (गलत) → "I have a car" (सही)\n2. चर्चा के लिए: "We discussed about it" (गलत) → "We discussed it" (सही)\n3. क्रिया सहमति: "He go" (गलत) → "He goes" (सही)\n4. वापस आना: "Return back" (गलत) → "Return" (सही)\n5. सुनना: "Listen me" (गलत) → "Listen to me" (सही)',
    keyRuleHindi: 'स्वामित्व (कार, घर, भाई) के लिए कभी "am having" न कहें; हमेशा "have" कहें।',
    vocabulary: [
      { word: 'Discuss', hindi: 'चर्चा करना', phonetic: 'डिस्कस', exampleEn: 'Let us discuss the plan.', exampleHi: 'आइए योजना पर चर्चा करें।' },
      { word: 'Agree', hindi: 'सहमत होना', phonetic: 'अग्री', exampleEn: 'I agree with you.', exampleHi: 'मैं आपसे सहमत हूँ।' },
      { word: 'Return', hindi: 'लौटना', phonetic: 'रिटर्न', exampleEn: 'I will return at five.', exampleHi: 'मैं पाँच बजे लौटूंगा।' },
    ],
    keyPhrases: [
      { phrase: 'I have a car, and my brother has a motorcycle.', hindi: 'मेरे पास एक कार है, और मेरे भाई के पास एक मोटरसाइकिल है।', tip: 'Ownership में केवल have/has आता है।' },
      { phrase: 'We discussed the new budget in the meeting.', hindi: 'हमने बैठक में नए बजट पर चर्चा की।', tip: '"discussed about" मत कहें।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'I have a car and we discussed the matter yesterday.',
      sentenceHi: 'मेरे पास एक कार है और हमने कल इस मामले पर चर्चा की थी।',
      guideTipHindi: '"have a car" और "discussed the matter" को शुद्ध बोलें।',
    },
    roleplayScenario: {
      id: 'day7_errors',
      title: 'Grammar Correction Workshop with AI Coach',
      contextHindi: 'AI शिक्षक आपसे जानबूझकर एक अशुद्ध वाक्य पूछेगा। आपको उसे सही रूप में बोलना है।',
      aiStarterPromptHindi: 'If someone says: "I am having three pens in my pocket", how will you correct that sentence politely?',
      suggestedResponses: [
        'I have three pens in my pocket.',
        'You should say: I have three pens.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: '"I have..." और "We discussed..." का प्रयोग करते हुए 2 सही वाक्य बोलें।',
      targetWordCount: '15-20 words',
      modelAnswerEn: 'I have an important appointment today, and we discussed the project timeline in the morning.',
      modelAnswerHi: 'आज मेरी एक महत्वपूर्ण मुलाक़ात है, और हमने सुबह प्रोजेक्ट की समयसीमा पर चर्चा की।',
    },
    reviewQuiz: [
      {
        questionHi: '"मेरे पास एक नया लैपटॉप है" का शुद्ध मानक अंग्रेज़ी वाक्य कौन सा है?',
        options: ['I have a new laptop.', 'I am having a new laptop.', 'Laptop is having by me.', 'I has a new laptop.'],
        correctIndex: 0,
        explanationHi: 'स्वामित्व बताने के लिए "I have a new laptop" बिल्कुल सही है।',
      },
    ],
  },

  // DAY 8: Active Speaking Practice & Role-Plays
  {
    dayNumber: 8,
    title: 'Active Speaking Practice & Real-Life Role-Plays',
    titleHi: 'दिन 8: सक्रिय रोल-प्ले और वास्तविक बातचीत',
    subtitle: 'Conversations at home, shopping, asking directions, routines, and asking for help',
    objectiveHi: 'आज आप दुकान, बाज़ार, रास्ता पूछने और किसी से मदद मांगने जैसी वास्तविक जीवन स्थितियों में बिना झिझक के अंग्रेज़ी बोल पाएंगे।',
    previousReviewHi: 'Day 7 में हमने आम गलतियाँ सुधारी थीं।',
    nextStepHi: 'Day 9 में हम पूर्ण व्यावहारिक immersion (अंग्रेज़ी में सोचना) का अभ्यास करेंगे।',
    grammarFocus: 'Polite Requests (Could you, Would you like), Directions, Situational Fluency',
    hindiExplanation: 'दुकानदार से बात करते समय, सड़क पर रास्ता पूछते समय या किसी से सहायता मांगते समय नम्र भाषा (Polite Language) का उपयोग किया जाता है। "Could you please help me?" या "How much does this cost?" जैसे वाक्यांश आपको किसी भी परिस्थिति में सहज बनाते हैं।',
    keyRuleHindi: 'किसी से सहायता मांगते समय "Could you please..." से शुरुआत करना सबसे सम्मानजनक तरीका है।',
    vocabulary: [
      { word: 'Excuse', hindi: 'माफ़ करना', phonetic: 'एक्सक्यूज़', exampleEn: 'Excuse me, sir.', exampleHi: 'माफ़ कीजिए, महोदय।' },
      { word: 'Direction', hindi: 'दिशा / रास्ता', phonetic: 'डायरेक्शन', exampleEn: 'Can you show me the direction?', exampleHi: 'क्या आप मुझे रास्ता दिखा सकते हैं?' },
      { word: 'Cost', hindi: 'दाम होना', phonetic: 'कॉस्ट', exampleEn: 'How much does it cost?', exampleHi: 'इसकी क्या कीमत है?' },
    ],
    keyPhrases: [
      { phrase: 'Excuse me, could you tell me the way to the railway station?', hindi: 'माफ़ कीजिए, क्या आप मुझे रेलवे स्टेशन का रास्ता बता सकते हैं?', tip: 'रास्ता पूछने के लिए।' },
      { phrase: 'Do you have this shirt in a medium size?', hindi: 'क्या आपके पास यह शर्ट मीडियम साइज में है?', tip: 'दुकान पर कपड़े खरीदते समय।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'Excuse me, could you please tell me how much this shirt costs?',
      sentenceHi: 'माफ़ कीजिए, क्या आप कृपया बता सकते हैं कि इस शर्ट की कीमत क्या है?',
      guideTipHindi: '"Excuse me" और "costs" पर उचित ठहराव दें।',
    },
    roleplayScenario: {
      id: 'day8_shopping',
      title: 'Shopping at a Mall',
      contextHindi: 'आप एक कपड़े की दुकान में हैं। विक्रेता से किसी वस्तु का दाम पूछें और डिस्काउंट के बारे में बात करें।',
      aiStarterPromptHindi: 'Hello sir! Welcome to our store. How can I help you today?',
      suggestedResponses: [
        'Hello! I am looking for a blue shirt. How much is this one?',
        'Do you have any special discount on these clothes today?',
        'Could I please try this in the trial room?',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'रास्ता पूछने या दुकान पर खरीदारी करने की स्थिति पर 3 वाक्य बोलें।',
      targetWordCount: '20-30 words',
      modelAnswerEn: 'Excuse me, could you help me find the nearest metro station? I am new to this area and need to catch a train.',
      modelAnswerHi: 'माफ़ कीजिए, क्या आप मुझे सबसे नजदीकी मेट्रो स्टेशन ढूंढने में मदद कर सकते हैं? मैं इस इलाके में नया हूँ और मुझे ट्रेन पकड़नी है।',
    },
    reviewQuiz: [
      {
        questionHi: 'किसी अजनबी से विनम्रतापूर्वक मदद मांगते समय कौन सा वाक्य सबसे उपयुक्त है?',
        options: ['Could you please help me with this?', 'Help me now!', 'You must help me.', 'Give me help.'],
        correctIndex: 0,
        explanationHi: '"Could you please help me..." सबसे विनम्र और मानक तरीका है।',
      },
    ],
  },

  // DAY 9: Practical Immersion & Everyday English Tasks
  {
    dayNumber: 9,
    title: 'Practical Immersion & Internal Monologue',
    titleHi: 'दिन 9: व्यावहारिक इमर्शन (अंग्रेज़ी में सोचना)',
    subtitle: 'Everyday English tasks, simple internal monologue, and familiar-topic conversation',
    objectiveHi: 'आज आप मन ही मन अपने विचारों को हिंदी के बजाय सीधे अंग्रेज़ी में सोचना (Internal Monologue) और सहजता से संवाद करना सीख पाएंगे।',
    previousReviewHi: 'Day 8 में हमने बाज़ार और दैनिक स्थितियों में रोल-प्ले किया था।',
    nextStepHi: 'Day 10 में हम अंतिम व्यावहारिक मूल्यांकन (Final Assessment) और भविष्य की योजना बनाएंगे।',
    grammarFocus: 'Thinking in English, Connecting Thoughts with Because, Although, and Therefore',
    hindiExplanation: 'जब तक आप मन में हिंदी में सोचकर फिर अंग्रेज़ी में अनुवाद करेंगे, आपकी बोलने की गति धीमी रहेगी। आज का अभ्यास है "Internal Monologue" — यानी अपने कमरे में जो चीज़ें दिख रही हैं, या जो आप करने जा रहे हैं, उसे मन में अंग्रेज़ी में बोलना: "I need to drink water now", "The weather is very pleasant today"।',
    keyRuleHindi: 'दिन में 10 मिनट मन में जो भी विचार आए, उसे अंग्रेज़ी में स्वयं से कहें।',
    vocabulary: [
      { word: 'Think', hindi: 'सोचना', phonetic: 'थिंक', exampleEn: 'I think in English.', exampleHi: 'मैं अंग्रेज़ी में सोचता हूँ।' },
      { word: 'Because', hindi: 'क्योंकि', phonetic: 'बिकॉज़', exampleEn: 'I am happy because I learned.', exampleHi: 'मैं खुश हूँ क्योंकि मैंने सीखा।' },
      { word: 'Now', hindi: 'अब', phonetic: 'नाउ', exampleEn: 'I am ready now.', exampleHi: 'मैं अब तैयार हूँ।' },
    ],
    keyPhrases: [
      { phrase: 'I am preparing tea right now because it is cold outside.', hindi: 'मैं अभी चाय बना रहा हूँ क्योंकि बाहर ठंड है।', tip: 'विचारों को "because" से जोड़ें।' },
      { phrase: 'Today was a productive day, and I finished all my tasks.', hindi: 'आज का दिन बहुत उपयोगी रहा, और मैंने अपने सारे काम पूरे कर लिए।', tip: 'शाम की आत्म-समीक्षा।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'I am learning English because it helps me grow in my career.',
      sentenceHi: 'मैं अंग्रेज़ी सीख रहा हूँ क्योंकि यह मेरे करियर में आगे बढ़ने में मदद करती है।',
      guideTipHindi: '"career" और "grow" को साफ़ आवाज़ में बोलें।',
    },
    roleplayScenario: {
      id: 'day9_immersion',
      title: 'Open Conversation on Your Dreams & Goals',
      contextHindi: 'AI शिक्षक के साथ अपने सपनों और लक्ष्यों के बारे में स्वाभाविक बातचीत करें।',
      aiStarterPromptHindi: 'Why do you want to master English, and what is your biggest goal this year?',
      suggestedResponses: [
        'I want to speak fluent English for better career opportunities.',
        'My goal is to talk with confidence in office meetings.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'आप अपने जीवन में क्या हासिल करना चाहते हैं, इस पर 3 वाक्य बोलें।',
      targetWordCount: '20-30 words',
      modelAnswerEn: 'My goal is to speak English fluently with clients. I practice every day because communication skills open many doors in life.',
      modelAnswerHi: 'मेरा लक्ष्य ग्राहकों से धाराप्रवाह अंग्रेज़ी में बात करना है। मैं रोज़ अभ्यास करता हूँ क्योंकि संचार कौशल जीवन में कई रास्ते खोलता है।',
    },
    reviewQuiz: [
      {
        questionHi: '"मैं खुश हूँ क्योंकि मैंने नई बातें सीखीं" का सही वाक्य कौन सा है?',
        options: ['I am happy because I learned new things.', 'I am happy although I learned.', 'I happy why I learned.', 'I am happy but I learned.'],
        correctIndex: 0,
        explanationHi: 'कारण बताने के लिए "because" का प्रयोग होता है: "I am happy because I learned new things."।',
      },
    ],
  },

  // DAY 10: Practical Final Assessment & Road Ahead
  {
    dayNumber: 10,
    title: 'Practical Final Assessment & Next Steps',
    titleHi: 'दिन 10: अंतिम व्यावहारिक मूल्यांकन व आगे की राह',
    subtitle: 'Comprehensive evaluation of listening, vocabulary, SVO patterns, tenses, and speaking',
    objectiveHi: 'आज आप पिछले 9 दिनों में सीखी गई सभी क्षमताओं (शब्दावली, SVO, 5 Tenses, Listening, Shadowing, बोलने का प्रवाह) का समग्र परीक्षण कर पाएंगे और अपनी प्रगति की तुलना कर सकेंगे।',
    previousReviewHi: 'आपने 1 से 9 दिनों के सभी मूल स्तंभों का सफलतापूर्वक अध्ययन किया है।',
    nextStepHi: 'कोर्स पूरा होने के बाद भी BhashaGuru में Words, AI Coach और Sentence Builder से रोज़ 20 मिनट अभ्यास जारी रखें।',
    grammarFocus: 'Synthesis of All 10 Days: Fluency, Accuracy, Confidence, and Realistic Next Steps',
    hindiExplanation: 'बधाई हो! आपने 10-दिवसीय संरचित बूटकैंप पूरा किया। याद रखें: कोई भी ऐप 10 दिन में जादू से संपूर्ण धाराप्रवाह होने का झूठा वादा नहीं कर सकता। भाषा एक निरंतर यात्रा है। 10 दिनों में आपने अपनी नींव मजबूत कर ली है। अब दैनिक अभ्यास से यह ज्ञान पक्का होगा।',
    keyRuleHindi: 'निरंतरता ही सफलता की कुंजी है — रोज़ाना 15-20 मिनट अभ्यास जारी रखें।',
    vocabulary: [
      { word: 'Success', hindi: 'सफलता', phonetic: 'सक्सेस', exampleEn: 'Practice brings success.', exampleHi: 'अभ्यास से सफलता मिलती है।' },
      { word: 'Improve', hindi: 'सुधारना', phonetic: 'इम्प्रूव', exampleEn: 'I improved my English.', exampleHi: 'मैंने अपनी अंग्रेज़ी सुधारी।' },
      { word: 'Confident', hindi: 'आत्मविश्वासी', phonetic: 'कॉन्फिडेंट', exampleEn: 'I feel confident now.', exampleHi: 'मैं अब आत्मविश्वासी महसूस करता हूँ।' },
    ],
    keyPhrases: [
      { phrase: 'I have completed my 10-day English speaking course.', hindi: 'मैंने अपना 10-दिवसीय अंग्रेज़ी स्पीकिंग कोर्स पूरा कर लिया है।', tip: 'Present Perfect का सुंदर प्रयोग।' },
      { phrase: 'I can now build sentences using the SVO pattern.', hindi: 'अब मैं SVO पैटर्न का उपयोग करके वाक्य बना सकता हूँ।', tip: 'अपनी नई क्षमता व्यक्त करें।' },
    ],
    listeningSpeakingPrompt: {
      sentenceEn: 'I am proud of my progress and I will continue practicing every day.',
      sentenceHi: 'मुझे अपनी प्रगति पर गर्व है और मैं हर दिन अभ्यास जारी रखूँगा।',
      guideTipHindi: 'गर्व और आत्मविश्वास के साथ इस वाक्य को बोलें।',
    },
    roleplayScenario: {
      id: 'day10_final',
      title: 'Graduation Conversation with AI Coach',
      contextHindi: 'AI शिक्षक के साथ अपना अंतिम समीक्षा संवाद पूरा करें। अपनी प्रगति साझा करें।',
      aiStarterPromptHindi: 'Congratulations on reaching Day 10! How do you feel about your English journey so far?',
      suggestedResponses: [
        'I feel much more confident now than Day 1.',
        'I learned SVO patterns and five core tenses.',
        'I will continue practicing with BhashaGuru every day.',
      ],
    },
    speakingChallenge: {
      challengePromptHindi: 'अपने 10 दिनों के अनुभव और आगे की योजना के बारे में 3 पूरे वाक्य बोलें।',
      targetWordCount: '25-35 words',
      modelAnswerEn: 'During these ten days, I learned high-frequency words, SVO sentence building, and the five core tenses. I can now speak with more confidence and will practice daily.',
      modelAnswerHi: 'इन दस दिनों के दौरान मैंने उच्च-आवृत्ति शब्द, SVO वाक्य निर्माण और पाँच मुख्य काल सीखे। अब मैं अधिक आत्मविश्वास से बोल सकता हूँ और रोज़ाना अभ्यास करूँगा।',
    },
    reviewQuiz: [
      {
        questionHi: 'दैनिक बातचीत में अंग्रेज़ी सीखने को स्थायी बनाए रखने का सबसे अच्छा तरीका क्या है?',
        options: ['रोज़ाना 15-20 मिनट बोलना, सुनना और वाक्य बनाना', 'महीने में केवल एक बार पढ़ना', 'केवल हिंदी में अनुवाद करना', 'कभी न बोलना'],
        correctIndex: 0,
        explanationHi: 'दैनिक निरंतर अभ्यास (15-20 मिनट) ही भाषा सीखने का सबसे वैज्ञानिक और प्रभावी तरीका है।',
      },
    ],
  },
];
