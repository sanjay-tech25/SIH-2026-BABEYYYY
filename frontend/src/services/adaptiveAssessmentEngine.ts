// Authoritative Bayesian Knowledge Tracing (BKT) & Dynamic Difficulty Adjustment (DDA) Engine
// Implements the mathematical formulas specified in adaptive_engine_architecture.md & agent.md

export interface BKTParameters {
  pL0: number; // Prior knowledge probability (default: 0.10)
  pT: number;  // Transition probability (default: 0.15)
  pS: number;  // Slip probability (default: 0.10)
  pG: number;  // Guess probability (default: 0.20)
}

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.10,
  pT: 0.15,
  pS: 0.10,
  pG: 0.20,
};

export interface BKTUpdateResult {
  prior: number;
  posterior: number;
  delta: number;
  masteryPercentage: number;
  masteryTier: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED';
  isRapidGuess: boolean;
  isHesitation: boolean;
}

export type AdaptiveAction = 'ADVANCE' | 'REINFORCE' | 'REVISE';

export type AssessmentPhase = 'mcq' | 'circuit' | 'coding';
export type ChapterComplexityLevel = 1 | 2 | 3 | 4;

export interface ChapterComplexityInfo {
  level: ChapterComplexityLevel;
  tierName: 'Foundation' | 'Intermediate Circuits' | 'Advanced Algorithms' | 'Mastery & Hardware';
  badgeColor: string;
  description: string;
  recommendedPhaseOrder: AssessmentPhase[];
  phaseRequirements: Record<AssessmentPhase, string>;
}

export interface PhaseUnlockStatus {
  isUnlocked: boolean;
  isScaffolded?: boolean;
  reason: string;
}

export interface AssessmentRecommendation {
  action: AdaptiveAction;
  headline: string;
  subtext: string;
  suggestedConcept?: string;
  suggestedActionCTA: string;
  canAdvance: boolean;
  requiresRetake: boolean;
  compulsionLevel: 'NONE' | 'COMPULSORY_REINFORCEMENT' | 'MANDATORY_DIFFERENTIATED_RETAKE';
  remediationMode: 'visual' | 'simulation' | 'misconception' | 'none';
  failedCriticalConcepts: string[];
}


export class AdaptiveAssessmentEngine {
  /**
   * Concept-Importance Weighting Matrix:
   * Foundational concepts carry double weight and strict zero-tolerance gates.
   */
  public static getConceptImportance(conceptId: string): { category: 'FOUNDATIONAL' | 'CORE' | 'ADVANCED'; weight: number } {
    const cid = (conceptId || '').toLowerCase();
    if (cid.includes('foundat') || cid.includes('math') || cid.includes('vector') || cid.includes('qubit') || cid.includes('hilbert') || cid.includes('born')) {
      return { category: 'FOUNDATIONAL', weight: 2.0 };
    }
    if (cid.includes('algo') || cid.includes('grover') || cid.includes('shor') || cid.includes('noise') || cid.includes('mitigat')) {
      return { category: 'ADVANCED', weight: 1.0 };
    }
    return { category: 'CORE', weight: 1.2 };
  }

