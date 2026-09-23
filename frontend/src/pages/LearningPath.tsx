import React, { useState, useEffect } from 'react';
import { 
  CheckIcon, 
  LockIcon, 
  ChevronDownIcon, 
  FlaskConicalIcon, 
  BookOpenIcon, 
  GraduationCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon,
  CompassIcon,
  LayersIcon,
  AtomIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { CURRICULUM } from '../data/curriculumData';
import { stateStore, type AppState } from '../services/stateStore';
import type { ViewId } from '../data/appData';

interface LearningPathProps {
  onNavigate: (id: ViewId) => void;
}

export function LearningPath({ onNavigate }: LearningPathProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [expandedChapterId, setExpandedChapterId] = useState<string>(
    appState.progress.activeChapterId || 'ch-1'
  );

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const completedChaptersCount = appState.progress.completedChapters.length;
  const totalChapters = CURRICULUM.length;
  const progressPercent = Math.min(100, Math.round((completedChaptersCount / totalChapters) * 100));

  const handleOpenTopic = (chapterId: string, topicId: string, _type: 'theory' | 'lab' = 'theory') => {
    stateStore.setActiveLesson(chapterId, topicId);
    onNavigate('lesson');
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="Curriculum Learning Journey"
        subtitle="Your complete 5-Chapter master track from Foundations (Start) to Capstone (Finish)."
      />

      {/* Visually Appetizing Quantum Constellation Highway Card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#070b14] via-[#0b1220] to-[#041a12] p-6 sm:p-9 shadow-2xl text-white">
        {/* Ambient quantum background glow effects */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <AtomIcon className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                5-CHAPTER MASTER QUANTUM TRACK
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {completedChaptersCount} of {totalChapters} Chapters Cleared
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Interactive Quantum Progression Highway
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Step through sequential quantum computational tracks from single-qubit statevectors to multi-qubit Grover search. 
              Prerequisite mastery gates enforce structural understanding before unlocking downstream topics.
            </p>

            {/* Strict Gate Status */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                <span>Bayesian Gating Active (≥ 70% Mastery Threshold)</span>
              </div>
              <span className="text-[11px] text-zinc-400">
                Validated via genuine Qiskit Aer simulation
              </span>
            </div>
          </div>

          {/* Progress Telemetry Card */}
          <div className="w-full lg:w-80 rounded-2xl bg-zinc-900/80 p-5 shadow-2xl border border-zinc-700/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
                Curriculum Mastery
              </span>
              <span className="text-emerald-400 font-mono text-sm font-bold">{progressPercent}%</span>
            </div>
            
            <div className="relative mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>{completedChaptersCount}/{totalChapters} Chapters</span>
              <span>{appState.progress.totalXP} Total CP Earned</span>
            </div>
          </div>
        </div>

        {/* VISUALLY APPETIZING ROUTE MAP PIPELINE */}
        <div className="relative z-10 mt-10 pt-8 border-t border-zinc-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80 mb-4 flex items-center gap-2">
            <CompassIcon className="h-3.5 w-3.5" />
            <span>Interactive Highway Route Map — Click any chapter to inspect modules</span>
          </div>

          {/* Stepped Route Highway Track */}
          <div className="relative">
            {/* Background connecting track beam */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-800 hidden md:block rounded-full" />
            
            {/* Active glowing progress segment */}
            <div 
              className="absolute top-6 left-6 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hidden md:block rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-700"
              style={{ 
                width: `${Math.max(0, Math.min(100, ((Math.max(1, completedChaptersCount + 0.5)) / totalChapters) * 100))}%` 
              }}
            />

            {/* Highway Nodes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
              {CURRICULUM.map((ch, idx) => {
                const isDone = appState.progress.completedChapters.includes(ch.id);
                const isCurrent = ch.id === appState.progress.activeChapterId;
                const isChLocked = ch.number > 1 && !appState.progress.completedChapters.includes(`ch-${ch.number - 1}`) && !isDone;
                const isExpanded = expandedChapterId === ch.id;

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setExpandedChapterId(ch.id)}
                    className={`group text-left rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between min-h-[140px] ${
                      isCurrent
                        ? 'bg-zinc-900/90 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/40'
                        : isDone
                        ? 'bg-zinc-950/70 border-emerald-600/40 hover:border-emerald-500/70'
                        : isChLocked
                        ? 'bg-zinc-950/40 border-zinc-800/80 opacity-60 hover:opacity-80'
                        : 'bg-zinc-900/60 border-zinc-700/60 hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      {/* Node Circle */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                            : isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/30 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                            : isChLocked
                            ? 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            : 'bg-zinc-800 text-zinc-200'
                        }`}
                      >
                        {isDone ? (
                          <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                        ) : isChLocked ? (
                          <LockIcon className="h-4 w-4" />
                        ) : (
                          `0${idx + 1}`
                        )}
                      </div>

                      {/* Status Tag */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                          : isChLocked
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {isDone ? 'Cleared' : isCurrent ? 'Active' : isChLocked ? 'Locked' : 'Queued'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {ch.isStart ? 'Milestone 1 • Start' : ch.isEnd ? 'Milestone 5 • Finale' : `Milestone ${idx + 1}`}
                      </div>
                      <h4 className="font-display text-xs font-bold text-white group-hover:text-emerald-300 transition truncate mt-0.5">
                        {ch.title.split(':')[1]?.trim() || ch.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {ch.topics.length} interactive modules
                      </p>
                    </div>

                    {/* Active highlight indicator */}
                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500 group-hover:text-zinc-300 font-mono">
                        {isExpanded ? 'Viewing' : 'Inspect'}
                      </span>
                      <ArrowRightIcon className={`h-3 w-3 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90 text-emerald-400' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Timeline List */}
      <ol className="relative space-y-6 border-l-2 border-emerald-500/30 pl-6 sm:pl-8 ml-3 dark:border-emerald-500/20">
        {CURRICULUM.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          const isDone = appState.progress.completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === appState.progress.activeChapterId;
          const isLocked = chapter.number > 1 && !appState.progress.completedChapters.includes(`ch-${chapter.number - 1}`) && !isDone;

          return (
            <li key={chapter.id} className="relative">
              {/* Timeline Indicator Marker */}
              <span
                className={`absolute -left-[37px] sm:-left-[45px] top-6 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs font-bold shadow-md transition-all ${
                  isDone
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : isLocked
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                    : isCurrent
                    ? 'border-emerald-500 bg-white text-emerald-700 dark:bg-zinc-900 dark:text-emerald-400 ring-4 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900'
                }`}
              >
                {isDone ? (
                  <CheckIcon className="h-4 w-4" />
                ) : isLocked ? (
                  <LockIcon className="h-4 w-4" />
                ) : (
                  chapter.number
                )}
              </span>

              {/* Chapter Card Container */}
              <div
                className={`rounded-2xl border transition-all ${
                  isLocked
                    ? 'border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/30 opacity-80'
                    : isCurrent
                    ? 'border-emerald-500 bg-white shadow-lg dark:border-emerald-500/50 dark:bg-zinc-900 ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm'
                }`}
              >
                <div
                  className="flex min-h-[76px] w-full cursor-pointer items-center justify-between p-5 sm:p-6"
                  onClick={() => setExpandedChapterId(isExpanded ? '' : chapter.id)}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {chapter.isStart && (
                        <span className="rounded bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                          START HERE
                        </span>
                      )}
                      {chapter.isEnd && (
                        <span className="rounded bg-purple-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                          CAPSTONE FINALE
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Chapter {chapter.number}
                      </span>
                      {isDone && <StatusChip tone="done">Chapter Completed</StatusChip>}
                      {isLocked && <StatusChip tone="locked">Prerequisites Locked</StatusChip>}
                      {!isLocked && isCurrent && <StatusChip tone="active">Active Now</StatusChip>}
                    </div>

                    <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {chapter.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
                      {chapter.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ChevronDownIcon
                      className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Topics & Open Lab Modules */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950/40 rounded-b-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                      Topics & Practical Open Labs in this Chapter:
                    </p>

                    <div className="space-y-3">
                      {chapter.topics.map((topic) => {
                        const topicDone = appState.progress.completedLessons.includes(topic.id);
                        const labDone = appState.progress.completedLabs.includes(topic.lab.id);
                        const topicUnlocked = !isLocked && stateStore.isTopicUnlocked(chapter.id, topic.id);

                        return (
                          <div
                            key={topic.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border p-4 shadow-sm transition ${
                              !topicUnlocked
                                ? 'border-zinc-200 bg-zinc-50/70 dark:border-zinc-800/80 dark:bg-zinc-950/40 opacity-70'
                                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-mono text-xs font-bold ${!topicUnlocked ? 'text-zinc-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                  Topic {topic.number}
                                </span>
                                <h4 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                  {topic.title}
                                </h4>
                              </div>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {topic.summary}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                {topicDone ? (
                                  <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckIcon className="mr-1 h-3.5 w-3.5" /> Theory Learned
                                  </span>
                                ) : !topicUnlocked ? (
                                  <span className="inline-flex items-center text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                    <LockIcon className="mr-1 h-3 w-3" /> Prerequisite Locked
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-zinc-400">Theory pending</span>
                                )}
                                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                {labDone ? (
                                  <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckIcon className="mr-1 h-3.5 w-3.5" /> Open Lab Passed (+75 CP)
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-zinc-400">Practical Lab available</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="secondary"
                                disabled={!topicUnlocked}
                                className={`h-9 text-xs ${!topicUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => topicUnlocked && handleOpenTopic(chapter.id, topic.id, 'theory')}
                              >
                                {!topicUnlocked ? (
                                  <>
                                    <LockIcon className="mr-1.5 h-3.5 w-3.5" />
                                    Locked
                                  </>
                                ) : (
                                  <>
                                    <BookOpenIcon className="mr-1.5 h-3.5 w-3.5" />
                                    Study Lesson
                                  </>
                                )}
                              </Button>

                              <Button
                                disabled={!topicUnlocked}
                                className={`h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white ${!topicUnlocked ? 'opacity-50 cursor-not-allowed bg-zinc-500 hover:bg-zinc-500' : ''}`}
                                onClick={() => topicUnlocked && handleOpenTopic(chapter.id, topic.id, 'lab')}
                              >
                                {!topicUnlocked ? (
                                  <>
                                    <LockIcon className="mr-1.5 h-3.5 w-3.5" />
                                    Locked
                                  </>
                                ) : (
                                  <>
                                    <FlaskConicalIcon className="mr-1.5 h-3.5 w-3.5" />
                                    Open Lab
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}

        {/* Culmination / Final Milestone Node */}
        <li className="relative">
          <span className="absolute -left-[37px] sm:-left-[45px] top-4 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600 text-white shadow-lg">
            <GraduationCapIcon className="h-4 w-4" />
          </span>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 dark:border-purple-500/20 dark:bg-purple-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Course Culmination & Terminal Goal
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Quantum Computing Practitioner Certification
                </h3>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
                  Awarded upon completing all 5 chapters and their associated practical Open Lab missions. Unlocks the Grover algorithm capstone badge and printable proof of mastery.
                </p>
              </div>

              {completedChaptersCount >= 5 ? (
                <StatusChip tone="done">Graduated & Certified</StatusChip>
              ) : (
                <span className="rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-zinc-900 dark:text-purple-300">
                  {5 - completedChaptersCount} chapters remaining
                </span>
              )}
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}