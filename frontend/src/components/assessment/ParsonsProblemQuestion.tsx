import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, Code2Icon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ParsonsQuestion, ParsonsLine } from '../../data/assessmentBank';

interface ParsonsProblemQuestionProps {
  question: ParsonsQuestion;
  submitted: boolean;
  onAnswerSubmit: (isCorrect: boolean, orderedLines: ParsonsLine[]) => void;
}

export function ParsonsProblemQuestion({
  question,
  submitted,
  onAnswerSubmit,
}: ParsonsProblemQuestionProps) {
  const [lines, setLines] = useState<ParsonsLine[]>(question.scrambledLines);

  const moveUp = (index: number) => {
    if (submitted || index === 0) return;
    const next = [...lines];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setLines(next);
  };

  const moveDown = (index: number) => {
    if (submitted || index === lines.length - 1) return;
    const next = [...lines];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setLines(next);
  };

  const handleSubmit = () => {
    const isCorrect = lines.every((l, idx) => l.id === question.correctOrderIds[idx]);
    onAnswerSubmit(isCorrect, lines);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Use the arrows to arrange the code in correct execution sequence
        </p>
        <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Code2Icon className="h-3.5 w-3.5" />
          {question.language === 'qiskit' ? 'Qiskit Python' : 'Quantum Protocol'}
        </span>
      </div>

      <div className="space-y-2">
        {lines.map((line, idx) => {
          const isCorrectPosition = submitted && line.id === question.correctOrderIds[idx];
          const isWrongPosition = submitted && line.id !== question.correctOrderIds[idx];

          return (
            <div
              key={line.id}
              className={`flex items-center justify-between rounded-xl border p-3 font-mono text-sm transition-colors ${
                isCorrectPosition
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100'
                  : isWrongPosition
                  ? 'border-red-400 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100'
                  : 'border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {idx + 1}
                </span>
                <span style={{ paddingLeft: `${line.indentation * 16}px` }}>{line.code}</span>
              </div>

              {!submitted ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    title="Move up"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === lines.length - 1}
                    onClick={() => moveDown(idx)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    title="Move down"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center pr-2">
                  {isCorrectPosition ? (
                    <CheckCircle2Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} className="mt-4">
          Submit Code Order
        </Button>
      )}
    </div>
  );
}
