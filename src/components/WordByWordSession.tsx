import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Keyboard,
  HelpCircle,
  Sparkles,
  Play,
  Gauge,
} from 'lucide-react';
import {
  AnswerEvaluation,
  AppSettings,
  DifficultyLevel,
  QuestionInstance,
  QuestionType,
  VocabularyWord,
} from '../types/learning';
import { createQuestionForWord, selectOrderedWordsForSession } from '../services/spacedRepetition';
import { evaluateLearnerAnswer } from '../services/aiService';
import { ttsService } from '../services/ttsService';
import { speechRecorder } from '../services/sttService';

interface WordByWordSessionProps {
  words: VocabularyWord[];
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onWordEvaluated: (
    wordId: string,
    evaluation: AnswerEvaluation,
    userAnswer: string,
    expectedAnswer: string,
    isSpoken: boolean,
    audioDataUrl?: string
  ) => void;
  onOpenAIConversation: () => void;
}

const QUESTION_TYPE_OPTIONS: { type: QuestionType; shortLabel: string }[] = [
  { type: QuestionType.SITUATION_BASED, shortLabel: 'Type C: Situation' },
  { type: QuestionType.HINDI_TO_ENGLISH, shortLabel: 'Type A: Hindi → En' },
  { type: QuestionType.FILL_IN_THE_BLANK, shortLabel: 'Type B: Fill Blank' },
  { type: QuestionType.MEANING, shortLabel: 'Type D: Meaning' },
  { type: QuestionType.MAKE_SENTENCE, shortLabel: 'Type E: Sentence' },
  { type: QuestionType.REVERSE_RECALL, shortLabel: 'Type F: Recall' },
];

