import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ClockIcon, PlayIcon, CheckIcon, SparklesIcon, FlameIcon, ZapIcon, CpuIcon, CheckCircle2Icon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { learner, courses, todaysPlan, type ViewId } from '../data/appData';
import { apiClient, type AdaptiveRoadmap } from '../services/apiClient';

type DashboardProps = {
  onNavigate: (id: ViewId) => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [adaptiveRoadmap, setAdaptiveRoadmap] = useState<AdaptiveRoadmap | null>(null);
  const [qubotMessage, setQubotMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      apiClient.getAdaptiveRoadmap(),
      apiClient.getCourses(),
      apiClient.getQubotState()
    ]).then(([roadmapRes, _coursesRes, qubotRes]) => {
      if (!mounted) return;
      if (roadmapRes.status === 'fulfilled' && roadmapRes.value?.topological_sequence) {
        setAdaptiveRoadmap(roadmapRes.value);
      }
      if (qubotRes.status === 'fulfilled' && qubotRes.value?.message) {
        setQubotMessage(qubotRes.value.message);
      }
      setIsSyncing(false);
    });

    return () => { mounted = false; };
  }, []);

  const current = courses[0];
  const minutesToday = todaysPlan.reduce((sum, item) => sum + item.minutes, 0);
  const doneToday = todaysPlan.filter((item) => item.done).length;

  const nextConcept = adaptiveRoadmap?.recommended_next_concept 
    ? adaptiveRoadmap.recommended_next_concept.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Phase Kickback & Entanglement';

  return (
    <div className="w-full min-w-0 space-y-8 py-2 antialiased">
      
      {/* Top Context Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#f5d626] ring-4 ring-yellow-100 animate-pulse" />
          <span className="text-sm font-mono font-bold tracking-wider uppercase text-[#4c1d70]">
            Active Quantum Learning Workspace {isSyncing ? '· Syncing Engine...' : '· BKT Sync Active'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-900 border border-purple-200 font-orbitron text-[13px] font-bold">
            Level 4: Quantum Explorer
          </span>
          <span className="font-poppins text-amber-600 font-semibold flex items-center gap-1.5">
            <FlameIcon className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span><strong className="font-orbitron font-bold text-amber-700 dark:text-[#f5d626]">7</strong> Day Streak</span>
          </span>
        </div>
      </div>

      {/* 1. EDITORIAL GREETING (Integrated directly on canvas, zero box) */}
      <div className="relative pt-1 pb-2">
        <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#1a052e] dark:text-white leading-tight">
          Welcome back, {learner.name}. <span className="text-[#d8a800] dark:text-[#f5d626]">{nextConcept}</span> is unlocked.
        </h1>
        <p className="font-poppins mt-2 text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {qubotMessage || `Your curriculum path today takes about ${minutesToday} minutes. Complete worked matrix examples to advance in the DAG constellation.`}
        </p>
        {adaptiveRoadmap && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-bold flex items-center gap-1">
              <CheckCircle2Icon className="h-3 w-3" />
              {adaptiveRoadmap.mastered_concepts.length} Mastered Nodes
            </span>
            <span className="rounded-md bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 font-bold">
              {adaptiveRoadmap.strictly_unlocked.length} Reachable in DAG
            </span>
          </div>
        )}
      </div>

      {/* 2. MAIN TWO-COLUMN EDITORIAL SURFACE (67% / 33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-2">
        
        {/* LEFT COLUMN: PRIMARY LEARNING STREAM (8 cols / ~67%) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* A. ACTIVE LESSON (Continuous Editorial Unit - ZERO Card Box) */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#4c1d70] dark:text-purple-300">
                  Unit 03 • Lesson 8 of {current.lessonsTotal}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-500 dark:text-zinc-400">{current.title}</span>
              </div>
              <span className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5" />
                {current.minutesLeft} min left in matrix unitary
              </span>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-[#1a052e] dark:text-white tracking-tight">
                Phase gates and rotations
              </h2>
              <p className="font-poppins mt-2 text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                You stopped halfway through analyzing the Z-axis phase evolution matrix <code className="font-mono text-sm bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded border border-purple-200/80 dark:border-purple-800/40">U(θ, φ)</code>. Resume to derive relative phase interference on state <span className="font-mono text-sm text-purple-900 dark:text-purple-300 font-semibold">|+⟩</span>.
              </p>
            </div>

            {/* Inline Minimal Progress Bar & Action */}
            <div className="pt-2 space-y-3 w-full">
              <div className="flex justify-between text-sm font-poppins text-slate-500 dark:text-zinc-400">
                <span>{current.lessonsDone} of {current.lessonsTotal} completed</span>
                <span className="font-orbitron font-bold text-[#4c1d70] dark:text-[#f5d626]">58% Done</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-[#4c1d70] transition-all duration-700 ease-out"
                  style={{ width: `${(current.lessonsDone / current.lessonsTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => onNavigate('lesson')}
                className="inline-flex items-center gap-2 rounded-full bg-[#4c1d70] px-6 py-2.5 text-sm font-orbitron font-bold text-white hover:bg-[#3b1458] active:scale-95 transition-all shadow-sm group/btn"
              >
                <span>Resume Lesson 8</span>
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 text-[#f5d626]" />
              </Button>
            </div>
          </section>

          {/* B. TODAY'S SCHEDULED AGENDA (Continuous Editorial List) */}
          <section className="pt-2 space-y-4">
            <div className="flex items-baseline justify-between border-b border-purple-100/80 dark:border-zinc-800 pb-2.5">
              <div className="flex items-center gap-3">
                <h3 className="font-orbitron text-lg sm:text-xl font-bold text-[#1a052e] dark:text-white tracking-tight">Today's Agenda</h3>
                <span className="font-orbitron text-sm font-semibold text-slate-500">
                  ({doneToday}/{todaysPlan.length} completed)
                </span>
              </div>
              <span className="text-sm font-mono text-slate-500">Est. ~{minutesToday} mins</span>
            </div>

            <div className="divide-y divide-purple-100/70 border-b border-purple-100/70">
              {todaysPlan.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-4 py-3.5 px-1 transition-colors hover:bg-purple-50/30"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                        item.done
                          ? 'bg-emerald-500 text-white'
                          : 'border border-slate-300 text-transparent group-hover:border-[#4c1d70]'
                      }`}
                    >
                      <CheckIcon className="h-3 w-3 stroke-[3]" />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-base font-medium transition-colors ${
                          item.done
                            ? 'text-slate-400 line-through'
                            : 'text-[#1a052e] group-hover:text-[#4c1d70]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[13px] font-mono text-slate-500">
                        <span className="text-[#4c1d70] font-semibold">{item.kind}</span> • {item.minutes} min
                      </p>
                    </div>
                  </div>

                  {item.done ? (
                    <span className="text-sm font-mono text-emerald-600 font-medium shrink-0">Done ✓</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate(item.kind === 'Practice' ? 'practice' : 'lesson')}
                      className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-[#4c1d70] hover:text-purple-900 bg-purple-50/80 hover:bg-purple-100/80 px-3 py-1 rounded-md transition-all active:scale-95"
                    >
                      <span>Start</span>
                      <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* C. CURRICULUM MILESTONE NOTE (Editorial Left-Accent Note - ZERO Card Box) */}
          <section className="border-l-2 border-[#4c1d70] pl-5 py-1 space-y-2">
            <div className="flex items-center gap-2 text-sm font-mono text-[#4c1d70] font-semibold">
              <SparklesIcon className="h-3.5 w-3.5 text-[#d8a800]" />
              <span>Next Milestone • ~15 mins</span>
            </div>
            <h4 className="text-lg font-bold text-[#1a052e]">
              2-Qubit Entanglement & Bell Pairs
            </h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              You've cleared linear algebra and single-qubit rotations. Building Bell states <code className="font-mono text-sm bg-purple-50 text-purple-900 px-1 rounded border border-purple-200/80">|Φ+⟩ = (|00⟩+|11⟩)/√2</code> and CNOT logic will land easily.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onNavigate('path')}
                className="text-sm font-semibold text-[#4c1d70] hover:underline inline-flex items-center gap-1 group/link"
              >
                <span>Explore Milestone Pathway</span>
                <ArrowRightIcon className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </button>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SINGLE UNIFIED TELEMETRY RAIL (4 cols / ~33%) */}
        {/* Handcrafted sidebar with clean dividers instead of 3 floating white card boxes! */}
        <aside className="lg:col-span-4 space-y-8 lg:border-l lg:border-purple-100/80 lg:pl-8">
          
          {/* 1. Study Velocity */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-purple-100/80 pb-2">
              <h3 className="text-base font-bold text-[#1a052e] tracking-tight">Study Velocity</h3>
              <span className="text-sm font-mono font-semibold text-amber-600 flex items-center gap-1">
                <FlameIcon className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                {learner.streakDays} Days
              </span>
            </div>

            {/* 7-Day Sparkline Bar Chart */}
            <div className="space-y-2">
              <div className="flex h-20 items-end justify-between gap-2 px-1">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-200" style={{ height: '35%' }} />
                  <span className="text-xs font-mono text-slate-400">M</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-300" style={{ height: '50%' }} />
                  <span className="text-xs font-mono text-slate-400">T</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-200" style={{ height: '40%' }} />
                  <span className="text-xs font-mono text-slate-400">W</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-[#4c1d70]" style={{ height: '95%' }} />
                  <span className="text-xs font-mono font-bold text-[#4c1d70]">T</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-400" style={{ height: '65%' }} />
                  <span className="text-xs font-mono text-slate-400">F</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-200" style={{ height: '30%' }} />
                  <span className="text-xs font-mono text-slate-400">S</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-purple-300" style={{ height: '45%' }} />
                  <span className="text-xs font-mono text-slate-400">S</span>
                </div>
              </div>

              <p className="text-center text-[13px] font-mono text-slate-500">
                Peak: <strong className="text-[#4c1d70]">82 min</strong> on Thursday
              </p>
            </div>

            {/* Clean Data Stat Row */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-purple-100/70 text-left">
              <div>
                <div className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">Weekly Time</div>
                <div className="text-xl font-bold font-orbitron text-[#1a052e] dark:text-white">10.8 <span className="text-sm font-normal text-slate-500 font-poppins">hrs</span></div>
              </div>
              <div>
                <div className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">Accuracy</div>
                <div className="text-xl font-bold font-orbitron text-emerald-600">91%</div>
              </div>
            </div>
          </div>

          {/* 2. Concept Readiness Telemetry */}
          <div className="space-y-3.5 pt-2 border-t border-purple-100/80">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold font-orbitron text-[#1a052e] dark:text-white tracking-tight">Concept Telemetry</h3>
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Live Mastery</span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-zinc-300">Linear Algebra & Dirac</span>
                  <span className="font-orbitron text-emerald-600 font-semibold">94%</span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-zinc-300">Phase Gates & Rotations</span>
                  <span className="font-orbitron text-[#4c1d70] dark:text-[#f5d626] font-semibold">78%</span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-[#4c1d70]" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-zinc-300">Quantum Entanglement</span>
                  <span className="font-orbitron text-amber-600 font-semibold">40%</span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Direct Lab Access (Hand-Crafted Clean Links - Zero Floating Card Box) */}
          <div className="space-y-2 pt-2 border-t border-purple-100/80">
            <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-purple-900">
              <ZapIcon className="h-3.5 w-3.5 text-[#d8a800]" />
              <span>Interactive Workspace</span>
            </div>
            
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('circuits')}
                className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-purple-50/60 transition flex items-center justify-between text-sm font-medium text-slate-700 hover:text-[#4c1d70] group"
              >
                <span className="flex items-center gap-2">
                  <CpuIcon className="h-3.5 w-3.5 text-[#4c1d70]" />
                  <span>Open Circuit Builder</span>
                </span>
                <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#4c1d70] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-purple-50/60 transition flex items-center justify-between text-sm font-medium text-slate-700 hover:text-[#4c1d70] group"
              >
                <span className="flex items-center gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-[#d8a800]" />
                  <span>Explore Quantum Tracks</span>
                </span>
                <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#4c1d70] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
