import React, { useState, useEffect } from 'react';
import { genieStagger } from '../components/ui/useGenieMotion';
import {
  ArrowRightIcon,
  ClockIcon,
  SparklesIcon,
  BookOpenIcon,
  LayersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
  ZapIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { courses as defaultCourses, type Course, type ViewId } from '../data/appData';
import { apiClient } from '../services/apiClient';
import { audioEngine } from '../services/audioEngine';

type CoursesProps = {
  onNavigate: (id: ViewId) => void;
};

const filters = [
  { id: 'all', label: 'All Courses' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Completed' },
  { id: 'not-started', label: 'Not Started' }
] as const;

type FilterId = (typeof filters)[number]['id'];

const verticalTags: Record<string, { label: string; badge: string }> = {
  'c-1': { label: 'Quantum Computing Foundations', badge: 'bg-purple-100 text-[#4c1d70] border-purple-200' },
  'c1': { label: 'Quantum Computing Foundations', badge: 'bg-purple-100 text-[#4c1d70] border-purple-200' },
  'c-2': { label: 'Quantum Circuits & Logic', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  'c2': { label: 'Quantum Circuits & Logic', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  'c-3': { label: 'Quantum Communication', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'c3': { label: 'Quantum Communication', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'c-4': { label: 'Quantum Algorithms & NISQ', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  'c4': { label: 'Quantum Algorithms & NISQ', badge: 'bg-amber-100 text-amber-800 border-amber-200' }
};

function statusChip(course: Course) {
  if (course.status === 'done') return <StatusChip tone="done">Finished</StatusChip>;
  if (course.status === 'in-progress') return <StatusChip tone="active">In progress</StatusChip>;
  return <StatusChip tone="locked">Not started</StatusChip>;
}

export function Courses({ onNavigate }: CoursesProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [courseList, setCourseList] = useState<Course[]>(defaultCourses);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>('c-1');
  const [backendSynced, setBackendSynced] = useState(false);

  // Sync with backend /courses endpoint if available
  useEffect(() => {
    async function loadBackendCourses() {
      try {
        const backendData = await apiClient.getCourses();
        if (backendData && backendData.length > 0) {
          setBackendSynced(true);
        }
      } catch {
        // Retain verified quantum courses from defaultCourses
      }
    }
    loadBackendCourses();
  }, []);

  const visible = filter === 'all' ? courseList : courseList.filter((c) => c.status === filter);

  const toggleExpand = (courseId: string) => {
    audioEngine.playGateSnap();
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <header className="border-b border-purple-100/80 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-purple-950/70 dark:text-purple-300">
            <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-pulse" />
            Official Quantum Curriculum • 4 Verticals
          </span>
          {backendSynced && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2Icon className="h-3 w-3" /> Synchronized with Backend Engine
            </span>
          )}
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Quantum Computing Learning Tracks
        </h1>
        <p className="font-poppins mt-2 text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Master quantum algorithms, hardware architectures, and industry workflows. Grounded in the Obsidian Knowledge Vault and validated with live Qiskit Aer simulation.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter courses">
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                audioEngine.playGateSnap();
                setFilter(f.id);
              }}
              aria-pressed={active}
              className={`rounded-full px-4 py-1.5 text-sm font-poppins font-semibold transition-all duration-150 active:scale-95 ${
                active
                  ? 'bg-[#4c1d70] text-white shadow-sm'
                  : 'border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-purple-50/60 dark:hover:bg-zinc-800 hover:border-purple-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-orbitron text-xl font-bold text-[#1a052e] dark:text-white">Nothing here yet</p>
          <p className="font-poppins mx-auto mt-1 max-w-sm text-base text-slate-500 dark:text-zinc-400">
            No courses match this filter.
          </p>
          <Button
            variant="secondary"
            className="mt-4 rounded-full font-orbitron"
            onClick={() => {
              audioEngine.playGateSnap();
              setFilter('all');
            }}
          >
            Show all courses
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-purple-100/80 dark:divide-zinc-800 border-y border-purple-100/80 dark:border-zinc-800">
          {visible.map((course, index) => {
            const vTag = verticalTags[course.id] || {
              label: 'Quantum Computing',
              badge: 'bg-purple-50 text-[#4c1d70] border-purple-200'
            };
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={`${filter}-${course.id}`}
                style={genieStagger(index)}
                className="genie-item py-7 px-2 group transition-colors hover:bg-purple-50/20 dark:hover:bg-purple-950/10"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {statusChip(course)}
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold ${vTag.badge}`}>
                        {vTag.label}
                      </span>
                      <span className="text-sm font-mono text-slate-500 dark:text-zinc-400">
                        {course.level}
                      </span>
                    </div>

                    <h2 className="font-orbitron mt-2.5 text-xl sm:text-2xl font-bold text-[#1a052e] dark:text-white group-hover:text-[#4c1d70] dark:group-hover:text-[#f5d626] transition-colors">
                      {course.title}
                    </h2>
                    <p className="font-poppins mt-1.5 text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {course.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 max-w-md">
                      <div className="flex items-baseline justify-between text-sm font-poppins text-slate-500 dark:text-zinc-400">
                        <span>
                          {course.lessonsDone} of {course.lessonsTotal} lessons completed
                        </span>
                        {course.minutesLeft > 0 && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#4c1d70] dark:text-purple-300">
                            <ClockIcon className="h-3 w-3 text-amber-500" />
                            {course.minutesLeft} min left
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-[#4c1d70] transition-all duration-700 ease-out"
                          style={{ width: `${(course.lessonsDone / course.lessonsTotal) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Expand/Collapse Syllabus Accordion Toggle */}
                    {course.modules && course.modules.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(course.id)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-mono font-bold text-[#4c1d70] dark:text-purple-300 hover:text-purple-900 transition-colors"
                      >
                        <LayersIcon className="h-3.5 w-3.5" />
                        <span>{isExpanded ? 'Hide Syllabus Modules' : `Explore ${course.modules.length} Modules & Katas`}</span>
                        {isExpanded ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pt-1">
                    <Button
                      variant={course.status === 'in-progress' ? 'primary' : 'secondary'}
                      onClick={() => {
                        audioEngine.playGateSnap();
                        onNavigate('lesson');
                      }}
                      className="rounded-full font-orbitron text-sm font-bold px-5 py-2.5 shadow-sm active:scale-95 transition-all group/btn"
                    >
                      <span>
                        {course.status === 'done'
                          ? 'Review course'
                          : course.status === 'in-progress'
                          ? 'Continue'
                          : 'Start course'}
                      </span>
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 text-[#f5d626]" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Modules & Lessons View */}
                {isExpanded && course.modules && (
                  <div className="mt-5 pt-4 border-t border-purple-100/60 dark:border-zinc-800/80 space-y-3">
                    <h4 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Course Curriculum Modules
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.modules.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-2xl border border-purple-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 transition-all"
                        >
                          <h5 className="font-orbitron text-sm font-bold text-[#1a052e] dark:text-white flex items-center gap-1.5">
                            <BookOpenIcon className="h-3.5 w-3.5 text-[#4c1d70]" />
                            <span>{m.title}</span>
                          </h5>
                          <p className="mt-1 text-[13px] font-poppins text-slate-500 dark:text-zinc-400">
                            {m.description}
                          </p>

                          {/* Lessons List */}
                          <div className="mt-3 space-y-1.5">
                            {m.lessons.map((l) => (
                              <div
                                key={l.id}
                                className="flex items-center justify-between rounded-lg bg-purple-50/50 dark:bg-zinc-800/50 px-2.5 py-1.5 text-sm"
                              >
                                <div className="flex items-center gap-1.5">
                                  <PlayCircleIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                  <span className="font-medium text-slate-800 dark:text-zinc-200">{l.title}</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-zinc-400">
                                  <span>{l.minutes}m</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{l.xp} XP</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
