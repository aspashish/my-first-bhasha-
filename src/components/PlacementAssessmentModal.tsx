import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  RotateCcw,
  Award,
  X,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import {
  DifficultyLevel,
  LEARNER_LEVELS,
  PlacementQuestion,
} from '../types/learning';
import { ttsService } from '../services/ttsService';

interface PlacementAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAssessment: (
    assignedLevel: DifficultyLevel,
    score: number,
    total: number,
    breakdown: { vocabulary: number; grammar: number; listening: number }
  ) => void;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1',
    category: 'vocabulary',
    questionHi: '1. "Water" शब्द का सही हिंदी अर्थ क्या है?',
    options: ['पानी', 'हवा', 'दूध', 'आग'],
    correctIndex: 0,
    explanationHi: '"Water" का अर्थ "पानी" होता है। यह सबसे सामान्य और उपयोगी शब्दों में से एक है।',
  },
  {
    id: 'pq-2',
    category: 'vocabulary',
    questionHi: '2. किसी से पहली बार मिलने पर अंग्रेज़ी में कौन सा अभिवादन सबसे उपयुक्त है?',
    options: [
      'Nice to meet you (आपसे मिलकर अच्छा लगा)',
      'Good night (शुभ रात्रि)',
      'I am busy (मैं व्यस्त हूँ)',
      'See you yesterday (कल मिले थे)',
    ],
    correctIndex: 0,
    explanationHi: 'नए व्यक्ति से मिलने पर "Nice to meet you" कहा जाता है।',
  },
  {
    id: 'pq-3',
    category: 'grammar',
    questionHi: '3. अंग्रेज़ी में "मैं किताब पढ़ता हूँ" का सही वाक्य क्रम (SVO) कौन सा है?',
    options: [
      'I read books (Subject + Verb + Object)',
      'I books read (Subject + Object + Verb)',
      'Read I books (Verb + Subject + Object)',
      'Books I read',
    ],
    correctIndex: 0,
    explanationHi:
      'हिंदी में क्रम "कर्ता + कर्म + क्रिया" (मैं किताब पढ़ता हूँ) होता है, जबकि अंग्रेज़ी में "Subject + Verb + Object" (I read books) होता है।',
  },
  {
    id: 'pq-4',
    category: 'comprehension',
    questionHi: '4. "She likes tea" का सही हिंदी अर्थ क्या है?',
    options: [
      'उसे चाय पसंद है',
      'वह चाय बना रही है',
      'वह चाय पी चुकी है',
      'चाय गर्म है',
    ],
    correctIndex: 0,
    explanationHi:
      '"Likes" का मतलब पसंद होना है। Present Simple में She के साथ verb में \'s\' लगता है: "She likes tea"।',
  },
  {
    id: 'pq-5',
    category: 'listening',
    questionHi: '5. ऑडियो सुनें (Listen): स्पीकर ने कौन सा वाक्य बोला?',
    audioPromptEn: 'I live in Delhi with my family.',
    options: [
      'I live in Delhi with my family.',
      'I love Delhi very much.',
      'He lives in Mumbai with his family.',
      'I leave Delhi tomorrow.',
    ],
    correctIndex: 0,
    explanationHi: 'ऑडियो में स्पष्ट रूप से "I live in Delhi with my family." बोला गया है।',
  },
  {
    id: 'pq-6',
    category: 'grammar',
    questionHi: '6. "Yesterday, I went to the market." यह वाक्य किस समय (Tense) की बात कर रहा है?',
    options: [
      'Past Simple (बीता हुआ कल)',
      'Future Simple (आने वाला कल)',
      'Present Simple (रोज़मर्रा की आदत)',
      'Present Continuous (अभी चल रहा काम)',
    ],
    correctIndex: 0,
    explanationHi:
      '"Yesterday" (कल) और "went" (go का 2nd form) बीते हुए समय (Past Simple) को दर्शाते हैं।',
  },
  {
    id: 'pq-7',
    category: 'grammar',
    questionHi: '7. "मेरे पास एक कार है" (स्वामित्व/Ownership) के लिए मानक अंग्रेज़ी वाक्य कौन सा है?',
    options: [
      'I have a car (सही मानक प्रयोग)',
      'I am having a car (हिंदी सोच का गलत अनुवाद)',
      'Car is with me',
      'I has a car',
    ],
    correctIndex: 0,
    explanationHi:
      'स्वामित्व बताने के लिए "I have a car" सही है। "Having" का प्रयोग खाने-पीने के लिए होता है (जैसे I am having lunch), कार रखने के लिए नहीं।',
  },
  {
    id: 'pq-8',
    category: 'comprehension',
    questionHi: '8. जब कोई आपसे पूछे: "How are you?", तो सबसे स्वाभाविक उत्तर क्या है?',
    options: [
      'I am doing well, thank you! (मैं ठीक हूँ, धन्यवाद)',
      'I am reading a book',
      'How is you?',
      'Yes, I do',
    ],
    correctIndex: 0,
    explanationHi:
      '"How are you?" हालचाल पूछने का सवाल है, जिसका सबसे स्वाभाविक उत्तर "I am doing well, thank you" या "I am good" होता है।',
  },
];

