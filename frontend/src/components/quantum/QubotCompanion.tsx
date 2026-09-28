import React, { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  XIcon,
  ArrowRightIcon,
  ClockIcon,
  Volume2Icon,
  VolumeXIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  HeadphonesIcon,
  MoonIcon,
  CoffeeIcon,
  SmileIcon,
  ZapIcon,
  HeartIcon,
  AwardIcon,
  CheckCircle2Icon,
  FlameIcon,
  ActivityIcon
} from 'lucide-react';
import type { ViewId } from '../../data/appData';
import { GeniePresence } from '../ui/GenieMotion';
import { audioEngine } from '../../services/audioEngine';
import { stateStore } from '../../services/stateStore';
import { apiClient } from '../../services/apiClient';

export type CanonicalState =
  | 'IDLE'
  | 'HAPPY'
  | 'THINKING'
  | 'ENCOURAGING'
  | 'CELEBRATING'
  | 'CONFUSED'
  | 'FOCUS_REMINDER'
  | 'BREAK_REMINDER'
  | 'SLEEPING'
  | 'SYMPATHETIC'
  | 'HINTING'
  | 'WARNING'
  | 'CURIOUS'
  | 'INVESTIGATING'
  | 'SURPRISED'
  | 'PROUD'
  | 'EXPLAINING'
  | 'RESTING';

export type EmotionState =
  | 'NEUTRAL'
  | 'JOYFUL'
  | 'CURIOUS'
  | 'SUPPORTIVE'
  | 'EMPATHETIC'
  | 'PUZZLED'
  | 'PROUD'
  | 'CALM'
  | 'ALERT'
  | 'FOCUSED'
  | 'PLAYFUL'
  | 'RESTFUL';

export type SemanticAnimation =
  | 'GENTLE_ENCOURAGE'
  | 'THINK_POSE'
  | 'CELEBRATE_JUMP'
  | 'REST_BREATHE'
  | 'SCAN_RADAR'
  | 'WOBBLE_CONFUSED'
  | 'IDLE_FLOAT';

interface QubotCompanionProps {
  onNavigate?: (view: ViewId) => void;
  externalState?: CanonicalState;
  externalEmotion?: EmotionState;
}

type TabMode = 'insight' | 'focus' | 'break' | 'mood' | 'cheer';

