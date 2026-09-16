import React, { useState, useEffect, useRef } from 'react';
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
  ListFilterIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiClient } from '../services/apiClient';
import { BlochSphere3D } from '../components/quantum/BlochSphere3D';
import { HistogramChart } from '../components/quantum/HistogramChart';

type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'RX' | 'RY' | 'RZ' | 'CX' | 'CZ' | 'SWAP';

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
  category: 'Basic' | 'Phase & Rotations' | 'Multi-Qubit';
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
  { type: 'CZ', label: 'CZ', desc: 'Controlled-Z: Flips phase if control is |1⟩', category: 'Multi-Qubit', color: 'bg-purple-600', border: 'border-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
  { type: 'SWAP', label: 'SW', desc: 'SWAP: Exchanges the states of two qubits', category: 'Multi-Qubit', color: 'bg-fuchsia-600', border: 'border-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]' },
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

export function CircuitBuilder() {
  const [numQubits, setNumQubits] = useState(2);
  const [selectedGate, setSelectedGate] = useState<GateType>('H');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Basic' | 'Phase & Rotations' | 'Multi-Qubit'>('All');
  const [activePresetId, setActivePresetId] = useState<string>('bell');
  const [gates, setGates] = useState<PlacedGate[]>([
    { step: 0, qubit: 0, type: 'H' },
    { step: 1, qubit: 1, type: 'CX', control: 0 },
  ]);
  const [shots, setShots] = useState(1024);
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simResult, setSimResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [colabLoading, setColabLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const numSteps = 7;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Handle laser animation sweep during simulation
  useEffect(() => {
    let animationTimer: any;
    if (simulating) {
      setSimProgress(0);
      let p = 0;
      animationTimer = setInterval(() => {
        p += 5;
        setSimProgress(p);
        if (p >= 100) clearInterval(animationTimer);
      }, 35);
    } else {
      setSimProgress(0);
    }
    return () => clearInterval(animationTimer);
  }, [simulating]);

  const handleCellClick = (qubit: number, step: number) => {
    const existingIndex = gates.findIndex((g) => g.qubit === qubit && g.step === step);
    if (existingIndex >= 0) {
      setGates(gates.filter((_, idx) => idx !== existingIndex));
      return;
    }

    if (selectedGate === 'CX' || selectedGate === 'CZ' || selectedGate === 'SWAP') {
      const control = qubit === 0 ? 1 : 0;
      setGates([...gates, { step, qubit, type: selectedGate, control }]);
    } else {
      setGates([...gates, { step, qubit, type: selectedGate }]);
    }
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
      }, 850);
    } catch (err) {
      console.error('Simulation error:', err);
      setSimulating(false);
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
      else if (g.type === 'CX') code += `qc.cx(${c}, ${q})\n`;
      else if (g.type === 'CZ') code += `qc.cz(${c}, ${q})\n`;
      else if (g.type === 'SWAP') code += `qc.swap(${c}, ${q})\n`;
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

  const openInColab = async () => {
    setColabLoading(true);
    try {
      const url = await apiClient.getColabLink('bell-state-entanglement');
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
    } finally {
      setColabLoading(false);
    }
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/50 via-zinc-900 to-indigo-950/40 p-6 border border-emerald-500/20 backdrop-blur shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                AER SIMULATOR ACTIVE • 12 QUANTUM GATES READY
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Virtual Quantum Circuit Builder
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
              Inject single-qubit rotations and multi-qubit entanglement gates. Simulate quantum algorithms with real-time 3D Bloch vectors and column probability graphs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* INTERACTIVE DROPDOWN LIST MENU FOR ALL PRESETS */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-900/60 px-4 py-2 text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:text-white transition"
              >
                <AtomIcon className="h-4 w-4 text-emerald-400" />
                <span>Drop Presets List ({PRESETS.length})</span>
                {dropdownOpen ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </button>

              {/* FLOATING DROPDOWN LIST PANEL */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-[480px] max-h-[500px] overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl z-50 flex flex-col">
                  {/* Dropdown Header */}
                  <div className="p-3.5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-display text-xs font-bold text-zinc-200">
                        Select Preset to Drop ({PRESETS.length} Available)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Instant Load</span>
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
                        className="w-full rounded-lg bg-zinc-900 border border-zinc-700/80 pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Scrollable List Items */}
                  <div className="overflow-y-auto p-2 space-y-1.5 max-h-[340px] divide-y divide-zinc-900/60">
                    {filteredPresets.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">
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
                                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                                : 'bg-zinc-900/40 border-zinc-800/40 hover:bg-zinc-800/80 hover:border-zinc-700'
                            }`}
                          >
                            <div className="space-y-1 pr-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${preset.badgeColor}`}>
                                  {preset.category}
                                </span>
                                <span className="text-xs font-bold text-zinc-100">{preset.name}</span>
                                <span className="text-[10px] font-mono text-zinc-400">({preset.numQubits}Q)</span>
                              </div>
                              <div className="font-mono text-[10px] text-emerald-400 font-semibold">{preset.formula}</div>
                              <p className="text-[11px] text-zinc-400 line-clamp-1 leading-snug">{preset.desc}</p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                                  <CheckIcon className="h-3 w-3" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-zinc-950 transition">
                                  Drop ➔
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openInColab}
              disabled={colabLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition shadow"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5 text-amber-400" />
              {colabLoading ? 'Launching...' : 'Open in Google Colab'}
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED QUANTUM PRESETS GALLERY (Highly Visible Showcase with Collapsible Dropdown & Quick Select) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <AtomIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-zinc-100 flex items-center gap-2">
                Quantum Algorithms & State Presets
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                  {PRESETS.length} Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Click any preset card or select from the drop list to immediately configure the circuit wires.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Dropdown List */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Drop Preset:</label>
              <select
                value={activePresetId}
                onChange={(e) => {
                  const p = PRESETS.find(item => item.id === e.target.value);
                  if (p) loadPreset(p);
                }}
                className="rounded-xl border border-emerald-500/30 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              {isPresetsExpanded ? (
                <>
                  <span>Collapse Cards</span>
                  <ChevronUpIcon className="h-3.5 w-3.5 text-zinc-400" />
                </>
              ) : (
                <>
                  <span>Drop All Preset Cards</span>
                  <ChevronDownIcon className="h-3.5 w-3.5 text-emerald-400" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Qubits:</label>
              <select
                value={numQubits}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setNumQubits(n);
                  setGates(gates.filter((g) => g.qubit < n));
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/40 transition"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Clear Wires
            </button>
          </div>
        </div>

        {/* Presets Grid Cards (Expandable / Droppable) */}
        {isPresetsExpanded && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-200">
            {PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className={`relative flex flex-col justify-between rounded-xl p-4 text-left transition-all duration-300 border ${
                    isActive
                      ? 'border-emerald-400 bg-gradient-to-b from-emerald-950/40 to-zinc-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/80 hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${preset.badgeColor}`}>
                        {preset.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {preset.numQubits} Qubits
                      </span>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-zinc-100 flex items-center justify-between">
                      {preset.name}
                      {isActive && <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />}
                    </h4>

                    <p className="mt-1 font-mono text-[11px] text-emerald-400/90 font-semibold truncate">
                      {preset.formula}
                    </p>

                    <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-emerald-300">
                    <span>{isActive ? 'Currently Active' : 'Load Circuit'}</span>
                    <ArrowRightIcon className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ALL 12 QUANTUM GATES PALETTE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 backdrop-blur shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-sm font-bold text-zinc-100">
              All Quantum Gates (12 Gates)
            </h3>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {(['All', 'Basic', 'Phase & Rotations', 'Multi-Qubit'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gates Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredGates.map((g) => {
            const isSelected = selectedGate === g.type;
            return (
              <button
                key={g.type}
                type="button"
                onClick={() => setSelectedGate(g.type)}
                className={`group relative flex flex-col items-center justify-center rounded-xl p-3.5 text-center transition-all duration-200 border ${
                  isSelected
                    ? `${g.color} text-white ${g.border} ${g.glow} scale-105 ring-2 ring-white/60`
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:scale-[1.02]'
                }`}
              >
                <span className="font-mono text-xl font-black tracking-wider">{g.label}</span>
                <span className="mt-1 text-[11px] font-medium leading-tight opacity-90">{g.desc.split(':')[0]}</span>
                <span className="mt-0.5 text-[9px] font-mono text-zinc-400 group-hover:text-zinc-200 line-clamp-1">
                  {g.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIRTUAL QUANTUM CIRCUIT GRID WITH TIMELINE & LASER SWEEP */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Animated Laser Scanning Beam */}
        {simulating && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-30 w-1.5 bg-gradient-to-b from-cyan-400 via-emerald-300 to-teal-400 shadow-[0_0_25px_#10b981] transition-all ease-linear"
            style={{ left: `${simProgress}%` }}
          >
            <div className="absolute top-0 -left-8 h-full w-16 bg-emerald-500/20 blur-md" />
          </div>
        )}

        {/* Canvas Quick Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-300">
              Interactive Circuit Canvas
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Drop Preset directly on canvas */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Drop Preset:</label>
              <select
                value={activePresetId}
                onChange={(e) => {
                  const p = PRESETS.find(item => item.id === e.target.value);
                  if (p) loadPreset(p);
                }}
                className="rounded-lg border border-emerald-500/30 bg-zinc-900 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              <label className="text-xs font-medium text-zinc-400">Wires:</label>
              <select
                value={numQubits}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setNumQubits(n);
                  setGates(gates.filter((g) => g.qubit < n));
                }}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-mono font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-900/40 transition"
            >
              <Trash2Icon className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>

        {/* Timeline Ruler Header */}
        <div className="min-w-[720px]">
          <div className="flex items-center gap-4 pb-2 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-500">
            <div className="w-24 shrink-0 font-bold uppercase tracking-wider text-zinc-400">Qubit Wire</div>
            <div className="flex flex-1 justify-between pr-10">
              {Array.from({ length: numSteps }).map((_, stepIdx) => (
                <span key={stepIdx} className="w-12 text-center">
                  t[{stepIdx}]
                </span>
              ))}
            </div>
            <div className="w-12 shrink-0 text-center font-bold text-cyan-400">Measure</div>
          </div>

          {/* Qubit Wires */}
          {Array.from({ length: numQubits }).map((_, qIdx) => (
            <div key={qIdx} className="group relative flex items-center gap-4 py-5">
              {/* Wire Label */}
              <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                q[{qIdx}] <span className="text-emerald-400 font-normal">|0⟩</span>
              </div>

              {/* Wire Line & Step Slots */}
              <div className="relative flex flex-1 items-center justify-between pr-10">
                {/* Glowing Wire */}
                <div className="absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-emerald-500/40 via-cyan-500/20 to-zinc-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />

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

                      <button
                        type="button"
                        onClick={() => handleCellClick(qIdx, stepIdx)}
                        className={`group/btn relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                          gateOnCell
                            ? 'border-emerald-400 bg-zinc-900 scale-105 shadow-xl'
                            : isControl
                            ? 'border-violet-500 bg-zinc-900 shadow-md'
                            : 'border-zinc-800 bg-zinc-950/90 hover:border-emerald-500 hover:scale-105 hover:bg-zinc-900'
                        }`}
                      >
                        {gateOnCell ? (
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-extrabold text-white shadow-md ${
                              ALL_GATES.find((ag) => ag.type === gateOnCell.type)?.color || 'bg-emerald-600'
                            }`}
                          >
                            {gateOnCell.type === 'CX' ? '⊕' : gateOnCell.type === 'CZ' ? '●' : gateOnCell.type}
                          </div>
                        ) : isControl ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 shadow-[0_0_12px_#8b5cf6]">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-zinc-700 group-hover/btn:text-emerald-400">+</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Measurement Register Box */}
              <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs font-mono font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                M
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls & Simulation Trigger */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Execution Shots:</span>
            {[512, 1024, 4096].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShots(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  shots === s
                    ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
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
            className={`flex items-center gap-2 rounded-xl px-7 py-3.5 font-display text-sm font-bold tracking-wide text-white transition-all duration-300 shadow-xl ${
              simulating
                ? 'bg-cyan-600 animate-pulse'
                : gates.length === 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] active:scale-98'
            }`}
          >
            {simulating ? (
              <>
                <CpuIcon className="h-4 w-4 animate-spin text-white" />
                Simulating Wavefunction Evolution...
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 fill-white" />
                Simulate Quantum Circuit (Qiskit Aer)
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION: 3D Q-SPHERE & HISTOGRAM GRAPH */}
      {simResult && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* True Vertical Column Histogram Graph */}
          <div className="lg:col-span-7">
            <HistogramChart
              counts={simResult.counts || {}}
              shots={simResult.shots || shots}
              executionTimeMs={simResult.execution_time_ms}
              backend={simResult.backend}
              xpEarned={simResult.xp_earned}
            />
          </div>

          {/* Interactive 3D Bloch Sphere / Q-Sphere */}
          <div className="lg:col-span-5">
            <BlochSphere3D
              vectors={simResult.bloch_vectors || []}
              numQubits={numQubits}
            />
          </div>
        </div>
      )}

      {/* Generated Qiskit Code Preview */}
      <Card className="p-6 border-zinc-800 bg-zinc-950/90 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CodeIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-zinc-100">
                Generated Qiskit (Python) Code
              </h3>
              <p className="text-[11px] text-zinc-400">Synthesized transpiled circuit for IBM Quantum Hardware</p>
            </div>
          </div>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition shadow"
          >
            {copiedCode ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5" />
                Copy Python Script
              </>
            )}
          </button>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-900/90 p-4 font-mono text-xs leading-relaxed text-emerald-400 border border-zinc-800 shadow-inner">
          {generateQiskitCode()}
        </pre>
      </Card>

      {/* Real-time Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/50 bg-zinc-950/95 px-4 py-3 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 ring-1 ring-emerald-500/30">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
