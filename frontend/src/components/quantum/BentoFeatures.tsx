import React, { useState } from 'react';
import { 
  MessageSquareIcon, 
  GitForkIcon, 
  CpuIcon, 
  ClipboardCheckIcon, 
  TrendingUpIcon, 
  BotIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ZapIcon, 
  ShieldCheckIcon,
  LayersIcon,
  CompassIcon,
  CheckCircle2Icon,
  XCircleIcon,
  RotateCcwIcon,
  SendIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ViewId } from '../../data/appData';

interface BentoFeaturesProps {
  onNavigate: (view: ViewId) => void;
}

const CIRCUIT_SANDBOX_PRESETS = [
  {
    name: 'Hadamard Superposition',
    gates: 'H',
    qubits: '1 Qubit',
    state: '(|0⟩ + |1⟩) / √2',
    probs: [
      { state: '|0⟩', pct: 50 },
      { state: '|1⟩', pct: 50 },
    ],
    desc: 'Maps ground state to equal superposition with 50/50 measurement probabilities.',
  },
  {
    name: 'Bell Entanglement',
    gates: 'H ➜ CNOT',
    qubits: '2 Qubits',
    state: '(|00⟩ + |11⟩) / √2',
    probs: [
      { state: '|00⟩', pct: 50 },
      { state: '|11⟩', pct: 50 },
    ],
    desc: 'Maximally entangled Bell state (|Φ⁺⟩). Measurement of one qubit projects the second.',
  },
  {
    name: 'Pauli-X Bit Flip',
    gates: 'X',
    qubits: '1 Qubit',
    state: '|1⟩',
    probs: [
      { state: '|0⟩', pct: 0 },
      { state: '|1⟩', pct: 100 },
    ],
    desc: 'Quantum NOT gate, rotating the state vector by π radians around the X-axis.',
  },
  {
    name: 'Phase Shift S Gate',
    gates: 'H ➜ S',
    qubits: '1 Qubit',
    state: '(|0⟩ + i|1⟩) / √2',
    probs: [
      { state: '|0⟩', pct: 50 },
      { state: '|1⟩', pct: 50 },
    ],
    desc: 'Applies π/2 phase rotation along the Z-axis without changing measurement amplitudes.',
  },
];

const GATES_DATA: Record<string, { name: string; matrix: string; effect: string; color: string }> = {
  H: { name: 'Hadamard', matrix: '1/√2 [[1, 1], [1, -1]]', effect: '|0⟩ ➜ (|0⟩ + |1⟩)/√2', color: 'text-purple-900 border-purple-200 bg-purple-50' },
  X: { name: 'Pauli-X (NOT)', matrix: '[[0, 1], [1, 0]]', effect: '|0⟩ ➜ |1⟩, |1⟩ ➜ |0⟩', color: 'text-amber-900 border-amber-200 bg-amber-50' },
  CX: { name: 'CNOT Entangler', matrix: '4x4 Controlled-NOT', effect: '|10⟩ ➜ |11⟩ (Entangles)', color: 'text-indigo-900 border-indigo-200 bg-indigo-50' },
  S: { name: 'Phase S (π/2)', matrix: '[[1, 0], [0, i]]', effect: '|1⟩ ➜ i|1⟩ (90° Z-rot)', color: 'text-teal-900 border-teal-200 bg-teal-50' },
  T: { name: 'T Gate (π/4)', matrix: '[[1, 0], [0, e^(iπ/4)]]', effect: '|1⟩ ➜ e^(iπ/4)|1⟩', color: 'text-blue-900 border-blue-200 bg-blue-50' },
  SWAP: { name: 'SWAP Gate', matrix: '4x4 Register Swap', effect: '|01⟩ ➜ |10⟩', color: 'text-pink-900 border-pink-200 bg-pink-50' },
};

