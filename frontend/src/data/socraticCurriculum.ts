// Comprehensive Socratic Curriculum Dataset for QUBOT
// Adapts step count (3 to 5 steps) based on topic complexity:
// - Foundational & Mathematical Axioms: 3 Steps
// - Single-Qubit Mechanics & Geometry: 3 to 4 Steps
// - Multi-Qubit Protocols & Algorithms: 4 to 5 Steps
// - Noise & Error Correction: 3 to 4 Steps

import type { Topic, Chapter } from './curriculumData';

export interface SocraticOption {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
  misconceptionTag?: string;
}

export interface SocraticStep {
  stepNumber: number;
  stageTitle: string;
  conceptHook: string; // The physical setup / mental model / puzzle premise
  pedagogicalPrompt: string; // The Socratic question guiding the student to discover the principle
  thoughtHint: string; // Socratic hint if student is stuck
  mathSnippet?: string; // Accompanying mathematical notation for this stage
  visualStateKey?: '0' | '1' | '+' | '-' | '+i' | 'bell'; // Live Bloch sphere synchronization
  options: SocraticOption[];
  socraticPunchline: string; // Axiomatic insight unlocked when this step is mastered
}

export interface SocraticTopicFlow {
  topicId: string;
  topicTitle: string;
  overview: string;
  domain: string;
  steps: SocraticStep[];
}

