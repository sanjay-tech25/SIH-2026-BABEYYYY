import React, { useState } from 'react';
import { weeklyMinutes, activity, skills, learner, courses } from '../data/appData';
import {
  TrendingUpIcon,
  FlameIcon,
  AwardIcon,
  BrainIcon,
  TargetIcon,
  CompassIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ClockIcon,
  BarChart3Icon
} from 'lucide-react';

const tabs = [
  { id: 'time', label: 'Study Velocity' },
  { id: 'consistency', label: 'Consistency Matrix' },
  { id: 'mastery', label: 'Skill Breakdown' }
] as const;

type TabId = (typeof tabs)[number]['id'];

const intensityClass = [
  'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
  'bg-purple-200 dark:bg-purple-800/40 border-purple-300 dark:border-purple-700/50',
  'bg-[#8942b0] dark:bg-[#7832a0] border-purple-400 text-white',
  'bg-[#4c1d70] dark:bg-[#5c2188] border-[#f5d626]/60 text-[#f5d626] shadow-[0_0_8px_rgba(245,214,38,0.4)]'
];

// 5-axis Quantum Radar Chart Data
const radarSkills = [
  { name: 'Linear Algebra', value: 95, color: '#10b981', category: 'Math Foundations' },
  { name: 'Bloch Sphere', value: 91, color: '#f5d626', category: 'Quantum State' },
  { name: 'Neural Nets', value: 88, color: '#8b5cf6', category: 'Machine Learning' },
  { name: 'Unitary Ops', value: 83, color: '#ec4899', category: 'Operators' },
  { name: 'Circuit Design', value: 71, color: '#3b82f6', category: 'Synthesis' },
  { name: 'Algorithms', value: 62, color: '#f97316', category: 'Complexity' },
];

// Level Milestone Steps
const levelMilestones = [
  { level: 1, name: 'Ground State', xp: 1000, status: 'completed' },
  { level: 2, name: 'Superposition', xp: 2000, status: 'completed' },
  { level: 3, name: 'Entanglement', xp: 3000, status: 'completed' },
  { level: 4, name: 'Quantum Explorer', xp: 4500, currentXp: 3450, status: 'current' },
  { level: 5, name: 'Coherence Master', xp: 6000, status: 'locked' },
  { level: 6, name: 'Algorithm Architect', xp: 8000, status: 'locked' }
];

