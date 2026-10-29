import React from 'react';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ArrowUpRight,
  Mic,
  BookOpen,
} from 'lucide-react';
import {
  AppSettings,
  AudioHistoryEntry,
  DifficultyLevel,
  LearnerMemory,
  VocabularyWord,
  WordMasteryStatus,
} from '../types/learning';
import { ttsService } from '../services/ttsService';

interface ProgressDashboardProps {
  words: VocabularyWord[];
  memory: LearnerMemory;
  audioHistory: AudioHistoryEntry[];
  settings: AppSettings;
  onPracticeWord: (word: VocabularyWord) => void;
  onChangeDifficulty: (level: DifficultyLevel) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  words,
  memory,
  audioHistory,
  settings,
  onPracticeWord,
  onChangeDifficulty,
}) => {
  const totalWords = words.length;
  const wordsLearned = words.filter(
    (w) => w.status === WordMasteryStatus.LEARNING || w.status === WordMasteryStatus.MASTERED
  ).length;
  const wordsMastered = words.filter((w) => w.status === WordMasteryStatus.MASTERED).length;
  const wordsRemaining = Math.max(0, totalWords - wordsLearned);
  const wordsNeedingReviewList = words.filter(
    (w) => w.status === WordMasteryStatus.NEEDS_PRACTICE || w.wrongCount > 0
  );

  const avg = (arr: number[], fallback: number) =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;

  const accuracy =
    memory.totalQuestionsAnswered > 0
      ? Math.round((memory.totalCorrectAnswers / memory.totalQuestionsAnswered) * 100)
      : 84;
  const pronunciationScore = avg(memory.pronunciationScores, 78);
  const grammarScore = avg(memory.grammarScores, 82);
  const speakingScore = avg(memory.speakingScores, 80);

  const recommendedLevel: DifficultyLevel =
    accuracy >= 88 && grammarScore >= 85
      ? DifficultyLevel.ADVANCED
      : accuracy >= 75
      ? DifficultyLevel.INTERMEDIATE
      : DifficultyLevel.BEGINNER;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Today&apos;s Learning Analytics</span>
              <span aria-hidden="true">·</span>
              <span>Current Level: {settings.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>AI Recommended: {recommendedLevel}</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
              Your English Mastery Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50">
              <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums leading-none">
                  {memory.streakDays} Day Streak
                </div>
                <div className="text-[11px] text-slate-500">Consistent Learner</div>
              </div>
            </div>

            {recommendedLevel !== settings.difficulty && (
              <button
                type="button"
                onClick={() => onChangeDifficulty(recommendedLevel)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Switch to Recommended: {recommendedLevel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Today&apos;s Vocabulary</div>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {wordsLearned} / {totalWords}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
              Remaining: {wordsRemaining} · Mastered: {wordsMastered}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Overall Accuracy</div>
            <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Questions answered: {memory.totalQuestionsAnswered}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pronunciation Score</div>
            <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {pronunciationScore}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Syllable & clarity index</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Grammar & Speaking</div>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {grammarScore}% · {speakingScore}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Grammar ({grammarScore}%) / Speaking ({speakingScore}%)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                  Needs Practice ({wordsNeedingReviewList.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">High Priority Recall</span>
            </div>

            {wordsNeedingReviewList.length === 0 ? (
              <div className="py-6 text-sm text-slate-600 dark:text-slate-400">
                अभी कोई भी शब्द &ldquo;Needs Practice&rdquo; में नहीं है। नीचे कुछ मुख्य शब्दों का अभ्यास करें:
                <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {words.slice(0, 4).map((w) => (
                    <div key={w.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white capitalize">{w.word}</span>
                        <span className="text-xs text-slate-500 ml-2">({w.hindiMeaning})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPracticeWord(w)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Practice →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {wordsNeedingReviewList.map((w) => (
                  <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white capitalize">{w.word}</div>
                      <div className="text-xs text-slate-500">{w.hindiMeaning} · Missed {w.wrongCount}x</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ttsService.speak(w.word, settings)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onPracticeWord(w)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold cursor-pointer"
                      >
                        Practice Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white mb-2">
              AI Teacher Learning Memory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              आपका AI Teacher आपकी पिछली गलतियों और प्रगति को याद रखता है:
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Common Grammar Focus Areas:</span>
                <p className="text-slate-800 dark:text-slate-200">
                  {memory.commonGrammarMistakes.length > 0
                    ? memory.commonGrammarMistakes.slice(0, 3).join(' · ')
                    : 'Past tense verbs (went vs go) · Using articles (a/an/the) · Temporary action words (borrow vs take)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                  Spaced Repetition Word Tracker
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">{words.length} Total Words</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    <th className="py-2.5 pr-3 font-medium">Word</th>
                    <th className="py-2.5 px-3 font-medium">Hindi Meaning</th>
                    <th className="py-2.5 px-3 font-medium text-right">Recalls</th>
                    <th className="py-2.5 px-3 font-medium text-right">Spoken</th>
                    <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {words.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white capitalize">{w.word}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{w.hindiMeaning}</td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        {w.correctCount}✓ / {w.wrongCount}✗
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        {w.speakingCorrectCount}x
                      </td>
                      <td className="py-3 pl-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300">
                        {w.status === WordMasteryStatus.MASTERED && (
                          <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                          </span>
                        )}
                        {w.status === WordMasteryStatus.LEARNING && (
                          <span className="text-indigo-600 dark:text-indigo-400">Learning</span>
                        )}
                        {w.status === WordMasteryStatus.NEEDS_PRACTICE && (
                          <span className="text-amber-600 dark:text-amber-400">Needs Practice</span>
                        )}
                        {w.status === WordMasteryStatus.NEW && <span className="text-slate-400">New</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Spoken Responses
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Audio Storage: {settings.saveAudioHistory ? 'Enabled' : 'Text Only'}
              </span>
            </div>

            {audioHistory.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">
                जब आप माइक से बोलकर उत्तर देंगे, तो आपका उच्चारण और व्याकरण विश्लेषण यहाँ दिखेगा।
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[260px] overflow-y-auto">
                {audioHistory.slice(0, 8).map((item) => (
                  <div key={item.id} className="py-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">&ldquo;{item.recognizedText}&rdquo;</span>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        Grammar: {item.grammarScore}% · Pron: {item.pronunciationScore}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Expected: &ldquo;{item.expectedSentence}&rdquo; · {item.feedbackHindi}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
