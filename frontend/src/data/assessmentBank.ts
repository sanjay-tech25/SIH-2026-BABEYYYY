// Quantum Assessment Question Bank & Type Definitions
// Supports 3 distinct assessment phases:
// 1. Conceptual MCQ & Calculation Phase ('mcq')
// 2. Interactive Circuit Studio Phase ('circuit')
// 3. Quantum Coding & Algorithmic Debugging Phase ('coding')
// Covers Diagnostic Placement, 11-Chapter Phased Assessments, and Dynamic Adaptive Practice

import type { AssessmentPhase, ChapterComplexityLevel } from '../services/adaptiveAssessmentEngine';

export type QuestionType = 'mcq' | 'circuit_builder' | 'parsons' | 'calculation' | 'bug_hunt';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  phase: AssessmentPhase; // 'mcq' | 'circuit' | 'coding'
  conceptId: string;
  conceptName: string;
  chapterId?: string;
  difficulty: 1 | 2 | 3; // 1: Foundation, 2: Intermediate, 3: Advanced
  prompt: string;
  hint: string;
  explanation: string;
  misconceptionId?: string; // MC-01 through MC-10
  misconceptionExplanation?: string;
}

export interface MCQOption {
  id: string;
  label: string;
  distractorFeedback?: string;
  isMisconception?: boolean;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  phase: 'mcq';
  options: MCQOption[];
  correctId: string;
}

export interface CircuitGateSlot {
  qubit: number;
  gate: string; // 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'CZ'
  targetQubit?: number;
}

export interface CircuitBuilderQuestion extends BaseQuestion {
  type: 'circuit_builder';
  phase: 'circuit';
  numQubits: number;
  allowedGates: string[];
  initialStateDescription: string;
  targetOutcomeDescription: string;
  targetStatevector?: { state: string; amplitude: string }[];
  targetProbabilities: Record<string, number>; // e.g. { '00': 0.5, '11': 0.5 }
  solutionCircuit: CircuitGateSlot[];
}

export interface ParsonsLine {
  id: string;
  code: string;
  indentation: number; // 0, 1, 2...
}

export interface ParsonsQuestion extends BaseQuestion {
  type: 'parsons';
  phase: 'coding';
  language: 'qiskit' | 'algorithm';
  scrambledLines: ParsonsLine[];
  correctOrderIds: string[];
}

export interface CalculationQuestion extends BaseQuestion {
  type: 'calculation';
  phase: 'mcq';
  targetValue: number;
  tolerance: number; // e.g. 0.02
  unit?: string;
  stepByStepSolution: string[];
}

export interface BugHuntLine {
  id: string;
  lineNumber: number;
  code: string;
  isBuggy: boolean;
}

export interface BugHuntQuestion extends BaseQuestion {
  type: 'bug_hunt';
  phase: 'coding';
  codeSnippet: string;
  lines: BugHuntLine[];
  buggyLineId: string;
  rootCause: string;
  fixDescription: string;
}

export type AssessmentQuestion =
  | MCQQuestion
  | CircuitBuilderQuestion
  | ParsonsQuestion
  | CalculationQuestion
  | BugHuntQuestion;

export interface AssessmentConfig {
  id: string;
  title: string;
  kind: 'DIAGNOSTIC' | 'CHAPTER_MASTERY' | 'ADAPTIVE_PRACTICE' | 'PHASE_MCQ' | 'PHASE_CIRCUIT' | 'PHASE_CODING';
  phase?: AssessmentPhase | 'all';
  chapterId?: string;
  chapterNumber?: number;
  complexityLevel?: ChapterComplexityLevel;
  summary: string;
  questionsCount: number;
  estimatedMinutes: number;
  conceptIds: string[];
}

export const getQuestionPhase = (q: AssessmentQuestion): AssessmentPhase => {
  if (q.type === 'mcq' || q.type === 'calculation') return 'mcq';
  if (q.type === 'circuit_builder') return 'circuit';
  return 'coding';
};

// ---------------------------------------------------------------------------
// 1. DIAGNOSTIC PLACEMENT QUESTION POOL
// (Multi-Modal Diagnostic across all 3 phases)
// ---------------------------------------------------------------------------
export const diagnosticQuestions: AssessmentQuestion[] = [
  {
    id: 'diag-1',
    type: 'mcq',
    phase: 'mcq',
    conceptId: 'math_foundations',
    conceptName: 'Complex Amplitudes & Normalization',
    difficulty: 1,
    prompt: 'A quantum state is given by |ψ⟩ = (1/√2)|0⟩ + c|1⟩. For |ψ⟩ to be a physically valid normalized state, what is the magnitude |c|²?',
    options: [
      { id: 'a', label: '1/2', distractorFeedback: 'Correct! The sum of squared magnitudes must equal 1.0.' },
      { id: 'b', label: '1/√2', distractorFeedback: 'Recall that probabilities are squared amplitudes: |α|² + |β|² = 1.', isMisconception: true },
      { id: 'c', label: '1', distractorFeedback: 'If |c|² = 1, then total probability would be 1.5, violating normalization.', isMisconception: true },
      { id: 'd', label: '0', distractorFeedback: 'If c = 0, the state is just |0⟩ with total probability 0.5.' }
    ],
    correctId: 'a',
    hint: 'Apply the normalization axiom: |α|² + |β|² = 1.',
    explanation: 'In complex Hilbert space, probability amplitudes must satisfy the Born normalization condition: (1/√2)² + |c|² = 1/2 + |c|² = 1, which requires |c|² = 1/2.'
  },
  {
    id: 'diag-2',
    type: 'calculation',
    phase: 'mcq',
    conceptId: 'born_rule',
    conceptName: 'Born Rule Probability Calculation',
    difficulty: 1,
    prompt: 'Given the state |ψ⟩ = (3/5)|0⟩ + (4/5)|1⟩, calculate the exact theoretical probability of measuring the qubit in state |1⟩.',
    targetValue: 0.64,
    tolerance: 0.01,
    unit: 'probability (0.0 to 1.0)',
    stepByStepSolution: [
      '1. Identify the amplitude for state |1⟩: β = 4/5 = 0.8',
      '2. Apply the Born rule: P(|1⟩) = |β|²',
      '3. Compute: (4/5)² = 16/25 = 0.64 (64%)'
    ],
    hint: 'Square the amplitude associated with the basis state |1⟩.',
    explanation: 'By the Born rule, the probability of outcome |1⟩ is the squared magnitude of its amplitude: (4/5)² = 16/25 = 0.64.'
  },
  {
    id: 'diag-3',
    type: 'circuit_builder',
    phase: 'circuit',
    conceptId: 'superposition',
    conceptName: 'Creating Equal Superposition',
    difficulty: 2,
    prompt: 'Place the correct gate on wire q0 to transform the ground state |0⟩ into the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.',
    numQubits: 1,
    allowedGates: ['H', 'X', 'Z', 'S'],
    initialStateDescription: 'Qubit 0 is initialized in state |0⟩.',
    targetOutcomeDescription: 'Equal 50% / 50% superposition (|0⟩ and |1⟩).',
    targetProbabilities: { '0': 0.5, '1': 0.5 },
    solutionCircuit: [{ qubit: 0, gate: 'H' }],
    hint: 'Which single-qubit gate creates equal superposition from a computational basis state?',
    explanation: 'The Hadamard (H) gate maps |0⟩ to |+⟩ = (|0⟩+|1⟩)/√2, creating an equal superposition with 50% probability of measuring 0 and 50% of measuring 1.'
  },
  {
    id: 'diag-4',
    type: 'parsons',
    phase: 'coding',
    conceptId: 'entanglement',
    conceptName: 'Bell State Circuit Construction',
    difficulty: 2,
    prompt: 'Arrange the Qiskit instructions in the correct logical sequence to construct the Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.',
    language: 'qiskit',
    scrambledLines: [
      { id: 'p1', code: 'qc = QuantumCircuit(2, 2)', indentation: 0 },
      { id: 'p2', code: 'qc.cx(0, 1)  # Entangle qubit 0 and qubit 1', indentation: 0 },
      { id: 'p3', code: 'qc.h(0)      # Create superposition on control qubit', indentation: 0 },
      { id: 'p4', code: 'qc.measure([0, 1], [0, 1])', indentation: 0 }
    ],
    correctOrderIds: ['p1', 'p3', 'p2', 'p4'],
    hint: 'You must put the control qubit into superposition before entangling it with the target qubit via CNOT.',
    explanation: 'To prepare a Bell state, we first initialize the 2-qubit circuit, apply a Hadamard gate to qubit 0 to make (|0⟩+|1⟩)/√2, apply a CNOT from qubit 0 to qubit 1 to generate (|00⟩+|11⟩)/√2, and finally measure.'
  },
  {
    id: 'diag-5',
    type: 'bug_hunt',
    phase: 'coding',
    conceptId: 'measurement_collapse',
    conceptName: 'Post-Measurement Gate Bug',
    difficulty: 3,
    prompt: 'Inspect this quantum circuit snippet. Identify the line containing a critical conceptual error that ruins quantum coherence.',
    codeSnippet: '1: qc = QuantumCircuit(2, 2)\n2: qc.h(0)\n3: qc.cx(0, 1)\n4: qc.measure([0, 1], [0, 1])\n5: qc.h(0)  # Attempting phase rotation',
    lines: [
      { id: 'l1', lineNumber: 1, code: 'qc = QuantumCircuit(2, 2)', isBuggy: false },
      { id: 'l2', lineNumber: 2, code: 'qc.h(0)', isBuggy: false },
      { id: 'l3', lineNumber: 3, code: 'qc.cx(0, 1)', isBuggy: false },
      { id: 'l4', lineNumber: 4, code: 'qc.measure([0, 1], [0, 1])', isBuggy: false },
      { id: 'l5', lineNumber: 5, code: 'qc.h(0)  # Attempting phase rotation', isBuggy: true }
    ],
    buggyLineId: 'l5',
    rootCause: 'Applying a unitary gate after projective measurement violates the principle of quantum state collapse (MC-02).',
    fixDescription: 'Move all unitary transformations (H, CX) before the measurement operations. Measurement projects the quantum state onto a classical basis.',
    hint: 'Look for operations attempted after the quantum measurement has already taken place.',
    explanation: 'Projective measurement collapses the quantum superposition into a classical bit string. Applying coherent gates after measurement is an anti-pattern (MC-02).'
  }
];

