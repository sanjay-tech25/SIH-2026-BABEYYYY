import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  CircleIcon,
  CheckCircle2Icon,
  FlaskConicalIcon,
  BookOpenIcon,
  SparklesIcon,
  HelpCircleIcon,
  RefreshCwIcon,
  AtomIcon,
  CompassIcon,
  ActivityIcon,
  LockIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  GraduationCapIcon,
  ChevronRightIcon,
  AwardIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChapterLab } from '../components/ChapterLab';
import { BlochSphere3D } from '../components/quantum/BlochSphere3D';
import { CURRICULUM, type Chapter, type Topic } from '../data/curriculumData';
import { getSocraticFlowForTopic, type SocraticStep, type SocraticTopicFlow } from '../data/socraticCurriculum';
import { stateStore, type AppState } from '../services/stateStore';
import { apiClient } from '../services/apiClient';
import type { ViewId } from '../data/appData';

const TEACHING_STATES: Record<
  '0' | '1' | '+' | '-' | '+i' | 'bell',
  {
    name: string;
    label: string;
    ket: string;
    bloch: { x: number; y: number; z: number };
    theta: string;
    phi: string;
    prob0: number;
    prob1: number;
    description: string;
  }
> = {
  '0': {
    name: 'Ground State |0⟩',
    label: '|0⟩',
    ket: '|0⟩ = [1, 0]ᵀ',
    bloch: { x: 0, y: 0, z: 1 },
    theta: '0°',
    phi: '0°',
    prob0: 100,
    prob1: 0,
    description: 'The computational basis ground state aligned along the +Z axis of the Bloch sphere.'
  },
  '1': {
    name: 'Excited State |1⟩',
    label: '|1⟩',
    ket: '|1⟩ = [0, 1]ᵀ',
    bloch: { x: 0, y: 0, z: -1 },
    theta: '180°',
    phi: '0°',
    prob0: 0,
    prob1: 100,
    description: 'The computational basis excited state aligned along the -Z axis of the Bloch sphere.'
  },
  '+': {
    name: 'Plus State |+⟩',
    label: '|+⟩',
    ket: '(|0⟩ + |1⟩) / √2',
    bloch: { x: 1, y: 0, z: 0 },
    theta: '90°',
    phi: '0°',
    prob0: 50,
    prob1: 50,
    description: 'Equal superposition created by Hadamard gate H|0⟩, pointing directly along the +X axis.'
  },
  '-': {
    name: 'Minus State |-⟩',
    label: '|-⟩',
    ket: '(|0⟩ - |1⟩) / √2',
    bloch: { x: -1, y: 0, z: 0 },
    theta: '90°',
    phi: '180°',
    prob0: 50,
    prob1: 50,
    description: 'Equal superposition with a 180° relative phase shift, pointing directly along the -X axis.'
  },
  '+i': {
    name: 'Circ Phase |+i⟩',
    label: '|+i⟩',
    ket: '(|0⟩ + i|1⟩) / √2',
    bloch: { x: 0, y: 1, z: 0 },
    theta: '90°',
    phi: '90°',
    prob0: 50,
    prob1: 50,
    description: 'Equal superposition with a π/2 imaginary phase shift, pointing along the +Y axis.'
  },
  'bell': {
    name: 'Bell State |Φ⁺⟩',
    label: '|Φ⁺⟩',
    ket: '(|00⟩ + |11⟩) / √2',
    bloch: { x: 0, y: 0, z: 0 },
    theta: 'Entangled',
    phi: 'N/A',
    prob0: 50,
    prob1: 50,
    description: 'Maximally entangled 2-qubit state. Individual subsystem trace is maximally mixed at center.'
  }
};

interface LessonProps {
  onNavigate: (id: ViewId) => void;
}

