import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Mic,
  Volume2,
  MessageSquare,
  ListChecks,
} from 'lucide-react';
import { parseFlexibleVocabularyInput } from '../services/vocabParser';

interface OnboardingFlowProps {
  onImportAndCreateLesson: (rawText: string) => Promise<void>;
  onStartNow: () => void;
  wordCount: number;
  isEnriching: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onImportAndCreateLesson,
  onStartNow,
  wordCount,
  isEnriching,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rawText, setRawText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const parsedPreviewWords = parseFlexibleVocabularyInput(rawText);

  const handleCreateLesson = async () => {
    if (parsedPreviewWords.length === 0) {
      setErrorMsg(
        'कृपया कम से कम 1 English शब्द पेस्ट करें। आप केवल शब्द (e.g. apple) या साथ में हिंदी (e.g. apple - एप्पल - सेब) भी लिख सकते हैं।'
      );
      return;
    }
    setErrorMsg('');
    await onImportAndCreateLesson(rawText);
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-8">
        <span className={step === 1 ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}>
          01. Welcome
        </span>
        <span aria-hidden="true">·</span>
        <span className={step === 2 ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}>
          02. Paste Words
        </span>
        <span aria-hidden="true">·</span>
        <span className={step === 3 ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}>
          03. Lesson Ready
        </span>
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-600/20">
            <Volume2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
            Learn English With Your AI Teacher
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-3 leading-relaxed">
            अपने खुद के English words पेस्ट करें। आपका AI Teacher हिंदी में समझाकर सवाल पूछेगा, उच्चारण सुधारेगा, और आपके साथ बातचीत करेगा।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 my-8">
            <span>Voice-to-Voice Hindi + English</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Pronunciation Coach</span>
            <span aria-hidden="true">·</span>
            <span>Spaced Repetition</span>
          </div>

          <button
            onClick={() => setStep(2)}
            className="min-h-[48px] px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base inline-flex items-center gap-2.5 shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                Paste your English words
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                यहाँ 10, 50, या 100+ English शब्द पेस्ट करें।
              </p>
            </div>
            <div className="text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {parsedPreviewWords.length} words detected
            </div>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={9}
            placeholder="Paste your English words here...&#10;apple&#10;beautiful&#10;borrow&#10;careful&#10;decide"
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-base text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />

          {errorMsg && (
            <p className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-medium">{errorMsg}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRawText('')}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                Clear Box
              </button>
            </div>

            <button
              onClick={handleCreateLesson}
              disabled={isEnriching}
              className="min-h-[48px] px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEnriching ? 'Analyzing Vocabulary with AI...' : 'Create My Lesson'}</span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-white mb-2">
            Your lesson is ready!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            आपके शब्दों के लिए हिंदी अर्थ, व्यावहारिक वाक्य, और इंटरएक्टिव सवाल तैयार हैं।
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {wordCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Words Loaded</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <ListChecks className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {Math.max(20, wordCount * 2)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Practice Questions</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {Math.max(10, wordCount)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Speaking Exercises</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                5
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Conversation Scenarios</div>
            </div>
          </div>

          <button
            onClick={onStartNow}
            className="min-h-[48px] px-10 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base inline-flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Start</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