// ---------------------------------------------------------------------------
// 2. 11 CHAPTER MASTERY QUESTION POOL (Organized across 3 distinct phases)
// ---------------------------------------------------------------------------
export const chapterMasteryQuestions: Record<string, AssessmentQuestion[]> = {
  // CHAPTER 1 (Complexity: Level 1 - Foundation)
  'ch-1': [
    {
      id: 'ch1-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'linear_algebra',
      conceptName: 'Unitary Matrices & Reversibility',
      difficulty: 1,
      prompt: 'Why must every quantum logic gate (prior to measurement) be represented by a unitary matrix U?',
      options: [
        { id: 'a', label: 'To conserve probability: U†U = I ensures total probability remains 1.0', distractorFeedback: 'Correct! Unitary evolution preserves the norm in Hilbert space.' },
        { id: 'b', label: 'To make the computation run faster than classical logic', distractorFeedback: 'Speedup comes from superposition and interference, not unitary normalization alone.' },
        { id: 'c', label: 'Because quantum gates can only operate on diagonal matrices', distractorFeedback: 'Gates like X and H have non-zero off-diagonal terms.' },
        { id: 'd', label: 'To prevent any phase shifts from accumulating', distractorFeedback: 'Gates like S and T explicitly introduce phase shifts.' }
      ],
      correctId: 'a',
      hint: 'Think about what U†U = I means for the length of a statevector.',
      explanation: 'Unitary operators satisfy U†U = I, which guarantees that the Euclidean norm of the statevector is preserved under time evolution.'
    },
    {
      id: 'ch1-mcq-2',
      type: 'calculation',
      phase: 'mcq',
      conceptId: 'inner_product',
      conceptName: 'Inner Product Calculation',
      difficulty: 1,
      prompt: 'Compute the inner product ⟨0|+⟩ where |+⟩ = (1/√2)|0⟩ + (1/√2)|1⟩. Enter the decimal value (rounded to 3 decimal places).',
      targetValue: 0.707,
      tolerance: 0.015,
      unit: 'overlap amplitude (0 to 1)',
      stepByStepSolution: [
        '1. Expand: ⟨0|+⟩ = ⟨0| ( (1/√2)|0⟩ + (1/√2)|1⟩ )',
        '2. Use linearity: (1/√2)⟨0|0⟩ + (1/√2)⟨0|1⟩',
        '3. Since ⟨0|0⟩ = 1 and ⟨0|1⟩ = 0: ⟨0|+⟩ = 1/√2 ≈ 0.707'
      ],
      hint: 'The basis states |0⟩ and |1⟩ are orthonormal: ⟨0|0⟩=1 and ⟨0|1⟩=0.',
      explanation: '⟨0|+⟩ = 1/√2 ≈ 0.707. The probability of measuring state |0⟩ from |+⟩ is |⟨0|+⟩|² = 0.5.'
    },
    {
      id: 'ch1-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'pauli_x',
      conceptName: 'Pauli-X Bit Flip',
      difficulty: 1,
      prompt: 'Construct a circuit on wire q0 that flips the ground state |0⟩ to state |1⟩ with 100% probability.',
      numQubits: 1,
      allowedGates: ['X', 'H', 'Z'],
      initialStateDescription: 'Wire q0 starts in |0⟩.',
      targetOutcomeDescription: '100% probability of outcome 1.',
      targetProbabilities: { '1': 1.0 },
      solutionCircuit: [{ qubit: 0, gate: 'X' }],
      hint: 'Which gate acts as the quantum NOT gate?',
      explanation: 'The Pauli-X gate acts as a bit-flip operator: X|0⟩ = |1⟩.'
    },
    {
      id: 'ch1-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'qiskit_initialization',
      conceptName: 'Qiskit Register & Circuit Initialization',
      difficulty: 1,
      prompt: 'Arrange the Python Qiskit code lines in order to initialize a 1-qubit circuit, flip it to |1⟩, and measure.',
      language: 'qiskit',
      scrambledLines: [
        { id: 'q1', code: 'from qiskit import QuantumCircuit', indentation: 0 },
        { id: 'q2', code: 'qc = QuantumCircuit(1, 1)', indentation: 0 },
        { id: 'q3', code: 'qc.x(0)', indentation: 0 },
        { id: 'q4', code: 'qc.measure(0, 0)', indentation: 0 }
      ],
      correctOrderIds: ['q1', 'q2', 'q3', 'q4'],
      hint: 'Import the circuit class before instantiating qc, apply the gate, then measure.',
      explanation: 'Standard Qiskit workflow: import QuantumCircuit, instantiate registers, apply unitary operators, then measure onto classical bits.'
    }
  ],

  // CHAPTER 2 (Complexity: Level 1 - Foundation)
  'ch-2': [
    {
      id: 'ch2-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'bloch_sphere',
      conceptName: 'Bloch Sphere Geometry',
      difficulty: 1,
      prompt: 'Where does the state |−⟩ = (|0⟩ − |1⟩)/√2 lie on the standard Bloch sphere?',
      options: [
        { id: 'a', label: 'On the negative X-axis (equator at φ = π)', distractorFeedback: 'Correct! |+⟩ is along +X, and |−⟩ is along −X.' },
        { id: 'b', label: 'At the North Pole (Z = +1)', distractorFeedback: 'The North Pole represents the computational basis state |0⟩.' },
        { id: 'c', label: 'At the South Pole (Z = −1)', distractorFeedback: 'The South Pole represents the computational basis state |1⟩.' },
        { id: 'd', label: 'On the positive Y-axis', distractorFeedback: 'The +Y axis represents (|0⟩ + i|1⟩)/√2.' }
      ],
      correctId: 'a',
      hint: 'Recall that equatorial states have equal probabilities 50/50 with different azimuthal phase angles.',
      explanation: 'On the Bloch sphere, the state |−⟩ has polar angle θ = π/2 and azimuthal phase ϕ = π, situating it along the negative X-axis.'
    },
    {
      id: 'ch2-mcq-2',
      type: 'calculation',
      phase: 'mcq',
      conceptId: 'born_rule_phase',
      conceptName: 'Born Rule with Relative Phase',
      difficulty: 2,
      prompt: 'If |ψ⟩ = (1/2)|0⟩ + (√3/2)e^(iπ/4)|1⟩, calculate the probability of measuring outcome 0. (Enter as a decimal).',
      targetValue: 0.25,
      tolerance: 0.01,
      unit: 'probability (0.0 to 1.0)',
      stepByStepSolution: [
        '1. The amplitude for state |0⟩ is α = 1/2.',
        '2. By the Born rule: P(0) = |α|² = (1/2)² = 1/4 = 0.25.'
      ],
      hint: 'The relative phase on |1⟩ does not alter the amplitude magnitude of state |0⟩.',
      explanation: 'P(0) = |α|² = (1/2)² = 0.25 (25%). Relative phase only influences interference patterns when another basis rotation is applied.'
    },
    {
      id: 'ch2-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'hadamard_superposition',
      conceptName: 'Equal Superposition Synthesis',
      difficulty: 1,
      prompt: 'Place the Hadamard gate on wire q0 to prepare an equal superposition state |+⟩ from the initial state |0⟩.',
      numQubits: 1,
      allowedGates: ['H', 'X', 'Z'],
      initialStateDescription: 'Wire q0 is in |0⟩.',
      targetOutcomeDescription: '50% probability of 0, 50% probability of 1.',
      targetProbabilities: { '0': 0.5, '1': 0.5 },
      solutionCircuit: [{ qubit: 0, gate: 'H' }],
      hint: 'Hadamard rotates the Z-basis state into the X-basis equator.',
      explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩, producing equal 50% measurement distribution.'
    },
    {
      id: 'ch2-coding-1',
      type: 'bug_hunt',
      phase: 'coding',
      conceptId: 'mc01_classical_prob',
      conceptName: 'Double Hadamard Interference Fallacy',
      difficulty: 2,
      prompt: 'Identify the conceptual bug in this student claim: "Applying two Hadamard gates in a row (H · H) gives a 50% probability of 0 and 50% of 1 because each H acts as a random coin flip."',
      codeSnippet: '1: # Student hypothesis:\n2: qc = QuantumCircuit(1, 1)\n3: qc.h(0)  # coin flip 1: 50% / 50%\n4: qc.h(0)  # coin flip 2: still 50% / 50%\n5: qc.measure(0, 0)',
      lines: [
        { id: 'l1', lineNumber: 3, code: 'qc.h(0)  # coin flip 1', isBuggy: false },
        { id: 'l2', lineNumber: 4, code: 'qc.h(0)  # coin flip 2: assumption of randomness', isBuggy: true }
      ],
      buggyLineId: 'l2',
      rootCause: 'Hadamard is a deterministic unitary involution (H² = I), not an irreversible classical RNG (MC-01/MC-04).',
      fixDescription: 'Recognize that H · H = I. The second Hadamard creates destructive interference for |1⟩ and constructive interference for |0⟩, restoring state |0⟩ with 100% certainty.',
      hint: 'What is H applied to (|0⟩+|1⟩)/√2?',
      explanation: 'H|0⟩ = |+⟩. Applying H again yields H|+⟩ = |0⟩ with 100% probability due to quantum phase interference, completely refuting the classical coin-flip analogy.'
    }
  ],

  // CHAPTER 3 (Complexity: Level 2 - Intermediate Circuits)
  'ch-3': [
    {
      id: 'ch3-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 's_and_t_gates',
      conceptName: 'S and T Gate Relations',
      difficulty: 2,
      prompt: 'How is the T gate related to the S gate and Z gate?',
      options: [
        { id: 'a', label: 'T² = S and S² = Z (T is the fourth root of Z, adding phase π/4)', distractorFeedback: 'Correct! T adds π/4, S adds π/2, Z adds π.' },
        { id: 'b', label: 'T is the inverse of S: T · S = I', distractorFeedback: 'S† is the inverse of S, not T.' },
        { id: 'c', label: 'T is identical to H but applies to wire 1', distractorFeedback: 'H is a basis rotation; T is a Z-axis phase rotation.' },
        { id: 'd', label: 'T flips the bit from |0⟩ to |1⟩', distractorFeedback: 'T preserves computational basis states, only adding phase to |1⟩.' }
      ],
      correctId: 'a',
      hint: 'Compare the phases: e^(iπ/4) squared is e^(iπ/2).',
      explanation: 'T = diag(1, e^(iπ/4)). Squaring T yields diag(1, e^(iπ/2)) = S. Squaring S yields diag(1, e^(iπ)) = Z.'
    },
    {
      id: 'ch3-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'phase_gates',
      conceptName: 'Phase Gate Rotation on Equator',
      difficulty: 2,
      prompt: 'Construct a circuit on wire q0 that prepares the state |−⟩ = (|0⟩ − |1⟩)/√2 starting from |0⟩.',
      numQubits: 1,
      allowedGates: ['H', 'Z', 'X', 'S'],
      initialStateDescription: 'Wire q0 is in |0⟩.',
      targetOutcomeDescription: 'State |−⟩ with 50/50 measurement probabilities and relative phase π.',
      targetProbabilities: { '0': 0.5, '1': 0.5 },
      solutionCircuit: [
        { qubit: 0, gate: 'H' },
        { qubit: 0, gate: 'Z' }
      ],
      hint: 'First put the qubit into equal superposition |+⟩ with H, then apply a gate that flips the phase of |1⟩ to −|1⟩.',
      explanation: 'Applying H creates (|0⟩+|1⟩)/√2. The Pauli-Z gate maps |1⟩ to −|1⟩ while leaving |0⟩ unchanged, producing |−⟩ = (|0⟩−|1⟩)/√2.'
    },
    {
      id: 'ch3-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'cnot_reversible_logic',
      conceptName: 'CNOT Entangling Gate Implementation',
      difficulty: 2,
      prompt: 'Arrange the Qiskit code lines to prepare a 2-qubit register, put qubit 0 in superposition, and entangle it with qubit 1 using CNOT.',
      language: 'qiskit',
      scrambledLines: [
        { id: 'c1', code: 'qc = QuantumCircuit(2, 2)', indentation: 0 },
        { id: 'c2', code: 'qc.h(0)', indentation: 0 },
        { id: 'c3', code: 'qc.cx(0, 1)', indentation: 0 },
        { id: 'c4', code: 'qc.measure_all()', indentation: 0 }
      ],
      correctOrderIds: ['c1', 'c2', 'c3', 'c4'],
      hint: 'Control qubit must be put in superposition before the conditional entangling operation.',
      explanation: 'Creating entanglement requires creating superposition on the control wire first, followed by the two-qubit conditional CX gate.'
    }
  ],

  // CHAPTER 4 (Complexity: Level 2 - Intermediate Circuits)
  'ch-4': [
    {
      id: 'ch4-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'entanglement_signaling',
      conceptName: 'No-Signaling Theorem',
      difficulty: 2,
      prompt: 'Alice and Bob share the entangled Bell pair (|00⟩+|11⟩)/√2. If Alice measures her qubit and obtains outcome 0, can she use this event to transmit instantaneous information to Bob without a classical communication channel?',
      options: [
        { id: 'a', label: 'No. The No-Signaling Theorem proves Bob’s reduced density matrix is identical regardless of Alice’s measurement.', distractorFeedback: 'Correct! Entanglement cannot transmit information faster than light (MC-03).' },
        { id: 'b', label: 'Yes, because Bob immediately sees his qubit collapse to |0⟩', distractorFeedback: 'Bob cannot know whether his outcome resulted from Alice’s measurement or local collapse without classical communication.', isMisconception: true },
        { id: 'c', label: 'Yes, but only if they use microwave resonators', distractorFeedback: 'The No-Signaling Theorem is a fundamental theorem of quantum mechanics.' },
        { id: 'd', label: 'No, because entanglement breaks if separated by more than 1 meter', distractorFeedback: 'Entanglement has been demonstrated across thousands of kilometers in satellite experiments.' }
      ],
      correctId: 'a',
      hint: 'Consider what Bob can observe locally without talking to Alice.',
      explanation: 'According to the No-Signaling Theorem (MC-03), the marginal probability distribution for Bob is Tr_A(ρ) = I/2, which is completely independent of Alice’s actions.'
    },
    {
      id: 'ch4-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'bell_state',
      conceptName: 'Bell State |Ψ⁺⟩ Preparation',
      difficulty: 2,
      prompt: 'Build a 2-qubit circuit that prepares the entangled Bell state |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2 from initial state |00⟩.',
      numQubits: 2,
      allowedGates: ['H', 'X', 'CNOT'],
      initialStateDescription: 'Both qubits start in |00⟩.',
      targetOutcomeDescription: 'Equal 50% probability of |01⟩ and 50% probability of |10⟩.',
      targetProbabilities: { '01': 0.5, '10': 0.5 },
      solutionCircuit: [
        { qubit: 0, gate: 'H' },
        { qubit: 1, gate: 'X' },
        { qubit: 0, gate: 'CNOT', targetQubit: 1 }
      ],
      hint: 'Flip qubit 1 with X before entangling with CNOT.',
      explanation: 'Starting with |00⟩: H on q0 gives (|00⟩+|10⟩)/√2. X on q1 gives (|01⟩+|11⟩)/√2. CNOT(q0, q1) flips q1 when q0 is 1, yielding (|01⟩+|10⟩)/√2 = |Ψ⁺⟩.'
    },
    {
      id: 'ch4-coding-1',
      type: 'bug_hunt',
      phase: 'coding',
      conceptId: 'bell_measurement_bug',
      conceptName: 'Premature Measurement of Entangled Pair',
      difficulty: 2,
      prompt: 'Identify the line in this Qiskit code where premature measurement destroys the entanglement before the state can be used.',
      codeSnippet: '1: qc = QuantumCircuit(2, 2)\n2: qc.h(0)\n3: qc.measure(0, 0)  # Check control qubit\n4: qc.cx(0, 1)      # Attempt to entangle\n5: qc.measure(1, 1)',
      lines: [
        { id: 'b1', lineNumber: 2, code: 'qc.h(0)', isBuggy: false },
        { id: 'b2', lineNumber: 3, code: 'qc.measure(0, 0)  # Check control qubit', isBuggy: true },
        { id: 'b3', lineNumber: 4, code: 'qc.cx(0, 1)      # Attempt to entangle', isBuggy: false },
        { id: 'b4', lineNumber: 5, code: 'qc.measure(1, 1)', isBuggy: false }
      ],
      buggyLineId: 'b2',
      rootCause: 'Measuring qubit 0 at line 3 collapses its superposition to |0⟩ or |1⟩, turning the subsequent CNOT into classical conditional branching rather than creating quantum entanglement.',
      fixDescription: 'Remove line 3. Qubit 0 must remain in coherent quantum superposition when the CNOT is applied to establish entanglement.',
      hint: 'Measurement causes wave-function collapse into classical computational basis states.',
      explanation: 'Applying measurement collapses the coherent state (|0⟩+|1⟩)/√2 into classical 0 or 1. Any subsequent gates operate on a classical mixture rather than generating an entangled quantum state.'
    }
  ],

  // CHAPTER 5 (Complexity: Level 2 - Intermediate Circuits)
  'ch-5': [
    {
      id: 'ch5-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'superdense_coding_capacity',
      conceptName: 'Superdense Coding Channel Capacity',
      difficulty: 2,
      prompt: 'In Superdense Coding, how many classical bits can Alice transmit to Bob by physically sending only a single qubit, assuming they pre-share one entangled Bell pair?',
      options: [
        { id: 'a', label: '2 classical bits', distractorFeedback: 'Correct! 1 qubit + 1 pre-shared Bell pair transmits 2 classical bits.' },
        { id: 'b', label: '1 classical bit', distractorFeedback: '1 classical bit is the Holevo bound for unentangled qubits.' },
        { id: 'c', label: 'Infinite bits because quantum states are continuous', distractorFeedback: 'Holevo theorem limits accessible information without entanglement.' },
        { id: 'd', label: '4 classical bits', distractorFeedback: '4 orthogonal Bell states can be distinguished, representing log2(4) = 2 bits.' }
      ],
      correctId: 'a',
      hint: 'Alice can apply one of 4 local unitary operations (I, X, Z, XZ) to transform the Bell state into 4 mutually orthogonal states.',
      explanation: 'By applying I, X, Z, or XZ to her single qubit, Alice maps the joint state to one of the 4 orthogonal Bell states. Bob then performs a joint Bell measurement to decode 2 classical bits.'
    },
    {
      id: 'ch5-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'superdense_encoding',
      conceptName: 'Superdense Coding Bitstring "11" Encoding',
      difficulty: 2,
      prompt: 'Alice wants to transmit message "11" to Bob using Superdense Coding. Alice must apply Pauli-Z followed by Pauli-X to her qubit (q0). Build this encoding circuit.',
      numQubits: 1,
      allowedGates: ['Z', 'X', 'H'],
      initialStateDescription: 'Alice holds qubit q0 from the pre-shared Bell pair (|00⟩+|11⟩)/√2.',
      targetOutcomeDescription: 'Applies Z then X to transform (|00⟩+|11⟩)/√2 into (|01⟩−|10⟩)/√2.',
      targetProbabilities: { '1': 1.0 },
      solutionCircuit: [
        { qubit: 0, gate: 'Z' },
        { qubit: 0, gate: 'X' }
      ],
      hint: 'Apply Z to introduce relative phase π, then X to flip the bit value.',
      explanation: 'In superdense coding: message "00" is I, "01" is X, "10" is Z, and "11" is ZX. Applying Z then X prepares the singlet state |Ψ⁻⟩.'
    },
    {
      id: 'ch5-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'teleportation',
      conceptName: 'Quantum Teleportation Protocol',
      difficulty: 3,
      prompt: 'Arrange the 4 steps of the Quantum Teleportation protocol in the correct operational sequence.',
      language: 'algorithm',
      scrambledLines: [
        { id: 't1', code: '1. Alice and Bob establish a shared Bell pair (|00⟩+|11⟩)/√2', indentation: 0 },
        { id: 't2', code: '2. Alice performs Bell state measurement on unknown state |ψ⟩ and her half of the pair', indentation: 0 },
        { id: 't3', code: '3. Alice transmits 2 classical bits of measurement results to Bob via phone/internet', indentation: 0 },
        { id: 't4', code: '4. Bob applies conditional Pauli corrections (X^m1 · Z^m0) to reconstruct |ψ⟩', indentation: 0 }
      ],
      correctOrderIds: ['t1', 't2', 't3', 't4'],
      hint: 'Entanglement is established first, followed by Bell measurement, classical transmission, and unitary correction.',
      explanation: 'Teleportation requires: 1) Pre-shared Bell state, 2) Joint Bell measurement, 3) Classical transmission of 2 bits, and 4) Unitary recovery by Bob.'
    }
  ],

  // CHAPTER 6 (Complexity: Level 3 - Advanced Algorithms)
  'ch-6': [
    {
      id: 'ch6-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'deutsch_jozsa',
      conceptName: 'Deutsch-Jozsa Query Complexity',
      difficulty: 2,
      prompt: 'How many oracle queries does the quantum Deutsch-Jozsa algorithm require to determine whether an n-bit Boolean function is constant or balanced, compared to the classical deterministic worst-case?',
      options: [
        { id: 'a', label: 'Quantum: 1 query; Classical: 2^(n-1) + 1 queries', distractorFeedback: 'Correct! Exponential separation in deterministic query complexity.' },
        { id: 'b', label: 'Quantum: n queries; Classical: 2^n queries', distractorFeedback: 'Quantum accomplishes it in a single evaluation via phase kickback!' },
        { id: 'c', label: 'Both require 2 queries', distractorFeedback: 'Classical deterministic requires sampling more than half the domain.' },
        { id: 'd', label: 'Quantum requires √N queries', distractorFeedback: '√N is Grover search complexity, not Deutsch-Jozsa.' }
      ],
      correctId: 'a',
      hint: 'Deutsch-Jozsa demonstrates exponential query advantage using just one quantum query.',
      explanation: 'Deutsch-Jozsa determines if f is constant or balanced in exactly 1 quantum query using quantum parallelism and interference, whereas classical requires 2^(n-1) + 1 evaluations.'
    },
    {
      id: 'ch6-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'phase_kickback_oracle',
      conceptName: 'Phase Kickback Ancilla Preparation',
      difficulty: 2,
      prompt: 'To enable phase kickback in Deutsch-Jozsa or Bernstein-Vazirani, the target ancilla qubit must be prepared in state |−⟩ = (|0⟩ − |1⟩)/√2. Build the circuit on wire q0 from |0⟩.',
      numQubits: 1,
      allowedGates: ['X', 'H', 'Z'],
      initialStateDescription: 'Target ancilla q0 starts in |0⟩.',
      targetOutcomeDescription: 'State |−⟩ which kicks back eigenvalue (-1)^f(x) to the control register.',
      targetProbabilities: { '0': 0.5, '1': 0.5 },
      solutionCircuit: [
        { qubit: 0, gate: 'X' },
        { qubit: 0, gate: 'H' }
      ],
      hint: 'Flip to |1⟩ with X, then rotate with H: H|1⟩ = |−⟩.',
      explanation: 'Applying X maps |0⟩ → |1⟩. Applying H maps |1⟩ → (|0⟩ − |1⟩)/√2 = |−⟩. When an oracle acts on |−⟩, it flips the phase: U_f|x⟩|−⟩ = (-1)^f(x)|x⟩|−⟩.'
    },
    {
      id: 'ch6-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'bernstein_vazirani',
      conceptName: 'Bernstein-Vazirani Secret String Algorithm',
      difficulty: 3,
      prompt: 'Arrange the Qiskit code sequence for the Bernstein-Vazirani algorithm to recover secret bitstring s in 1 query.',
      language: 'qiskit',
      scrambledLines: [
        { id: 'bv1', code: 'qc = QuantumCircuit(n + 1, n)', indentation: 0 },
        { id: 'bv2', code: 'qc.x(n); qc.h(range(n + 1))  # Initialize input in |+⟩ and ancilla in |−⟩', indentation: 0 },
        { id: 'bv3', code: 'apply_inner_product_oracle(qc, secret_s)  # Phase kickback', indentation: 0 },
        { id: 'bv4', code: 'qc.h(range(n))  # Interference restores secret string', indentation: 0 },
        { id: 'bv5', code: 'qc.measure(range(n), range(n))', indentation: 0 }
      ],
      correctOrderIds: ['bv1', 'bv2', 'bv3', 'bv4', 'bv5'],
      hint: 'Hadamard sandwich: H before the oracle to create superposition, and H after the oracle to reconstruct the secret string.',
      explanation: 'The Bernstein-Vazirani algorithm initializes n+1 qubits, applies Hadamards, queries the oracle to kick back phases (-1)^(s·x), applies final Hadamards, and measures s with 100% certainty.'
    }
  ],

  // CHAPTER 7 (Complexity: Level 3 - Advanced Algorithms)
  'ch-7': [
    {
      id: 'ch7-mcq-1',
      type: 'calculation',
      phase: 'mcq',
      conceptId: 'grover_iterations',
      conceptName: 'Optimal Grover Iterations Calculation',
      difficulty: 3,
      prompt: 'For an unstructured search space of N = 64 items with M = 1 marked item, calculate the optimal number of Grover iterations R ≈ (π/4)·√(N/M) rounded to the nearest whole integer.',
      targetValue: 6,
      tolerance: 0.1,
      unit: 'iterations',
      stepByStepSolution: [
        '1. Compute √(N/M) = √(64/1) = 8',
        '2. Multiply by π/4: 8 · (3.14159 / 4) = 2 · 3.14159 = 6.28',
        '3. Round to the nearest integer: 6 iterations'
      ],
      hint: 'Substitute N = 64 into (π/4) * √N and round.',
      explanation: 'R = (π/4) · √64 = (π/4) · 8 = 2π ≈ 6.28. The optimal discrete number of Grover oracle + diffusion cycles is 6.'
    },
    {
      id: 'ch7-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'grover_diffusion_2q',
      conceptName: 'Grover 2-Qubit Diffusion Operator',
      difficulty: 3,
      prompt: 'Construct the 2-qubit Grover Diffusion Operator (inversion about the mean) on qubits q0 and q1. Sequence: H on both wires, X on both wires, CZ between them, X on both wires, and H on both wires.',
      numQubits: 2,
      allowedGates: ['H', 'X', 'CZ'],
      initialStateDescription: 'Qubits start after oracle phase inversion.',
      targetOutcomeDescription: 'Diffusion amplifies amplitude of the marked state.',
      targetProbabilities: { '00': 1.0 },
      solutionCircuit: [
        { qubit: 0, gate: 'H' },
        { qubit: 1, gate: 'H' },
        { qubit: 0, gate: 'X' },
        { qubit: 1, gate: 'X' },
        { qubit: 0, gate: 'CZ', targetQubit: 1 },
        { qubit: 0, gate: 'X' },
        { qubit: 1, gate: 'X' },
        { qubit: 0, gate: 'H' },
        { qubit: 1, gate: 'H' }
      ],
      hint: 'The diffusion operator is 2|s⟩⟨s| - I, implemented as H · X · CZ · X · H.',
      explanation: 'The Grover diffusion operator reflects amplitudes around the average amplitude. For 2 qubits, H-X-CZ-X-H implements the reflection about the uniform superposition |s⟩.'
    },
    {
      id: 'ch7-coding-1',
      type: 'bug_hunt',
      phase: 'coding',
      conceptId: 'grover_overrotation',
      conceptName: 'Grover Over-Rotation Bug',
      difficulty: 3,
      prompt: 'Inspect this Python loop for a 4-qubit Grover search (N=16, M=1, optimal R=3). Identify the line containing an error that causes amplitude over-rotation.',
      codeSnippet: '1: # Searching N=16 with M=1; optimal R = round(pi/4 * sqrt(16)) = 3\n2: optimal_iterations = 3\n3: for iteration in range(10):  # Running more iterations for better accuracy\n4:     oracle(qc)\n5:     diffuser(qc)',
      lines: [
        { id: 'g1', lineNumber: 2, code: 'optimal_iterations = 3', isBuggy: false },
        { id: 'g2', lineNumber: 3, code: 'for iteration in range(10):  # Running more iterations for better accuracy', isBuggy: true },
        { id: 'g3', lineNumber: 4, code: '    oracle(qc)', isBuggy: false },
        { id: 'g4', lineNumber: 5, code: '    diffuser(qc)', isBuggy: false }
      ],
      buggyLineId: 'g2',
      rootCause: 'Quantum Grover search is a geometric rotation in 2D state space, not a monotonic classical iterative solver. Running 10 iterations rotates the statevector past the target, dropping success probability near 0%.',
      fixDescription: 'Replace range(10) with range(optimal_iterations). Grover search must terminate at R ≈ (π/4)·√(N/M).',
      hint: 'What happens when a vector in a plane rotates past its target angle?',
      explanation: 'Grover search rotates the state in 2D subspace by 2θ per iteration. Overshooting the target (over-rotation) decreases probability back towards 0.'
    }
  ],

  // CHAPTER 8 (Complexity: Level 3 - Advanced Algorithms)
  'ch-8': [
    {
      id: 'ch8-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'vqe_nisq',
      conceptName: 'Variational Quantum Eigensolver (VQE)',
      difficulty: 2,
      prompt: 'Why is VQE categorized as a hybrid quantum-classical algorithm tailored for NISQ hardware?',
      options: [
        { id: 'a', label: 'The quantum processor prepares the ansatz state and measures expectation values, while a classical optimizer updates parameter angles.', distractorFeedback: 'Correct! Shallow circuit depth minimizes decoherence on noisy hardware.' },
        { id: 'b', label: 'The classical computer runs all quantum gates while the QPU only logs temperature', distractorFeedback: 'The QPU executes the parameterized quantum state.' },
        { id: 'c', label: 'VQE requires fault-tolerant logical qubits with surface code correction', distractorFeedback: 'VQE is specifically designed for noisy, uncorrected NISQ processors.' },
        { id: 'd', label: 'VQE guarantees exact polynomial speedup for NP-complete problems', distractorFeedback: 'VQE is heuristic; convergence guarantees depend on landscape and ansatz.' }
      ],
      correctId: 'a',
      hint: 'Think about which tasks run on the quantum chip and which on the classical computer.',
      explanation: 'VQE evaluates ⟨ψ(θ)|H|ψ(θ)⟩ on the QPU with shallow circuits, then offloads gradient computation and parameter updates θ ← θ − η∇E to a classical CPU.'
    },
    {
      id: 'ch8-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'vqe_ansatz',
      conceptName: 'Hardware-Efficient Ansatz Layer',
      difficulty: 2,
      prompt: 'Build a 2-qubit hardware-efficient ansatz layer: Apply Hadamard to both wires to create superposition, then apply CNOT(q0, q1) to generate entanglement.',
      numQubits: 2,
      allowedGates: ['H', 'CNOT', 'X'],
      initialStateDescription: '2 qubits initialized in |00⟩.',
      targetOutcomeDescription: 'Superposition followed by entangling layer.',
      targetProbabilities: { '00': 0.5, '11': 0.5 },
      solutionCircuit: [
        { qubit: 0, gate: 'H' },
        { qubit: 1, gate: 'H' },
        { qubit: 0, gate: 'CNOT', targetQubit: 1 }
      ],
      hint: 'Single-qubit rotation layer followed by entangling CNOT operator.',
      explanation: 'Variational algorithms alternate parameterized single-qubit rotations with entangling gates like CNOT to explore the relevant Hilbert subspace.'
    },
    {
      id: 'ch8-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'vqe_optimization_loop',
      conceptName: 'VQE Classical-Quantum Optimization Loop',
      difficulty: 3,
      prompt: 'Arrange the Python pseudocode steps of a VQE ground state energy estimation loop.',
      language: 'algorithm',
      scrambledLines: [
        { id: 'v1', code: '1. Initialize parameterized ansatz circuit qc(theta)', indentation: 0 },
        { id: 'v2', code: '2. Execute circuit on QPU and estimate expectation value <H>', indentation: 0 },
        { id: 'v3', code: '3. Classical optimizer evaluates loss and computes parameter gradient', indentation: 0 },
        { id: 'v4', code: '4. Update parameter angles theta until convergence to ground energy', indentation: 0 }
      ],
      correctOrderIds: ['v1', 'v2', 'v3', 'v4'],
      hint: 'Ansatz preparation → QPU measurement → Classical gradient computation → Parameter update.',
      explanation: 'The standard VQE cycle: parameterize quantum ansatz, measure expectation values, compute classical gradient step, and update parameters.'
    }
  ],

  // CHAPTER 9 (Complexity: Level 4 - Mastery & Hardware)
  'ch-9': [
    {
      id: 'ch9-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'bb84_qkd',
      conceptName: 'BB84 Eavesdropping Detection',
      difficulty: 2,
      prompt: 'In the BB84 Quantum Key Distribution protocol, why does an eavesdropper (Eve) intercepting photons inevitably introduce errors into Alice and Bob’s sifted key?',
      options: [
        { id: 'a', label: 'By the No-Cloning Theorem and state collapse, measuring in the wrong basis introduces a 25% Quantum Bit Error Rate (QBER).', distractorFeedback: 'Correct! Eavesdropping alters non-orthogonal quantum states.' },
        { id: 'b', label: 'Eve’s classical internet connection slows down the photon speed', distractorFeedback: 'Photons travel at the speed of light in fiber.' },
        { id: 'c', label: 'The photons bounce off Alice’s detector and alert Bob', distractorFeedback: 'Security relies on the impossibility of non-disturbing quantum measurements.' },
        { id: 'd', label: 'Because QKD requires pre-shared AES-256 keys', distractorFeedback: 'QKD generates fresh symmetric key material using physics laws.' }
      ],
      correctId: 'a',
      hint: 'What happens when you measure a state in the X basis if it was prepared in the Z basis?',
      explanation: 'Unknown quantum states cannot be cloned without disturbance. When Eve guesses the wrong basis, she projects the state into that basis, introducing an unmistakable 25% error rate on intercepted bits.'
    },
    {
      id: 'ch9-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'bb84_basis_measurement',
      conceptName: 'BB84 Hadamard Basis Rotation for Measurement',
      difficulty: 2,
      prompt: 'Bob receives a photon prepared in the X basis (|+⟩ or |−⟩). To measure in the X basis using a standard Z-basis detector, what gate must Bob apply before measuring?',
      numQubits: 1,
      allowedGates: ['H', 'X', 'Z'],
      initialStateDescription: 'State in X-basis (|+) = (|0>+|1>)/√2).',
      targetOutcomeDescription: 'Rotated to Z basis: H|+⟩ = |0⟩ with 100% deterministic detection.',
      targetProbabilities: { '0': 1.0 },
      solutionCircuit: [{ qubit: 0, gate: 'H' }],
      hint: 'Hadamard rotates the X basis back to the computational Z basis.',
      explanation: 'Since physical detectors measure along the computational Z axis, applying a Hadamard gate maps the X-basis states |+⟩ and |−⟩ back to |0⟩ and |1⟩.'
    },
    {
      id: 'ch9-coding-1',
      type: 'bug_hunt',
      phase: 'coding',
      conceptId: 'qkd_sifting_bug',
      conceptName: 'BB84 Key Sifting Filter Logic',
      difficulty: 3,
      prompt: 'Identify the line in this BB84 key sifting code where Bob incorrectly includes bits where bases did not match.',
      codeSnippet: '1: sifted_key = []\n2: for a_basis, b_basis, a_bit, b_bit in zip(alice_bases, bob_bases, alice_bits, bob_bits):\n3:     if a_basis != b_basis:  # Keep matching basis results\n4:         sifted_key.append(b_bit)',
      lines: [
        { id: 's1', lineNumber: 2, code: 'for a_basis, b_basis, a_bit, b_bit in zip(alice_bases, bob_bases, alice_bits, bob_bits):', isBuggy: false },
        { id: 's2', lineNumber: 3, code: '    if a_basis != b_basis:  # Keep matching basis results', isBuggy: true },
        { id: 's3', lineNumber: 4, code: '        sifted_key.append(b_bit)', isBuggy: false }
      ],
      buggyLineId: 's2',
      rootCause: 'Line 3 uses != instead of ==. Alice and Bob must discard all events where bases differed and retain only events where a_basis == b_basis.',
      fixDescription: 'Change `if a_basis != b_basis:` to `if a_basis == b_basis:`. Non-matching bases yield uncorrelated random bits.',
      hint: 'In BB84 sifting, do Alice and Bob keep bits where they picked the same basis or different bases?',
      explanation: 'In BB84 key sifting, only trials where Alice and Bob coincidentally chose identical measurement bases (a_basis == b_basis) are correlated and kept.'
    }
  ],

  // CHAPTER 10 (Complexity: Level 4 - Mastery & Hardware)
  'ch-10': [
    {
      id: 'ch10-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'quantum_error_correction',
      conceptName: 'Syndrome Measurement Non-Destructiveness',
      difficulty: 3,
      prompt: 'In Quantum Error Correction (e.g. 3-qubit bit-flip code), how do stabilizer syndrome measurements detect errors without collapsing the encoded logical superposition α|0_L⟩ + β|1_L⟩?',
      options: [
        { id: 'a', label: 'Syndrome measurements measure joint parity operators (Z₁Z₂, Z₂Z₃) using ancilla qubits, extracting error location without revealing α or β.', distractorFeedback: 'Correct! Parity measurement diagnoses the error syndrome while keeping logical information encoded.' },
        { id: 'b', label: 'The code simply makes 3 classical copies of α and β', distractorFeedback: 'No-Cloning prohibits duplicating unknown quantum amplitudes α and β.' },
        { id: 'c', label: 'The errors are removed by cooling the chip to absolute zero', distractorFeedback: 'Thermal fluctuations are only one source of noise; phase damping still occurs.' },
        { id: 'd', label: 'Syndrome measurements measure all data qubits in the Z basis', distractorFeedback: 'Measuring data qubits directly collapses the logical state to classical 0 or 1.' }
      ],
      correctId: 'a',
      hint: 'Syndrome extraction asks: "Are the two qubits in the same state?", not "Which state are they in?".',
      explanation: 'Stabilizer measurements probe eigenvalue parities (e.g. Z⊗Z) through ancillas. This reveals whether a bit-flip occurred between qubits without collapsing the superposition of amplitudes α and β.'
    },
    {
      id: 'ch10-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'bit_flip_code_encoder',
      conceptName: '3-Qubit Bit-Flip Code Encoder',
      difficulty: 3,
      prompt: 'Build the 3-qubit repetition encoding circuit: Entangle data qubit q0 with ancilla qubits q1 and q2 using two CNOT gates targeting q1 and q2.',
      numQubits: 3,
      allowedGates: ['CNOT', 'X', 'H'],
      initialStateDescription: 'Data qubit q0 in |0⟩, ancillas q1 and q2 in |0⟩.',
      targetOutcomeDescription: 'Encodes state |0⟩ into logical state |000⟩.',
      targetProbabilities: { '000': 1.0 },
      solutionCircuit: [
        { qubit: 0, gate: 'CNOT', targetQubit: 1 },
        { qubit: 0, gate: 'CNOT', targetQubit: 2 }
      ],
      hint: 'CNOT from q0 to q1, followed by CNOT from q0 to q2.',
      explanation: 'Applying CNOT(0, 1) and CNOT(0, 2) maps α|0⟩+β|1⟩ into α|000⟩+β|111⟩, providing logical redundancy against single bit-flip errors.'
    },
    {
      id: 'ch10-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'syndrome_correction_logic',
      conceptName: '3-Qubit Bit-Flip Syndrome Correction Routine',
      difficulty: 3,
      prompt: 'Arrange the conditional error recovery statements for a 3-qubit bit-flip code syndrome (s1, s2).',
      language: 'algorithm',
      scrambledLines: [
        { id: 'ec1', code: 'if s1 == 1 and s2 == 0:  # Error on qubit 0', indentation: 0 },
        { id: 'ec2', code: '    qc.x(0)  # Apply bit-flip correction to q0', indentation: 1 },
        { id: 'ec3', code: 'elif s1 == 1 and s2 == 1:  # Error on qubit 1', indentation: 0 },
        { id: 'ec4', code: '    qc.x(1)  # Apply bit-flip correction to q1', indentation: 1 },
        { id: 'ec5', code: 'elif s1 == 0 and s2 == 1:  # Error on qubit 2', indentation: 0 },
        { id: 'ec6', code: '    qc.x(2)  # Apply bit-flip correction to q2', indentation: 1 }
      ],
      correctOrderIds: ['ec1', 'ec2', 'ec3', 'ec4', 'ec5', 'ec6'],
      hint: 'Syndrome (1,0) indicates q0 flip; (1,1) indicates middle qubit q1 flip; (0,1) indicates q2 flip.',
      explanation: 'Stabilizer syndromes uniquely identify the single error location: s1=Z0Z1 flags discrepancy between q0 and q1; s2=Z1Z2 flags discrepancy between q1 and q2.'
    }
  ],

  // CHAPTER 11 (Complexity: Level 4 - Mastery & Hardware)
  'ch-11': [
    {
      id: 'ch11-mcq-1',
      type: 'mcq',
      phase: 'mcq',
      conceptId: 'quantum_advantage',
      conceptName: 'Quantum Advantage & Real-World Horizons',
      difficulty: 2,
      prompt: 'Which industrial application domain is widely anticipated by researchers to demonstrate practical quantum utility first, even before fault-tolerant Shor factorization is realized?',
      options: [
        { id: 'a', label: 'Quantum chemistry and materials simulation (e.g. FeMoco nitrogenase catalyst, lithium-metal batteries)', distractorFeedback: 'Correct! Simulating quantum fermionic systems natively avoids exponential Hilbert space blowup.' },
        { id: 'b', label: 'Replacing all classical databases for SQL queries', distractorFeedback: 'Quantum memory overhead makes classical SQL databases vastly superior for classical data retrieval.' },
        { id: 'c', label: 'Instantaneous internet transmission across galaxies', distractorFeedback: 'No-Signaling theorem prevents faster-than-light communication.' },
        { id: 'd', label: 'Running Word and Excel with infinite RAM', distractorFeedback: 'General purpose classical computing is not where quantum exhibits exponential advantage.' }
      ],
      correctId: 'a',
      hint: 'Nature is quantum; simulating molecules on classical computers requires intractable matrix dimensions.',
      explanation: 'As Feynman famously noted: "Nature isn’t classical, dammit, and if you want to make a simulation of nature, you’d better make it quantum mechanical!" Simulating molecular Hamiltonians has direct commercial ROI.'
    },
    {
      id: 'ch11-circuit-1',
      type: 'circuit_builder',
      phase: 'circuit',
      conceptId: 'qiskit_transpiled_bell',
      conceptName: 'Hardware Native Gate Transpilation',
      difficulty: 3,
      prompt: 'On native superconducting hardware, the Hadamard gate is synthesized using Pauli-X and Phase rotations. Prepare state |1⟩ using a single Pauli-X gate on wire q0.',
      numQubits: 1,
      allowedGates: ['X', 'Z', 'H'],
      initialStateDescription: 'Hardware qubit 0 initialized in |0⟩.',
      targetOutcomeDescription: 'Native X gate flips qubit into |1⟩.',
      targetProbabilities: { '1': 1.0 },
      solutionCircuit: [{ qubit: 0, gate: 'X' }],
      hint: 'Apply the single native bit-flip operator.',
      explanation: 'QPU transpilers map abstract unitary circuits into native basis sets (e.g. {ECR, RZ, SX, X} on IBM quantum processors).'
    },
    {
      id: 'ch11-coding-1',
      type: 'parsons',
      phase: 'coding',
      conceptId: 'qiskit1_runtime_sampler',
      conceptName: 'Qiskit 1.0+ Runtime SamplerV2 Workflow',
      difficulty: 3,
      prompt: 'Arrange the modern Qiskit 1.0+ code lines to transpile a circuit and execute it using the modern SamplerV2 primitive.',
      language: 'qiskit',
      scrambledLines: [
        { id: 'r1', code: 'from qiskit_ibm_runtime import SamplerV2 as Sampler', indentation: 0 },
        { id: 'r2', code: 'from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager', indentation: 0 },
        { id: 'r3', code: 'pm = generate_preset_pass_manager(backend=backend, optimization_level=3)', indentation: 0 },
        { id: 'r4', code: 'isa_circuit = pm.run(qc)  # Convert to Instruction Set Architecture', indentation: 0 },
        { id: 'r5', code: 'job = Sampler(backend).run([isa_circuit])', indentation: 0 }
      ],
      correctOrderIds: ['r1', 'r2', 'r3', 'r4', 'r5'],
      hint: 'Qiskit 1.0 requires compiling to ISA circuits using generate_preset_pass_manager before executing via SamplerV2.',
      explanation: 'In modern Qiskit 1.0+, circuits must be transformed into Instruction Set Architecture (ISA) circuits using pass managers before dispatching to SamplerV2.'
    },
    {
      id: 'ch11-coding-2',
      type: 'bug_hunt',
      phase: 'coding',
      conceptId: 'qiskit1_deprecated_execute',
      conceptName: 'Qiskit 1.0 Legacy `execute()` Deprecation Bug',
      difficulty: 3,
      prompt: 'Identify the line in this script containing a deprecated Qiskit 0.x function that causes an ImportError in modern Qiskit 1.0+.',
      codeSnippet: '1: from qiskit import QuantumCircuit\n2: from qiskit_aer import AerSimulator\n3: qc = QuantumCircuit(2, 2)\n4: job = execute(qc, AerSimulator())  # Legacy execution API\n5: result = job.result()',
      lines: [
        { id: 'd1', lineNumber: 2, code: 'from qiskit_aer import AerSimulator', isBuggy: false },
        { id: 'd2', lineNumber: 3, code: 'qc = QuantumCircuit(2, 2)', isBuggy: false },
        { id: 'd3', lineNumber: 4, code: 'job = execute(qc, AerSimulator())  # Legacy execution API', isBuggy: true },
        { id: 'd4', lineNumber: 5, code: 'result = job.result()', isBuggy: false }
      ],
      buggyLineId: 'd3',
      rootCause: 'The top-level `execute()` function was completely removed in Qiskit 1.0. Modern Qiskit requires `backend.run(transpile(qc, backend))` or Runtime Primitives (SamplerV2/EstimatorV2).',
      fixDescription: 'Replace `execute(qc, backend)` with `backend.run(qc)` or modern Qiskit Runtime Primitives.',
      hint: 'Look for the legacy top-level wrapper function that was deprecated and removed in Qiskit 1.0.',
      explanation: 'In Qiskit 1.0, the monolithic `execute()` helper was removed. Code must use transpiler pipelines with `backend.run()` or modern Runtime Primitives.'
    }
  ]
};

