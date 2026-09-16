import React, { useState } from 'react';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  LightbulbIcon,
  XIcon,
  XCircleIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { practiceSet } from '../data/learningContent';
import type { ViewId } from '../data/appData';

export type PracticeResult = {
  correct: number;
  total: number;
  minutes: number;
  wrongConcepts: string[];
  rightConcepts: string[];
};

type PracticeProps = {
  onFinish: (result: PracticeResult) => void;
  onNavigate: (id: ViewId) => void;
};

export function Practice({ onFinish, onNavigate }: PracticeProps) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [right, setRight] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);

  const question = practiceSet[index];
  const isCorrect = choice === question.correctId;
  const isLast = index === practiceSet.length - 1;

  const submit = () => {
    if (!choice) return;
    setSubmitted(true);
    if (choice === question.correctId) setRight((prev) => [...prev, question.concept]);else
    setWrong((prev) => [...prev, question.concept]);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setChoice(null);
    setSubmitted(false);
    setShowHint(false);
  };

  // right/wrong already include the current question once submitted
  const finish = () => {
    onFinish({
      correct: right.length,
      total: practiceSet.length,
      minutes: 6,
      wrongConcepts: wrong,
      rightConcepts: right
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-body text-zinc-500 dark:text-zinc-400">
          Question {index + 1} of {practiceSet.length}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-body text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
          Leave practice
        </button>
      </div>
      <ProgressBar
        value={(index + (submitted ? 1 : 0)) / practiceSet.length * 100}
        label="Practice progress"
        className="mt-3" />
      

      <p className="mt-10 text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
        {question.concept}
      </p>
      <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
        {question.prompt}
      </h1>

      <ul className="mt-8 space-y-2">
        {question.options.map((option) => {
          const selected = choice === option.id;
          const isAnswer = option.id === question.correctId;
          const showState = submitted && (selected || isAnswer);
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={submitted}
                onClick={() => setChoice(option.id)}
                aria-pressed={selected}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-4 text-left text-body transition-colors ${
                showState && isAnswer ?
                'border-brand-600 bg-brand-50 text-zinc-900 dark:bg-brand-600/15 dark:text-zinc-100' :
                showState && selected ?
                'border-zinc-400 bg-zinc-100 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800' :
                selected ?
                'border-brand-600 text-zinc-900 dark:text-zinc-100' :
                'border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'}`
                }>
                
                <span aria-hidden="true" className="shrink-0 text-zinc-400">
                  {showState && isAnswer ?
                  <CheckCircle2Icon className="h-5 w-5 text-brand-600" /> :
                  showState && selected ?
                  <XCircleIcon className="h-5 w-5" /> :

                  <CircleIcon className="h-5 w-5" />
                  }
                </span>
                {option.label}
              </button>
            </li>);

        })}
      </ul>

      {showHint && !submitted &&
      <p className="mt-5 border-l-2 border-brand-600 pl-4 text-body text-zinc-600 dark:text-zinc-400">
          {question.hint}
        </p>
      }

      {submitted &&
      <div className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">
            {isCorrect ? 'Correct.' : `The answer is “${
          question.options.find((o) => o.id === question.correctId)?.label}”.`
          }
          </p>
          <p className="mt-1 text-body text-zinc-600 dark:text-zinc-400">{question.explanation}</p>
        </div>
      }

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!submitted ?
        <>
            <Button disabled={!choice} onClick={submit}>
              Submit answer
            </Button>
            {!showHint &&
          <Button variant="ghost" onClick={() => setShowHint(true)}>
                <LightbulbIcon className="h-4 w-4" aria-hidden="true" />
                Show a hint
              </Button>
          }
          </> :

        <Button onClick={isLast ? finish : next}>
            {isLast ? 'See your results' : 'Next question'}
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      </div>
    </div>);

}