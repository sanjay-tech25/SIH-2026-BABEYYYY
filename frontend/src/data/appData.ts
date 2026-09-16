export type NavId =
  | 'dashboard'
  | 'courses'
  | 'path'
  | 'circuits'
  | 'openlab'
  | 'assessments'
  | 'tutor'
  | 'progress'
  | 'achievements'
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
  name: 'Aarav',
  level: 4,
  xp: 3450,
  xpTarget: 4500,
  goal: 'Quantum computing fundamentals',
  streakDays: 7
};

export const courses: Course[] = [
{
  id: 'c1',
  title: 'Qubits & the Bloch sphere',
  summary: 'Build an intuition for superposition using geometry instead of algebra.',
  lessonsDone: 7,
  lessonsTotal: 12,
  minutesLeft: 55,
  level: 'Intermediate',
  status: 'in-progress'
},
{
  id: 'c2',
  title: 'Linear algebra for quantum',
  summary: 'Vectors, inner products and unitary matrices, taught through worked examples.',
  lessonsDone: 14,
  lessonsTotal: 14,
  minutesLeft: 0,
  level: 'Beginner',
  status: 'done'
},
{
  id: 'c3',
  title: 'Neural networks from scratch',
  summary: 'Backpropagation, loss curves and regularisation with hands-on notebooks.',
  lessonsDone: 5,
  lessonsTotal: 16,
  minutesLeft: 140,
  level: 'Intermediate',
  status: 'in-progress'
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
{ id: 'p1', title: 'Phase gates and rotations', kind: 'Lesson', minutes: 12, done: true },
{ id: 'p2', title: 'Practise 8 Bloch sphere questions', kind: 'Practice', minutes: 10, done: false },
{ id: 'p3', title: 'Revisit inner products', kind: 'Review', minutes: 6, done: false }];


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