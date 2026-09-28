export type NavId =
  | 'dashboard'
  | 'courses'
  | 'path'
  | 'circuits'
  | 'openlab'
  | 'assessments'
  | 'progress'
  | 'achievements'
  | 'settings';

export type ViewId = NavId | 'landing' | 'onboarding' | 'lesson' | 'practice' | 'results' | 'profile' | 'instructor' | 'chapter-lab';

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    minutes: number;
    xp: number;
  }[];
};

export type Course = {
  id: string;
  title: string;
  summary: string;
  lessonsDone: number;
  lessonsTotal: number;
  minutesLeft: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'in-progress' | 'done' | 'not-started';
  modules?: CourseModule[];
};

export type PlanItem = {
  id: string;
  title: string;
  kind: 'Lesson' | 'Practice' | 'Review';
  minutes: number;
  done: boolean;
};

export type PathStep = {
  id: string;
  index: number;
  title: string;
  summary: string;
  score: number;
  state: 'mastered' | 'current' | 'upcoming';
  lessons: string[];
};

export type Assessment = {
  id: string;
  title: string;
  summary: string;
  questions: number;
  minutes: number;
  bestScore: number | null;
  kind: 'Diagnostic' | 'Skill check';
};

export type Badge = {
  id: string;
  title: string;
  summary: string;
  earnedOn?: string;
  progress?: {value: number;target: number;unit: string;};
};

export type Skill = {
  name: string;
  mastery: number;
};

export const learner = {
  name: 'Aarav',
  level: 4,
  xp: 3450,
  xpTarget: 4500,
  goal: 'Quantum computing fundamentals',
  streakDays: 7
};