  /**
   * Computes authoritative posterior mastery P(Lt) using Bayesian Knowledge Tracing.
   * Modulates slip and guess probabilities based on student dwell time (rapid guess vs hesitation).
   */
  public static updateMastery(
    priorMastery: number,
    isCorrect: boolean,
    dwellTimeSeconds: number,
    params: BKTParameters = DEFAULT_BKT_PARAMS
  ): BKTUpdateResult {
    const prior = Math.max(0.01, Math.min(0.99, priorMastery));
    let pG = params.pG;
    let pS = params.pS;
    let pT = params.pT;

    const isRapidGuess = dwellTimeSeconds < 4.0;
    const isHesitation = dwellTimeSeconds > 120.0;

    // Rapid Guessing Modulation (t < 4s): high guess probability, reduced learning transition
    if (isRapidGuess) {
      pG = Math.min(0.60, pG * 2.5);
      pT = 0.02;
    }

    // Hesitation Modulation (t > 120s): higher slip probability
    if (isHesitation) {
      pS = Math.min(0.35, pS * 2.0);
    }

    let pObs: number;
    if (isCorrect) {
      // P(Lt | Correct) = [ P(Lt-1) * (1 - P(S)) ] / [ P(Lt-1)*(1 - P(S)) + (1 - P(Lt-1))*P(G) ]
      const numerator = prior * (1.0 - pS);
      const denominator = numerator + (1.0 - prior) * pG;
      pObs = denominator > 0 ? numerator / denominator : prior;
    } else {
      // P(Lt | Incorrect) = [ P(Lt-1) * P(S) ] / [ P(Lt-1)*P(S) + (1 - P(Lt-1))*(1 - P(G)) ]
      const numerator = prior * pS;
      const denominator = numerator + (1.0 - prior) * (1.0 - pG);
      pObs = denominator > 0 ? numerator / denominator : prior;
    }

    // Learning Transition: P(Lt) = P(Lt | Obs) + (1 - P(Lt | Obs)) * P(T)
    const posterior = Math.min(0.99, Math.max(0.01, pObs + (1.0 - pObs) * pT));
    const delta = posterior - prior;
    const masteryPercentage = Math.round(posterior * 100);

    let masteryTier: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED' = 'NOVICE';
    if (posterior >= 0.85) masteryTier = 'MASTERED';
    else if (posterior >= 0.70) masteryTier = 'PROFICIENT';
    else if (posterior >= 0.40) masteryTier = 'DEVELOPING';

    return {
      prior,
      posterior,
      delta,
      masteryPercentage,
      masteryTier,
      isRapidGuess,
      isHesitation,
    };
  }

  /**
   * Calculates Dynamic Difficulty Adjustment (DDA) tier based on streaks.
   */
  public static calculateNextDifficulty(
    currentDifficulty: 1 | 2 | 3,
    consecutiveCorrect: number,
    consecutiveWrong: number
  ): 1 | 2 | 3 {
    if (consecutiveCorrect >= 2 && currentDifficulty < 3) {
      return (currentDifficulty + 1) as 1 | 2 | 3;
    }
    if (consecutiveWrong >= 1 && currentDifficulty > 1) {
      return (currentDifficulty - 1) as 1 | 2 | 3;
    }
    return currentDifficulty;
  }

  /**
   * Evaluates aggregate assessment performance with Concept-Importance Gating.
   * If any foundational concept failed, advancement is blocked and compulsory retake is mandated.
   */
  public static getRecommendation(
    averageMastery: number,
    weakestConceptName?: string,
    foundationalBreach: boolean = false,
    failedConcepts: string[] = []
  ): AssessmentRecommendation {
    const isPassed = averageMastery >= 0.70 && !foundationalBreach;

    if (isPassed) {
      return {
        action: 'ADVANCE',
        headline: 'Verified Concept Mastery — Ready to Advance!',
        subtext: `Your quantum intuitions are calibrated. You met the authoritative mastery threshold (${Math.round(averageMastery * 100)}% ≥ 70%).`,
        suggestedActionCTA: 'Unlock Next Chapter',
        canAdvance: true,
        requiresRetake: false,
        compulsionLevel: 'NONE',
        remediationMode: 'none',
        failedCriticalConcepts: []
      };
    }

    if (foundationalBreach) {
      return {
        action: 'REVISE',
        headline: 'Advancement Blocked: Critical Axiom Failed',
        subtext: `You missed critical foundational questions in ${weakestConceptName || 'quantum state definitions'}. You cannot advance to subsequent chapters without demonstrating mastery. Compulsory differentiated remediation is required.`,
        suggestedConcept: weakestConceptName,
        suggestedActionCTA: 'Start Compulsory Differentiated Retake',
        canAdvance: false,
        requiresRetake: true,
        compulsionLevel: 'MANDATORY_DIFFERENTIATED_RETAKE',
        remediationMode: 'visual',
        failedCriticalConcepts: failedConcepts.length > 0 ? failedConcepts : [weakestConceptName || 'Foundational Axioms']
      };
    }

    return {
      action: 'REINFORCE',
      headline: 'Advancement Paused: Reinforcement Required',
      subtext: `You achieved baseline understanding (${Math.round(averageMastery * 100)}%), but fell short of the required 70% threshold. You must complete targeted interactive remediation before advancing.`,
      suggestedConcept: weakestConceptName,
      suggestedActionCTA: 'Start Targeted Simulation Retake',
      canAdvance: false,
      requiresRetake: true,
      compulsionLevel: 'COMPULSORY_REINFORCEMENT',
      remediationMode: 'simulation',
      failedCriticalConcepts: failedConcepts.length > 0 ? failedConcepts : [weakestConceptName || 'Core Principles']
    };
  }



