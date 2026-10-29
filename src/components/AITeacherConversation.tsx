import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
  ArrowLeft,
  ChevronDown,
  Phone,
  PhoneOff,
  RotateCcw,
  Radio,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  AppSettings,
  ConversationMessage,
  LearnerMemory,
  VocabularyWord,
} from '../types/learning';
import { TutorAvatar } from './TutorAvatar';
import {
  geminiLiveService,
  LiveConnectionState,
  LiveTranscriptEvent,
  BargeInMode,
} from '../services/geminiLiveService';

interface AITeacherConversationProps {
  words: VocabularyWord[];
  settings: AppSettings;
  memory: LearnerMemory;
  initialScenarioTopic?: string;
  initialStarterPrompt?: string;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onRecordSpeakingScore: (grammarScore: number, speakingScore: number, mistakeText?: string) => void;
  onExitSession?: () => void;
}

const SCENARIO_TOPICS = [
  {
    id: 'general_coach',
    label: 'Open Fluency Coach',
    initialWords: ['introduce', 'routine', 'confident', 'experience'],
    starterHindi:
      'नमस्ते! I am your AI English Speaking Coach. You can speak naturally in English or Hindi. What would you like to practice today?',
    starterHint: 'Hello! I want to practice speaking English fluently.',
  },
  {
    id: 'friends_borrow',
    label: 'Borrowing & Helping a Friend',
    initialWords: ['borrow', 'important', 'careful', 'decide'],
    starterHindi:
      'मान लो तुम्हें अपने दोस्त से उसकी किताब उधार (borrow) मांगनी है क्योंकि कल तुम्हारा एक important टेस्ट है। English में बातचीत शुरू करो।',
    starterHint: 'Can I borrow your book for my test tomorrow?',
  },
  {
    id: 'shopping_market',
    label: 'Shopping for Clothes & Market',
    initialWords: ['discount', 'beautiful', 'decide', 'receipt'],
    starterHindi:
      'आज हम shopping के बारे में बात करेंगे। मान लो आपको एक shirt पसंद आई है और आप दुकानदार से discount पूछना चाहते हैं।',
    starterHint: 'How much is this shirt and is there any discount?',
  },
  {
    id: 'office_interview',
    label: 'Job Interview & Career',
    initialWords: ['experience', 'improve', 'confident', 'opportunity'],
    starterHindi:
      'मान लो आप एक जॉब इंटरव्यू में हैं। अपने experience और future goals के बारे में English में बताइए।',
    starterHint: 'I want to improve my skills and take on more responsibilities.',
  },
  {
    id: 'travel_discover',
    label: 'Travel & Asking Directions',
    initialWords: ['destination', 'straight', 'platform', 'opposite'],
    starterHindi:
      'मान लीजिए आप रेलवे स्टेशन पर हैं। किसी अजनबी से मेट्रो स्टेशन का रास्ता English में कैसे पूछेंगे?',
    starterHint: 'Excuse me, could you direct me to the nearest metro station?',
  },
];

const QUICK_ACTIONS = [
  { label: 'Explain in Hindi', prompt: 'Can you please explain that in simple Hindi?' },
  { label: 'Give another example', prompt: 'Could you give me another everyday example?' },
  { label: 'Speak slowly', prompt: 'Please speak a little more slowly.' },
  { label: 'Repeat that', prompt: 'Could you please repeat that sentence?' },
  { label: 'Correct my grammar', prompt: 'Did I make any grammar mistake in my last sentence?' },
  { label: 'Next question', prompt: 'Let us continue, please ask me the next question.' },
];

/**
 * Formats conversational text so each sentence or distinct dialogue statement
 * appears cleanly on a new line, preventing wall-of-text paragraphs.
 */
