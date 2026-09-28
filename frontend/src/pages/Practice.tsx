import React, { useState } from 'react';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  LightbulbIcon,
  XIcon,
  XCircleIcon,
  SparklesIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { practiceSet } from '../data/learningContent';
import { apiClient } from '../services/apiClient';
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
  const [socraticDiagnostic, setSocraticDiagnostic] = useState<{
    explanation: string;
    diagnosis: string;
    socratic_inquiry?: string;
    vault_citation?: string;
    remediation_topic?: string;
  } | null>(null);
  const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);

  const question = practiceSet[index];
  const isCorrect = choice === question.correctId;
  const isLast = index === practiceSet.length - 1;

  const submit = async () => {
    if (!choice) return;
    setSubmitted(true);
    setSocraticDiagnostic(null);
    if (choice === question.correctId) {
      setRight((prev) => [...prev, question.concept]);
    } else {
      setWrong((prev) => [...prev, question.concept]);
      setLoadingDiagnostic(true);
      try {
        const studentChoiceLabel = question.options.find((o) => o.id === choice)?.label || choice;
        const correctChoiceLabel = question.options.find((o) => o.id === question.correctId)?.label || question.correctId;
        const diag = await apiClient.whyFailed(
          question.concept,
          String(question.id),
          studentChoiceLabel,
          correctChoiceLabel,
          question.explanation,
          question.prompt
        );
        setSocraticDiagnostic(diag);
      } catch {
        // Fallback handled in apiClient
      } finally {
        setLoadingDiagnostic(false);
      }
    }
  };

  const next = () => {
    setIndex((i) => i + 1);
    setChoice(null);
    setSubmitted(false);
    setShowHint(false);
    setSocraticDiagnostic(null);
  };

  const finish = async () => {
    try {
      if (wrong.length === 0) {
        await apiClient.advanceAdaptive('math_foundations', 'state_vectors');
      } else {
        await apiClient.advanceAdaptive(wrong[0]);
      }
      await apiClient.sendQubotEvent('QUIZ_COMPLETED', {
        correct: right.length,
        total: practiceSet.length,
        wrongConcepts: wrong,
        rightConcepts: right
      });
    } catch {
      // safe fallback
    }
    onFinish({
      correct: right.length,
      total: practiceSet.length,
      minutes: 6,
      wrongConcepts: wrong,
      rightConcepts: right
    });
  };

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-50 px-3 py-1 font-mono text-sm font-bold text-[#4c1d70] border border-purple-200">
            QUESTION {index + 1} OF {practiceSet.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#4c1d70] transition"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
          Leave practice
        </button>
      </div>

      <ProgressBar
        value={((index + (submitted ? 1 : 0)) / practiceSet.length) * 100}
        label="Practice progress"
        className="mt-4"
      />

      <div key={index} className="genie-content">
      <p className="mt-8 text-sm font-mono font-bold uppercase tracking-wider text-[#4c1d70]">
        {question.concept}
      </p>
      <h1 className="mt-2 font-orbitron text-2xl sm:text-3xl font-bold text-[#1a052e] dark:text-white leading-snug">
        {question.prompt}
      </h1>

      <ul className="mt-6 space-y-2.5">
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
                className={`spring-lift flex min-h-[56px] w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left text-base transition-all ${
                  showState && isAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-sm'
                    : showState && selected
                    ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-sm'
                    : selected
                    ? 'border-2 border-[#4c1d70] bg-purple-50/90 text-[#3b1458] font-bold shadow-md ring-2 ring-[#4c1d70]/20'
                    : 'border border-purple-100/90 bg-white text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-sm'
                }`}
              >
                <span aria-hidden="true" className="shrink-0">
                  {showState && isAnswer ? (
                    <CheckCircle2Icon className="h-5 w-5 text-emerald-600" />
                  ) : showState && selected ? (
                    <XCircleIcon className="h-5 w-5 text-rose-600" />
                  ) : selected ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#4c1d70] bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4c1d70]" />
                    </span>
                  ) : (
                    <CircleIcon className="h-5 w-5 text-slate-300" />
                  )}
                </span>
                <span className="leading-relaxed">{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {showHint && !submitted && (
        <p className="genie-content mt-5 rounded-2xl border-l-4 border-[#4c1d70] border border-[#cbb3d8] bg-[#fbf9fd] p-4 text-sm font-medium text-purple-950">
          <strong>Hint:</strong> {question.hint}
        </p>
      )}

      {submitted && (
        <div className="genie-content mt-6 rounded-2xl border border-[#cbb3d8] bg-[#fbf9fd] p-5 space-y-3">
          <p className="text-base font-bold text-[#3b1458]">
            {isCorrect ? 'Correct!' : `The answer is "${question.options.find((o) => o.id === question.correctId)?.label}".`}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>

          {!isCorrect && (
            <div className="mt-3 rounded-xl border border-purple-200/90 bg-white/90 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-orbitron text-sm font-bold text-[#4c1d70]">
                  <SparklesIcon className="h-3.5 w-3.5 text-[#f5d626]" /> Socratic Gap Diagnosis
                </span>
                {socraticDiagnostic?.vault_citation && (
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-mono font-bold text-[#4c1d70]">
                    Vault Grounding: {socraticDiagnostic.vault_citation}
                  </span>
                )}
              </div>
              {loadingDiagnostic ? (
                <div className="flex items-center gap-2 text-sm font-mono text-[#4c1d70] animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-ping" />
                  <span>Consulting Obsidian Vault & Socratic diagnostic model...</span>
                </div>
              ) : socraticDiagnostic ? (
                <>
                  <p className="text-sm text-slate-700 leading-relaxed font-poppins">
                    {socraticDiagnostic.diagnosis}
                  </p>
                  {socraticDiagnostic.socratic_inquiry && (
                    <div className="rounded-lg border-l-2 border-[#4c1d70] bg-purple-50/50 p-2.5 text-sm text-purple-950 font-medium">
                      <span className="font-bold">Guiding Question: </span>
                      {socraticDiagnostic.socratic_inquiry}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      )}

      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <>
            <button
              type="button"
              disabled={!choice}
              onClick={submit}
              className="rounded-full bg-[#f5d626] px-6 py-2.5 font-orbitron text-sm font-bold text-zinc-950 hover:bg-yellow-400 shadow-md transition disabled:opacity-40"
            >
              Submit answer
            </button>
            {!showHint && (
              <Button variant="ghost" onClick={() => setShowHint(true)} className="rounded-full text-sm font-poppins font-semibold text-[#4c1d70]">
                <LightbulbIcon className="h-4 w-4 text-[#f5d626]" aria-hidden="true" />
                Show a hint
              </Button>
            )}
          </>
        ) : (
          <Button onClick={isLast ? finish : next} className="rounded-full px-6 py-2.5 font-orbitron text-sm font-bold shadow-md">
            <span>{isLast ? 'See your results' : 'Next question'}</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}