export function BentoFeatures({ onNavigate }: BentoFeaturesProps) {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(85);
  const [selectedGate, setSelectedGate] = useState('H');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [srsDay, setSrsDay] = useState<'1' | '3' | '7' | '30'>('7');

  const currentPreset = CIRCUIT_SANDBOX_PRESETS[activePresetIdx];
  const gateInfo = GATES_DATA[selectedGate];

  const srsRetentionMap = {
    '1': { pct: 98, label: 'Immediate Retention', reviewIn: '12 Hours' },
    '3': { pct: 88, label: 'Active Consolidation', reviewIn: '2 Days' },
    '7': { pct: 76, label: 'Optimum Recall', reviewIn: 'Scheduled Today' },
    '30': { pct: 58, label: 'Decay Threshold', reviewIn: 'Requires Review' },
  };

  return (
    <div className="w-full">
      {/* Asymmetric Bento Grid in Light Theme with Royal Plum & Gold Accents */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        
        {/* CARD 1: Interactive Quantum Circuit & Simulation Sandbox (8 cols) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#4c1d70] hover:shadow-md md:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-[#4c1d70]">
                <CpuIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4c1d70]">
                  Aer Statevector Sandbox
                </span>
                <h3 className="font-display text-xl font-bold text-[#1e0a2e]">
                  Interactive Quantum Circuit Composer
                </h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-[#4c1d70]">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Live Simulation Preview
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-600 sm:text-sm">
            Select a quantum circuit configuration to preview statevector evolutions and collapsed measurement probabilities:
          </p>

          {/* Interactive Preset Selector Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CIRCUIT_SANDBOX_PRESETS.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActivePresetIdx(idx)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  activePresetIdx === idx
                    ? 'border border-[#4c1d70] bg-[#4c1d70] text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-zinc-700 hover:border-purple-300 hover:text-[#4c1d70]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Interactive Circuit Response & Probabilities */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 font-sans text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-[#4c1d70]">
                  GATES: {currentPreset.gates}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">{currentPreset.qubits}</span>
              </div>
              <div className="font-mono text-xs font-bold text-[#1e0a2e]">
                |ψ⟩ = {currentPreset.state}
              </div>
            </div>

            <p className="text-zinc-600 text-xs leading-relaxed">{currentPreset.desc}</p>

            {/* Probability Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {currentPreset.probs.map((item) => (
                <div key={item.state} className="rounded-xl border border-purple-100 bg-white p-2.5 text-center shadow-xs">
                  <div className="font-mono text-xs font-bold text-zinc-800">{item.state}</div>
                  <div className="text-[11px] font-bold text-[#4c1d70] mt-0.5">{item.pct}%</div>
                  <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4c1d70] to-[#f5d626] rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('circuits')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4c1d70] hover:text-[#391555] transition-colors"
            >
              <span>Open Visual Quantum Circuit Composer</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-zinc-400">Qiskit Aer + WebGL Engine</span>
          </div>
        </div>

        {/* CARD 2: Adaptive Knowledge Engine with Live Accuracy Slider (4 cols) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#4c1d70] hover:shadow-md md:col-span-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <GitForkIcon className="h-5 w-5" />
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-[#1e0a2e]">
            Bayesian Knowledge Tracing
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Simulate diagnostic test score to watch prerequisite readiness recalibrate live:
          </p>

          {/* Interactive Accuracy Slider */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-600 font-mono">Test Accuracy</span>
              <span className="font-mono font-bold text-[#4c1d70]">{accuracyScore}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={accuracyScore}
              onChange={(e) => setAccuracyScore(Number(e.target.value))}
              className="mt-2 w-full accent-[#4c1d70] cursor-pointer"
            />
          </div>

          {/* Recalibrated Mastery Bars */}
          <div className="mt-4 space-y-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-zinc-700">Phase Gates (P_L)</span>
                <span className={`font-mono font-bold ${accuracyScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {accuracyScore >= 80 ? 'Unlocked (85%)' : 'Needs Review (52%)'}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${accuracyScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${accuracyScore >= 80 ? accuracyScore : accuracyScore * 0.65}%` }} 
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('path')}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4c1d70] hover:text-[#391555]"
          >
            <span>View Full Knowledge Graph</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* CARD 3: Interactive Gate Matrix Inspector (4 cols) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#4c1d70] hover:shadow-md md:col-span-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-[#4c1d70]">
            <CpuIcon className="h-5 w-5" />
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-[#1e0a2e]">
            Gate Matrix Inspector
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            Click any gate to inspect its unitary transformation matrix and basis state projection:
          </p>

          {/* Clickable Gate Palette Chips */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Object.keys(GATES_DATA).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGate(g)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                  selectedGate === g
                    ? 'bg-[#4c1d70] text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-zinc-700 hover:border-purple-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Active Gate Readout Box */}
          <div className={`mt-4 rounded-xl border p-3 font-mono text-xs ${gateInfo.color}`}>
            <div className="font-bold">{gateInfo.name}</div>
            <div className="mt-1 text-[11px] opacity-90">Matrix: {gateInfo.matrix}</div>
            <div className="mt-1 font-semibold">Action: {gateInfo.effect}</div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('circuits')}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4c1d70] hover:text-[#391555]"
          >
            <span>Launch Circuit Studio</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* CARD 4: Interactive Micro-Quiz Assessment (4 cols) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#4c1d70] hover:shadow-md md:col-span-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <ClipboardCheckIcon className="h-5 w-5" />
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-[#1e0a2e]">
            Active Recall Micro-Quiz
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Which gate transforms ground state |0⟩ into equal superposition |+⟩?
          </p>

          {/* Interactive Quiz Choices */}
          <div className="mt-4 space-y-1.5">
            {[
              { id: 0, label: 'Pauli-X Gate', isCorrect: false },
              { id: 1, label: 'Hadamard (H) Gate', isCorrect: true },
              { id: 2, label: 'Phase (S) Gate', isCorrect: false },
            ].map((opt) => {
              const isSelected = quizAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuizAnswer(opt.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-slate-200 bg-slate-50 text-zinc-700 hover:border-purple-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && opt.isCorrect && <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />}
                  {isSelected && !opt.isCorrect && <XCircleIcon className="h-4 w-4 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {quizAnswer !== null && (
            <p className="mt-2 text-[11px] font-bold text-emerald-700">
              {quizAnswer === 1 ? '✓ Correct! H|0⟩ = (|0⟩ + |1⟩)/√2.' : '✗ Try again: H creates equal amplitudes.'}
            </p>
          )}

          <button
            type="button"
            onClick={() => onNavigate('assessments')}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4c1d70] hover:text-[#391555]"
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* CARD 5: Spaced Repetition SRS Retention (4 cols) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#4c1d70] hover:shadow-md md:col-span-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-[#4c1d70]">
            <TrendingUpIcon className="h-5 w-5" />
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-[#1e0a2e]">
            Spaced Repetition (SRS)
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            Select an interval to observe calculated retention decay and recall alerts:
          </p>

          {/* Interactive Day Interval Selector */}
          <div className="mt-3 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['1', '3', '7', '30'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSrsDay(d)}
                className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all ${
                  srsDay === d
                    ? 'bg-[#4c1d70] text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>

          {/* Retention Stats Readout */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-700">{srsRetentionMap[srsDay].label}</span>
              <span className="font-bold text-[#4c1d70]">{srsRetentionMap[srsDay].pct}% Retention</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full rounded-full bg-[#4c1d70] transition-all duration-300" 
                style={{ width: `${srsRetentionMap[srsDay].pct}%` }} 
              />
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">
              Next Scheduled Review: <span className="text-emerald-700 font-bold">{srsRetentionMap[srsDay].reviewIn}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4c1d70] hover:text-[#391555]"
          >
            <span>View Mastery Analytics</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
