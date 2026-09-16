export type LessonBlock =
{kind: 'text';id: string;body: string;} |
{kind: 'heading';id: string;body: string;} |
{kind: 'callout';id: string;title: string;body: string;} |
{kind: 'formula';id: string;body: string;caption: string;} |
{kind: 'list';id: string;items: string[];};

export type KnowledgeCheck = {
  prompt: string;
  options: {id: string;label: string;}[];
  correctId: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  index: number;
  title: string;
  course: string;
  minutes: number;
  blocks: LessonBlock[];
  check: KnowledgeCheck;
};

export const lessonOutline = [
{ id: 'l6', title: 'The Hadamard gate', done: true },
{ id: 'l7', title: 'Reading interference', done: true },
{ id: 'l8', title: 'Phase gates and rotations', done: false },
{ id: 'l9', title: 'Combining gates', done: false },
{ id: 'l10', title: 'Checkpoint: superposition', done: false }];


export const currentLesson: Lesson = {
  id: 'l8',
  index: 8,
  title: 'Phase gates and rotations',
  course: 'Qubits & the Bloch sphere',
  minutes: 12,
  blocks: [
  {
    kind: 'text',
    id: 'b1',
    body: "A phase gate is the first gate that does something you cannot see in a measurement. Run it on a qubit, measure straight away, and the result looks unchanged. Its effect only shows up later, when two paths meet again."
  },
  { kind: 'heading', id: 'b2', body: 'What the gate actually does' },
  {
    kind: 'text',
    id: 'b3',
    body: "On the Bloch sphere, a phase gate spins the state around the vertical axis. The distance from the north pole stays fixed, which is why the probability of measuring 0 or 1 never moves. What changes is where the state sits around the equator."
  },
  {
    kind: 'formula',
    id: 'b4',
    body: 'S = [ 1  0 ; 0  i ]',
    caption: 'The S gate: a quarter turn around the vertical axis.'
  },
  {
    kind: 'text',
    id: 'b5',
    body: "Because the top-left entry is 1, the |0⟩ part of the state is untouched. The |1⟩ part gets multiplied by i, a quarter turn in the complex plane. Swap i for −1 and you have the Z gate, a half turn."
  },
  { kind: 'heading', id: 'b6', body: 'Why it matters' },
  {
    kind: 'list',
    id: 'b7',
    items: [
    'Phase is invisible to a single measurement.',
    'Interference turns phase differences into probability differences.',
    'Every useful quantum algorithm depends on that conversion.']

  },
  {
    kind: 'callout',
    id: 'b8',
    title: 'A common mix-up',
    body: "Global phase — multiplying the whole state by i — changes nothing at all. Only the relative phase between |0⟩ and |1⟩ has any physical effect."
  }],

  check: {
    prompt: 'You apply an S gate and measure immediately. What happens to the odds of getting 1?',
    options: [
    { id: 'o1', label: 'They double' },
    { id: 'o2', label: 'They stay exactly the same' },
    { id: 'o3', label: 'They drop to zero' },
    { id: 'o4', label: 'It depends on the previous gate' }],

    correctId: 'o2',
    explanation:
    'A phase gate only rotates around the vertical axis, so the height on the Bloch sphere — and therefore every measurement probability — is unchanged.'
  }
};

export type PracticeQuestion = {
  id: string;
  concept: string;
  prompt: string;
  options: {id: string;label: string;}[];
  correctId: string;
  explanation: string;
  hint: string;
};

export const practiceSet: PracticeQuestion[] = [
{
  id: 'q1',
  concept: 'Phase gates',
  prompt: 'Which gate leaves both measurement probabilities untouched?',
  options: [
  { id: 'a', label: 'Hadamard' },
  { id: 'b', label: 'Pauli-X' },
  { id: 'c', label: 'S gate' },
  { id: 'd', label: 'CNOT' }],

  correctId: 'c',
  explanation:
  'The S gate rotates around the vertical axis. Hadamard and X both move the state up or down the sphere, which changes the probabilities.',
  hint: 'Think about which axis the rotation happens around.'
},
{
  id: 'q2',
  concept: 'Bloch sphere',
  prompt: 'A qubit sits on the equator of the Bloch sphere. What are the odds of measuring 0?',
  options: [
  { id: 'a', label: '0%' },
  { id: 'b', label: '50%' },
  { id: 'c', label: '100%' },
  { id: 'd', label: 'Not enough information' }],

  correctId: 'b',
  explanation:
  'Height on the sphere sets the probabilities. The equator sits exactly halfway between the poles, so both outcomes are equally likely.',
  hint: 'The poles are the certain outcomes. Where does the equator sit relative to them?'
},
{
  id: 'q3',
  concept: 'Global phase',
  prompt: 'You multiply an entire qubit state by −1. What changes?',
  options: [
  { id: 'a', label: 'Nothing observable' },
  { id: 'b', label: 'The measurement flips' },
  { id: 'c', label: 'The state becomes invalid' },
  { id: 'd', label: 'It moves to the south pole' }],

  correctId: 'a',
  explanation:
  'Global phase has no physical effect. Only the relative phase between |0⟩ and |1⟩ can be detected, and that needs interference.',
  hint: 'Ask whether any measurement could tell the two states apart.'
},
{
  id: 'q4',
  concept: 'Interference',
  prompt: 'Why does a phase difference matter if it is invisible to measurement?',
  options: [
  { id: 'a', label: 'It changes the qubit energy' },
  { id: 'b', label: 'It turns into probability once paths interfere' },
  { id: 'c', label: 'It makes the qubit more stable' },
  { id: 'd', label: 'It speeds up the circuit' }],

  correctId: 'b',
  explanation:
  'Interference converts phase into amplitude. That conversion is the whole engine behind Grover and Shor.',
  hint: 'What happens when two paths recombine after a second Hadamard?'
}];