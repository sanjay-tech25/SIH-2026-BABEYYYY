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
  ZapIcon
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

      {/* Start-to-End Journey Overview Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-emerald-500/5 dark:from-zinc-900 dark:to-emerald-950/20 border-emerald-500/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center rounded-full bg-emerald-600 px-2.5 text-[11px] font-bold text-white">
                5-CHAPTER MASTER TRACK
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {completedChaptersCount} of {totalChapters} Chapters Cleared
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Course Roadmap & Milestone Journey
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Follow the sequential quantum computing path from single qubits to multi-qubit Grover search. Rigorous adaptive gates enforce foundational concept mastery before downstream unlocks.
            </p>

            {/* Strict Gate Status */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Rigorous Concept Importance Gating Active</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Prerequisites require ≥ 70% weighted accuracy to unlock downstream chapters.
              </span>
            </div>
          </div>

          <div className="w-full lg:w-72 rounded-xl bg-white/80 p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-700 dark:text-zinc-300">Total Course Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} label="Overall roadmap progress" className="mt-2" />
            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              {progressPercent === 100 ? 'Course Complete! Capstone Unlocked.' : `${totalChapters - completedChaptersCount} chapters to graduation.`}
            </p>
          </div>
        </div>

        {/* Start to End Visual Highway */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {CURRICULUM.map((ch, idx) => {
              const isDone = appState.progress.completedChapters.includes(ch.id);
              const isCurrent = ch.id === appState.progress.activeChapterId;
              const isChLocked = ch.number > 1 && !appState.progress.completedChapters.includes(`ch-${ch.number - 1}`) && !isDone;
              return (
                <div key={ch.id} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition shadow-sm ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isChLocked
                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                        : isCurrent
                        ? 'bg-brand-600 text-white ring-2 ring-emerald-500'
                        : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : isChLocked ? (
                      <LockIcon className="h-3.5 w-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="mt-1.5 font-bold text-[10px] text-zinc-800 dark:text-zinc-200 truncate w-full">
                    {ch.isStart ? '1. START' : ch.isEnd ? '5. END' : `Ch ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

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
                className={`absolute -left-[37px] sm:-left-[45px] top-6 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs font-bold shadow-md ${
                  isDone
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : isLocked
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                    : isCurrent
                    ? 'border-emerald-500 bg-white text-emerald-700 dark:bg-zinc-900 dark:text-emerald-400 ring-2 ring-emerald-500/40'
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
                    ? 'border-emerald-500 bg-white shadow-md dark:border-emerald-500/40 dark:bg-zinc-900 ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <div
                  className="flex min-h-[72px] w-full cursor-pointer items-center justify-between p-5 sm:p-6"
                  onClick={() => setExpandedChapterId(isExpanded ? '' : chapter.id)}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {chapter.isStart && (
                        <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                          START HERE
                        </span>
                      )}
                      {chapter.isEnd && (
                        <span className="rounded bg-purple-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
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
          <span className="absolute -left-[37px] sm:-left-[45px] top-4 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600 text-white shadow-md">
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