  /**
   * Computes non-punitive Assessment Integrity Confidence [0.0, 1.0].
   * Decrements slightly on window blur / tab switches.
   */
  public static computeIntegrityScore(blurCount: number, rapidPasteCount: number): number {
    const penalty = blurCount * 0.08 + rapidPasteCount * 0.15;
    return Math.max(0.40, Math.min(1.0, 1.0 - penalty));
  }

  /**
   * Evaluates the pedagogical complexity tier of a chapter or topic (Levels 1 to 4).
   * Level 1: Foundation (Linear algebra, complex amplitudes, single-qubit definitions)
   * Level 2: Intermediate Circuits (Multi-qubit gates, Bell states, entanglement protocols)
   * Level 3: Advanced Algorithms (Deutsch-Jozsa, Grover search, QFT, VQE NISQ)
   * Level 4: Mastery & Hardware (Quantum error correction, QKD security, Qiskit 1.0 Runtime)
   */
  public static getChapterComplexity(chapterNumber: number): ChapterComplexityInfo {
    if (chapterNumber <= 2) {
      return {
        level: 1,
        tierName: 'Foundation',
        badgeColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        description: 'Conceptual foundations, linear algebra, vector spaces, and single-qubit state geometry.',
        recommendedPhaseOrder: ['mcq', 'circuit', 'coding'],
        phaseRequirements: {
          mcq: 'Always Unlocked (Establishes essential mathematical & axiom foundation)',
          circuit: 'Unlocks after scoring ≥ 60% on Conceptual MCQ Phase',
          coding: 'Unlocks after completing Circuit Studio Phase'
        }
      };
    } else if (chapterNumber <= 5) {
      return {
        level: 2,
        tierName: 'Intermediate Circuits',
        badgeColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        description: 'Multi-qubit unitary operators, Bell states, phase kickback, and quantum communication protocols.',
        recommendedPhaseOrder: ['circuit', 'mcq', 'coding'],
        phaseRequirements: {
          mcq: 'Unlocked (Evaluates non-signaling and entanglement theorems)',
          circuit: 'Primary Focus — Interactive 2-qubit circuit construction and measurement statistics',
          coding: 'Unlocks after passing either MCQ or Circuit Studio with ≥ 60%'
        }
      };
    } else if (chapterNumber <= 8) {
      return {
        level: 3,
        tierName: 'Advanced Algorithms',
        badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        description: 'Algorithmic quantum speedups, oracle queries, Grover diffusion, and NISQ hybrid optimization.',
        recommendedPhaseOrder: ['mcq', 'circuit', 'coding'],
        phaseRequirements: {
          mcq: 'Unlocked (Evaluates query complexity and convergence physics)',
          circuit: 'Unlocked (Requires constructing oracle and diffusion operators)',
          coding: 'Core Phase — Parson’s algorithm sequencing and hybrid loop implementation'
        }
      };
    } else {
      return {
        level: 4,
        tierName: 'Mastery & Hardware',
        badgeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        description: 'Stabilizer error correction codes, quantum cryptography thresholds, and Qiskit 1.0 Runtime Primitives.',
        recommendedPhaseOrder: ['coding', 'circuit', 'mcq'],
        phaseRequirements: {
          mcq: 'Unlocked (Stabilizer theory, QBER security proofs, and PassManager architecture)',
          circuit: 'Unlocked (Syndrome extraction ancillas and surface code lattices)',
          coding: 'Primary Focus — Production Qiskit 1.0 Runtime (SamplerV2, EstimatorV2) and error syndrome logic'
        }
      };
    }
  }

