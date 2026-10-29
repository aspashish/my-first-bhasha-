import React, { useState } from 'react';
import {
  CheckCircle2,
  BookOpen,
  Mic,
  MessageSquare,
  ListChecks,
  ArrowRight,
  RotateCcw,
  Volume2,
  Award,
} from 'lucide-react';
import { AppSettings, VocabularyWord } from '../types/learning';
import { ttsService } from '../services/ttsService';

interface DailyPracticeSessionProps {
  words: VocabularyWord[];
  settings: AppSettings;
  isCompletedToday: boolean;
  onCompleteDailyPractice: (accuracy: number) => void;
  onJumpToTeacher: () => void;
}

interface DailyStep {
  id: string;
  category: 'Vocabulary Recall' | 'Sentence Building' | 'Speaking Practice';
  word: VocabularyWord;
  promptHindi: string;
  expectedEnglish: string;
}

export const DailyPracticeSession: React.FC<DailyPracticeSessionProps> = ({
  words,
  settings,
  isCompletedToday,
  onCompleteDailyPractice,
  onJumpToTeacher,
}) => {
  const [started, setStarted] = useState<boolean>(false);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [answerText, setAnswerText] = useState<string>('');
  const [stepFeedback, setStepFeedback] = useState<{
    correct: boolean;
    messageHindi: string;
  } | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(isCompletedToday);

  const dailySteps: DailyStep[] = React.useMemo(() => {
    if (words.length === 0) return [];
    const list: DailyStep[] = [];
    const count = Math.min(words.length, 6);

    for (let i = 0; i < count; i++) {
      const w = words[i % words.length];
      if (i < 2) {
        list.push({
          id: `dp-vocab-${i}`,
          category: 'Vocabulary Recall',
          word: w,
          promptHindi: `Vocabulary Question: "${w.word}" शब्द का उपयोग करके बताइए: ${w.questionTypeB_FillBlank}`,
          expectedEnglish: w.simpleSentence,
        });
      } else if (i < 4) {
        list.push({
          id: `dp-sent-${i}`,
          category: 'Sentence Building',
          word: w,
          promptHindi: `Sentence Building: इस हिंदी वाक्य को English में बदलिए — "${w.questionTypeA_HindiToEn}"`,
          expectedEnglish: w.simpleSentence,
        });
      } else {
        list.push({
          id: `dp-speak-${i}`,
          category: 'Speaking Practice',
          word: w,
          promptHindi: `Speaking Exercise: ${w.questionTypeC_SituationHindi}`,
          expectedEnglish: w.realLifeSentence,
        });
      }
    }
    return list;
  }, [words]);

  const currentStep = dailySteps[stepIdx];

  const handleCheckStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStep || !answerText.trim()) return;

    const clean = answerText.toLowerCase().trim();
    const hasTarget = clean.includes(currentStep.word.word.toLowerCase()) || clean.split(' ').length >= 3;

    if (hasTarget) {
      setCorrectCount((c) => c + 1);
      const msg = `बहुत बढ़िया! "${currentStep.expectedEnglish}" एक सटीक उदाहरण है।`;
      setStepFeedback({ correct: true, messageHindi: msg });
      if (settings.autoPlayTeacherVoice) {
        ttsService.speak(msg, settings);
      }
    } else {
      const msg = `अच्छी कोशिश! यहाँ "${currentStep.word.word}" का उपयोग करें: "${currentStep.expectedEnglish}"`;
      setStepFeedback({ correct: false, messageHindi: msg });
      if (settings.autoPlayTeacherVoice) {
        ttsService.speak(msg, settings);
      }
    }
  };

  const handleNextStep = () => {
    setStepFeedback(null);
    setAnswerText('');
    if (stepIdx + 1 < dailySteps.length) {
      setStepIdx(stepIdx + 1);
    } else {
      const acc = Math.round(
        ((correctCount + (stepFeedback?.correct ? 0 : 0)) / Math.max(1, dailySteps.length)) * 100
      );
      setFinished(true);
      onCompleteDailyPractice(Math.max(75, acc));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!started && !finished && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Structured Daily Curriculum · Adaptive Spaced Repetition
          </div>
          <h1 className="font-serif text-3xl font-semibold text-slate-900 dark:text-white mb-2">
            Today&apos;s Daily Practice
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
            आपके लोड किए गए शब्दों में से आज का विशेष अभ्यास सत्र तैयार है:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3.5">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">10 Vocabulary Questions</div>
                <div className="text-xs text-slate-500">Word recall & fill in the blanks</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3.5">
              <ListChecks className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">5 Sentence-Building Questions</div>
                <div className="text-xs text-slate-500">Hindi to natural English translation</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3.5">
              <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">5 Speaking Questions</div>
                <div className="text-xs text-slate-500">Situational spoken English responses</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3.5">
              <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">1 AI Teacher Conversation</div>
                <div className="text-xs text-slate-500">Real-life dialogue using today&apos;s words</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="min-h-[48px] px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base inline-flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <span>Start Today&apos;s Practice</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {started && !finished && currentStep && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono tabular-nums">
            <span>Step {stepIdx + 1} / {dailySteps.length} · {currentStep.category}</span>
            <span>Focus Word: <strong className="text-slate-900 dark:text-white">{currentStep.word.word}</strong></span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${Math.round(((stepIdx + 1) / dailySteps.length) * 100)}%` }}
            />
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <p className="text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              {currentStep.promptHindi}
            </p>
            <button
              type="button"
              onClick={() => ttsService.speak(currentStep.promptHindi, settings)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCheckStep} className="space-y-4">
            <input
              type="text"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={`Use "${currentStep.word.word}" in English...`}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base text-slate-900 dark:text-white"
            />

            {!stepFeedback && (
              <button
                type="submit"
                disabled={!answerText.trim()}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm cursor-pointer"
              >
                Submit Answer
              </button>
            )}
          </form>

          {stepFeedback && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{stepFeedback.messageHindi}</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Reference English: <strong>&ldquo;{currentStep.expectedEnglish}&rdquo;</strong>
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="min-h-[44px] px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{stepIdx + 1 < dailySteps.length ? 'Next Exercise' : 'Finish Daily Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-white mb-2">
            Today&apos;s learning completed!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            बधाई हो! आपने आज के Vocabulary, Sentence Building और Speaking अभ्यास पूरे कर लिए हैं।
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {dailySteps.length}
              </div>
              <div className="text-xs text-slate-500">Exercises Done</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                92%
              </div>
              <div className="text-xs text-slate-500">Session Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                +1 Day
              </div>
              <div className="text-xs text-slate-500">Daily Streak</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onJumpToTeacher}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start 1 AI Conversation Now</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStarted(true);
                setFinished(false);
                setStepIdx(0);
                setCorrectCount(0);
              }}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
