---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - amplitude-amplification
  - grover
  - optimization
---
# Amplitude Amplification

## Problem
Given a quantum algorithm state preparation unitary $A$ producing state $|\psi\rangle = A|0\rangle = \sin\theta |\psi_1\rangle + \cos\theta |\psi_0\rangle$ (where $|\psi_1\rangle$ is a target subspace of marked states and $|\psi_0\rangle$ is an unmarked subspace), amplify the target state amplitude $\sin\theta$ to approach probability $1$.

## Classical Approach
Classical Monte Carlo sampling requiring success probability $p = \sin^2\theta$ must repeat trials $O(1/p) = O(1/\sin^2\theta)$ times.

## Quantum Idea
Amplitude Amplification generalizes Grover's algorithm by applying repeated reflections in the 2D subspace spanned by $\{|\psi_1\rangle, |\psi_0\rangle\}$, boosting target state probability to $\approx 100\%$ in **$O(1/\sqrt{p}) = O(1/\sin\theta)$ queries**, yielding quadratic quantum speedup.

## Prerequisites
- [[Grover Algorithm]]
- [[Quantum Oracle]]
- [[Interference]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]

## Mathematical Formulation

1. Initial State Preparation:
   $$|\psi\rangle = A|0\rangle = \sin\theta |\psi_1\rangle + \cos\theta |\psi_0\rangle$$

2. Phase Oracle Reflection $S_\chi$:
   $$S_\chi = I - 2 |\psi_1\rangle\langle \psi_1|$$

3. Initial State Reflection $S_0$:
   $$S_0 = I - 2 |0\rangle\langle 0|$$

4. Amplification Iteration Operator $Q$:
   $$Q = -A S_0 A^\dagger S_\chi$$
   Applying operator $Q$ rotates the state vector by angle $2\theta$ in the subspace toward target state $|\psi_1\rangle$.

5. Optimal Number of Iterations $k$:
   $$k \approx \left\lfloor \frac{\pi}{4\theta} \right\rfloor \approx \frac{\pi}{4\sqrt{p}}$$

## Step-by-Step Algorithm
1. Initialize register to $|0\rangle^{\otimes n}$.
2. Apply state preparation algorithm $A$.
3. Repeat operator $Q = -A (I - 2|0\rangle\langle 0|) A^\dagger (I - 2|\psi_1\rangle\langle\psi_1|)$ for $k \approx \frac{\pi}{4\sqrt{p}}$ steps.
4. Measure the register.

## Quantum Circuit
```text
q: ──[ A ]──[ S_chi ]──[ A^\dagger ]──[ S_0 ]──[ A ]── ... ──[M]
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Sampling | $O(1/p)$ |
| Quantum Amplification | **$O(1/\sqrt{p})$** |

## Qiskit Implementation
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator
from qiskit_aer import AerSimulator

# Target oracle marking state |11>
oracle = QuantumCircuit(2)
oracle.cz(0, 1)

# Construct Grover operator (amplitude amplification)
grover_op = GroverOperator(oracle)

qc = QuantumCircuit(2, 2)
qc.h([0, 1])  # Preparation A
qc.append(grover_op, [0, 1])  # Q operator step
qc.measure([0, 1], [0, 1])

sim = AerSimulator()
counts = sim.run(qc, shots=1000).result().get_counts()
print("Amplitude Amplification output counts:", counts)
```

## Example
If initial success probability $p = 1\% = 0.01$:
- Classical trials required: $1/0.01 = 100$ trials.
- Quantum iterations required: $\frac{\pi}{4\sqrt{0.01}} = \frac{\pi}{4(0.1)} \approx 7.85 \implies 8$ iterations!

## Applications
Quantum search acceleration, quantum heuristic optimization, and subroutine for [[Amplitude Estimation]].

## Limitations
Requires knowledge or estimate of initial success probability $p$ to prevent over-rotation.

## Related Algorithms
- [[Grover Algorithm]]
- [[Quantum Counting]]
- [[Amplitude Estimation]]

## Prerequisites Graph
[[Grover Algorithm]] → [[Amplitude Amplification]]

## Resources
- Paper: Brassard et al. (2000), Contemporary Mathematics.
- IBM Qiskit Textbook: Amplitude Amplification