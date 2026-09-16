---
type: foundation
level: beginner
status: completed
difficulty: medium
tags:
  - foundation
  - measurement
  - born-rule
  - state-collapse
---
# Measurement

## Definition
**Quantum measurement** is the process of observing a quantum state, causing the state vector to non-unitarily collapse into one of the eigenstates of the measurement observable operator.

## Why It Matters
Measurement bridges the quantum realm (complex statevector amplitudes) and the classical realm (deterministic bit values 0 or 1). It is how computational results are extracted from a quantum circuit.

## Intuition
- **Level 1 (Intuition)**: Imagine a spinning coin floating in mid-air (superposition). Catching and slapping the coin onto a table (measurement) forces it to land flat as either Heads ($|0\rangle$) or Tails ($|1\rangle$).
- **Level 2 (Mathematical)**: Projective measurement uses projection operators $M_m = |m\rangle\langle m|$. Probability $P(m) = \langle\psi|M_m^\dagger M_m|\psi\rangle = |\langle m|\psi\rangle|^2$. Post-measurement state $|\psi'\rangle = \frac{M_m|\psi\rangle}{\sqrt{P(m)}} = |m\rangle$.
- **Level 3 (Implementation)**: In Qiskit, `qc.measure(q, c)` projects qubit `q` into computational basis and stores the classical bit result into register `c`.

## Mathematical Foundation

### Projection Operators
For computational basis measurements:
$$P_0 = |0\rangle\langle 0| = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}, \quad P_1 = |1\rangle\langle 1| = \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix}$$

### Born Rule & Collapse
Given state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$:
- Probability of measuring outcome $0$: $P(0) = \langle\psi|P_0|\psi\rangle = |\alpha|^2$
- State after measuring outcome $0$: $|\psi'\rangle = \frac{P_0|\psi\rangle}{|\alpha|} = |0\rangle$
- Probability of measuring outcome $1$: $P(1) = \langle\psi|P_1|\psi\rangle = |\beta|^2$
- State after measuring outcome $1$: $|\psi'\rangle = \frac{P_1|\psi\rangle}{|\beta|} = |1\rangle$

## Key Equations
$$\text{Projection Operator: } P_x = |x\rangle\langle x|$$
$$\text{Outcome Probability: } P(x) = |\langle x | \psi \rangle|^2$$
$$\text{Post-Measurement State: } |\psi'\rangle = |x\rangle$$

## Example
Measure state $|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$:
- Probability $P(0) = |1/\sqrt{2}|^2 = 0.5$
- Probability $P(1) = |1/\sqrt{2}|^2 = 0.5$
If outcome is $0$, subsequent measurements of the same qubit will yield outcome $0$ with $100\%$ certainty because the wave function collapsed.

## Circuit
```text
q_0: ──[H]──░──[M]──
            ║
c_0: ═══════╩═══════
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

# Simulate 1000 measurement shots
sim = AerSimulator()
result = sim.run(qc, shots=1000).result()
counts = result.get_counts()

print("Measurement Counts (1000 shots):", counts)
```

## Prerequisites
- [[Probability]]
- [[Qubit]]
- [[Quantum State]]

## Related Concepts
- [[Normalization]]
- [[Superposition]]
- [[Bloch Sphere]]

## Algorithms Using This
- Every quantum algorithm terminates with qubit measurement.

## Common Mistakes
- Expecting measurement to return the complex amplitude values $\alpha$ and $\beta$ directly.
- Performing measurement in the middle of a circuit without realizing it destroys quantum coherence and superposition.

## Further Learning
- Read about generalized measurements (POVMs) and non-destructive weak quantum measurements.