  /**
   * Authoritative unlock evaluation for a specific assessment phase based on chapter complexity and learner history.
   * In Tuned Adaptive Mode, phases are non-blocking: learners can explore freely without mandatory prerequisite retakes,
   * with adaptive scaffolding indicators displayed where appropriate.
   */
  public static isPhaseUnlocked(
    chapterNumber: number,
    phase: AssessmentPhase,
    pastScores: Record<string, number>, // e.g. { 'ch-1-mcq': 85, 'ch-1-circuit': 100 }
    userPlacedLevel: number = 1
  ): PhaseUnlockStatus {
    const complexity = this.getChapterComplexity(chapterNumber);
    const mcqKey = `ch-${chapterNumber}-mcq`;
    const circuitKey = `ch-${chapterNumber}-circuit`;
    const mcqScore = pastScores[mcqKey] ?? null;
    const circuitScore = pastScores[circuitKey] ?? null;

    // Advanced placed learners fast-track unlocks
    if (userPlacedLevel >= 3) {
      return { isUnlocked: true, reason: 'Unlocked via Advanced Diagnostic Placement' };
    }

    if (phase === 'mcq') {
      return { isUnlocked: true, reason: 'Available: Conceptual entry gateway' };
    }

    if (phase === 'circuit') {
      if (mcqScore !== null && mcqScore >= 65) {
        return { isUnlocked: true, reason: `Verified: Passed Conceptual MCQ Phase (${mcqScore}%)` };
      }
      return {
        isUnlocked: false,
        reason: 'Locked: Pass Conceptual MCQ Phase with ≥ 65% first'
      };
    }

    if (phase === 'coding') {
      if (circuitScore !== null && circuitScore >= 65) {
        return { isUnlocked: true, reason: `Verified: Passed Circuit Studio Phase (${circuitScore}%)` };
      }
      return {
        isUnlocked: false,
        reason: 'Locked: Complete and pass Circuit Studio Phase with ≥ 65% first'
      };
    }


    return { isUnlocked: true, reason: 'Available' };
  }

  /**
   * Computes the immediate next forward topic in the adaptive curriculum track.
   * Ensures the learner always has a seamless forward path without retaking previous units.
   */
  public static getNextAdaptiveTopic(
    completedLessons: string[],
    currentTopicId?: string
  ): { chapterId: string; topicId: string } {
    const allTopics = [
      { chapterId: 'ch-1', topicId: 't1-1' },
      { chapterId: 'ch-1', topicId: 't1-2' },
      { chapterId: 'ch-2', topicId: 't2-1' },
      { chapterId: 'ch-2', topicId: 't2-2' },
      { chapterId: 'ch-3', topicId: 't3-1' },
      { chapterId: 'ch-3', topicId: 't3-2' },
      { chapterId: 'ch-4', topicId: 't4-1' },
      { chapterId: 'ch-4', topicId: 't4-2' },
      { chapterId: 'ch-5', topicId: 't5-1' },
      { chapterId: 'ch-5', topicId: 't5-2' },
    ];
    if (currentTopicId) {
      const idx = allTopics.findIndex((t) => t.topicId === currentTopicId);
      if (idx >= 0 && idx < allTopics.length - 1) {
        return allTopics[idx + 1];
      }
    }
    const uncompleted = allTopics.find((t) => !completedLessons.includes(t.topicId));
    return uncompleted || allTopics[allTopics.length - 1];
  }
}

