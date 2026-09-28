import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  CircleIcon,
  CheckCircle2Icon,
  SparklesIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { currentLesson, lessonOutline } from '../data/learningContent';
import { apiClient } from '../services/apiClient';
import type { ViewId } from '../data/appData';

type LessonProps = {
  onNavigate: (id: ViewId) => void;
};

export function Lesson({ onNavigate }: LessonProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [socraticTip, setSocraticTip] = useState<string | null>(null);
  const lesson = currentLesson;
  const done = lessonOutline.filter((l) => l.done).length;
  const correct = choice === lesson.check.correctId;

  const handleCheckAnswer = async () => {
    if (!choice) return;
    setSubmitted(true);
    try {
      await apiClient.sendQubotEvent('CHECKPOINT_EVALUATED', {
        lesson_id: lesson.id,
        is_correct: correct,
        selected: choice
      });
      await apiClient.completeLesson(lesson.id, 180);
      if (!correct) {
        const diag = await apiClient.whyFailed(
          lesson.course,
          lesson.id,
          choice,
          lesson.check.correctId,
          lesson.check.explanation,
          lesson.check.prompt
        );
        if (diag?.socratic_inquiry) {
          setSocraticTip(diag.socratic_inquiry);
        }
      }
    } catch {
      // offline safe
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="min-w-0">
        <button
          type="button"
          onClick={() => onNavigate('path')}
          className="inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-[#4c1d70] hover:text-[#3b1458] transition"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to learning path
        </button>

        <header className="mt-4 border-b border-purple-900/10 pb-8">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 font-mono text-[13px] font-bold text-[#4c1d70] border border-purple-300">
              {lesson.course} · LESSON {lesson.index}
            </span>
          </div>
          <h1 className="mt-3 font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
            {lesson.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 font-poppins text-base font-medium text-slate-500">
            <ClockIcon className="h-4 w-4 text-[#4c1d70]" aria-hidden="true" />
            About {lesson.minutes} minutes of conceptual study & simulation
          </p>
        </header>

        <div className="mt-8 max-w-2xl space-y-6">
          {lesson.blocks.map((block) => {
            if (block.kind === 'heading') {
              return (
                <h2
                  key={block.id}
                  className="pt-4 font-orbitron text-lg sm:text-xl font-bold text-[#1a052e] dark:text-white"
                >
                  {block.body}
                </h2>
              );
            }
            if (block.kind === 'text') {
              return (
                <p
                  key={block.id}
                  className="font-poppins text-lg leading-relaxed text-slate-700 dark:text-zinc-300"
                >
                  {block.body}
                </p>
              );
            }
            if (block.kind === 'list') {
              return (
                <ul key={block.id} className="space-y-2.5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-lg leading-relaxed text-slate-700"
                    >
                      <span
                        className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-[#f5d626] ring-2 ring-[#4c1d70]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.kind === 'formula') {
              return (
                <figure key={block.id} className="rounded-3xl bg-[#160624] p-6 border border-purple-900/60 shadow-xl">
                  <pre className="overflow-x-auto font-mono text-lg font-bold text-[#f5d626] leading-relaxed">
                    {block.body}
                  </pre>
                  <figcaption className="mt-3 text-sm font-mono text-purple-300">
                    {block.caption}
                  </figcaption>
                </figure>
              );
            }
            return (
              <aside
                key={block.id}
                className="rounded-2xl border-l-4 border-[#4c1d70] bg-purple-50/70 p-5 text-base leading-relaxed"
              >
                <p className="font-bold text-[#3b1458] flex items-center gap-1.5">
                  <SparklesIcon className="h-4 w-4 text-[#f5d626]" />
                  {block.title}
                </p>
                <p className="mt-1.5 text-slate-600">{block.body}</p>
              </aside>
            );
          })}
        </div>

        {/* Knowledge check */}
        <section
          aria-labelledby="check-heading"
          className="mt-12 max-w-2xl border-t-2 border-[#4c1d70] pt-8"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-50 px-3 py-1 font-mono text-[13px] font-bold text-[#4c1d70] border border-purple-200">
              QUICK UNDERSTANDING CHECK
            </span>
          </div>
          <h2
            id="check-heading"
            className="mt-3 font-orbitron text-lg font-bold text-[#1a052e] dark:text-white"
          >
            {lesson.check.prompt}
          </h2>

          <ul className="mt-5 space-y-2.5">
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
                    className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border px-4 py-2 text-left font-poppins text-base transition-all ${
                      showState && isAnswer
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                        : showState && selected
                        ? 'border-rose-400 bg-rose-50 text-rose-950'
                        : selected
                        ? 'border-2 border-[#4c1d70] bg-purple-100/70 text-[#3b1458] font-semibold ring-2 ring-[#4c1d70]/20'
                        : 'border border-[#cbb3d8] bg-white text-slate-800 hover:border-[#4c1d70] hover:bg-[#fbf9fd] shadow-sm'
                    }`}
                  >
                    <span aria-hidden="true" className="shrink-0">
                      {showState && isAnswer ? (
                        <CheckCircle2Icon className="h-5 w-5 text-emerald-600" />
                      ) : showState && selected ? (
                        <XIcon className="h-5 w-5 text-rose-600" />
                      ) : selected ? (
                        <CheckIcon className="h-5 w-5 text-[#4c1d70]" />
                      ) : (
                        <CircleIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </span>
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {submitted ? (
            <div className="genie-content mt-5 rounded-2xl border border-[#cbb3d8] bg-[#fbf9fd] p-4 space-y-3">
              <p className="font-orbitron text-sm font-bold text-[#3b1458]">
                {correct ? 'That’s right!' : 'Not quite.'}
              </p>
              <p className="font-poppins text-sm text-slate-600 leading-relaxed">
                {lesson.check.explanation}
              </p>
              {socraticTip && (
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 text-xs text-purple-900 font-medium">
                  <span className="font-bold flex items-center gap-1 text-[#4c1d70] mb-1">
                    <SparklesIcon className="h-3 w-3 text-[#f5d626]" /> Socratic Reflection:
                  </span>
                  {socraticTip}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={!choice}
              onClick={handleCheckAnswer}
              className="mt-6 rounded-full bg-[#f5d626] px-6 py-2.5 font-orbitron text-sm font-bold text-zinc-950 hover:bg-yellow-400 shadow-md transition disabled:opacity-40"
            >
              Check my answer
            </button>
          )}
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2d5ec] pt-6">
          <Button variant="secondary" className="rounded-full px-5 py-2.5 font-orbitron text-sm font-bold shadow-sm" onClick={() => onNavigate('path')}>
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span>Previous lesson</span>
          </Button>
          <Button className="rounded-full px-5 py-2.5 font-orbitron text-sm font-bold shadow-sm" onClick={() => onNavigate('practice')}>
            <span>Practise this concept</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </article>

      {/* Right Sidebar: Module Progress Outline */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 pl-6 border-l border-purple-100/80">
          <p className="font-orbitron text-sm font-bold uppercase tracking-wider text-[#4c1d70]">
            In this module
          </p>
          <ProgressBar
            value={(done / lessonOutline.length) * 100}
            label="Module progress"
            className="mt-3"
          />

          <p className="mt-2 text-sm font-medium text-slate-500">
            {done} of {lessonOutline.length} lessons done
          </p>
          <ol className="mt-5 space-y-1">
            {lessonOutline.map((item) => {
              const active = item.id === lesson.id;
              return (
                <li key={item.id}>
                  <span
                    className={`flex min-h-[44px] items-center gap-3 rounded-2xl px-3 text-sm transition ${
                      active
                        ? 'bg-purple-100 font-bold text-[#4c1d70]'
                        : item.done
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    <span aria-hidden="true">
                      {item.done ? (
                        <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <CircleIcon className="h-4 w-4 text-slate-300" />
                      )}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </div>
  );
}