// ---------------------------------------------------------------------------
// 3. ADAPTIVE PRACTICE POOL (All questions ordered across difficulties)
// ---------------------------------------------------------------------------
export const adaptivePracticePool: AssessmentQuestion[] = [
  ...diagnosticQuestions,
  ...Object.values(chapterMasteryQuestions).flat()
];

// Helper to filter chapter questions by specific phase
export const getChapterPhaseQuestions = (
  chapterId: string,
  phase: AssessmentPhase
): AssessmentQuestion[] => {
  const pool = chapterMasteryQuestions[chapterId] || [];
  return pool.filter((q) => q.phase === phase);
};

// Helper to get questions for an assessment config with optional phase filter
export const getQuestionsForAssessment = (
  assessmentId: string,
  phaseFilter?: AssessmentPhase | 'all'
): AssessmentQuestion[] => {
  if (assessmentId === 'diagnostic-placement') {
    if (phaseFilter && phaseFilter !== 'all') {
      return diagnosticQuestions.filter((q) => q.phase === phaseFilter);
    }
    return diagnosticQuestions;
  }

  if (assessmentId === 'adaptive-daily-workout') {
    if (phaseFilter && phaseFilter !== 'all') {
      return adaptivePracticePool.filter((q) => q.phase === phaseFilter).slice(0, 5);
    }
    return adaptivePracticePool.slice(0, 5);
  }

  // Check if assessmentId ends with -mcq, -circuit, -coding
  if (assessmentId.endsWith('-mcq')) {
    const chapterId = assessmentId.replace('-mcq', '');
    return getChapterPhaseQuestions(chapterId, 'mcq');
  }
  if (assessmentId.endsWith('-circuit')) {
    const chapterId = assessmentId.replace('-circuit', '');
    return getChapterPhaseQuestions(chapterId, 'circuit');
  }
  if (assessmentId.endsWith('-coding')) {
    const chapterId = assessmentId.replace('-coding', '');
    return getChapterPhaseQuestions(chapterId, 'coding');
  }
  if (assessmentId.endsWith('-mastery')) {
    const chapterId = assessmentId.replace('-mastery', '');
    const allQuestions = chapterMasteryQuestions[chapterId] || [];
    if (phaseFilter && phaseFilter !== 'all') {
      return allQuestions.filter((q) => q.phase === phaseFilter);
    }
    return allQuestions;
  }

  return adaptivePracticePool.slice(0, 5);
};

