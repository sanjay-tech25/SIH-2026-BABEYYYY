import React from 'react';
import { ArrowRightIcon, RotateCcwIcon, AwardIcon, CheckCircle2Icon } from 'lucide-react';
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
  const accuracy = Math.round((result.correct / result.total) * 100);
  const strong = Array.from(new Set(result.rightConcepts));
  const weak = Array.from(new Set(result.wrongConcepts));

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="text-center sm:text-left">
        <span className="rounded-full bg-purple-100 px-3 py-1 font-mono text-sm font-bold text-[#4c1d70] border border-[#cbb3d8]">
          PRACTICE SUMMARY
        </span>
        <h1 className="mt-3 font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          {accuracy >= 75
            ? 'Outstanding run — concepts are solidifying!'
            : 'Good effort — worth another review session.'}
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400">
          You answered {result.correct} of {result.total} questions correctly in about {result.minutes} minutes.
        </p>
      </header>

      <div className="border-y border-purple-100/80 py-6">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-mono font-bold uppercase tracking-wider text-[#4c1d70]">Accuracy this session</p>
          <p className="font-orbitron text-4xl font-bold text-[#4c1d70]">
            {accuracy}%
          </p>
        </div>
        <ProgressBar value={accuracy} label="Session accuracy" className="mt-3" />
      </div>

      <section aria-labelledby="breakdown-heading" className="space-y-4">
        <h2
          id="breakdown-heading"
          className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white"
        >
          Concept Performance Breakdown
        </h2>
        <ul className="divide-y divide-purple-100/80 border-y border-purple-100/80">
          {[
            ...strong.map((c) => ({ concept: c, ok: true })),
            ...weak.map((c) => ({ concept: c, ok: false })),
          ].map((row) => (
            <li key={`${row.concept}-${row.ok}`} className="flex items-center justify-between py-3.5">
              <span className="font-poppins text-base font-medium text-slate-800">{row.concept}</span>
              <span
                className={`text-sm font-bold font-mono ${
                  row.ok ? 'text-emerald-600' : 'text-[#4c1d70]'
                }`}
              >
                {row.ok ? '✓ Answered correctly' : '● Needs another look'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {weak.length > 0 && (
        <section className="rounded-xl border-l-4 border-[#4c1d70] bg-purple-50/70 p-5 text-base">
          <h2 className="font-orbitron text-sm font-bold text-[#3b1458]">
            Recommended Next Step
          </h2>
          <p className="mt-1.5 font-poppins text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>{weak[0]}</strong> caused some friction. Re-reading that section in Lesson 8 takes about 4 minutes, then retrying this practice set will ensure full retention.
          </p>
        </section>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button className="rounded-full px-5 py-2.5 font-orbitron text-sm font-bold shadow-sm" onClick={() => onNavigate('lesson')}>
          <span>Reread the lesson</span>
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="secondary" className="rounded-full px-5 py-2.5 font-orbitron text-sm font-bold shadow-sm" onClick={onRetry}>
          <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
          <span>Try the set again</span>
        </Button>
      </div>
    </div>
  );
}