export const courses: Course[] = [
  {
    id: 'c-1',
    title: 'Introduction to Quantum Computing & Circuits',
    summary: 'Master the foundations of quantum mechanics, state vectors, superposition, entanglement, and build circuits in the Qiskit simulator.',
    lessonsDone: 8,
    lessonsTotal: 12,
    minutesLeft: 45,
    level: 'Beginner',
    status: 'in-progress',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: The Quantum Bit & Superposition',
        description: 'From classical bits to continuous probability amplitudes.',
        lessons: [
          { id: 'l1', title: 'Understanding Quantum Superposition', minutes: 15, xp: 50 },
          { id: 'l2', title: 'The Bloch Sphere & State Vectors', minutes: 15, xp: 50 }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Quantum Logic Gates & Entanglement',
        description: 'Manipulating multi-qubit states and creating Bell pairs.',
        lessons: [
          { id: 'l3', title: 'Quantum Logic Gates (H, X, CX)', minutes: 20, xp: 60 },
          { id: 'l4', title: 'Creating the Bell State |Φ+⟩', minutes: 25, xp: 75 }
        ]
      }
    ]
  },
  {
    id: 'c-2',
    title: 'Quantum Logic Gates & Unitary Operators',
    summary: 'Explore Pauli X/Y/Z matrices, Phase S and T rotations, Rotation gates (Rx, Ry, Rz), and multi-qubit CNOT/CZ entanglement.',
    lessonsDone: 9,
    lessonsTotal: 14,
    minutesLeft: 50,
    level: 'Intermediate',
    status: 'in-progress',
    modules: [
      {
        id: 'm3',
        title: 'Module 1: Single-Qubit Unitary Rotations',
        description: 'Hadamard, Pauli rotations, and Phase gate transformations on the Bloch sphere.',
        lessons: [
          { id: 'l5', title: 'Pauli X, Y, Z & Phase Inversion', minutes: 15, xp: 50 },
          { id: 'l6', title: 'Phase Gates S & T (π/2 and π/4)', minutes: 20, xp: 60 }
        ]
      },
      {
        id: 'm4',
        title: 'Module 2: Multi-Qubit Controlled Gates',
        description: 'CNOT, CZ, SWAP, and Toffoli (CCX) reversible logic.',
        lessons: [
          { id: 'l7', title: 'Controlled-Z & Phase Kickback', minutes: 25, xp: 70 },
          { id: 'l8', title: 'SWAP Gate & State Transfer', minutes: 20, xp: 60 }
        ]
      }
    ]
  },
  {
    id: 'c-3',
    title: 'Quantum Communication Protocols & Cryptography',
    summary: 'Quantum teleportation, superdense coding, no-cloning theorem, and BB84 quantum key distribution.',
    lessonsDone: 0,
    lessonsTotal: 16,
    minutesLeft: 120,
    level: 'Intermediate',
    status: 'not-started',
    modules: [
      {
        id: 'm5',
        title: 'Module 1: Non-Locality & Teleportation',
        description: 'Bell inequality violations, CHSH game, and quantum teleportation protocols.',
        lessons: [
          { id: 'l9', title: 'Quantum Teleportation Circuit', minutes: 30, xp: 80 },
          { id: 'l10', title: 'Superdense Coding Protocol', minutes: 25, xp: 75 }
        ]
      },
      {
        id: 'm6',
        title: 'Module 2: Quantum Key Distribution',
        description: 'Eavesdropper detection via BB84 & E91 entanglement protocols.',
        lessons: [
          { id: 'l11', title: 'BB84 Protocol Simulation', minutes: 25, xp: 75 },
          { id: 'l12', title: 'No-Cloning Theorem Proof', minutes: 20, xp: 60 }
        ]
      }
    ]
  },
  {
    id: 'c-4',
    title: 'Foundational Quantum Algorithms & NISQ Hardware',
    summary: "Grover's amplitude amplification, Deutsch-Jozsa, phase kickback, quantum error correction, and NISQ hardware constraints.",
    lessonsDone: 0,
    lessonsTotal: 18,
    minutesLeft: 210,
    level: 'Advanced',
    status: 'not-started',
    modules: [
      {
        id: 'm7',
        title: 'Module 1: Quantum Oracle Algorithms',
        description: 'Deutsch-Jozsa, Bernstein-Vazirani, and phase oracle construction.',
        lessons: [
          { id: 'l13', title: 'Deutsch-Jozsa Algorithm', minutes: 30, xp: 85 },
          { id: 'l14', title: "Grover's Search Algorithm & Diffusion", minutes: 35, xp: 100 }
        ]
      },
      {
        id: 'm8',
        title: 'Module 2: Quantum Error Mitigation & NISQ',
        description: 'Decoherence, depolarizing noise models, and stabilizer codes.',
        lessons: [
          { id: 'l15', title: 'Bit-Flip & Phase-Flip Codes', minutes: 30, xp: 80 },
          { id: 'l16', title: 'NISQ Noise & Depolarizing Channels', minutes: 30, xp: 85 }
        ]
      }
    ]
  }
];

export const todaysPlan: PlanItem[] = [
  { id: 'p1', title: 'Quantum Logic Gates (H, X, CX)', kind: 'Lesson', minutes: 15, done: true },
  { id: 'p2', title: 'Synthesize Bell State |Φ+⟩ in Circuit Lab', kind: 'Practice', minutes: 12, done: false },
  { id: 'p3', title: 'Revisit Bloch Sphere & Superposition', kind: 'Review', minutes: 8, done: false }
];


