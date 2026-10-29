import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Mic,
  MicOff,
  Play,
  RefreshCw,
  Server,
  ShieldAlert,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  AudioSystemHealth,
  DiagnosticLog,
  voiceDiagnostics,
} from '../services/voiceDiagnostics';

interface AudioDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioDiagnosticModal: React.FC<AudioDiagnosticModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'logs' | 'guide'>('tests');
  const [health, setHealth] = useState<AudioSystemHealth | null>(null);
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Filter state for logs
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  // Interactive Test States
  const [isTestingMic, setIsTestingMic] = useState<boolean>(false);
  const [micTestVolume, setMicTestVolume] = useState<number>(0);
  const [micTestAudioUrl, setMicTestAudioUrl] = useState<string | null>(null);
  const [micTestResult, setMicTestResult] = useState<string | null>(null);

  const [isTestingSpeaker, setIsTestingSpeaker] = useState<boolean>(false);
  const [speakerTestResult, setSpeakerTestResult] = useState<string | null>(null);

  const [isCheckingServer, setIsCheckingServer] = useState<boolean>(false);
  const [serverCheckResult, setServerCheckResult] = useState<{
    ok: boolean;
    details: any;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load initial health report
    loadHealth();

    // Subscribe to real-time logs
    const unsub = voiceDiagnostics.subscribe((newLogs) => {
      setLogs(newLogs);
    });

    return unsub;
  }, [isOpen]);

  const loadHealth = async () => {
    const report = await voiceDiagnostics.getSystemHealth();
    setHealth(report);
  };

  const handleTestMic = async () => {
    setIsTestingMic(true);
    setMicTestAudioUrl(null);
    setMicTestResult(null);

    const res = await voiceDiagnostics.testMicrophoneRecord(
      3000,
      (vol) => setMicTestVolume(vol)
    );

    setIsTestingMic(false);
    setMicTestVolume(0);

    if (res.success && res.audioDataUrl) {
      setMicTestAudioUrl(res.audioDataUrl);
      setMicTestResult('माइक टेस्ट सफल! नीचे ऑडियो सुनें:');
      // Update health report as permission was granted
      loadHealth();
    } else {
      setMicTestResult(`माइक टेस्ट विफल: ${res.error || 'Unknown error'}`);
    }
  };

  const handleTestSpeaker = async (useBrowserOnly: boolean = false) => {
    setIsTestingSpeaker(true);
    setSpeakerTestResult(null);

    const res = await voiceDiagnostics.testSpeakerSound(useBrowserOnly);
    setIsTestingSpeaker(false);

    if (res.success) {
      setSpeakerTestResult(`आवाज़ टेस्ट सफल! (${res.providerUsed === 'gemini-tts' ? 'Gemini AI Voice' : 'Browser Speech Synthesis'})`);
    } else {
      setSpeakerTestResult(`स्पीकर टेस्ट विफल: ${res.error || 'No sound produced'}`);
    }
  };

  const handleCheckServer = async () => {
    setIsCheckingServer(true);
    const res = await voiceDiagnostics.testServerAudioApis();
    setIsCheckingServer(false);
    setServerCheckResult({ ok: res.ttsOk || res.sttOk, details: res.details });
    loadHealth();
  };

  const handleCopyLogs = () => {
    const text = voiceDiagnostics.exportLogsAsText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    voiceDiagnostics.clearLogs();
  };

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    if (moduleFilter !== 'ALL' && l.module !== moduleFilter) return false;
    if (levelFilter === 'ERROR' && l.level !== 'error') return false;
    if (levelFilter === 'WARN' && l.level !== 'warn' && l.level !== 'error') return false;
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Audio & Speech Diagnostics
                {health?.serverTtsQuotaExceeded && (
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    Quota Fallback Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                माइक, आवाज़ (TTS) और स्पीच रिकग्निशन की लाइव स्थिति व परीक्षण
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tests'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🛠️ Health & Live Tests (परीक्षण)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            📋 Live Event Logs ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            📖 Mic Permission & Audio Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'tests' && (
            <div className="space-y-6">
              {/* Health Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Microphone Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-indigo-600" />
                      Microphone Access
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        health?.micPermission === 'granted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : health?.micPermission === 'denied'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {health?.micPermission === 'granted'
                        ? 'Granted (अनुमति चालू)'
                        : health?.micPermission === 'denied'
                        ? 'Blocked (अनुमति बंद)'
                        : 'Prompt / Ask'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {health?.micPermission === 'granted'
                      ? 'ब्राउज़र में माइक्रोफ़ोन चालू है और आवाज़ कैप्चर हो रही है।'
                      : health?.micPermission === 'denied'
                      ? 'माइक अनुमति ब्लॉक है! एड्रेस बार में लॉक आइकन दबाकर Allow करें।'
                      : 'माइक का पहला प्रयोग करते समय ब्राउज़र पूछेगा।'}
                  </p>
                </div>

                {/* Speech Synthesis Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      Device Speech Engine
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        health?.speechSynthesisSupported
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {health?.speechSynthesisSupported
                        ? `Ready (${health.availableVoicesCount} Voices)`
                        : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    ब्राउज़र सिस्टम आवाज़ें उपलब्ध हैं। Gemini TTS सीमा होने पर भी ऐप बिना रुकावट बोलता रहेगा।
                  </p>
                </div>

                {/* Web Speech API Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Live Speech-to-Text
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        health?.webSpeechRecognitionSupported
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {health?.webSpeechRecognitionSupported
                        ? 'Web Speech API Active'
                        : 'Gemini Audio Fallback'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {health?.webSpeechRecognitionSupported
                      ? 'Chrome/Edge रियल-टाइम स्पीच रिकग्निशन सक्रिय है।'
                      : 'ब्राउज़र में Web Speech उपलब्ध नहीं है; ऑडियो रिकॉर्ड करके AI STT द्वारा ट्रांसक्राइब किया जाएगा।'}
                  </p>
                </div>

                {/* Server AI Speech Quota Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-indigo-600" />
                      Gemini Natural TTS
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        health?.serverTtsQuotaExceeded
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {health?.serverTtsQuotaExceeded
                        ? `Quota Limit (${health.ttsCooldownRemainingSec}s Cooldown)`
                        : 'Active & Ready'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {health?.serverTtsQuotaExceeded
                      ? 'क्वाटा सीमा समाप्त होने पर ऐप स्वतः प्राकृतिक डिवाइस आवाज़ का उपयोग कर रहा है।'
                      : 'AI सर्वर वॉइस मोड सक्रिय है।'}
                  </p>
                </div>
              </div>

              {/* Interactive Test 1: Microphone Echo Test */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Mic className="w-4 h-4 text-indigo-600" />
                      1. Microphone Test (3-Second Echo Test)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      3 सेकंड के लिए बोलें — सिस्टम आपकी आवाज़ रिकॉर्ड करके तुरंत सुनाएगा।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestMic}
                    disabled={isTestingMic}
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors ${
                      isTestingMic
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {isTestingMic ? (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Listening ({micTestVolume}% Vol)...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Start 3s Mic Test</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Volume Wave when testing */}
                {isTestingMic && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Live Mic Volume</span>
                      <span>{micTestVolume}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-75"
                        style={{ width: `${micTestVolume}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Test Result / Playback */}
                {micTestResult && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {micTestResult}
                    </span>
                    {micTestAudioUrl && (
                      <audio controls src={micTestAudioUrl} className="h-8 max-w-[240px]" />
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Test 2: Speaker Sound Test */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      2. Speaker / Audio Playback Test
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      सुनें कि क्या आपके डिवाइस के स्पीकर से आवाज़ सही तरह से आ रही है।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestSpeaker(false)}
                      disabled={isTestingSpeaker}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Test AI/Default Voice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTestSpeaker(true)}
                      disabled={isTestingSpeaker}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Test Device Synthesis</span>
                    </button>
                  </div>
                </div>

                {speakerTestResult && (
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl">
                    {speakerTestResult}
                  </p>
                )}
              </div>

              {/* Interactive Test 3: Backend Speech API */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" />
                      3. Backend Server Audio APIs
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      /api/ai/tts, /api/ai/stt और ऑडियो कैश की स्थिति जाँचें।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckServer}
                    disabled={isCheckingServer}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingServer ? 'animate-spin' : ''}`} />
                    <span>Ping Server Diagnostics</span>
                  </button>
                </div>

                {serverCheckResult && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 overflow-x-auto">
                    <pre>{JSON.stringify(serverCheckResult.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Modules</option>
                    <option value="MIC">MIC</option>
                    <option value="STT">STT</option>
                    <option value="TTS">TTS</option>
                    <option value="AUDIO_PLAY">AUDIO_PLAY</option>
                    <option value="API">API</option>
                  </select>

                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="ERROR">Errors Only</option>
                    <option value="WARN">Warnings & Errors</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLogs}
                    className="min-h-[34px] px-3 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Logs'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="min-h-[34px] px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-flex items-center gap-1.5 cursor-pointer hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Log List */}
              <div className="space-y-1.5 font-mono text-xs max-h-[460px] overflow-y-auto pr-1">
                {filteredLogs.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">कोई लॉग उपलब्ध नहीं है।</p>
                ) : (
                  filteredLogs.map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString();
                    const badgeColor =
                      log.level === 'error'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : log.level === 'warn'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : log.level === 'success'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';

                    return (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{time}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
                              {log.module}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            {log.level}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 break-words font-sans text-xs">
                          {log.message}
                        </p>
                        {log.details && (
                          <pre className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-1.5 rounded overflow-x-auto">
                            {typeof log.details === 'string'
                              ? log.details
                              : JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  माइक्रोफ़ोन अनुमति कैसे चालू करें (How to Allow Microphone):
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-indigo-950 dark:text-indigo-200/90 pl-1">
                  <li>
                    <strong>Google Chrome / Microsoft Edge / Brave:</strong> ब्राउज़र के URL (एड्रेस बार) में बाईं तरफ दिए गए 🔒 <em>(Lock / View Site Information)</em> आइकन पर क्लिक करें। फिर <em>Microphone</em> को <strong>Allow</strong> करें और पेज को रीफ़्रेश करें।
                  </li>
                  <li>
                    <strong>Apple Safari (Mac / iPhone):</strong> Safari मेन्यू या एड्रेस बार में <strong>aA</strong> आइकन पर टैप करें &gt; <em>Website Settings</em> &gt; <em>Microphone: Allow</em> चुनें।
                  </li>
                  <li>
                    <strong>Android Mobile:</strong> ऊपरी दाएं कोने में 3 डॉट्स (⋮) &gt; <em>Settings</em> &gt; <em>Site settings</em> &gt; <em>Microphone</em> &gt; Allow।
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  यदि आवाज़ सुनाई नहीं दे रही है (Troubleshoot Audio Playback):
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>डिवाइस वॉल्यूम:</strong> अपने फ़ोन या लैपटॉप का मीडिया वॉल्यूम बढ़ाएँ। यदि आप iPhone पर हैं, तो साइड वाला साइलेंट/म्यूट स्विच चेक करें।
                  </li>
                  <li>
                    <strong>Autoplay सुरक्षा नियम:</strong> आधुनिक ब्राउज़र बिना यूज़र क्लिक के अपने आप ऑडियो बजाने से रोक सकते हैं। किसी भी वाक्य पर '🔊 Normal' या '🔊 Slow' बटन दबाने से आवाज़ तुरंत बजती है।
                  </li>
                  <li>
                    <strong>Gemini TTS Quota Cooldown:</strong> Gemini AI TTS के मुफ़्त स्तर की दैनिक सीमा समाप्त होने पर BhashaGuru स्वतः डिवाइस के उच्च-गुणवत्ता वाले Browser Speech Synthesis पर स्विच कर लेता है, ताकि आपका अभ्यास कभी न रुके।
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 text-xs text-slate-500">
          <span>BhashaGuru Voice Diagnostic v2.4</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
