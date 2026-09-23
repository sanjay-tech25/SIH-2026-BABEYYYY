import React, { useState, useEffect } from 'react';
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
  LayersIcon,
  ZapIcon,
  TargetIcon,
  LockIcon,
  UnlockIcon,
  FileTextIcon,
  CpuIcon,
  Code2Icon,
  AlertCircleIcon,
  CheckIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import {
  ASSESSMENT_CONFIGS,
  type AssessmentConfig
} from '../data/assessmentBank';
import {
  AdaptiveAssessmentEngine,
  type AssessmentPhase,
  type ChapterComplexityLevel
} from '../services/adaptiveAssessmentEngine';
import { stateStore, type AppState, type AssessmentAttemptRecord } from '../services/stateStore';

interface AssessmentsProps {
  onStartPractice: (assessmentId?: string) => void;
}

export function Assessments({ onStartPractice }: AssessmentsProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [phaseFilter, setPhaseFilter] = useState<'all' | AssessmentPhase>('all');
  const [complexityFilter, setComplexityFilter] = useState<'all' | ChapterComplexityLevel>('all');

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const progress = appState.progress;
  const attempts = progress.pastAssessmentAttempts || [];
  const placement = progress.diagnosticPlacement;

  // Build past scores lookup map
  const pastScoresMap: Record<string, number> = {};
  attempts.forEach((a) => {
    if (pastScoresMap[a.assessmentId] === undefined || a.score > pastScoresMap[a.assessmentId]) {
      pastScoresMap[a.assessmentId] = a.score;
    }
  });

  const diagnosticConfig =
    ASSESSMENT_CONFIGS.find((c) => c.id === 'diagnostic-placement') || ASSESSMENT_CONFIGS[0];
  const adaptiveConfig =
    ASSESSMENT_CONFIGS.find((c) => c.id === 'adaptive-daily-workout') || ASSESSMENT_CONFIGS[1];
  const chapterConfigs = ASSESSMENT_CONFIGS.filter((c) => c.kind === 'CHAPTER_MASTERY');

  // Filter chapters by complexity
  const filteredChapters = chapterConfigs.filter((c) => {
    if (complexityFilter !== 'all') {
      const comp = AdaptiveAssessmentEngine.getChapterComplexity(c.chapterNumber || 1);
      return comp.level === complexityFilter;
    }
    return true;
  });

  const getBestScore = (assessmentId: string): number | null => {
    return pastScoresMap[assessmentId] ?? null;
  };

  return (
    <div className="space-y-12 pb-12">
      <PageHeader
        title="Quantum Assessments & Adaptive Skill Hub"
        subtitle="Multi-modal evaluations with separate Conceptual MCQ, Circuit Studio, and Quantum Coding phases calibrated to topic complexity."
      />

      {/* Hero: Adaptive Diagnostic Placement Exam */}
      <section aria-labelledby="diagnostic-heading">
        <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-50/30 p-6 sm:p-8 shadow-sm dark:border-brand-900/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-brand-950/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Adaptive Diagnostic Placement
                </span>
                {placement ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Placed: Level {placement.placedLevel} ({placement.placedLevel === 3 ? 'Advanced' : placement.placedLevel === 2 ? 'Intermediate' : 'Beginner'})
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Placement Pending
                  </span>
                )}
              </div>

              <h2 id="diagnostic-heading" className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {diagnosticConfig.title}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {diagnosticConfig.summary} Calibrates your initial Bayesian Knowledge Tracing (BKT) baseline across Conceptual Theory, Circuit Studio, and Quantum Coding modalities.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <TargetIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  3-Phase Assessment (MCQ + Circuit + Code)
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ClockIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  ~{diagnosticConfig.estimatedMinutes} Minutes
                </div>
                {placement && (
                  <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2Icon className="h-4 w-4" />
                    Baseline: {placement.score}%
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onStartPractice(diagnosticConfig.id)}
                className="w-full sm:w-auto shadow-md"
              >
                {placement ? 'Retake Placement Exam' : 'Start Diagnostic Exam'}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Adaptive Practice Banner */}
      <section aria-labelledby="adaptive-heading">
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              <ZapIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="adaptive-heading" className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {adaptiveConfig.title}
                </h3>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  IRT / DDA Mode
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
                {adaptiveConfig.summary} Dynamically shifts question types and difficulty tiers based on your real-time response accuracy and hesitation telemetry.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => onStartPractice(adaptiveConfig.id)}
            className="shrink-0"
          >
            Launch Adaptive Workout
          </Button>
        </Card>
      </section>

      {/* Chapter Phased Assessments Section */}
      <section aria-labelledby="chapters-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div>
            <h2 id="chapters-heading" className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Phased Chapter Assessments by Complexity
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Every chapter separates evaluations into 3 distinct phases: Theory/MCQ, Circuit Studio, and Quantum Coding.
            </p>
          </div>

          {/* Phase Filter Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 mr-1">Phase View:</span>
            <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setPhaseFilter('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  phaseFilter === 'all'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                All 3 Phases
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('mcq')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  phaseFilter === 'mcq'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <FileTextIcon className="h-3 w-3" />
                MCQ Only
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('circuit')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  phaseFilter === 'circuit'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <CpuIcon className="h-3 w-3" />
                Circuit Only
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('coding')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  phaseFilter === 'coding'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <Code2Icon className="h-3 w-3" />
                Coding Only
              </button>
            </div>
          </div>
        </div>

        {/* Complexity Level Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800 text-xs">
            <span className="px-2 text-zinc-400 font-medium">Complexity:</span>
            {[
              { id: 'all', label: 'All Levels (1–4)' },
              { id: 1, label: 'Level 1: Foundations (Ch 1–2)' },
              { id: 2, label: 'Level 2: Core Circuits (Ch 3–5)' },
              { id: 3, label: 'Level 3: Algorithms (Ch 6–8)' },
              { id: 4, label: 'Level 4: Hardware & QEC (Ch 9–11)' },
            ].map((tab) => (
              <button
                key={String(tab.id)}
                onClick={() => setComplexityFilter(tab.id as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  complexityFilter === tab.id
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Phased Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredChapters.map((chapter) => {
            const chNum = chapter.chapterNumber || 1;
            const complexity = AdaptiveAssessmentEngine.getChapterComplexity(chNum);
            const userLevel = placement?.placedLevel || 1;

            const mcqId = `ch-${chNum}-mcq`;
            const circuitId = `ch-${chNum}-circuit`;
            const codingId = `ch-${chNum}-coding`;
            const masteryId = `ch-${chNum}-mastery`;

            const mcqScore = getBestScore(mcqId);
            const circuitScore = getBestScore(circuitId);
            const codingScore = getBestScore(codingId);
            const masteryScore = getBestScore(masteryId);

            const mcqStatus = AdaptiveAssessmentEngine.isPhaseUnlocked(chNum, 'mcq', pastScoresMap, userLevel);
            const circuitStatus = AdaptiveAssessmentEngine.isPhaseUnlocked(chNum, 'circuit', pastScoresMap, userLevel);
            const codingStatus = AdaptiveAssessmentEngine.isPhaseUnlocked(chNum, 'coding', pastScoresMap, userLevel);

            return (
              <Card key={chapter.id} className="flex flex-col justify-between p-5 border-zinc-200 dark:border-zinc-800">
                <div className="space-y-3">
                  {/* Card Header: Chapter Number & Complexity Tier Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Chapter {chNum}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${complexity.badgeColor}`}>
                      Level {complexity.level} · {complexity.tierName}
                    </span>
                  </div>

                  {/* Title & Pedagogical Description */}
                  <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {complexity.description}
                  </p>

                  {/* 3 Separate Assessment Phases */}
                  <div className="mt-4 space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {/* Phase 1: Conceptual Foundations (MCQ) */}
                    {(phaseFilter === 'all' || phaseFilter === 'mcq') && (
                      <div className="rounded-xl border border-sky-200/60 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              Phase 1: Theory & MCQ
                            </span>
                          </div>
                          {mcqScore !== null ? (
                            <span className={`text-xs font-bold ${mcqScore >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              Score: {mcqScore}%
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-400">Available</span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          Axioms, mathematics, and misconception checks.
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 font-mono">~3 mins · +50 CP</span>
                          <Button
                            size="sm"
                            variant={mcqScore !== null && mcqScore >= 60 ? 'secondary' : 'primary'}
                            className="h-7 text-xs px-2.5"
                            onClick={() => onStartPractice(mcqId)}
                          >
                            {mcqScore !== null ? 'Practice MCQ' : 'Start MCQ'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Phase 2: Circuit Studio Challenge */}
                    {(phaseFilter === 'all' || phaseFilter === 'circuit') && (
                      <div
                        className={`rounded-xl border p-3 ${
                          !circuitStatus.isUnlocked
                            ? 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30 opacity-75'
                            : 'border-purple-200/60 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CpuIcon className={`h-4 w-4 ${!circuitStatus.isUnlocked ? 'text-zinc-400' : 'text-purple-600 dark:text-purple-400'}`} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              Phase 2: Circuit Studio
                            </span>
                          </div>
                          {circuitScore !== null ? (
                            <span className={`text-xs font-bold ${circuitScore >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              Score: {circuitScore}%
                            </span>
                          ) : !circuitStatus.isUnlocked ? (
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <LockIcon className="h-3 w-3" /> Locked
                            </span>
                          ) : circuitStatus.isScaffolded ? (
                            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded">
                              Adaptive Guided
                            </span>
                          ) : (
                            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Unlocked</span>
                          )}
                        </div>
                        <p className={`mt-1 text-[11px] ${!circuitStatus.isUnlocked ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {circuitStatus.reason || 'Interactive gate placement & Qiskit Aer simulation.'}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 font-mono">~4 mins · +75 CP</span>
                          <Button
                            size="sm"
                            disabled={!circuitStatus.isUnlocked}
                            variant={circuitScore !== null && circuitScore >= 60 ? 'secondary' : 'primary'}
                            className={`h-7 text-xs px-2.5 ${!circuitStatus.isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => onStartPractice(circuitId)}
                          >
                            {!circuitStatus.isUnlocked ? (
                              <span className="flex items-center gap-1">
                                <LockIcon className="h-3 w-3" /> Locked
                              </span>
                            ) : circuitScore !== null ? (
                              'Practice Circuit'
                            ) : (
                              'Start Circuit'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Phase 3: Quantum Coding & Debugging */}
                    {(phaseFilter === 'all' || phaseFilter === 'coding') && (
                      <div
                        className={`rounded-xl border p-3 ${
                          !codingStatus.isUnlocked
                            ? 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30 opacity-75'
                            : 'border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Code2Icon className={`h-4 w-4 ${!codingStatus.isUnlocked ? 'text-zinc-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              Phase 3: Quantum Coding
                            </span>
                          </div>
                          {codingScore !== null ? (
                            <span className={`text-xs font-bold ${codingScore >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              Score: {codingScore}%
                            </span>
                          ) : !codingStatus.isUnlocked ? (
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <LockIcon className="h-3 w-3" /> Locked
                            </span>
                          ) : codingStatus.isScaffolded ? (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                              Adaptive Guided
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Unlocked</span>
                          )}
                        </div>
                        <p className={`mt-1 text-[11px] ${!codingStatus.isUnlocked ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {codingStatus.reason || 'Parson’s assembly and Socratic bug diagnosis.'}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 font-mono">~4 mins · +75 CP</span>
                          <Button
                            size="sm"
                            disabled={!codingStatus.isUnlocked}
                            variant={codingScore !== null && codingScore >= 60 ? 'secondary' : 'primary'}
                            className={`h-7 text-xs px-2.5 ${!codingStatus.isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => onStartPractice(codingId)}
                          >
                            {!codingStatus.isUnlocked ? (
                              <span className="flex items-center gap-1">
                                <LockIcon className="h-3 w-3" /> Locked
                              </span>
                            ) : codingScore !== null ? (
                              'Practice Coding'
                            ) : (
                              'Start Coding'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                {/* Footer: Full 3-Phase Sequential Milestone CTA */}
                <div className="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px]">
                      {masteryScore !== null ? `Mastery: ${masteryScore}%` : 'Full Milestone Exam'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onStartPractice(masteryId)}
                      className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-xs"
                    >
                      <span>Take All 3 Phases</span>
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Past Assessment Attempts & Integrity Review */}
      <section aria-labelledby="past-heading" className="space-y-4">
        <h2 id="past-heading" className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Assessment History & Cognitive Calibration
        </h2>

        {attempts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
            No past assessment sessions recorded yet. Start with the Diagnostic Placement Exam above!
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {attempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {attempt.title}
                      </p>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          attempt.passed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {attempt.score}%
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Date: {attempt.date}</span>
                      <span>·</span>
                      <span>Correct: {attempt.correctCount}/{attempt.totalQuestions}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        Integrity: {Math.round((attempt.integrityScore || 1.0) * 100)}%
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onStartPractice(attempt.assessmentId)}
                  >
                    Retake
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}