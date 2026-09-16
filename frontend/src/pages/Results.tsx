import React from 'react';
import { ArrowRightIcon, RotateCcwIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import type { PracticeResult } from './Practice';
import type { ViewId } from '../data/appData';

type ResultsProps = {
  result: PracticeResult;
  onNavigate: (id: ViewId) => void;
  onRetry: () => void;
};

export function Results({ result, onNavigate, onRetry }: ResultsProps) {
  const accuracy = Math.round(result.correct / result.total * 100);
  const strong = Array.from(new Set(result.rightConcepts));
  const weak = Array.from(new Set(result.wrongConcepts));

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header>
        <p className="text-label font-medium uppercase text-brand-700 dark:text-brand-300">
          Practice finished
        </p>
        <h1 className="mt-3 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          {accuracy >= 75 ?
          'Solid run — phase gates are sticking.' :
          'Worth another pass at phase gates.'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          You answered {result.correct} of {result.total} correctly in about {result.minutes}{' '}
          minutes.
        </p>
      </header>

      <Card className="p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-body text-zinc-600 dark:text-zinc-400">Accuracy this session</p>
          <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {accuracy}%
          </p>
        </div>
        <ProgressBar value={accuracy} label="Session accuracy" className="mt-4" />
      </Card>

      <section aria-labelledby="breakdown-heading">
        <h2
          id="breakdown-heading"
          className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
          
          Concept by concept
        </h2>
        <ul className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {[
          ...strong.map((c) => ({ concept: c, ok: true })),
          ...weak.map((c) => ({ concept: c, ok: false }))].
          map((row) =>
          <li key={`${row.concept}-${row.ok}`} className="flex items-center justify-between py-4">
              <span className="text-body text-zinc-900 dark:text-zinc-100">{row.concept}</span>
              <span
              className={`text-body ${
              row.ok ? 'text-zinc-500 dark:text-zinc-400' : 'font-medium text-brand-700 dark:text-brand-300'}`
              }>
              
                {row.ok ? 'Answered correctly' : 'Needs another look'}
              </span>
            </li>
          )}
        </ul>
      </section>

      {weak.length > 0 &&
      <section className="border-l-2 border-brand-600 pl-5">
          <h2 className="font-display text-h3 font-semibold text-zinc-900 dark:text-zinc-50">
            What to do next
          </h2>
          <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
            {weak[0]} tripped you up. Re-reading that section takes about four minutes, then this
            set will feel easier.
          </p>
        </section>
      }

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onNavigate('lesson')}>
          Reread the lesson
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
          Try the set again
        </Button>
      </div>
    </div>);

}