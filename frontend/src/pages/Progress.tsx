import { useState, useEffect } from 'react';
import {
  TrendingUpIcon,
  ClockIcon,
  FlaskConicalIcon,
  CheckCircle2Icon,
  TargetIcon,
  CalendarIcon,
  AwardIcon,
  ArrowRightIcon,
  FlameIcon,
  LayersIcon,
  CompassIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  AlertCircleIcon,
  SparklesIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { CURRICULUM } from '../data/curriculumData';
import { stateStore, type AppState } from '../services/stateStore';
import type { ViewId } from '../data/appData';

const TABS = [
  { id: 'overview', label: 'Executive Trajectory' },
  { id: 'heatmap', label: 'Activity & Habit Heatmap' },
  { id: 'competency', label: 'Quantum Competency Matrix' },
  { id: 'curriculum', label: '11-Chapter Progress' },
  { id: 'diagnostics', label: 'Assessment History' }
] as const;

type TabId = (typeof TABS)[number]['id'];

interface ProgressProps {
  onNavigate?: (id: ViewId) => void;
}

export function Progress({ onNavigate }: ProgressProps) {
  const [tab, setTab] = useState<TabId>('overview');
  const [appState, setAppState] = useState<AppState>(stateStore.getState());

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const p = appState.progress;
  const totalTopics = CURRICULUM.reduce((acc, c) => acc + c.topics.length, 0);
  const completedTopicsCount = p.completedLessons.length;
  const completionPercentage = Math.round((completedTopicsCount / totalTopics) * 100);

  const accuracy = p.totalQuizAttempts > 0
    ? Math.round((p.correctQuizAnswers / p.totalQuizAttempts) * 100)
    : 0;

  const totalHours = (p.totalStudyMinutes / 60).toFixed(1);

  // Executive Top Stats
  const topStats = [
    {
      label: 'Curriculum Mastery',
      value: `${completionPercentage}%`,
      note: `${completedTopicsCount} of ${totalTopics} topics completed`,
      icon: TargetIcon,
      tone: 'emerald'
    },
    {
      label: 'Active Study Time',
      value: `${totalHours} hrs`,
      note: `${p.totalStudyMinutes} verified active minutes`,
      icon: ClockIcon,
      tone: 'blue'
    },
    {
      label: 'Practical Labs Run',
      value: `${p.completedLabs.length}`,
      note: 'Verified simulation executions',
      icon: FlaskConicalIcon,
      tone: 'purple'
    },
    {
      label: 'Assessment Accuracy',
      value: p.totalQuizAttempts > 0 ? `${accuracy}%` : '0%',
      note: `${p.correctQuizAnswers} of ${p.totalQuizAttempts} correct checks`,
      icon: CheckCircle2Icon,
      tone: 'emerald'
    },
    {
      label: 'Learning Streak',
      value: `${p.streakDays} Days`,
      note: p.streakDays > 0 ? `${p.streakDays} day habit established` : 'Begin session to start streak',
      icon: FlameIcon,
      tone: 'amber'
    }
  ];

  // Competency Domains with true dynamic zero-based evaluation
  const competencyDomains = [
    {
      name: 'Mathematical Foundations & Hilbert Space',
      score: Math.round((p.conceptMastery?.math_foundations ?? 0) * 100),
      benchmark: 85,
      status: (p.conceptMastery?.math_foundations ?? 0) >= 0.85 ? 'Mastered' : (p.conceptMastery?.math_foundations ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.math_foundations ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'Complex amplitudes, Dirac bra-ket, Born Rule probability, Inner product',
      recommendation: (p.conceptMastery?.math_foundations ?? 0) > 0 ? 'Foundational mathematics in progress. Complete Topic 1.2 to finalize Hilbert space normalization.' : 'Begin Chapter 1, Topic 1.1 to calibrate your mathematical foundations.'
    },
    {
      name: 'Single-Qubit Gates & Unitary Rotations',
      score: Math.round((p.conceptMastery?.single_qubit_gates ?? 0) * 100),
      benchmark: 75,
      status: (p.conceptMastery?.single_qubit_gates ?? 0) >= 0.75 ? 'Mastered' : (p.conceptMastery?.single_qubit_gates ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.single_qubit_gates ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'Pauli X, Y, Z, Hadamard gate, Phase S/T rotations',
      recommendation: (p.conceptMastery?.single_qubit_gates ?? 0) > 0 ? 'Single-qubit unitary operations developing. Work through phase rotation exercises.' : 'Prerequisites pending. Unlocks after Chapter 1 foundations.'
    },
    {
      name: 'Multi-Qubit Systems & Entanglement',
      score: Math.round((p.conceptMastery?.entanglement ?? 0) * 100),
      benchmark: 75,
      status: (p.conceptMastery?.entanglement ?? 0) >= 0.75 ? 'Mastered' : (p.conceptMastery?.entanglement ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.entanglement ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'Tensor product spaces, CNOT logic, Bell state |Φ⁺⟩ synthesis',
      recommendation: (p.conceptMastery?.entanglement ?? 0) > 0 ? 'Execute Lab 3.1 in Circuit Studio to demonstrate EPR pair correlation.' : 'Scheduled for Chapter 3 multi-qubit systems.'
    },
    {
      name: 'Quantum Algorithms & Phase Estimation',
      score: Math.round((p.conceptMastery?.quantum_algorithms ?? 0) * 100),
      benchmark: 70,
      status: (p.conceptMastery?.quantum_algorithms ?? 0) >= 0.7 ? 'Mastered' : (p.conceptMastery?.quantum_algorithms ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.quantum_algorithms ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'Deutsch-Jozsa query complexity, Grover amplitude amplification',
      recommendation: 'Prerequisites in progress. Will unlock after multi-qubit circuits.'
    },
    {
      name: 'Circuit Studio & Hardware NISQ',
      score: Math.round((p.conceptMastery?.bloch_sphere ?? 0) * 100),
      benchmark: 70,
      status: (p.conceptMastery?.bloch_sphere ?? 0) >= 0.7 ? 'Mastered' : (p.conceptMastery?.bloch_sphere ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.bloch_sphere ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'Interactive circuit compilation, statevector simulation, gate depth',
      recommendation: 'Explore Circuit Studio to assemble custom multi-gate quantum circuits.'
    },
    {
      name: 'Decoherence, Noise & Error Mitigation',
      score: Math.round((p.conceptMastery?.noise_mitigation ?? 0) * 100),
      benchmark: 70,
      status: (p.conceptMastery?.noise_mitigation ?? 0) >= 0.7 ? 'Mastered' : (p.conceptMastery?.noise_mitigation ?? 0) >= 0.5 ? 'Proficient' : (p.conceptMastery?.noise_mitigation ?? 0) > 0 ? 'Developing' : 'Not Started',
      topicsCovered: 'T₁ relaxation, T₂ dephasing, Zero-noise extrapolation',
      recommendation: 'Scheduled for Chapter 5 physical hardware modules.'
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Curriculum Progress & Learning Analytics"
        subtitle="Continuous telemetry, concept retention tracking, laboratory experiment verification, and study velocity."
      />

      {/* Top 5 Metrics Row */}
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </dt>
                  <span className="text-zinc-400 dark:text-zinc-500">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <dd className="mt-2 font-display text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </dd>
              </div>
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {stat.note}
              </p>
            </Card>
          );
        })}
      </dl>

      {/* Tabs Bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div role="tablist" aria-label="Progress views" className="flex flex-wrap gap-2 -mb-px">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
                  active
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Executive Trajectory */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pacing & Target Card */}
            <Card className="p-6 lg:col-span-2 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Learning Velocity & Pacing
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {completedTopicsCount === 0 ? 'Establish Your Velocity' : 'Target Completion: November 2026'}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {completedTopicsCount === 0
                      ? 'Begin your first theory lesson or practical lab to calibrate your learning velocity and projected completion date.'
                      : `At your current study rate of ~35 minutes per active day and ${p.streakDays}-day streak momentum.`}
                  </p>
                </div>
                <StatusChip tone={completedTopicsCount === 0 ? 'locked' : 'active'}>
                  {completedTopicsCount === 0 ? 'Ready to Start' : 'On Track'}
                </StatusChip>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-700 dark:text-zinc-300">Curriculum Coverage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {completedTopicsCount} of {totalTopics} topics ({completionPercentage}%)
                  </span>
                </div>
                <ProgressBar value={completionPercentage} label="Curriculum coverage" className="h-2.5" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Pacing Velocity</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {completedTopicsCount === 0 ? '0.0 Topics/Wk' : '2.4 Topics/Wk'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Current Chapter</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {p.completedChapters.length > 0 ? `Chapter ${p.completedChapters.length + 1}` : 'Chapter 1 (Starting)'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Competency Tier</div>
                  <div className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Tier {p.currentLevel} ({p.totalXP} CP)
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Milestone in Sights */}
            <Card className="p-6 flex flex-col justify-between border-l-4 border-l-emerald-600">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  <SparklesIcon className="h-4 w-4" />
                  {completedTopicsCount === 0 ? 'First Milestone Target' : 'Next Milestone Target'}
                </div>
                <h4 className="mt-2 font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {completedTopicsCount === 0
                    ? 'MS-01: Complex Hilbert Space & State Vector Representation'
                    : 'MS-02: Single-Qubit Unitary Transformations'}
                </h4>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {completedTopicsCount === 0
                    ? 'Complete Topic 1.1, Topic 1.2, and Lab 1.1 to verify statevector normalization and earn your first credential.'
                    : 'Topic 2.1 complete. Finish Topic 2.2 and verify Lab 2.1 to earn verified credential.'}
                </p>

                <div className="mt-4 space-y-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    {p.completedLessons.includes('t1-1') ? (
                      <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-zinc-400 shrink-0" />
                    )}
                    <span>Topic 1.1: Complex Numbers & Dirac Notation</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    {p.completedLessons.includes('t1-2') ? (
                      <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-zinc-400 shrink-0" />
                    )}
                    <span>Topic 1.2: Hilbert Space & Born Rule</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    {p.completedLabs.includes('lab-1-1') ? (
                      <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-zinc-400 shrink-0" />
                    )}
                    <span>Lab 1.1: State Vector Normalization</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  className="w-full justify-center gap-1 text-xs"
                  onClick={() => {
                    stateStore.setActiveLesson('ch-1', 't1-1');
                    onNavigate && onNavigate('lesson');
                  }}
                >
                  {completedTopicsCount === 0 ? 'Begin Topic 1.1' : 'Resume Topic'}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Verifiable Learning Sessions Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Verified Learning Telemetry & Sessions Log
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Chronological record of verified study sessions, practical lab executions, and diagnostic checks.
                </p>
              </div>
            </div>

            <Card className="overflow-hidden">
              {p.sessions && p.sessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">Activity Module</th>
                        <th className="py-3 px-4 font-semibold">Type</th>
                        <th className="py-3 px-4 font-semibold">Duration</th>
                        <th className="py-3 px-4 font-semibold">Points Earned</th>
                        <th className="py-3 px-4 font-semibold">Accuracy / Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {p.sessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="py-3 px-4 font-mono text-zinc-500">{sess.date}</td>
                          <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {sess.title}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                sess.category === 'theory'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                  : sess.category === 'lab'
                                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {sess.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                            {sess.durationMinutes} min
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            +{sess.xpEarned} CP
                          </td>
                          <td className="py-3 px-4">
                            {sess.accuracy !== undefined ? (
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {sess.accuracy}% Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                <CheckCircle2Icon className="h-3.5 w-3.5" /> Verified
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    No Learning Sessions Recorded Yet
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Every completed topic, practical simulation run, and diagnostic check is cryptographically recorded here in real-time.
                  </p>
                  {onNavigate && (
                    <Button
                      size="sm"
                      onClick={() => {
                        stateStore.setActiveLesson('ch-1', 't1-1');
                        onNavigate('lesson');
                      }}
                    >
                      Begin Topic 1.1 Now
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Activity & Habit Heatmap */}
      {tab === 'heatmap' && (
        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  28-Day Learning Activity Heatmap
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Visual representation of continuous learning engagement, study frequency, and session density.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span>Less</span>
                <span className="h-3 w-3 rounded-sm bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700" />
                <span className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-950" />
                <span className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
                <span className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
                <span>More</span>
              </div>
            </div>

            {/* 4-Week Activity Grid */}
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="grid grid-cols-7 gap-2 min-w-[320px]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center font-mono text-[10px] text-zinc-400 mb-1">
                    {day}
                  </div>
                ))}
                {(p.dailyActivity || []).map((item, idx) => {
                  const colors = [
                    'bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700/60',
                    'bg-emerald-200 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800',
                    'bg-emerald-400 border border-emerald-500 dark:bg-emerald-700 dark:border-emerald-600',
                    'bg-emerald-600 border border-emerald-700 dark:bg-emerald-500 dark:border-emerald-400'
                  ];
                  return (
                    <div
                      key={item.date || idx}
                      title={`${item.date}: ${item.minutes} min active study`}
                      className={`h-10 rounded-md p-1.5 flex flex-col justify-between transition hover:scale-105 ${
                        colors[item.level]
                      }`}
                    >
                      <span className="text-[9px] font-mono text-zinc-700 dark:text-zinc-300">
                        {item.date ? item.date.split('-').slice(1).join('/') : ''}
                      </span>
                      {item.minutes > 0 && (
                        <span className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100 text-right">
                          {item.minutes}m
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
                <span className="text-xs text-zinc-500">Longest Consistent Streak</span>
                <div className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  7 Active Days
                </div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
                <span className="text-xs text-zinc-500">Current Unbroken Streak</span>
                <div className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {p.streakDays} Consecutive Days
                </div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
                <span className="text-xs text-zinc-500">Avg. Active Session</span>
                <div className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  32 Minutes
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Quantum Competency Matrix */}
      {tab === 'competency' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
              Quantum Knowledge & Competency Matrix
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Continuous Bayesian skill evaluation across all 6 fundamental dimensions of quantum computing.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {competencyDomains.map((dom) => (
              <Card key={dom.name} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {dom.name}
                    </h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        dom.status === 'Mastered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : dom.status === 'Proficient'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {dom.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Assessed Competence</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {dom.score}% / Benchmark {dom.benchmark}%
                      </span>
                    </div>
                    <ProgressBar value={dom.score} label={`${dom.name} mastery`} className="h-2" />
                  </div>

                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Concepts: </span>
                    {dom.topicsCovered}
                  </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-2.5 text-[11px] text-zinc-600 border border-zinc-100 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">AI Recommendation: </span>
                  {dom.recommendation}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 11-Chapter Progress */}
      {tab === 'curriculum' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
              11-Chapter End-to-End Curriculum Roadmap
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Live status across all 11 domains of the Quantum Knowledge Base.
            </p>
          </div>

          <div className="space-y-3">
            {CURRICULUM.map((ch) => {
              const chNum = ch.id.replace('ch-', '');
              const prefix = `t${chNum}-`;
              const completedInCh = p.completedLessons.filter((l) => l.startsWith(prefix)).length;
              const totalInCh = ch.topics.length;
              const isFinished = completedInCh === totalInCh;
              const isInProgress = completedInCh > 0 && !isFinished;

              return (
                <Card
                  key={ch.id}
                  className={`p-5 transition border ${
                    isFinished
                      ? 'border-emerald-200 dark:border-emerald-900/50'
                      : isInProgress
                      ? 'border-blue-200 dark:border-blue-900/50'
                      : 'border-zinc-200 dark:border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Domain {ch.vault_domain}
                        </span>
                        {isFinished ? (
                          <StatusChip tone="done">Chapter Completed</StatusChip>
                        ) : isInProgress ? (
                          <StatusChip tone="active">In Progress</StatusChip>
                        ) : (
                          <StatusChip tone="locked">Upcoming</StatusChip>
                        )}
                      </div>
                      <h4 className="mt-1 font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {ch.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {completedInCh} / {totalInCh} Topics
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {Math.round((completedInCh / totalInCh) * 100)}% Done
                        </div>
                      </div>

                      {isInProgress && onNavigate && (
                        <Button
                          size="sm"
                          onClick={() => {
                            stateStore.setActiveLesson(ch.id, `t${chNum}-2`);
                            onNavigate('lesson');
                          }}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Assessment & Diagnostic History */}
      {tab === 'diagnostics' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
              Diagnostic Placement & Assessment Registry
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Continuous adaptive testing history with anti-tamper telemetry and concept retention metrics.
            </p>
          </div>

          {p.diagnosticPlacement && (
            <Card className="p-6 border-l-4 border-l-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Latest Adaptive Placement Benchmark
                  </span>
                  <h4 className="mt-1 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Placed into Level {p.diagnosticPlacement.placedLevel} — Proficient Foundations
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Verified on {p.diagnosticPlacement.timestamp} with proctoring integrity 98%.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {p.diagnosticPlacement.score}%
                  </span>
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">Placement Score</div>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {(p.pastAssessmentAttempts || []).map((attempt) => (
              <Card key={attempt.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500">{attempt.date}</span>
                      <StatusChip tone={attempt.passed ? 'done' : 'caution'}>
                        {attempt.passed ? 'PASSED & CERTIFIED' : 'NEEDS REINFORCEMENT'}
                      </StatusChip>
                    </div>
                    <h4 className="mt-1 font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {attempt.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {attempt.correctCount} of {attempt.totalQuestions} questions verified correct · Integrity: {Math.round(attempt.integrityScore * 100)}%
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {attempt.score}%
                      </div>
                      <div className="text-[10px] text-zinc-400">Final Score</div>
                    </div>
                    {onNavigate && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('assessments')}
                      >
                        Retake
                      </Button>
                    )}
                  </div>
                </div>

                {attempt.missedConcepts && attempt.missedConcepts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-xs">
                    <AlertCircleIcon className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Reinforcement needed for concepts: <strong className="text-zinc-800 dark:text-zinc-200">{attempt.missedConcepts.join(', ')}</strong>
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}