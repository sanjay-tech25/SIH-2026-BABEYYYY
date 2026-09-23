import { useState, useEffect } from 'react';
import { 
  FlaskConicalIcon, 
  CheckCircle2Icon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { ChapterLab } from '../components/ChapterLab';
import { CURRICULUM } from '../data/curriculumData';
import { stateStore, type AppState } from '../services/stateStore';

export function OpenLab() {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('t1-1');

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const currentChapter = CURRICULUM.find(c => c.id === selectedChapterId) || CURRICULUM[0];
  const currentTopic = currentChapter.topics.find(t => t.id === selectedTopicId) || currentChapter.topics[0];

  const totalLabs = CURRICULUM.reduce((acc, c) => acc + c.topics.length, 0);
  const completedLabs = appState.progress.completedLabs.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Open Quantum Laboratory Hub"
        subtitle="Practical interactive simulation sandboxes and Google Colab notebooks for all 5 chapters."
      />

      {/* Overview Lab Banner */}
      <Card className="p-6 bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/10 border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <FlaskConicalIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Every Chapter & Topic Includes an Open Lab
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Practice what you learn with Qiskit simulations, quantum gate controls, and 1-click Colab notebooks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Labs Completed</span>
              <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {completedLabs} / {totalLabs}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chapter Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        {CURRICULUM.map((chapter) => {
          const isSelected = selectedChapterId === chapter.id;
          const completedInChapter = chapter.topics.filter(t => appState.progress.completedLabs.includes(t.lab.id)).length;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                setSelectedChapterId(chapter.id);
                setSelectedTopicId(chapter.topics[0].id);
              }}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              Chapter {chapter.number}: {chapter.title.split(':')[1]?.trim() || chapter.title}
              {completedInChapter > 0 && (
                <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {completedInChapter}/{chapter.topics.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Topic Selection Within Chapter */}
      <div className="flex flex-wrap gap-2">
        {currentChapter.topics.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          const isDone = appState.progress.completedLabs.includes(topic.lab.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopicId(topic.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <FlaskConicalIcon className="h-3.5 w-3.5 text-zinc-400" />
              )}
              {topic.number}: {topic.title}
            </button>
          );
        })}
      </div>

      {/* Active Practical Open Lab Component */}
      <ChapterLab
        key={currentTopic.lab.id}
        mission={currentTopic.lab}
        chapterId={currentChapter.id}
        topicTitle={currentTopic.title}
        onCompleted={() => {}}
      />
    </div>
  );
}