// Growth-Mindset, Anti-Shaming Dialogues (Part 7.1 in agent.md)
const STATE_DIALOGUES: Record<CanonicalState, { text: string; tag: string; emotion: EmotionState }> = {
  IDLE: {
    text: 'Quantum states are humming in background superposition. Ready to explore a new circuit?',
    tag: 'Coherent & Ready',
    emotion: 'CALM'
  },
  HAPPY: {
    text: 'Great run! Your statevector intuition is converging beautifully.',
    tag: 'Intuition Synced',
    emotion: 'JOYFUL'
  },
  THINKING: {
    text: 'Contemplating unitary basis transformations... let me analyze the phase angles.',
    tag: 'Simulating...',
    emotion: 'CURIOUS'
  },
  ENCOURAGING: {
    text: 'Every failed run is empirical data! Even superpositions collapse into fresh opportunities.',
    tag: 'Anti-Shaming Wisdom',
    emotion: 'SUPPORTIVE'
  },
  CELEBRATING: {
    text: 'Quantum supremacy achieved! Zero divergence between prediction and simulation!',
    tag: 'Supremacy Unlocked',
    emotion: 'PROUD'
  },
  CONFUSED: {
    text: 'Quantum counter-intuition is completely normal—Einstein called it spooky too! Let us walk through it step-by-step.',
    tag: 'Normalizing Paradox',
    emotion: 'PUZZLED'
  },
  FOCUS_REMINDER: {
    text: '40Hz gamma binaural waves can synchronize prefrontal neural firing. Let us start a deep 25m block.',
    tag: 'Deep Focus Prompt',
    emotion: 'FOCUSED'
  },
  BREAK_REMINDER: {
    text: 'Continuous attention causes cognitive drift. Restoring coherence takes just 5 quiet minutes.',
    tag: 'Cognitive Recovery',
    emotion: 'RESTFUL'
  },
  SLEEPING: {
    text: 'Zzz... Restoring quantum coherence... Thermal noise dissipating to 0 Kelvin...',
    tag: 'Coherence Sleep',
    emotion: 'RESTFUL'
  },
  SYMPATHETIC: {
    text: 'Hilbert spaces are mathematically demanding. Take a deep breath—your persistence is where real learning happens.',
    tag: 'Compassionate Guide',
    emotion: 'EMPATHETIC'
  },
  HINTING: {
    text: 'Look closely at the phase! A Hadamard gate does not just change probabilities; it enables destructive interference.',
    tag: 'Socratic Clue',
    emotion: 'CURIOUS'
  },
  WARNING: {
    text: 'Careful with measurement placement! Measuring mid-circuit collapses superposition and destroys relative phase.',
    tag: 'Wavefunction Alert',
    emotion: 'ALERT'
  },
  CURIOUS: {
    text: 'What do you hypothesize will happen if we add another CNOT gate here?',
    tag: 'Scientific Inquiry',
    emotion: 'CURIOUS'
  },
  INVESTIGATING: {
    text: 'Scanning statevector for entangled Bell pairs... Hamming weight distribution looks fascinating!',
    tag: 'Quantum Radar',
    emotion: 'FOCUSED'
  },
  SURPRISED: {
    text: 'Remarkable! You found an alternative gate sequence that synthesizes the exact same unitary operator!',
    tag: 'Brilliant Synthesis',
    emotion: 'JOYFUL'
  },
  PROUD: {
    text: 'Your Bayesian mastery score just advanced across foundational linear algebra nodes!',
    tag: 'Mastery Milestoned',
    emotion: 'PROUD'
  },
  EXPLAINING: {
    text: 'Unitary matrices preserve the complex inner product norm ||ψ|| = 1. Information is never lost in pure quantum mechanics.',
    tag: 'Theory Grounding',
    emotion: 'NEUTRAL'
  },
  RESTING: {
    text: 'Rest mode active. Inhale for 4s... hold for 4s... exhale for 4s. Coherence restored.',
    tag: 'Restorative Breathing',
    emotion: 'RESTFUL'
  }
};

const ALL_STATES: CanonicalState[] = [
  'IDLE', 'HAPPY', 'THINKING', 'ENCOURAGING', 'CELEBRATING',
  'CONFUSED', 'FOCUS_REMINDER', 'BREAK_REMINDER', 'SLEEPING',
  'SYMPATHETIC', 'HINTING', 'WARNING', 'CURIOUS', 'INVESTIGATING',
  'SURPRISED', 'PROUD', 'EXPLAINING', 'RESTING'
];

