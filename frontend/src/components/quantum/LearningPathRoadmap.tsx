import React, { useState } from 'react';
import { 
  CheckCircle2Icon, 
  CircleDotIcon, 
  LockIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  GitForkIcon,
  LayersIcon,
  CompassIcon,
  CpuIcon,
  ZapIcon,
  BookOpenIcon,
  PlayIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ViewId } from '../../data/appData';

interface LearningPathRoadmapProps {
  onNavigate: (view: ViewId) => void;
}

interface PathNode {
  id: string;
  title: string;
  stage: string;
  status: 'mastered' | 'active' | 'next' | 'locked';
  masteryPct: number;
  formula: string;
  description: string;
  targetView: ViewId;
  concepts: string[];
  icon: typeof CompassIcon;
}

const ROADMAP_NODES: PathNode[] = [
  {
    id: 'math-foundations',
    stage: 'Tier 1 • Foundations',
    title: 'Linear Algebra & Vectors',
    status: 'mastered',
    masteryPct: 100,
    formula: '|ψ⟩ = c_0|0⟩ + c_1|1⟩,  ⟨ψ|ψ⟩ = 1',
    description: 'Master inner products, vector spaces, complex vector normalization, and Dirac bra-ket notation fundamentals required for Hilbert space representations.',
    targetView: 'lesson',
    concepts: ['Vector Spaces & Norms', 'Complex Conjugates', 'Orthogonality & Basis', 'Dirac Bra-Ket Notation'],
    icon: CompassIcon,
  },
  {
    id: 'quantum-basics',
    stage: 'Tier 2 • Quantum Basics',
    title: 'State Vectors & Qubits',
    status: 'mastered',
    masteryPct: 92,
    formula: '|ψ⟩ = α|0⟩ + β|1⟩,  |α|² + |β|² = 1',
    description: 'Explore the quantum superposition principle, physical qubit representations, measurement collapse via Born Rule, and 3D Bloch sphere projections.',
    targetView: 'lesson',
    concepts: ['Qubit Basis |0⟩ & |1⟩', 'Superposition Coherence', 'Bloch Sphere (θ, φ)', 'Measurement Probabilities'],
    icon: LayersIcon,
  },
  {
    id: 'circuits',
    stage: 'Tier 3 • Circuit Operations',
    title: 'Unitary Quantum Gates',
    status: 'active',
    masteryPct: 78,
    formula: 'CNOT = |0⟩⟨0|⊗I + |1⟩⟨1|⊗X',
    description: 'Construct single and multi-qubit circuits with Pauli matrices, Hadamard transformations, Phase rotations, and CNOT entanglement gates.',
    targetView: 'circuits',
    concepts: ['Pauli X, Y, Z Gates', 'Hadamard (H) Transformation', 'Phase Gates (S & T)', 'CNOT & Bell State Creation'],
    icon: CpuIcon,
  },
  {
    id: 'algorithms',
    stage: 'Tier 4 • Speedup Algorithms',
    title: 'Quantum Algorithms',
    status: 'next',
    masteryPct: 20,
    formula: 'G = (2|s⟩⟨s| - I) O_w',
    description: 'Analyze quantum speedup algorithms including phase kickback, the Deutsch-Jozsa oracle, Grover search amplitude amplification, and quantum teleportation.',
    targetView: 'circuits',
    concepts: ['Quantum Phase Kickback', 'Deutsch-Jozsa Oracle', "Grover's Search Algorithm", 'Quantum Teleportation Protocol'],
    icon: SparklesIcon,
  },
  {
    id: 'practical',
    stage: 'Tier 5 • Applications',
    title: 'Hardware & Qiskit Systems',
    status: 'locked',
    masteryPct: 0,
    formula: 'OpenQASM 2.0 \\to Qiskit Aer',
    description: 'Deploy real-world circuits via Python Qiskit, simulate hardware decoherence (T1/T2 times), and implement BB84 quantum key distribution.',
    targetView: 'openlab',
    concepts: ['Qiskit Aer Monte Carlo', 'OpenQASM Compilation', 'Decoherence & Gate Errors', 'BB84 Quantum Cryptography'],
    icon: ZapIcon,
  },
];

export function LearningPathRoadmap({ onNavigate }: LearningPathRoadmapProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('circuits');
  const activeNode = ROADMAP_NODES.find((n) => n.id === selectedNodeId) || ROADMAP_NODES[2];

  return (
    <div className="w-full">
      {/* Interactive Node Cards in Light Theme */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ROADMAP_NODES.map((node) => {
          const Icon = node.icon;
          const isMastered = node.status === 'mastered';
          const isActive = node.status === 'active';
          const isNext = node.status === 'next';
          const isLocked = node.status === 'locked';
          const isSelected = selectedNodeId === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-[#4c1d70] bg-purple-50/50 shadow-md ring-2 ring-[#4c1d70]/30 scale-[1.02]'
                  : isActive
                  ? 'border-[#4c1d70] bg-white shadow-sm'
                  : isMastered
                  ? 'border-slate-200 bg-white hover:border-slate-300'
                  : isNext
                  ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div>
                {/* Node Status Chip */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    {node.stage.split('•')[0]}
                  </span>
                  {isMastered && <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />}
                  {isActive && <CircleDotIcon className="h-4 w-4 text-[#4c1d70] animate-pulse" />}
                  {isNext && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">Next</span>}
                  {isLocked && <LockIcon className="h-3.5 w-3.5 text-zinc-400" />}
                </div>

                {/* Title */}
                <div className="mt-4 flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      isSelected || isActive
                        ? 'bg-[#4c1d70] text-white shadow'
                        : isMastered
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-zinc-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#1e0a2e] leading-tight">{node.title}</h4>
                </div>

                {/* Mastery Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Mastery</span>
                    <span className={isActive ? 'text-[#4c1d70] font-bold' : isMastered ? 'text-emerald-700 font-bold' : 'text-zinc-500'}>
                      {node.masteryPct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isActive ? 'bg-[#4c1d70]' : isMastered ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${node.masteryPct}%` }}
                    />
                  </div>
                </div>

                {/* Micro Concept Badges */}
                <div className="mt-4 space-y-1">
                  {node.concepts.slice(0, 2).map((c) => (
                    <div key={c} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                      <span className="h-1 w-1 rounded-full bg-zinc-400" />
                      <span className="truncate">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold text-[#4c1d70]">
                {isSelected ? '● Selected Tier' : 'Click to Inspect'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep Inspector Drawer Card */}
      {activeNode && (
        <div className="mt-8 rounded-2xl border border-purple-200 bg-white p-6 shadow-md transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-[#4c1d70]">
                <activeNode.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#4c1d70]">{activeNode.stage}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                    Mastery: {activeNode.masteryPct}%
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1e0a2e]">{activeNode.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono text-xs text-zinc-700">
                {activeNode.formula}
              </div>
              <Button
                disabled={activeNode.status === 'locked'}
                onClick={() => onNavigate(activeNode.targetView)}
                className="min-h-[42px] px-5 text-xs font-bold bg-[#4c1d70] text-white hover:bg-[#391555] shadow-sm rounded-full"
              >
                <PlayIcon className="mr-1.5 h-3.5 w-3.5 fill-current" />
                Launch {activeNode.title.split(' ')[0]}
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-sm leading-relaxed text-zinc-600">{activeNode.description}</p>
            </div>
            <div className="md:col-span-5">
              <span className="text-xs font-mono font-bold uppercase text-zinc-700">Micro-Skill Prerequisites:</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {activeNode.concepts.map((concept) => (
                  <div key={concept} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs text-zinc-700 border border-slate-200">
                    <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{concept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
