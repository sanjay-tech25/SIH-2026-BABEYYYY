import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { assessments, pastAttempts } from '../data/appData';

type AssessmentsProps = {
  onStartPractice: () => void;
};

export function Assessments({ onStartPractice }: AssessmentsProps) {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Assessments"
        subtitle="Two checks are open, and your past attempts are below." />
      

      <section aria-labelledby="open-heading">
        <h2 id="open-heading" className="sr-only">
          Open assessments
        </h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {assessments.map((a) =>
          <Card as="li" key={a.id} className="flex flex-col p-6">
              <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
                {a.kind}
              </p>
              <h3 className="mt-3 font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                {a.title}
              </h3>
              <p className="mt-2 flex-1 text-body text-zinc-600 dark:text-zinc-400">{a.summary}</p>

              <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-body dark:border-zinc-800">
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Questions</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{a.questions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Time needed</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{a.minutes} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Your best</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {a.bestScore === null ? 'Not attempted' : `${a.bestScore}%`}
                  </dd>
                </div>
              </dl>

              <Button
              variant={a.bestScore === null ? 'secondary' : 'primary'}
              className="mt-6 w-full"
              onClick={onStartPractice}>
              
                {a.bestScore === null ? 'Take the skill check' : 'Retake the diagnostic'}
              </Button>
            </Card>
          )}
        </ul>
      </section>

      <section aria-labelledby="past-heading">
        <h2
          id="past-heading"
          className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
          
          What you've already taken
        </h2>
        <ul className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {pastAttempts.map((r) =>
          <li key={r.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">{r.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {r.date} · {r.missed} question{r.missed === 1 ? '' : 's'} missed
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {r.score}%
                </span>
                <Button variant="ghost">
                  Review answers
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </li>
          )}
        </ul>
      </section>
    </div>);

}