export function QubotCompanion({ onNavigate, externalState, externalEmotion }: QubotCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<TabMode>('insight');
  const [canonicalState, setCanonicalState] = useState<CanonicalState>(externalState || 'IDLE');
  const [emotion, setEmotion] = useState<EmotionState>(externalEmotion || 'CALM');
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(5 * 60);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [isBinauralActive, setIsBinauralActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(!audioEngine.isMuted());
  const [cheerCount, setCheerCount] = useState(0);
  const [xpAwardNotification, setXpAwardNotification] = useState<string | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Fetch authoritative mascot state from backend
  useEffect(() => {
    apiClient.getQubotState().then((res) => {
      if (res && res.state) {
        setCanonicalState(res.state as CanonicalState);
        if (res.emotion) setEmotion(res.emotion as EmotionState);
      }
    }).catch(() => {});
  }, []);

  // Sync external state changes if passed from parent
  useEffect(() => {
    if (externalState) {
      setCanonicalState(externalState);
      if (STATE_DIALOGUES[externalState]) {
        setEmotion(externalEmotion || STATE_DIALOGUES[externalState].emotion);
      }
    }
  }, [externalState, externalEmotion]);

  // Pomodoro countdown timer (25 minutes)
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((s) => {
          if (s <= 1) {
            handlePomodoroComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  // 5-minute Rest Break timer
  useEffect(() => {
    let interval: any;
    if (isRestRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((s) => {
          if (s <= 1) {
            handleRestComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestRunning, restSeconds]);

  const handlePomodoroComplete = () => {
    setIsTimerRunning(false);
    audioEngine.playLevelUpFanfare();
    setCanonicalState('CELEBRATING');
    setEmotion('PROUD');
    stateStore.awardFocusXP(40, 'Pomodoro Deep Focus Block Completed');
    triggerXpToast('+40 XP Earned! 25-Min Deep Focus Block Complete');
    apiClient.sendQubotEvent('FOCUS_INTERVAL_COMPLETED', { duration_minutes: 25 }).catch(() => {});
  };

  const handleRestComplete = () => {
    setIsRestRunning(false);
    audioEngine.playRestBell();
    setCanonicalState('HAPPY');
    setEmotion('JOYFUL');
    stateStore.awardFocusXP(15, 'Restorative Quantum Coherence Break');
    triggerXpToast('+15 XP Earned! Coherence Restored');
    apiClient.sendQubotEvent('REST_COMPLETED', { duration_minutes: 5 }).catch(() => {});
  };

  const triggerXpToast = (msg: string) => {
    setXpAwardNotification(msg);
    setTimeout(() => setXpAwardNotification(null), 4500);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle 40Hz focus binaural beat
  const toggleBinaural = () => {
    const active = audioEngine.toggleFocusBinauralBeat();
    setIsBinauralActive(active);
    audioEngine.playGateSnap();
  };

  // Toggle mute
  const toggleMute = () => {
    const nextMuted = audioEngine.toggleMute();
    setSoundEnabled(!nextMuted);
    if (nextMuted && isBinauralActive) {
      setIsBinauralActive(false);
    }
  };

  // Handle direct tap on Qubot (500ms debounce as per Part 7.4)
  const handleMascotTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 500) return;
    setLastTapTime(now);

    audioEngine.playGateSnap();
    // Cycle to next engaging state
    const states: CanonicalState[] = ['HAPPY', 'THINKING', 'ENCOURAGING', 'CURIOUS', 'INVESTIGATING', 'PROUD'];
    const next = states[Math.floor(Math.random() * states.length)];
    setCanonicalState(next);
    setEmotion(STATE_DIALOGUES[next].emotion);
  };

  const activeDialogue = STATE_DIALOGUES[canonicalState] || STATE_DIALOGUES.IDLE;
  const timerPct = ((25 * 60 - pomodoroSeconds) / (25 * 60)) * 100;
  const restPct = ((5 * 60 - restSeconds) / (5 * 60)) * 100;

  return (
    <aside
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false);
      }}
      aria-label="Qubot Learning Companion"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
    >
      {/* Toast notification for XP awards */}
      {xpAwardNotification && (
        <div className="mb-2 animate-bounce rounded-2xl border border-amber-400/50 bg-amber-950/90 px-4 py-2 text-xs font-bold text-amber-300 shadow-xl backdrop-blur-xl flex items-center gap-2">
          <AwardIcon className="h-4 w-4 text-amber-400" />
          <span>{xpAwardNotification}</span>
        </div>
      )}

      {/* Expanded Companion Drawer Card */}
      <GeniePresence
        open={isOpen}
        anchorRef={triggerRef}
        origin="bottom-right"
        id="qubot-panel"
        className="mb-3 w-[min(26rem,calc(100vw-2rem))] max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-zinc-950/95 p-5 text-white shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            {/* Clickable animated robot face */}
            <button
              type="button"
              onClick={handleMascotTap}
              title="Tap Qubot for feedback"
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform active:scale-95 group"
            >
              <QubotFaceSvg state={canonicalState} emotion={emotion} />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-sm font-bold text-white tracking-wide">QUBOT</h4>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  {canonicalState}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">{activeDialogue.tag}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              title={soundEnabled ? 'Quantum sound synthesis active' : 'Audio muted'}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2Icon className="h-4 w-4 text-emerald-400" /> : <VolumeXIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close companion"
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3 grid grid-cols-5 gap-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800/80 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setMode('insight');
              audioEngine.playGateSnap();
            }}
            className={`rounded-lg py-1.5 font-semibold transition-all ${
              mode === 'insight' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Insight
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('focus');
              audioEngine.playGateSnap();
            }}
            className={`rounded-lg py-1.5 font-semibold transition-all ${
              mode === 'focus' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('break');
              audioEngine.playGateSnap();
            }}
            className={`rounded-lg py-1.5 font-semibold transition-all ${
              mode === 'break' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Rest
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('mood');
              audioEngine.playGateSnap();
            }}
            className={`rounded-lg py-1.5 font-semibold transition-all ${
              mode === 'mood' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            States
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('cheer');
              setCheerCount((c) => c + 1);
              audioEngine.playLevelUpFanfare();
            }}
            className={`rounded-lg py-1.5 font-semibold transition-all ${
              mode === 'cheer' ? 'bg-emerald-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cheer 🎉
          </button>
        </div>

        {/* Tab 1: Insight & Anti-Shaming Guidance */}
        {mode === 'insight' && (
          <div className="genie-content mt-4 space-y-3">
            {/* Live Qubot Speech Bubble */}
            <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>State: {canonicalState}</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  Emotion: {emotion}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-200 font-sans">{activeDialogue.text}</p>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.('tutor');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-zinc-900 px-3 py-2 font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                <span>Ask Socratic Tutor</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.('circuits');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-bold text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <span>Open Circuit Lab</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Pomodoro Deep Focus */}
        {mode === 'focus' && (
          <div className="genie-content mt-4 space-y-4 text-center">
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-zinc-800" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-emerald-500 transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * timerPct) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-2xl font-bold tracking-tight text-white">
                  {formatTimer(pomodoroSeconds)}
                </span>
                <span className="text-[10px] uppercase font-mono text-emerald-400">Deep Block (+40 XP)</span>
              </div>
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  audioEngine.playGateSnap();
                  setIsTimerRunning(!isTimerRunning);
                  if (!isTimerRunning) {
                    setCanonicalState('FOCUS_REMINDER');
                    setEmotion('FOCUSED');
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow hover:bg-emerald-400 active:scale-95 transition-all"
              >
                {isTimerRunning ? <PauseIcon className="h-3.5 w-3.5 fill-current" /> : <PlayIcon className="h-3.5 w-3.5 fill-current" />}
                <span>{isTimerRunning ? 'Pause Focus' : 'Start 25m'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  audioEngine.playGateSnap();
                  setIsTimerRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                title="Reset timer"
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
              >
                <RotateCcwIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 40Hz Focus Binaural Beat Switcher */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <HeadphonesIcon className={`h-4 w-4 ${isBinauralActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-white">40Hz Gamma Focus Audio</h5>
                    <p className="text-[10px] text-zinc-400">Synthesizes ambient binaural beats</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleBinaural}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isBinauralActive
                      ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {isBinauralActive ? 'Active' : 'Turn On'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rest Break Mode (Part 12.4 in agent.md) */}
        {mode === 'break' && (
          <div className="genie-content mt-4 space-y-4 text-center">
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-zinc-800" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-cyan-400 transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * restPct) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-2xl font-bold tracking-tight text-white">
                  {formatTimer(restSeconds)}
                </span>
                <span className="text-[10px] uppercase font-mono text-cyan-400">Coherence Rest (+15 XP)</span>
              </div>
            </div>

            {/* Breathing Guide Animation */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-xs text-zinc-300">
              <div className="flex items-center justify-center gap-1.5 font-bold text-cyan-300 mb-1">
                <MoonIcon className="h-4 w-4" />
                <span>Restorative Breathing</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Inhale 4s &bull; Hold 4s &bull; Exhale 4s. Dissipates cognitive load and prevents fatigue lockouts.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  audioEngine.playGateSnap();
                  if (!isRestRunning) {
                    audioEngine.playRestBell();
                    setCanonicalState('RESTING');
                    setEmotion('RESTFUL');
                  }
                  setIsRestRunning(!isRestRunning);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow hover:bg-cyan-400 active:scale-95 transition-all"
              >
                {isRestRunning ? <PauseIcon className="h-3.5 w-3.5 fill-current" /> : <PlayIcon className="h-3.5 w-3.5 fill-current" />}
                <span>{isRestRunning ? 'Pause Rest' : 'Begin 5m Rest'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  audioEngine.playGateSnap();
                  setIsRestRunning(false);
                  setRestSeconds(5 * 60);
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
              >
                <RotateCcwIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: 18 Canonical States & 12 Emotions Inspector (Part 7.2 & 12.7) */}
        {mode === 'mood' && (
          <div className="genie-content mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Test Canonical State Machine:</span>
              <span className="font-mono text-[10px] text-emerald-400">{ALL_STATES.length} States</span>
            </div>

            {/* Scrollable pill container */}
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2.5">
              {ALL_STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    audioEngine.playGateSnap();
                    setCanonicalState(st);
                    setEmotion(STATE_DIALOGUES[st].emotion);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-medium transition-all ${
                    canonicalState === st
                      ? 'bg-emerald-500 text-zinc-950 shadow font-bold'
                      : 'border border-zinc-700/60 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Active State Preview Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">State: {canonicalState}</span>
                <span className="font-mono text-[10px] text-zinc-400">Emotion: {emotion}</span>
              </div>
              <p className="mt-1.5 text-xs text-zinc-300">{STATE_DIALOGUES[canonicalState].text}</p>
            </div>
          </div>
        )}

        {/* Tab 5: Cheer & Motivation Burst */}
        {mode === 'cheer' && (
          <div className="genie-content mt-4 space-y-3 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4">
              <span className="text-3xl animate-bounce inline-block">⚛️ 🎉 🚀</span>
              <h5 className="mt-2 font-display text-sm font-bold text-white">Quantum Coherence Maintained!</h5>
              <p className="mt-1 text-xs text-zinc-300">
                You triggered <span className="font-bold text-emerald-400">{cheerCount}</span> celebratory entanglements.
                Wavefunctions are fully constructive!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCheerCount((c) => c + 1);
                audioEngine.playLevelUpFanfare();
              }}
              className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition-all"
            >
              Celebrate Again! (+10 Q-Energy)
            </button>
          </div>
        )}
      </GeniePresence>

      {/* Floating Mascot Trigger Button */}
      <button
        type="button"
        onClick={() => {
          audioEngine.playGateSnap();
          setIsOpen(!isOpen);
        }}
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-controls="qubot-panel"
        aria-label="Toggle Qubot Learning Companion"
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-zinc-950/90 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {/* Pulsing Aura */}
        <span className="absolute -inset-1 rounded-2xl bg-emerald-500/20 blur opacity-75 group-hover:opacity-100 animate-pulse-glow" />

        {/* Dynamic SVG Mascot Head */}
        <div className="relative flex items-center justify-center">
          <QubotFaceSvg state={canonicalState} emotion={emotion} />
        </div>

        {/* State Indicator Dot */}
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-950" />
        </span>
      </button>
    </aside>
  );
}

// -------------------------------------------------------------
// Dynamic SVG Qubot Face & Mascot Expressions
// -------------------------------------------------------------
interface QubotFaceSvgProps {
  state: CanonicalState;
  emotion: EmotionState;
}

function QubotFaceSvg({ state, emotion }: QubotFaceSvgProps) {
  const isSleeping = state === 'SLEEPING' || state === 'RESTING';
  const isHappy = state === 'HAPPY' || state === 'CELEBRATING' || emotion === 'JOYFUL' || emotion === 'PLAYFUL';
  const isThinking = state === 'THINKING' || state === 'INVESTIGATING' || emotion === 'PUZZLED';
  const isConfused = state === 'CONFUSED';
  const isWarning = state === 'WARNING' || emotion === 'ALERT';
  const isSympathetic = state === 'SYMPATHETIC' || emotion === 'EMPATHETIC';

  return (
    <svg className="h-9 w-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Antenna */}
      <line x1="50" y1="20" x2="50" y2="8" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <circle
        cx="50"
        cy="7"
        r="4.5"
        fill={isThinking ? '#06b6d4' : isWarning ? '#f59e0b' : '#10b981'}
        className={isThinking ? 'animate-ping' : ''}
      />

      {/* Head Chassis */}
      <rect
        x="16"
        y="20"
        width="68"
        height="62"
        rx="20"
        fill="#090d16"
        stroke="#10b981"
        strokeWidth="2.5"
      />

      {/* Visor Screen */}
      <rect
        x="24"
        y="28"
        width="52"
        height="44"
        rx="12"
        fill="#04060a"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Dynamic Eyes */}
      {isSleeping ? (
        // Serene Sleeping Eyes
        <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
          <path d="M 33 50 Q 40 55 47 50" />
          <path d="M 53 50 Q 60 55 67 50" />
          <text x="70" y="36" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            z
          </text>
        </g>
      ) : isHappy ? (
        // Happy Curved Smiling Eyes ^ ^
        <g stroke="#34d399" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 33 50 Q 40 40 47 50" />
          <path d="M 53 50 Q 60 40 67 50" />
        </g>
      ) : isThinking ? (
        // Inquisitive Analytical Eyes (One squinted, one with target ring)
        <g>
          <circle cx="40" cy="48" r="5" fill="#38bdf8" />
          <circle cx="60" cy="48" r="7" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="60" cy="48" r="3" fill="#38bdf8" />
        </g>
      ) : isConfused ? (
        // Confused Asymmetric Eyes
        <g>
          <circle cx="38" cy="46" r="6" fill="#fbbf24" />
          <circle cx="62" cy="50" r="4" fill="#fbbf24" />
        </g>
      ) : isWarning ? (
        // Alert Visor Eyes
        <g fill="#f59e0b">
          <rect x="34" y="44" width="10" height="10" rx="3" />
          <rect x="56" y="44" width="10" height="10" rx="3" />
        </g>
      ) : isSympathetic ? (
        // Soft Compassionate Eyes with Blush Cheeks
        <g>
          <circle cx="40" cy="48" r="6" fill="#6ee7b7" />
          <circle cx="60" cy="48" r="6" fill="#6ee7b7" />
          {/* Pink blush cheeks */}
          <ellipse cx="32" cy="58" rx="4" ry="2" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="68" cy="58" rx="4" ry="2" fill="#f43f5e" opacity="0.6" />
        </g>
      ) : (
        // Neutral / Idle Responsive Pupils
        <g fill="#10b981">
          <circle cx="40" cy="48" r="6" />
          <circle cx="60" cy="48" r="6" />
          <circle cx="42" cy="46" r="2" fill="#ffffff" />
          <circle cx="62" cy="46" r="2" fill="#ffffff" />
        </g>
      )}

      {/* Dynamic Mouth */}
      {isHappy ? (
        <path d="M 43 62 Q 50 67 57 62" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      ) : isThinking || isConfused ? (
        <path d="M 43 63 Q 47 61 50 63 T 57 63" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      ) : isSleeping ? (
        <line x1="45" y1="64" x2="55" y2="64" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <line x1="44" y1="63" x2="56" y2="63" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
