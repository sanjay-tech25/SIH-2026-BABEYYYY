export type NavId =
  | 'dashboard'
  | 'courses'
  | 'path'
  | 'circuits'
  | 'openlab'
  | 'assessments'
  | 'progress'
  | 'achievements'
  | 'profile'
  | 'instructor'
  | 'settings';

export type ViewId = NavId | 'landing' | 'onboarding' | 'lesson' | 'practice' | 'results';

export type Course = {
  id: string;
  title: string;
  summary: string;
  lessonsDone: number;
  lessonsTotal: number;
  minutesLeft: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'in-progress' | 'done' | 'not-started';
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
  name: 'Manoj',
  level: 1,
  xp: 0,
  xpTarget: 500,
  goal: 'Quantum computing fundamentals',
  streakDays: 0
};

export const courses: Course[] = [
{
  id: 'c1',
  title: 'Qubits & the Bloch sphere',
  summary: 'Build an intuition for superposition using geometry instead of algebra.',
  lessonsDone: 0,
  lessonsTotal: 12,
  minutesLeft: 120,
  level: 'Beginner',
  status: 'in-progress'
},
{
  id: 'c2',
  title: 'Linear algebra for quantum',
  summary: 'Vectors, inner products and unitary matrices, taught through worked examples.',
  lessonsDone: 0,
  lessonsTotal: 14,
  minutesLeft: 140,
  level: 'Beginner',
  status: 'not-started'
},
{
  id: 'c3',
  title: 'Neural networks from scratch',
  summary: 'Backpropagation, loss curves and regularisation with hands-on notebooks.',
  lessonsDone: 0,
  lessonsTotal: 16,
  minutesLeft: 160,
  level: 'Intermediate',
  status: 'not-started'
},
{
  id: 'c4',
  title: 'Quantum algorithms',
  summary: 'Grover, Deutsch–Jozsa and Shor, one circuit at a time.',
  lessonsDone: 0,
  lessonsTotal: 18,
  minutesLeft: 210,
  level: 'Advanced',
  status: 'not-started'
}];


export const todaysPlan: PlanItem[] = [
{ id: 'p1', title: 'Phase gates and rotations', kind: 'Lesson', minutes: 12, done: false },
{ id: 'p2', title: 'Practise 8 Bloch sphere questions', kind: 'Practice', minutes: 10, done: false },
{ id: 'p3', title: 'Revisit inner products', kind: 'Review', minutes: 6, done: false }];


export const pathSteps: PathStep[] = [
{
  id: 's1',
  index: 1,
  title: 'Linear algebra & complex numbers',
  summary: 'Vectors, bases and complex amplitudes.',
  score: 0,
  state: 'current',
  lessons: ['Vector spaces', 'Complex amplitudes', 'Inner products']
},
{
  id: 's2',
  index: 2,
  title: 'Probability & unitary operators',
  summary: 'Measurement outcomes and norm preservation.',
  score: 0,
  state: 'upcoming',
  lessons: ['Probability review', 'Unitary matrices', 'Measurement basics']
},
{
  id: 's3',
  index: 3,
  title: 'Qubits & the Bloch sphere',
  summary: 'Reading a qubit state off a sphere.',
  score: 0,
  state: 'upcoming',
  lessons: ['One qubit', 'Bloch coordinates', 'Global phase']
},
{
  id: 's4',
  index: 4,
  title: 'Superposition & phase gates',
  summary: 'Hadamard state generation and geometric phase rotation.',
  score: 0,
  state: 'upcoming',
  lessons: ['Hadamard gate', 'Phase gates & rotations', 'Interference']
},
{
  id: 's5',
  index: 5,
  title: 'Entanglement & two-qubit gates',
  summary: 'Opens once you complete single-qubit rotations.',
  score: 0,
  state: 'upcoming',
  lessons: ['CNOT', 'Bell states', 'Teleportation']
},
{
  id: 's6',
  index: 6,
  title: 'Quantum algorithms',
  summary: 'Capstone search algorithms and oracle synthesis.',
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
  bestScore: null,
  kind: 'Diagnostic'
},
{
  id: 'a2',
  title: 'Quantum circuit fundamentals',
  summary: 'Tests your baseline on qubits, gates and entanglement.',
  questions: 10,
  minutes: 12,
  bestScore: null,
  kind: 'Skill check'
}];


export const pastAttempts: { id: string; title: string; date: string; score: number; missed: number }[] = [];


export const badges: Badge[] = [
{
  id: 'b1',
  title: 'First lesson finished',
  summary: 'Complete your opening module end to end.',
  progress: { value: 0, target: 1, unit: 'lesson' }
},
{
  id: 'b2',
  title: 'Seven days in a row',
  summary: 'Study every day for a full week.',
  progress: { value: 0, target: 7, unit: 'days' }
},
{
  id: 'b3',
  title: 'Scored above 85%',
  summary: 'Clear a diagnostic assessment with distinction.',
  progress: { value: 0, target: 85, unit: '%' }
},
{
  id: 'b4',
  title: 'Ten topics mastered',
  summary: 'Master ten separate curriculum topics.',
  progress: { value: 0, target: 10, unit: 'topics' }
},
{
  id: 'b5',
  title: 'Reach Tier 2 Competency',
  summary: 'Earn 350 Competency Points to advance your competency tier.',
  progress: { value: 0, target: 350, unit: 'CP' }
},
{
  id: 'b6',
  title: 'Fourteen days in a row',
  summary: 'Keep one study session a day going for two weeks.',
  progress: { value: 0, target: 14, unit: 'days' }
}];


export const skills: Skill[] = [
{ name: 'Mathematical Foundations', mastery: 0 },
{ name: 'Single-Qubit Gates', mastery: 0 },
{ name: 'Bloch Sphere Geometry', mastery: 0 },
{ name: 'Quantum Entanglement', mastery: 0 },
{ name: 'Quantum Algorithms', mastery: 0 }];


export const weeklyMinutes = [
{ day: 'Mon', minutes: 0 },
{ day: 'Tue', minutes: 0 },
{ day: 'Wed', minutes: 0 },
{ day: 'Thu', minutes: 0 },
{ day: 'Fri', minutes: 0 },
{ day: 'Sat', minutes: 0 },
{ day: 'Sun', minutes: 0 }];


// 28 days of activity, 0 intensity initially.
export const activity: number[] = new Array(28).fill(0);