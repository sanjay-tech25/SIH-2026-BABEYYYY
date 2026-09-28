import React, { useState, useEffect, useRef } from 'react';
import { PageMascot } from '../components/quantum/PageMascot';
import { GeniePresence } from '../components/ui/GenieMotion';
import {
  PlayIcon,
  RotateCcwIcon,
  CpuIcon,
  SparklesIcon,
  LayersIcon,
  CodeIcon,
  CheckIcon,
  CopyIcon,
  Trash2Icon,
  ZapIcon,
  ExternalLinkIcon,
  AtomIcon,
  CompassIcon,
  ArrowRightIcon,
  BookmarkIcon,
  ActivityIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  ListFilterIcon,
  GripVerticalIcon,
  TrophyIcon,
  CheckCircle2Icon,
  TargetIcon,
  HelpCircleIcon,
  GlassesIcon,
  BrainIcon,
  ShieldCheckIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  apiClient,
  type PredictionResult,
  type DigitalTwinResult,
  type MisconceptionDiagnostic,
  type QuantumDiagnosticError
} from '../services/apiClient';
import { BlochSphere3D } from '../components/quantum/BlochSphere3D';
import { ARVRQuantumViewer } from '../components/quantum/ARVRQuantumViewer';
import { HistogramChart } from '../components/quantum/HistogramChart';
import { StatevectorChart } from '../components/quantum/StatevectorChart';
import { QSphere } from '../components/quantum/QSphere';
import { audioEngine } from '../services/audioEngine';
import { QuantumCodeViewer } from '../components/quantum/QuantumCodeViewer';
import { QuantumCodeGenerator, FRAMEWORKS, type QuantumFramework } from '../services/quantumCodeGenerator';
import { simulateCircuit, type SimulationOutput } from '../utils/quantumEngine';

type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'RX' | 'RY' | 'RZ' | 'CX' | 'CNOT' | 'CZ' | 'SWAP' | 'CCX' | 'M' | 'MEASURE';

interface PlacedGate {
  step: number;
  qubit: number;
  type: GateType;
  control?: number;
  target2?: number; // for SWAP
}

interface PresetItem {
  id: string;
  name: string;
  formula: string;
  desc: string;
  category: 'Foundation' | 'Entanglement' | 'Algorithms' | 'Protocols';
  badgeColor: string;
  numQubits: number;
  gates: PlacedGate[];
}

const ALL_GATES: {
  type: GateType;
  label: string;
  desc: string;
  category: 'Basic' | 'Phase & Rotations' | 'Multi-Qubit' | 'Measurement';
  color: string;
  border: string;
  glow: string
}[] = [
  // 1. Single Qubit Basic
  { type: 'H', label: 'H', desc: 'Hadamard: Creates equal superposition (|0⟩ ➜ |+⟩)', category: 'Basic', color: 'bg-indigo-600', border: 'border-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' },
  { type: 'X', label: 'X', desc: 'Pauli-X: Bit flip NOT (|0⟩ ➜ |1⟩)', category: 'Basic', color: 'bg-emerald-600', border: 'border-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  { type: 'Y', label: 'Y', desc: 'Pauli-Y: Bit + phase rotation around Y-axis', category: 'Basic', color: 'bg-teal-600', border: 'border-teal-400', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)]' },
  { type: 'Z', label: 'Z', desc: 'Pauli-Z: Phase flip (|1⟩ ➜ -|1⟩)', category: 'Basic', color: 'bg-sky-600', border: 'border-sky-400', glow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]' },

  // 2. Phase & Rotations
  { type: 'S', label: 'S', desc: 'Phase S: 90° (π/2) rotation around Z-axis', category: 'Phase & Rotations', color: 'bg-cyan-600', border: 'border-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]' },
  { type: 'T', label: 'T', desc: 'T Gate: 45° (π/4) phase rotation around Z', category: 'Phase & Rotations', color: 'bg-blue-600', border: 'border-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
  { type: 'RX', label: 'Rx', desc: 'Rotation-X: π/2 rotation about X-axis', category: 'Phase & Rotations', color: 'bg-amber-600', border: 'border-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  { type: 'RY', label: 'Ry', desc: 'Rotation-Y: π/2 rotation about Y-axis', category: 'Phase & Rotations', color: 'bg-orange-600', border: 'border-orange-400', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
  { type: 'RZ', label: 'Rz', desc: 'Rotation-Z: π/2 rotation about Z-axis', category: 'Phase & Rotations', color: 'bg-rose-600', border: 'border-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]' },

  // 3. Multi-Qubit Entanglement
  { type: 'CX', label: 'CX', desc: 'CNOT: Controlled-NOT for quantum entanglement', category: 'Multi-Qubit', color: 'bg-violet-600', border: 'border-violet-400', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]' },
  { type: 'CNOT', label: 'CNOT', desc: 'Controlled-NOT: Entangles control and target qubits', category: 'Multi-Qubit', color: 'bg-violet-700', border: 'border-violet-300', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]' },
  { type: 'CZ', label: 'CZ', desc: 'Controlled-Z: Flips phase if control is |1⟩', category: 'Multi-Qubit', color: 'bg-purple-600', border: 'border-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
  { type: 'SWAP', label: 'SW', desc: 'SWAP: Exchanges the states of two qubits', category: 'Multi-Qubit', color: 'bg-fuchsia-600', border: 'border-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]' },
  { type: 'CCX', label: 'CCX', desc: 'Toffoli: 3-qubit Controlled-Controlled-NOT gate', category: 'Multi-Qubit', color: 'bg-pink-600', border: 'border-pink-400', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]' },

  // 4. Measurement
  { type: 'M', label: 'M', desc: 'Measurement: Projects quantum state into classical basis (|0⟩ or |1⟩)', category: 'Measurement', color: 'bg-emerald-700', border: 'border-emerald-300', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
];

const PRESETS: PresetItem[] = [
  {
    id: 'bell',
    name: 'Bell State (|Φ+⟩)',
    formula: '(|00⟩ + |11⟩) / √2',
    desc: 'The fundamental entangled 2-qubit Einstein-Podolsky-Rosen (EPR) pair with maximal correlation.',
    category: 'Entanglement',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 0, type: 'H' },
      { step: 1, qubit: 1, type: 'CX', control: 0 },
    ],
  },
  {
    id: 'superposition',
    name: 'Dual Superposition',
    formula: '(|00⟩ + |01⟩ + |10⟩ + |11⟩) / 2',
    desc: 'Two independent Hadamard gates putting both qubits into an equal 4-state quantum superposition.',
    category: 'Foundation',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 0, type: 'H' },
      { step: 0, qubit: 1, type: 'H' },
    ],
  },
  {
    id: 'ghz',
    name: '3-Qubit GHZ State',
    formula: '(|000⟩ + |111⟩) / √2',
    desc: 'Greenberger-Horne-Zeilinger tripartite entanglement across 3 connected quantum registers.',
    category: 'Entanglement',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    numQubits: 3,
    gates: [
      { step: 0, qubit: 0, type: 'H' },
      { step: 1, qubit: 1, type: 'CX', control: 0 },
      { step: 2, qubit: 2, type: 'CX', control: 1 },
    ],
  },
  {
    id: 'grover',
    name: "Grover's Search (2-Qubit)",
    formula: 'Amplitude Amplification (|11⟩)',
    desc: 'Quantum search algorithm utilizing phase inversion oracle and diffusion to amplify target item |11⟩.',
    category: 'Algorithms',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 0, type: 'H' },
      { step: 0, qubit: 1, type: 'H' },
      { step: 1, qubit: 1, type: 'CZ', control: 0 }, // Oracle marking |11>
      { step: 2, qubit: 0, type: 'H' },
      { step: 2, qubit: 1, type: 'H' },
      { step: 3, qubit: 0, type: 'X' },
      { step: 3, qubit: 1, type: 'X' },
      { step: 4, qubit: 1, type: 'CZ', control: 0 },
      { step: 5, qubit: 0, type: 'X' },
      { step: 5, qubit: 1, type: 'X' },
      { step: 6, qubit: 0, type: 'H' },
      { step: 6, qubit: 1, type: 'H' },
    ],
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation',
    formula: '|ψ⟩ ➜ Alice ➜ Bob',
    desc: 'Transfers an unknown qubit state |ψ⟩ from qubit 0 to qubit 2 using shared Bell pair entanglement.',
    category: 'Protocols',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    numQubits: 3,
    gates: [
      { step: 0, qubit: 0, type: 'X' }, // Prepare test state |1>
      { step: 1, qubit: 1, type: 'H' }, // Create Bell Pair on q1, q2
      { step: 2, qubit: 2, type: 'CX', control: 1 },
      { step: 3, qubit: 1, type: 'CX', control: 0 }, // Alice Bell measurement
      { step: 4, qubit: 0, type: 'H' },
      { step: 5, qubit: 2, type: 'CX', control: 1 }, // Bob corrections
      { step: 6, qubit: 2, type: 'CZ', control: 0 },
    ],
  },
  {
    id: 'deutsch',
    name: 'Deutsch-Jozsa Algorithm',
    formula: 'Balanced Oracle Evaluation',
    desc: 'Determines whether an unknown black-box boolean function is constant or balanced in a single evaluation.',
    category: 'Algorithms',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 1, type: 'X' }, // Prep |1> on ancilla
      { step: 1, qubit: 0, type: 'H' },
      { step: 1, qubit: 1, type: 'H' },
      { step: 2, qubit: 1, type: 'CX', control: 0 }, // Balanced oracle
      { step: 3, qubit: 0, type: 'H' },
    ],
  },
  {
    id: 'swap_test',
    name: 'Qubit State Swap',
    formula: 'q[0] ⇄ q[1] SWAP',
    desc: 'Demonstrates quantum state transfer and exchange using the dedicated SWAP gate between registers.',
    category: 'Protocols',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 0, type: 'X' }, // q0 is |1>, q1 is |0>
      { step: 1, qubit: 1, type: 'SWAP', control: 0 },
    ],
  },
  {
    id: 'phase_kickback',
    name: 'Quantum Phase Kickback',
    formula: 'Eigenvalue Phase Transfer',
    desc: 'Demonstrates the core quantum phenomenon where applying a controlled gate kicks the phase back onto the control qubit.',
    category: 'Foundation',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    numQubits: 2,
    gates: [
      { step: 0, qubit: 0, type: 'H' },
      { step: 0, qubit: 1, type: 'X' },
      { step: 1, qubit: 1, type: 'H' },
      { step: 2, qubit: 1, type: 'CX', control: 0 }, // Kickback
      { step: 3, qubit: 0, type: 'H' },
    ],
  },
];

