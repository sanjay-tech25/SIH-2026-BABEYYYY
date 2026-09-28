// Ultra-fast client-side Quantum Simulation Engine for up to 4 qubits
// Evaluates exact statevectors, Dirac bra-ket notation, measurement probabilities, and Bloch coordinates

export interface Complex {
  r: number;
  i: number;
}

const c = (r: number, i = 0): Complex => ({ r, i });
const add = (a: Complex, b: Complex): Complex => ({ r: a.r + b.r, i: a.i + b.i });
const mul = (a: Complex, b: Complex): Complex => ({
  r: a.r * b.r - a.i * b.i,
  i: a.r * b.i + a.i * b.r,
});
const abs2 = (a: Complex): number => a.r * a.r + a.i * a.i;

const SQRT1_2 = Math.SQRT1_2; // 1 / sqrt(2) ~ 0.70710678

export type GateMatrix = [[Complex, Complex], [Complex, Complex]];

export const SINGLE_GATE_MATRICES: Record<string, GateMatrix> = {
  H: [
    [c(SQRT1_2), c(SQRT1_2)],
    [c(SQRT1_2), c(-SQRT1_2)],
  ],
  X: [
    [c(0), c(1)],
    [c(1), c(0)],
  ],
  Y: [
    [c(0), c(0, -1)],
    [c(0, 1), c(0)],
  ],
  Z: [
    [c(1), c(0)],
    [c(0), c(-1)],
  ],
  S: [
    [c(1), c(0)],
    [c(0), c(0, 1)],
  ],
  T: [
    [c(1), c(0)],
    [c(0), c(SQRT1_2, SQRT1_2)],
  ],
  Rx: [
    [c(SQRT1_2), c(0, -SQRT1_2)],
    [c(0, -SQRT1_2), c(SQRT1_2)],
  ],
  RX: [
    [c(SQRT1_2), c(0, -SQRT1_2)],
    [c(0, -SQRT1_2), c(SQRT1_2)],
  ],
  Ry: [
    [c(SQRT1_2), c(-SQRT1_2)],
    [c(SQRT1_2), c(SQRT1_2)],
  ],
  RY: [
    [c(SQRT1_2), c(-SQRT1_2)],
    [c(SQRT1_2), c(SQRT1_2)],
  ],
  Rz: [
    [c(SQRT1_2, -SQRT1_2), c(0)],
    [c(0), c(SQRT1_2, SQRT1_2)],
  ],
  RZ: [
    [c(SQRT1_2, -SQRT1_2), c(0)],
    [c(0), c(SQRT1_2, SQRT1_2)],
  ],
};

export interface PlacedGateData {
  step: number;
  qubit: number;
  type: string;
  control?: number;
}

export interface SimulationOutput {
  dim: number;
  stateVector: Complex[];
  probabilities: { stateStr: string; prob: number; amplitude: Complex }[];
  diracNotation: string;
  blochVectors: { qubit_index: number; x: number; y: number; z: number }[];
  counts: Record<string, number>;
  summary: string;
}

