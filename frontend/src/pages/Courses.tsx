import { useState, useEffect, useMemo } from 'react';
import { 
  BookOpenIcon, 
  RouteIcon, 
  SearchIcon, 
  LockIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  GraduationCapIcon,
  ShieldAlertIcon,
  LayersIcon,
  SparklesIcon,
  BinaryIcon,
  AtomIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { CURRICULUM } from '../data/curriculumData';
import { stateStore, type AppState } from '../services/stateStore';
import type { ViewId } from '../data/appData';

interface CoursesProps {
  onNavigate: (id: ViewId) => void;
}

export function Courses({ onNavigate }: CoursesProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const totalTopics = useMemo(() => 
    CURRICULUM.reduce((acc, c) => acc + c.topics.length, 0), 
    []
  );

  const totalMinutes = useMemo(() => 
    CURRICULUM.reduce((acc, c) => acc + c.topics.reduce((tAcc, t) => tAcc + (t.minutes || 15), 0), 0), 
    []
  );

  const allDomains = useMemo(() => {
    const domains = new Set(CURRICULUM.map(c => c.vault_domain || `Chapter ${c.number}`));
    return ['all', ...Array.from(domains)];
  }, []);

  const filteredChapters = useMemo(() => {
    return CURRICULUM.filter(chapter => {
      const matchesDomain = selectedDomain === 'all' || chapter.vault_domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesDomain;

      const matchesSearch = 
        chapter.title.toLowerCase().includes(q) ||
        chapter.subtitle.toLowerCase().includes(q) ||
        chapter.summary.toLowerCase().includes(q) ||
        chapter.topics.some(t => 
          t.title.toLowerCase().includes(q) || 
          t.summary.toLowerCase().includes(q)
        );

      return matchesDomain && matchesSearch;
    });
  }, [searchQuery, selectedDomain]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Curriculum Syllabi & Academic Catalog"
        subtitle="Official university-grade syllabus specification, theoretical competencies, and topic outlines."
      />

      {/* Course Architecture & Journey Correlation Banner */}
      <Card className="p-6 sm:p-7 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-zinc-900/40 to-emerald-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center rounded-full bg-indigo-600 px-2.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Academic Syllabi Reference
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {CURRICULUM.length} Chapters · {totalTopics} Core Modules · ~{Math.round(totalMinutes / 60)} Hours Total
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Syllabus Overview & Pedagogical Progression
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              This catalog provides the complete theoretical syllabus, prerequisites, and learning competencies for the entire quantum computing degree track. 
              <strong> Lessons and interactive simulations are locked sequentially</strong> and must be unlocked through the 
              <span className="text-emerald-500 font-semibold"> Curriculum Journey</span> to verify prerequisite knowledge gates.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 shadow-md flex items-center justify-center gap-2"
              onClick={() => onNavigate('path')}
            >
              <RouteIcon className="h-4 w-4" />
              <span>Go to Curriculum Journey</span>
            </Button>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center flex items-center justify-center gap-1.5">
              <ShieldAlertIcon className="h-3.5 w-3.5 text-amber-500" />
              <span>Lessons accessible via Journey only</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80">
          <div className="rounded-xl bg-white/60 dark:bg-zinc-900/60 p-3 border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Total Curriculum</span>
            <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">{CURRICULUM.length} Chapters</p>
          </div>
          <div className="rounded-xl bg-white/60 dark:bg-zinc-900/60 p-3 border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Core Syllabus Topics</span>
            <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">{totalTopics} Modules</p>
          </div>
          <div className="rounded-xl bg-white/60 dark:bg-zinc-900/60 p-3 border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Knowledge Domains</span>
            <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">{allDomains.length - 1} Domains</p>
          </div>
          <div className="rounded-xl bg-white/60 dark:bg-zinc-900/60 p-3 border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Pedagogical Rigor</span>
            <p className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">BKT Gated (≥70%)</p>
          </div>
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syllabus by concept, gate, or algorithm..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {allDomains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedDomain === dom
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {dom === 'all' ? 'All Domains' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Syllabus Chapters List */}
      <div className="space-y-6">
        {filteredChapters.map((chapter) => {
          const isDone = appState.progress.completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === appState.progress.activeChapterId;
          const isLocked = chapter.number > 1 && !appState.progress.completedChapters.includes(`ch-${chapter.number - 1}`) && !isDone;

          const completedTopicsInChapter = chapter.topics.filter(t =>
            appState.progress.completedLessons.includes(t.id)
          ).length;

          return (
            <Card key={chapter.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
              {/* Chapter Syllabus Header */}
              <div className="border-b border-zinc-200/80 bg-zinc-50/70 p-5 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-200 dark:bg-zinc-700">
                        Chapter {chapter.number}
                      </span>
                      {chapter.vault_domain && (
                        <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">
                          {chapter.vault_domain}
                        </span>
                      )}
                      {chapter.isStart && (
                        <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          START TRACK
                        </span>
                      )}
                      {chapter.isEnd && (
                        <span className="rounded bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          CAPSTONE
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {chapter.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {chapter.subtitle}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2Icon className="h-3.5 w-3.5" />
                        Completed in Journey
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-500/30">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        Active in Journey
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <LockIcon className="h-3 w-3" />
                        Prerequisite Locked
                      </span>
                    )}

                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {completedTopicsInChapter} / {chapter.topics.length} Modules Cleared
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
                  {chapter.summary}
                </p>
              </div>

              {/* Syllabus Breakdown Section */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <GraduationCapIcon className="h-3.5 w-3.5" />
                    Course Syllabus Topics & Mathematical Foundations
                  </h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {chapter.topics.length} Syllabus Units
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {chapter.topics.map((topic) => {
                    const isTopicCompleted = appState.progress.completedLessons.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-8 items-center justify-center rounded bg-zinc-200 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                              {topic.number}
                            </span>
                            <h5 className="font-display text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {topic.title}
                            </h5>
                          </div>

                          {isTopicCompleted ? (
                            <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 shrink-0">
                              <ClockIcon className="h-3 w-3" />
                              {topic.minutes || 15} min
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {topic.summary}
                        </p>

                        {/* Mathematical Formula Preview */}
                        {topic.mathFormula && (
                          <div className="rounded-lg bg-zinc-100 px-3 py-1.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-950 dark:text-emerald-400 border border-zinc-200/50 dark:border-zinc-800/80">
                            <code>{topic.mathFormula}</code>
                          </div>
                        )}

                        {/* Associated Lab Reference */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
                          <span className="truncate">
                            Lab: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{topic.lab.title}</strong>
                          </span>
                          <span className="shrink-0 text-zinc-400 font-mono text-[10px]">
                            {topic.lab.id}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Action: Guide to Journey without unlocking lessons directly */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    To start or resume lessons for Chapter {chapter.number}, follow your gated sequence in Curriculum Journey.
                  </div>
                  <Button
                    variant="secondary"
                    className="text-xs h-8 px-4 flex items-center gap-1.5"
                    onClick={() => onNavigate('path')}
                  >
                    <RouteIcon className="h-3.5 w-3.5 text-emerald-600" />
                    <span>View in Curriculum Journey</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}