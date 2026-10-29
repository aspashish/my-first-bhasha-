import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Lock,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Play,
  Lightbulb,
} from 'lucide-react';
import { TEN_DAY_COURSE_DATA, CourseDay } from '../data/tenDayCourseData';
import { AppSettings, VocabularyWord } from '../types/learning';
import { ttsService } from '../services/ttsService';
import { speechRecorder } from '../services/sttService';
import { TutorAvatar } from './TutorAvatar';

interface TenDayCourseViewProps {
  settings: AppSettings;
  words: VocabularyWord[];
  onOpenTeacherConversation: (scenarioTopic?: string, starterPrompt?: string) => void;
  onRecordSpeakingScore: (grammarScore: number, speakingScore: number, mistakeText?: string) => void;
}

const COURSE_STORAGE_KEY = 'bhashaguru_10day_course_progress_v1';

export const TenDayCourseView: React.FC<TenDayCourseViewProps> = ({
  settings,
  onOpenTeacherConversation,
  onRecordSpeakingScore,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(COURSE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State for Part 4 Speaking Exercise
  const [isRecordingExercise, setIsRecordingExercise] = useState<boolean>(false);
  const [exerciseTranscript, setExerciseTranscript] = useState<string>('');
  const [exerciseFeedback, setExerciseFeedback] = useState<{
    score: number;
    feedbackHi: string;
    isGood: boolean;
  } | null>(null);

  // State for Part 8 Quiz
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // State for show model answer in challenge
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  // State for graduation certificate
  const [showGraduationModal, setShowGraduationModal] = useState<boolean>(false);

  // Sync completed days to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(completedDays));
    } catch {
      // ignore
    }
  }, [completedDays]);

  const currentDay: CourseDay =
    TEN_DAY_COURSE_DATA.find((d) => d.dayNumber === selectedDayNumber) || TEN_DAY_COURSE_DATA[0];

  const isCurrentDayCompleted = completedDays.includes(currentDay.dayNumber);

  const handleToggleDayCompleted = (dayNum: number) => {
    if (completedDays.includes(dayNum)) {
      setCompletedDays(completedDays.filter((d) => d !== dayNum));
    } else {
      const newCompleted = [...completedDays, dayNum];
      setCompletedDays(newCompleted);
      if (dayNum === 10) {
        setShowGraduationModal(true);
      }
    }
  };

  const handleToggleExerciseRecord = async () => {
    if (isRecordingExercise) {
      setIsRecordingExercise(false);
      const res = await speechRecorder.stop(false);
      const spokenText = res.transcript.trim();
      setExerciseTranscript(spokenText);

      if (spokenText) {
        const expected = currentDay.listeningSpeakingPrompt.sentenceEn.toLowerCase();
        const spoken = spokenText.toLowerCase();

        // Calculate simple match
        const expectedWords = expected.replace(/[^a-z ]/g, '').split(' ');
        const spokenWords = spoken.replace(/[^a-z ]/g, '').split(' ');
        let matches = 0;
        expectedWords.forEach((ew) => {
          if (spokenWords.includes(ew)) matches++;
        });

        const matchPercent = Math.round((matches / Math.max(1, expectedWords.length)) * 100);
        const score = Math.max(65, Math.min(98, matchPercent));

        if (score >= 75) {
          setExerciseFeedback({
            score,
            feedbackHi: `शानदार उच्चारण! आपने बहुत स्पष्ट और सटीक रूप से बोला (${score}% match)।`,
            isGood: true,
          });
          onRecordSpeakingScore(score, score);
        } else {
          setExerciseFeedback({
            score,
            feedbackHi: `अच्छी कोशिश! कुछ शब्दों का उच्चारण दोबारा सुनें और फिर से बोलें (${score}% match)।`,
            isGood: false,
          });
          onRecordSpeakingScore(score, score);
        }
      }
    } else {
      setExerciseFeedback(null);
      setExerciseTranscript('');
      ttsService.stop();
      const started = await speechRecorder.start(
        (interim) => setExerciseTranscript(interim),
        () => setIsRecordingExercise(false)
      );
      if (started) {
        setIsRecordingExercise(true);
      }
    }
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    currentDay.reviewQuiz.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Complete 10-Day Spoken English Bootcamp</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              10-Day English Speaking Course
            </h1>
            <p className="text-sm md:text-base text-indigo-100/90 leading-relaxed">
              हिंदी से धाराप्रवाह अंग्रेजी बोलना सीखें — 10 दैनिक संरचित मॉड्यूल, लाइव AI टीचर वार्तालाप,
              तात्कालिक सुधार और वास्तविक रोल-प्ले।
            </p>

            {/* Overall Progress Counter */}
            <div className="pt-2 flex items-center gap-4">
              <div className="flex-1 max-w-xs h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.round((completedDays.length / 10) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {completedDays.length} / 10 Days Completed ({Math.round((completedDays.length / 10) * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs shrink-0">
            <TutorAvatar isSpeaking={false} size="sm" showStatusBadge={false} />
            <div>
              <div className="text-xs text-indigo-200 font-medium">Your Personal Guide</div>
              <div className="font-semibold text-sm text-white">BhashaGuru AI Coach</div>
              <button
                type="button"
                onClick={() =>
                  onOpenTeacherConversation(
                    currentDay.roleplayScenario.title,
                    currentDay.roleplayScenario.aiStarterPromptHindi
                  )
                }
                className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Talk Live with AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Days Timeline / Selector Carousel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 px-1 flex items-center justify-between">
          <span>CURRICULUM DAYS (DAY 1 TO DAY 10)</span>
          <span>Click any day to study or review</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {TEN_DAY_COURSE_DATA.map((day) => {
            const isSelected = selectedDayNumber === day.dayNumber;
            const isDone = completedDays.includes(day.dayNumber);

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => {
                  setSelectedDayNumber(day.dayNumber);
                  setSelectedQuizAnswers({});
                  setQuizSubmitted(false);
                  setExerciseFeedback(null);
                  setExerciseTranscript('');
                  setShowModelAnswer(false);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                    : isDone
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold">
                  <span>DAY {day.dayNumber}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : null}
                </div>
                <div className="text-[10px] font-medium truncate w-full mt-1">
                  {day.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Day Lesson Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
        {/* Header of Active Day */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <span>DAY {currentDay.dayNumber} OF 10</span>
              <span aria-hidden="true">·</span>
              <span>{currentDay.grammarFocus}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {currentDay.title} ({currentDay.titleHi})
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentDay.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleToggleDayCompleted(currentDay.dayNumber)}
              className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors ${
                isCurrentDayCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCurrentDayCompleted ? 'Day Completed ✓' : 'Mark Day Completed'}</span>
            </button>
          </div>
        </div>

        {/* 1. Hindi Explanation & Key Grammar Rule */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>1. दैनिक संकल्पना एवं हिंदी व्याख्या (Concept Explanation)</span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-slate-900 dark:text-slate-100 leading-relaxed text-sm md:text-base space-y-3">
            <p>{currentDay.hindiExplanation}</p>
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-300/80 dark:border-amber-800/80 flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-0.5">
                  Golden Speaking Rule:
                </span>
                <span className="text-xs md:text-sm font-medium">{currentDay.keyRuleHindi}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Vocabulary & Phrases */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>2. आवश्यक शब्दावली (Core Vocabulary & Usage)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentDay.vocabulary.map((vocab, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-base text-slate-900 dark:text-white mr-2">
                      {vocab.word}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">[{vocab.phonetic}]</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => ttsService.speak(vocab.word, settings)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 cursor-pointer"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {vocab.hindi}
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-medium text-slate-900 dark:text-white">&ldquo;{vocab.exampleEn}&rdquo;</div>
                  <div className="text-slate-500 mt-0.5">{vocab.exampleHi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Everyday Conversational Phrases */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>3. महत्वपूर्ण बातचीत के वाक्य (Key Speaking Phrases)</span>
          </div>

          <div className="space-y-3">
            {currentDay.keyPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                    &ldquo;{phrase.phrase}&rdquo;
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{phrase.hindi}</div>
                  {phrase.tip && (
                    <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                      💡 {phrase.tip}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => ttsService.speak(phrase.phrase, settings)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 hover:bg-indigo-50 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Sentence</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Listening & Speaking Exercise */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>4. बोलकर अभ्यास करें (Listening & Speaking Workout)</span>
            </div>
            <span className="text-xs font-medium text-slate-500">Live Voice Feedback</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Target sentence to listen & speak:</div>
            <div className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
              &ldquo;{currentDay.listeningSpeakingPrompt.sentenceEn}&rdquo;
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {currentDay.listeningSpeakingPrompt.sentenceHi}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium pt-1">
              Tip: {currentDay.listeningSpeakingPrompt.guideTipHindi}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => ttsService.speak(currentDay.listeningSpeakingPrompt.sentenceEn, settings)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Hear Voice</span>
              </button>

              <button
                type="button"
                onClick={handleToggleExerciseRecord}
                className={`px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all ${
                  isRecordingExercise
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRecordingExercise ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecordingExercise ? 'Stop & Evaluate' : 'Tap & Speak in English'}</span>
              </button>
            </div>
          </div>

          {exerciseTranscript && (
            <div className="text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono">
              <span className="text-slate-500">What was recognized: </span>
              <span className="font-semibold text-slate-900 dark:text-white">&ldquo;{exerciseTranscript}&rdquo;</span>
            </div>
          )}

          {exerciseFeedback && (
            <div
              className={`p-4 rounded-2xl border text-sm font-medium flex items-center justify-between gap-3 ${
                exerciseFeedback.isGood
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div>{exerciseFeedback.feedbackHi}</div>
              <div className="font-mono font-bold text-base shrink-0">{exerciseFeedback.score}%</div>
            </div>
          )}
        </div>

        {/* 5. Live AI Role-Play Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                5. लाइव एआई रोल-प्ले (Interactive Voice Dialogue)
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {currentDay.roleplayScenario.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenTeacherConversation(
                  currentDay.roleplayScenario.title,
                  currentDay.roleplayScenario.aiStarterPromptHindi
                )
              }
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Role-Play Conversation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            {currentDay.roleplayScenario.contextHindi}
          </p>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
            <div className="text-xs font-semibold text-slate-500">AI Teacher Question:</div>
            <div className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
              &ldquo;{currentDay.roleplayScenario.aiStarterPromptHindi}&rdquo;
            </div>
            <div className="text-xs text-slate-500 pt-1">
              Sample answers you can speak:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700 dark:text-slate-300">
                {currentDay.roleplayScenario.suggestedResponses.map((res, i) => (
                  <li key={i}>&ldquo;{res}&rdquo;</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Speaking Challenge */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Award className="w-4 h-4 text-amber-500" />
              <span>6. दैनिक स्पीकिंग चुनौती (Speaking Challenge)</span>
            </div>
            <span className="text-xs font-mono text-slate-500">{currentDay.speakingChallenge.targetWordCount}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {currentDay.speakingChallenge.challengePromptHindi}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {showModelAnswer ? 'Hide Model Answer' : 'View Ideal Answer Example →'}
              </button>
            </div>

            {showModelAnswer && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white leading-relaxed">
                  &ldquo;{currentDay.speakingChallenge.modelAnswerEn}&rdquo;
                </div>
                <div className="text-slate-500">{currentDay.speakingChallenge.modelAnswerHi}</div>
                <button
                  type="button"
                  onClick={() => ttsService.speak(currentDay.speakingChallenge.modelAnswerEn, settings)}
                  className="mt-2 text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Model Answer</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 7. Review Quiz */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>7. दैनिक समीक्षा क्विज़ (Review Quiz)</span>
            </div>
            {quizSubmitted && (
              <span className="text-xs font-mono font-bold text-emerald-600">
                Score: {calculateQuizScore()} / {currentDay.reviewQuiz.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {currentDay.reviewQuiz.map((quiz, qIdx) => {
              const selectedOpt = selectedQuizAnswers[qIdx];
              const isCorrect = selectedOpt === quiz.correctIndex;

              return (
                <div
                  key={qIdx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {qIdx + 1}. {quiz.questionHi}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quiz.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle =
                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                      if (quizSubmitted) {
                        if (optIdx === quiz.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-semibold';
                        } else if (isChosen) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleQuizAnswer(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-colors ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`text-xs p-3 rounded-xl ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      💡 {quiz.explanationHi}
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted ? (
              <button
                type="button"
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(selectedQuizAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                Submit Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation between days */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentDay.dayNumber === 1}
            onClick={() => setSelectedDayNumber(currentDay.dayNumber - 1)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Day</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleDayCompleted(currentDay.dayNumber)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              isCurrentDayCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCurrentDayCompleted ? 'Completed ✓' : 'Mark Complete & Continue'}</span>
          </button>

          <button
            type="button"
            disabled={currentDay.dayNumber === 10}
            onClick={() => setSelectedDayNumber(currentDay.dayNumber + 1)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next Day</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Graduation Certificate Modal */}
      {showGraduationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                BHASHAGURU GRADUATION
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Congratulations, Champion!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                आपने 10-दिवसीय Spoken English Course सफलतापूर्वक पूरा कर लिया है! आपका आत्मविश्वास,
                उच्चारण और बातचीत की गति अब पहले से कई गुना बेहतर है।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 font-medium">
              🎓 Certificate of Fluency Mastery awarded to you by BhashaGuru AI English Coach.
            </div>

            <button
              type="button"
              onClick={() => setShowGraduationModal(false)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm cursor-pointer"
            >
              Close & Keep Practicing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