export const SOCRATIC_TOPIC_REGISTRY: Record<string, SocraticTopicFlow> = {
  // ==========================================
  // CHAPTER 1: MATHEMATICS OF QUANTUM COMPUTING
  // ==========================================
  't1-1': {
    topicId: 't1-1',
    topicTitle: 'Complex Numbers, Vectors & Dirac Bra-Ket Notation',
    overview: 'Unpack the mathematical representation of quantum states from geometric arrows to normalized complex rays in Hilbert space ℂ².',
    domain: '01 - Mathematics',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Classical Arrow vs. Complex Amplitude',
        conceptHook: 'Imagine a physical compass needle. It can point North (|0⟩) or East (|+⟩). In classical physics, an arrow has real coordinates (x, y). But in quantum mechanics, the coordinates α and β are complex numbers (a + bi).',
        pedagogicalPrompt: 'Why must quantum state coefficients α and β be complex numbers rather than just standard positive probabilities (like 50% and 50%)?',
        thoughtHint: 'Think about what waves do when a crest meets a trough. Can real positive probabilities cancel each other out to zero?',
        mathSnippet: '|ψ⟩ = α|0⟩ + β|1⟩,   where α, β ∈ ℂ',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-1-1-1',
            label: 'Complex amplitudes have relative phases that can cancel out destructively via wave interference.',
            correct: true,
            feedback: 'Spot on! Real probabilities can only add up (0.5 + 0.5 = 1.0). Complex amplitudes can have opposite signs (+1/2 and -1/2) or imaginary phases (e^{iθ}), enabling destructive wave interference.'
          },
          {
            id: 'opt-1-1-2',
            label: 'Because complex numbers allow a computer to store infinitely more classical gigabytes of RAM in one particle.',
            correct: false,
            misconceptionTag: 'INFINITE_CLASSICAL_CAPACITY',
            feedback: 'A common misconception! By Holevo’s Theorem, projective measurement of a single qubit can extract at most ONE classical bit of information, despite its complex continuous state space.'
          },
          {
            id: 'opt-1-1-3',
            label: 'Because imaginary numbers correspond to physically negative probabilities like -40% occurrence in nature.',
            correct: false,
            misconceptionTag: 'NEGATIVE_PROBABILITY',
            feedback: 'Probabilities in physical experiments are strictly between 0 and 1. The negative or imaginary coefficient is an amplitude, not a probability.'
          }
        ],
        socraticPunchline: 'Quantum amplitudes are complex numbers because relative phases are the physical mechanism of wave interference.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Dirac Ket Vector and Dual Bra Vector',
        conceptHook: 'In Dirac notation, column statevectors are written as kets |ψ⟩, and their conjugate transpose row vectors are written as bras ⟨ψ| = (|ψ⟩)†.',
        pedagogicalPrompt: 'If state |ψ⟩ is the column vector [α, β]ᵀ, what is its dual bra ⟨ψ| in terms of α and β?',
        thoughtHint: 'Remember the Hermitian adjoint (†) operation: transpose the matrix AND take the complex conjugate of each entry.',
        mathSnippet: '⟨ψ| = (|ψ⟩)† = [α*, β*],   with (x + iy)* = x - iy',
        visualStateKey: '1',
        options: [
          {
            id: 'opt-1-2-1',
            label: '⟨ψ| = [α*, β*] (a row vector with complex-conjugated coefficients)',
            correct: true,
            feedback: 'Exact! The bra vector ⟨ψ| is the Hermitian adjoint (conjugate transpose) of ket |ψ⟩, guaranteeing that the inner product ⟨ψ|ψ⟩ computes a real, non-negative length squared.'
          },
          {
            id: 'opt-1-2-2',
            label: '⟨ψ| = [1/α, 1/β] (reciprocal components to invert the state)',
            correct: false,
            misconceptionTag: 'RECIPROCAL_DUAL',
            feedback: 'The dual vector does not invert the entries; it maps vectors to linear functionals via the complex conjugate transpose.'
          },
          {
            id: 'opt-1-2-3',
            label: '⟨ψ| is identical to |ψ⟩ because transpose has no effect in complex vector space.',
            correct: false,
            misconceptionTag: 'IGNORED_CONJUGATE',
            feedback: 'Ignoring the conjugate transpose would allow complex inner products like (i)·(i) = -1, which would break the definition of a geometric length!'
          }
        ],
        socraticPunchline: 'Dual bras ⟨ψ| conjugate and transpose the vector so inner products produce strictly real geometric lengths.'
      },
      {
        stepNumber: 3,
        stageTitle: 'The Born Rule and Normalization Invariance',
        conceptHook: 'For a state |ψ⟩ = (3/5)|0⟩ - (4/5)|1⟩, the amplitude of |1⟩ is -4/5. You conduct a projective measurement in the computational basis.',
        pedagogicalPrompt: 'According to the Born Rule, what is the exact physical probability P(1) of measuring state |1⟩?',
        thoughtHint: 'The Born Rule dictates P(x) = |amplitude|² = (amplitude)*(amplitude*). Calculate |-4/5|².',
        mathSnippet: 'P(m) = |⟨m|ψ⟩|²,   ⟨ψ|ψ⟩ = |α|² + |β|² = 1',
        visualStateKey: '+',
        options: [
          {
            id: 'opt-1-3-1',
            label: '16/25 (64%), because probability is the squared magnitude |-4/5|² = 16/25.',
            correct: true,
            feedback: 'Brilliant deduction! The negative sign in front of 4/5 is a relative phase factor. Squaring its absolute magnitude gives |-4/5|² = +16/25 = 0.64 (64%). The probabilities sum to 9/25 + 16/25 = 1.0 (100%).'
          },
          {
            id: 'opt-1-3-2',
            label: '-16/25 (-64%), because the negative amplitude directly carries over into measurement.',
            correct: false,
            misconceptionTag: 'NEGATIVE_BORN_PROBABILITY',
            feedback: 'A detector can never register -64% of clicks. The Born Rule squares the modulus: |-4/5|² = (-4/5) × (-4/5) = +16/25.'
          },
          {
            id: 'opt-1-3-3',
            label: '4/5 (80%), because measurement probability directly equals the amplitude without squaring.',
            correct: false,
            misconceptionTag: 'LINEAR_PROBABILITY',
            feedback: 'If probability were linear, 3/5 + 4/5 = 7/5 = 140%, violating the total probability conservation of 100%!'
          }
        ],
        socraticPunchline: 'The Born Rule states P(x) = |amplitude|²; negative and imaginary signs are relative phases that manifest exclusively in wave interference.'
      }
    ]
  },

  't1-2': {
    topicId: 't1-2',
    topicTitle: 'Matrices, Unitary Operators & Tensor Products',
    overview: 'Discover why all closed quantum operations are reversible unitary rotations (U†U = I) and how multi-qubit systems scale via the Kronecker tensor product (⊗).',
    domain: '01 - Mathematics',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Conservation of Probability: Why Unitary?',
        conceptHook: 'In classical computing, an AND gate takes two bits (e.g. 0, 1) and outputs 0. You cannot tell from the output whether the inputs were (0,0), (0,1), or (1,0)—information was irreversibly destroyed as heat.',
        pedagogicalPrompt: 'Why is it physically impossible for an isolated quantum gate to map both |0⟩ and |1⟩ to the same output |0⟩?',
        thoughtHint: 'If two orthogonal states become identical, can you run the gate in reverse to recover which state you started with?',
        mathSnippet: 'U† U = U U† = I,   ⟨Uψ|Uφ⟩ = ⟨ψ|φ⟩',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-1-2-1a',
            label: 'Because quantum gates must be unitary and reversible: preserving vector lengths and inner products so no information is lost.',
            correct: true,
            feedback: 'Precisely! A matrix mapping orthogonal inputs to identical outputs is singular (non-invertible) and non-unitary (U†U ≠ I). In isolated quantum mechanics, total probability and information are conserved.'
          },
          {
            id: 'opt-1-2-1b',
            label: 'Because the state |0⟩ has zero physical energy and cannot accommodate two inputs.',
            correct: false,
            misconceptionTag: 'ENERGY_CAPACITY_CONFUSION',
            feedback: '|0⟩ is a computational basis label, not an empty container. The restriction is mathematical reversibility (unitarity).'
          },
          {
            id: 'opt-1-2-1c',
            label: 'Because quantum computers can only perform calculations with addition, never subtraction or assignment.',
            correct: false,
            misconceptionTag: 'RESTRICTED_ARITHMETIC',
            feedback: 'Quantum gates perform complex linear transformations; the unitary constraint means all state evolutions are rigid rotations of Hilbert space.'
          }
        ],
        socraticPunchline: 'Unitary gates U†U = I act as rigid rotations of Hilbert space, ensuring 100% total probability conservation and mathematical reversibility.'
      },
      {
        stepNumber: 2,
        stageTitle: 'The Kronecker Tensor Product (⊗)',
        conceptHook: 'When we combine 2 classical bits, we get 4 possible states: 00, 01, 10, 11. In quantum computing, we combine individual state spaces ℂ² using the tensor product ⊗.',
        pedagogicalPrompt: 'If we combine two 1-qubit states |ψ₁⟩ = [α₁, β₁]ᵀ and |ψ₂⟩ = [α₂, β₂]ᵀ via |ψ₁⟩ ⊗ |ψ₂⟩, how many complex amplitudes describe the composite 2-qubit register?',
        thoughtHint: 'Multiply each element of the first vector by the entire second vector.',
        mathSnippet: '|ψ₁⟩ ⊗ |ψ₂⟩ = [α₁α₂, α₁β₂, β₁α₂, β₁β₂]ᵀ ∈ ℂ⁴',
        visualStateKey: 'bell',
        options: [
          {
            id: 'opt-1-2-2a',
            label: '4 amplitudes (2² = 4: representing |00⟩, |01⟩, |10⟩, and |11⟩)',
            correct: true,
            feedback: 'Correct! The dimension of composite Hilbert space multiplies: dim(ℂ² ⊗ ℂ²) = 2 × 2 = 4 dimensions. For n qubits, it scales exponentially as 2ⁿ.'
          },
          {
            id: 'opt-1-2-2b',
            label: '2 amplitudes (simply taking the average of the two qubits)',
            correct: false,
            misconceptionTag: 'AVERAGING_STATE',
            feedback: 'Combining systems does not average them; each joint basis state |00⟩, |01⟩, |10⟩, |11⟩ requires its own independent complex amplitude.'
          },
          {
            id: 'opt-1-2-2c',
            label: '16 amplitudes because each gate squares the dimension twice.',
            correct: false,
            misconceptionTag: 'SQUARE_EXPONENT',
            feedback: '2 qubits yield 2² = 4 dimensions. 16 dimensions would correspond to 4 qubits (2⁴ = 16).'
          }
        ],
        socraticPunchline: 'Tensor products multiply state space dimensions: n qubits yield a 2ⁿ-dimensional complex vector space.'
      },
      {
        stepNumber: 3,
        stageTitle: 'Exponential Scaling of Quantum State Spaces',
        conceptHook: 'Classical supercomputers have petabytes of memory. A quantum register of n qubits has 2ⁿ complex amplitudes.',
        pedagogicalPrompt: 'How many complex numbers are required to describe a joint state of just 50 entangled qubits?',
        thoughtHint: 'Calculate 2⁵⁰ in orders of magnitude (2¹⁰ ≈ 1,000).',
        mathSnippet: 'dim(ℋ_{50}) = 2⁵⁰ ≈ 1.125 × 10¹⁵ complex amplitudes (~16 Petabytes RAM)',
        visualStateKey: 'bell',
        options: [
          {
            id: 'opt-1-2-3a',
            label: '2⁵⁰ ≈ 1.125 × 10¹⁵ amplitudes (over 1 quadrillion numbers, requiring petabytes of classical RAM to store)',
            correct: true,
            feedback: 'Mind-blowing, isn’t it? Just 50 qubits require more than 16 Petabytes of classical memory to track. At 300 qubits, 2³⁰⁰ exceeds the estimated number of atoms in the observable universe! This is the source of quantum computational advantage.'
          },
          {
            id: 'opt-1-2-3b',
            label: '50 × 2 = 100 numbers (linear scaling with the number of wires)',
            correct: false,
            misconceptionTag: 'LINEAR_SCALING_FALLACY',
            feedback: 'If quantum state space scaled linearly (100 numbers), classical computers could effortlessly simulate thousands of qubits in a fraction of a millisecond!'
          },
          {
            id: 'opt-1-2-3c',
            label: '50² = 2,500 numbers (polynomial quadratic scaling)',
            correct: false,
            misconceptionTag: 'POLYNOMIAL_SCALING',
            feedback: 'Tensor product scaling is strictly exponential (2ⁿ), not polynomial (n²).'
          }
        ],
        socraticPunchline: 'Entangled quantum states span a 2ⁿ Hilbert space; 50 qubits already exceed the memory of typical classical supercomputers.'
      }
    ]
  },

  // ==========================================
  // CHAPTER 2: QUANTUM FOUNDATIONS & THE QUBIT
  // ==========================================
  't2-1': {
    topicId: 't2-1',
    topicTitle: 'The Superposition Principle & State Collapse',
    overview: 'Contrast classical probabilistic ignorance with genuine quantum superposition, wave interference, and projective measurement.',
    domain: '02 - Quantum Foundations',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'The Classical Coin Trap vs. The Quantum Equator',
        conceptHook: 'If you flip a coin and trap it under your hand, you do not know if it is Heads or Tails until you look. You might say it is 50% Heads and 50% Tails.',
        pedagogicalPrompt: 'Is a qubit prepared in equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 merely in a hidden classical state of either 0 or 1 that we haven’t checked yet?',
        thoughtHint: 'If the qubit were already secretly 0 or 1, what would happen if you applied a wave interference gate before measuring?',
        mathSnippet: '|+⟩ = \\frac{1}{\\sqrt{2}}|0⟩ + \\frac{1}{\\sqrt{2}}|1⟩,   \\text{a distinct deterministic vector along +X}',
        visualStateKey: '+',
        options: [
          {
            id: 'opt-2-1-1a',
            label: 'No! It is in a physically distinct, coherent quantum state pointing along the +X axis of the Bloch sphere, capable of wave interference.',
            correct: true,
            feedback: 'Exactly right! Superposition is not our ignorance of a classical coin. A qubit in |+⟩ is pointing with 100% deterministic certainty along the +X axis. If measured in the X-basis, it yields |+⟩ 100% of the time!'
          },
          {
            id: 'opt-2-1-1b',
            label: 'Yes, quantum mechanics says particles have definite hidden values at all times (Local Hidden Variables).',
            correct: false,
            misconceptionTag: 'LOCAL_HIDDEN_VARIABLES',
            feedback: 'Bell’s Theorem and experimental tests have disproven local hidden variable theories! The qubit does not possess a definite Z-basis value prior to measurement.'
          },
          {
            id: 'opt-2-1-1c',
            label: 'Yes, the particle is rapidly oscillating back and forth between 0 and 1 millions of times per second.',
            correct: false,
            misconceptionTag: 'TEMPORAL_OSCILLATION',
            feedback: 'Superposition is a stationary state in Hilbert space, not a rapid time-domain bouncing between discrete poles.'
          }
        ],
        socraticPunchline: 'Superposition is a definite vector orientation, not classical ignorance or a hidden coin.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Destructive Wave Interference: H² = I',
        conceptHook: 'Let us prove superposition is real wave interference. You start with |0⟩ (100% prob of 0). You apply Hadamard H to get |+⟩ (50% prob 0, 50% prob 1). Now you apply Hadamard H a second time without measuring.',
        pedagogicalPrompt: 'What happens to the state when the second Hadamard gate is applied (H|+⟩)?',
        thoughtHint: 'Look at the amplitudes for |1⟩: (1/√2)·(1/√2) from the first path, and (1/√2)·(-1/√2) from the second path.',
        mathSnippet: 'H|+⟩ = H(H|0⟩) = H²|0⟩ = I|0⟩ = |0⟩ (100% Certainty)',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-2-1-2a',
            label: 'It returns deterministically to |0⟩ with 100% probability because the amplitudes for |1⟩ cancel out by destructive interference!',
            correct: true,
            feedback: 'Brilliant! If |+⟩ were just a random classical 50/50 mix, applying another 50/50 gate would still leave it 50/50. Because it is quantum, the path to |1⟩ has amplitudes (+1/2) and (-1/2), which cancel to EXACT ZERO via destructive interference.'
          },
          {
            id: 'opt-2-1-2b',
            label: 'It randomizes further into a chaotic 50/50 distribution between 0 and 1.',
            correct: false,
            misconceptionTag: 'DIFFUSION_FALLACY',
            feedback: 'That would happen with classical probability transitions (Markov chains). But quantum gates are unitary and interfere constructively back to |0⟩!'
          },
          {
            id: 'opt-2-1-2c',
            label: 'It collapses into |-⟩ because two gates invert the phase.',
            correct: false,
            misconceptionTag: 'PHASE_INVERSION_CONFUSION',
            feedback: 'H applied to |+⟩ specifically yields |0⟩ because H is an involution: H² = I.'
          }
        ],
        socraticPunchline: 'Hadamard is its own inverse (H² = I); consecutive application produces deterministic constructive interference back to the ground state.'
      },
      {
        stepNumber: 3,
        stageTitle: 'Measurement as Irreversible Projective Collapse',
        conceptHook: 'A qubit is in equal superposition |+⟩. You now attach a physical detector and perform a projective measurement in the computational Z-basis.',
        pedagogicalPrompt: 'What is the physical state of the qubit immediately AFTER the detector clicks and reads the outcome "1"?',
        thoughtHint: 'Does the qubit stay in superposition, or does measurement project the statevector onto the measured basis eigenvector?',
        mathSnippet: 'P_1 = |1⟩⟨1|,   |ψ_{post}⟩ = \\frac{P_1|ψ⟩}{\\sqrt{P(1)}} = |1⟩',
        visualStateKey: '1',
        options: [
          {
            id: 'opt-2-1-3a',
            label: 'It has collapsed entirely into the basis state |1⟩; measuring it immediately again will yield 1 with 100% certainty.',
            correct: true,
            feedback: 'Spot on! Projective measurement is non-unitary: it collapses the superposed wave function onto the eigenvalue subspace. The original superposition is erased, and subsequent measurements in the same basis repeat outcome 1 deterministically.'
          },
          {
            id: 'opt-2-1-3b',
            label: 'It remains in equal superposition |+⟩ because observing a quantum particle never changes its state.',
            correct: false,
            misconceptionTag: 'NON_DISTURBANCE_MYTH',
            feedback: 'A major violation of quantum mechanics! Measurement is not passive photography; projective measurement fundamentally collapses the state.'
          },
          {
            id: 'opt-2-1-3c',
            label: 'It is destroyed and vanishes from the circuit completely.',
            correct: false,
            misconceptionTag: 'PARTICLE_ANNIHILATION',
            feedback: 'The physical qubit (e.g. trapped ion or superconducting transmon) still exists; its statevector was simply projected onto |1⟩.'
          }
        ],
        socraticPunchline: 'Projective measurement is non-unitary and irreversible: it projects the continuous statevector into a discrete basis eigenstate.'
      }
    ]
  },

  't2-2': {
    topicId: 't2-2',
    topicTitle: 'Pauli Operators & Bloch Sphere Rotations',
    overview: 'Navigate the geometric rotations of the single-qubit Bloch sphere using Pauli matrices X, Y, and Z.',
    domain: '02 - Quantum Foundations',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Pauli-X: The Quantum NOT Gate (Bit Flip)',
        conceptHook: 'On the Bloch sphere, the North Pole is |0⟩ and the South Pole is |1⟩. Pauli-X matrix is [[0, 1], [1, 0]].',
        pedagogicalPrompt: 'Geometrically and algebraically, what transformation does Pauli-X perform on state |0⟩?',
        thoughtHint: 'Multiply [[0, 1], [1, 0]] by column vector [1, 0]ᵀ, or picture a 180° rotation around the X-axis.',
        mathSnippet: 'X|0⟩ = |1⟩,   X|1⟩ = |0⟩,   R_x(π) = -iX',
        visualStateKey: '1',
        options: [
          {
            id: 'opt-2-2-1a',
            label: 'A 180° rotation around the X-axis, flipping North Pole |0⟩ to South Pole |1⟩ (a quantum bit-flip).',
            correct: true,
            feedback: 'Exactly! Pauli-X swaps the computational basis states |0⟩ ↔ |1⟩, functioning as the quantum equivalent of a classical NOT gate.'
          },
          {
            id: 'opt-2-2-1b',
            label: 'A 90° rotation into the equator, creating equal superposition |+⟩.',
            correct: false,
            misconceptionTag: 'CONFUSING_X_WITH_HADAMARD',
            feedback: 'Rotating from the Pole to the equator is done by the Hadamard gate (or a π/2 Y-rotation), not Pauli-X.'
          },
          {
            id: 'opt-2-2-1c',
            label: 'It leaves |0⟩ unchanged because X only interacts with excited states.',
            correct: false,
            misconceptionTag: 'OPERATOR_SELECTIVITY',
            feedback: 'Pauli-X acts on all states in the vector space, exchanging amplitudes α and β.'
          }
        ],
        socraticPunchline: 'Pauli-X rotates the Bloch sphere 180° around the X-axis, executing a bit-flip |0⟩ ↔ |1⟩.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Pauli-Z: The Phase Flip Mystery',
        conceptHook: 'Now consider the Pauli-Z matrix: [[1, 0], [0, -1]]. Notice that Z|0⟩ = +|0⟩, but Z|1⟩ = -|1⟩.',
        pedagogicalPrompt: 'If we apply Pauli-Z to the ground state |0⟩, what is the resulting statevector?',
        thoughtHint: 'Look at the matrix: Z|0⟩ = [[1,0],[0,-1]]·[1,0]ᵀ = [1, 0]ᵀ.',
        mathSnippet: 'Z|0⟩ = +|0⟩,   Z|1⟩ = -|1⟩',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-2-2-2a',
            label: '|0⟩ unchanged, because |0⟩ is an eigenstate of Z with eigenvalue +1.',
            correct: true,
            feedback: 'Spot on! State |0⟩ is completely unaffected by Pauli-Z. Only state |1⟩ receives a -1 phase factor. This is why Pauli-Z is a phase-flip operator, not a bit-flip.'
          },
          {
            id: 'opt-2-2-2b',
            label: '|1⟩, because all Pauli matrices perform bit flips.',
            correct: false,
            misconceptionTag: 'ALL_PAULIS_BITFLIP',
            feedback: 'Only Pauli-X flips bits (|0⟩ ↔ |1⟩). Pauli-Z only flips the relative phase of |1⟩.'
          },
          {
            id: 'opt-2-2-2c',
            label: '-|0⟩ with a negative sign.',
            correct: false,
            misconceptionTag: 'GLOBAL_MINUS_CONFUSION',
            feedback: 'Z[[1, 0]ᵀ] = 1·[1, 0]ᵀ = +|0⟩. The eigenvalue for |0⟩ is positive +1.'
          }
        ],
        socraticPunchline: '|0⟩ and |1⟩ are eigenstates of Pauli-Z with eigenvalues +1 and -1; Z flips phase, not bit values.'
      },
      {
        stepNumber: 3,
        stageTitle: 'Equatorial Phase Flip: |+⟩ to |-⟩',
        conceptHook: 'Recall the state pointing East along +X: |+⟩ = (|0⟩ + |1⟩)/√2. We apply Pauli-Z.',
        pedagogicalPrompt: 'What state do we obtain after applying Z to |+⟩, and can measuring in the computational basis detect this change?',
        thoughtHint: 'Apply Z to both terms: Z(|0⟩ + |1⟩) = Z|0⟩ + Z|1⟩ = |0⟩ - |1⟩.',
        mathSnippet: 'Z|+⟩ = \\frac{|0⟩ - |1⟩}{\\sqrt{2}} = |-⟩,   P_Z(0) = |1/\\sqrt{2}|² = 50%,   P_Z(1) = |-1/\\sqrt{2}|² = 50%',
        visualStateKey: '-',
        options: [
          {
            id: 'opt-2-2-3a',
            label: 'It becomes |-⟩ (pointing West along -X). Measurement in the Z-basis CANNOT detect this change because probabilities remain 50/50!',
            correct: true,
            feedback: 'Brilliant deduction! Both |+⟩ and |-⟩ have 50% probability of 0 and 50% probability of 1 in the Z-basis. To reveal the phase flip, you must apply a Hadamard gate first (rotating X to Z), turning the phase difference into measurable 100% constructive interference!'
          },
          {
            id: 'opt-2-2-3b',
            label: 'It collapses into |0⟩ with 100% probability.',
            correct: false,
            misconceptionTag: 'PHASE_COLLAPSE',
            feedback: 'Pauli-Z is a unitary rotation around the Z-axis; it does not collapse the state onto the pole.'
          },
          {
            id: 'opt-2-2-3c',
            label: 'It produces 100% probability of measuring 1 in the Z basis.',
            correct: false,
            misconceptionTag: 'Z_BASIS_MISCONCEPTION',
            feedback: 'In the Z-basis, |-1/√2|² = 1/2 = 50%. The probability of measuring 1 did not change at all!'
          }
        ],
        socraticPunchline: 'Phase flips along the equator (|+⟩ ↔ |-⟩) are invisible to Z-basis measurement unless first rotated into amplitude via Hadamard.'
      }
    ]
  },

  // ==========================================
  // CHAPTER 4: MULTI-QUBIT SYSTEMS & BELL STATES
  // ==========================================
  't4-2': {
    topicId: 't4-2',
    topicTitle: 'Entanglement & Bell States',
    overview: 'Unpack maximal quantum entanglement, non-local correlations, and why entangled states cannot be factored into independent qubits.',
    domain: '04 - Entanglement & Non-Locality',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'The Separability Test: Can You Factor the State?',
        conceptHook: 'Consider the 2-qubit state |ψ⟩ = (|00⟩ + |11⟩)/√2 (The Bell state |Φ⁺⟩).',
        pedagogicalPrompt: 'Can this state be factored into two independent single-qubit states (q_A ⊗ q_B)?',
        thoughtHint: 'Try setting (a|0⟩ + b|1⟩) ⊗ (c|0⟩ + d|1⟩) = ac|00⟩ + ad|01⟩ + bc|10⟩ + bd|11⟩. Can ad=0 and bc=0 while ac=1/√2 and bd=1/√2?',
        mathSnippet: '|Φ⁺⟩ = \\frac{|00⟩ + |11⟩}{\\sqrt{2}} \\neq |q_A⟩ \\otimes |q_B⟩',
        visualStateKey: 'bell',
        options: [
          {
            id: 'opt-4-2-1a',
            label: 'No! If ad=0, either a=0 or d=0, which forces ac=0 or bd=0 (a mathematical contradiction). The qubits have no independent identity.',
            correct: true,
            feedback: 'Masterful mathematical proof! An entangled state cannot be written as a tensor product of independent subsystems. Individual qubits do not have separate states; only the combined system exists.'
          },
          {
            id: 'opt-4-2-1b',
            label: 'Yes, it is simply |+⟩ on qubit 0 and |+⟩ on qubit 1.',
            correct: false,
            misconceptionTag: 'ENTANGLEMENT_AS_PRODUCT',
            feedback: '|+⟩ ⊗ |+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2, which includes |01⟩ and |10⟩! The Bell state has zero probability for |01⟩ and |10⟩.'
          },
          {
            id: 'opt-4-2-1c',
            label: 'Yes, any two-qubit state can always be factored if you rotate the coordinates.',
            correct: false,
            misconceptionTag: 'UNIVERSAL_SEPARABILITY',
            feedback: 'False: Entanglement is invariant under local unitary rotations. No local coordinate change can factor an entangled state.'
          }
        ],
        socraticPunchline: 'Entangled states cannot be factored into independent subsystems; information resides strictly in joint correlations.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Preparing the Bell State Circuit: H + CNOT',
        conceptHook: 'To create |Φ⁺⟩ in a quantum circuit, we start with |00⟩. We apply a Hadamard gate to qubit 0, followed by a CNOT gate with qubit 0 as control and qubit 1 as target.',
        pedagogicalPrompt: 'Trace the state step-by-step: what is the state after Hadamard on q[0], and what happens when CNOT(0, 1) fires?',
        thoughtHint: 'After H: (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2. CNOT flips target if control is 1.',
        mathSnippet: '|00⟩ \\xrightarrow{H_0} \\frac{|00⟩ + |10⟩}{\\sqrt{2}} \\xrightarrow{CNOT_{0,1}} \\frac{|00⟩ + |11⟩}{\\sqrt{2}}',
        visualStateKey: 'bell',
        options: [
          {
            id: 'opt-4-2-2a',
            label: 'H creates superposition (|00⟩+|10⟩)/√2; CNOT flips the target bit only when control is 1, turning |10⟩ into |11⟩.',
            correct: true,
            feedback: 'Spot on! The CNOT gate entangles the control and target: when q[0] is 0, q[1] stays 0 (|00⟩); when q[0] is 1, q[1] flips to 1 (|11⟩). The output is the maximally entangled Bell state |Φ⁺⟩.'
          },
          {
            id: 'opt-4-2-2b',
            label: 'CNOT measures both qubits and sets them to random identical values.',
            correct: false,
            misconceptionTag: 'CNOT_AS_MEASUREMENT',
            feedback: 'CNOT is a reversible unitary gate, not a measurement! It preserves quantum coherence and entanglement.'
          },
          {
            id: 'opt-4-2-2c',
            label: 'Hadamard entangles the qubits immediately; CNOT just acts as an amplifier.',
            correct: false,
            misconceptionTag: 'HADAMARD_ENTANGLES',
            feedback: 'A single-qubit gate like H CANNOT create entanglement across two wires! Entanglement strictly requires an interacting two-qubit gate like CNOT.'
          }
        ],
        socraticPunchline: 'Entanglement generation requires combining single-qubit superposition (H) with a two-qubit conditional interaction (CNOT).'
      },
      {
        stepNumber: 3,
        stageTitle: 'Instant Correlation vs. No Faster-Than-Light Communication',
        conceptHook: 'Alice takes qubit 0 to Earth, and Bob takes qubit 1 to Alpha Centauri (4 light-years away). They share Bell state |Φ⁺⟩. Alice measures qubit 0 in the Z basis and gets 1.',
        pedagogicalPrompt: 'Bob immediately measures qubit 1. What does he get, and can Alice use this to send an instantaneous telegraph message to Bob?',
        thoughtHint: 'What was Alice’s outcome probability beforehand? Can Alice choose whether she gets 0 or 1?',
        mathSnippet: 'P(B=1 | A=1) = 100%,   \\text{but } P(A=1) = 50% \\text{ (completely random)}',
        visualStateKey: '1',
        options: [
          {
            id: 'opt-4-2-3a',
            label: 'Bob gets 1 with 100% certainty; but NO message can be transmitted faster than light because Alice cannot control her random measurement outcome.',
            correct: true,
            feedback: 'Fundamental truth of quantum mechanics! Alice gets 0 or 1 completely at random (50/50). Bob also observes pure 50/50 noise locally until Alice sends her measurement result via a classical channel limited by the speed of light (No-Communication Theorem).'
          },
          {
            id: 'opt-4-2-3b',
            label: 'Yes, Alice can send instant Morse code across light-years because Bob’s qubit reacts instantly.',
            correct: false,
            misconceptionTag: 'FTL_COMMUNICATION',
            feedback: 'Violates Special Relativity! Because Alice cannot choose whether she measures 0 or 1, Bob’s reduced density matrix is identical regardless of whether Alice measured or not.'
          },
          {
            id: 'opt-4-2-3c',
            label: 'Bob gets 0 because entanglement always forces opposite values.',
            correct: false,
            misconceptionTag: 'ALWAYS_ANTI_CORRELATED',
            feedback: 'In state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, the outcomes are strictly correlated (both 0 or both 1). Anti-correlation occurs in |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2.'
          }
        ],
        socraticPunchline: 'Entanglement produces instantaneous non-local correlation, but the No-Communication Theorem prevents faster-than-light signaling.'
      },
      {
        stepNumber: 4,
        stageTitle: 'Verification: Density Matrices and Mixed Subsystems',
        conceptHook: 'What does an observer see if they look ONLY at Alice’s qubit without knowing anything about Bob’s qubit?',
        pedagogicalPrompt: 'If we take the partial trace over Bob’s qubit (ρ_A = Tr_B(|Φ⁺⟩⟨Φ⁺|)), what is Alice’s individual subsystem state?',
        thoughtHint: 'Trace out Bob: |00⟩⟨00| gives |0⟩⟨0|, |11⟩⟨11| gives |1⟩⟨1|.',
        mathSnippet: 'ρ_A = \\frac{1}{2}|0⟩⟨0| + \\frac{1}{2}|1⟩⟨1| = \\frac{1}{2}I_2 \\quad (\\text{Maximally Mixed State})',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-4-2-4a',
            label: 'A maximally mixed state (ρ_A = I/2): zero coherence, 50% classical entropy, pointing at the exact center (0,0,0) of the Bloch sphere.',
            correct: true,
            feedback: 'Brilliant! Even though the combined 2-qubit state is in a pure state of 100% certainty, each individual qubit has maximum entropy and zero single-qubit purity. All information exists in the correlations between them!'
          },
          {
            id: 'opt-4-2-4b',
            label: 'A pure state |+⟩ pointing along the equator.',
            correct: false,
            misconceptionTag: 'PURITY_CONFUSION',
            feedback: 'State |+⟩ has coherent off-diagonal terms (|0⟩⟨1| + |1⟩⟨0|). Alice’s reduced state has ZERO off-diagonal coherence.'
          },
          {
            id: 'opt-4-2-4c',
            label: 'A deterministic |0⟩ state.',
            correct: false,
            misconceptionTag: 'GROUND_FALLACY',
            feedback: 'Alice has equal 50% probability of 0 and 50% of 1.'
          }
        ],
        socraticPunchline: 'Subsystems of maximally entangled states are maximally mixed (ρ = I/2), sitting at the exact center of the Bloch sphere.'
      }
    ]
  },

  // ==========================================
  // CHAPTER 7: GROVER'S ALGORITHM
  // ==========================================
  't7-1': {
    topicId: 't7-1',
    topicTitle: 'Grover Search: Oracle & Phase Inversion',
    overview: 'Explore the quantum search algorithm that finds marked items in an unsorted database with quadratic speedup O(√N).',
    domain: '07 - Grover & Amplitude Amplification',
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'The Classical Database Limit',
        conceptHook: 'Imagine an unsorted list of N = 1,000,000 items. One item is the winning marked secret |w⟩.',
        pedagogicalPrompt: 'In the worst case, how many items must a classical computer check to find the marked item with 100% certainty?',
        thoughtHint: 'If the item is not at position 1, 2, ... N-1, where is it?',
        mathSnippet: '\\text{Classical Unstructured Search: } O(N) \\text{ queries (average } N/2)',
        visualStateKey: '0',
        options: [
          {
            id: 'opt-7-1-1a',
            label: 'N checks (1,000,000 queries in the worst case, N/2 on average)',
            correct: true,
            feedback: 'Correct! Without order, an algorithm has no choice but to inspect items one by one. Finding a marked item takes O(N) evaluations.'
          },
          {
            id: 'opt-7-1-1b',
            label: 'log₂(N) ≈ 20 queries using binary search.',
            correct: false,
            misconceptionTag: 'BINARY_SEARCH_FALLACY',
            feedback: 'Binary search only works on SORTED data! In an unsorted database, you cannot divide and conquer.'
          },
          {
            id: 'opt-7-1-1c',
            label: '1 query because computers check all memory addresses at the same time.',
            correct: false,
            misconceptionTag: 'CLASSICAL_PARALLELISM',
            feedback: 'Classical RAM addresses must be read sequentially or require exponentially duplicating hardware.'
          }
        ],
        socraticPunchline: 'Classical unstructured search requires O(N) operations because items must be evaluated sequentially.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Equal Superposition Initialization',
        conceptHook: 'Grover begins by preparing an n-qubit register in an equal superposition of all N = 2ⁿ states using Hadamard gates: |s⟩ = (1/√N) ∑ |x⟩.',
        pedagogicalPrompt: 'What is the initial amplitude of the marked target state |w⟩ before the algorithm begins?',
        thoughtHint: 'There are N basis states, all sharing identical amplitude.',
        mathSnippet: '|s⟩ = H^{\\otimes n}|0⟩^{\\otimes n} = \\frac{1}{\\sqrt{N}}\\sum_{x=0}^{N-1} |x⟩,   \\text{Amp}(w) = \\frac{1}{\\sqrt{N}}',
        visualStateKey: '+',
        options: [
          {
            id: 'opt-7-1-2a',
            label: '1/√N (all N states share identical amplitude, so P(w) = 1/N)',
            correct: true,
            feedback: 'Spot on! At step 0, the marked state has the exact same amplitude (1/√N) as every other state. Measuring now gives only a 1/N chance of finding it.'
          },
          {
            id: 'opt-7-1-2b',
            label: '1.0 (the target item starts with 100% probability)',
            correct: false,
            misconceptionTag: 'ORACLE_PRECOGNITION',
            feedback: 'If the target already had amplitude 1.0, the search would already be over!'
          },
          {
            id: 'opt-7-1-2c',
            label: '0 (the target is hidden and starts with zero probability)',
            correct: false,
            misconceptionTag: 'ZERO_INITIAL_PROB',
            feedback: '|w⟩ is an element of the computational basis and receives 1/√N just like every other state.'
          }
        ],
        socraticPunchline: 'Initialization creates uniform amplitude 1/√N across all basis states.'
      },
      {
        stepNumber: 3,
        stageTitle: 'The Phase Oracle: Marking without Measuring',
        conceptHook: 'The Grover Oracle U_w recognizes the winning item |w⟩. But it does NOT measure or print the answer.',
        pedagogicalPrompt: 'How does the phase oracle mark the target state |w⟩ without collapsing the superposition?',
        thoughtHint: 'Look at phase kickback: U_w|x⟩ = (-1)^{f(x)}|x⟩.',
        mathSnippet: 'U_w|x⟩ = (-1)^{[x=w]}|x⟩:   |w⟩ \\to -|w⟩,   |x \\neq w⟩ \\to +|x⟩',
        visualStateKey: '-',
        options: [
          {
            id: 'opt-7-1-3a',
            label: 'It inverts only the target state’s phase from +1 to -1 (|w⟩ → -|w⟩), leaving all other states positive.',
            correct: true,
            feedback: 'Genius! The oracle flips the sign of the target amplitude. Notice that |-1/√N|² = 1/N: the measurement probability did NOT change yet, but the phase is now inverted relative to all other states!'
          },
          {
            id: 'opt-7-1-3b',
            label: 'It sets the target amplitude to 0 and all other amplitudes to 1.',
            correct: false,
            misconceptionTag: 'ZEROING_TARGET',
            feedback: 'That would destroy the target item! The oracle preserves the magnitude and inverts the phase.'
          },
          {
            id: 'opt-7-1-3c',
            label: 'It measures the qubit and rings a bell if it matches.',
            correct: false,
            misconceptionTag: 'ORACLE_AS_MEASUREMENT',
            feedback: 'Measurement would instantly collapse the superposition into a random wrong item with (N-1)/N probability!'
          }
        ],
        socraticPunchline: 'The Oracle marks the solution by inverting its relative phase (|w⟩ → -|w⟩), preserving quantum superposition.'
      },
      {
        stepNumber: 4,
        stageTitle: 'The Diffusion Operator (Inversion About the Mean)',
        conceptHook: 'Now the target state has negative amplitude (-1/√N), while the other 999,999 states have positive amplitude (+1/√N). The average amplitude is slightly below the positive values.',
        pedagogicalPrompt: 'Grover applies the Diffusion operator: 2|s⟩⟨s| - I. What geometric operation does this perform on all amplitudes?',
        thoughtHint: 'Reflection about the mean: new_amp = 2·(mean) - old_amp. Since old_amp was negative, 2·(mean) - (-|amp|) turns it into a large POSITIVE number!',
        mathSnippet: 'D = 2|s⟩⟨s| - I,   \\alpha_x \\to 2\\mu - \\alpha_x,   \\text{where } \\mu \\approx \\frac{1}{\\sqrt{N}}',
        visualStateKey: '+',
        options: [
          {
            id: 'opt-7-1-4a',
            label: 'It reflects all amplitudes about their mean, boosting the negative target amplitude into a tall positive spike while depressing all non-target amplitudes.',
            correct: true,
            feedback: 'Mathematical elegance at its finest! Because |w⟩ had a negative amplitude far below the mean μ, reflecting across μ flips it into a towering positive peak, while non-target states above the mean are pushed downward. This is Amplitude Amplification!'
          },
          {
            id: 'opt-7-1-4b',
            label: 'It inverts all amplitudes so positive becomes negative and negative becomes positive.',
            correct: false,
            misconceptionTag: 'SIMPLE_INVERSION',
            feedback: 'A simple inversion would flip everything back to the beginning. The diffusion operator reflects specifically across the mean vector |s⟩.'
          },
          {
            id: 'opt-7-1-4c',
            label: 'It deletes all states whose amplitude is negative.',
            correct: false,
            misconceptionTag: 'NON_UNITARY_DELETION',
            feedback: 'Quantum gates cannot delete states; the diffusion operator is unitary (D†D = I).'
          }
        ],
        socraticPunchline: 'The diffusion operator reflects amplitudes about their average, amplifying the marked state and suppressing noise.'
      },
      {
        stepNumber: 5,
        stageTitle: 'Optimal Iterations & Quadratic Speedup',
        conceptHook: 'Each Grover rotation (Oracle + Diffusion) rotates the statevector closer to |w⟩ in the 2D plane by angle 2θ, where sin(θ) = 1/√N.',
        pedagogicalPrompt: 'How many iterations k ≈ (π/4)√N should you apply, and what happens if you keep iterating beyond this optimal number?',
        thoughtHint: 'Rotation on a circle: if you keep rotating past the target axis, where does the vector go?',
        mathSnippet: 'k_{opt} \\approx \\frac{\\pi}{4}\\sqrt{N},   \\text{Complexity: } O(\\sqrt{N})',
        visualStateKey: '1',
        options: [
          {
            id: 'opt-7-1-5a',
            label: 'Apply k ≈ (π/4)√N iterations (O(√N) speedup); continuing further will over-rotate past |w⟩ and DECREASE the probability of success!',
            correct: true,
            feedback: 'Precisely! Grover’s algorithm is a continuous unitary rotation. After (π/4)√N steps, probability reaches near 100%. If you keep running it, the vector continues spinning past |w⟩, causing the success probability to plummet back toward zero. For N = 1,000,000, Grover solves it in ~785 queries vs. 500,000 classical queries!'
          },
          {
            id: 'opt-7-1-5b',
            label: 'Apply N iterations; more iterations always strictly increase probability to infinity.',
            correct: false,
            misconceptionTag: 'MONOTONIC_INCREASE',
            feedback: 'Quantum mechanics is oscillatory! Over-rotating decreases probability periodically like sin²((2k+1)θ).'
          },
          {
            id: 'opt-7-1-5c',
            label: 'Apply log₂(N) iterations to achieve exponential speedup.',
            correct: false,
            misconceptionTag: 'EXPONENTIAL_GROVER',
            feedback: 'Grover’s speedup is strictly quadratic O(√N), not exponential. Bennett, Bernstein, Brassard, and Vazirani (BBBV theorem) proved that O(√N) is the optimal theoretical limit for black-box search.'
          }
        ],
        socraticPunchline: 'Grover achieves optimal quadratic speedup O(√N) in k ≈ (π/4)√N iterations; over-rotation decreases success probability.'
      }
    ]
  }
};

