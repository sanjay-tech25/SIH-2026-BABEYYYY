import React from 'react';
import { ArrowRightIcon, ClockIcon, PlayIcon, CheckIcon, SparklesIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { learner, courses, todaysPlan, type ViewId } from '../data/appData';

type DashboardProps = {
  onNavigate: (id: ViewId) => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const current = courses[0];
  const minutesToday = todaysPlan.reduce((sum, item) => sum + item.minutes, 0);
  const doneToday = todaysPlan.filter((item) => item.done).length;

  return (
    <div className="space-y-14">
      {/* Greeting — tight block, no CTA pair */}
      <section>
        <p className="text-label font-medium uppercase text-brand-700 dark:text-brand-300">
          Thursday, 10 September
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          Morning, {learner.name}. Two lessons left in phase gates.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Your plan today takes about {minutesToday} minutes.
        </p>
      </section>

      {/* Pick up where you left off — single wide panel */}
      <section aria-labelledby="continue-heading">
        <h2
          id="continue-heading"
          className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
          
          Pick up where you left off
        </h2>
        <Card className="mt-4 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Lesson 8 of {current.lessonsTotal}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
                Phase gates and rotations
              </h3>
              <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
                Part of {current.title}. You stopped halfway through the worked example.
              </p>
              <div className="mt-6 max-w-sm">
                <div className="flex items-baseline justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    {current.lessonsDone} of {current.lessonsTotal} lessons done
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {current.minutesLeft} min left
                  </span>
                </div>
                <ProgressBar
                  value={current.lessonsDone / current.lessonsTotal * 100}
                  label={`${current.title} progress`}
                  className="mt-2" />
                
              </div>
            </div>
            <Button onClick={() => onNavigate('lesson')} className="shrink-0">
              <PlayIcon className="h-4 w-4" aria-hidden="true" />
              Resume lesson 8
            </Button>
          </div>
        </Card>
      </section>

      {/* Today's plan — checklist, different structure, tighter spacing */}
      <section aria-labelledby="plan-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="plan-heading"
            className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
            
            What you planned for today
          </h2>
          <p className="text-body text-zinc-500 dark:text-zinc-400">
            {doneToday} of {todaysPlan.length} done
          </p>
        </div>
        <ul className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {todaysPlan.map((item) =>
          <li key={item.id} className="flex items-center gap-4 py-4">
              <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
              item.done ?
              'border-brand-600 bg-brand-600 text-white' :
              'border-zinc-300 text-transparent dark:border-zinc-700'}`
              }
              aria-hidden="true">
              
                <CheckIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                className={`text-body font-medium ${
                item.done ?
                'text-zinc-400 line-through dark:text-zinc-500' :
                'text-zinc-900 dark:text-zinc-100'}`
                }>
                
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.kind} · {item.minutes} min
                </p>
              </div>
              {!item.done &&
            <Button
              variant="ghost"
              onClick={() => onNavigate(item.kind === 'Practice' ? 'practice' : 'lesson')}>
              
                  Start
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
            }
            </li>
          )}
        </ul>
      </section>

      {/* Recommendation — asymmetric, two columns */}
      <section aria-labelledby="next-heading" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <p className="inline-flex items-center gap-1.5 text-label font-medium uppercase text-brand-700 dark:text-brand-300">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Suggested next
          </p>
          <h2
            id="next-heading"
            className="mt-3 font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
            
            You're ready for entanglement
          </h2>
          <p className="mt-2 max-w-md text-body text-zinc-600 dark:text-zinc-400">
            You've mastered linear algebra, so two-qubit gates should land easily. Roughly 15
            minutes.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => onNavigate('path')}>
            See it on your path
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-h3 font-semibold text-zinc-900 dark:text-zinc-50">
            This week
          </h2>
          <dl className="mt-4 space-y-4">
            {[
            { label: 'Time studied', value: '10.8 hrs' },
            { label: 'Practice accuracy', value: '91%' },
            { label: 'Days in a row', value: `${learner.streakDays}` }].
            map((stat) =>
            <div
              key={stat.label}
              className="flex items-baseline justify-between border-b border-zinc-200 pb-3 last:border-0 last:pb-0 dark:border-zinc-800">
              
                <dt className="text-body text-zinc-600 dark:text-zinc-400">{stat.label}</dt>
                <dd className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </section>
    </div>);

}