export const pathSteps: PathStep[] = [
{
  id: 's1',
  index: 1,
  title: 'Linear algebra & complex numbers',
  summary: 'Vectors, bases and complex amplitudes.',
  score: 96,
  state: 'mastered',
  lessons: ['Vector spaces', 'Complex amplitudes', 'Inner products']
},
{
  id: 's2',
  index: 2,
  title: 'Probability & unitary operators',
  summary: 'Measurement outcomes and norm preservation.',
  score: 91,
  state: 'mastered',
  lessons: ['Probability review', 'Unitary matrices', 'Measurement basics']
},
{
  id: 's3',
  index: 3,
  title: 'Qubits & the Bloch sphere',
  summary: 'Reading a qubit state off a sphere.',
  score: 84,
  state: 'mastered',
  lessons: ['One qubit', 'Bloch coordinates', 'Global phase']
},
{
  id: 's4',
  index: 4,
  title: 'Superposition & phase gates',
  summary: 'You are here. Two lessons left before the next check.',
  score: 72,
  state: 'current',
  lessons: ['Hadamard gate', 'Phase gates & rotations', 'Interference']
},
{
  id: 's5',
  index: 5,
  title: 'Entanglement & two-qubit gates',
  summary: 'Opens once you reach 80% on superposition.',
  score: 0,
  state: 'upcoming',
  lessons: ['CNOT', 'Bell states', 'Teleportation']
},
{
  id: 's6',
  index: 6,
  title: 'Quantum algorithms',
  summary: 'The final stretch of your goal.',
  score: 0,
  state: 'upcoming',
  lessons: ['Grover search', "Deutsch–Jozsa", 'Shor overview']
}];


export const assessments: Assessment[] = [
{
  id: 'a1',
  title: 'Neural networks benchmark',
  summary: 'Checks how well you handle backpropagation, loss metrics and regularisation.',
  questions: 14,
  minutes: 8,
  bestScore: 88,
  kind: 'Diagnostic'
},
{
  id: 'a2',
  title: 'Quantum circuit fundamentals',
  summary: 'Tests your baseline on qubits, gates and entanglement before level 5.',
  questions: 10,
  minutes: 12,
  bestScore: null,
  kind: 'Skill check'
}];


export const pastAttempts = [
{ id: 'r1', title: 'Bloch sphere checkpoint', date: 'Sept 9', score: 92, missed: 1 },
{ id: 'r2', title: 'Unitary operators quiz', date: 'Sept 5', score: 81, missed: 3 },
{ id: 'r3', title: 'Linear algebra diagnostic', date: 'Aug 28', score: 95, missed: 1 }];


export const badges: Badge[] = [
{
  id: 'b1',
  title: 'First lesson finished',
  summary: 'You completed your opening module end to end.',
  earnedOn: 'Sept 1, 2026'
},
{
  id: 'b2',
  title: 'Seven days in a row',
  summary: 'You studied every day for a full week.',
  earnedOn: 'Sept 7, 2026'
},
{
  id: 'b3',
  title: 'Scored above 85%',
  summary: 'You cleared a level 4 diagnostic on the first attempt.',
  earnedOn: 'Sept 10, 2026'
},
{
  id: 'b4',
  title: 'Ten topics mastered',
  summary: 'Ten separate topics above 90% accuracy.',
  earnedOn: 'Sept 9, 2026'
},
{
  id: 'b5',
  title: 'Reach level 5',
  summary: 'Earn 4,500 XP to move up a level.',
  progress: { value: 3450, target: 4500, unit: 'XP' }
},
{
  id: 'b6',
  title: 'Fourteen days in a row',
  summary: 'Keep one study session a day going for two weeks.',
  progress: { value: 7, target: 14, unit: 'days' }
}];


export const skills: Skill[] = [
{ name: 'Neural networks', mastery: 88 },
{ name: 'Linear algebra', mastery: 95 },
{ name: 'Quantum algorithms', mastery: 62 },
{ name: 'Circuit design', mastery: 71 },
{ name: 'Probability', mastery: 83 }];


export const weeklyMinutes = [
{ day: 'Mon', minutes: 48 },
{ day: 'Tue', minutes: 22 },
{ day: 'Wed', minutes: 65 },
{ day: 'Thu', minutes: 82 },
{ day: 'Fri', minutes: 35 },
{ day: 'Sat', minutes: 74 },
{ day: 'Sun', minutes: 76 }];


// 28 days of activity, 0–3 intensity.
export const activity: number[] = [
1, 2, 3, 0, 2, 3, 1, 0, 3, 1, 2, 0, 1, 2, 3, 0, 2, 2, 1, 0, 3, 1, 2, 0, 1, 2, 3, 2];