export function simulateCircuit(numQubits: number, gates: PlacedGateData[], shots = 1024): SimulationOutput {
  const dim = 1 << numQubits;
  let state: Complex[] = Array.from({ length: dim }, (_, idx) => (idx === 0 ? c(1, 0) : c(0, 0)));

  // Sort gates chronologically by step
  const sortedGates = [...gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    const qTarget = g.qubit;
    const qControl = g.control;

    if ((g.type === 'CX' || g.type === 'CNOT') && qControl !== undefined) {
      // CNOT
      const nextState = [...state];
      for (let i = 0; i < dim; i++) {
        const hasControlBit = (i >> (numQubits - 1 - qControl)) & 1;
        if (hasControlBit) {
          const flippedIndex = i ^ (1 << (numQubits - 1 - qTarget));
          if (flippedIndex > i) {
            const temp = nextState[i];
            nextState[i] = nextState[flippedIndex];
            nextState[flippedIndex] = temp;
          }
        }
      }
      state = nextState;
    } else if (g.type === 'CZ' && qControl !== undefined) {
      // CZ
      for (let i = 0; i < dim; i++) {
        const cBit = (i >> (numQubits - 1 - qControl)) & 1;
        const tBit = (i >> (numQubits - 1 - qTarget)) & 1;
        if (cBit && tBit) {
          state[i] = mul(state[i], c(-1, 0));
        }
      }
    } else if (g.type === 'SWAP' && qControl !== undefined) {
      // SWAP
      const nextState = [...state];
      for (let i = 0; i < dim; i++) {
        const bitA = (i >> (numQubits - 1 - qControl)) & 1;
        const bitB = (i >> (numQubits - 1 - qTarget)) & 1;
        if (bitA !== bitB) {
          const swappedIndex = (i ^ (1 << (numQubits - 1 - qControl))) ^ (1 << (numQubits - 1 - qTarget));
          if (swappedIndex > i) {
            const temp = nextState[i];
            nextState[i] = nextState[swappedIndex];
            nextState[swappedIndex] = temp;
          }
        }
      }
      state = nextState;
    } else if (g.type === 'CCX' || g.type === 'TOFFOLI') {
      // Toffoli (CCX) 3-qubit gate
      const c1 = qControl !== undefined ? qControl : 0;
      const c2 = c1 === 0 ? (qTarget === 1 ? 2 : 1) : 0;
      const nextState = [...state];
      for (let i = 0; i < dim; i++) {
        const bit1 = (i >> (numQubits - 1 - c1)) & 1;
        const bit2 = (i >> (numQubits - 1 - c2)) & 1;
        if (bit1 && bit2) {
          const flippedIndex = i ^ (1 << (numQubits - 1 - qTarget));
          if (flippedIndex > i) {
            const temp = nextState[i];
            nextState[i] = nextState[flippedIndex];
            nextState[flippedIndex] = temp;
          }
        }
      }
      state = nextState;
    } else if (g.type === 'M' || g.type === 'MEASURE') {
      // Measurement projection operator: Preserves state in statevector evaluation
    } else {
      // Single-qubit gate
      const mat = SINGLE_GATE_MATRICES[g.type];
      if (mat) {
        const nextState = Array.from({ length: dim }, () => c(0, 0));
        const targetBitMask = 1 << (numQubits - 1 - qTarget);

        for (let i = 0; i < dim; i++) {
          if ((i & targetBitMask) === 0) {
            const i0 = i;
            const i1 = i | targetBitMask;

            const v0 = state[i0];
            const v1 = state[i1];

            nextState[i0] = add(mul(mat[0][0], v0), mul(mat[0][1], v1));
            nextState[i1] = add(mul(mat[1][0], v0), mul(mat[1][1], v1));
          }
        }
        state = nextState;
      }
    }
  }

  // Measurement Probabilities
  const probabilities: { stateStr: string; prob: number; amplitude: Complex }[] = [];
  const counts: Record<string, number> = {};

  let remainingShots = shots;
  for (let i = 0; i < dim; i++) {
    const stateStr = i.toString(2).padStart(numQubits, '0');
    const p = abs2(state[i]);
    const roundedProb = Math.round(p * 1000) / 1000;
    probabilities.push({
      stateStr,
      prob: roundedProb,
      amplitude: state[i],
    });

    if (roundedProb > 0.001) {
      const shotCount = Math.round(roundedProb * shots);
      counts[stateStr] = shotCount;
      remainingShots -= shotCount;
    }
  }

  const firstNonZeroKey = Object.keys(counts)[0] || '0'.repeat(numQubits);
  if (counts[firstNonZeroKey] !== undefined) {
    counts[firstNonZeroKey] = Math.max(0, counts[firstNonZeroKey] + remainingShots);
  } else {
    counts[firstNonZeroKey] = shots;
  }

  // Dirac Bra-Ket Notation
  const nonZeroTerms = probabilities.filter((p) => p.prob > 0.001);
  let diracNotation = '';
  if (nonZeroTerms.length === 0) {
    diracNotation = `|${'0'.repeat(numQubits)}⟩`;
  } else {
    diracNotation = nonZeroTerms
      .map((term, idx) => {
        const { r, i } = term.amplitude;
        let coeff = '';
        const mag = Math.sqrt(term.prob);
        const isOne = Math.abs(mag - 1.0) < 0.005;
        const isInvSqrt2 = Math.abs(mag - SQRT1_2) < 0.005;

        if (isInvSqrt2) {
          coeff = r < -0.001 ? '- 1/√2 ' : (idx > 0 ? '+ 1/√2 ' : '1/√2 ');
        } else if (isOne) {
          coeff = r < -0.001 ? '- ' : (idx > 0 ? '+ ' : '');
        } else {
          const sign = r < -0.001 ? '- ' : (idx > 0 ? '+ ' : '');
          coeff = `${sign}${Math.abs(r).toFixed(3)} `;
        }

        if (Math.abs(i) > 0.05) {
          coeff = `(${r.toFixed(2)} + ${i.toFixed(2)}i) `;
        }

        return `${coeff}|${term.stateStr}⟩`;
      })
      .join(' ')
      .trim();
  }

  // Calculate Bloch Sphere Vectors for each qubit
  const blochVectors = Array.from({ length: numQubits }).map((_, qIdx) => {
    let rho00 = 0;
    let rho11 = 0;
    let rho01_r = 0;
    let rho01_i = 0;

    const bitMask = 1 << (numQubits - 1 - qIdx);

    for (let i = 0; i < dim; i++) {
      if ((i & bitMask) === 0) {
        const i0 = i;
        const i1 = i | bitMask;
        rho00 += abs2(state[i0]);
        rho11 += abs2(state[i1]);

        const v0 = state[i0];
        const v1 = state[i1];
        rho01_r += v0.r * v1.r + v0.i * v1.i;
        rho01_i += v0.i * v1.r - v0.r * v1.i;
      }
    }

    const x = Number((2 * rho01_r).toFixed(3));
    const y = Number((-2 * rho01_i).toFixed(3));
    const z = Number((rho00 - rho11).toFixed(3));

    return {
      qubit_index: qIdx,
      x: isNaN(x) ? 0 : x,
      y: isNaN(y) ? 0 : y,
      z: isNaN(z) ? 1 : z,
    };
  });

  let summary = 'Deterministic computational basis state.';
  if (nonZeroTerms.length === 2 && numQubits === 2 && counts['00'] && counts['11']) {
    summary = 'Maximally entangled Bell State (|Φ+⟩): EPR quantum correlation.';
  } else if (nonZeroTerms.length === 2 && numQubits === 2 && counts['01'] && counts['10']) {
    summary = 'Maximally entangled Bell State (|Ψ+⟩): Antiparallel EPR correlation.';
  } else if (nonZeroTerms.length === dim && dim > 1) {
    summary = `Equal uniform superposition across all ${dim} computational states.`;
  } else if (nonZeroTerms.length === 1) {
    summary = `Definite deterministic state: 100% measurement probability in |${nonZeroTerms[0].stateStr}⟩.`;
  } else {
    summary = `Coherent quantum superposition of ${nonZeroTerms.length} eigenstates.`;
  }

  return {
    dim,
    stateVector: state,
    probabilities,
    diracNotation,
    blochVectors,
    counts,
    summary,
  };
}