export function Lesson({ onNavigate }: LessonProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeTab, setActiveTab] = useState<'theory' | 'lab'>('theory');
  const [visualizerState, setVisualizerState] = useState<'0' | '1' | '+' | '-' | '+i' | 'bell'>('+');

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  // Find active chapter and topic from stateStore
  const activeChapterId = appState.progress.activeChapterId || 'ch-1';
  const chapter: Chapter = CURRICULUM.find(c => c.id === activeChapterId) || CURRICULUM[0];
  const topic: Topic = chapter.topics.find(t => t.id === appState.progress.activeLessonId) || chapter.topics[0];

  const isLessonCompleted = appState.progress.completedLessons.includes(topic.id);
  const isLabCompleted = appState.progress.completedLabs.includes(topic.lab.id);

  // Socratic Flow for current topic
  const socraticFlow: SocraticTopicFlow = getSocraticFlowForTopic(topic, chapter);
  const totalSteps = socraticFlow.steps.length;

  // Active step index
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [allStepsFinished, setAllStepsFinished] = useState(false);

  // Reset Socratic step state when topic changes
  useEffect(() => {
    setActiveStepIndex(0);
    setSelectedOptionId(null);
    setStepSubmitted(false);
    setShowHint(false);
    setAllStepsFinished(isLessonCompleted);
    setCompletedSteps(isLessonCompleted ? socraticFlow.steps.map((_, i) => i) : []);
  }, [topic.id, isLessonCompleted]);

  const currentStep: SocraticStep = socraticFlow.steps[activeStepIndex] || socraticFlow.steps[0];
  const selectedOption = currentStep.options.find(o => o.id === selectedOptionId);
  const correctOption = currentStep.options.find(o => o.correct) || currentStep.options[0];
  const isStepCorrect = selectedOption?.correct ?? false;

  // Synchronize 3D Bloch visualizer to current Socratic step
  useEffect(() => {
    if (currentStep?.visualStateKey && TEACHING_STATES[currentStep.visualStateKey]) {
      setVisualizerState(currentStep.visualStateKey);
    }
  }, [activeStepIndex, currentStep?.visualStateKey]);

  // Handle Socratic choice evaluation
  const handleVerifyStep = () => {
    if (!selectedOptionId) return;
    setStepSubmitted(true);

    // Record accuracy for analytics
    stateStore.recordQuizResult(topic.id, isStepCorrect, isStepCorrect ? 30 : 10);

    // Both correct and incorrect answers provide the complete pedagogical explanation.
    // We never block the student or force an artificial guessing loop.
    if (!completedSteps.includes(activeStepIndex)) {
      const nextCompleted = [...completedSteps, activeStepIndex];
      setCompletedSteps(nextCompleted);

      // If this was the final step, complete the lesson!
      if (nextCompleted.length === totalSteps) {
        setAllStepsFinished(true);
        stateStore.completeLesson(topic.id, chapter.id, 50);
      }
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setStepSubmitted(false);
      setShowHint(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article className="min-w-0">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('path')}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to Curriculum Journey
          </button>

          <div className="flex items-center gap-2">
            {chapter.isStart && (
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                START OF JOURNEY
              </span>
            )}
            {chapter.isEnd && (
              <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                CAPSTONE FINALE
              </span>
            )}
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {chapter.title.split(':')[0]} · Topic {topic.number}
            </span>
          </div>
        </div>

        {/* Lesson Header */}
        <header className="mt-3 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-500/15 px-2.5 py-0.5 text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
              Socratic Guided Dialogue
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Grounded in Obsidian Vault: {chapter.vault_domain}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {topic.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
            {topic.summary}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              About {topic.minutes} minutes
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
              <SparklesIcon className="h-3.5 w-3.5" />
              {totalSteps} Progressive Socratic Steps
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <AwardIcon className="h-3.5 w-3.5" />
              +50 CP Theory · +75 CP Practical Lab
            </span>
          </div>
        </header>

        {/* Teaching Mode Tabs: Socratic Theory Discovery vs. Practical Open Lab */}
        <div className="mt-6 flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === 'theory'
                ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <BookOpenIcon className="h-4 w-4" />
            1. Socratic Conceptual Discovery
            {(isLessonCompleted || allStepsFinished) && (
              <span className="ml-1.5 rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Mastered
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === 'lab'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <FlaskConicalIcon className="h-4 w-4" />
            2. Topic Practical Open Lab
            {isLabCompleted && (
              <span className="ml-1.5 rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] text-emerald-600">
                Done
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Socratic Theory Discovery View */}
        {activeTab === 'theory' && (
          <div className="mt-8 space-y-8 max-w-3xl">

            {/* Socratic Ladder Step Navigation Bar */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <GraduationCapIcon className="h-4 w-4" />
                  Socratic Concept Ladder (Step {activeStepIndex + 1} of {totalSteps})
                </span>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {completedSteps.length} / {totalSteps} Concepts Mastered
                </span>
              </div>

              {/* Step indicator pills */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {socraticFlow.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = activeStepIndex === idx;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => {
                        // Allow visiting completed steps or the next available step
                        if (isDone || idx <= completedSteps.length) {
                          setActiveStepIndex(idx);
                          setSelectedOptionId(null);
                          setStepSubmitted(false);
                          setShowHint(false);
                        }
                      }}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-purple-600 bg-purple-50 text-purple-950 dark:bg-purple-950/40 dark:text-purple-100 ring-2 ring-purple-500/50 shadow-sm'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-50/50 text-zinc-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-zinc-200'
                          : 'border-zinc-200 bg-white/60 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase">
                          Step {idx + 1}
                        </span>
                        {isDone ? (
                          <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                        ) : (
                          <LockIcon className="h-3 w-3 text-zinc-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold truncate leading-tight">
                        {step.stageTitle.split(':')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Socratic Step Card */}
            <div className="rounded-2xl border-2 border-purple-500/30 bg-white dark:border-purple-500/20 dark:bg-zinc-900/90 p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/10 text-xs font-bold text-purple-600 dark:text-purple-400">
                    {activeStepIndex + 1}
                  </span>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {currentStep.stageTitle}
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-zinc-400">
                  Concept {activeStepIndex + 1} / {totalSteps}
                </span>
              </div>

              {/* 1. The Physical Hook / Phenomenon Premise */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 p-4 dark:border-amber-500/20 dark:bg-amber-950/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <LightbulbIcon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Physical Mental Model & Premise:</span>
                </div>
                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {currentStep.conceptHook}
                </p>
              </div>

              {/* Accompanying Math Snippet if present */}
              {currentStep.mathSnippet && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-100/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px] font-sans">Formula Context:</span>
                  <code className="text-purple-600 dark:text-purple-400">{currentStep.mathSnippet}</code>
                </div>
              )}

              {/* 2. The Socratic Probing Question */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <HelpCircleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Socratic Guiding Inquiry:
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {currentStep.pedagogicalPrompt}
                    </h3>
                  </div>
                </div>

                {/* Hypothesis Options */}
                <ul className="mt-4 space-y-2.5">
                  {currentStep.options.map((option) => {
                    const selected = selectedOptionId === option.id;
                    const showFeedback = stepSubmitted;
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          disabled={stepSubmitted && isStepCorrect}
                          onClick={() => {
                            if (!stepSubmitted || !isStepCorrect) {
                              setSelectedOptionId(option.id);
                            }
                          }}
                          className={`flex min-h-[50px] w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition ${
                            showFeedback && option.correct
                              ? 'border-emerald-600 bg-emerald-50 text-zinc-900 dark:bg-emerald-950/40 dark:text-zinc-100 ring-1 ring-emerald-500'
                              : showFeedback && selected && !option.correct
                              ? 'border-red-500 bg-red-50 text-zinc-900 dark:border-red-700 dark:bg-red-950/30 dark:text-zinc-100'
                              : selected
                              ? 'border-purple-600 bg-purple-50/60 text-zinc-900 dark:border-purple-500 dark:bg-purple-950/40 dark:text-zinc-100 ring-1 ring-purple-500'
                              : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                          }`}
                        >
                          <span className="shrink-0 mt-0.5">
                            {showFeedback && option.correct ? (
                              <CheckCircle2Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            ) : showFeedback && selected && !option.correct ? (
                              <XIcon className="h-4 w-4 text-red-500" />
                            ) : selected ? (
                              <CheckCircle2Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <CircleIcon className="h-4 w-4 text-zinc-400" />
                            )}
                          </span>
                          <span className="leading-relaxed font-medium">{option.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Action Buttons & Feedback */}
              <div className="pt-2">
                {!stepSubmitted ? (
                  <Button
                    size="sm"
                    disabled={!selectedOptionId}
                    onClick={handleVerifyStep}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 px-4 font-semibold shadow-sm"
                  >
                    Verify My Hypothesis
                    <ChevronRightIcon className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Feedback Alert: Beginner-Friendly Pedagogical Breakdown */}
                    <div
                      className={`rounded-xl border p-4 text-xs leading-relaxed space-y-3 ${
                        isStepCorrect
                          ? 'border-emerald-500/40 bg-emerald-50/50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : 'border-amber-500/40 bg-amber-50/40 text-zinc-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {isStepCorrect ? (
                          <>
                            <CheckCircle2Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Hypothesis Verified & Axiom Proven! (+30 CP)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span>Natural Classical Intuition — Here's the Quantum Reality:</span>
                          </>
                        )}
                      </div>

                      {/* Learner's Selected Thought Breakdown */}
                      <p className="leading-relaxed">
                        {selectedOption?.feedback}
                      </p>

                      {/* If Incorrect: Teach the Correct Principle Like to a Total Beginner */}
                      {!isStepCorrect && (
                        <div className="rounded-lg bg-white/80 p-3 border border-amber-500/30 dark:bg-zinc-900/80 dark:border-amber-500/20 space-y-1.5">
                          <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                            <LightbulbIcon className="h-3.5 w-3.5 text-amber-600" />
                            The Correct Quantum Principle Explained Simply:
                          </p>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                            {correctOption.label}
                          </p>
                          <p className="text-zinc-600 dark:text-zinc-300 text-[11px]">
                            {correctOption.feedback}
                          </p>
                        </div>
                      )}

                      {/* Axiomatic Punchline / Core Takeaway */}
                      <div className="rounded-lg bg-purple-500/10 p-2.5 border border-purple-500/20 font-semibold text-purple-900 dark:text-purple-200">
                        Key Axiom to Remember: {currentStep.socraticPunchline}
                      </div>
                    </div>

                    {/* Navigation Buttons: Seamless Forward Progression */}
                    <div className="flex flex-wrap items-center gap-3">
                      {activeStepIndex < totalSteps - 1 ? (
                        <Button
                          size="sm"
                          onClick={handleNextStep}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 px-4 font-semibold shadow-sm"
                        >
                          {isStepCorrect ? 'Advance to Stage ' : 'Understood, Continue to Stage '}
                          {activeStepIndex + 2} of {totalSteps}
                          <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setActiveTab('lab')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 font-semibold shadow-sm"
                          >
                            <FlaskConicalIcon className="mr-1.5 h-3.5 w-3.5" />
                            {isStepCorrect ? 'Lesson Mastered! Open Practical Lab' : 'Lesson Complete! Open Practical Lab'}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => stateStore.adaptiveAdvanceToNext(topic.id)}
                            className="text-xs h-9 px-3"
                          >
                            Next Topic in Journey
                            <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Quantum State & Bloch Sphere Visualizer */}
            <Card className="p-5 border-emerald-500/20 bg-zinc-900/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <AtomIcon className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-zinc-100">Synchronized 3D Bloch Visualizer</h3>
                </div>
                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                  Live State Sync
                </span>
              </div>

              {/* State Selector Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(TEACHING_STATES) as Array<keyof typeof TEACHING_STATES>).map((key) => {
                  const item = TEACHING_STATES[key];
                  const isActive = visualizerState === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setVisualizerState(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Visualizer Body: 3D Bloch Sphere + Statevector readout */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-3 flex flex-col items-center justify-center min-h-[290px] shadow-inner">
                  <BlochSphere3D
                    compact={true}
                    size={260}
                    vectors={[{
                      qubit_index: 0,
                      x: TEACHING_STATES[visualizerState].bloch.x,
                      y: TEACHING_STATES[visualizerState].bloch.y,
                      z: TEACHING_STATES[visualizerState].bloch.z
                    }]}
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 font-mono">Drag mouse to rotate 3D view</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-zinc-400 text-xs font-medium">Active State: </span>
                    <span className="font-bold text-sm text-emerald-400">{TEACHING_STATES[visualizerState].name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-xs font-semibold text-zinc-100 border border-zinc-800/90 shadow-sm">
                    {TEACHING_STATES[visualizerState].ket}
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {TEACHING_STATES[visualizerState].description}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">P(|0⟩) Ground State:</span>
                        <span className="font-mono font-bold text-emerald-400">{TEACHING_STATES[visualizerState].prob0}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${TEACHING_STATES[visualizerState].prob0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">P(|1⟩) Excited State:</span>
                        <span className="font-mono font-bold text-cyan-400">{TEACHING_STATES[visualizerState].prob1}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${TEACHING_STATES[visualizerState].prob1}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-800/70 border border-zinc-700/50 text-zinc-300">
                      θ = {TEACHING_STATES[visualizerState].theta}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-zinc-800/70 border border-zinc-700/50 text-cyan-300">
                      φ = {TEACHING_STATES[visualizerState].phi}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Practical Open Lab View */}
        {activeTab === 'lab' && (
          <div className="mt-8">
            <ChapterLab
              mission={topic.lab}
              chapterId={chapter.id}
              topicTitle={topic.title}
              onCompleted={() => {}}
            />
          </div>
        )}
      </article>

      {/* Sidebar: In This Chapter */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              In This Chapter
            </p>
            <h3 className="mt-1 font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {chapter.title}
            </h3>

            <div className="mt-4 space-y-2">
              {chapter.topics.map((t) => {
                const active = t.id === topic.id;
                const done = appState.progress.completedLessons.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => stateStore.setActiveLesson(chapter.id, t.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-left transition ${
                      active
                        ? 'bg-purple-500/10 font-bold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
                        : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2Icon className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <CircleIcon className="h-4 w-4 text-zinc-400 shrink-0" />
                    )}
                    <span className="truncate">{t.number}: {t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Socratic Teaching Mode:
            </p>
            <p className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-bold">
              Active Discovery & Cognitive Diagnostics
            </p>
            <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every theoretical and mathematical principle is deduced through progressive hypothesis testing and targeted misconception diagnostics.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}