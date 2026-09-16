---
type: algorithm
level: intermediate
status: completed
difficulty: hard
tags:
  - algorithm
  - qpe
  - phase-estimation
  - eigenvalues
---
# Quantum Phase Estimation

## Problem
Given a unitary operator $U$ and an eigenvector $|u\rangle$ satisfying $U|u\rangle = e^{2\pi i \theta}|u\rangle$, estimate the eigenphase phase parameter $\theta \in [0, 1)$.

## Classical Approach
Classically, calculating eigenphases of large $2^n \times 2^n$ unitary matrices requires explicit matrix diagonalization, scaling as $O(2^{3n})$.

## Quantum Idea
QPE combines **Phase Kickback** across a register of counting qubits with the **Inverse Quantum Fourier Transform (IQFT)** to directly write phase parameter $\theta$ into computational basis measurement outcomes with $t$-bit precision.

## Prerequisites
- [[Quantum Fourier Transform]]
- [[Phase Kickback]]
- [[Eigenvalues & Eigenvectors]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation

1. Prepare $t$ counting qubits in $|0\rangle^{\otimes t}$ and target register in eigenstate $|u\rangle$.
2. Apply $H^{\otimes t}$ to counting register:
   $$|\psi_1\rangle = \frac{1}{\sqrt{2^t}} \sum_{k=0}^{2^t-1} |k\rangle |u\rangle$$

3. Apply successive Controlled-$U^{2^j}$ operations for $j=0, \dots, t-1$:
   Phase kickback maps phase factors $e^{2\pi i \theta 2^j}$ onto counting qubits:
   $$|\psi_2\rangle = \frac{1}{\sqrt{2^t}} \sum_{k=0}^{2^t-1} e^{2\pi i \theta k} |k\rangle |u\rangle$$

4. Apply Inverse QFT ($\text{QFT}^\dagger$) to counting register:
   $$\text{QFT}^\dagger \left( \frac{1}{\sqrt{2^t}} \sum_{k=0}^{2^t-1} e^{2\pi i \theta k} |k\rangle \right) = |2^t \theta\rangle$$

5. Measuring counting register yields integer $2^t \theta \implies \theta = \frac{\text{measured integer}}{2^t}$.

## Step-by-Step Algorithm
1. Initialize $t$ counting qubits to $|0\rangle^{\otimes t}$ and target register to $|u\rangle$.
2. Apply $H^{\otimes t}$ to counting qubits.
3. Apply Controlled-$U^{2^j}$ gates from counting qubit $j$ to target register.
4. Apply $\text{QFT}^\dagger$ to counting register.
5. Measure counting qubits and divide binary outcome by $2^t$.

## Quantum Circuit
```text
c_0: ──[H]────■──────────────────────[   ]──[M]
              │                      [   ]──[M]
c_1: ──[H]────┼──────■───────────────[IQFT]──[M]
              │ U^1  │ U^2           [   ]
tgt: ──[|u⟩]──┴──────┴───────────────[   ]─────
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Matrix Diagonalization | $O(2^{3n})$ |
| Quantum QPE | **$O(t^2 + t \cdot \text{Cost}(U))$** |

## Qiskit Implementation
```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit.library import QFT
from qiskit_aer import AerSimulator

def qpe_phase_gate(theta_val, t=3):
    qc = QuantumCircuit(t + 1, t)
    # Target qubit into |1> (eigenstate of P(2*pi*theta))
    qc.x(t)
    qc.h(range(t))
    
    # Controlled-U gates (U = PhaseGate(2*pi*theta))
    for j in range(t):
        repetitions = 2**j
        angle = 2 * np.pi * theta_val * repetitions
        qc.cp(angle, j, t)
        
    # Inverse QFT
    iqft = QFT(num_qubits=t, inverse=True, do_swaps=True).to_gate()
    qc.append(iqft, range(t))
    
    qc.measure(range(t), range(t))
    return qc

theta = 0.375  # 3/8 = 0.011 in binary -> integer 3
qc = qpe_phase_gate(theta, t=3)
sim = AerSimulator()
counts = sim.run(qc, shots=10).result().get_counts()
print(f"QPE result for phase {theta}:", counts)
```

## Example
Let $\theta = 0.375 = 3/8$ ($t=3$ counting qubits).
Output of IQFT yields state $|011\rangle_2 = 3_{10}$.
Phase estimate: $\theta = 3 / 2^3 = 3/8 = 0.375$ (Exact match!).

## Applications
[[Period Finding]], [[Shor Algorithm]], Quantum Chemistry simulation, and [[HHL]] linear solver.

## Limitations
Requires preparing target eigenvector $|u\rangle$ and implementing controlled powers of $U$.

## Related Algorithms
- [[Quantum Fourier Transform]]
- [[Period Finding]]
- [[Shor Algorithm]]
- [[HHL]]

## Prerequisites Graph
[[Quantum Fourier Transform]] → [[Phase Kickback]] → [[Quantum Phase Estimation]]

## Resources
- Nielsen & Chuang, Section 5.2
- IBM Quantum Learning: Quantum Phase Estimation