export const WordByWordSession: React.FC<WordByWordSessionProps> = ({
  words,
  settings,
  onUpdateSettings,
  onWordEvaluated,
  onOpenAIConversation,
}) => {
  const [sessionWords, setSessionWords] = useState<VocabularyWord[]>(() =>
    selectOrderedWordsForSession(words)
  );
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [forcedType, setForcedType] = useState<QuestionType | undefined>(undefined);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInstance | null>(null);

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [micError, setMicError] = useState<string>('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [lastAudioUrl, setLastAudioUrl] = useState<string | undefined>(undefined);
  const [retryMode, setRetryMode] = useState<boolean>(false);

  useEffect(() => {
    const ordered = selectOrderedWordsForSession(words);
    setSessionWords(ordered);
    if (currentIdx >= ordered.length) {
      setCurrentIdx(0);
    }
  }, [words.length]);

  const activeWord = sessionWords[currentIdx] || words[0];

  useEffect(() => {
    if (!activeWord) return;
    const q = createQuestionForWord(activeWord, currentIdx, forcedType, settings.difficulty);
    setCurrentQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
    setRetryMode(false);
    setShowHint(false);
    setMicError('');

    if (settings.autoPlayTeacherVoice) {
      ttsService.speak(q.promptHindi, settings);
    }
  }, [activeWord?.id, currentIdx, forcedType, settings.difficulty]);

  if (!activeWord || !currentQuestion) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
        <p className="text-base text-slate-600 dark:text-slate-400">
          कृपया पहले &quot;Words&quot; टैब में जाकर अपने English words लोड करें।
        </p>
      </div>
    );
  }

  const handleToggleMic = async () => {
    setMicError('');
    if (isRecording) {
      setIsRecording(false);
      setMicVolume(0);
      setIsEvaluating(true);
      const sttRes = await speechRecorder.stop(
        settings.sttProvider === 'gemini-transcribe'
      );
      setLastAudioUrl(sttRes.audioDataUrl);

      const transcriptToEvaluate = (sttRes.transcript || userAnswer || '').trim();
      if (transcriptToEvaluate) {
        setUserAnswer(transcriptToEvaluate);
        await submitForEvaluation(transcriptToEvaluate, true, sttRes.audioDataUrl);
      } else {
        setIsEvaluating(false);
        setShowTextBox(true);
        setMicError(
          'आपकी आवाज़ स्पष्ट रूप से रिकॉर्ड नहीं हो सकी। कृपया एक बार फिर बोलें या नीचे टाइप करें।'
        );
      }
    } else {
      ttsService.stop();
      const started = await speechRecorder.start(
        (interim) => setUserAnswer(interim),
        (err) => {
          setMicError(err);
          setIsRecording(false);
          setMicVolume(0);
          setShowTextBox(true);
        },
        (vol) => setMicVolume(vol)
      );
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const submitForEvaluation = async (
    answerText: string,
    isSpoken: boolean,
    audioDataUrl?: string
  ) => {
    if (!answerText.trim()) return;
    setIsEvaluating(true);

    if (retryMode && evaluation?.correctedSentence) {
      const cleanRetry = answerText.toLowerCase().replace(/[^a-z ]/g, '').trim();
      const cleanExpected = evaluation.correctedSentence
        .toLowerCase()
        .replace(/[^a-z ]/g, '')
        .trim();

      if (
        cleanRetry.includes(activeWord.word.toLowerCase()) ||
        cleanRetry === cleanExpected ||
        cleanRetry.split(' ').length >= 3
      ) {
        const successEval: AnswerEvaluation = {
          ...evaluation,
          status: 'CORRECT_NATURAL',
          isAccepted: true,
          requiresRetry: false,
          feedbackHindi: 'शाबाश! अब आपने बिल्कुल सही sentence बोला है। चलिए अगले शब्द पर चलते हैं।',
          spokenTeacherResponse: 'Excellent! अब आपका sentence बिल्कुल सही है।',
        };
        setEvaluation(successEval);
        setRetryMode(false);
        setIsEvaluating(false);
        onWordEvaluated(
          activeWord.id,
          successEval,
          answerText,
          currentQuestion.expectedAnswer,
          isSpoken,
          audioDataUrl
        );
        if (settings.autoPlayTeacherVoice) {
          ttsService.speak(successEval.spokenTeacherResponse, settings);
        }
        return;
      }
    }

    const result = await evaluateLearnerAnswer(
      currentQuestion,
      answerText,
      settings.difficulty,
      settings.hindiExplanationRatio,
      isSpoken
    );

    setEvaluation(result);
    setIsEvaluating(false);

    onWordEvaluated(
      activeWord.id,
      result,
      answerText,
      currentQuestion.expectedAnswer,
      isSpoken,
      audioDataUrl
    );

    if (settings.autoPlayTeacherVoice && result.spokenTeacherResponse) {
      ttsService.speak(result.spokenTeacherResponse, settings);
    }

    if (!result.isAccepted || result.requiresRetry) {
      setRetryMode(true);
    }
  };

  const handleNextWord = () => {
    setForcedType(undefined);
    if (currentIdx + 1 < sessionWords.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setRetryMode(true);
    if (evaluation?.correctedSentence && settings.autoPlayTeacherVoice) {
      ttsService.speak(
        `एक बार यह सही वाक्य बोलिए: ${evaluation.correctedSentence}`,
        settings
      );
    }
  };

  const progressPercentage = Math.round(((currentIdx + 1) / sessionWords.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Progress Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              Word {currentIdx + 1} / {sessionWords.length}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Focus Word: <strong className="text-slate-900 dark:text-white capitalize">{activeWord.word}</strong> ({activeWord.phoneticHindi})
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">{activeWord.status}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateSettings({ autoPlayTeacherVoice: !settings.autoPlayTeacherVoice })}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                settings.autoPlayTeacherVoice
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {settings.autoPlayTeacherVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{settings.autoPlayTeacherVoice ? 'AI Voice On' : 'Voice Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => ttsService.speak(ttsService.getLastSpokenText() || currentQuestion.promptHindi, settings)}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>

            <button
              type="button"
              onClick={() => ttsService.speak(evaluation?.correctedSentence || currentQuestion.promptHindi, settings, 'slow')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer ${
                settings.speakingSpeed === 'slow'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Slow</span>
            </button>

            <button
              type="button"
              onClick={() => ttsService.speak(evaluation?.correctedSentence || currentQuestion.promptHindi, settings, 'normal')}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Normal</span>
            </button>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 shrink-0 mr-1">Question Mode:</span>
            {QUESTION_TYPE_OPTIONS.map((opt) => {
              const active = currentQuestion.type === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setForcedType(opt.type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-1">Level:</span>
            {[
              { level: DifficultyLevel.BEGINNER, label: 'Beginner' },
              { level: DifficultyLevel.INTERMEDIATE, label: 'Inter.' },
              { level: DifficultyLevel.ADVANCED, label: 'Adv.' },
            ].map((d) => (
              <button
                key={d.level}
                type="button"
                onClick={() => onUpdateSettings({ difficulty: d.level })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  settings.difficulty === d.level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Stage: Current AI Teacher Question Card with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.99 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm"
        >
          {/* Word Showcase Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                {activeWord.word}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                [{activeWord.phoneticHindi}]
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                अर्थ: {activeWord.hindiMeaning}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => ttsService.speak(activeWord.word, settings)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-xs"
                title="Listen English Pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>उच्चारण</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  ttsService.speak(
                    `${activeWord.word}. उच्चारण है ${activeWord.phoneticHindi}. अर्थ है ${activeWord.hindiMeaning}`,
                    settings
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium inline-flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-xs"
                title="Listen Hindi explanation"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>हिंदी</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="font-semibold">{currentQuestion.typeLabel}</span>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-snug">
              &ldquo;{currentQuestion.promptHindi}&rdquo;
            </p>
            {currentQuestion.promptEnglish && (
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                {currentQuestion.promptEnglish}
              </p>
            )}
          </div>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-sm text-indigo-950 dark:text-indigo-200 overflow-hidden"
            >
              <div className="font-semibold mb-1">
                Word: {activeWord.word} [{activeWord.phoneticHindi}] — {activeWord.hindiMeaning}
              </div>
              <div className="text-xs text-indigo-700 dark:text-indigo-300">
                {currentQuestion.hintText}
              </div>
            </motion.div>
          )}

          <div className="flex flex-col items-center justify-center py-4">
            {/* Live Visual Audio Wave when recording */}
            {isRecording && (
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 h-8">
                  {[0.4, 0.8, 1.2, 0.7, 1.0, 0.6, 0.9, 0.5].map((multiplier, i) => {
                    const height = Math.max(8, Math.min(32, Math.round(micVolume * multiplier * 0.4)));
                    return (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-pulse">
                  🎙️ आवाज़ रिकॉर्ड हो रही है... बोलिए (Recording voice...)
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleMic}
              disabled={isEvaluating}
              className={`min-h-[76px] min-w-[240px] px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span>Listening... Tap to Finish</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span>{retryMode ? 'Tap to Speak Corrected Sentence' : 'Tap to Speak in English'}</span>
                </>
              )}
            </button>

            {userAnswer && !showTextBox && (
              <div className="mt-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">You said:</span>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  &ldquo;{userAnswer}&rdquo;
                </p>
              </div>
            )}

            {micError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 text-center max-w-md">
                {micError}
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowTextBox(!showTextBox)}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 underline cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{showTextBox ? 'Hide keyboard input' : 'Type answer instead'}</span>
              </button>
            </div>
          </div>

          {showTextBox && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitForEvaluation(userAnswer, false);
              }}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={
                  retryMode && evaluation?.correctedSentence
                    ? `Type: ${evaluation.correctedSentence}`
                    : 'Type your English answer here...'
                }
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={isEvaluating || !userAnswer.trim()}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {isEvaluating ? 'Checking...' : 'Check Answer'}
              </button>
            </form>
          )}

          {isEvaluating && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>AI Teacher आपके उत्तर, व्याकरण और उच्चारण की जाँच कर रहे हैं...</span>
            </div>
          )}

          {evaluation && !isEvaluating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-6 rounded-2xl border ${
                evaluation.isAccepted && !evaluation.requiresRetry
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {evaluation.isAccepted && !evaluation.requiresRetry ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                  <span className="font-semibold text-base text-slate-900 dark:text-white">
                    {evaluation.status === 'CORRECT_NATURAL' && '✓ Excellent! Correct & Natural Sentence'}
                    {evaluation.status === 'CORRECT_ALT' && '✓ Correct! Valid Alternative Wording Accepted'}
                    {evaluation.status === 'GRAMMATICALLY_CORRECT_UNNATURAL' && '✗ Understandable, but let’s make it sound more natural'}
                    {evaluation.status === 'NEEDS_CORRECTION' && '✗ Needs a Small Correction'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 tabular-nums">
                  <span>Grammar: {evaluation.grammarScore}%</span>
                  <span>·</span>
                  <span>Pronunciation: {evaluation.pronunciationScore}%</span>
                </div>
              </div>

              <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                {evaluation.feedbackHindi}
              </p>

              <div className="space-y-2 bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                {!evaluation.isAccepted && userAnswer && (
                  <div className="text-sm">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mr-2">Your Answer:</span>
                    <span className="line-through text-slate-500 dark:text-slate-400">&ldquo;{userAnswer}&rdquo;</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mr-2">Correct English:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">&ldquo;{evaluation.correctedSentence}&rdquo;</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => ttsService.speak(evaluation.correctedSentence, settings)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>

                {evaluation.pronunciationTipHindi && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    उच्चारण टिप: {evaluation.pronunciationTipHindi}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm inline-flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again (एक बार सही वाक्य बोलिए)</span>
                  </button>

                  {lastAudioUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const a = new Audio(lastAudioUrl);
                        a.play();
                      }}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                    >
                      Play My Voice
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Next Word (#{((currentIdx + 1) % sessionWords.length) + 1})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Loaded words combined in real situations:{' '}
          {words.slice(0, 4).map((w) => w.word).join(', ')}
        </span>
        <button
          type="button"
          onClick={onOpenAIConversation}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Practice in AI Teacher Conversation →
        </button>
      </div>
    </div>
  );
};
