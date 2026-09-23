import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  LightbulbIcon,
  XIcon,
  XCircleIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
  ClockIcon,
  HelpCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCcwIcon,
  BookOpenIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import type { ViewId } from '../data/appData';

const CONCEPT_TOPIC_MAP: Record<string, string> = {
  math_foundations: 't1-1',
  complex_numbers: 't1-1',
  state_vectors: 't1-1',
  born_rule: 't1-1',
  qubit_definition: 't1-1',
  matrix_mechanics: 't1-2',
  unitary_operators: 't1-2',
  tensor_products: 't1-2',
  single_qubit_gates: 't2-1',
  superposition: 't2-1',
  hadamard_gate: 't2-1',
  phase_shifts: 't2-1',
  pauli_matrices: 't2-2',
  bloch_sphere: 't2-2',
  entanglement: 't3-1',
  bell_states: 't3-1',
  quantum_teleportation: 't3-2',
  quantum_parallelism: 't4-1',
  deutsch_jozsa: 't4-1',
  grover_search: 't4-2',
  amplitude_amplification: 't4-2',
  decoherence: 't5-1',
  quantum_noise: 't5-1'
};
import {
  ASSESSMENT_CONFIGS,
  diagnosticQuestions,
  chapterMasteryQuestions,
  adaptivePracticePool,
  getQuestionsForAssessment,
  type AssessmentQuestion,
  type AssessmentConfig,
  type MCQQuestion,
  type AssessmentPhase,
} from '../data/assessmentBank';
import {
  AdaptiveAssessmentEngine,
  type BKTUpdateResult,
  type AssessmentRecommendation,
} from '../services/adaptiveAssessmentEngine';
import { stateStore } from '../services/stateStore';
import { apiClient } from '../services/apiClient';

import { InteractiveCircuitQuestion } from '../components/assessment/InteractiveCircuitQuestion';
import { ParsonsProblemQuestion } from '../components/assessment/ParsonsProblemQuestion';
import { CalculationQuestion } from '../components/assessment/CalculationQuestion';
import { BugHuntQuestion } from '../components/assessment/BugHuntQuestion';

export type PracticeResult = {
  correct: number;
  total: number;
  minutes: number;
  wrongConcepts: string[];
  rightConcepts: string[];
  scorePercentage: number;
  recommendation?: AssessmentRecommendation;
  integrityScore: number;
};

interface PracticeProps {
  assessmentId?: string;
  onFinish: (result: PracticeResult) => void;
  onNavigate: (id: ViewId) => void;
}

