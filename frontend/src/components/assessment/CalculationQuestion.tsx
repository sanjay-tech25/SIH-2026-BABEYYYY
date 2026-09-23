import React, { useState } from 'react';
import { CalculatorIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { CalculationQuestion as CalculationQuestionType } from '../../data/assessmentBank';

interface CalculationQuestionProps {
  question: CalculationQuestionType;
  submitted: boolean;
  onAnswerSubmit: (isCorrect: boolean, studentValue: number) => void;
}

export function CalculationQuestion({
  question,
  submitted,
  onAnswerSubmit,
}: CalculationQuestionProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleQuickInsert = (val: string) => {
    if (submitted) return;
    setInputValue(val);
  };

  const handleSubmit = () => {
    // Parse decimal or fraction like "1/2" or "16/25"
    let parsed: number;
    if (inputValue.includes('/')) {
      const parts = inputValue.split('/');
      parsed = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      parsed = parseFloat(inputValue);
    }

    if (isNaN(parsed)) return;

    const isCorrect = Math.abs(parsed - question.targetValue) <= question.tolerance;
    onAnswerSubmit(isCorrect, parsed);
  };

  const parsedNumber = inputValue.includes('/')
    ? parseFloat(inputValue.split('/')[0]) / parseFloat(inputValue.split('/')[1])
    : parseFloat(inputValue);
  const isCorrect = !isNaN(parsedNumber) && Math.abs(parsedNumber - question.targetValue) <= question.tolerance;

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Enter Exact Value or Decimal {question.unit ? `(${question.unit})` : ''}
        </label>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              disabled={submitted}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 0.64 or 16/25"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 font-mono text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-brand-500 dark:focus:bg-zinc-900 dark:disabled:bg-zinc-800"
            />
            {submitted && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                {isCorrect ? (
                  <CheckCircle2Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>

          {!submitted && (
            <Button disabled={!inputValue.trim()} onClick={handleSubmit}>
              Submit Calculation
            </Button>
          )}
        </div>

        {/* Quick Helper Keypad */}
        {!submitted && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">Quick insert:</span>
            {['0.5', '0.707', '0.25', '0.64', '1.0', '1/2', '1/√2'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickInsert(val)}
                className="rounded border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700 hover:border-brand-500 hover:bg-brand-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-brand-500 dark:hover:bg-brand-950/40"
              >
                {val}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step-by-Step Derivation Breakdown */}
      {submitted && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <CalculatorIcon className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mathematical Derivation
            </span>
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-sm text-zinc-800 dark:text-zinc-200">
            {question.stepByStepSolution.map((step, idx) => (
              <p key={idx} className="leading-relaxed">
                {step}
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Expected answer: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{question.targetValue}</span> (±{question.tolerance})
          </p>
        </div>
      )}
    </div>
  );
}
