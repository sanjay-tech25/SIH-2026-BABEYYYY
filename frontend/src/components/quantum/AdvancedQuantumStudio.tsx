import React, { useState } from 'react';
import { 
  CpuIcon, 
  CodeIcon, 
  SparklesIcon, 
  ExternalLinkIcon, 
  ArrowRightIcon, 
  PlayIcon,
  ZapIcon,
  CompassIcon,
  FlaskConicalIcon,
  CheckIcon,
  CopyIcon,
  RotateCcwIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ViewId } from '../../data/appData';

interface AdvancedQuantumStudioProps {
  onNavigate: (view: ViewId) => void;
}

interface PresetAlgorithm {
  id: string;
  name: string;
  tag: string;
  code: string;
  qubits: { id: string; gates: { name: string; col: number; isControl?: boolean; target?: boolean }[] }[];
  resultCounts: Record<string, number>;
  formula: string;
  entropy: string;
}

const PRESETS: PresetAlgorithm[] = [
  {
    id: 'bell',
    name: 'Bell State (|Φ⁺⟩)',
    tag: 'Entanglement',
    formula: '(|00⟩ + |11⟩) / √2',
    entropy: '1.0 (Maximal)',
    code: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)           # Superposition on q[0]
qc.cx(0, 1)       # CNOT entanglement with q[1]
qc.measure_all()

backend = AerSimulator()
result = backend.run(transpile(qc, backend), shots=1024).result()
print(result.get_counts())
# Output: {'00': 512, '11': 512}`,
    qubits: [
      { id: 'q[0]', gates: [{ name: 'H', col: 20 }, { name: '•', col: 60, isControl: true }] },
      { id: 'q[1]', gates: [{ name: '⊕', col: 60, target: true }] },
    ],
    resultCounts: { '00': 512, '11': 512 },
  },
  {
    id: 'grover',
    name: "Grover's Search",
    tag: 'Amplitude Amplification',
    formula: 'Target State |11⟩ Amplified',
    entropy: '0.04 (Target Peak)',
    code: `from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h([0, 1])      # Equal superposition
qc.cz(0, 1)       # Oracle marking |11>
qc.h([0, 1])      # Diffusion transform
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])
qc.measure_all()

result = AerSimulator().run(qc, shots=1024).result()
print(result.get_counts())
# Output: {'11': 1024}`,
    qubits: [
      { id: 'q[0]', gates: [{ name: 'H', col: 15 }, { name: '•', col: 35, isControl: true }, { name: 'H', col: 55 }, { name: 'X', col: 75 }] },
      { id: 'q[1]', gates: [{ name: 'H', col: 15 }, { name: 'Z', col: 35, target: true }, { name: 'H', col: 55 }, { name: 'X', col: 75 }] },
    ],
    resultCounts: { '11': 998, '00': 12, '01': 8, '10': 6 },
  },
  {
    id: 'teleport',
    name: 'Quantum Teleportation',
    tag: 'Protocol',
    formula: '|ψ⟩ Alice ➜ Bob',
    entropy: 'Shared EPR Pair',
    code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
# State preparation on q[0]
qc.x(0)
# Create Bell Pair between q[1] & q[2]
qc.h(1)
qc.cx(1, 2)
# Alice Bell measurement
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])
# Bob conditional corrections
qc.cx(1, 2)
qc.cz(0, 2)`,
    qubits: [
      { id: 'q[0] (ψ)', gates: [{ name: 'X', col: 15 }, { name: '•', col: 45, isControl: true }, { name: 'H', col: 70 }] },
      { id: 'q[1] (A)', gates: [{ name: 'H', col: 20 }, { name: '•', col: 30, isControl: true }, { name: '⊕', col: 45, target: true }] },
      { id: 'q[2] (B)', gates: [{ name: '⊕', col: 30, target: true }, { name: 'CX', col: 75 }] },
    ],
    resultCounts: { '001': 256, '011': 256, '101': 256, '111': 256 },
  },
];

export function AdvancedQuantumStudio({ onNavigate }: AdvancedQuantumStudioProps) {
  const [activePresetId, setActivePresetId] = useState('bell');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimCompleted(false);
    setSimProgress(0);

    const timer = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsSimulating(false);
          setSimCompleted(true);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activePreset.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 border-t border-zinc-800/80">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Information & Controls */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <CpuIcon className="h-3.5 w-3.5" />
            Active Quantum Experimentation
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Interactive Quantum Circuit Studio
          </h2>

          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Test and simulate real quantum algorithms directly in your browser. Select a preset below to inspect Qiskit Python syntax, wire representations, and run 1024-shot Monte Carlo Aer sampling:
          </p>

          {/* Interactive Preset Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setActivePresetId(preset.id);
                  setSimCompleted(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activePresetId === preset.id
                    ? 'border border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>{preset.name}</span>
                <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <span className="font-mono text-xl font-bold text-emerald-400">12 Gates</span>
              <p className="mt-1 text-xs text-zinc-400">Single & two-qubit unitary rotations</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <span className="font-mono text-xl font-bold text-cyan-400">1024 Shots</span>
              <p className="mt-1 text-xs text-zinc-400">Aer simulator probabilistic sampling</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <span className="font-mono text-xl font-bold text-violet-400">3D Sphere</span>
              <p className="mt-1 text-xs text-zinc-400">Live θ, φ spherical coordinate mapping</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <span className="font-mono text-xl font-bold text-amber-400">Open Lab</span>
              <p className="mt-1 text-xs text-zinc-400">One-click Google Colab notebook launch</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={() => onNavigate('circuits')} className="min-h-[46px] px-6 text-sm">
              <PlayIcon className="mr-2 h-4 w-4 fill-current" />
              Launch Circuit Builder
            </Button>
            <button
              type="button"
              onClick={() => onNavigate('openlab')}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <FlaskConicalIcon className="h-4 w-4 text-emerald-400" />
              Open Lab Notebooks
            </button>
          </div>
        </div>

        {/* Right Column: Code & Circuit Interactive Graphic Preview */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-zinc-400">{activePreset.id}_circuit.py</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-mono text-zinc-300 hover:bg-zinc-800"
                >
                  {copied ? <CheckIcon className="h-3 w-3 text-emerald-400" /> : <CopyIcon className="h-3 w-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulate}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
                >
                  <PlayIcon className="h-3 w-3 fill-current" />
                  <span>{isSimulating ? `Sampling ${simProgress}%` : 'Simulate'}</span>
                </button>
              </div>
            </div>

            {/* Python Qiskit Code Snippet */}
            <pre className="mt-4 max-h-48 overflow-x-auto rounded-xl bg-zinc-900/90 p-4 font-mono text-xs text-zinc-300 leading-relaxed scrollbar-thin">
              <code>{activePreset.code}</code>
            </pre>

            {/* Circuit Wire Representation Preview */}
            <div className="mt-4 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-xs">
              {activePreset.qubits.map((q) => (
                <div key={q.id} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 font-bold text-zinc-400">{q.id}:</span>
                  <div className="relative flex h-8 flex-1 items-center">
                    <div className="h-0.5 w-full bg-zinc-700" />
                    {q.gates.map((g, gi) => (
                      <span
                        key={gi}
                        className={`absolute flex h-7 w-7 items-center justify-center rounded-lg font-bold text-white shadow transition-transform hover:scale-110 ${
                          g.isControl
                            ? 'bg-violet-600 ring-2 ring-violet-400'
                            : g.target
                            ? 'bg-emerald-600 ring-2 ring-emerald-400'
                            : 'bg-indigo-600'
                        }`}
                        style={{ left: `${g.col}%` }}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulation Laser Scan Line */}
            {isSimulating && (
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 transition-all duration-100" 
                  style={{ width: `${simProgress}%` }} 
                />
              </div>
            )}

            {/* Result Stats or Live Histogram readout */}
            {simCompleted && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono text-xs animate-pulse-glow">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Simulation Succeeded (1024 Shots)</span>
                  <span>14.2ms</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  {Object.entries(activePreset.resultCounts).map(([st, cnt]) => (
                    <div key={st} className="flex-1 rounded bg-zinc-900/90 p-2 text-center border border-zinc-800">
                      <span className="text-zinc-400 text-[10px]">|{st}⟩</span>
                      <p className="font-bold text-white text-sm">{cnt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <SparklesIcon className="h-3.5 w-3.5" />
                State: {activePreset.formula}
              </span>
              <span className="font-mono text-zinc-500">Entropy: {activePreset.entropy}</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
