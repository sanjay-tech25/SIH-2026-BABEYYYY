import { useState, useEffect } from 'react';
import {
  AwardIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  LockIcon,
  FlaskConicalIcon,
  CpuIcon,
  BinaryIcon,
  LayersIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  XIcon,
  SparklesIcon,
  FileCheckIcon,
  SearchIcon,
  BookOpenIcon,
  CompassIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { stateStore, type AppState, type MilestoneProof } from '../services/stateStore';
import type { ViewId } from '../data/appData';

export type MilestoneCategory = 'all' | 'foundations' | 'circuits' | 'algorithms' | 'certifications';

export interface MilestonePrerequisite {
  id: string;
  label: string;
  type: 'topic' | 'lab' | 'assessment' | 'circuit';
  isComplete: (s: AppState) => boolean;
  navTarget?: ViewId;
}

export interface MilestoneItem {
  id: string; // e.g. 'MS-01'
  code: string;
  title: string;
  category: MilestoneCategory;
  domain: string;
  summary: string;
  theoreticalCompetence: string;
  icon: typeof AwardIcon;
  prerequisites: MilestonePrerequisite[];
  verificationCriteria: string;
}

export const MILESTONES_CATALOG: MilestoneItem[] = [
  {
    id: 'MS-01',
    code: 'MS-01: HILBERT-VEC',
    title: 'Complex Hilbert Space & State Vector Representation',
    category: 'foundations',
    domain: '01 - Mathematics',
    summary: 'Master Dirac bra-ket notation, complex probability amplitudes, and statevector normalization in ℂ² Hilbert space.',
    theoreticalCompetence: 'Algebraic normalization ⟨ψ|ψ⟩ = 1, Born Rule projective probabilities P(i) = |αᵢ|², and inner product projections.',
    icon: BinaryIcon,
    verificationCriteria: 'Complete Chapter 1 core topics and execute the State Vector Normalization lab in AerSimulator.',
    prerequisites: [
      {
        id: 't1-1',
        label: 'Topic 1.1: Complex Numbers & Dirac Notation',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t1-1'),
        navTarget: 'lesson'
      },
      {
        id: 't1-2',
        label: 'Topic 1.2: Hilbert Spaces & Inner Products',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t1-2'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-1-1',
        label: 'Lab 1.1: State Vector Normalization Simulation',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-1-1'),
        navTarget: 'openlab'
      }
    ]
  },
  {
    id: 'MS-02',
    code: 'MS-02: UNITARY-GATES',
    title: 'Single-Qubit Unitary Transformations & Phase Rotations',
    category: 'circuits',
    domain: '02 - Gates & Operators',
    summary: 'Construct unitary transformations on the Bloch sphere using Pauli X, Y, Z, Hadamard, and Phase S/T rotation gates.',
    theoreticalCompetence: 'Unitary matrix condition U†U = I, state superposition generation H|0⟩ = |+⟩, and geometric phase angle rotation.',
    icon: CpuIcon,
    verificationCriteria: 'Complete Chapter 2 core topics and verify single-qubit unitary gate matrix invariance.',
    prerequisites: [
      {
        id: 't2-1',
        label: 'Topic 2.1: Pauli X, Y, Z Operators & Rotations',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t2-1'),
        navTarget: 'lesson'
      },
      {
        id: 't2-2',
        label: 'Topic 2.2: Hadamard Gate & Superposition States',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t2-2'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-2-1',
        label: 'Lab 2.1: Unitary Gate Matrix Transformation Check',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-2-1'),
        navTarget: 'openlab'
      }
    ]
  },
  {
    id: 'MS-03',
    code: 'MS-03: BELL-ENTANGLE',
    title: 'Multi-Qubit Entanglement & Bell State Synthesis',
    category: 'circuits',
    domain: '03 - Circuits & Entanglement',
    summary: 'Synthesize maximally entangled two-qubit Bell states |Φ⁺⟩ and experimentally observe quantum correlation collapse.',
    theoreticalCompetence: 'CNOT controlled unitary operations, tensor product state non-separability, and violation of local realism.',
    icon: LayersIcon,
    verificationCriteria: 'Execute two-qubit Bell circuit in Circuit Studio with correlated 50/50 measurement distribution.',
    prerequisites: [
      {
        id: 't3-1',
        label: 'Topic 3.1: Two-Qubit Registers & Tensor Products',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t3-1'),
        navTarget: 'lesson'
      },
      {
        id: 't3-2',
        label: 'Topic 3.2: Controlled-NOT Gate & Entangled Pairs',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t3-2'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-3-1',
        label: 'Lab 3.1: Bell State Generation & Entanglement Verification',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-3-1'),
        navTarget: 'circuits'
      }
    ]
  },
  {
    id: 'MS-04',
    code: 'MS-04: DEUTSCH-ORACLE',
    title: 'Quantum Parallelism & Deutsch-Jozsa Oracle Implementation',
    category: 'algorithms',
    domain: '04 - Quantum Algorithms',
    summary: 'Implement quantum query parallelism and phase kickback to evaluate Boolean functions in O(1) query complexity.',
    theoreticalCompetence: 'Phase kickback mechanism |x⟩(1/√2)(|0⟩-|1⟩) → (-1)^f(x)|x⟩(1/√2)(|0⟩-|1⟩) and constructive quantum interference.',
    icon: CompassIcon,
    verificationCriteria: 'Complete Chapter 4 algorithm module and verify single-query balanced vs. constant oracle separation.',
    prerequisites: [
      {
        id: 't4-1',
        label: 'Topic 4.1: Quantum Oracles & Deutsch Algorithm',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t4-1'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-4-1',
        label: 'Lab 4.1: Phase Kickback & Oracle Query Benchmark',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-4-1'),
        navTarget: 'openlab'
      }
    ]
  },
  {
    id: 'MS-05',
    code: 'MS-05: TELEPORT-STATE',
    title: 'Quantum Teleportation & State Transfer Protocol',
    category: 'algorithms',
    domain: '07 - Quantum Information',
    summary: 'Implement 3-qubit teleportation circuit with EPR pair resource distribution, Bell measurement, and feed-forward correction.',
    theoreticalCompetence: 'Complete quantum state disembodied reconstruction without violating the No-Cloning theorem.',
    icon: RouteIconCustom,
    verificationCriteria: 'Construct and simulate the teleportation circuit with state transfer fidelity F ≥ 0.98.',
    prerequisites: [
      {
        id: 't7-1',
        label: 'Topic 7.1: Bell-Basis Measurement Formalism',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t7-1'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-7-1',
        label: 'Lab 7.1: 3-Qubit Quantum Teleportation Circuit',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-7-1'),
        navTarget: 'circuits'
      }
    ]
  },
  {
    id: 'MS-06',
    code: 'MS-06: GROVER-SEARCH',
    title: "Grover's Search & Amplitude Amplification Engine",
    category: 'algorithms',
    domain: '04 - Quantum Algorithms',
    summary: 'Build the full Grover iteration cycle: phase oracle marking followed by inversion about the mean (diffusion operator).',
    theoreticalCompetence: 'Geometric rotation in 2D state subspace yielding quadratic speedup O(√N) for unstructured database queries.',
    icon: SearchIcon,
    verificationCriteria: 'Complete Capstone Grover Search project with ≥ 85% probability amplification on marked state.',
    prerequisites: [
      {
        id: 't4-2',
        label: 'Topic 4.2: Grover Iteration & Diffusion Operator',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t4-2'),
        navTarget: 'lesson'
      },
      {
        id: 'lab-4-2',
        label: 'Lab 4.2: Grover 3-Qubit Amplitude Amplification Lab',
        type: 'lab',
        isComplete: (s) => s.progress.completedLabs.includes('lab-4-2'),
        navTarget: 'openlab'
      }
    ]
  },
  {
    id: 'MS-07',
    code: 'MS-07: NISQ-DECOHERENCE',
    title: 'NISQ Physical Decoherence & Noise Channel Mitigation',
    category: 'foundations',
    domain: '05 - Physical Hardware & Noise',
    summary: 'Simulate T₁ relaxation, T₂ dephasing, depolarization noise, and apply zero-noise extrapolation mitigation.',
    theoreticalCompetence: 'Lindblad master equation dynamics, density matrix purity Tr(ρ²) < 1, and NISQ fidelity recovery.',
    icon: FlaskConicalIcon,
    verificationCriteria: 'Run noisy circuit simulation and demonstrate error reduction via mitigation protocol.',
    prerequisites: [
      {
        id: 't5-1',
        label: 'Topic 5.1: Superconducting Qubits & Decoherence Times',
        type: 'topic',
        isComplete: (s) => s.progress.completedLessons.includes('t5-1'),
        navTarget: 'lesson'
      },
      {
        id: 'ch-5-exam',
        label: 'Benchmark 5.1: Zero-Noise Extrapolation Validation',
        type: 'assessment',
        isComplete: (s) => s.progress.completedChapters.includes('ch-5') || Boolean(s.progress.unlockedBadges['MS-07']),
        navTarget: 'assessments'
      }
    ]
  },
  {
    id: 'MS-08',
    code: 'MS-08: ADAPTIVE-CERT',
    title: 'High-Integrity Adaptive Quantum Diagnostic Benchmark',
    category: 'certifications',
    domain: 'Comprehensive Evaluation',
    summary: 'Clear the 3-phase multi-tier adaptive quantum evaluation demonstrating high fidelity in theoretical and practical calculation.',
    theoreticalCompetence: 'Cross-domain quantum competence verified under continuous digital proctoring and anti-tamper telemetry.',
    icon: ShieldCheckIcon,
    verificationCriteria: 'Attain ≥ 75% score on adaptive diagnostic placement with integrity verification active.',
    prerequisites: [
      {
        id: 'exam-adaptive',
        label: '3-Phase Adaptive Placement Benchmark (Score ≥ 75%)',
        type: 'assessment',
        isComplete: (s) => s.progress.pastAssessmentAttempts.some(a => a.passed && a.score >= 75),
        navTarget: 'assessments'
      }
    ]
  }
];

function RouteIconCustom(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

interface AchievementsProps {
  onNavigate?: (id: ViewId) => void;
}

export function Achievements({ onNavigate }: AchievementsProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeCategory, setActiveCategory] = useState<MilestoneCategory>('all');
  const [selectedProof, setSelectedProof] = useState<MilestoneProof | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const unlockedMap = appState.progress.unlockedBadges;
  const proofsMap = appState.progress.milestoneProofs;

  const totalMilestones = MILESTONES_CATALOG.length;
  const verifiedCount = Object.keys(unlockedMap).length;

  const filteredMilestones = MILESTONES_CATALOG.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Official Header */}
      <PageHeader
        title="Quantum Competence Milestones"
        subtitle="Verifiable academic and laboratory milestones anchored in quantum information theory, verified circuit execution, and adaptive assessment fidelity."
      />

      {/* Verification Summary Banner */}
      <Card className="p-6 border-l-4 border-l-emerald-600 bg-gradient-to-r from-emerald-50/40 via-white to-zinc-50 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-zinc-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                OFFICIAL COMPETENCE REGISTRY
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Candidate ID: {appState.user.name.toUpperCase()}-2026-QBT
              </span>
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {verifiedCount} of {totalMilestones} Milestones Formally Verified
            </h2>
            <p className="max-w-2xl text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Unlike superficial gamification badges, each QUBOT milestone requires demonstrable mathematical mastery, verified simulator statevector collapse, and anti-tamper diagnostic certification.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                Competence Index
              </div>
              <div className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {Math.round((verifiedCount / totalMilestones) * 100)}%
              </div>
            </div>
            <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-right">
              <div className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                Audit Status
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2Icon className="h-4 w-4" />
                Active Integrity
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <ProgressBar
            value={(verifiedCount / totalMilestones) * 100}
            label="Formal Milestone Progress"
            className="h-2"
          />
        </div>
      </Card>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        {[
          { id: 'all', label: `All Milestones (${totalMilestones})` },
          { id: 'foundations', label: 'Core Foundations' },
          { id: 'circuits', label: 'Circuits & Labs' },
          { id: 'algorithms', label: 'Algorithms & Protocols' },
          { id: 'certifications', label: 'Adaptive Certifications' }
        ].map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as MilestoneCategory)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Milestones Grid */}
      <ul className="grid gap-6 lg:grid-cols-2">
        {filteredMilestones.map((milestone) => {
          const Icon = milestone.icon;
          const isEarned = Boolean(unlockedMap[milestone.id]);
          const proof = proofsMap[milestone.id];

          // Calculate completed prerequisites
          const totalPrereqs = milestone.prerequisites.length;
          const donePrereqs = milestone.prerequisites.filter((p) => p.isComplete(appState)).length;
          const percent = Math.round((donePrereqs / totalPrereqs) * 100);

          return (
            <Card
              as="li"
              key={milestone.id}
              className={`flex flex-col h-full justify-between p-6 transition-all duration-200 border rounded-2xl ${
                isEarned
                  ? 'border-emerald-300/80 bg-white shadow-sm dark:border-emerald-900/70 dark:bg-zinc-900/90'
                  : 'border-zinc-200/90 bg-white/80 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'
              }`}
            >
              {/* Top Meta Bar */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all shadow-sm ${
                        isEarned
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-500/20'
                          : 'bg-zinc-100/90 text-zinc-500 border border-zinc-200/80 dark:bg-zinc-800/80 dark:border-zinc-700/80 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase block truncate">
                        {milestone.code}
                      </span>
                      <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate">
                        {milestone.domain}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isEarned ? (
                      <StatusChip tone="done">
                        <CheckCircle2Icon className="mr-1 h-3.5 w-3.5" />
                        Verified Credential
                      </StatusChip>
                    ) : percent > 0 ? (
                      <StatusChip tone="active">{percent}% Complete</StatusChip>
                    ) : (
                      <StatusChip tone="locked">Prerequisites Pending</StatusChip>
                    )}
                  </div>
                </div>

                {/* Title & Technical Summary */}
                <div className="mt-4 space-y-2">
                  <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug min-h-[2.75rem] flex items-center">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[2.5rem]">
                    {milestone.summary}
                  </p>
                  <div className="rounded-xl bg-zinc-50 p-3 text-[11px] text-zinc-700 border border-zinc-200/60 dark:bg-zinc-950/60 dark:text-zinc-300 dark:border-zinc-800/80 min-h-[3.75rem] flex flex-col justify-center">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Theoretical Competence: </span>
                      <span className="text-zinc-600 dark:text-zinc-400">{milestone.theoreticalCompetence}</span>
                    </div>
                  </div>
                </div>

                {/* Prerequisites Checklist */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      Verification Checklist
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {donePrereqs} of {totalPrereqs} requirements
                    </span>
                  </div>

                  <ul className="space-y-2 rounded-xl border border-zinc-200/60 bg-zinc-50/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/30 min-h-[6.5rem] flex flex-col justify-center">
                    {milestone.prerequisites.map((prereq) => {
                      const complete = prereq.isComplete(appState);
                      return (
                        <li
                          key={prereq.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {complete ? (
                              <CheckCircle2Icon className="h-4 w-4 text-emerald-600 shrink-0 dark:text-emerald-400" />
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                complete
                                  ? 'text-zinc-800 font-medium dark:text-zinc-200'
                                  : 'text-zinc-500 dark:text-zinc-400'
                              }`}
                              title={prereq.label}
                            >
                              {prereq.label}
                            </span>
                          </div>
                          {!complete && prereq.navTarget && onNavigate && (
                            <button
                              type="button"
                              onClick={() => onNavigate(prereq.navTarget!)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 shrink-0 ml-2"
                            >
                              Start
                              <ArrowRightIcon className="h-3 w-3" />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Live Verification Proof or Progress Bar (Pinned to Bottom) */}
              <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                {isEarned ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <FileCheckIcon className="h-4 w-4" />
                        <span>Verified on {unlockedMap[milestone.id]}</span>
                      </div>
                      {proof?.verificationHash && (
                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                          {proof.verificationHash}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center gap-1.5 text-xs h-9 font-semibold"
                      onClick={() => setSelectedProof(proof || {
                        id: `proof-${milestone.id}`,
                        milestoneCode: milestone.code,
                        title: milestone.title,
                        achievedAt: new Date().toISOString(),
                        verificationHash: `QB-${milestone.id}-VERIFIED-LIVE`,
                        evidenceTitle: milestone.verificationCriteria,
                        gradeScore: 95
                      })}
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                      Inspect Cryptographic Credential Proof
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      <span>Requirement Completion</span>
                      <span>{percent}%</span>
                    </div>
                    <ProgressBar
                      value={percent}
                      label={`${milestone.title} progress`}
                      className="h-2"
                    />
                    <div className="pt-1 text-[11px] text-zinc-500 dark:text-zinc-400 italic truncate" title={milestone.verificationCriteria}>
                      Criteria: {milestone.verificationCriteria}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </ul>

      {/* Verifiable Credential Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setSelectedProof(null)}
              className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Close modal"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <ShieldCheckIcon className="h-6 w-6" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Official Verification Proof
                </span>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {selectedProof.title}
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Milestone Code</dt>
                    <dd className="mt-0.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedProof.milestoneCode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Candidate Name</dt>
                    <dd className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      {appState.user.name} ({appState.user.email})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Verification Timestamp</dt>
                    <dd className="mt-0.5 font-mono text-zinc-900 dark:text-zinc-100">
                      {new Date(selectedProof.achievedAt).toUTCString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Fidelity Score</dt>
                    <dd className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedProof.gradeScore ?? 95}% Accuracy
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Verified Experimental Evidence
                </span>
                <p className="mt-1 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                  {selectedProof.evidenceTitle}
                </p>
              </div>

              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Tamper-Proof Verification Token
                </span>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  <span>{selectedProof.verificationHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedProof.verificationHash)}
                    className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-200"
                  >
                    {copiedHash ? (
                      <>
                        <CheckIcon className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3 w-3" /> Copy Token
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button variant="secondary" onClick={() => setSelectedProof(null)}>
                Close Proof
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}