// ---------------------------------------------------------------------------
// 4. ASSESSMENT CONFIGS CATALOG
// (Includes Diagnostic, 11 Comprehensive Mastery tracks, and 33 Dedicated Phased Tests)
// ---------------------------------------------------------------------------
export const ASSESSMENT_CONFIGS: AssessmentConfig[] = [
  // DIAGNOSTIC
  {
    id: 'diagnostic-placement',
    title: 'Adaptive Diagnostic Placement Exam',
    kind: 'DIAGNOSTIC',
    phase: 'all',
    summary: 'Comprehensive multi-modal diagnostic evaluating Math, Qubits, Superposition, Entanglement, and Qiskit bug diagnosis. Sets your baseline BKT mastery.',
    questionsCount: 5,
    estimatedMinutes: 8,
    conceptIds: ['math_foundations', 'born_rule', 'superposition', 'entanglement', 'measurement_collapse']
  },

  // CHAPTER 1 (Complexity: Level 1)
  {
    id: 'ch-1-mcq',
    title: 'Chapter 1: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-1',
    chapterNumber: 1,
    complexityLevel: 1,
    summary: 'Evaluate theoretical comprehension of complex vector spaces, Dirac Bra-Ket algebra, and unitary probability conservation.',
    questionsCount: 2,
    estimatedMinutes: 3,
    conceptIds: ['linear_algebra', 'inner_product']
  },
  {
    id: 'ch-1-circuit',
    title: 'Chapter 1: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-1',
    chapterNumber: 1,
    complexityLevel: 1,
    summary: 'Interactive quantum gate builder: construct Pauli-X bit flip circuit on single qubit wire.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['pauli_x']
  },
  {
    id: 'ch-1-coding',
    title: 'Chapter 1: Quantum Coding & Setup',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-1',
    chapterNumber: 1,
    complexityLevel: 1,
    summary: 'Parson’s puzzle: assemble valid Qiskit circuit initialization and measurement code blocks.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['qiskit_initialization']
  },
  {
    id: 'ch-1-mastery',
    title: 'Chapter 1: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-1',
    chapterNumber: 1,
    complexityLevel: 1,
    summary: 'Sequential 3-Phase Evaluation: Conceptual MCQ → Circuit Studio → Qiskit Code Sequencing.',
    questionsCount: 4,
    estimatedMinutes: 8,
    conceptIds: ['linear_algebra', 'inner_product', 'pauli_x', 'qiskit_initialization']
  },

  // CHAPTER 2 (Complexity: Level 1)
  {
    id: 'ch-2-mcq',
    title: 'Chapter 2: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-2',
    chapterNumber: 2,
    complexityLevel: 1,
    summary: 'Bloch sphere geometry, polar/azimuthal angles, and Born rule relative phase calculations.',
    questionsCount: 2,
    estimatedMinutes: 4,
    conceptIds: ['bloch_sphere', 'born_rule_phase']
  },
  {
    id: 'ch-2-circuit',
    title: 'Chapter 2: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-2',
    chapterNumber: 2,
    complexityLevel: 1,
    summary: 'Synthesize equal superposition state |+⟩ using Hadamard gate on wire q0.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['hadamard_superposition']
  },
  {
    id: 'ch-2-coding',
    title: 'Chapter 2: Quantum Coding & Bug Hunt',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-2',
    chapterNumber: 2,
    complexityLevel: 1,
    summary: 'Socratic Bug Hunt: diagnose and fix the classical coin-flip fallacy in consecutive Hadamards.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['mc01_classical_prob']
  },
  {
    id: 'ch-2-mastery',
    title: 'Chapter 2: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-2',
    chapterNumber: 2,
    complexityLevel: 1,
    summary: 'Sequential 3-Phase Evaluation: Theory & Born Rule → Hadamard Circuit → Interference Bug Hunt.',
    questionsCount: 4,
    estimatedMinutes: 8,
    conceptIds: ['bloch_sphere', 'born_rule_phase', 'hadamard_superposition', 'mc01_classical_prob']
  },

  // CHAPTER 3 (Complexity: Level 2)
  {
    id: 'ch-3-mcq',
    title: 'Chapter 3: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-3',
    chapterNumber: 3,
    complexityLevel: 2,
    summary: 'Pauli operator relations, S & T gate roots, and non-commutativity.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['s_and_t_gates']
  },
  {
    id: 'ch-3-circuit',
    title: 'Chapter 3: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-3',
    chapterNumber: 3,
    complexityLevel: 2,
    summary: 'Build equatorial phase rotated state |−⟩ using Hadamard and Pauli-Z gates.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['phase_gates']
  },
  {
    id: 'ch-3-coding',
    title: 'Chapter 3: Quantum Coding & Assembly',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-3',
    chapterNumber: 3,
    complexityLevel: 2,
    summary: 'Parson’s puzzle: assemble 2-qubit CNOT reversible logic circuit in Qiskit.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['cnot_reversible_logic']
  },
  {
    id: 'ch-3-mastery',
    title: 'Chapter 3: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-3',
    chapterNumber: 3,
    complexityLevel: 2,
    summary: 'Sequential 3-Phase Evaluation: S/T Relations → Phase Gate Circuit → CNOT Code Assembly.',
    questionsCount: 3,
    estimatedMinutes: 7,
    conceptIds: ['s_and_t_gates', 'phase_gates', 'cnot_reversible_logic']
  },

  // CHAPTER 4 (Complexity: Level 2)
  {
    id: 'ch-4-mcq',
    title: 'Chapter 4: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-4',
    chapterNumber: 4,
    complexityLevel: 2,
    summary: 'Entanglement axioms, No-Signaling theorem, and density matrix tracing.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['entanglement_signaling']
  },
  {
    id: 'ch-4-circuit',
    title: 'Chapter 4: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-4',
    chapterNumber: 4,
    complexityLevel: 2,
    summary: 'Synthesize the entangled Bell state |Ψ⁺⟩ = (|01⟩+|10⟩)/√2 on 2 qubits.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['bell_state']
  },
  {
    id: 'ch-4-coding',
    title: 'Chapter 4: Quantum Coding & Bug Hunt',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-4',
    chapterNumber: 4,
    complexityLevel: 2,
    summary: 'Socratic Bug Hunt: identify and fix premature projective measurement in entangled pairs.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['bell_measurement_bug']
  },
  {
    id: 'ch-4-mastery',
    title: 'Chapter 4: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-4',
    chapterNumber: 4,
    complexityLevel: 2,
    summary: 'Sequential 3-Phase Evaluation: No-Signaling → Bell Pair Builder → Entanglement Bug Hunt.',
    questionsCount: 3,
    estimatedMinutes: 8,
    conceptIds: ['entanglement_signaling', 'bell_state', 'bell_measurement_bug']
  },

  // CHAPTER 5 (Complexity: Level 2)
  {
    id: 'ch-5-mcq',
    title: 'Chapter 5: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-5',
    chapterNumber: 5,
    complexityLevel: 2,
    summary: 'Superdense coding capacity and communication limits.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['superdense_coding_capacity']
  },
  {
    id: 'ch-5-circuit',
    title: 'Chapter 5: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-5',
    chapterNumber: 5,
    complexityLevel: 2,
    summary: 'Encode 2 classical bits ("11") into a shared entangled qubit using Pauli-Z and Pauli-X.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['superdense_encoding']
  },
  {
    id: 'ch-5-coding',
    title: 'Chapter 5: Quantum Coding & Teleportation',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-5',
    chapterNumber: 5,
    complexityLevel: 2,
    summary: 'Parson’s puzzle: order the complete 4-stage Quantum State Teleportation protocol.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['teleportation']
  },
  {
    id: 'ch-5-mastery',
    title: 'Chapter 5: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-5',
    chapterNumber: 5,
    complexityLevel: 2,
    summary: 'Sequential 3-Phase Evaluation: Superdense Theory → Encoder Circuit → Teleportation Protocol.',
    questionsCount: 3,
    estimatedMinutes: 8,
    conceptIds: ['superdense_coding_capacity', 'superdense_encoding', 'teleportation']
  },

  // CHAPTER 6 (Complexity: Level 3)
  {
    id: 'ch-6-mcq',
    title: 'Chapter 6: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-6',
    chapterNumber: 6,
    complexityLevel: 3,
    summary: 'Query complexity analysis: Deutsch-Jozsa quantum advantage vs classical bounds.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['deutsch_jozsa']
  },
  {
    id: 'ch-6-circuit',
    title: 'Chapter 6: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-6',
    chapterNumber: 6,
    complexityLevel: 3,
    summary: 'Construct the phase kickback ancilla preparation circuit |−⟩ for quantum oracles.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['phase_kickback_oracle']
  },
  {
    id: 'ch-6-coding',
    title: 'Chapter 6: Quantum Coding & Algorithms',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-6',
    chapterNumber: 6,
    complexityLevel: 3,
    summary: 'Parson’s puzzle: assemble Bernstein-Vazirani secret bitstring oracle execution sequence in Qiskit.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['bernstein_vazirani']
  },
  {
    id: 'ch-6-mastery',
    title: 'Chapter 6: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-6',
    chapterNumber: 6,
    complexityLevel: 3,
    summary: 'Sequential 3-Phase Evaluation: Query Complexity → Phase Kickback Circuit → BV Algorithm Code.',
    questionsCount: 3,
    estimatedMinutes: 8,
    conceptIds: ['deutsch_jozsa', 'phase_kickback_oracle', 'bernstein_vazirani']
  },

  // CHAPTER 7 (Complexity: Level 3)
  {
    id: 'ch-7-mcq',
    title: 'Chapter 7: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-7',
    chapterNumber: 7,
    complexityLevel: 3,
    summary: 'Calculate optimal Grover iterations R ≈ (π/4)·√(N/M) for quadratic speedup.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['grover_iterations']
  },
  {
    id: 'ch-7-circuit',
    title: 'Chapter 7: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-7',
    chapterNumber: 7,
    complexityLevel: 3,
    summary: 'Build the 2-qubit Grover Diffusion Operator (reflection about the mean).',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['grover_diffusion_2q']
  },
  {
    id: 'ch-7-coding',
    title: 'Chapter 7: Quantum Coding & Bug Hunt',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-7',
    chapterNumber: 7,
    complexityLevel: 3,
    summary: 'Socratic Bug Hunt: identify and repair Grover search over-rotation loop bug.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['grover_overrotation']
  },
  {
    id: 'ch-7-mastery',
    title: 'Chapter 7: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-7',
    chapterNumber: 7,
    complexityLevel: 3,
    summary: 'Sequential 3-Phase Evaluation: Iteration Math → Diffusion Circuit → Over-rotation Bug Hunt.',
    questionsCount: 3,
    estimatedMinutes: 9,
    conceptIds: ['grover_iterations', 'grover_diffusion_2q', 'grover_overrotation']
  },

  // CHAPTER 8 (Complexity: Level 3)
  {
    id: 'ch-8-mcq',
    title: 'Chapter 8: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-8',
    chapterNumber: 8,
    complexityLevel: 3,
    summary: 'Evaluate hybrid classical-quantum loops in VQE and NISQ hardware mitigation.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['vqe_nisq']
  },
  {
    id: 'ch-8-circuit',
    title: 'Chapter 8: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-8',
    chapterNumber: 8,
    complexityLevel: 3,
    summary: 'Construct a hardware-efficient parameterized ansatz layer on 2 qubits.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['vqe_ansatz']
  },
  {
    id: 'ch-8-coding',
    title: 'Chapter 8: Quantum Coding & Optimization',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-8',
    chapterNumber: 8,
    complexityLevel: 3,
    summary: 'Parson’s puzzle: assemble VQE classical-quantum optimization loop steps.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['vqe_optimization_loop']
  },
  {
    id: 'ch-8-mastery',
    title: 'Chapter 8: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-8',
    chapterNumber: 8,
    complexityLevel: 3,
    summary: 'Sequential 3-Phase Evaluation: NISQ Theory → Ansatz Circuit → Optimization Loop Code.',
    questionsCount: 3,
    estimatedMinutes: 8,
    conceptIds: ['vqe_nisq', 'vqe_ansatz', 'vqe_optimization_loop']
  },

  // CHAPTER 9 (Complexity: Level 4)
  {
    id: 'ch-9-mcq',
    title: 'Chapter 9: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-9',
    chapterNumber: 9,
    complexityLevel: 4,
    summary: 'BB84 protocol, 25% QBER eavesdropping detection threshold, and photon bases.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['bb84_qkd']
  },
  {
    id: 'ch-9-circuit',
    title: 'Chapter 9: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-9',
    chapterNumber: 9,
    complexityLevel: 4,
    summary: 'BB84 measurement basis rotation: rotate X-basis state into Z-detector basis.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['bb84_basis_measurement']
  },
  {
    id: 'ch-9-coding',
    title: 'Chapter 9: Quantum Coding & Bug Hunt',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-9',
    chapterNumber: 9,
    complexityLevel: 4,
    summary: 'Socratic Bug Hunt: fix inverted inequality condition in BB84 sifted key filter.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['qkd_sifting_bug']
  },
  {
    id: 'ch-9-mastery',
    title: 'Chapter 9: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-9',
    chapterNumber: 9,
    complexityLevel: 4,
    summary: 'Sequential 3-Phase Evaluation: QKD Security → Basis Rotation Circuit → Sifting Code Bug Hunt.',
    questionsCount: 3,
    estimatedMinutes: 8,
    conceptIds: ['bb84_qkd', 'bb84_basis_measurement', 'qkd_sifting_bug']
  },

  // CHAPTER 10 (Complexity: Level 4)
  {
    id: 'ch-10-mcq',
    title: 'Chapter 10: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-10',
    chapterNumber: 10,
    complexityLevel: 4,
    summary: 'Stabilizer syndrome measurement non-destructiveness and parity operators.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['quantum_error_correction']
  },
  {
    id: 'ch-10-circuit',
    title: 'Chapter 10: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-10',
    chapterNumber: 10,
    complexityLevel: 4,
    summary: 'Build the 3-qubit bit-flip code encoder using 2 CNOT entangling gates.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['bit_flip_code_encoder']
  },
  {
    id: 'ch-10-coding',
    title: 'Chapter 10: Quantum Coding & Syndrome Logic',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-10',
    chapterNumber: 10,
    complexityLevel: 4,
    summary: 'Parson’s puzzle: assemble 3-qubit syndrome measurement and recovery code routine.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['syndrome_correction_logic']
  },
  {
    id: 'ch-10-mastery',
    title: 'Chapter 10: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-10',
    chapterNumber: 10,
    complexityLevel: 4,
    summary: 'Sequential 3-Phase Evaluation: Stabilizer Theory → Bit-Flip Encoder → Syndrome Recovery Code.',
    questionsCount: 3,
    estimatedMinutes: 9,
    conceptIds: ['quantum_error_correction', 'bit_flip_code_encoder', 'syndrome_correction_logic']
  },

  // CHAPTER 11 (Complexity: Level 4)
  {
    id: 'ch-11-mcq',
    title: 'Chapter 11: Conceptual Foundations (MCQ)',
    kind: 'PHASE_MCQ',
    phase: 'mcq',
    chapterId: 'ch-11',
    chapterNumber: 11,
    complexityLevel: 4,
    summary: 'Quantum advantage domains, Feynman motivation, and molecular chemistry simulation.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['quantum_advantage']
  },
  {
    id: 'ch-11-circuit',
    title: 'Chapter 11: Circuit Studio Challenge',
    kind: 'PHASE_CIRCUIT',
    phase: 'circuit',
    chapterId: 'ch-11',
    chapterNumber: 11,
    complexityLevel: 4,
    summary: 'Synthesize native hardware state on superconducting physical basis wire.',
    questionsCount: 1,
    estimatedMinutes: 3,
    conceptIds: ['qiskit_transpiled_bell']
  },
  {
    id: 'ch-11-coding',
    title: 'Chapter 11: Quantum Coding & Qiskit 1.0 Runtime',
    kind: 'PHASE_CODING',
    phase: 'coding',
    chapterId: 'ch-11',
    chapterNumber: 11,
    complexityLevel: 4,
    summary: 'Parson’s puzzle: arrange modern Qiskit 1.0+ ISA PassManager and SamplerV2 workflow.',
    questionsCount: 1,
    estimatedMinutes: 4,
    conceptIds: ['qiskit1_runtime_sampler']
  },
  {
    id: 'ch-11-mastery',
    title: 'Chapter 11: Full 3-Phase Mastery Exam',
    kind: 'CHAPTER_MASTERY',
    phase: 'all',
    chapterId: 'ch-11',
    chapterNumber: 11,
    complexityLevel: 4,
    summary: 'Sequential 3-Phase Evaluation: Quantum Utility → Native Circuit → SamplerV2 Modern Runtime.',
    questionsCount: 4,
    estimatedMinutes: 9,
    conceptIds: ['quantum_advantage', 'qiskit_transpiled_bell', 'qiskit1_runtime_sampler', 'qiskit1_deprecated_execute']
  },

  // DAILY ADAPTIVE WORKOUT
  {
    id: 'adaptive-daily-workout',
    title: 'Daily Adaptive Quantum Workout',
    kind: 'ADAPTIVE_PRACTICE',
    phase: 'all',
    summary: 'Continuous dynamic difficulty adjustment (DDA) workout that adapts its questions in real time across MCQ, Circuit Studio, and Coding modalities.',
    questionsCount: 5,
    estimatedMinutes: 10,
    conceptIds: ['mixed']
  }
];
