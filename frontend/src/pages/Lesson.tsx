import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  CircleIcon,
  CheckCircle2Icon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { currentLesson, lessonOutline } from '../data/learningContent';
import type { ViewId } from '../data/appData';

type LessonProps = {
  onNavigate: (id: ViewId) => void;
};

export function Lesson({ onNavigate }: LessonProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const lesson = currentLesson;
  const done = lessonOutline.filter((l) => l.done).length;
  const correct = choice === lesson.check.correctId;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0">
        <button
          type="button"
          onClick={() => onNavigate('path')}
          className="inline-flex min-h-[44px] items-center gap-2 text-body text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to your path
        </button>

        <header className="mt-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
            {lesson.course} · Lesson {lesson.index}
          </p>
          <h1 className="mt-3 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
            {lesson.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-body text-zinc-500 dark:text-zinc-400">
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
            About {lesson.minutes} minutes
          </p>
        </header>

        <div className="mt-8 max-w-2xl space-y-6">
          {lesson.blocks.map((block) => {
            if (block.kind === 'heading') {
              return (
                <h2
                  key={block.id}
                  className="pt-4 font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                  
                  {block.body}
                </h2>);

            }
            if (block.kind === 'text') {
              return (
                <p
                  key={block.id}
                  className="text-[0.9375rem] leading-[1.75] text-zinc-700 dark:text-zinc-300">
                  
                  {block.body}
                </p>);

            }
            if (block.kind === 'list') {
              return (
                <ul key={block.id} className="space-y-2">
                  {block.items.map((item) =>
                  <li
                    key={item}
                    className="flex gap-3 text-[0.9375rem] leading-[1.75] text-zinc-700 dark:text-zinc-300">
                    
                      <span
                      className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                      aria-hidden="true" />
                    
                      {item}
                    </li>
                  )}
                </ul>);

            }
            if (block.kind === 'formula') {
              return (
                <figure key={block.id} className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
                  <pre className="overflow-x-auto font-mono text-base text-zinc-900 dark:text-zinc-100">
                    {block.body}
                  </pre>
                  <figcaption className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {block.caption}
                  </figcaption>
                </figure>);

            }
            return (
              <aside
                key={block.id}
                className="border-l-2 border-brand-600 pl-5 text-[0.9375rem] leading-[1.75]">
                
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{block.title}</p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">{block.body}</p>
              </aside>);

          })}
        </div>

        {/* Knowledge check */}
        <section
          aria-labelledby="check-heading"
          className="mt-12 max-w-2xl rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          
          <p className="text-label font-medium uppercase text-brand-700 dark:text-brand-300">
            Quick check
          </p>
          <h2
            id="check-heading"
            className="mt-3 font-display text-h3 font-semibold text-zinc-900 dark:text-zinc-50">
            
            {lesson.check.prompt}
          </h2>

          <ul className="mt-5 space-y-2">
            {lesson.check.options.map((option) => {
              const selected = choice === option.id;
              const isAnswer = option.id === lesson.check.correctId;
              const showState = submitted && (selected || isAnswer);
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => setChoice(option.id)}
                    aria-pressed={selected}
                    className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-4 text-left text-body transition-colors ${
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
                      <XIcon className="h-5 w-5" /> :
                      selected ?
                      <CheckIcon className="h-5 w-5 text-brand-600" /> :

                      <CircleIcon className="h-5 w-5" />
                      }
                    </span>
                    {option.label}
                  </button>
                </li>);

            })}
          </ul>

          {submitted ?
          <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">
                {correct ? 'That’s right.' : 'Not quite.'}
              </p>
              <p className="mt-1 text-body text-zinc-600 dark:text-zinc-400">
                {lesson.check.explanation}
              </p>
            </div> :

          <Button className="mt-5" disabled={!choice} onClick={() => setSubmitted(true)}>
              Check my answer
            </Button>
          }
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <Button variant="secondary" onClick={() => onNavigate('path')}>
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Previous lesson
          </Button>
          <Button onClick={() => onNavigate('practice')}>
            Practise this concept
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
            In this module
          </p>
          <ProgressBar
            value={done / lessonOutline.length * 100}
            label="Module progress"
            className="mt-3" />
          
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {done} of {lessonOutline.length} lessons done
          </p>
          <ol className="mt-5 space-y-1">
            {lessonOutline.map((item) => {
              const active = item.id === lesson.id;
              return (
                <li key={item.id}>
                  <span
                    className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-body ${
                    active ?
                    'bg-brand-50 font-medium text-brand-700 dark:bg-brand-600/15 dark:text-brand-200' :
                    item.done ?
                    'text-zinc-500 dark:text-zinc-400' :
                    'text-zinc-500 dark:text-zinc-500'}`
                    }>
                    
                    <span aria-hidden="true">
                      {item.done ?
                      <CheckCircle2Icon className="h-4 w-4 text-brand-600" /> :

                      <CircleIcon className="h-4 w-4" />
                      }
                    </span>
                    <span className="truncate">{item.title}</span>
                  </span>
                </li>);

            })}
          </ol>
        </div>
      </aside>
    </div>);

}