interface TargetChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  numQubits: number;
  goalState: string;
  goalSummary: string;
  hint: string;
  check: (output: SimulationOutput) => boolean;
}

const TARGET_CHALLENGES: TargetChallenge[] = [
  {
    id: 'superposition',
    title: '1. Equal Superposition (|+⟩)',
    difficulty: 'Easy',
    numQubits: 1,
    goalState: '1/√2 |0⟩ + 1/√2 |1⟩',
    goalSummary: 'Equal 50% / 50% measurement probability across |0⟩ and |1⟩',
    hint: 'Drag the [H] (Hadamard) gate from the palette onto wire q[0].',
    check: (out: SimulationOutput) => {
      if (out.dim !== 2) return false;
      const p0 = out.probabilities.find((p) => p.stateStr === '0')?.prob || 0;
      const p1 = out.probabilities.find((p) => p.stateStr === '1')?.prob || 0;
      return Math.abs(p0 - 0.5) < 0.05 && Math.abs(p1 - 0.5) < 0.05;
    },
  },
  {
    id: 'bitflip',
    title: '2. Ground Bit Flip (|1⟩)',
    difficulty: 'Easy',
    numQubits: 1,
    goalState: '1.000 |1⟩',
    goalSummary: 'Deterministic 100% measurement probability in excited state |1⟩',
    hint: 'Drag the [X] (Pauli-X NOT) gate from the palette onto wire q[0].',
    check: (out: SimulationOutput) => {
      if (out.dim !== 2) return false;
      const p1 = out.probabilities.find((p) => p.stateStr === '1')?.prob || 0;
      return p1 > 0.95;
    },
  },
  {
    id: 'bell',
    title: '3. Bell State Entanglement (|Φ+⟩)',
    difficulty: 'Medium',
    numQubits: 2,
    goalState: '1/√2 |00⟩ + 1/√2 |11⟩',
    goalSummary: 'Maximally entangled 2-qubit EPR pair with perfect measurement correlation',
    hint: 'Drag [H] onto wire q[0] at t[0], then drag [CX] onto wire q[1] at t[1].',
    check: (out: SimulationOutput) => {
      if (out.dim !== 4) return false;
      const p00 = out.probabilities.find((p) => p.stateStr === '00')?.prob || 0;
      const p11 = out.probabilities.find((p) => p.stateStr === '11')?.prob || 0;
      return Math.abs(p00 - 0.5) < 0.05 && Math.abs(p11 - 0.5) < 0.05;
    },
  },
  {
    id: 'phaseflip',
    title: '4. Phase Flip Superposition (|-⟩)',
    difficulty: 'Medium',
    numQubits: 1,
    goalState: '1/√2 |0⟩ - 1/√2 |1⟩',
    goalSummary: 'Superposition with a relative π (180°) phase inversion on |1⟩',
    hint: 'Drag [H] to create superposition, then drag [Z] onto wire q[0] to invert the relative phase.',
    check: (out: SimulationOutput) => {
      if (out.dim !== 2) return false;
      const p0 = out.probabilities.find((p) => p.stateStr === '0')?.prob || 0;
      const p1 = out.probabilities.find((p) => p.stateStr === '1')?.prob || 0;
      const hasMinus = out.diracNotation.includes('-');
      return Math.abs(p0 - 0.5) < 0.05 && Math.abs(p1 - 0.5) < 0.05 && hasMinus;
    },
  },
  {
    id: 'swap',
    title: '5. Quantum State Exchange (|01⟩)',
    difficulty: 'Hard',
    numQubits: 2,
    goalState: '1.000 |01⟩',
    goalSummary: 'Flip q[0] to |1⟩, then exchange states between q[0] and q[1] via SWAP gate',
    hint: 'Drag [X] onto wire q[0] at t[0], then drag [SWAP] onto wire q[1] at t[1].',
    check: (out: SimulationOutput) => {
      if (out.dim !== 4) return false;
      const p01 = out.probabilities.find((p) => p.stateStr === '01')?.prob || 0;
      return p01 > 0.95;
    },
  },
];

