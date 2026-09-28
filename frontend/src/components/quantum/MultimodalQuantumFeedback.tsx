import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2Icon,
  VolumeXIcon,
  SparklesIcon,
  RotateCwIcon,
  SlidersIcon,
  CompassIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  PlayIcon,
  ArrowRightIcon,
  ActivityIcon,
  WavesIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { audioEngine } from '../../services/audioEngine';
import { QubotCompanion } from '../QubotCompanion';

export interface MultimodalQuantumFeedbackProps {
  isCorrect: boolean;
  conceptTitle: string;
  learnerExplanation: string;
  axiomExplanation?: string;
  predictedState?: {
    label: string;
    theta: number; // degrees
    phi: number;   // degrees
    prob0: number;
    prob1: number;
  };
  targetState?: {
    label: string;
    theta: number;
    phi: number;
    prob0: number;
    prob1: number;
  };
  onOpenSandbox?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

export function MultimodalQuantumFeedback({
  isCorrect,
  conceptTitle,
  learnerExplanation,
  axiomExplanation,
  predictedState = { label: '|+⟩', theta: 90, phi: 0, prob0: 50, prob1: 50 },
  targetState = { label: '|+⟩', theta: 90, phi: 0, prob0: 50, prob1: 50 },
  onOpenSandbox,
  onNext,
  nextLabel = 'Advance to Next Concept'
}: MultimodalQuantumFeedbackProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseAngle, setPhaseAngle] = useState<number>(isCorrect ? 0 : 180);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeTab, setActiveTab] = useState<'wave' | 'bloch' | 'pedagogy'>('wave');
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Play initial feedback tone on mount
  useEffect(() => {
    if (isCorrect) {
      audioEngine.playConstructiveInterferenceTone();
    } else {
      audioEngine.playDestructiveCancellationTone();
    }
  }, [isCorrect]);

  // Real-time Wave Interference Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;
      timeRef.current += 0.04;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw coordinate centerline
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      const phiRad = (phaseAngle * Math.PI) / 180;
      const amp1 = h * 0.22;
      const amp2 = h * 0.22;
      const k = 0.035;

      // 1. Draw Wave 1 (Component Wave |0⟩) - Cyan
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y = midY - Math.sin(k * x - t) * amp1;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Wave 2 (Component Wave |1⟩ with Phase shift phi) - Violet
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y = midY - Math.sin(k * x - t + phiRad) * amp2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Draw Resultant Superposition Wave Psi = W1 + W2 - Glowing Emerald or Gold
      ctx.beginPath();
      const isConstructive = Math.cos(phiRad) > 0.5;
      ctx.strokeStyle = isConstructive ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 3;
      ctx.shadowColor = isConstructive ? 'rgba(16, 185, 129, 0.6)' : 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 10;

      for (let x = 0; x < w; x++) {
        const y1 = Math.sin(k * x - t) * amp1;
        const y2 = Math.sin(k * x - t + phiRad) * amp2;
        const netY = midY - (y1 + y2) * 0.75;
        if (x === 0) ctx.moveTo(x, netY);
        else ctx.lineTo(x, netY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [phaseAngle]);

  const handleTogglePhase = (newPhase: number) => {
    setPhaseAngle(newPhase);
    audioEngine.playPhaseShiftTone(newPhase);
    if (newPhase === 0) {
      audioEngine.playConstructiveInterferenceTone();
    } else if (newPhase === 180) {
      audioEngine.playDestructiveCancellationTone();
    }
  };

  const handleSonifyWave = () => {
    setIsPlayingSound(true);
    if (phaseAngle === 0) {
      audioEngine.playConstructiveInterferenceTone();
    } else if (phaseAngle === 180) {
      audioEngine.playDestructiveCancellationTone();
    } else {
      audioEngine.playPhaseShiftTone(phaseAngle);
    }
    setTimeout(() => setIsPlayingSound(false), 600);
  };

  // Bloch vector angular delta
  const deltaTheta = Math.abs(predictedState.theta - targetState.theta);
  const deltaPhi = Math.abs(predictedState.phi - targetState.phi);

  return (
    <div
      className={`rounded-2xl border-2 p-5 sm:p-6 transition-all shadow-md space-y-5 ${
        isCorrect
          ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-emerald-950/20 dark:border-emerald-500/40'
          : 'border-amber-500/50 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-zinc-900 dark:to-amber-950/20 dark:border-amber-500/40'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold shadow-sm ${
              isCorrect
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2Icon className="h-5 w-5" />
            ) : (
              <AlertTriangleIcon className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isCorrect
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {isCorrect ? 'Hypothesis Verified & Axiom Proven (+30 CP)' : 'Quantum Wave Divergence Diagnostic'}
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Multi-Sensory Feedback
              </span>
            </div>
            <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {conceptTitle}
            </h4>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-950 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('wave')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'wave'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <WavesIcon className="h-3.5 w-3.5 text-emerald-600" />
            Wave Interference
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bloch')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'bloch'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <CompassIcon className="h-3.5 w-3.5 text-cyan-600" />
            Bloch Coordinate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pedagogy')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeTab === 'pedagogy'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <SparklesIcon className="h-3.5 w-3.5 text-purple-600" />
            Socratic Insight
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE WAVE INTERFERENCE & ACOUSTIC SONIFICATION */}
      {activeTab === 'wave' && (
        <div className="space-y-4">
          {/* Wave Canvas Container */}
          <div className="relative rounded-xl border border-zinc-200/90 bg-zinc-950 p-3 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 px-1 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-400 text-[11px] font-mono">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  |0⟩ Wave
                </span>
                <span className="flex items-center gap-1 text-purple-400 text-[11px] font-mono">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  e^(iφ)|1⟩ Wave
                </span>
                <span className="flex items-center gap-1 font-bold text-[11px] font-mono text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Resultant |ψ⟩
                </span>
              </div>

              {/* Sonify Wave Button */}
              <button
                type="button"
                onClick={handleSonifyWave}
                className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                title="Synthesize and play the quantum superposition tone"
              >
                <Volume2Icon className={`h-3.5 w-3.5 ${isPlayingSound ? 'text-emerald-400 animate-bounce' : 'text-zinc-400'}`} />
                <span>Hear Wave Tone</span>
              </button>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={140}
              className="w-full h-32 block my-1"
            />

            {/* Live Interactive Phase Controls */}
            <div className="mt-2 pt-2.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-medium">Relative Phase (φ):</span>
                <span className="font-mono font-bold text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {phaseAngle}° {phaseAngle === 0 ? '(In-Phase)' : phaseAngle === 180 ? '(Antiphase π)' : ''}
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTogglePhase(0)}
                  className={`rounded px-2 py-1 text-[11px] font-bold transition ${
                    phaseAngle === 0
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  0° Constructive (|+⟩)
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePhase(90)}
                  className={`rounded px-2 py-1 text-[11px] font-bold transition ${
                    phaseAngle === 90
                      ? 'bg-cyan-600 text-white shadow'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  90° Circular (|+i⟩)
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePhase(180)}
                  className={`rounded px-2 py-1 text-[11px] font-bold transition ${
                    phaseAngle === 180
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  180° Destructive (|-⟩)
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {phaseAngle === 0 ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                Constructive Superposition: The waves add constructively, amplifying probability along the +X axis.
              </span>
            ) : phaseAngle === 180 ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                Destructive Wave Interference: At 180° relative phase (|-⟩), wave amplitudes cancel out destructively upon Hadamard transformation!
              </span>
            ) : (
              <span className="text-cyan-700 dark:text-cyan-300 font-semibold">
                Equatorial Phase Shift: Moving along the equator of the Bloch sphere rotates the azimuthal phase without altering basis probabilities.
              </span>
            )}
          </p>
        </div>
      )}

      {/* TAB 2: BLOCH COORDINATE DELTA */}
      {activeTab === 'bloch' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Your Committed State
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {predictedState.label}
                </span>
                <span className="font-mono text-xs text-purple-600 dark:text-purple-400">
                  θ: {predictedState.theta}°, φ: {predictedState.phi}°
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-900">
                <span>P(|0⟩): {predictedState.prob0}%</span>
                <span>P(|1⟩): {predictedState.prob1}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Axiomatic Quantum State
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {targetState.label}
                </span>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  θ: {targetState.theta}°, φ: {targetState.phi}°
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                <span>P(|0⟩): {targetState.prob0}%</span>
                <span>P(|1⟩): {targetState.prob1}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-100/80 p-3.5 dark:bg-zinc-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CompassIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Bloch Divergence Angle:
              </span>
            </div>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              Δθ = {deltaTheta}°, Δφ = {deltaPhi}° {deltaTheta === 0 && deltaPhi === 0 ? '(Exact Vector Coincidence)' : ''}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: SOCRATIC INSIGHT & PEDAGOGICAL BREAKDOWN */}
      {activeTab === 'pedagogy' && (
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="rounded-xl bg-white/90 p-4 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 space-y-2">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Conceptual Reflection:</span>
            <p className="text-zinc-800 dark:text-zinc-200">
              {learnerExplanation}
            </p>
          </div>

          {axiomExplanation && (
            <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/60 space-y-1.5">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Physical Quantum Reality:</span>
              <p className="text-emerald-950 dark:text-emerald-100">
                {axiomExplanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {onOpenSandbox && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenSandbox}
              className="gap-1.5 text-xs h-8"
            >
              <ActivityIcon className="h-3.5 w-3.5 text-emerald-600" />
              Verify in Quantum Circuit Sandbox
            </Button>
          )}
        </div>

        {onNext && (
          <Button
            size="sm"
            onClick={onNext}
            className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <span>{nextLabel}</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
