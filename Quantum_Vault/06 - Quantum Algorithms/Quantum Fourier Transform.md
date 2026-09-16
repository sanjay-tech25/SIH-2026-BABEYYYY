---
type: algorithm
level: intermediate
status: completed
difficulty: hard
tags:
  - algorithm
  - qft
  - fourier-transform
  - phase-estimation
---
# Quantum Fourier Transform

## Problem
Given a quantum state vector $|x\rangle = \sum_{j=0}^{N-1} x_j |j\rangle$, compute its Discrete Fourier Transform vector $|y\rangle = \sum_{k=0}^{N-1} y_k |k\rangle$.

## Classical Approach
The classical Fast Fourier Transform (FFT) computes the DFT of an $N$-element vector in $O(N \log N) = O(n 2^n)$ operations (where $n = \log_2 N$).

## Quantum Idea
The Quantum Fourier Transform (QFT) performs the linear transformation on quantum amplitudes using $O(n^2)$ quantum gates, achieving an **exponential speedup** over classical FFT.

## Prerequisites
- [[Complex Numbers]]
- [[Hadamard]]
- [[S Gate]]
- [[T Gate]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Phase Kickback]]

## Mathematical Formulation

The QFT operator maps basis state $|j\rangle$ to:
$$\text{QFT}|j\rangle = \frac{1}{\sqrt{N}} \sum_{k=0}^{N-1} \omega^{j k} |k\rangle, \quad \omega = e^{2\pi i / N}, \quad N = 2^n$$

### Product Representation
$$\text{QFT}|j_1 j_2 \dots j_n\rangle = \frac{1}{\sqrt{2^n}} \left(|0\rangle + e^{2\pi i 0.j_n}|1\rangle\right) \otimes \left(|0\rangle + e^{2\pi i 0.j_{n-1}j_n}|1\rangle\right) \otimes \dots \otimes \left(|0\rangle + e^{2\pi i 0.j_1 j_2 \dots j_n}|1\rangle\right)$$
where $0.j_l \dots j_n = \sum_{m=l}^n j_m 2^{-(m-l+1)}$ represents binary fraction notation.

### Controlled Phase Rotation Gate $R_k$
$$R_k = \begin{pmatrix} 1 & 0 \\ 0 & e^{2\pi i / 2^k} \end{pmatrix}$$
- $R_2 = S$ ($\pi/2$ phase shift)
- $R_3 = T$ ($\pi/4$ phase shift)

## Step-by-Step Algorithm
For qubit index $i$ from 0 to $n-1$:
1. Apply Hadamard gate $H$ to qubit $i$.
2. Apply controlled phase rotation gates $C-R_k$ from qubits $j > i$ to qubit $i$ with phase angle $\theta = 2\pi / 2^{j-i+1}$.
3. Reverse the final qubit order using SWAP gates.

## Quantum Circuit
```text
q_0: ──[H]──[R_2]──[R_3]───────────────────────✕──
             │      │                           │
q_1: ────────■──────┼──────[H]──[R_2]───────────┼──
                    │            │              │
q_2: ───────────────■────────────■──────[H]─────✕──
```

## Complexity
| Method | Gate Complexity |
|---|---|
| Classical FFT | $O(n 2^n)$ operations |
| Quantum QFT | **$O(n^2)$ gates** |

## Qiskit Implementation
```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit.library import QFT
from qiskit.quantum_info import Statevector

n = 3
qc = QuantumCircuit(n)
qc.x(0)  # Prepare state |001>

# Append built-in QFT circuit
qft_gate = QFT(num_qubits=n, do_swaps=True).to_gate()
qc.append(qft_gate, range(n))

sv = Statevector.from_instruction(qc)
print("QFT output statevector magnitudes:\n", np.abs(sv.data))
```

## Example
For $n=1$ qubit ($N=2$):
$$\text{QFT}|0\rangle = \frac{|0\rangle+|1\rangle}{\sqrt{2}} = |+\rangle, \quad \text{QFT}|1\rangle = \frac{|0\rangle-|1\rangle}{\sqrt{2}} = |-\rangle$$
QFT on 1 qubit is exactly the Hadamard gate!

## Applications
Core subroutine in Quantum Phase Estimation, Period Finding, Shor's Algorithm, and Quantum Signal Processing.

## Limitations
QFT amplitudes cannot be read out directly in full without measuring and collapsing the state.

## Related Algorithms
- [[Quantum Phase Estimation]]
- [[Period Finding]]
- [[Shor Algorithm]]

## Prerequisites Graph
[[Complex Numbers]] → [[Hadamard]] → [[S Gate]] → [[Quantum Fourier Transform]]

## Resources
- Nielsen & Chuang, Section 5.1
- IBM Quantum Learning: Quantum Fourier Transform Module