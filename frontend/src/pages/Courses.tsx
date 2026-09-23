import { useState, useEffect } from 'react';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
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

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const handleSelectTopic = (chapterId: string, topicId: string) => {
    stateStore.setActiveLesson(chapterId, topicId);
    onNavigate('lesson');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Curriculum Chapters & Syllabi"
        subtitle="The complete 5-Chapter curriculum from foundational quantum states to advanced algorithms."
      />

      <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
        {CURRICULUM.map((chapter) => {
          const isDone = appState.progress.completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === appState.progress.activeChapterId;
          const completedTopicsInChapter = chapter.topics.filter(t =>
            appState.progress.completedLessons.includes(t.id)
          ).length;
          const chapterPercent = Math.round((completedTopicsInChapter / chapter.topics.length) * 100);

          return (
            <Card key={chapter.id} className="flex flex-col p-6 sm:p-7 justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {chapter.isStart && (
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        START
                      </span>
                    )}
                    {chapter.isEnd && (
                      <span className="rounded bg-purple-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        FINISH
                      </span>
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Chapter {chapter.number}
                    </span>
                  </div>

                  {isDone ? (
                    <StatusChip tone="done">Completed</StatusChip>
                  ) : isCurrent ? (
                    <StatusChip tone="active">In Progress</StatusChip>
                  ) : (
                    <StatusChip tone="locked">Upcoming</StatusChip>
                  )}
                </div>

                <h3 className="mt-3 font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {chapter.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {chapter.subtitle}
                </p>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {chapter.summary}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                    <span>{completedTopicsInChapter} of {chapter.topics.length} topics finished</span>
                    <span>{chapterPercent}%</span>
                  </div>
                  <ProgressBar value={chapterPercent} label="Chapter progress" className="mt-1.5" />
                </div>

                {/* Topic quick list */}
                <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  {chapter.topics.map((t) => {
                    const topicDone = appState.progress.completedLessons.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between text-xs py-1 text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {topicDone ? (
                            <CheckIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                          )}
                          <span className="truncate">{t.number}: {t.title}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-2">{t.minutes} min</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <Button
                  variant="secondary"
                  className="text-xs h-9"
                  onClick={() => onNavigate('path')}
                >
                  View in Journey
                </Button>
                <Button
                  className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleSelectTopic(chapter.id, chapter.topics[0].id)}
                >
                  {isDone ? 'Review Chapter' : 'Continue Chapter'}
                  <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}