export function Progress() {
  const [tab, setTab] = useState<TabId>('time');
  const [hoveredRadarIndex, setHoveredRadarIndex] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const peakMinutes = Math.max(...weeklyMinutes.map((d) => d.minutes));

  // Radar chart mathematical geometry
  const radarCenter = 140;
  const radarRadius = 100;
  const totalAxes = radarSkills.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = radarRadius * valueRatio;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle)
    };
  };

  const radarPolygonPoints = radarSkills
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.value / 100);
      return `${x},${y}`;
    })
    .join(' ');

  // XP Progress calculation for current level (Level 4: 3000 -> 4500 XP = 1500 XP span, current = 3450 -> 450 XP into level = 30%)
  const xpIntoCurrentLevel = learner.xp - 3000;
  const xpRequiredForLevel = 4500 - 3000;
  const levelProgressPct = Math.round((xpIntoCurrentLevel / xpRequiredForLevel) * 100);

  // Overall course progress
  const totalLessonsDone = courses.reduce((acc, c) => acc + c.lessonsDone, 0);
  const totalLessons = courses.reduce((acc, c) => acc + c.lessonsTotal, 0);
  const overallSyllabusPct = Math.round((totalLessonsDone / totalLessons) * 100);

  return (
    <div className="space-y-10 font-serif pb-12">
      {/* 1. Open Editorial Header */}
      <header className="border-b border-purple-200/70 dark:border-purple-900/40 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm mb-2">
          <span className="flex items-center gap-2 font-bold tracking-wide uppercase text-sm text-[#4c1d70] dark:text-[#f5d626]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5d626] animate-pulse shadow-[0_0_8px_#f5d626]" />
            Cognitive Telemetry • Bayesian Knowledge Tracing
          </span>
          <span className="rounded-full bg-purple-100 dark:bg-purple-950/80 px-3 py-1 text-sm font-semibold text-[#4c1d70] dark:text-purple-200 border border-purple-300/60 dark:border-purple-800">
            Current Tier: Level {learner.level} Explorer
          </span>
        </div>
        <h1 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-[#1a052e] dark:text-white">
          Learning Mastery & Retention Progress
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Real-time analytics on conceptual recall, quantum gate intuition, circuit design velocity, and active simulation hours.
        </p>
      </header>

      {/* 2. Graphical Level & XP Pathway Progress Bar */}
      <section aria-labelledby="level-pathway-heading" className="rounded-3xl border border-purple-200/80 dark:border-purple-900/50 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4c1d70] text-[#f5d626] shadow-md">
              <AwardIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 id="level-pathway-heading" className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                Quantum Explorer Pathway — Level {learner.level}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                {learner.xp.toLocaleString()} total XP earned • {4500 - learner.xp} XP to unlock Level 5: Coherence Master
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#4c1d70] dark:text-[#f5d626]">
              {levelProgressPct}% of Level 4
            </span>
            <div className="w-32 sm:w-44 h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-purple-200/60 dark:border-purple-900/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4c1d70] to-[#f5d626] transition-all duration-700 shadow-[0_0_8px_rgba(245,214,38,0.5)]"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Milestone Steps Pipeline */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {levelMilestones.map((m) => {
            const isDone = m.status === 'completed';
            const isCurrent = m.status === 'current';
            return (
              <div
                key={m.level}
                className={`relative rounded-2xl p-3 border transition-all ${
                  isCurrent
                    ? 'border-[#f5d626] bg-amber-50/40 dark:bg-amber-950/20 shadow-[0_0_15px_rgba(245,214,38,0.15)] ring-1 ring-[#f5d626]/60'
                    : isDone
                    ? 'border-purple-200 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-[#4c1d70] dark:text-[#f5d626]' : 'text-slate-500'}`}>
                    Lvl {m.level}
                  </span>
                  {isDone && <CheckCircle2Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                  {isCurrent && <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-ping" />}
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {m.name}
                </div>
                <div className="mt-1 text-[13px] text-slate-500 dark:text-zinc-400">
                  {m.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. High-Impact Graphical Visualizations (Radar Chart & Trajectory Curve) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quantum Competency Radar / Spider Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-purple-200/80 dark:border-purple-900/50 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BrainIcon className="h-5 w-5 text-[#4c1d70] dark:text-[#f5d626]" />
                  Quantum Competency Radar
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Multi-dimensional skill mastery evaluated across 6 core quantum domains.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                82% Mean Mastery
              </span>
            </div>

            {/* Radar Diagram Container */}
            <div className="relative mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-[280px] h-[280px] shrink-0">
                <svg viewBox="0 0 280 280" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id="radarFillGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f5d626" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#4c1d70" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b1458" stopOpacity="0.1" />
                    </radialGradient>
                    <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Polygonal Background Grid (20%, 40%, 60%, 80%, 100%) */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => {
                    const points = Array.from({ length: totalAxes })
                      .map((_, i) => {
                        const { x, y } = getCoordinates(i, level);
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <polygon
                        key={level}
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        className="text-purple-200/80 dark:text-purple-900/50"
                        strokeWidth="1"
                        strokeDasharray={level === 1.0 ? 'none' : '3,3'}
                      />
                    );
                  })}

                  {/* Radial Axis Lines */}
                  {Array.from({ length: totalAxes }).map((_, i) => {
                    const outer = getCoordinates(i, 1.0);
                    return (
                      <line
                        key={i}
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={outer.x}
                        y2={outer.y}
                        stroke="currentColor"
                        className="text-purple-200/70 dark:text-purple-900/40"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Shaded Skill Data Polygon */}
                  <polygon
                    points={radarPolygonPoints}
                    fill="url(#radarFillGradient)"
                    stroke="#f5d626"
                    strokeWidth="2.5"
                    filter="url(#radarGlow)"
                    className="transition-all duration-500 hover:stroke-[#e2c317]"
                  />

                  {/* Data Vertex Nodes */}
                  {radarSkills.map((skill, i) => {
                    const { x, y } = getCoordinates(i, skill.value / 100);
                    const isHovered = hoveredRadarIndex === i;
                    return (
                      <g key={skill.name} className="cursor-pointer" onMouseEnter={() => setHoveredRadarIndex(i)} onMouseLeave={() => setHoveredRadarIndex(null)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 7 : 4.5}
                          fill="#4c1d70"
                          stroke="#f5d626"
                          strokeWidth="2"
                          className="transition-all duration-200 shadow-lg"
                        />
                        {/* Text Label on Axis Outer Edge */}
                        {(() => {
                          const labelPos = getCoordinates(i, 1.18);
                          return (
                            <text
                              x={labelPos.x}
                              y={labelPos.y}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={`text-xs font-bold transition-all ${
                                isHovered ? 'fill-[#4c1d70] dark:fill-[#f5d626] font-extrabold' : 'fill-slate-600 dark:fill-zinc-400'
                              }`}
                            >
                              {skill.name}
                            </text>
                          );
                        })()}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Radar Breakdown Key / Metrics */}
              <div className="flex-1 w-full space-y-2 text-sm">
                {radarSkills.map((skill, i) => (
                  <div
                    key={skill.name}
                    onMouseEnter={() => setHoveredRadarIndex(i)}
                    onMouseLeave={() => setHoveredRadarIndex(null)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      hoveredRadarIndex === i
                        ? 'border-[#f5d626] bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                        : 'border-slate-100 dark:border-zinc-800 hover:bg-purple-50/40 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: skill.color }} />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#4c1d70] dark:bg-[#f5d626]" style={{ width: `${skill.value}%` }} />
                      </div>
                      <span className="font-bold text-[#4c1d70] dark:text-[#f5d626] w-8 text-right">
                        {skill.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: BKT Retention Curve & Curriculum Rings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* BKT Retention Trajectory Spline Chart */}
          <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/50 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5 text-[#4c1d70] dark:text-[#f5d626]" />
                  BKT Retention Curve
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Bayesian Knowledge Tracing recall vs forgetting curve.
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                +24% Recall
              </span>
            </div>

            {/* SVG Spline Area Chart */}
            <div className="mt-4">
              <div className="h-44 w-full">
                <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f5d626" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4c1d70" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[30, 70, 110, 150].map((y) => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeWidth="1" strokeDasharray="3,3" />
                  ))}

                  {/* Forgetting Baseline Curve (without spaced practice - dashed red/slate) */}
                  <path
                    d="M 10 90 Q 120 130, 220 145 T 390 152"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text x="320" y="142" className="text-[11px] fill-slate-400 dark:fill-zinc-500">Unreviewed decay</text>

                  {/* Active Knowledge Mastery Trajectory (Smooth Spline) */}
                  <path
                    d="M 10 135 C 70 120, 110 85, 170 70 C 230 55, 300 35, 390 20 L 390 160 L 10 160 Z"
                    fill="url(#curveGradient)"
                  />
                  <path
                    d="M 10 135 C 70 120, 110 85, 170 70 C 230 55, 300 35, 390 20"
                    fill="none"
                    stroke="#4c1d70"
                    strokeWidth="3"
                    className="dark:stroke-[#f5d626]"
                  />

                  {/* Trajectory Milestone Dots */}
                  {[
                    { cx: 10, cy: 135, label: 'W1' },
                    { cx: 110, cy: 92, label: 'W2' },
                    { cx: 210, cy: 60, label: 'W3' },
                    { cx: 310, cy: 38, label: 'W4' },
                    { cx: 390, cy: 20, label: 'Current' }
                  ].map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#4c1d70" stroke="#f5d626" strokeWidth="2" />
                      <text x={pt.cx} y={pt.cy - 10} textAnchor="middle" className="text-[11px] font-bold fill-zinc-700 dark:fill-zinc-300">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex items-center justify-between pt-2 text-[13px] text-slate-500 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800">
                <span>Week 1 (Diagnostic: 35%)</span>
                <span>Week 2 (58%)</span>
                <span>Week 3 (76%)</span>
                <span className="font-bold text-[#4c1d70] dark:text-[#f5d626]">Today (91% Peak)</span>
              </div>
            </div>
          </div>

          {/* Curriculum Completion Progress Ring (Donut) */}
          <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/50 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TargetIcon className="h-5 w-5 text-[#4c1d70] dark:text-[#f5d626]" />
                  Curriculum Completion
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  {totalLessonsDone} of {totalLessons} total lessons cleared
                </p>
              </div>
              <span className="text-sm font-bold text-[#4c1d70] dark:text-[#f5d626]">
                {overallSyllabusPct}% Done
              </span>
            </div>

            <div className="mt-4 flex items-center gap-6">
              {/* Circular Progress Ring */}
              <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-zinc-800"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4c1d70"
                    strokeWidth="10"
                    strokeDasharray={251.3}
                    strokeDashoffset={251.3 * (1 - overallSyllabusPct / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 dark:stroke-[#f5d626]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                    {overallSyllabusPct}%
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase mt-0.5">Syllabus</span>
                </div>
              </div>

              {/* Course Breakdown Badges */}
              <div className="flex-1 space-y-2 text-sm">
                {courses.slice(0, 3).map((c) => {
                  const pct = Math.round((c.lessonsDone / c.lessonsTotal) * 100);
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-[13px]">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">{c.title}</span>
                        <span className="font-bold text-[#4c1d70] dark:text-[#f5d626]">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4c1d70] to-[#f5d626]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Velocity & Activity Deep-Dive Tabs */}
      <section aria-labelledby="analytics-tabs-heading" className="rounded-3xl border border-purple-200/80 dark:border-purple-900/50 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h2 id="analytics-tabs-heading" className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5 text-[#4c1d70] dark:text-[#f5d626]" />
              Study Analytics & Practice Trends
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Switch between velocity histograms, calendar activity heatmaps, and granular skill metrics.
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div role="tablist" className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-full">
            {tabs.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all active:scale-95 ${
                    active
                      ? 'bg-[#4c1d70] text-white shadow-sm'
                      : 'text-slate-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Enhanced Weekly Velocity Histogram with Dual Accuracy Overlay */}
        {tab === 'time' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Daily Study Minutes & Accuracy Trend
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Peak performance recorded on Thursday (82m, 94% quiz score).
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                  <span className="h-3 w-3 rounded bg-[#4c1d70]" />
                  Study Minutes
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-[#f5d626]" />
                  Quiz Accuracy %
                </span>
              </div>
            </div>

            <div className="relative pt-4 pb-2 border-b border-purple-100 dark:border-zinc-800">
              {/* Daily Bar Histogram */}
              <div className="flex h-56 items-end gap-3 sm:gap-6">
                {weeklyMinutes.map((item) => {
                  const isPeak = item.minutes === peakMinutes;
                  const isHovered = hoveredDay === item.day;
                  return (
                    <div
                      key={item.day}
                      onMouseEnter={() => setHoveredDay(item.day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="flex flex-1 flex-col items-center justify-end h-full gap-2 group cursor-pointer"
                    >
                      {/* Tooltip value */}
                      <span className={`text-sm font-bold transition-all ${
                        isPeak || isHovered ? 'text-[#f5d626] scale-110' : 'text-slate-500 dark:text-zinc-400'
                      }`}>
                        {item.minutes}m
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-500 relative ${
                            isPeak
                              ? 'bg-gradient-to-t from-[#4c1d70] to-[#f5d626] shadow-[0_0_15px_rgba(245,214,38,0.4)]'
                              : 'bg-[#4c1d70] dark:bg-purple-900/80 group-hover:opacity-90'
                          }`}
                          style={{ height: `${(item.minutes / peakMinutes) * 100}%` }}
                        >
                          {isPeak && (
                            <span className="absolute -top-6 inset-x-0 flex justify-center">
                              <span className="bg-[#f5d626] text-zinc-950 font-bold text-[11px] px-1.5 py-0.5 rounded-full shadow-sm">
                                Peak
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Day Label */}
                      <span className={`text-sm font-bold transition-colors ${
                        isPeak || isHovered ? 'text-[#4c1d70] dark:text-[#f5d626]' : 'text-slate-700 dark:text-zinc-300'
                      }`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Calendar Heatmap Matrix */}
        {tab === 'consistency' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  28-Day Consistency Heatmap
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Color intensity indicates daily simulation and problem solving volume.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>Less</span>
                {intensityClass.map((cls, idx) => (
                  <span key={idx} className={`h-4 w-4 rounded border ${cls}`} />
                ))}
                <span>More</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5 max-w-xl p-4 rounded-2xl bg-purple-50/30 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              {activity.map((lvl, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-lg border transition-transform hover:scale-110 cursor-pointer flex items-center justify-center text-xs font-bold ${intensityClass[lvl]}`}
                  title={`Day ${i + 1}: Level ${lvl} activity`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Competency List with Target Mastery */}
        {tab === 'mastery' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Detailed Topic Proficiency Scores
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Assessed through worked matrix exercises, statevector derivations, and circuit builds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {skills.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-zinc-900 dark:text-white">{skill.name}</span>
                    <span className="font-bold text-[#4c1d70] dark:text-[#f5d626]">
                      {skill.mastery}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4c1d70] to-[#f5d626]"
                      style={{ width: `${skill.mastery}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Baseline: 40%</span>
                    <span>Target: 90% Mastery</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}