function formatDialogueLines(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  const rawLines = trimmed.split(/\r?\n/);
  const resultLines: string[] = [];

  for (const rawLine of rawLines) {
    const clean = rawLine.trim();
    if (!clean) continue;

    // Split on sentence terminals (. ! ? । :) when followed by space or capitalized/Hindi character
    const sentenceParts = clean
      .replace(/([.?!।]+)\s+(?=[A-Z0-9\u0900-\u097F"'])/g, '$1\n')
      .split('\n');

    for (const part of sentenceParts) {
      const s = part.trim();
      if (s) {
        resultLines.push(s);
      }
    }
  }

  return resultLines.join('\n');
}

export const AITeacherConversation: React.FC<AITeacherConversationProps> = ({
  words: _words,
  settings,
  memory: _memory,
  initialScenarioTopic,
  initialStarterPrompt,
  onUpdateSettings,
  onRecordSpeakingScore,
  onExitSession,
}) => {
  const [selectedScenario, setSelectedScenario] = useState(() => {
    if (initialScenarioTopic) {
      const found = SCENARIO_TOPICS.find(
        (s) =>
          s.label.toLowerCase().includes(initialScenarioTopic.toLowerCase()) ||
          s.id.toLowerCase().includes(initialScenarioTopic.toLowerCase())
      );
      if (found) return found;
    }
    return SCENARIO_TOPICS[0];
  });

  // Call & Connection State
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [callError, setCallError] = useState<string>('');

  // Conversation Transcripts
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [captionRole, setCaptionRole] = useState<'teacher' | 'learner'>('teacher');
  const [inputText, setInputText] = useState<string>('');

  // Modals & Overlays
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(false);
  const [bargeInMode, setBargeInMode] = useState<BargeInMode>('shielded');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Active dialogue turn trackers: guarantees each conversational turn is an independent bubble & new line
  const activeTurnIdRef = useRef<string | null>(null);
  const activeTurnRoleRef = useRef<'teacher' | 'learner' | null>(null);
  const currentTurnRawTextRef = useRef<string>('');

  const endCurrentTurn = () => {
    activeTurnIdRef.current = null;
    activeTurnRoleRef.current = null;
    currentTurnRawTextRef.current = '';
  };

  const handleCycleNoiseShield = () => {
    const nextMode: BargeInMode =
      bargeInMode === 'shielded'
        ? 'tap-only'
        : bargeInMode === 'tap-only'
        ? 'sensitive'
        : 'shielded';
    setBargeInMode(nextMode);
    geminiLiveService.setBargeInMode(nextMode);
  };

  // Wire up Gemini Live Service Callbacks
  useEffect(() => {
    geminiLiveService.subscribe({
      onStateChange: (state) => {
        setConnectionState(state);
        if (state === 'error' || state === 'disconnected') {
          setIsCallActive(false);
          endCurrentTurn();
        }
      },
      onVolumeChange: (vol) => {
        setMicVolume(vol);
      },
      onTranscript: (event: LiveTranscriptEvent) => {
        handleIncomingTranscript(event);
      },
      onTurnComplete: () => {
        // AI coach or speech turn finished: close active turn so next utterance starts a new turn/line
        endCurrentTurn();
      },
      onError: (errMsg) => {
        setCallError(errMsg);
      },
    });

    return () => {
      // Clean up call on unmount
      geminiLiveService.endCall();
      endCurrentTurn();
    };
  }, []);

  // Scroll chat transcript to bottom when messages update
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  /**
   * Process real-time transcription events from Gemini Live.
   * Every speech exchange starts a brand new bubble/line in the transcript.
   * Inside each bubble, distinct sentences are formatted on individual lines.
   */
  const handleIncomingTranscript = (event: LiveTranscriptEvent) => {
    const { role, text, isFinal } = event;
    const cleanChunk = (text || '').trim();
    if (!cleanChunk) return;

    // If role changed or no active turn exists, initiate a brand new conversation message
    const isNewTurn = activeTurnRoleRef.current !== role || !activeTurnIdRef.current;

    if (isNewTurn) {
      activeTurnRoleRef.current = role;
      currentTurnRawTextRef.current = cleanChunk;
      const newTurnId = 'msg-' + role + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      activeTurnIdRef.current = newTurnId;

      const formatted = formatDialogueLines(currentTurnRawTextRef.current);
      setCurrentCaption(formatted);
      setCaptionRole(role);

      const newMsg: ConversationMessage = {
        id: newTurnId,
        role,
        content: formatted,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMsg]);
    } else {
      // Smart transcript piece merging:
      // If incoming chunk already starts with current text or is a revised version, update it
      const current = currentTurnRawTextRef.current;
      if (cleanChunk.startsWith(current) || cleanChunk.length > current.length * 1.5) {
        currentTurnRawTextRef.current = cleanChunk;
      } else if (current.includes(cleanChunk)) {
        // already contained
      } else {
        currentTurnRawTextRef.current = (current + ' ' + cleanChunk).trim();
      }

      const formatted = formatDialogueLines(currentTurnRawTextRef.current);
      setCurrentCaption(formatted);
      setCaptionRole(role);

      const targetId = activeTurnIdRef.current;
      setMessages((prev) =>
        prev.map((m) => (m.id === targetId ? { ...m, content: formatted } : m))
      );
    }

    // When turn completes (final chunk flag), record fluency and close turn
    if (isFinal) {
      if (role === 'learner') {
        onRecordSpeakingScore(88, 85);
      }
      endCurrentTurn();
    }
  };

  /**
   * Start Live Voice Call with Gemini 3.8 Live API
   */
  const handleStartCall = async () => {
    setCallError('');
    setIsCallActive(true);
    endCurrentTurn();
    setCurrentCaption('Connecting to AI Coach...');
    setCaptionRole('teacher');

    const started = await geminiLiveService.startCall({
      topic: selectedScenario.id,
      scenarioLabel: selectedScenario.label,
      starterPrompt: initialStarterPrompt || selectedScenario.starterHindi,
      difficulty: settings.difficulty,
    });

    if (!started) {
      setIsCallActive(false);
      endCurrentTurn();
    }
  };

  /**
   * Cleanly terminate call
   */
  const handleEndCall = () => {
    geminiLiveService.endCall();
    setIsCallActive(false);
    setConnectionState('idle');
    setMicVolume(0);
    setCurrentCaption('');
    endCurrentTurn();
  };

  /**
   * Toggle microphone mute state
   */
  const handleToggleMute = () => {
    const nextMuted = geminiLiveService.toggleMute();
    setIsMuted(nextMuted);
  };

  /**
   * Interruption action: barge-in
   */
  const handleInterrupt = () => {
    geminiLiveService.interrupt();
    setCurrentCaption('(Interrupted)');
    endCurrentTurn();
  };

  /**
   * Send text message via overlay panel
   */
  const handleSendTextMessage = (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean) return;

    endCurrentTurn();

    const formatted = formatDialogueLines(clean);
    const userMsg: ConversationMessage = {
      id: `msg-learner-${Date.now()}`,
      role: 'learner',
      content: formatted,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentCaption(formatted);
    setCaptionRole('learner');
    setInputText('');

    if (isCallActive) {
      geminiLiveService.sendTextMessage(clean);
    } else {
      // If call wasn't started, start it with this prompt
      handleStartCall();
      setTimeout(() => {
        geminiLiveService.sendTextMessage(clean);
      }, 1000);
    }
  };

  const isSpeaking = connectionState === 'speaking';
  const isListening = connectionState === 'listening';
  const isConnecting = connectionState === 'connecting';
  const isInterrupted = connectionState === 'interrupted';

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0503] text-white flex flex-col justify-between overflow-hidden select-none w-full max-w-full h-[100dvh]">
      {/* ================= TOP BAR ================= */}
      <header className="relative z-20 shrink-0 h-14 px-3 sm:px-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/10">
        {/* Left: Exit Session */}
        <button
          type="button"
          onClick={() => {
            handleEndCall();
            if (onExitSession) onExitSession();
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
          title="Exit Session"
          aria-label="Exit Session"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center: Scenario Topic Selector & Live Badge */}
        <div className="flex flex-col items-center max-w-[55%]">
          <button
            type="button"
            onClick={() => setIsTopicModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-amber-300 border border-amber-300/30 truncate cursor-pointer active:scale-95 transition-all"
          >
            <span className="truncate max-w-[130px] sm:max-w-[200px]">
              {selectedScenario.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
          </button>

          {/* Real-time Connection State Pill */}
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
            {isConnecting && (
              <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                Connecting Live...
              </span>
            )}
            {isSpeaking && (
              <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
                Coach Speaking...
              </span>
            )}
            {isListening && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {isMuted ? 'Muted' : 'Listening (Speak freely)...'}
              </span>
            )}
            {isInterrupted && (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Interrupted
              </span>
            )}
            {!isCallActive && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Gemini 3.8 Live Ready
              </span>
            )}
          </div>
        </div>

        {/* Right: Noise Shield & Audio Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCycleNoiseShield}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              bargeInMode === 'shielded'
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                : bargeInMode === 'tap-only'
                ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
            }`}
            title={
              bargeInMode === 'shielded'
                ? 'शोर व बाहरी आवाज़ सुरक्षा सक्रिय (Noise Shield Active: बाहरी आवाज़ें फ़िल्टर होंगी)'
                : bargeInMode === 'tap-only'
                ? 'पूर्ण भाषण मोड (Full Speech Mode: AI बिना रुके पूरा बोलेगा, केवल बटन से रोकें)'
                : 'संवेदनशील इंटरप्ट मोड (Sensitive Mode)'
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline text-[11px]">
              {bargeInMode === 'shielded'
                ? 'Noise Shield'
                : bargeInMode === 'tap-only'
                ? 'Full Speech'
                : 'Sensitive'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ autoPlayTeacherVoice: !settings.autoPlayTeacherVoice })}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
              settings.autoPlayTeacherVoice
                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/30'
                : 'bg-white/10 text-slate-400 hover:text-white'
            }`}
            title={settings.autoPlayTeacherVoice ? 'Audio Enabled' : 'Audio Disabled'}
            aria-label="Toggle Audio"
          >
            {settings.autoPlayTeacherVoice ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ================= HERO CENTER STAGE: LARGE FULL-SCREEN AI TUTOR ================= */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 w-full max-w-full overflow-hidden min-h-0">
        {/* Tutor Stage Atmospheric Backdrop Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            isSpeaking
              ? 'opacity-40 bg-radial from-amber-600/40 via-amber-950/20 to-transparent'
              : isListening
              ? 'opacity-35 bg-radial from-emerald-600/30 via-slate-950/30 to-transparent'
              : isConnecting
              ? 'opacity-30 bg-radial from-cyan-600/30 via-indigo-950/20 to-transparent'
              : 'opacity-20 bg-radial from-amber-900/30 to-transparent'
          }`}
        />

        {/* Large Centered Tutor Portrait Container in Video-Call Mode */}
        <div className="relative flex flex-col items-center justify-center w-full my-auto px-2">
          <TutorAvatar
            isSpeaking={isSpeaking}
            isListening={isListening}
            isThinking={false}
            isConnecting={isConnecting}
            isInterrupted={isInterrupted}
            isMuted={isMuted}
            micVolume={micVolume}
            variant="video-call"
            size="video"
            isCallActive={isCallActive}
            onStartCall={handleStartCall}
            onInterrupt={handleInterrupt}
            teacherName="BhashaGuru AI Coach"
          />
        </div>

          {/* Dynamic Floating Subtitle & Transcript Pill beneath Tutor */}
          <div className="w-full max-w-md mx-auto mt-3 px-2">
            {/* If call is active, show live captions / transcription */}
            {isCallActive && currentCaption && (
              <div className="rounded-2xl bg-black/85 border border-white/20 backdrop-blur-md p-3.5 shadow-2xl text-left transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold tracking-wide ${
                        captionRole === 'teacher' ? 'text-amber-300' : 'text-emerald-300'
                      }`}
                    >
                      {captionRole === 'teacher' ? 'BhashaGuru AI Coach' : 'You (Learner)'}
                    </span>
                    <span className="text-[10px] text-slate-400">· Live Turn</span>
                  </div>
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={handleInterrupt}
                      className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[10px] font-bold text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                    >
                      Tap to Interrupt
                    </button>
                  )}
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-h-24 overflow-y-auto">
                  {currentCaption.split('\n').filter(Boolean).map((line, idx) => (
                    <p key={idx} className="leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* If listening and not muted, show animated audio levels */}
            {isCallActive && isListening && !isMuted && (
              <div className="mt-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1 h-4">
                  {[0.4, 0.9, 1.4, 0.7, 1.2, 0.5, 1.0].map((multiplier, i) => {
                    const height = Math.max(
                      4,
                      Math.min(18, Math.round(micVolume * multiplier * 40))
                    );
                    return (
                      <div
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
                <span className="text-[11px] font-medium text-emerald-200">
                  Continuous Voice Activity Detection active · Speak anytime
                </span>
              </div>
            )}

            {/* Error Banner with Retry */}
            {callError && (
              <div className="mt-2 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between gap-2">
                <span className="truncate">{callError}</span>
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px] shrink-0 hover:bg-rose-400 cursor-pointer"
                >
                  Retry Call
                </button>
              </div>
            )}
          </div>
      </main>

      {/* ================= ESSENTIAL CALL CONTROLS DOCK ================= */}
      <footer className="relative z-20 shrink-0 w-full max-w-md mx-auto px-4 pb-4 pt-2 flex items-center justify-between sm:justify-around bg-gradient-to-t from-black via-black/80 to-transparent">
        {/* 1. Chat Overlay Button (Opens Transcript & Text-Input Panel) */}
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="relative min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center border border-white/15 shadow-md transition-all cursor-pointer"
          title="Open Conversation Transcript & Chat"
          aria-label="Open Chat Transcript"
        >
          <MessageSquare className="w-5 h-5 text-indigo-300" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-xs">
              {messages.length}
            </span>
          )}
        </button>

        {/* 2. Mute / Unmute Microphone Toggle */}
        <button
          type="button"
          onClick={handleToggleMute}
          disabled={!isCallActive}
          className={`min-h-[48px] min-w-[48px] w-12 h-12 rounded-full flex items-center justify-center border shadow-md active:scale-90 transition-all cursor-pointer ${
            !isCallActive
              ? 'opacity-40 bg-white/10 border-white/10 text-slate-500'
              : isMuted
              ? 'bg-rose-600/30 border-rose-500 text-rose-400'
              : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          aria-label={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* 3. HERO CENTRAL CALL ACTION BUTTON */}
        {!isCallActive ? (
          <button
            type="button"
            onClick={handleStartCall}
            className="min-h-[64px] min-w-[64px] w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 ring-4 ring-emerald-400/40 shadow-emerald-950/60"
            title="Start Live Call"
            aria-label="Start Live Call"
          >
            <Phone className="w-7 h-7 fill-current" />
          </button>
        ) : isSpeaking ? (
          <button
            type="button"
            onClick={handleInterrupt}
            className="min-h-[64px] min-w-[64px] w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 ring-4 ring-amber-400/40 shadow-amber-950/60 animate-pulse"
            title="Tap to Interrupt Coach"
            aria-label="Interrupt Coach"
          >
            <Radio className="w-7 h-7" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleMute}
            className={`min-h-[64px] min-w-[64px] w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/40'
                : 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/40'
            }`}
            title={isMuted ? 'Mic Muted - Tap to Unmute' : 'Continuous VAD Listening'}
            aria-label="Mic Status"
          >
            {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
        )}

        {/* 4. Quick Suggestion / Repeat Turn */}
        <button
          type="button"
          onClick={() => {
            if (isCallActive) {
              geminiLiveService.sendTextMessage('Could you please repeat that sentence?');
            }
          }}
          disabled={!isCallActive}
          className={`min-h-[48px] min-w-[48px] w-12 h-12 rounded-full flex items-center justify-center border shadow-md active:scale-90 transition-all cursor-pointer ${
            !isCallActive
              ? 'opacity-40 bg-white/10 border-white/10 text-slate-500'
              : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
          }`}
          title="Ask Coach to Repeat"
          aria-label="Repeat Audio"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* 5. End Call Button */}
        {isCallActive ? (
          <button
            type="button"
            onClick={handleEndCall}
            className="min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center border border-rose-400/40 shadow-xl cursor-pointer"
            title="End Live Call"
            aria-label="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onExitSession) onExitSession();
            }}
            className="min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-slate-300 flex items-center justify-center border border-white/15 shadow-md cursor-pointer"
            title="Exit Session"
            aria-label="Exit Session"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        )}
      </footer>

      {/* ================= OVERLAY TRANSCRIPT & TEXT-INPUT PANEL ================= */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsChatOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Bottom Sheet Modal */}
          <div className="relative z-10 w-full max-w-lg mx-auto h-[82vh] max-h-[82vh] bg-slate-900 text-white rounded-t-3xl border-t border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="shrink-0 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isCallActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white">
                    Conversation Transcript
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {messages.length} messages · {isCallActive ? 'Live Voice Active' : 'Call Idle'}
                  </p>
                </div>
              </div>

              {/* Close Panel Button -> returns directly to full-screen tutor */}
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close transcript & return to tutor"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Transcript Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                  <MessageSquare className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-sm font-medium">No messages yet in this session.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tap &ldquo;Start Call&rdquo; or send a message below to begin speaking.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isTeacher = msg.role === 'teacher';
                  const lines = msg.content.split('\n').filter(Boolean);
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isTeacher ? 'items-start' : 'items-end'} mb-3`}
                    >
                      <div className="flex items-center gap-2 text-[11px] mb-1 px-1">
                        <span className={`font-semibold ${isTeacher ? 'text-amber-300' : 'text-indigo-300'}`}>
                          {isTeacher ? 'AI Coach (BhashaGuru)' : 'You (Learner)'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-md ${
                          isTeacher
                            ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-slate-950/40'
                            : 'bg-indigo-600 text-white shadow-indigo-950/40'
                        }`}
                      >
                        {isTeacher && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mb-2 pb-1.5 border-b border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>BhashaGuru Spoken Dialogue</span>
                          </div>
                        )}

                        {/* Each conversation statement on its own clean line */}
                        <div className="space-y-1.5">
                          {lines.map((line, idx) => (
                            <p key={idx} className="leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {isConnecting && (
                <div className="flex items-center gap-2 text-xs text-cyan-300 p-2">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Connecting to Gemini Live API...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggested Response Chips */}
            <div className="shrink-0 px-3 py-2 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendTextMessage(action.prompt)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700/80 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Text Input & Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTextMessage(inputText);
              }}
              className="shrink-0 p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type in English or Hindi..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center transition-all cursor-pointer"
                title="Send Message"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOPIC CHANGER MODAL ================= */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsTopicModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-white">Select Practice Topic</h3>
              <button
                type="button"
                onClick={() => setIsTopicModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {SCENARIO_TOPICS.map((topic) => {
                const isSelected = topic.id === selectedScenario.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenario(topic);
                      setIsTopicModalOpen(false);
                      if (isCallActive) {
                        handleEndCall();
                      }
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{topic.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{topic.starterHindi}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
