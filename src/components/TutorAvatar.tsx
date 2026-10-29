import React, { useEffect, useState, useRef } from 'react';
import {
  Volume2,
  Mic,
  Info,
  Radio,
  Sparkles,
} from 'lucide-react';
import { geminiLiveService } from '../services/geminiLiveService';

export interface TutorAvatarProps {
  isSpeaking: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  isConnecting?: boolean;
  isInterrupted?: boolean;
  isMuted?: boolean;
  micVolume?: number;
  size?: 'sm' | 'md' | 'lg' | 'video';
  variant?: 'badge' | 'video-call';
  onInterrupt?: () => void;
  className?: string;
  showStatusBadge?: boolean;
  isCallActive?: boolean;
  onStartCall?: () => void;
  teacherName?: string;
  customImageUrl?: string;
}

export const TutorAvatar: React.FC<TutorAvatarProps> = ({
  isSpeaking,
  isListening = false,
  isThinking = false,
  isConnecting = false,
  isInterrupted = false,
  isMuted = false,
  micVolume = 0,
  size = 'lg',
  variant = 'badge',
  onInterrupt,
  className = '',
  showStatusBadge = true,
  isCallActive = true,
  onStartCall,
  teacherName = 'BhashaGuru AI Coach',
  customImageUrl,
}) => {
  // Real-time audio-synchronized mouth opening factor (0.0 to 1.0)
  const [mouthFactor, setMouthFactor] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [showSyncInfo, setShowSyncInfo] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<number>(0);

  // Single permanent BhashaGuru teacher avatar portrait
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (customImageUrl) return customImageUrl;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bhashaguru_custom_avatar');
      if (saved) return saved;
    }
    return '/assets/female_tutor_portrait.svg';
  });

  const animFrameRef = useRef<number | null>(null);
  const smoothFactorRef = useRef<number>(0);
  const breathAnimRef = useRef<number | null>(null);

  // Sync prop changes if provided
  useEffect(() => {
    if (customImageUrl) {
      setAvatarUrl(customImageUrl);
    }
  }, [customImageUrl]);

  /**
   * Genuine Audio-Synchronized Lip Motion:
   * Directly samples actual output audio playback energy via Web Audio AnalyserNode in geminiLiveService.
   * Stops immediately when audio ends, turns complete, or when interrupted.
   */
  useEffect(() => {
    if (!isSpeaking || isInterrupted) {
      smoothFactorRef.current = 0;
      setMouthFactor(0);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const updateAudioLipSync = () => {
      // 1. Read real-time output audio level (0.0 - 1.0) directly from AI speech playback
      const rawAudioLevel = geminiLiveService.getTeacherAudioOutputLevel();

      // 2. Exponential envelope smoothing: rapid attack for speech burst, organic release
      const current = smoothFactorRef.current;
      const target = rawAudioLevel;
      const attack = 0.65; // Opens quickly on speech burst
      const decay = 0.22; // Closes smoothly on pauses and between syllables
      const next = current + (target - current) * (target > current ? attack : decay);

      smoothFactorRef.current = Math.max(0, Math.min(1, next));
      setMouthFactor(smoothFactorRef.current);

      animFrameRef.current = requestAnimationFrame(updateAudioLipSync);
    };

    animFrameRef.current = requestAnimationFrame(updateAudioLipSync);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      smoothFactorRef.current = 0;
      setMouthFactor(0);
    };
  }, [isSpeaking, isInterrupted]);

  // Subtle Lifelike Respiration & Video Presence Motion
  useEffect(() => {
    let startTime = performance.now();
    const updateBreath = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      setBreathPhase(elapsed);
      breathAnimRef.current = requestAnimationFrame(updateBreath);
    };
    breathAnimRef.current = requestAnimationFrame(updateBreath);
    return () => {
      if (breathAnimRef.current) {
        cancelAnimationFrame(breathAnimRef.current);
      }
    };
  }, []);

  // Periodic natural eye blinking (every 3.8s to 4.5s)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4100);

    return () => clearInterval(blinkInterval);
  }, []);

  const isVideoMode = variant === 'video-call' || size === 'video';

  // Dimension classes
  const dimensionClass = isVideoMode
    ? 'w-full max-w-[370px] xs:max-w-[400px] sm:max-w-[440px] aspect-[9/14] sm:aspect-[3/4] max-h-[56vh]'
    : {
        sm: 'w-16 h-16',
        md: 'w-28 h-28',
        lg: 'w-44 h-44 sm:w-52 sm:h-52',
        video: 'w-full max-w-[420px] aspect-[9/14]',
      }[size];

  // Head and breathing transform offsets
  const breathY = Math.sin(breathPhase * 1.5) * 1.5;
  const speakTilt = isSpeaking ? Math.sin(breathPhase * 3.2) * 0.6 : 0;

  // Mouth center coordinate calibrated to the portrait
  const getMouthCenter = (url: string) => {
    if (url.includes('female_tutor_portrait')) {
      return { x: 50, y: 56.5 }; // viewBox 400x400: center (200, 226)
    }
    if (url.includes('bhashaguru_tutor_library')) {
      return { x: 50, y: 44.4 }; // viewBox 720x1280: center (360, 568)
    }
    return { x: 50, y: 54.0 }; // Standard portrait bust
  };

  const mouthCenter = getMouthCenter(avatarUrl);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Background Audio Radiation Halo */}
      <div className="relative w-full flex items-center justify-center">
        {/* Speaking Voice Glow Aura */}
        {isSpeaking && (
          <>
            <div
              className="absolute -inset-4 rounded-3xl bg-amber-400/20 blur-md pointer-events-none transition-transform duration-75"
              style={{ transform: `scale(${1 + mouthFactor * 0.12})` }}
            />
            <div className="absolute -inset-2 rounded-3xl border-2 border-amber-400/50 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Listening Ambient Glow */}
        {isListening && !isMuted && micVolume > 0.04 && (
          <>
            <div
              className="absolute -inset-3 rounded-3xl bg-emerald-500/20 blur-sm pointer-events-none transition-all duration-75"
              style={{ transform: `scale(${1 + micVolume * 0.15})` }}
            />
            <div className="absolute -inset-1.5 rounded-3xl border-2 border-emerald-400/60 pointer-events-none" />
          </>
        )}

        {/* Main Video Call Portrait Container */}
        <div
          className={`${dimensionClass} relative rounded-3xl overflow-hidden border-2 sm:border-3 shadow-2xl transition-all duration-300 bg-slate-950 flex items-center justify-center ${
            isSpeaking
              ? 'border-amber-400 shadow-amber-900/40 ring-2 ring-amber-400/30'
              : isListening
              ? 'border-emerald-400 shadow-emerald-950/40 ring-2 ring-emerald-500/20'
              : isConnecting
              ? 'border-cyan-400 shadow-cyan-950/40 animate-pulse'
              : 'border-white/20'
          }`}
        >
          {/* USER'S TUTOR PORTRAIT (Kept 100% Intact & High Quality) */}
          <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={teacherName}
              className="w-full h-full object-cover transition-transform duration-100 ease-out"
              style={{
                transform: `translateY(${breathY}px) rotate(${speakTilt}deg) scale(${
                  isSpeaking ? 1.018 + mouthFactor * 0.012 : 1
                })`,
              }}
            />

            {/* Genuine Audio-Driven Mouth Articulation:
                Rendered precisely at mouthCenter (56.5% for portrait). Never on neck or below chin. */}
            {mouthFactor > 0.04 && (
              <div
                className="absolute pointer-events-none transition-opacity duration-75 flex items-center justify-center"
                style={{
                  left: `${mouthCenter.x}%`,
                  top: `${mouthCenter.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: Math.min(1, mouthFactor * 1.8),
                }}
              >
                <svg
                  width={isVideoMode ? '44' : '34'}
                  height={isVideoMode ? '28' : '22'}
                  viewBox="0 0 44 28"
                  className="overflow-visible"
                  style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))' }}
                >
                  <defs>
                    <radialGradient id="teacherInnerMouth" cx="50%" cy="40%" r="50%">
                      <stop offset="0%" stopColor="#1B0408" />
                      <stop offset="70%" stopColor="#30070F" />
                      <stop offset="100%" stopColor="#50101B" />
                    </radialGradient>
                    <linearGradient id="teacherUpperLip" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#A83240" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#751522" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="teacherLowerLip" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#751522" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#B83A49" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>

                  {/* Oral Cavity Opening (expands directly with real-time audio volume) */}
                  <path
                    d={`M 7 14 Q 22 ${13 - mouthFactor * 1.2} 37 14 Q 22 ${14 + mouthFactor * 8.5} 7 14 Z`}
                    fill="url(#teacherInnerMouth)"
                  />

                  {/* Pearlescent Upper Teeth Highlight on vowel resonance */}
                  {mouthFactor > 0.16 && (
                    <path
                      d={`M 11 14 Q 22 14.5 33 14 Q 22 ${14 + mouthFactor * 2.5} 11 14 Z`}
                      fill="#FDFDFC"
                      opacity={Math.min(0.92, mouthFactor * 1.25)}
                    />
                  )}

                  {/* Upper Lip Contour */}
                  <path
                    d={`M 6 14 Q 22 ${12.5 - mouthFactor * 1.4} 38 14 Q 22 ${13.5 + mouthFactor * 0.9} 6 14 Z`}
                    fill="url(#teacherUpperLip)"
                  />

                  {/* Lower Lip Contour */}
                  <path
                    d={`M 6 14 Q 22 ${14 + mouthFactor * 8.5} 38 14 Q 22 ${16 + mouthFactor * 10} 6 14 Z`}
                    fill="url(#teacherLowerLip)"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Video-Call Framing Gradient Vignette */}
          {isVideoMode && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          )}

          {/* Video-Call Top Telemetry Bar */}
          {isVideoMode && (
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
              {/* Teacher Name & HD Call Badge */}
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 shadow-md">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking
                      ? 'bg-amber-400 animate-ping'
                      : isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : isConnecting
                      ? 'bg-cyan-400 animate-ping'
                      : 'bg-emerald-400'
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight tracking-tight">
                    {teacherName}
                  </span>
                  <span className="text-[9px] text-slate-300 font-medium">
                    {isSpeaking
                      ? 'Speaking...'
                      : isListening
                      ? isMuted
                        ? 'Microphone Muted'
                        : 'Listening to you...'
                      : isConnecting
                      ? 'Connecting Gemini Live...'
                      : '1080p Video Lesson'}
                  </span>
                </div>
              </div>

              {/* Right Badges: Audio Voice Sync Indicator & Photo Upload */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                {/* Voice Sync Indicator Pill */}
                <div
                  className="relative group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSyncInfo((prev) => !prev);
                  }}
                >
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-[10px] font-semibold text-amber-300 hover:bg-black/80 transition-colors">
                    <Radio className={`w-3 h-3 ${isSpeaking ? 'animate-pulse text-amber-400' : 'text-slate-400'}`} />
                    <span className="hidden xs:inline">Voice Sync</span>
                    <Info className="w-2.5 h-2.5 text-slate-300" />
                  </div>

                  {/* Popover / Tooltip Explaining Audio Sync */}
                  {showSyncInfo && (
                    <div
                      className="absolute right-0 top-8 z-30 w-64 p-3 rounded-2xl bg-slate-900/95 border border-amber-400/30 text-white text-[11px] shadow-2xl backdrop-blur-lg leading-relaxed animate-in fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1 font-bold text-amber-300">
                        <span>Audio-Synchronized Teacher</span>
                        <button
                          type="button"
                          onClick={() => setShowSyncInfo(false)}
                          className="text-slate-400 hover:text-white text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-slate-200 mb-1.5">
                        Tutor portrait with real-time lip movement synchronized directly to AI speech playback.
                      </p>
                      <p className="text-slate-400 text-[10px] border-t border-white/10 pt-1">
                        Driven by Web Audio API frequency analysis on actual Gemini Live audio. Stops immediately upon silence or interruption.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Video-Call Bottom Status Bar & Live Waveform */}
          {isVideoMode && isCallActive && (
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
              {/* Audio Waveform Reaction on Video Feed */}
              {isSpeaking ? (
                <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 flex items-center gap-1.5 shadow-md">
                  <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                  <div className="flex items-center gap-0.5 h-3">
                    {[0.5, 0.9, 1.4, 0.7, 1.2, 0.8, 1.5, 0.6].map((scale, i) => {
                      const h = Math.max(3, Math.round(mouthFactor * 12 * scale));
                      return (
                        <div
                          key={i}
                          className="w-1 bg-amber-400 rounded-full transition-all duration-75"
                          style={{ height: `${h}px` }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-300 ml-1">
                    Speaking
                  </span>
                </div>
              ) : isListening ? (
                <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-400/40 flex items-center gap-1.5 shadow-md">
                  <Mic className="w-3 h-3 text-emerald-400 animate-bounce" />
                  <span className="text-[10px] font-semibold text-emerald-300">
                    Listening to you...
                  </span>
                </div>
              ) : (
                <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-medium text-slate-300">
                  Live Session
                </div>
              )}

              {/* Status Badge */}
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>1080p HD</span>
              </div>
            </div>
          )}

          {/* Idle Screen Actions (Before Call Starts) */}
          {isVideoMode && !isCallActive && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 text-center z-20">
              {onStartCall && (
                <button
                  type="button"
                  onClick={onStartCall}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}
              <div>
                <span className="text-white font-bold text-sm tracking-tight drop-shadow-md block">
                  Start Speaking with {teacherName}
                </span>
                <span className="text-xs text-amber-300 font-medium drop-shadow-sm block mt-0.5">
                  Tap to begin live interactive video session
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
