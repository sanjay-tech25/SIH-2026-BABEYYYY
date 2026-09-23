import { useState, useEffect } from 'react';
import { ArrowRightIcon, ClockIcon, PlayIcon, CheckIcon, SparklesIcon, TargetIcon, BookOpenIcon, CompassIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { stateStore, type AppState } from '../services/stateStore';
import { CURRICULUM } from '../data/curriculumData';
import type { ViewId } from '../data/appData';

type DashboardProps = {
  onNavigate: (id: ViewId) => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const p = appState.progress;
  const user = appState.user;
  const isBrandNew = p.completedLessons.length === 0;

  // Formatted current date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Calculate dynamic active chapter & pending topic
  const activeChapter = CURRICULUM.find(c => c.id === p.activeChapterId) || CURRICULUM[0];
  const pendingTopic = activeChapter.topics.find(t => !p.completedLessons.includes(t.id)) || activeChapter.topics[0];

  const planItems = [
    {
      id: 'plan-1',
      title: `${pendingTopic.title}`,
      kind: 'Theory & Dirac Formalism',
      minutes: pendingTopic.minutes || 12,
      done: p.completedLessons.includes(pendingTopic.id),
      target: 'lesson' as ViewId
    },
    {
      id: 'plan-2',
      title: `${pendingTopic.lab.title}`,
      kind: 'AerSimulator Practical Lab',
      minutes: 15,
      done: p.completedLabs.includes(pendingTopic.lab.id),
      target: 'openlab' as ViewId
    },
    {
      id: 'plan-3',
      title: 'Topic Diagnostic Skill Check',
      kind: 'Adaptive Diagnostic Practice',
      minutes: 10,
      done: Boolean(p.quizScores[pendingTopic.id]),
      target: 'assessments' as ViewId
    }
  ];

  const minutesToday = planItems.reduce((sum, item) => sum + item.minutes, 0);
  const doneToday = planItems.filter((item) => item.done).length;

  const totalTopics = CURRICULUM.reduce((acc, c) => acc + c.topics.length, 0);
  const coursePercent = totalTopics > 0 ? Math.round((p.completedLessons.length / totalTopics) * 100) : 0;

  const accuracy = p.totalQuizAttempts > 0
    ? Math.round((p.correctQuizAnswers / p.totalQuizAttempts) * 100)
    : 0;

  return (
    <div className="space-y-12">
      {/* Live Learner Greeting — "Hello, shall we start?" */}
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {todayFormatted}
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          {isBrandNew
            ? `Hello, ${user.name}! Shall we start?`
            : `Welcome back, ${user.name}. Let's advance your quantum roadmap.`}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {isBrandNew
            ? 'Welcome to your quantum computing journey. Your path begins from the ground up with the mathematics of qubits, Dirac notation, and superposition.'
            : `Today's recommended trajectory takes approximately ${minutesToday} minutes across theory and verified laboratory missions.`}
        </p>
      </section>

      {/* Hero Action: Start Journey or Pick up where you left off */}
      <section aria-labelledby="continue-heading">
        <h2
          id="continue-heading"
          className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          {isBrandNew ? 'Start Your Learning Journey' : 'Pick Up Where You Left Off'}
        </h2>
        <Card className="mt-3 p-6 sm:p-7 border-l-4 border-l-emerald-600 bg-white dark:bg-zinc-900">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <TargetIcon className="h-3.5 w-3.5" />
                {activeChapter.title} · Topic {pendingTopic.number}
              </span>
              <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {pendingTopic.title}
              </h3>
              <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {pendingTopic.summary}
              </p>
              <div className="mt-5 max-w-sm">
                <div className="flex items-baseline justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                  <span>
                    {p.completedLessons.length} of {totalTopics} topics completed · {coursePercent}%
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                    <ClockIcon className="h-3.5 w-3.5" />
                    ~{pendingTopic.minutes} min
                  </span>
                </div>
                <ProgressBar
                  value={coursePercent}
                  label="Curriculum progress"
                  className="h-2"
                />
              </div>
            </div>

            <Button
              onClick={() => {
                stateStore.setActiveLesson(activeChapter.id, pendingTopic.id);
                onNavigate('lesson');
              }}
              className="shrink-0 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <PlayIcon className="h-4 w-4" />
              {isBrandNew ? 'Begin Lesson 1.1' : `Resume: ${pendingTopic.title.split(':')[0]}`}
            </Button>
          </div>
        </Card>
      </section>

      {/* Today's Plan Checklist */}
      <section aria-labelledby="plan-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="plan-heading"
            className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            Today's Learning Schedule
          </h2>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {doneToday} of {planItems.length} modules completed
          </p>
        </div>
        <ul className="mt-3 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {planItems.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                  item.done
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-zinc-300 text-transparent dark:border-zinc-700'
                }`}
                aria-hidden="true"
              >
                <CheckIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    item.done
                      ? 'text-zinc-400 line-through dark:text-zinc-500'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.kind} · {item.minutes} min
                </p>
              </div>
              {!item.done && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(item.target)}
                  className="shrink-0 gap-1 text-xs"
                >
                  Start
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Recommendations & Live Weekly Telemetry */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
              <SparklesIcon className="h-3.5 w-3.5" />
              AI Trajectory Recommendation
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {isBrandNew
                ? 'First Milestone Target: MS-01 (Hilbert Space)'
                : 'Advancing Toward Milestone: MS-02'}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {isBrandNew
                ? 'Master Dirac bra-ket notation and statevector normalization in Chapter 1 to earn your first verified cryptographic competence credential.'
                : 'You have begun single-qubit rotations. Complete Hadamard worked examples to finalize your unitary gates certification.'}
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                stateStore.setActiveLesson('ch-1', 't1-1');
                onNavigate('lesson');
              }}
            >
              Start Topic 1.1
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('path')}>
              View Roadmap
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
            Real Telemetry Snapshot
          </h3>
          <dl className="mt-4 space-y-3">
            {[
              { label: 'Active Study Time', value: `${(p.totalStudyMinutes / 60).toFixed(1)} hrs` },
              { label: 'Assessment Accuracy', value: p.totalQuizAttempts > 0 ? `${accuracy}%` : 'No checks yet' },
              { label: 'Consecutive Streak', value: `${p.streakDays} Days` },
              { label: 'Verified Competency Points', value: `${p.totalXP} CP (Tier ${p.currentLevel})` }
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0 dark:border-zinc-800"
              >
                <dt className="text-xs text-zinc-600 dark:text-zinc-400">{stat.label}</dt>
                <dd className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>
    </div>
  );
}