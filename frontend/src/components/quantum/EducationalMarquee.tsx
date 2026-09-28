import React from 'react';
import { 
  AtomIcon, 
  SparklesIcon, 
  CpuIcon, 
  CompassIcon, 
  GitBranchIcon, 
  LayersIcon, 
  ShieldCheckIcon, 
  Share2Icon, 
  ActivityIcon,
  FlameIcon,
  BinaryIcon,
  ZapIcon
} from 'lucide-react';

interface MarqueeItem {
  text: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROW_1_ITEMS: MarqueeItem[] = [
  { text: 'Superposition Principle |+⟩', category: 'Foundation', icon: LayersIcon },
  { text: 'Bloch Sphere Statevector', category: 'Geometry', icon: CompassIcon },
  { text: 'Bell States |Φ⁺⟩ (|00⟩+|11⟩)/√2', category: 'Entanglement', icon: Share2Icon },
  { text: "Grover's Search Algorithm", category: 'Speedup', icon: SparklesIcon },
  { text: 'Quantum Teleportation Protocol', category: 'Protocols', icon: GitBranchIcon },
  { text: 'Qiskit Aer High-Precision Simulator', category: 'Hardware', icon: CpuIcon },
  { text: 'Unitary Coordinate Operators U†U=I', category: 'Mathematics', icon: AtomIcon },
  { text: 'Deutsch-Jozsa Quantum Oracle', category: 'Algorithms', icon: BinaryIcon },
  { text: 'BB84 Quantum Key Distribution', category: 'Cryptography', icon: ShieldCheckIcon },
  { text: 'Dirac Bra-Ket Notation ⟨ψ|φ⟩', category: 'Foundations', icon: ActivityIcon },
  { text: 'Quantum Phase Kickback', category: 'Eigenvalues', icon: ZapIcon },
];

const ROW_2_ITEMS: MarqueeItem[] = [
  { text: 'Bayesian Knowledge Tracing (BKT)', category: 'Adaptive Engine', icon: SparklesIcon },
  { text: 'Adaptive Diagnostic Baseline', category: 'Assessment', icon: ActivityIcon },
  { text: 'Spaced Repetition SRS Retention', category: 'Cognition', icon: FlameIcon },
  { text: 'Qiskit Aer Quantum Simulator', category: 'Simulation', icon: AtomIcon },
  { text: '3-Qubit GHZ Entangled Registers', category: 'Registers', icon: Share2Icon },
  { text: 'Quantum Fourier Transform (QFT)', category: 'Transforms', icon: LayersIcon },
  { text: 'Fault-Tolerant Surface Codes', category: 'Error Correction', icon: ShieldCheckIcon },
  { text: 'Constructive Wave Interference', category: 'Physics', icon: CompassIcon },
  { text: 'Hadamard State Superposition', category: 'Gates', icon: CpuIcon },
  { text: 'OpenQASM 2.0 Circuit Compilation', category: 'Code Export', icon: BinaryIcon },
  { text: 'Decoherence & T₁/T₂ Times', category: 'Hardware', icon: ZapIcon },
];

export function EducationalMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-zinc-800/80 bg-zinc-950 py-6">
      {/* Subtle edge gradient fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-zinc-950 to-transparent sm:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-zinc-950 to-transparent sm:w-36" />

      <div className="space-y-3">
        {/* Row 1: Right to Left */}
        <div className="flex w-max animate-marquee-left select-none gap-3 hover:[animation-play-state:paused]">
          {[...ROW_1_ITEMS, ...ROW_1_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`r1-${idx}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-zinc-800/90 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur transition-all duration-200 hover:border-emerald-500/50 hover:bg-zinc-900 hover:text-white"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Icon className="h-3 w-3" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-zinc-200">{item.text}</span>
                <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max animate-marquee-right select-none gap-3 hover:[animation-play-state:paused]">
          {[...ROW_2_ITEMS, ...ROW_2_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`r2-${idx}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-zinc-800/90 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur transition-all duration-200 hover:border-cyan-500/50 hover:bg-zinc-900 hover:text-white"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                  <Icon className="h-3 w-3" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-zinc-200">{item.text}</span>
                <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
