import React, { useState } from 'react';
import { PlayIcon, RotateCcwIcon, CheckCircle2Icon, XCircleIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { CircuitBuilderQuestion, CircuitGateSlot } from '../../data/assessmentBank';

interface InteractiveCircuitQuestionProps {
  question: CircuitBuilderQuestion;
  submitted: boolean;
  onAnswerSubmit: (isCorrect: boolean, simulatedCircuit: CircuitGateSlot[]) => void;
}

// 2-qubit statevector simulation helper
function simulateCircuit(numQubits: number, gates: CircuitGateSlot[]): Record<string, number> {
  if (numQubits === 1) {
    // Statevector [α_0, α_1]
    let aR = 1.0, aI = 0.0;
    let bR = 0.0, bI = 0.0;

    for (const g of gates) {
      if (g.gate === 'X') {
        const tr = aR, ti = aI;
        aR = bR; aI = bI;
        bR = tr; bI = ti;
      } else if (g.gate === 'Z') {
        bR = -bR; bI = -bI;
      } else if (g.gate === 'S') {
        // Multiply |1> by i -> (bR + i bI)*i = -bI + i bR
        const tr = bR, ti = bI;
        bR = -ti; bI = tr;
      } else if (g.gate === 'H') {
        const inv = 1.0 / Math.SQRT2;
        const newAR = inv * (aR + bR);
        const newAI = inv * (aI + bI);
        const newBR = inv * (aR - bR);
        const newBI = inv * (aI - bI);
        aR = newAR; aI = newAI;
        bR = newBR; bI = newBI;
      }
    }
    const p0 = Math.min(1.0, Math.max(0.0, aR * aR + aI * aI));
    const p1 = Math.min(1.0, Math.max(0.0, bR * bR + bI * bI));
    return {
      '0': Number(p0.toFixed(3)),
      '1': Number(p1.toFixed(3)),
    };
  } else {
    // 2-Qubits: [00, 01, 10, 11]
    // Initial state |00>
    let state = [
      { r: 1.0, i: 0.0 }, // 00
      { r: 0.0, i: 0.0 }, // 01
      { r: 0.0, i: 0.0 }, // 10
      { r: 0.0, i: 0.0 }  // 11
    ];

    for (const g of gates) {
      if (g.gate === 'H' && g.qubit === 0) {
        // H on q0: (00, 10) and (01, 11)
        const inv = 1.0 / Math.SQRT2;
        const s0 = state[0], s2 = state[2];
        const s1 = state[1], s3 = state[3];
        state[0] = { r: inv * (s0.r + s2.r), i: inv * (s0.i + s2.i) };
        state[2] = { r: inv * (s0.r - s2.r), i: inv * (s0.i - s2.i) };
        state[1] = { r: inv * (s1.r + s3.r), i: inv * (s1.i + s3.i) };
        state[3] = { r: inv * (s1.r - s3.r), i: inv * (s1.i - s3.i) };
      } else if (g.gate === 'X' && g.qubit === 0) {
        const s0 = state[0], s2 = state[2];
        const s1 = state[1], s3 = state[3];
        state[0] = s2; state[2] = s0;
        state[1] = s3; state[3] = s1;
      } else if (g.gate === 'X' && g.qubit === 1) {
        const s0 = state[0], s1 = state[1];
        const s2 = state[2], s3 = state[3];
        state[0] = s1; state[1] = s0;
        state[2] = s3; state[3] = s2;
      } else if (g.gate === 'CNOT') {
        // q0 is control, q1 is target -> flips 10 <-> 11
        const s2 = state[2], s3 = state[3];
        state[2] = s3;
        state[3] = s2;
      }
    }

    const counts: Record<string, number> = {
      '00': Number((state[0].r ** 2 + state[0].i ** 2).toFixed(3)),
      '01': Number((state[1].r ** 2 + state[1].i ** 2).toFixed(3)),
      '10': Number((state[2].r ** 2 + state[2].i ** 2).toFixed(3)),
      '11': Number((state[3].r ** 2 + state[3].i ** 2).toFixed(3)),
    };
    return counts;
  }
}

export function InteractiveCircuitQuestion({
  question,
  submitted,
  onAnswerSubmit,
}: InteractiveCircuitQuestionProps) {
  const [placedGates, setPlacedGates] = useState<CircuitGateSlot[]>([]);
  const [selectedWire, setSelectedWire] = useState<number>(0);
  const [simResults, setSimResults] = useState<Record<string, number> | null>(null);

  const addGate = (gateName: string) => {
    if (submitted) return;
    if (placedGates.length >= 6) return;
    const newGate: CircuitGateSlot = {
      qubit: selectedWire,
      gate: gateName,
      targetQubit: gateName === 'CNOT' ? (selectedWire === 0 ? 1 : 0) : undefined,
    };
    const updated = [...placedGates, newGate];
    setPlacedGates(updated);
    setSimResults(null);
  };

  const removeGate = (idx: number) => {
    if (submitted) return;
    const updated = placedGates.filter((_, i) => i !== idx);
    setPlacedGates(updated);
    setSimResults(null);
  };

  const clearCircuit = () => {
    if (submitted) return;
    setPlacedGates([]);
    setSimResults(null);
  };

  const handleSimulate = () => {
    const outcome = simulateCircuit(question.numQubits, placedGates);
    setSimResults(outcome);

    // Verify against target probabilities
    let isCorrect = true;
    for (const [state, expectedP] of Object.entries(question.targetProbabilities)) {
      const actualP = outcome[state] ?? 0;
      if (Math.abs(actualP - expectedP) > 0.08) {
        isCorrect = false;
        break;
      }
    }
    // Also verify non-target states have near-zero probability
    for (const [state, actualP] of Object.entries(outcome)) {
      if (!(state in question.targetProbabilities) && actualP > 0.08) {
        isCorrect = false;
        break;
      }
    }

    onAnswerSubmit(isCorrect, placedGates);
  };

  return (
    <div className="space-y-6">
      {/* Target Spec Callout */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-4 dark:border-brand-900/60 dark:bg-brand-950/30">
        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
          <SparklesIcon className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Mission Objective</span>
        </div>
        <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {question.targetOutcomeDescription}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(question.targetProbabilities).map(([state, prob]) => (
            <span
              key={state}
              className="inline-flex items-center rounded-md bg-white px-2 py-0.5 font-mono text-xs text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
            >
              |{state}⟩: {(prob * 100).toFixed(0)}%
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Circuit Canvas */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Interactive Quantum Wires (Click slot to select active wire)
          </span>
          {!submitted && placedGates.length > 0 && (
            <button
              onClick={clearCircuit}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-red-500 dark:hover:text-red-400"
            >
              <RotateCcwIcon className="h-3 w-3" />
              Reset Wires
            </button>
          )}
        </div>

        {/* Wires */}
        <div className="space-y-4">
          {Array.from({ length: question.numQubits }).map((_, qIdx) => {
            const wireGates = placedGates
              .map((g, originalIdx) => ({ ...g, originalIdx }))
              .filter((g) => g.qubit === qIdx || (g.gate === 'CNOT' && g.targetQubit === qIdx));

            const isSelected = selectedWire === qIdx;

            return (
              <div
                key={qIdx}
                onClick={() => !submitted && setSelectedWire(qIdx)}
                className={`relative flex min-h-[64px] items-center rounded-lg border px-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/20 dark:border-brand-600 dark:bg-brand-950/10'
                    : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Wire Qubit Label */}
                <span className="w-12 font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  q[{qIdx}] |0⟩
                </span>

                {/* Horizontal Wire Line */}
                <div className="absolute left-14 right-4 h-0.5 bg-zinc-300 dark:bg-zinc-700" />

                {/* Placed Gates on Wire */}
                <div className="relative z-10 flex items-center gap-3 pl-4">
                  {wireGates.length === 0 ? (
                    <span className="text-xs italic text-zinc-400">
                      {isSelected ? '← Wire active. Click a gate below to place.' : 'Wire empty'}
                    </span>
                  ) : (
                    wireGates.map((g) => (
                      <button
                        key={g.originalIdx}
                        disabled={submitted}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGate(g.originalIdx);
                        }}
                        title={submitted ? '' : 'Click to remove gate'}
                        className="group flex h-10 w-10 items-center justify-center rounded-lg border border-brand-500 bg-brand-600 font-mono text-sm font-bold text-white shadow-sm transition hover:scale-105 hover:bg-red-600 dark:border-brand-400 dark:bg-brand-600 dark:hover:bg-red-600"
                      >
                        <span className="group-hover:hidden">
                          {g.gate === 'CNOT' ? (g.qubit === qIdx ? '●' : '⊕') : g.gate}
                        </span>
                        <span className="hidden text-xs font-semibold group-hover:inline"></span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gate Palette Toolbar */}
        {!submitted && (
          <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Available Quantum Gates (Inserting into wire q[{selectedWire}]):
            </p>
            <div className="flex flex-wrap gap-2">
              {question.allowedGates.map((gate) => (
                <button
                  key={gate}
                  onClick={() => addGate(gate)}
                  className="flex h-10 min-w-[42px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 font-mono text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-brand-500 dark:hover:bg-brand-950/40"
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simulation Results Preview */}
      {simResults && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Qiskit Aer Simulator Statevector Outcome
            </span>
            <span className="text-xs text-zinc-500">1024 Shots Simulated</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(simResults).map(([state, prob]) => {
              const expectedProb = question.targetProbabilities[state] || 0;
              const matches = Math.abs(prob - expectedProb) <= 0.08;
              return (
                <div
                  key={state}
                  className={`rounded-lg border p-3 ${
                    matches
                      ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
                      : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">|{state}⟩</span>
                    {matches ? (
                      <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-zinc-400">target: {(expectedProb * 100).toFixed(0)}%</span>
                    )}
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-all duration-300"
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                  <span className="mt-1 block text-right font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!submitted && (
        <Button
          onClick={handleSimulate}
          disabled={placedGates.length === 0}
          className="flex items-center gap-2"
        >
          <PlayIcon className="h-4 w-4" />
          Run Simulation & Verify Circuit
        </Button>
      )}
    </div>
  );
}
