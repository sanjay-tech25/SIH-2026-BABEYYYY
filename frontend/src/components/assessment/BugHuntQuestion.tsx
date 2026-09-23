import React, { useState } from 'react';
import { BugIcon, CheckCircle2Icon, XCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { BugHuntQuestion as BugHuntQuestionType } from '../../data/assessmentBank';

interface BugHuntQuestionProps {
  question: BugHuntQuestionType;
  submitted: boolean;
  onAnswerSubmit: (isCorrect: boolean, selectedLineId: string) => void;
}

export function BugHuntQuestion({
  question,
  submitted,
  onAnswerSubmit,
}: BugHuntQuestionProps) {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedLineId) return;
    const isCorrect = selectedLineId === question.buggyLineId;
    onAnswerSubmit(isCorrect, selectedLineId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Click the line containing the conceptual bug or anti-pattern:
        </p>
        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <BugIcon className="h-3.5 w-3.5" />
          Quantum Diagnostic
        </span>
      </div>

      {/* Code Inspector */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 font-mono text-sm shadow-sm dark:border-zinc-800">
        <div className="border-b border-zinc-800 bg-zinc-900/70 px-4 py-2 text-xs text-zinc-400">
          quantum_circuit_diagnostic.py
        </div>
        <div className="divide-y divide-zinc-900">
          {question.lines.map((line) => {
            const isSelected = selectedLineId === line.id;
            const isBuggy = line.id === question.buggyLineId;
            const showSuccess = submitted && isSelected && isBuggy;
            const showFailure = submitted && isSelected && !isBuggy;
            const showMissed = submitted && !isSelected && isBuggy;

            return (
              <button
                key={line.id}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedLineId(line.id)}
                className={`flex w-full items-center gap-4 px-4 py-2.5 text-left transition-colors ${
                  showSuccess
                    ? 'bg-emerald-950/60 text-emerald-300'
                    : showFailure
                    ? 'bg-red-950/60 text-red-300'
                    : showMissed
                    ? 'bg-amber-950/50 text-amber-300'
                    : isSelected
                    ? 'bg-brand-950/50 text-brand-300'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span className="w-6 shrink-0 text-right text-xs text-zinc-600 select-none">
                  {line.lineNumber}
                </span>
                <span className="flex-1">{line.code}</span>
                {submitted && (
                  <span className="shrink-0">
                    {showSuccess && <CheckCircle2Icon className="h-4 w-4 text-emerald-400" />}
                    {showFailure && <XCircleIcon className="h-4 w-4 text-red-400" />}
                    {showMissed && <AlertTriangleIcon className="h-4 w-4 text-amber-400" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnosis Explanation Box */}
      {submitted && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Root-Cause Analysis
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {question.rootCause}
          </p>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Recommended Fix: </span>
            {question.fixDescription}
          </p>
        </div>
      )}

      {!submitted && (
        <Button disabled={!selectedLineId} onClick={handleSubmit}>
          Submit Diagnostic
        </Button>
      )}
    </div>
  );
}
