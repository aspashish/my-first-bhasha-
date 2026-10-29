import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Check,
  CheckSquare,
  Square,
  X,
  Volume2,
  BookOpen,
  HelpCircle,
  Edit2,
  Plus,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { VocabularyWord, AppSettings } from '../types/learning';
import { isLegitimateVerb, getVerbForms } from '../utils/verbConjugationEngine';
import { ttsService } from '../services/ttsService';

interface VerbPracticeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabularyWord[];
  selectedVerbWords: VocabularyWord[];
  onApplySelectedVerbs: (verbs: VocabularyWord[]) => void;
  settings: AppSettings;
}

export const VerbPracticeSelectorModal: React.FC<VerbPracticeSelectorModalProps> = ({
  isOpen,
  onClose,
  words,
  selectedVerbWords,
  onApplySelectedVerbs,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'detected' | 'all'>('detected');
  const [manualVerbOverrides, setManualVerbOverrides] = useState<Record<string, boolean>>({});
  const [currentSelectedIds, setCurrentSelectedIds] = useState<Set<string>>(() => {
    return new Set(selectedVerbWords.map((w) => w.id));
  });
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  // Sync currentSelectedIds when selectedVerbWords change or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentSelectedIds(new Set(selectedVerbWords.map((w) => w.id)));
    }
  }, [isOpen, selectedVerbWords]);

  // Detected verbs vs manual corrections
  const isVerb = (w: VocabularyWord): boolean => {
    if (manualVerbOverrides[w.id] !== undefined) {
      return manualVerbOverrides[w.id];
    }
    return isLegitimateVerb(w);
  };

  // Filtered words list
  const displayWords = useMemo(() => {
    let list = words;
    if (filterMode === 'detected') {
      list = list.filter(isVerb);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.hindiMeaning.toLowerCase().includes(q) ||
          (w.phoneticHindi && w.phoneticHindi.toLowerCase().includes(q))
      );
    }

    return list;
  }, [words, filterMode, searchQuery, manualVerbOverrides]);

  const totalDetectedVerbs = useMemo(() => {
    return words.filter(isVerb).length;
  }, [words, manualVerbOverrides]);

  if (!isOpen) return null;

  const toggleSelectWord = (word: VocabularyWord) => {
    const next = new Set(currentSelectedIds);
    if (next.has(word.id)) {
      next.delete(word.id);
    } else {
      next.add(word.id);
    }
    setCurrentSelectedIds(next);
  };

  const handleSelectAllDetected = () => {
    const detected = words.filter(isVerb);
    setCurrentSelectedIds(new Set(detected.map((w) => w.id)));
  };

  const handleClearSelection = () => {
    setCurrentSelectedIds(new Set());
  };

  const toggleManualVerbClassification = (wordId: string, currentlyIsVerb: boolean) => {
    setManualVerbOverrides((prev) => ({
      ...prev,
      [wordId]: !currentlyIsVerb,
    }));
  };

  const handleApply = () => {
    const chosen = words.filter((w) => currentSelectedIds.has(w.id));
    onApplySelectedVerbs(chosen);
    onClose();
  };

  const handleSpeak = (text: string) => {
    ttsService.speak(text, settings).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#091526] border border-cyan-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#071322] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white font-hindi flex items-center gap-2">
                  <span>मेरे शब्दों से अभ्यास (Practice with My Words)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 border border-cyan-700/60">
                    {totalDetectedVerbs} क्रियाएं पहचानी गईं
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-hindi">
                  आपकी सहेजी गई शब्दावली ({words.length} शब्द) में से पहचानी गई क्रियाएं (Verbs)। एक या कई क्रियाएं चुनें और 5 कालों में उनका अभ्यास करें।
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= SEARCH & FILTER BAR ================= */}
        <div className="p-4 border-b border-slate-800/80 bg-[#07172b] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="क्रिया खोजें (Search by English, Hindi, or pronunciation)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#040f1d] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Filter Mode: Detected Verbs vs All 659 Words */}
            <div className="flex items-center gap-1 bg-[#040f1d] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilterMode('detected')}
                className={`px-3 py-1 rounded-lg font-bold font-hindi cursor-pointer transition-colors ${
                  filterMode === 'detected'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                पहचानी गई क्रियाएं ({totalDetectedVerbs})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-bold font-hindi cursor-pointer transition-colors ${
                  filterMode === 'all'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="यदि कोई शब्द छूट गया है तो सभी 659 शब्दों में से देखें"
              >
                सभी {words.length} शब्द देखें
              </button>
            </div>

            {/* Quick Bulk Selection Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllDetected}
                className="px-2.5 py-1 rounded-lg bg-[#0e2138] hover:bg-[#162d4a] border border-slate-700 text-[11px] font-hindi text-cyan-300 cursor-pointer"
              >
                सभी चुनें (Select All)
              </button>
              {currentSelectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2.5 py-1 rounded-lg bg-[#0e2138] hover:bg-[#162d4a] border border-slate-700 text-[11px] font-hindi text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  चयन हटाएं (Clear)
                </button>
              )}
            </div>
          </div>

          {/* Quick Selection Status Bar */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-400">
            <span>
              दिख रहे हैं: <strong className="text-white font-mono">{displayWords.length}</strong> शब्द
            </span>
            <span>
              चयनित: <strong className="text-emerald-400 font-mono">{currentSelectedIds.size}</strong> क्रियाएं
            </span>
          </div>
        </div>

        {/* ================= VERB LIST SCROLLABLE ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {displayWords.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-hindi space-y-2">
              <p>कोई शब्द नहीं मिला।</p>
              <p className="text-xs text-slate-500">
                &quot;सभी {words.length} शब्द देखें&quot; पर क्लिक करके किसी भी शब्द को क्रिया के रूप में चिह्नित कर सकते हैं।
              </p>
            </div>
          ) : (
            displayWords.map((item) => {
              const itemIsVerb = isVerb(item);
              const isSelected = currentSelectedIds.has(item.id);
              const forms = getVerbForms(item.word, item.hindiMeaning);
              const isExpanded = expandedWordId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#0b213b] border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-[#061426] hover:bg-[#0b1c31] border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Checkbox & Word Info */}
                    <div
                      onClick={() => toggleSelectWord(item)}
                      className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-cyan-400 shrink-0 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-cyan-400 font-mono font-semibold">
                            #{item.index}
                          </span>
                          <span className="font-extrabold text-white text-base font-mono">
                            {item.word}
                          </span>
                          {item.phoneticHindi && (
                            <span className="text-xs text-slate-400 font-hindi">
                              ({item.phoneticHindi})
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-hindi font-bold border ${
                              itemIsVerb
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {itemIsVerb ? 'क्रिया (Verb)' : 'अन्य (Other)'}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-amber-200/90 font-hindi">
                          {item.hindiMeaning}
                        </p>
                      </div>
                    </div>

                    {/* Right side quick actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(item.word);
                        }}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="उच्चारण सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedWordId(isExpanded ? null : item.id);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#091b2e] hover:bg-[#102740] border border-slate-700 text-xs font-mono text-cyan-300 cursor-pointer"
                        title="क्रिया के रूप देखें (V1, V2, V3, V-ing)"
                      >
                        {isExpanded ? 'रूप छुपाएं' : 'रूप देखें'}
                      </button>

                      {/* Manual correction toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleManualVerbClassification(item.id, itemIsVerb);
                        }}
                        className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-amber-300 cursor-pointer text-[10px] font-hindi"
                        title={itemIsVerb ? 'इसे क्रिया न मानें' : 'इसे क्रिया के रूप में चिह्नित करें'}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Verb Inflection Preview (V1, V2, V3, V-ing, 3rd Person) */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 bg-[#040f1c] p-3 rounded-xl space-y-2 text-xs font-mono">
                      <div className="text-[11px] font-hindi font-bold text-cyan-300">
                        क्रिया के रूप (Conjugation Forms for 5 Tenses):
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                        <div className="p-1.5 bg-[#071629] rounded border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">V1 (Base):</span>
                          <strong className="text-emerald-300">{forms.base}</strong>
                        </div>
                        <div className="p-1.5 bg-[#071629] rounded border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">V2 (Past Simple):</span>
                          <strong className="text-amber-300">{forms.past}</strong>
                        </div>
                        <div className="p-1.5 bg-[#071629] rounded border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">V3 (Past Participle):</span>
                          <strong className="text-indigo-300">{forms.pastParticiple}</strong>
                        </div>
                        <div className="p-1.5 bg-[#071629] rounded border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">V-ing (Continuous):</span>
                          <strong className="text-cyan-300">{forms.presentParticiple}</strong>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-hindi">
                        Present Simple (He/She): <strong className="text-white font-mono">{forms.thirdPerson}</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-4 border-t border-slate-800 bg-[#071322] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-hindi">
            {currentSelectedIds.size === 0 ? (
              <span className="text-amber-300">
                कृपया अभ्यास के लिए कम से कम 1 क्रिया चुनें।
              </span>
            ) : (
              <span>
                <strong className="text-emerald-400 font-mono text-sm">
                  {currentSelectedIds.size}
                </strong>{' '}
                क्रियाएं 5 Tenses अभ्यास में उपयोग के लिए तैयार हैं।
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-hindi text-xs sm:text-sm cursor-pointer"
            >
              रद्द करें (Cancel)
            </button>

            <button
              type="button"
              disabled={currentSelectedIds.size === 0}
              onClick={handleApply}
              className={`px-6 py-2.5 rounded-xl font-bold font-hindi text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentSelectedIds.size > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>अभ्यास शुरू करें (Start Practice)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
