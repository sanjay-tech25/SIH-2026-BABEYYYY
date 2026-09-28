import React, { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  CompassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XIcon,
  LightbulbIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { pathSteps, type ViewId } from '../data/appData';
import { apiClient, type AdaptiveRoadmap, type DifferentiatedRemediation } from '../services/apiClient';

import { GeniePresence } from '../components/ui/GenieMotion';

type LearningPathProps = {
  onNavigate: (id: ViewId) => void;
};

export function LearningPath({ onNavigate }: LearningPathProps) {
  const [roadmap, setRoadmap] = useState<AdaptiveRoadmap | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [remediationModal, setRemediationModal] = useState<DifferentiatedRemediation | null>(null);
  const [loadingRemediation, setLoadingRemediation] = useState(false);
  const [remediationQuizChoice, setRemediationQuizChoice] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient.getAdaptiveRoadmap().then((data) => {
      if (mounted) {
        setRoadmap(data);
        setLoadingRoadmap(false);
      }
    }).catch(() => {
      if (mounted) setLoadingRoadmap(false);
    });
    return () => { mounted = false; };
  }, []);

  const [openId, setOpenId] = useState<string | null>(
    pathSteps.find((s) => s.state === 'current')?.id ?? null
  );
  const mastered = roadmap ? roadmap.mastered_concepts.length : pathSteps.filter((s) => s.state === 'mastered').length;

  const handleOpenRemediation = async (topicId: string, conceptName: string) => {
    setLoadingRemediation(true);
    setRemediationQuizChoice(null);
    try {
      const data = await apiClient.getAdaptiveRemediation(topicId, conceptName);
      setRemediationModal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRemediation(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Open Editorial Header */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-purple-950/70">
              <span className="h-2 w-2 rounded-full bg-[#f5d626]" />
              Adaptive Curriculum • {mastered} of {roadmap ? roadmap.topological_sequence.length : pathSteps.length} Milestones Cleared
            </span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-mono font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheckIcon className="h-3 w-3" /> Adaptive Engine Connected
            </span>
          </div>
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Personalized Quantum Learning Path
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Step-by-step mastery pathway mapped to professional quantum computing competency. Progress adaptively through theory, live circuits, and Socratic reviews.
        </p>
      </header>

      {/* 2. Current Checkpoint (Continuous Editorial Unit - ZERO Card Box) */}
      <section className="space-y-3 border-l-2 border-[#4c1d70] pl-5 py-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#4c1d70]">
              ACTIVE CHECKPOINT • STEP 4 OF 6
            </span>
            <h2 className="mt-1 font-orbitron text-2xl sm:text-3xl font-bold text-[#1a052e] tracking-tight">
              Superposition & Phase Gates
            </h2>
            <p className="font-poppins text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-1 max-w-xl">
              Focus on unitary phase shifts & 3D Bloch coordinate evolution before advancing to 2-qubit entanglement.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex items-baseline justify-between text-sm font-mono text-slate-500">
              <span>Next Checkpoint</span>
              <span className="text-[#4c1d70] font-bold">72% Ready</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-[#4c1d70] transition-all duration-700 ease-out"
                style={{ width: '72%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Milestone Pathway Stepper (Clean Handcrafted Timeline) */}
      <div className="pt-4">
        <div className="pb-3 mb-6 border-b border-purple-100/80">
          <h3 className="font-orbitron text-base font-bold text-[#1a052e] dark:text-white">Curriculum Milestones</h3>
        </div>

        <ol className="relative space-y-6 border-l-2 border-purple-200/80 pl-8 ml-3.5">
          {pathSteps.map((step) => {
            const open = openId === step.id;
            const isCurrent = step.state === 'current';
            const isUpcoming = step.state === 'upcoming';

            return (
              <li key={step.id} className="relative group">
                {/* Stepper Node Indicator */}
                <span
                  className={`absolute -left-[43px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-mono font-bold transition-transform ${
                    step.state === 'mastered'
                      ? 'bg-[#4c1d70] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#f5d626] text-purple-950 ring-4 ring-yellow-200 font-black'
                      : 'border border-slate-300 bg-white text-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {step.state === 'mastered' ? (
                    <CheckIcon className="h-3 w-3 stroke-[3]" />
                  ) : isUpcoming ? (
                    <LockIcon className="h-3 w-3" />
                  ) : (
                    step.index
                  )}
                </span>

                {/* Open Handcrafted Step Row (Zero Card Box) */}
                <div className="rounded-xl p-2.5 -ml-2.5 transition-colors hover:bg-purple-50/30">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : step.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-orbitron text-sm sm:text-base font-bold text-[#1a052e] group-hover:text-[#4c1d70] transition-colors">
                          {step.title}
                        </span>
                        {step.state === 'mastered' && (
                          <StatusChip tone="done">{step.score}%</StatusChip>
                        )}
                        {isCurrent && <StatusChip tone="active">You are here</StatusChip>}
                        {isUpcoming && <StatusChip tone="locked">Locked</StatusChip>}
                      </div>
                      <p className="mt-1 font-poppins text-sm text-slate-500 max-w-xl leading-relaxed">
                        {step.summary}
                      </p>
                    </div>

                    <ChevronDownIcon
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        open ? 'rotate-180 text-[#4c1d70]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>


                    <GeniePresence open={open} origin="top" className="mt-3 pt-3 border-t border-purple-100/70 pl-2 space-y-3">
                      <ul className="space-y-2">
                        {step.lessons.map((lesson) => (
                          <li
                            key={lesson}
                            className="flex items-center gap-2.5 text-sm text-slate-600 font-medium"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4c1d70]" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {isCurrent && (
                          <Button
                            className="rounded-full px-5 py-2 text-sm font-orbitron font-bold shadow-sm"
                            onClick={() => onNavigate('lesson')}
                          >
                            <span>Open Lesson 8</span>
                            <ArrowRightIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenRemediation(step.id, step.title)}
                          disabled={loadingRemediation}
                          className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50/80 px-3 py-1.5 text-sm font-mono font-bold text-[#4c1d70] hover:bg-[#4c1d70] hover:text-white transition active:scale-95 shadow-xs"
                        >
                          <LightbulbIcon className="h-3.5 w-3.5 text-amber-500" />
                          <span>Differentiated Remediation & Blueprint</span>
                        </button>
                      </div>
                    </GeniePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Differentiated Remediation Modal Grounded in Misconception Deconstruction */}
      {remediationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-purple-200 dark:bg-zinc-900 dark:border-zinc-800 space-y-6 my-8 animate-fadeInUp">
            <div className="flex items-start justify-between border-b border-purple-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  Adaptive Differentiated Remediation • {remediationModal.mode}
                </span>
                <h3 className="mt-1 font-orbitron text-2xl font-bold text-[#1a052e] dark:text-white">
                  {remediationModal.concept_name}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  {remediationModal.compulsion_reason}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRemediationModal(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Misconception Deconstruction */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#4c1d70] flex items-center gap-1.5">
                <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                Misconception Deconstruction
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-3.5 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-red-800">⚠️ The Cognitive Trap</span>
                  <p className="text-sm font-poppins text-slate-700 leading-relaxed">
                    {remediationModal.misconception_deconstruction.trap || 'Classical binary hidden variable assumption.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800">💡 Quantum Reality</span>
                  <p className="text-sm font-poppins text-slate-700 leading-relaxed">
                    {remediationModal.misconception_deconstruction.reality || 'States are coherent complex unit vectors.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-[#4c1d70]">📐 Invariant Rule</span>
                  <p className="text-sm font-poppins text-slate-700 leading-relaxed">
                    {remediationModal.misconception_deconstruction.rule || 'Unitary conservation: ⟨ψ|ψ⟩ = 1.0.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Analogy */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-amber-900">
                <LightbulbIcon className="h-4 w-4 text-amber-600" />
                <span>Physical Analogy: {remediationModal.visual_analogy.headline || 'Geometric Representation'}</span>
              </div>
              <p className="text-sm font-poppins text-slate-700 dark:text-zinc-300 leading-relaxed">
                {remediationModal.visual_analogy.analogy}
              </p>
            </div>

            {/* Verification Challenge */}
            {remediationModal.verification_challenge?.question && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-[#4c1d70] uppercase">
                    Verification Challenge
                  </span>
                  <span className="text-xs font-mono text-slate-500">Instant Check</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {remediationModal.verification_challenge.question}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {remediationModal.verification_challenge.options?.map((opt: string, idx: number) => {
                    const isSelected = remediationQuizChoice === idx;
                    const isCorrect = idx === remediationModal.verification_challenge.correct_index;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRemediationQuizChoice(idx)}
                        className={`text-left rounded-xl p-3 text-sm font-poppins transition border ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-red-100 border-red-400 text-red-900 font-bold'
                            : 'bg-white border-purple-200 text-slate-700 hover:bg-purple-50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {remediationQuizChoice !== null && (
                  <div className={`rounded-xl p-3 text-sm font-poppins leading-relaxed border ${
                    remediationQuizChoice === remediationModal.verification_challenge.correct_index
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}>
                    {remediationQuizChoice === remediationModal.verification_challenge.correct_index
                      ? '✅ Correct! '
                      : '❌ Not quite. '}
                    {remediationModal.verification_challenge.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                className="rounded-full px-5 py-2 text-sm font-orbitron font-bold"
                onClick={() => setRemediationModal(null)}
              >
                Close Remediation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}