export function CircuitBuilder() {
  const [numQubits, setNumQubits] = useState(2);
  const [selectedGate, setSelectedGate] = useState<GateType>('H');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Basic' | 'Phase & Rotations' | 'Multi-Qubit' | 'Measurement'>('All');
  const [activePresetId, setActivePresetId] = useState<string>('bell');
  const [gates, setGates] = useState<PlacedGate[]>([
    { step: 0, qubit: 0, type: 'H' },
    { step: 1, qubit: 1, type: 'CX', control: 0 },
  ]);
  const [shots, setShots] = useState(1024);
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [colabLoading, setColabLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const presetTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [arSpatialOpen, setArSpatialOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Multi-Framework and Socratic Innovation State
  const [selectedFramework, setSelectedFramework] = useState<QuantumFramework>('qiskit');
  const [editedCode, setEditedCode] = useState<string>('');
  const [explainResultData, setExplainResultData] = useState<{ analysis: string; dominant_states: string[]; entropy: string } | null>(null);
  const [explainCircuitData, setExplainCircuitData] = useState<{ summary: string; step_by_step: string[] } | null>(null);
  const [explainingResult, setExplainingResult] = useState(false);
  const [explainingCircuit, setExplainingCircuit] = useState(false);

  // Quantum Innovations Diagnostics State
  const [predictedDistribution, setPredictedDistribution] = useState<Record<string, number>>({ '00': 0.5, '11': 0.5 });
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [digitalTwinResult, setDigitalTwinResult] = useState<DigitalTwinResult | null>(null);
  const [misconceptions, setMisconceptions] = useState<MisconceptionDiagnostic[]>([]);
  const [quantumErrors, setQuantumErrors] = useState<QuantumDiagnosticError[]>([]);
  const [evaluatingInnovation, setEvaluatingInnovation] = useState(false);
  const [analyzingErrors, setAnalyzingErrors] = useState(false);
  const [showInnovationSuite, setShowInnovationSuite] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<'histogram' | 'bloch' | 'qsphere' | 'statevector'>('histogram');

  // Drag & drop interactive state
  const [draggingGate, setDraggingGate] = useState<GateType | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ qubit: number; step: number } | null>(null);
  const [draggedPlacedGate, setDraggedPlacedGate] = useState<{ fromQubit: number; fromStep: number; gateType: GateType } | null>(null);
  const [lastDroppedCell, setLastDroppedCell] = useState<{ qubit: number; step: number; time: number } | null>(null);

  // Audio haptic feedback on gate snap (Web Audio Micro-Cue Engine)
  const playQuantumDropSound = () => {
    audioEngine.playGateSnap();
  };

  // Custom high-tech glowing drag ghost
  const createCustomDragGhost = (gateType: GateType) => {
    const gateInfo = ALL_GATES.find((g) => g.type === gateType);
    const ghost = document.createElement('div');
    ghost.id = 'quantum-drag-ghost';
    ghost.style.position = 'fixed';
    ghost.style.top = '-9999px';
    ghost.style.left = '-9999px';
    ghost.style.zIndex = '99999';
    ghost.style.pointerEvents = 'none';
    ghost.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: ${
          gateInfo?.type === 'H' ? '#4f46e5' :
          gateInfo?.type === 'X' ? '#059669' :
          gateInfo?.type === 'CX' ? '#7c3aed' :
          gateInfo?.type === 'CZ' ? '#9333ea' :
          gateInfo?.type === 'SWAP' ? '#c026d3' : '#4c1d70'
        };
        color: #ffffff;
        font-family: ui-monospace, monospace;
        font-weight: 900;
        font-size: 18px;
        border: 2px solid #f5d626;
        box-shadow: 0 0 28px rgba(245, 214, 38, 0.85), 0 8px 25px rgba(0, 0, 0, 0.7);
        transform: scale(1.08) rotate(-4deg);
      ">
        ${gateType === 'CX' ? '⊕' : gateType === 'CZ' ? '●' : gateType}
      </div>
    `;
    document.body.appendChild(ghost);
    return ghost;
  };

  // Live Answer & Challenge state
  const [answerMode, setAnswerMode] = useState<'freeform' | 'challenge'>('freeform');
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [liveOutput, setLiveOutput] = useState<SimulationOutput>(() =>
    simulateCircuit(numQubits, gates, shots)
  );
  const [simResult, setSimResult] = useState<any>(() => ({
    backend: 'Qiskit Aer (Live Engine)',
    shots: 1024,
    execution_time_ms: 0.1,
    counts: simulateCircuit(2, [
      { step: 0, qubit: 0, type: 'H' },
      { step: 1, qubit: 1, type: 'CX', control: 0 },
    ], 1024).counts,
    bloch_vectors: simulateCircuit(2, [
      { step: 0, qubit: 0, type: 'H' },
      { step: 1, qubit: 1, type: 'CX', control: 0 },
    ], 1024).blochVectors,
    xp_earned: 60,
  }));

  const numSteps = 7;

  // Real-time Wavefunction & Answer update on every gate drag & drop / change
  useEffect(() => {
    const output = simulateCircuit(numQubits, gates, shots);
    setLiveOutput(output);
    setSimResult({
      backend: 'Qiskit Aer (Live Engine)',
      shots,
      execution_time_ms: 0.1,
      counts: output.counts,
      bloch_vectors: output.blochVectors,
      xp_earned: 60,
    });
  }, [numQubits, gates, shots]);

  useEffect(() => {
    (window as any).__qubotSetDragState = (gate: GateType | null, cell: { qubit: number; step: number } | null) => {
      setDraggingGate(gate);
      setDragOverCell(cell);
    };
    (window as any).__qubotPlaceGate = (qubit: number, step: number, type: GateType) => {
      placeGateAt(qubit, step, type);
    };
  });

  const currentChallenge = TARGET_CHALLENGES[activeChallengeIdx];
  const isChallengeSolved = currentChallenge.check(liveOutput);

  const placeGateAt = (qubit: number, step: number, gateType: GateType) => {
    const filtered = gates.filter((g) => !(g.qubit === qubit && g.step === step));
    let newGate: PlacedGate;

    if (gateType === 'CX' || gateType === 'CZ' || gateType === 'SWAP') {
      const control = qubit === 0 ? 1 : 0;
      newGate = { step, qubit, type: gateType, control };
    } else {
      newGate = { step, qubit, type: gateType };
    }

    setGates([...filtered, newGate]);
    setLastDroppedCell({ qubit, step, time: Date.now() });
    playQuantumDropSound();
    setToastMessage(`⚡ Placed [${gateType}] at q[${qubit}], t[${step}] — Answer updated!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const moveGate = (fromQubit: number, fromStep: number, toQubit: number, toStep: number) => {
    const gateToMove = gates.find((g) => g.qubit === fromQubit && g.step === fromStep);
    if (!gateToMove) return;

    const filtered = gates.filter(
      (g) => !(g.qubit === fromQubit && g.step === fromStep) && !(g.qubit === toQubit && g.step === toStep)
    );

    let movedGate: PlacedGate;
    if (gateToMove.type === 'CX' || gateToMove.type === 'CZ' || gateToMove.type === 'SWAP') {
      const control = toQubit === 0 ? 1 : 0;
      movedGate = { step: toStep, qubit: toQubit, type: gateToMove.type, control };
    } else {
      movedGate = { step: toStep, qubit: toQubit, type: gateToMove.type };
    }

    setGates([...filtered, movedGate]);
    setLastDroppedCell({ qubit: toQubit, step: toStep, time: Date.now() });
    playQuantumDropSound();
    setToastMessage(`🔄 Moved [${gateToMove.type}] to q[${toQubit}], t[${toStep}] — Answer updated!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const selectChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    setNumQubits(TARGET_CHALLENGES[idx].numQubits);
    setGates([]);
    setAnswerMode('challenge');
    setToastMessage(`🎯 Loaded Challenge: ${TARGET_CHALLENGES[idx].title}`);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleCellClick = (qubit: number, step: number) => {
    const existingIndex = gates.findIndex((g) => g.qubit === qubit && g.step === step);
    if (existingIndex >= 0) {
      setGates(gates.filter((_, idx) => idx !== existingIndex));
      return;
    }
    placeGateAt(qubit, step, selectedGate);
  };

  const loadPreset = (preset: PresetItem) => {
    setActivePresetId(preset.id);
    setNumQubits(preset.numQubits);
    setGates(preset.gates);
    setSimResult(null);
    setDropdownOpen(false);
    setToastMessage(`Dropped preset "${preset.name}" into circuit (${preset.numQubits} Qubits, ${preset.gates.length} Gates)`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const clearCircuit = () => {
    setActivePresetId('');
    setGates([]);
    setSimResult(null);
    setToastMessage('Cleared all gates from circuit wires');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const formattedGates = gates.map((g) => ({
        type: g.type,
        targets: [g.qubit],
        controls: g.control !== undefined ? [g.control] : undefined,
      }));

      const circuitJson = {
        num_qubits: numQubits,
        gates: formattedGates,
      };

      const result = await apiClient.executeCircuit(circuitJson, shots);
      setTimeout(() => {
        setSimResult(result);
        setSimulating(false);
        audioEngine.playSuccessChord();
      }, 850);
    } catch (err) {
      console.error('Simulation error:', err);
      audioEngine.playSyntaxErrorDissonance();
      setSimulating(false);
    }
  };

  const generateFrameworkCode = (fw: QuantumFramework) => {
    const formattedGates = gates.map((g) => ({
      qubit: g.qubit,
      type: g.type,
      control: g.control,
      target2: g.target2,
      step: g.step
    }));
    return QuantumCodeGenerator.generate(fw, numQubits, formattedGates, shots);
  };

  const openInColab = async () => {
    setColabLoading(true);
    try {
      const url = await apiClient.getColabLink(activePresetId || 'superposition-basics');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open('https://colab.research.google.com/github/google/qsim/blob/master/docs/tutorials/intro_quantum.ipynb', '_blank');
    } finally {
      setColabLoading(false);
    }
  };

  const handleExplainResult = async () => {
    if (!simResult?.counts) return;
    setExplainingResult(true);
    try {
      const circuitJson = {
        num_qubits: numQubits,
        gates: gates.map((g) => ({ type: g.type, qubit: g.qubit, control: g.control })),
      };
      const res = await apiClient.explainResult(circuitJson, simResult.counts, shots);
      setExplainResultData(res);
    } catch {
      setExplainResultData({
        analysis: 'The measured distribution reflects Born rule probabilities from the final state vector.',
        dominant_states: Object.keys(simResult?.counts || {}).slice(0, 2),
        entropy: Object.keys(simResult?.counts || {}).length > 2 ? 'high' : 'low'
      });
    } finally {
      setExplainingResult(false);
    }
  };

  const handleExplainCircuit = async () => {
    setExplainingCircuit(true);
    try {
      const circuitJson = {
        num_qubits: numQubits,
        gates: gates.map((g) => ({ type: g.type, qubit: g.qubit, control: g.control })),
      };
      const res = await apiClient.explainCircuit(circuitJson);
      setExplainCircuitData(res);
    } catch {
      setExplainCircuitData({
        summary: 'This circuit applies quantum unitary gates to manipulate state vectors and relative phases.',
        step_by_step: ['State initialization to |0⟩', 'Unitary transformation applied', 'Measurement projection onto computational basis']
      });
    } finally {
      setExplainingCircuit(false);
    }
  };

  const handleEvaluatePedagogy = async () => {
    setEvaluatingInnovation(true);
    try {
      const counts = simResult?.counts || {};
      const total = Object.values(counts).reduce((a: number, b: any) => a + Number(b), 0) || 1;
      const actualDistribution: Record<string, number> = {};
      Object.entries(counts).forEach(([k, v]) => {
        actualDistribution[k] = Number((Number(v) / total).toFixed(3));
      });

      // 1. Evaluate Prediction & XP Bonus
      const predRes = await apiClient.evaluatePrediction(predictedDistribution, actualDistribution);
      setPredictionResult(predRes);

      // 2. Evaluate Digital Twin (Cognitive Calibration Index)
      const twinRes = await apiClient.evaluateDigitalTwin(predictedDistribution, actualDistribution);
      setDigitalTwinResult(twinRes);

      // 3. Evaluate Quantum Misconceptions (MC-01 to MC-10)
      const formattedGates = gates.map((g) => ({
        type: g.type,
        qubit: g.qubit,
        control: g.control,
        step: g.step,
      }));
      const miscRes = await apiClient.evaluateMisconceptions(formattedGates, predictedDistribution, actualDistribution);
      setMisconceptions(miscRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingInnovation(false);
    }
  };

  const handleAnalyzeErrors = async () => {
    setAnalyzingErrors(true);
    try {
      const circuitJson = {
        num_qubits: numQubits,
        gates: gates.map((g) => ({ type: g.type, qubit: g.qubit, control: g.control, step: g.step })),
      };
      const errors = await apiClient.analyzeErrors(circuitJson, activePresetId || 'Custom Circuit', predictionResult?.divergence_score);
      setQuantumErrors(errors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingErrors(false);
    }
  };

  const generateQiskitCode = () => {
    let code = `from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\nimport numpy as np\n\n`;
    code += `# Initialize ${numQubits}-qubit quantum circuit\n`;
    code += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;

    const sorted = [...gates].sort((a, b) => a.step - b.step);
    sorted.forEach((g) => {
      const q = g.qubit;
      const c = g.control ?? (q === 0 ? 1 : 0);
      if (g.type === 'H') code += `qc.h(${q})\n`;
      else if (g.type === 'X') code += `qc.x(${q})\n`;
      else if (g.type === 'Y') code += `qc.y(${q})\n`;
      else if (g.type === 'Z') code += `qc.z(${q})\n`;
      else if (g.type === 'S') code += `qc.s(${q})\n`;
      else if (g.type === 'T') code += `qc.t(${q})\n`;
      else if (g.type === 'RX') code += `qc.rx(np.pi / 2, ${q})\n`;
      else if (g.type === 'RY') code += `qc.ry(np.pi / 2, ${q})\n`;
      else if (g.type === 'RZ') code += `qc.rz(np.pi / 2, ${q})\n`;
      else if (g.type === 'CX' || g.type === 'CNOT') code += `qc.cx(${c}, ${q})\n`;
      else if (g.type === 'CZ') code += `qc.cz(${c}, ${q})\n`;
      else if (g.type === 'SWAP') code += `qc.swap(${c}, ${q})\n`;
      else if (g.type === 'CCX') code += `qc.ccx(0, 1, ${q})\n`;
      else if (g.type === 'M' || g.type === 'MEASURE') code += `qc.measure(${q}, ${q})\n`;
    });

    code += `\n# Measure all qubits into classical registers\nqc.measure(range(${numQubits}), range(${numQubits}))\n\n`;
    code += `# Transpile and execute on Qiskit Aer backend\nsimulator = AerSimulator()\ncompiled_circuit = transpile(qc, simulator)\njob = simulator.run(compiled_circuit, shots=${shots})\nresult = job.result()\ncounts = result.get_counts()\nprint("Measurement Counts Distribution:", counts)\n`;
    return code;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateQiskitCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };



  const filteredGates = selectedCategory === 'All'
    ? ALL_GATES
    : ALL_GATES.filter(g => g.category === selectedCategory);

  const filteredPresets = PRESETS.filter(
    (p) =>
      p.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      p.formula.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      p.desc.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Top Editorial Header */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#f5d626] animate-pulse" />
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#4c1d70]">
                AER SIMULATOR ACTIVE • 12 QUANTUM GATES READY
              </span>
            </div>
            <h1 className="mt-2 font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
              Virtual Quantum Circuit Builder
            </h1>
            <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Inject single-qubit rotations and multi-qubit entanglement gates. Simulate quantum algorithms with real-time 3D Bloch vectors and column probability graphs.
            </p>
          </div>

          <div className="shrink-0 self-center lg:self-auto flex items-center pr-2">
            <PageMascot
              pose="builder"
              animation="float"
              size="md"
              bubblePosition="left"
              speechBubble={{
                title: "Quantum Composer",
                text: "Qiskit Aer simulator active! Drag gates onto wires to inspect wavefunction collapse.",
                badge: "Statevector Lab"
              }}
            />
          </div>
        </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* INTERACTIVE DROPDOWN LIST MENU FOR ALL PRESETS */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                ref={presetTriggerRef}
                aria-expanded={dropdownOpen}
                aria-controls="circuit-presets-menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 rounded-full bg-[#4c1d70] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#3b1458] transition-all"
              >
                <AtomIcon className="h-4 w-4 text-[#f5d626]" />
                <span>Drop Presets List ({PRESETS.length})</span>
                {dropdownOpen ? (
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                )}
              </button>

              {/* FLOATING DROPDOWN LIST PANEL */}

                <GeniePresence open={dropdownOpen} anchorRef={presetTriggerRef} origin="top" id="circuit-presets-menu" onKeyDown={(event) => { if (event.key === 'Escape') setDropdownOpen(false); }} className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[min(480px,calc(100vw-2rem))] max-h-[500px] overflow-hidden rounded-2xl border border-purple-500/40 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl z-50 flex flex-col">
                  {/* Dropdown Header */}
                  <div className="p-3.5 border-b border-purple-900/80 bg-[#3b1458] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#f5d626] animate-pulse" />
                      <span className="font-display text-sm font-bold text-white">
                        Select Preset to Drop ({PRESETS.length} Available)
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#f5d626]">Instant Load</span>
                  </div>

                  {/* Dropdown Search Bar */}
                  <div className="p-2.5 border-b border-zinc-800/80 bg-zinc-900/40">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search algorithms (Grover, GHZ, Bell, Deutsch)..."
                        value={dropdownSearch}
                        onChange={(e) => setDropdownSearch(e.target.value)}
                        className="w-full rounded-lg bg-zinc-900 border border-zinc-700/80 pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#f5d626]"
                      />
                    </div>
                  </div>

                  {/* Scrollable List Items */}
                  <div className="overflow-y-auto p-2 space-y-1.5 max-h-[340px] divide-y divide-zinc-900/60">
                    {filteredPresets.length === 0 ? (
                      <div className="p-4 text-center text-sm text-zinc-500">
                        No presets found matching "{dropdownSearch}"
                      </div>
                    ) : (
                      filteredPresets.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => loadPreset(preset)}
                            className={`w-full flex items-start justify-between p-3 rounded-xl text-left transition border ${
                              isActive
                                ? 'bg-purple-950/60 border-[#f5d626] shadow-[0_0_12px_rgba(245,214,38,0.3)]'
                                : 'bg-zinc-900/40 border-zinc-800/40 hover:bg-purple-950/30 hover:border-purple-700'
                            }`}
                          >
                            <div className="space-y-1 pr-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border ${preset.badgeColor}`}>
                                  {preset.category}
                                </span>
                                <span className="text-sm font-bold text-zinc-100">{preset.name}</span>
                                <span className="text-xs font-mono text-zinc-400">({preset.numQubits}Q)</span>
                              </div>
                              <div className="font-mono text-xs text-[#f5d626] font-semibold">{preset.formula}</div>
                              <p className="text-[13px] text-zinc-400 line-clamp-1 leading-snug">{preset.desc}</p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#f5d626]/20 px-2 py-1 text-xs font-bold text-[#f5d626] border border-[#f5d626]/40">
                                  <CheckIcon className="h-3 w-3" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs font-semibold text-[#f5d626] hover:bg-[#f5d626] hover:text-zinc-950 transition">
                                  Drop ➔
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </GeniePresence>
            </div>

            <button
              type="button"
              onClick={openInColab}
              disabled={colabLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-bold text-[#4c1d70] hover:bg-purple-100 transition shadow-sm"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5 text-[#4c1d70]" />
              {colabLoading ? 'Launching...' : 'Open in Google Colab'}
            </button>

            <button
              type="button"
              onClick={() => setArSpatialOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#f5d626]/80 bg-zinc-950 px-4 py-2.5 text-sm font-mono font-bold text-[#f5d626] shadow-[0_0_20px_rgba(245,214,38,0.25)] hover:bg-zinc-900 hover:shadow-[0_0_30px_rgba(245,214,38,0.5)] transition active:scale-95"
              title="Launch AR/VR Motion Graphics Quantum Hologram Studio"
            >
              <GlassesIcon className="h-4 w-4 text-[#f5d626] animate-pulse" />
              <span>🥽 AR/VR Spatial Studio</span>
            </button>
          </div>
      </header>

      {/* FEATURED QUANTUM PRESETS GALLERY (Unboxed Editorial Section) */}
      <section aria-labelledby="presets-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-[#4c1d70]">
              <AtomIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 id="presets-heading" className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                Quantum Algorithms & State Presets
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-mono font-bold text-[#4c1d70] border border-purple-200">
                  {PRESETS.length} Ready
                </span>
              </h2>
              <p className="font-poppins text-sm text-slate-500">Click any preset card or select from the drop list to immediately configure the circuit wires.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Dropdown List */}
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-semibold text-slate-600">Drop Preset:</label>
              <select
                value={activePresetId}
                onChange={(e) => {
                  const p = PRESETS.find(item => item.id === e.target.value);
                  if (p) loadPreset(p);
                }}
                className="rounded-full border border-[#cbb3d8] bg-purple-50/50 px-3 py-1.5 text-sm font-semibold text-[#4c1d70] focus:outline-none focus:ring-2 focus:ring-[#4c1d70]"
              >
                <option value="" disabled>-- Drop a preset into circuit --</option>
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.numQubits}Q) — {p.formula}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Dropdown / Cards View */}
            <button
              type="button"
              onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#cbb3d8] bg-purple-50 px-3.5 py-1.5 text-sm font-semibold text-[#4c1d70] hover:bg-[#4c1d70] hover:text-white transition"
            >
              {isPresetsExpanded ? (
                <>
                  <span>Collapse Cards</span>
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <span>Drop All Preset Cards</span>
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <label className="text-sm font-semibold text-slate-600">Qubits:</label>
              <select
                value={numQubits}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setNumQubits(n);
                  setGates(gates.filter((g) => g.qubit < n));
                }}
                className="rounded-full border border-[#cbb3d8] bg-purple-50 px-3 py-1.5 text-sm font-mono font-bold text-[#4c1d70] focus:outline-none focus:ring-2 focus:ring-[#4c1d70]"
              >
                <option value={1}>1 Qubit</option>
                <option value={2}>2 Qubits</option>
                <option value={3}>3 Qubits</option>
                <option value={4}>4 Qubits</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearCircuit}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Clear Wires
            </button>
          </div>
        </div>

        {/* Presets Grid Cards (Expandable / Droppable) */}

          <GeniePresence open={isPresetsExpanded} origin="top" className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className={`spring-lift relative flex flex-col justify-between rounded-2xl p-4 text-left border ${
                    isActive
                      ? 'border-purple-300 bg-purple-50/90 shadow-md ring-2 ring-[#4c1d70]/30 border-l-4 border-l-[#4c1d70]'
                      : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/40 shadow-sm border-l-4 border-l-purple-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-mono font-bold border ${preset.badgeColor}`}>
                        {preset.category}
                      </span>
                      <span className="text-[13px] font-mono font-medium text-slate-500">
                        {preset.numQubits} Qubits
                      </span>
                    </div>

                    <h4 className="mt-2.5 font-orbitron text-sm font-bold text-[#3b1458] flex items-center justify-between">
                      {preset.name}
                      {isActive && <CheckIcon className="h-4 w-4 text-[#4c1d70] shrink-0" />}
                    </h4>

                    <p className="mt-1 font-mono text-[13px] text-[#4c1d70] font-semibold truncate bg-purple-50/70 rounded-md px-1.5 py-0.5 border border-purple-100/70">
                      {preset.formula}
                    </p>

                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-[13px] font-bold text-[#4c1d70]">
                    <span className="flex items-center gap-1.5">
                      {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                      <span>{isActive ? 'Currently Active' : 'Load Circuit'}</span>
                    </span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </GeniePresence>
      </section>

      {/* ALL 12 QUANTUM GATES PALETTE (Unboxed Workspace Strip) */}
      <section aria-labelledby="gates-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/80 pb-3.5">
          <div className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-[#4c1d70]" />
            <h3 id="gates-heading" className="font-orbitron text-base font-bold text-[#1a052e] dark:text-white">
              All Quantum Gates ({ALL_GATES.length} Gates)
            </h3>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {(['All', 'Basic', 'Phase & Rotations', 'Multi-Qubit', 'Measurement'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-sm font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#4c1d70] text-white border-[#4c1d70] shadow-sm'
                    : 'bg-purple-50/80 text-[#4c1d70] border-purple-200/80 hover:bg-purple-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gates Grid */}
        <div key={selectedCategory} className="genie-content mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredGates.map((g) => {
            const isSelected = selectedGate === g.type;
            const isBeingDragged = draggingGate === g.type;
            return (
              <button
                key={g.type}
                type="button"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', g.type);
                  e.dataTransfer.effectAllowed = 'copy';
                  const ghost = createCustomDragGhost(g.type);
                  if (e.dataTransfer.setDragImage) {
                    e.dataTransfer.setDragImage(ghost, 26, 26);
                  }
                  setTimeout(() => ghost.remove(), 0);
                  setDraggingGate(g.type);
                }}
                onDragEnd={() => {
                  setDraggingGate(null);
                  setDragOverCell(null);
                }}
                onClick={() => setSelectedGate(g.type)}
                className={`cursor-grab active:cursor-grabbing spring-lift group relative flex flex-col items-center justify-center rounded-2xl p-3.5 text-center transition-all duration-150 active:scale-90 hover:scale-105 hover:shadow-md border select-none ${
                  isBeingDragged
                    ? 'opacity-65 scale-95 border-2 border-dashed border-[#f5d626] bg-[#f5d626]/20 ring-4 ring-[#f5d626]/30 shadow-[0_0_25px_rgba(245,214,38,0.5)]'
                    : isSelected
                    ? `${g.color} text-white ${g.border} ${g.glow} scale-105 ring-2 ring-[#f5d626]`
                    : 'border-purple-200/80 bg-purple-50/40 text-slate-800 hover:border-[#4c1d70] hover:bg-purple-50/80 shadow-sm'
                }`}
              >
                <div className="absolute top-1.5 right-2 flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase text-slate-400 group-hover:text-purple-700">
                  <GripVerticalIcon className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
                <span className="font-mono text-2xl font-black tracking-wider">{g.label}</span>
                <span className="mt-1 text-[13px] font-bold leading-tight opacity-90">{g.desc.split(':')[0]}</span>
                <span className="mt-0.5 text-[11px] font-mono text-slate-500 group-hover:text-purple-900 line-clamp-1">
                  {g.category}
                </span>
                {isBeingDragged && (
                  <span className="absolute -bottom-2 rounded-full bg-[#f5d626] px-2 py-0.5 text-[8px] font-black text-zinc-950 uppercase tracking-tighter shadow-md animate-pulse">
                    Dragging...
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* VIRTUAL QUANTUM CIRCUIT GRID WITH TIMELINE & LASER SWEEP */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/70 bg-[#140520] p-6 shadow-xl">
        {/* Animated Laser Scanning Beam */}
        {simulating && (
          <div className="laser-beam pointer-events-none z-30" />
        )}

        {/* Dynamic Drag & Drop Active HUD Banner */}
        {draggingGate && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f5d626]/70 bg-gradient-to-r from-purple-950/90 via-[#270b3b]/90 to-purple-950/90 p-3 shadow-[0_0_25px_rgba(245,214,38,0.35)] backdrop-blur-xl animate-fadeInUp">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#f5d626] animate-ping" />
              <span className="font-mono text-sm font-black text-[#f5d626]">
                ACTIVE DRAG: [{draggingGate}] {ALL_GATES.find(g => g.type === draggingGate)?.desc.split(':')[0]}
              </span>
              <span className="text-sm text-purple-200/90 hidden md:inline">
                ➔ Hover over any wire slot to preview wavefunction transformation
              </span>
            </div>
            <span className="rounded-full bg-[#f5d626]/20 px-3 py-1 font-mono text-xs font-extrabold text-[#f5d626] border border-[#f5d626]/40 shadow-inner">
              ⚡ Magnetic Docking Active
            </span>
          </div>
        )}

        {/* Canvas Quick Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-purple-900/50">
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-[#f5d626]" />
            <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider text-purple-200">
              Interactive Circuit Canvas
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Drop Preset directly on canvas */}
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium text-purple-300">Drop Preset:</label>
              <select
                value={activePresetId}
                onChange={(e) => {
                  const p = PRESETS.find(item => item.id === e.target.value);
                  if (p) loadPreset(p);
                }}
                className="rounded-full border border-purple-700 bg-purple-950/60 px-3 py-1 text-sm font-mono font-semibold text-[#f5d626] focus:outline-none focus:ring-1 focus:ring-[#f5d626]"
              >
                <option value="" disabled>-- Drop a preset --</option>
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.numQubits}Q)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-sm font-medium text-purple-300">Wires:</label>
              <select
                value={numQubits}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setNumQubits(n);
                  setGates(gates.filter((g) => g.qubit < n));
                }}
                className="rounded-full border border-purple-700 bg-purple-950/60 px-3 py-1 text-sm font-mono font-bold text-purple-200 focus:outline-none focus:ring-1 focus:ring-[#f5d626]"
              >
                <option value={1}>1 Qubit</option>
                <option value={2}>2 Qubits</option>
                <option value={3}>3 Qubits</option>
                <option value={4}>4 Qubits</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearCircuit}
              className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/30 px-3 py-1 text-sm font-semibold text-rose-300 hover:bg-rose-900/50 transition"
            >
              <Trash2Icon className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>

        {/* Timeline Ruler Header */}
        <div className="min-w-[720px]">
          <div className="flex items-center gap-4 pb-2 border-b border-purple-900/50 text-[13px] font-mono text-purple-400/60">
            <div className="w-24 shrink-0 font-bold uppercase tracking-wider text-purple-300">Qubit Wire</div>
            <div className="flex flex-1 justify-between pr-10">
              {Array.from({ length: numSteps }).map((_, stepIdx) => (
                <span key={stepIdx} className="w-12 text-center">
                  t[{stepIdx}]
                </span>
              ))}
            </div>
            <div className="w-12 shrink-0 text-center font-bold text-[#f5d626]">Measure</div>
          </div>

          {/* Qubit Wires */}
          {Array.from({ length: numQubits }).map((_, qIdx) => (
            <div key={qIdx} className="group relative flex items-center gap-4 py-5">
              {/* Wire Label */}
              <div className="w-24 shrink-0 font-mono text-sm font-bold text-purple-100 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f5d626] group-hover:animate-ping" />
                q[{qIdx}] <span className="text-[#f5d626] font-normal">|0⟩</span>
              </div>

              {/* Wire Line & Step Slots */}
              <div className="relative flex flex-1 items-center justify-between pr-10">
                {/* Glowing Wire */}
                <div className="absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#f5d626]/40 via-purple-500/30 to-purple-800 shadow-[0_0_10px_rgba(245,214,38,0.2)]" />

                {Array.from({ length: numSteps }).map((_, stepIdx) => {
                  const gateOnCell = gates.find((g) => g.qubit === qIdx && g.step === stepIdx);
                  const isControl = gates.some((g) => g.control === qIdx && g.step === stepIdx);
                  const targetGate = gates.find((g) => g.control === qIdx && g.step === stepIdx);

                  return (
                    <div key={stepIdx} className="relative z-10">
                      {/* Vertical Laser Connection Line for Multi-Qubit Gates (CX, CZ, SWAP) */}
                      {isControl && targetGate && (
                        <div
                          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 w-1 shadow-lg ${
                            targetGate.type === 'CZ'
                              ? 'bg-gradient-to-b from-purple-400 to-indigo-500 shadow-[0_0_12px_#a855f7]'
                              : targetGate.type === 'SWAP'
                              ? 'bg-gradient-to-b from-fuchsia-400 to-pink-500 shadow-[0_0_12px_#d946ef]'
                              : 'bg-gradient-to-b from-violet-400 to-indigo-500 shadow-[0_0_12px_#8b5cf6]'
                          }`}
                          style={{
                            top: '18px',
                            height: `${(targetGate.qubit - qIdx) * 64}px`,
                          }}
                        />
                      )}

                      {(() => {
                        const isCellHovered = dragOverCell?.qubit === qIdx && dragOverCell?.step === stepIdx;
                        const isRecentlyDropped = lastDroppedCell?.qubit === qIdx && lastDroppedCell?.step === stepIdx && (Date.now() - lastDroppedCell.time < 900);
                        return (
                          <button
                            type="button"
                            onClick={() => handleCellClick(qIdx, stepIdx)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'copy';
                              if (!dragOverCell || dragOverCell.qubit !== qIdx || dragOverCell.step !== stepIdx) {
                                setDragOverCell({ qubit: qIdx, step: stepIdx });
                              }
                            }}
                            onDragLeave={() => {
                              if (dragOverCell?.qubit === qIdx && dragOverCell?.step === stepIdx) {
                                setDragOverCell(null);
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverCell(null);
                              const droppedType = e.dataTransfer.getData('text/plain') as GateType;
                              if (draggedPlacedGate) {
                                moveGate(draggedPlacedGate.fromQubit, draggedPlacedGate.fromStep, qIdx, stepIdx);
                              } else if (droppedType) {
                                placeGateAt(qIdx, stepIdx, droppedType);
                              }
                            }}
                            className={`group/btn relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200 ${
                              isCellHovered
                                ? 'border-2 border-dashed border-[#f5d626] bg-yellow-400/20 scale-110 shadow-[0_0_35px_rgba(245,214,38,0.7)] ring-4 ring-[#f5d626]/40 z-20'
                                : gateOnCell
                                ? isRecentlyDropped
                                  ? 'border-[#f5d626] bg-purple-950 scale-105 shadow-[0_0_25px_rgba(245,214,38,0.8)] ring-2 ring-[#f5d626] z-10'
                                  : 'border-purple-600/70 bg-purple-950 scale-100 shadow-md hover:border-[#f5d626] hover:scale-105'
                                : isControl
                                ? 'border-violet-500 bg-purple-950 shadow-md'
                                : draggingGate
                                ? 'animate-magnetic-cell border-dashed border-purple-400/60 bg-purple-950/50 hover:border-[#f5d626] hover:bg-purple-900/50'
                                : 'border-purple-900/60 bg-purple-950/40 hover:border-[#f5d626] hover:scale-105 hover:bg-purple-900/40'
                            }`}
                          >
                            {gateOnCell ? (
                              <>
                                <div
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    e.dataTransfer.setData('text/plain', gateOnCell.type);
                                    e.dataTransfer.effectAllowed = 'move';
                                    const ghost = createCustomDragGhost(gateOnCell.type);
                                    if (e.dataTransfer.setDragImage) {
                                      e.dataTransfer.setDragImage(ghost, 26, 26);
                                    }
                                    setTimeout(() => ghost.remove(), 0);
                                    setDraggedPlacedGate({ fromQubit: qIdx, fromStep: stepIdx, gateType: gateOnCell.type });
                                    setDraggingGate(gateOnCell.type);
                                  }}
                                  onDragEnd={() => {
                                    setDraggingGate(null);
                                    setDraggedPlacedGate(null);
                                    setDragOverCell(null);
                                  }}
                                  className={`cursor-grab active:cursor-grabbing flex h-10 w-10 items-center justify-center rounded-xl font-mono text-base font-extrabold text-white shadow-md select-none transition-transform hover:scale-105 ${
                                    isRecentlyDropped ? 'animate-gate-snap ring-2 ring-[#f5d626]' : ''
                                  } ${
                                    ALL_GATES.find((ag) => ag.type === gateOnCell.type)?.color || 'bg-purple-600'
                                  }`}
                                >
                                  {gateOnCell.type === 'CX' || gateOnCell.type === 'CNOT' ? '⊕' : gateOnCell.type === 'CZ' ? '●' : gateOnCell.type === 'M' || gateOnCell.type === 'MEASURE' ? '⏱' : gateOnCell.type}
                                </div>
                                {isRecentlyDropped && (
                                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#f5d626] animate-ripple-ring" />
                                )}
                              </>
                            ) : isCellHovered ? (
                              <div className="pointer-events-none flex flex-col items-center justify-center animate-hologram">
                                {draggingGate ? (
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black text-white shadow-[0_0_18px_rgba(245,214,38,0.7)] ring-2 ring-[#f5d626] ${
                                    ALL_GATES.find((ag) => ag.type === draggingGate)?.color || 'bg-purple-600'
                                  }`}>
                                    {draggingGate === 'CX' || draggingGate === 'CNOT' ? '⊕' : draggingGate === 'CZ' ? '●' : draggingGate === 'M' || draggingGate === 'MEASURE' ? '⏱' : draggingGate}
                                  </div>
                                ) : (
                                  <span className="font-mono text-[11px] font-black text-[#f5d626] animate-pulse uppercase tracking-tighter">
                                    + Drop
                                  </span>
                                )}
                                <span className="mt-0.5 font-mono text-[7px] font-bold text-[#f5d626] uppercase tracking-tighter">
                                  Release
                                </span>
                                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#f5d626] animate-ripple-ring" />
                              </div>
                            ) : isControl ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 shadow-[0_0_12px_#8b5cf6]">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                            ) : draggingGate ? (
                              <div className="pointer-events-none flex flex-col items-center justify-center">
                                <span className="font-mono text-base font-bold text-[#f5d626] animate-pulse">+</span>
                                <span className="font-mono text-[7px] text-purple-300 uppercase tracking-tight">dock</span>
                              </div>
                            ) : (
                              <span className="font-mono text-sm text-purple-400/40 group-hover/btn:text-[#f5d626]">+</span>
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* Measurement Register Box */}
              <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-600/60 bg-purple-900/40 text-sm font-mono font-bold text-[#f5d626] shadow-[0_0_12px_rgba(245,214,38,0.2)]">
                M
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls & Simulation Trigger */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-purple-900/50 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">Execution Shots:</span>
            {[512, 1024, 4096].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShots(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-mono font-bold transition-all ${
                  shots === s
                    ? 'bg-[#f5d626] text-zinc-950 shadow-[0_0_15px_rgba(245,214,38,0.4)]'
                    : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 hover:text-white border border-purple-800/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={simulating || gates.length === 0}
            className={`flex items-center gap-2 rounded-full px-8 py-3.5 font-orbitron text-sm font-bold tracking-wide text-zinc-950 transition-all duration-300 shadow-xl ${
              simulating
                ? 'bg-yellow-300 animate-pulse text-zinc-950 shadow-[0_0_35px_rgba(245,214,38,0.8)]'
                : gates.length === 0
                ? 'bg-purple-950 text-purple-500 border border-purple-800 cursor-not-allowed'
                : 'bg-[#f5d626] hover:bg-yellow-400 shadow-[0_0_25px_rgba(245,214,38,0.45)] hover:shadow-[0_0_35px_rgba(245,214,38,0.8)] hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            {simulating ? (
              <>
                <CpuIcon className="h-4 w-4 animate-spin text-zinc-950" />
                Simulating Wavefunction Evolution...
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 fill-zinc-950" />
                Simulate Quantum Circuit (Qiskit Aer)
              </>
            )}
          </button>
        </div>
      </div>

      {/* REAL-TIME QUANTUM STATE & ANSWER OUTPUT (DRAG-TO-SHOW-ANSWER) */}
      <section aria-labelledby="live-answer-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5d626] to-amber-500 text-zinc-950 shadow-md">
              <ZapIcon className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="live-answer-heading" className="font-orbitron text-2xl font-bold text-[#1a052e] dark:text-white">
                  Live Quantum State & Answer Output
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Dynamic Real-Time Engine
                </span>
              </div>
              <p className="font-poppins text-sm text-slate-500">
                Drag and drop quantum gates onto wires above to immediately evaluate the mathematical wavefunction and measurement answer.
              </p>
            </div>
          </div>

          {/* Mode Switch: Wavefunction Answer vs Drag Challenges */}
          <div className="inline-flex rounded-full border border-purple-200 bg-purple-50/80 p-1 text-sm font-bold shadow-sm">
            <button
              type="button"
              onClick={() => setAnswerMode('freeform')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                answerMode === 'freeform'
                  ? 'bg-[#4c1d70] text-white shadow-md'
                  : 'text-[#4c1d70] hover:bg-purple-100'
              }`}
            >
              Live Wavefunction Answer
            </button>
            <button
              type="button"
              onClick={() => setAnswerMode('challenge')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all ${
                answerMode === 'challenge'
                  ? 'bg-[#4c1d70] text-white shadow-md'
                  : 'text-[#4c1d70] hover:bg-purple-100'
              }`}
            >
              <TargetIcon className="h-3.5 w-3.5" />
              <span>🎯 Drag Challenges</span>
              {isChallengeSolved && (
                <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-ping" />
              )}
            </button>
          </div>
        </div>

        {answerMode === 'challenge' ? (
          /* CHALLENGE MODE */
          <div key="challenge" className="genie-content space-y-6 pt-2">
            {/* Challenge Nav Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {TARGET_CHALLENGES.map((ch, idx) => {
                  const isCur = activeChallengeIdx === idx;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => selectChallenge(idx)}
                      className={`rounded-full px-3 py-1 text-sm font-bold transition-all border ${
                        isCur
                          ? 'bg-[#4c1d70] text-white border-[#4c1d70] shadow-md'
                          : 'bg-purple-50 text-[#4c1d70] border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {ch.title.split('.')[1] || ch.title}
                    </button>
                  );
                })}
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
                currentChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentChallenge.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {currentChallenge.difficulty} • {currentChallenge.numQubits} Qubit{currentChallenge.numQubits > 1 ? 's' : ''}
              </span>
            </div>

            {/* Target Goal & Verification Banner */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Target Specification */}
              <div className="space-y-3 rounded-2xl bg-purple-50/50 p-5 border border-purple-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-800">
                    Goal Objective
                  </span>
                  <span className="text-sm font-bold text-[#4c1d70]">
                    Challenge #{activeChallengeIdx + 1} of {TARGET_CHALLENGES.length}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1e0a2e]">
                  {currentChallenge.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentChallenge.goalSummary}
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-white p-3 border border-purple-200/70 shadow-sm">
                  <span className="text-sm font-mono font-bold text-slate-500">Target State:</span>
                  <span className="font-mono text-base font-extrabold text-[#4c1d70]">
                    {currentChallenge.goalState}
                  </span>
                </div>
                <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 text-sm text-amber-900 flex items-start gap-2">
                  <SparklesIcon className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hint:</span> {currentChallenge.hint}
                  </div>
                </div>
              </div>

              {/* Real-time Answer Evaluator */}
              <div className="space-y-3 flex flex-col justify-between rounded-2xl bg-slate-900 p-5 border border-purple-900/50 text-white shadow-inner">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f5d626]">
                      Current Live Answer
                    </span>
                    <span className={`inline-flex items-center gap-1 text-sm font-bold ${
                      isChallengeSolved ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isChallengeSolved ? (
                        <>
                          <CheckCircle2Icon className="h-4 w-4 text-emerald-400" />
                          <span>SOLVED!</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Awaiting Matching Gate...</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-950 p-4 border border-slate-800">
                    <div className="text-xs uppercase font-mono text-slate-400">Current Computed State:</div>
                    <div className="mt-1 font-mono text-2xl font-black text-[#f5d626] truncate">
                      |ψ⟩ = {liveOutput.diracNotation}
                    </div>
                  </div>

                  {isChallengeSolved ? (
                    <div className="mt-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 p-4 text-emerald-200 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 font-bold text-base text-emerald-300">
                        <TrophyIcon className="h-4 w-4 text-[#f5d626]" />
                        <span>Target State Matched! +50 XP</span>
                      </div>
                      <p className="mt-1 text-sm text-emerald-400/90">
                        Outstanding! You dragged the exact quantum gates needed to construct this target wavefunction.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                      Drag gates from the palette above into the wire slots to transform the state until it matches the target equation.
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setGates([])}
                    className="text-sm font-bold text-slate-400 hover:text-white transition"
                  >
                    Reset Wires
                  </button>

                  {isChallengeSolved && activeChallengeIdx < TARGET_CHALLENGES.length - 1 ? (
                    <Button
                      onClick={() => selectChallenge(activeChallengeIdx + 1)}
                      className="px-4 py-1.5 rounded-full text-sm font-bold shadow-md bg-[#f5d626] text-zinc-950 hover:bg-yellow-400"
                    >
                      <span>Next Challenge</span>
                      <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  ) : isChallengeSolved ? (
                    <span className="text-sm font-bold text-[#f5d626] flex items-center gap-1">
                      🏆 All Challenges Cleared!
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FREEFORM LIVE ANSWER READOUT */
          <div key="freeform" className="genie-content space-y-6 pt-2">
            {/* Primary Mathematical Dirac Wavefunction Box */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#190829] to-[#0c0214] p-6 text-white border border-purple-900/60 shadow-xl">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(#f5d626_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-900/60 px-2.5 py-0.5 text-xs font-mono font-bold text-purple-200 border border-purple-700/60">
                      OUTPUT STATEVECTOR ({numQubits} QUBIT{numQubits > 1 ? 'S' : ''})
                    </span>
                    <span className="text-sm font-mono text-[#f5d626] font-semibold">
                      {liveOutput.dim} Dimension Vector Space
                    </span>
                  </div>

                  <div className="mt-3 font-mono text-3xl sm:text-4xl font-black text-[#f5d626] tracking-wide">
                    |ψ⟩ = {liveOutput.diracNotation}
                  </div>

                  <p className="mt-2 text-sm sm:text-base text-purple-200/80 leading-relaxed max-w-2xl">
                    💡 {liveOutput.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-950/70 p-3 border border-purple-800/60 text-center">
                    <div className="text-xs uppercase font-bold text-purple-400">Total Gates</div>
                    <div className="text-xl font-mono font-extrabold text-[#f5d626]">{gates.length}</div>
                  </div>
                  <div className="rounded-xl bg-purple-950/70 p-3 border border-purple-800/60 text-center">
                    <div className="text-xs uppercase font-bold text-purple-400">Active Terms</div>
                    <div className="text-xl font-mono font-extrabold text-emerald-400">
                      {liveOutput.probabilities.filter(p => p.prob > 0.001).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basis State Measurement Probabilities Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron text-sm font-bold text-[#1a052e] dark:text-white">
                  Computational Basis Measurement Probabilities (P(|x⟩) = |⟨x|ψ⟩|²)
                </h3>
                <span className="text-sm font-mono text-slate-500 font-semibold">
                  Sum = 100.0%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {liveOutput.probabilities.map((item) => {
                  const percent = (item.prob * 100).toFixed(1);
                  const isNonZero = item.prob > 0.001;
                  return (
                    <div
                      key={item.stateStr}
                      className={`rounded-2xl p-3.5 border transition-all ${
                        isNonZero
                          ? 'border-purple-300 bg-purple-50/70 shadow-sm'
                          : 'border-slate-100 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-base font-black text-[#1e0a2e]">
                          |{item.stateStr}⟩
                        </span>
                        <span className={`text-sm font-extrabold ${isNonZero ? 'text-[#4c1d70]' : 'text-slate-400'}`}>
                          {percent}%
                        </span>
                      </div>

                      {/* Animated Progress Fill Bar */}
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4c1d70] to-[#f5d626] transition-all duration-300 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Amplitude:</span>
                        <span className="font-bold">
                          {item.amplitude.r.toFixed(2)}
                          {item.amplitude.i >= 0 ? `+${item.amplitude.i.toFixed(2)}i` : `${item.amplitude.i.toFixed(2)}i`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* RESULTS SECTION: 4 DYNAMIC QUANTUM VISUALIZERS (Section 12.9) */}
      {simResult && (
        <div className="space-y-6">
          {/* Visualizer Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/80 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-mono font-bold text-[#4c1d70] uppercase tracking-wider">
                Quantum Visualizer View:
              </span>
              <div className="inline-flex flex-wrap rounded-xl bg-purple-100/60 p-1 dark:bg-zinc-800 gap-1">
                <button
                  type="button"
                  onClick={() => setVisualizerMode('histogram')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold transition ${
                    visualizerMode === 'histogram'
                      ? 'bg-white dark:bg-zinc-900 text-[#4c1d70] dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  📊 Histogram & Counts
                </button>
                <button
                  type="button"
                  onClick={() => setVisualizerMode('bloch')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold transition ${
                    visualizerMode === 'bloch'
                      ? 'bg-white dark:bg-zinc-900 text-[#4c1d70] dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🌐 3D Bloch Spheres
                </button>
                <button
                  type="button"
                  onClick={() => setVisualizerMode('qsphere')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold transition ${
                    visualizerMode === 'qsphere'
                      ? 'bg-white dark:bg-zinc-900 text-[#4c1d70] dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🔮 Q-Sphere (Entangled)
                </button>
                <button
                  type="button"
                  onClick={() => setVisualizerMode('statevector')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono font-bold transition ${
                    visualizerMode === 'statevector'
                      ? 'bg-white dark:bg-zinc-900 text-[#4c1d70] dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🌊 Statevector Amplitudes
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-mono text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{simResult.shots || shots} Shots Synchronized</span>
            </div>
          </div>

          {/* Conditional Visualizer Display */}
          {visualizerMode === 'histogram' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <HistogramChart
                  counts={simResult.counts || {}}
                  shots={simResult.shots || shots}
                  executionTimeMs={simResult.execution_time_ms}
                  backend={simResult.backend}
                  xpEarned={simResult.xp_earned}
                />
              </div>
              <div className="lg:col-span-5">
                <BlochSphere3D
                  vectors={simResult.bloch_vectors || []}
                  numQubits={numQubits}
                />
              </div>
            </div>
          )}

          {visualizerMode === 'bloch' && (
            <BlochSphere3D
              vectors={simResult.bloch_vectors || []}
              numQubits={numQubits}
            />
          )}

          {visualizerMode === 'qsphere' && (
            <QSphere
              amplitudes={liveOutput.probabilities?.map((p) => ({
                basis: p.stateStr,
                amplitude: p.amplitude,
              }))}
              numQubits={numQubits}
            />
          )}

          {visualizerMode === 'statevector' && (
            <StatevectorChart
              amplitudes={liveOutput.probabilities?.map((p) => ({
                basis: p.stateStr,
                amplitude: p.amplitude,
              }))}
              numQubits={numQubits}
            />
          )}
        </div>
      )}

      {/* Socratic Explanation Modals / Banners */}
      {simResult && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExplainResult}
            disabled={explainingResult}
            className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50/80 px-4 py-2 text-sm font-bold text-[#4c1d70] hover:bg-[#4c1d70] hover:text-white transition shadow-sm active:scale-95"
          >
            <SparklesIcon className="h-3.5 w-3.5 text-[#f5d626]" />
            <span>{explainingResult ? 'Generating Socratic Analysis...' : 'Explain Simulation Result (Born Rule)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExplainCircuit}
            disabled={explainingCircuit}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/80 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white transition shadow-sm active:scale-95"
          >
            <AtomIcon className="h-3.5 w-3.5 text-emerald-600" />
            <span>{explainingCircuit ? 'Analyzing Transformations...' : 'Explain Circuit Transformations'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInnovationSuite(!showInnovationSuite)}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/80 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-600 hover:text-white transition shadow-sm active:scale-95"
          >
            <BrainIcon className="h-3.5 w-3.5 text-amber-600" />
            <span>{showInnovationSuite ? 'Hide Digital Twin & Predict Suite' : 'Predict State & Digital Twin (CCI)'}</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyzeErrors}
            disabled={analyzingErrors}
            className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50/80 px-4 py-2 text-sm font-bold text-sky-900 hover:bg-sky-700 hover:text-white transition shadow-sm active:scale-95"
          >
            <ShieldCheckIcon className="h-3.5 w-3.5 text-sky-600" />
            <span>{analyzingErrors ? 'Analyzing Error Hierarchy...' : '4-Level Quantum Error Diagnostic'}</span>
          </button>
        </div>
      )}

      {explainResultData && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-[#4c1d70] uppercase tracking-wide flex items-center gap-1.5">
              <SparklesIcon className="h-3.5 w-3.5 text-[#f5d626]" /> Socratic Result Analysis
            </span>
            <span className="text-[13px] font-mono text-slate-500">
              Entropy: {explainResultData.entropy} • Dominant: {explainResultData.dominant_states.join(', ') || 'N/A'}
            </span>
          </div>
          <p className="font-poppins text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            {explainResultData.analysis}
          </p>
        </div>
      )}

      {explainCircuitData && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <AtomIcon className="h-3.5 w-3.5 text-emerald-600" /> Physical Transformation Blueprint
            </span>
            <span className="text-[13px] font-mono text-slate-500">
              {explainCircuitData.step_by_step.length} Step Transformations
            </span>
          </div>
          <p className="font-poppins text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            {explainCircuitData.summary}
          </p>
          <div className="mt-2 space-y-1">
            {explainCircuitData.step_by_step.map((step, idx) => (
              <div key={idx} className="text-sm font-mono text-slate-600 dark:text-zinc-400">
                • {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantum Innovations Suite: Predict-Simulate-Explain & Cognitive Digital Twin */}
      {showInnovationSuite && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <BrainIcon className="h-3.5 w-3.5 text-amber-600" />
                Pedagogical Innovation Engine (Sections 8, 9, 34)
              </span>
              <h4 className="text-lg font-bold text-amber-950 font-serif">
                Predict-Simulate-Explain Loop & Cognitive Digital Twin
              </h4>
            </div>
            <button
              type="button"
              onClick={handleEvaluatePedagogy}
              disabled={evaluatingInnovation}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-700 active:scale-95 transition disabled:opacity-50"
            >
              <SparklesIcon className="h-3.5 w-3.5 text-[#f5d626]" />
              <span>{evaluatingInnovation ? 'Calibrating Twin...' : 'Evaluate Prediction & Mental Model'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono font-bold text-amber-950">
              1. Formulate Hypothesis: Predict Basis State Probabilities
            </label>
            <p className="text-sm font-poppins text-slate-600 dark:text-zinc-400">
              Before observing simulation output, estimate the probability distribution (sum = 1.0). Your prediction calibrates the Cognitive Digital Twin.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {['00', '01', '10', '11'].slice(0, Math.min(4, Math.pow(2, numQubits))).map((state) => (
                <div key={state} className="bg-white/80 rounded-xl p-2.5 border border-amber-200 shadow-sm flex flex-col gap-1">
                  <span className="font-mono text-sm font-bold text-amber-950">|{state}⟩ Amplitude</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={predictedDistribution[state] ?? (state === '00' ? 0.5 : state === '11' ? 0.5 : 0)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPredictedDistribution((prev) => ({ ...prev, [state]: val }));
                    }}
                    className="w-full text-sm font-mono px-2 py-1 border border-amber-300 rounded bg-amber-50/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Results: Prediction Divergence & Digital Twin Calibration */}
          {predictionResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/90 rounded-xl p-4 border border-amber-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold uppercase text-slate-600">Prediction Verification</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    predictionResult.is_accurate
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {predictionResult.accuracy_tier} • +{predictionResult.xp_bonus} XP
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-[#4c1d70]">
                    {(predictionResult.divergence_score * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-slate-500 font-mono">Total Variation Divergence (TVD)</span>
                </div>
                <p className="text-sm font-poppins text-slate-700 leading-relaxed">
                  {predictionResult.feedback_message}
                </p>
              </div>

              {digitalTwinResult && (
                <div className="bg-white/90 rounded-xl p-4 border border-emerald-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                      <BrainIcon className="h-3.5 w-3.5 text-emerald-600" />
                      Cognitive Digital Twin (CCI)
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {digitalTwinResult.alignment_tier}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-emerald-800">
                      {(digitalTwinResult.cognitive_calibration_index * 100).toFixed(0)}%
                    </span>
                    <span className="text-sm text-slate-500 font-mono">Calibration Index</span>
                  </div>
                  <p className="text-sm font-poppins text-slate-700 leading-relaxed">
                    {digitalTwinResult.mental_model_summary}
                  </p>
                  <p className="text-[13px] font-mono text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    💡 Next Step: {digitalTwinResult.recommended_focus}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cognitive Anti-Pattern Diagnostics (MC-01 to MC-10) */}
          {misconceptions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-amber-200/60">
              <span className="text-sm font-mono font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                <AlertTriangleIcon className="h-3.5 w-3.5 text-red-600" />
                Detected Cognitive Misconceptions ({misconceptions.length})
              </span>
              <div className="grid gap-3">
                {misconceptions.map((m, idx) => (
                  <div key={idx} className="bg-red-50/80 border border-red-200 rounded-xl p-3.5 text-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-red-900">{m.misconception_id}: {m.name}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-200 text-red-900">
                        {m.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{m.trigger_condition}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-red-950 font-medium">👉 Remedy: {m.remediation_action}</span>
                      <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Vault: {m.vault_citation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4-Level Quantum Error Hierarchy Panel */}
      {quantumErrors.length > 0 && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-sky-950 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-sky-600" />
              4-Level Quantum Error Diagnostic
            </span>
            <span className="text-[13px] font-mono text-slate-500">
              {quantumErrors.length} Diagnostic Flag(s)
            </span>
          </div>
          <div className="grid gap-2.5">
            {quantumErrors.map((err, idx) => (
              <div key={idx} className="bg-white/90 border border-sky-200 rounded-xl p-3.5 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-950">
                    <span className="bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded mr-1.5">{err.level}</span>
                    {err.category}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{err.description}</p>
                <p className="text-emerald-800 font-mono text-[13px]">
                  💡 Resolution: {err.mitigation_hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Framework Quantum Code Studio (Qiskit, Cirq, PennyLane, OpenQASM) */}
      <QuantumCodeViewer
        code={editedCode || generateFrameworkCode(selectedFramework)}
        editable={true}
        onChange={setEditedCode}
        framework={selectedFramework}
        onFrameworkChange={(fw) => {
          setSelectedFramework(fw);
          setEditedCode(generateFrameworkCode(fw));
        }}
        numQubits={numQubits}
        shots={shots}
        onLaunchColab={openInColab}
        colabLoading={colabLoading}
        onResetCode={() => setEditedCode(generateFrameworkCode(selectedFramework))}
        onRunSimulation={runSimulation}
        isSimulating={simulating}
        title="Multi-Framework Quantum Code Studio"
        subtitle="Live In-Platform Editable Quantum Code Environment"
      />

      {/* Real-time Toast Feedback Notification */}
        <GeniePresence open={Boolean(toastMessage)} origin="bottom-right" role="status" className="fixed bottom-24 right-4 sm:right-6 max-w-[calc(100vw-2rem)] z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/50 bg-zinc-950/95 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/30">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>
          <span>{toastMessage}</span>
        </GeniePresence>

      {/* AR/VR Motion Graphics Spatial Studio Modal */}
      <ARVRQuantumViewer
        isOpen={arSpatialOpen}
        onClose={() => setArSpatialOpen(false)}
        initialVectors={simResult?.bloch_vectors || []}
        numQubits={numQubits}
      />
    </div>
  );
}