export const PlacementAssessmentModal: React.FC<PlacementAssessmentModalProps> = ({
  isOpen,
  onClose,
  onCompleteAssessment,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{
    [qId: string]: { selected: number; isCorrect: boolean };
  }>({});
  const [isComplete, setIsComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_QUESTIONS[currentIndex];
  const isLast = currentIndex === PLACEMENT_QUESTIONS.length - 1;

  const handlePlayAudio = (text: string) => {
    ttsService.speak(text, { speakingSpeed: 'normal' });
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { selected: selectedOption, isCorrect },
    }));
    setIsAnswerSubmitted(true);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      let vocabCorrect = 0;
      let grammarCorrect = 0;
      let listeningCorrect = 0;

      PLACEMENT_QUESTIONS.forEach((q) => {
        const ans = userAnswers[q.id];
        const isCorr =
          ans?.isCorrect ?? (selectedOption === q.correctIndex);
        if (isCorr) {
          correctCount++;
          if (q.category === 'vocabulary') vocabCorrect++;
          else if (q.category === 'grammar') grammarCorrect++;
          else if (q.category === 'listening' || q.category === 'comprehension')
            listeningCorrect++;
        }
      });

      // Calculate demonstrated level
      let assignedLevel = DifficultyLevel.BEGINNER;
      if (correctCount >= 7) {
        assignedLevel = DifficultyLevel.INTERMEDIATE;
      } else if (correctCount >= 5) {
        assignedLevel = DifficultyLevel.INTERMEDIATE;
      } else {
        assignedLevel = DifficultyLevel.BEGINNER;
      }

      setIsComplete(true);
      onCompleteAssessment(assignedLevel, correctCount, PLACEMENT_QUESTIONS.length, {
        vocabulary: vocabCorrect,
        grammar: grammarCorrect,
        listening: listeningCorrect,
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsComplete(false);
  };

  const currentAnsState = userAnswers[currentQ.id];
  const totalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1528] border-2 border-indigo-500/70 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">
                प्रारंभिक स्तर निर्धारण परीक्षा (Placement Assessment)
              </h2>
              <p className="text-xs text-slate-400 font-hindi">
                केवल 8 त्वरित प्रश्न • वास्तविक क्षमता के आधार पर स्तर तय करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isComplete ? (
          <div className="space-y-5">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                प्रश्न {currentIndex + 1} / {PLACEMENT_QUESTIONS.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] capitalize">
                {currentQ.category} Focus
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-[#07172b] border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="font-hindi text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQ.questionHi}
              </h3>

              {/* Optional Audio prompt */}
              {currentQ.audioPromptEn && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0f2442] border border-cyan-800/60">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(currentQ.audioPromptEn!)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-transform active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 ऑडियो सुनें (Play)</span>
                  </button>
                  <span className="text-xs text-slate-300 font-mono">
                    Listen to natural English voice
                  </span>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === currentQ.correctIndex;
                  const showResult = isAnswerSubmitted;

                  let btnStyle =
                    'border-slate-700/80 bg-[#0e1d35] hover:bg-[#142642] text-slate-200';
                  if (showResult) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-500/80 bg-emerald-950/70 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      btnStyle =
                        'border-rose-500/80 bg-rose-950/70 text-rose-200 ring-1 ring-rose-500';
                    }
                  } else if (isSelected) {
                    btnStyle =
                      'border-indigo-500 bg-indigo-950/70 text-white ring-2 ring-indigo-500/60';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full min-h-[48px] p-3 rounded-xl border text-left font-hindi text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box after submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-[#091e36] border border-cyan-800/80 text-xs sm:text-sm font-hindi leading-relaxed text-cyan-200 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>व्याख्या (Explanation):</span>
                </div>
                {currentQ.explanationHi}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                सही उत्तर: {totalCorrect}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
                >
                  उत्तर जाँचें (Check Answer)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>{isLast ? 'परिणाम देखें (Finish)' : 'अगला प्रश्न (Next)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion & Level Result Screen */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-950 text-indigo-400 border border-indigo-700 mx-auto flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-hindi">
                स्तर निर्धारण पूर्ण! (Assessment Completed)
              </h3>
              <p className="text-sm text-slate-400 font-hindi">
                आपका कुल स्कोर: <strong className="text-white font-mono">{totalCorrect} / {PLACEMENT_QUESTIONS.length}</strong>
              </p>
            </div>

            {/* Assigned Level Card */}
            {(() => {
              const assigned =
                totalCorrect >= 7
                  ? DifficultyLevel.ADVANCED
                  : totalCorrect >= 5
                  ? DifficultyLevel.INTERMEDIATE
                  : DifficultyLevel.BEGINNER;
              const meta = LEARNER_LEVELS[assigned];

              return (
                <div className="p-5 rounded-2xl bg-[#071d18] border-2 border-emerald-500/80 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-mono font-bold">
                      CEFR: {meta.cefr}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      प्रमाणित स्तर
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-hindi">
                      {meta.nameHi}
                    </h4>
                    <p className="text-xs text-slate-300 font-hindi mt-1 leading-relaxed">
                      {meta.descriptionHi}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#062c21] border border-emerald-800 text-xs text-emerald-300 font-hindi">
                    💡 <strong>सिफारिश:</strong> आप 10-दिवसीय कोर्स के <strong>Day 1</strong> और Words सेक्शन के बुनियादी 654 शब्दों से शुरुआत करें।
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः परीक्षा दें (Retake)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span>सीखना शुरू करें (Continue)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