/**
 * Fallback synthesizer that generates a high-yield 3-step Socratic ladder
 * for any curriculum topic that does not have an explicit custom entry in SOCRATIC_TOPIC_REGISTRY.
 */
export function getSocraticFlowForTopic(topic: Topic, chapter: Chapter): SocraticTopicFlow {
  if (SOCRATIC_TOPIC_REGISTRY[topic.id]) {
    return SOCRATIC_TOPIC_REGISTRY[topic.id];
  }

  // Generate structured 3-stage Socratic flow from topic metadata
  const youngText = topic.content.young?.[0] || topic.summary;
  const studentText = topic.content.student?.[0] || topic.summary;
  const check = topic.check;

  const correctOption = check.options.find(o => o.id === check.correctId) || check.options[0];
  const wrongOptions = check.options.filter(o => o.id !== check.correctId);

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    overview: topic.summary,
    domain: chapter.vault_domain,
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Intuitive Mental Model & The Classical Contradiction',
        conceptHook: `${youngText} In classical computing, states are binary and operations deterministic. But in ${topic.title}, quantum mechanics introduces physical constraints that challenge our intuition.`,
        pedagogicalPrompt: `When examining ${topic.title}, what is the foundational contradiction between classical physical intuition and quantum reality?`,
        thoughtHint: 'Consider whether quantum systems allow non-deterministic superposition or irreversible data loss.',
        mathSnippet: topic.mathFormula || '|ψ⟩ = α|0⟩ + β|1⟩',
        visualStateKey: '0',
        options: [
          {
            id: `${topic.id}-s1-opt1`,
            label: 'Quantum operations evolve as continuous unitary vector rotations that conserve total probability and allow wave interference.',
            correct: true,
            feedback: 'Exactly right! Unlike classical discrete switching, quantum state evolution preserves the complex vector norm in Hilbert space.'
          },
          {
            id: `${topic.id}-s1-opt2`,
            label: 'Quantum computers simply run classical logic gates at the speed of light without mathematical differences.',
            correct: false,
            misconceptionTag: 'CLASSICAL_IDENTITY',
            feedback: 'Quantum algorithms rely on Hilbert space superposition and phase interference, which have no classical equivalent.'
          },
          {
            id: `${topic.id}-s1-opt3`,
            label: 'Quantum particles can duplicate arbitrary unknown states effortlessly.',
            correct: false,
            misconceptionTag: 'CLONING_FALLACY',
            feedback: 'The No-Cloning Theorem strictly prohibits duplicating an unknown quantum state.'
          }
        ],
        socraticPunchline: 'Quantum physical phenomena conserve the continuous complex probability norm rather than discrete binary values.'
      },
      {
        stepNumber: 2,
        stageTitle: 'Mathematical Formulation & Operator Dynamics',
        conceptHook: `Formally, ${studentText}`,
        pedagogicalPrompt: `What mathematical principle guarantees the physical validity of ${topic.title}?`,
        thoughtHint: 'Check how normalization and unitary operators (U†U = I) protect probability conservation.',
        mathSnippet: topic.mathFormula || 'U† U = I,   ⟨ψ|ψ⟩ = 1',
        visualStateKey: '+',
        options: [
          {
            id: `${topic.id}-s2-opt1`,
            label: 'Unitary preservation: all state transformations must be reversible and preserve inner products (total probability = 100%).',
            correct: true,
            feedback: 'Precisely! All physical quantum dynamics in closed systems must preserve the inner product ⟨ψ|ψ⟩ = 1.'
          },
          {
            id: `${topic.id}-s2-opt2`,
            label: 'Non-linear amplification that allows total probability to exceed 100% during processing.',
            correct: false,
            misconceptionTag: 'NON_LINEAR_GROWTH',
            feedback: 'Probability amplitudes can never sum to more than 1.0 (Born rule).'
          },
          {
            id: `${topic.id}-s2-opt3`,
            label: 'Classical binary rounding after every intermediate gate.',
            correct: false,
            misconceptionTag: 'INTERMEDIATE_COLLAPSE',
            feedback: 'Intermediate projective rounding destroys quantum coherence and phase interference.'
          }
        ],
        socraticPunchline: 'Mathematical rigor requires unitary operator evolution to guarantee probability conservation.'
      },
      {
        stepNumber: 3,
        stageTitle: 'Formative Synthesis & Verification',
        conceptHook: `Now let us test your synthesized mastery on an applied problem: ${check.prompt}`,
        pedagogicalPrompt: check.prompt,
        thoughtHint: check.explanation.slice(0, 100) + '...',
        mathSnippet: topic.mathFormula,
        visualStateKey: '1',
        options: check.options.map(opt => ({
          id: opt.id,
          label: opt.label,
          correct: opt.id === check.correctId,
          feedback: opt.id === check.correctId
            ? `Correct! ${check.explanation}`
            : `Reconsider: this choice conflicts with the core principle. Hint: ${check.explanation}`
        })),
        socraticPunchline: check.explanation
      }
    ]
  };
}
