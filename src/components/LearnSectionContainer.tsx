import React, { useState } from 'react';
import {
  Layers,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { AppSettings, VocabularyWord } from '../types/learning';
import { SentenceBuilder } from './SentenceBuilder';
import { ListeningShadowingStudio } from './ListeningShadowingStudio';
import { ttsService } from '../services/ttsService';

interface LearnSectionContainerProps {
  words: VocabularyWord[];
  settings: AppSettings;
  onSentenceCreated?: (sentenceEn: string, isCorrect: boolean) => void;
  onListeningCompleted?: (passageId: string, score: number) => void;
}

export type LearnSubTab = 'sentence_builder' | 'listening_shadowing' | 'transfer_errors';

interface TransferErrorItem {
  id: string;
  wrong: string;
  right: string;
  ruleHi: string;
  contextHi: string;
}

const COMMON_TRANSFER_ERRORS: TransferErrorItem[] = [
  {
    id: 'err-1',
    wrong: 'I am having a car.',
    right: 'I have a car.',
    ruleHi:
      'जब आप किसी वस्तु के मालिक होने (स्वामित्व/Ownership) की बात करते हैं, तो "have" का प्रयोग होता है, "having" का नहीं। "Having" का प्रयोग खाने-पीने के लिए होता है (जैसे: I am having lunch)।',
    contextHi: 'गाड़ी, घर या सामान का अधिकार बताना',
  },
  {
    id: 'err-2',
    wrong: 'We discussed about the problem.',
    right: 'We discussed the problem.',
    ruleHi:
      'हिंदी में हम कहते हैं "के बारे में चर्चा की", लेकिन मानक अंग्रेज़ी में "discuss" क्रिया के बाद "about" नहीं लगाया जाता। सीधे "discussed the problem" कहा जाता है।',
    contextHi: 'चर्चा या बातचीत के संदर्भ में',
  },
  {
    id: 'err-3',
    wrong: 'He go to office every day.',
    right: 'He goes to office every day.',
    ruleHi:
      'Subject-Verb Agreement: जब कर्ता He, She, It या कोई एकवचन नाम हो, तो Present Simple में क्रिया (Verb) में s/es लगाना अनिवार्य है (He goes, She works)।',
    contextHi: 'एकवचन कर्ता के साथ क्रिया का नियम',
  },
  {
    id: 'err-4',
    wrong: 'I will return back tomorrow.',
    right: 'I will return tomorrow.',
    ruleHi:
      '"Return" का अर्थ ही "वापस आना" होता है, इसलिए इसके साथ "back" लगाना अनावश्यक दोहराव (Redundancy) है।',
    contextHi: 'वापस आने की सूचना देना',
  },
  {
    id: 'err-5',
    wrong: 'Please listen me carefully.',
    right: 'Please listen to me carefully.',
    ruleHi:
      'जब "listen" के बाद कोई व्यक्ति या वस्तु आती है, तो Preposition "to" लगाना अनिवार्य है ("listen to me", "listen to music")।',
    contextHi: 'ध्यान से सुनने का अनुरोध',
  },
  {
    id: 'err-6',
    wrong: 'She is married with a doctor.',
    right: 'She is married to a doctor.',
    ruleHi:
      'विवाह के संबंध में अंग्रेज़ी में "married to" का प्रयोग होता है, "married with" का नहीं।',
    contextHi: 'विवाहिक संबंध बताना',
  },
];

export const LearnSectionContainer: React.FC<LearnSectionContainerProps> = ({
  words,
  settings,
  onSentenceCreated,
  onListeningCompleted,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<LearnSubTab>('sentence_builder');

  const handlePlayAudio = (text: string) => {
    ttsService.speak(text, { speakingSpeed: 'normal' });
  };

  return (
    <div className="space-y-6">
      {/* Top Segmented Navigation Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#0b1528] border border-slate-800 p-2.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('sentence_builder')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sentence_builder'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sentence Builder (वाक्य निर्माण)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('listening_shadowing')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'listening_shadowing'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Listening & Shadowing (सुनें व दोहराएं)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('transfer_errors')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'transfer_errors'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hindi Transfer Errors (आम गलतियाँ व सुधार)</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Practice Studio</span>
        </div>
      </div>

      {/* Tab 1: Sentence Builder */}
      {activeSubTab === 'sentence_builder' && (
        <SentenceBuilder
          words={words}
          settings={settings}
          onSentenceCreated={onSentenceCreated}
        />
      )}

      {/* Tab 2: Listening & Shadowing */}
      {activeSubTab === 'listening_shadowing' && (
        <ListeningShadowingStudio
          words={words}
          settings={settings}
          onSessionCompleted={onListeningCompleted}
        />
      )}

      {/* Tab 3: Common Hindi Transfer Errors */}
      {activeSubTab === 'transfer_errors' && (
        <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="p-4 rounded-2xl bg-[#071d18] border border-emerald-600/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>हिंदी सोच का सीधा अनुवाद और मानक अंग्रेज़ी:</span>
            </div>
            <p className="text-xs text-emerald-200/90 font-hindi leading-relaxed">
              हिंदी बोलते समय हमारे दिमाग में जो वाक्य बनते हैं, उन्हें शब्द-दर-शब्द अंग्रेज़ी में बदलने पर अक्सर सामान्य त्रुटियाँ होती हैं। नीचे दिए गए 6 सबसे सामान्य नियमों को समझें और सही मानक अंग्रेज़ी बोलें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_TRANSFER_ERRORS.map((item) => (
              <div
                key={item.id}
                className="bg-[#07172b] border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-hindi">
                    संदर्भ: {item.contextHi}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item.right)}
                    className="px-2 py-1 rounded-lg bg-[#0e223d] text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="सही वाक्य सुनें"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें</span>
                  </button>
                </div>

                {/* Comparison */}
                <div className="space-y-2 text-xs sm:text-sm">
                  {/* Wrong */}
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-900 text-rose-300 text-[10px] font-bold shrink-0">
                      अशुद्ध
                    </span>
                    <span className="text-rose-200 line-through">
                      &ldquo;{item.wrong}&rdquo;
                    </span>
                  </div>

                  {/* Right */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 text-[10px] font-bold shrink-0">
                      सही मानक
                    </span>
                    <strong className="text-emerald-200">
                      &ldquo;{item.right}&rdquo;
                    </strong>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 font-hindi leading-relaxed bg-[#0a1b30] p-3 rounded-xl border border-slate-800">
                  💡 {item.ruleHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