export function Practice({
  assessmentId = 'diagnostic-placement',
  onFinish,
  onNavigate,
}: PracticeProps) {
  // Find config
  const config: AssessmentConfig =
    ASSESSMENT_CONFIGS.find((c) => c.id === assessmentId) || ASSESSMENT_CONFIGS[0];

  // Resolve question pool strictly based on assessment phase and complexity
  const initialPool = useRef<AssessmentQuestion[]>([]);
  if (initialPool.current.length === 0) {
    const resolved = getQuestionsForAssessment(config.id, config.phase);
    initialPool.current = resolved.length > 0 ? resolved : diagnosticQuestions;
  }

  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialPool.current);
  const [index, setIndex] = useState(0);

  // Dynamic Difficulty Adjustment state
  const [difficultyTier, setDifficultyTier] = useState<1 | 2 | 3>(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  // Per-question submission state
  const [mcqChoice, setMcqChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [whyFailedOpen, setWhyFailedOpen] = useState(false);
  const [whyFailedText, setWhyFailedText] = useState<string | null>(null);

  // Timing & Telemetry
  const [dwellTimeSeconds, setDwellTimeSeconds] = useState(0);
  const [blurCount, setBlurCount] = useState(0);
  const [blurAlert, setBlurAlert] = useState(false);

  // Knowledge Tracing & Session Tracking
  const [bktUpdates, setBktUpdates] = useState<Record<string, BKTUpdateResult>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, { conceptId: string; conceptName: string; isCorrect: boolean }>>({});
  const [rightConcepts, setRightConcepts] = useState<string[]>([]);
  const [wrongConcepts, setWrongConcepts] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[index] || questions[0];

  // 1. Dwell time timer
  useEffect(() => {
    if (submitted || isCompleted) return;
    const interval = setInterval(() => {
      setDwellTimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, isCompleted, index]);

  // 2. Window blur (Assessment Integrity) ethical telemetry
  useEffect(() => {
    const handleBlur = () => {
      if (isCompleted) return;
      setBlurCount((c) => c + 1);
      setBlurAlert(true);
      setTimeout(() => setBlurAlert(false), 5000);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isCompleted]);

  // Handler when any question type is evaluated
  const evaluateAnswer = async (correct: boolean, studentAnswerSummary?: string) => {
    if (submitted) return;
    setIsCurrentCorrect(correct);
    setSubmitted(true);

    const concept = currentQuestion.conceptName;
    const conceptId = currentQuestion.conceptId;

    // Track per-question answer state
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { conceptId, conceptName: concept, isCorrect: correct }
    }));

    // Fetch prior mastery from stateStore or default to 0.20
    const priorMastery = stateStore.getState().progress.conceptMastery?.[conceptId] ?? 0.20;

    // Run authoritative BKT algorithm
    const bktResult = AdaptiveAssessmentEngine.updateMastery(
      priorMastery,
      correct,
      dwellTimeSeconds
    );

    // Save BKT mastery update
    setBktUpdates((prev) => ({ ...prev, [conceptId]: bktResult }));
    stateStore.updateConceptMastery(conceptId, bktResult.posterior);

    // Update streaks and Dynamic Difficulty Adjustment (DDA)
    if (correct) {
      setRightConcepts((prev) => [...prev, concept, conceptId]);
      const nextCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextCorrect);
      setConsecutiveWrong(0);
      const nextDiff = AdaptiveAssessmentEngine.calculateNextDifficulty(
        difficultyTier,
        nextCorrect,
        0
      );
      setDifficultyTier(nextDiff);
    } else {
      setWrongConcepts((prev) => [...prev, concept, conceptId]);
      const nextWrong = consecutiveWrong + 1;
      setConsecutiveWrong(nextWrong);
      setConsecutiveCorrect(0);
      const nextDiff = AdaptiveAssessmentEngine.calculateNextDifficulty(
        difficultyTier,
        0,
        nextWrong
      );
      setDifficultyTier(nextDiff);

      // Socratic Diagnosis
      try {
        const diag = await apiClient.whyFailed(
          conceptId,
          currentQuestion.id,
          studentAnswerSummary || 'Incorrect Option',
          currentQuestion.explanation
        );
        setWhyFailedText(diag.explanation || diag.diagnosis || currentQuestion.explanation);
      } catch {
        setWhyFailedText(
          currentQuestion.misconceptionExplanation ||
            currentQuestion.explanation ||
            'Review the core quantum principles for this topic.'
        );
      }
    }
  };

  // Submit for standard MCQ
  const submitMCQ = () => {
    if (!mcqChoice || currentQuestion.type !== 'mcq') return;
    const mcq = currentQuestion as MCQQuestion;
    const isCorrect = mcqChoice === mcq.correctId;
    const selectedOpt = mcq.options.find((o) => o.id === mcqChoice);
    evaluateAnswer(isCorrect, selectedOpt?.label);
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) {
      finishAssessment();
    } else {
      setIndex((i) => i + 1);
      setMcqChoice(null);
      setSubmitted(false);
      setIsCurrentCorrect(null);
      setShowHint(false);
      setWhyFailedOpen(false);
      setWhyFailedText(null);
      setDwellTimeSeconds(0);
    }
  };

  const finishAssessment = () => {
    setIsCompleted(true);
    const integrity = AdaptiveAssessmentEngine.computeIntegrityScore(blurCount, 0);

    // Concept importance weighting & foundational breach check
    let totalWeight = 0;
    let earnedWeight = 0;
    let solvedCount = 0;
    const failedCriticalConcepts: string[] = [];

    questions.forEach((q) => {
      const importance = AdaptiveAssessmentEngine.getConceptImportance(q.conceptId);
      const answer = answeredQuestions[q.id];
      const isRight = answer ? answer.isCorrect : false;
      totalWeight += importance.weight;
      if (isRight) {
        earnedWeight += importance.weight;
        solvedCount += 1;
      } else if (importance.category === 'FOUNDATIONAL') {
        if (!failedCriticalConcepts.includes(q.conceptName)) {
          failedCriticalConcepts.push(q.conceptName);
        }
      }
    });

    const weightedScorePct = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    const foundationalBreach = failedCriticalConcepts.length > 0;
    const passed = weightedScorePct >= 70 && !foundationalBreach;

    // Compute aggregate mastery
    const bktValues = Object.values(bktUpdates);
    const avgMastery =
      bktValues.length > 0
        ? bktValues.reduce((sum, b) => sum + b.posterior, 0) / bktValues.length
        : weightedScorePct / 100;

    const missedNames = Object.values(answeredQuestions).filter((a) => !a.isCorrect).map((a) => a.conceptName);
    const recommendation = AdaptiveAssessmentEngine.getRecommendation(
      avgMastery,
      missedNames[0] || wrongConcepts[0],
      foundationalBreach,
      failedCriticalConcepts
    );

    // Save attempt record into stateStore
    stateStore.recordAssessmentSession(
      {
        id: 'attempt-' + Date.now(),
        assessmentId: config.id,
        title: config.title,
        score: weightedScorePct,
        totalQuestions: questions.length,
        correctCount: solvedCount,
        passed: passed,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        missedConcepts: missedNames,
        integrityScore: integrity,
        recommendation: recommendation.action,
      },
      passed ? 75 : 20
    );

    // If diagnostic placement, update user's placed starting level
    if (config.kind === 'DIAGNOSTIC') {
      const placedLevel = weightedScorePct >= 80 ? 3 : weightedScorePct >= 50 ? 2 : 1;
      stateStore.setDiagnosticPlacement(placedLevel, weightedScorePct);
    }
  };

  const integrityScore = AdaptiveAssessmentEngine.computeIntegrityScore(blurCount, 0);
  const isLast = index === questions.length - 1;

  // -------------------------------------------------------------------------
  // RESULTS VIEW
  // -------------------------------------------------------------------------
  if (isCompleted) {
    let totalWeight = 0;
    let earnedWeight = 0;
    let solvedCount = 0;
    const failedCriticalConcepts: string[] = [];

    questions.forEach((q) => {
      const importance = AdaptiveAssessmentEngine.getConceptImportance(q.conceptId);
      const answer = answeredQuestions[q.id];
      const isRight = answer ? answer.isCorrect : false;
      totalWeight += importance.weight;
      if (isRight) {
        earnedWeight += importance.weight;
        solvedCount += 1;
      } else if (importance.category === 'FOUNDATIONAL') {
        if (!failedCriticalConcepts.includes(q.conceptName)) {
          failedCriticalConcepts.push(q.conceptName);
        }
      }
    });

    const weightedScorePct = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    const foundationalBreach = failedCriticalConcepts.length > 0;
    const passed = weightedScorePct >= 70 && !foundationalBreach;
    const bktValues = Object.values(bktUpdates);
    const avgMastery =
      bktValues.length > 0
        ? bktValues.reduce((sum, b) => sum + b.posterior, 0) / bktValues.length
        : weightedScorePct / 100;
    const missedNames = Object.values(answeredQuestions).filter((a) => !a.isCorrect).map((a) => a.conceptName);
    const rec = AdaptiveAssessmentEngine.getRecommendation(avgMastery, missedNames[0] || wrongConcepts[0], foundationalBreach, failedCriticalConcepts);

    return (
      <div className="mx-auto max-w-3xl space-y-8 py-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
            passed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
          }`}>
            <BrainCircuitIcon className="h-8 w-8" />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {passed ? 'Assessment Mastered' : 'Mastery Threshold Unmet'}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {config.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {passed
              ? 'Concept importance verified! All foundational axioms satisfied. Downstream chapters unlocked.'
              : 'Advancement is strictly gated. You must demonstrate verified mastery before moving forward.'}
          </p>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-4 dark:border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Weighted Score</p>
              <p className="mt-1 font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {weightedScorePct}%
              </p>
              <span
                className={`text-[11px] font-semibold ${
                  passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {passed ? 'Passed (≥ 70%)' : foundationalBreach ? 'Foundational Breach' : 'Needs Practice (< 70%)'}
              </span>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Questions Solved</p>
              <p className="mt-1 font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {solvedCount} / {questions.length}
              </p>
              <span className="text-[11px] text-zinc-500">
                {questions.length - solvedCount} missed
              </span>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Integrity Score</p>
              <p className="mt-1 font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {Math.round(integrityScore * 100)}%
              </p>
              <span className="text-[11px] text-zinc-500">
                {blurCount === 0 ? 'Optimal focus' : `${blurCount} focus switch`}
              </span>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Competency Points</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
                +{passed ? 75 : 20} CP
              </p>
              <span className="text-[11px] text-zinc-500">{passed ? 'Mastery verified' : 'Practice credit'}</span>
            </div>
          </div>
        </div>

        {/* Adaptive Pedagogical Recommendation Card */}
        <Card className={`p-6 border-2 ${passed ? 'border-emerald-500/30' : 'border-red-500/40 bg-red-50/10'}`}>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                rec.action === 'ADVANCE'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
              }`}
            >
              Action: {rec.canAdvance ? 'ADVANCE UNLOCKED' : 'COMPULSORY RETAKE'}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Rigorous Concept Gating Active
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {rec.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {rec.subtext}
          </p>

          {/* Critical Concept Failure Notice */}
          {!rec.canAdvance && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 dark:bg-red-950/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                <AlertCircleIcon className="h-4 w-4" />
                <span>Advancement Blocked: Differentiated Remediation Required</span>
              </div>
              <p className="text-xs text-red-800/90 dark:text-red-200/90">
                Quantum computing does not permit skipping core axioms. You cannot take subsequent lessons until you complete the differentiated remediation session for:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rec.failedCriticalConcepts.map((c, i) => (
                  <span key={i} className="rounded bg-red-200 px-2 py-0.5 text-[11px] font-bold text-red-900 dark:bg-red-900/60 dark:text-red-200">
                     {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {rec.canAdvance ? (
              <Button
                variant="primary"
                onClick={() => {
                  stateStore.adaptiveAdvanceToNext();
                  onNavigate('path');
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <SparklesIcon className="h-4 w-4" />
                {rec.suggestedActionCTA}
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  let targetTopicId = 't1-1';
                  const candidates = [...(rec.failedCriticalConcepts || []), ...(wrongConcepts || [])];
                  for (const cand of candidates) {
                    const normalized = cand.toLowerCase().replace(/[\s-]+/g, '_');
                    if (CONCEPT_TOPIC_MAP[normalized]) {
                      targetTopicId = CONCEPT_TOPIC_MAP[normalized];
                      break;
                    }
                  }
                  if (targetTopicId === 't1-1' && config.id.startsWith('ch-')) {
                    const chNum = config.id.replace('ch-', '').charAt(0);
                    targetTopicId = `t${chNum}-1`;
                  }
                  stateStore.startCompulsoryRemediation(targetTopicId, (rec.remediationMode as any) || 'visual');
                  onNavigate('lesson');
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md font-semibold"
              >
                <RotateCcwIcon className="h-4 w-4" />
                {rec.suggestedActionCTA}
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => onNavigate('path')}
              className="flex items-center gap-2"
            >
              <BookOpenIcon className="h-4 w-4" />
              Curriculum Roadmap
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('assessments')}>
              Assessments Hub
            </Button>
          </div>
        </Card>



        {/* Bayesian Concept Mastery Breakdown */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-display text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Real-Time Concept Mastery (Bayesian Knowledge Tracing)
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Your latent mastery probability P(Lt) across tested quantum competencies:
          </p>

          <div className="mt-5 space-y-4">
            {questions.map((q) => {
              const bkt = bktUpdates[q.conceptId];
              const mastery = bkt ? bkt.masteryPercentage : 50;
              const tier = bkt ? bkt.masteryTier : 'DEVELOPING';

              return (
                <div key={q.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {q.conceptName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                          tier === 'MASTERED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : tier === 'PROFICIENT'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {tier}
                      </span>
                      <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                        {mastery}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mastery >= 80 ? 'bg-emerald-500' : mastery >= 50 ? 'bg-brand-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // ACTIVE QUESTION SCREEN
  // -------------------------------------------------------------------------
  const currentBKT = bktUpdates[currentQuestion.conceptId];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Q{index + 1} of {questions.length}
          </span>
          <span className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-700" />
          {/* Dynamic Difficulty Indicator */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              currentQuestion.difficulty === 3
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                : currentQuestion.difficulty === 2
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}
          >
            Level {currentQuestion.difficulty}:{' '}
            {currentQuestion.difficulty === 3
              ? 'Advanced'
              : currentQuestion.difficulty === 2
              ? 'Intermediate'
              : 'Foundational'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            <span className="font-mono">{dwellTimeSeconds}s</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Integrity: {Math.round(integrityScore * 100)}%</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('assessments')}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <XIcon className="h-4 w-4" />
            Exit
          </button>
        </div>
      </div>

      {/* Focus Alert Banner */}
      {blurAlert && (
        <div className="animate-in fade-in rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>Quantum Focus Notice:</strong> A browser window switch was logged. Stay in the
          assessment tab to keep your session telemetry calibrated.
        </div>
      )}

      {/* Progress Bar */}
      <ProgressBar
        value={((index + (submitted ? 1 : 0)) / questions.length) * 100}
        label="Assessment Progress"
      />

      {/* Assessment Phase Indicator Banner */}
      <div
        className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold border ${
          currentQuestion.phase === 'mcq'
            ? 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/40 dark:border-sky-900/60 dark:text-sky-300'
            : currentQuestion.phase === 'circuit'
            ? 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/40 dark:border-purple-900/60 dark:text-purple-300'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>
            {currentQuestion.phase === 'mcq'
              ? ' Phase 1: Conceptual Foundations (MCQ & Math)'
              : currentQuestion.phase === 'circuit'
              ? ' Phase 2: Circuit Studio Challenge'
              : ' Phase 3: Quantum Coding & Debugging'}
          </span>
        </div>
        <span className="text-[11px] font-normal opacity-85">
          {currentQuestion.phase === 'mcq'
            ? 'Physical Axioms & Normalization'
            : currentQuestion.phase === 'circuit'
            ? 'Interactive Wire Gate Placement'
            : 'Qiskit Python Assembly & Bug Hunt'}
        </span>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Concept Pill & Type */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {currentQuestion.conceptName}
          </span>
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            Type: {currentQuestion.type.replace('_', ' ')}
          </span>
        </div>

        {/* Prompt */}
        <h1 className="mt-3 font-display text-xl font-bold leading-snug text-zinc-900 dark:text-zinc-50">
          {currentQuestion.prompt}
        </h1>

        {/* Interactive Question Renderers */}
        <div className="mt-6">
          {currentQuestion.type === 'mcq' && (
            <div className="space-y-2.5">
              {(currentQuestion as MCQQuestion).options.map((option) => {
                const isSelected = mcqChoice === option.id;
                const isCorrectOption = option.id === (currentQuestion as MCQQuestion).correctId;
                const showState = submitted && (isSelected || isCorrectOption);

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => setMcqChoice(option.id)}
                    className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      showState && isCorrectOption
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-100'
                        : showState && isSelected
                        ? 'border-red-400 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100'
                        : isSelected
                        ? 'border-brand-600 bg-brand-50/50 text-zinc-900 dark:border-brand-500 dark:bg-brand-950/20 dark:text-zinc-100'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="shrink-0 text-zinc-400">
                      {showState && isCorrectOption ? (
                        <CheckCircle2Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : showState && isSelected ? (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <CircleIcon className="h-5 w-5" />
                      )}
                    </span>
                    <span className="flex-1">{option.label}</span>
                  </button>
                );
              })}

              {!submitted && (
                <div className="pt-3">
                  <Button disabled={!mcqChoice} onClick={submitMCQ}>
                    Submit Answer
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentQuestion.type === 'circuit_builder' && (
            <InteractiveCircuitQuestion
              question={currentQuestion}
              submitted={submitted}
              onAnswerSubmit={(correct) => evaluateAnswer(correct, 'Interactive Quantum Circuit')}
            />
          )}

          {currentQuestion.type === 'parsons' && (
            <ParsonsProblemQuestion
              question={currentQuestion}
              submitted={submitted}
              onAnswerSubmit={(correct) => evaluateAnswer(correct, 'Reordered Protocol Code')}
            />
          )}

          {currentQuestion.type === 'calculation' && (
            <CalculationQuestion
              question={currentQuestion}
              submitted={submitted}
              onAnswerSubmit={(correct, val) => evaluateAnswer(correct, `Calculated: ${val}`)}
            />
          )}

          {currentQuestion.type === 'bug_hunt' && (
            <BugHuntQuestion
              question={currentQuestion}
              submitted={submitted}
              onAnswerSubmit={(correct, lineId) => evaluateAnswer(correct, `Line ID: ${lineId}`)}
            />
          )}
        </div>

        {/* Hint Box */}
        {showHint && !submitted && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-semibold">
              <LightbulbIcon className="h-3.5 w-3.5" />
              Socratic Hint
            </div>
            <p className="mt-1">{currentQuestion.hint}</p>
          </div>
        )}

        {/* Submitted Feedback & BKT Live Posterior Box */}
        {submitted && (
          <div className="mt-6 space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div
              className={`rounded-xl p-4 text-sm ${
                isCurrentCorrect
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border border-red-300 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Mathematically Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span>Quantum Divergence Detected</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            {/* Socratic "Why Did My Answer Fail?" Drawer */}
            {!isCurrentCorrect && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40">
                <button
                  type="button"
                  onClick={() => setWhyFailedOpen(!whyFailedOpen)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-zinc-50"
                >
                  <span className="flex items-center gap-2">
                    <BrainCircuitIcon className="h-4 w-4 text-brand-600" />
                    Why Did My Answer Fail? (Socratic Diagnostic)
                  </span>
                  {whyFailedOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {whyFailedOpen && (
                  <div className="border-t border-zinc-200 p-4 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                    <p>{whyFailedText || currentQuestion.explanation}</p>
                    {currentQuestion.misconceptionId && (
                      <p className="mt-2 font-mono text-[11px] text-brand-600 dark:text-brand-400">
                        Cognitive Taxonomy Tag: {currentQuestion.misconceptionId}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Live BKT Posterior Meter */}
            {currentBKT && (
              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3.5 dark:border-brand-900/40 dark:bg-brand-950/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    BKT Mastery Posterior: {currentQuestion.conceptName}
                  </span>
                  <span className="font-mono font-bold text-brand-700 dark:text-brand-300">
                    {currentBKT.masteryPercentage}% (
                    {currentBKT.delta >= 0 ? `+${(currentBKT.delta * 100).toFixed(1)}%` : `${(currentBKT.delta * 100).toFixed(1)}%`}
                    )
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-500"
                    style={{ width: `${currentBKT.masteryPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation / Action Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            {!submitted && !showHint && (
              <Button variant="ghost" onClick={() => setShowHint(true)}>
                <LightbulbIcon className="h-4 w-4" />
                Show a hint
              </Button>
            )}
          </div>

          {submitted && (
            <Button onClick={nextQuestion} className="flex items-center gap-2">
              {isLast ? 'Complete & See Results' : 'Next Question'}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}