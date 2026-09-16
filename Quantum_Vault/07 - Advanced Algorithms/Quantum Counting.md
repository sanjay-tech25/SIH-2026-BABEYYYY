---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - quantum-counting
  - grover
  - qpe
---
# Quantum Counting

## Problem
Given an unstructured search space of size $N = 2^n$ and a black-box oracle $f(x)$, count the **exact number of marked solutions $M$** for which $f(x) = 1$ without finding all items explicitly.

## Classical Approach
Classically, determining $M$ requires querying all $N$ items one by one.
Classical complexity: $O(N)$.

## Quantum Idea
Quantum Counting combines the **Grover Operator $G$** with **Quantum Phase Estimation (QPE)**. Because the eigenvalues of $G$ are $e^{\pm i 2\theta}$ where $\sin^2\theta = M/N$, estimating the eigenphase of $G$ using QPE computes $M$ in **$O(\sqrt{N})$ queries**.

## Prerequisites
- [[Grover Algorithm]]
- [[Quantum Phase Estimation]]
- [[Amplitude Amplification]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation

1. Grover Operator $G$:
   Eigenvalues of $G$ in 2D subspace are $\lambda = e^{\pm i 2\theta}$.
   Relation to solution count $M$:
   $$\sin^2\theta = \frac{M}{N} \implies \sin\theta = \sqrt{\frac{M}{2^n}}$$

2. Quantum Phase Estimation on $G$:
   QPE using $t$ counting qubits estimates phase $\phi = 2\theta / 2\pi = \theta / \pi$.
   Phase estimate:
   $$\theta = \frac{\pi \cdot \text{measured integer}}{2^t}$$

3. Solution Count Calculation:
   $$M = N \sin^2\theta = 2^n \sin^2\left( \frac{\pi \cdot \text{measured integer}}{2^t} \right)$$

## Step-by-Step Algorithm
1. Initialize $t$ counting qubits to $|0\rangle^{\otimes t}$ and $n$ state qubits to $|0\rangle^{\otimes n}$.
2. Apply $H^{\otimes (t+n)}$.
3. Apply Controlled-$G^{2^j}$ operations from counting qubits to state qubits.
4. Apply Inverse QFT ($\text{QFT}^\dagger$) to counting qubits.
5. Measure counting qubits to get integer outcome $b$.
6. Calculate $\theta = \frac{\pi b}{2^t}$ and compute $M = 2^n \sin^2\theta$.

## Quantum Circuit
```text
c_reg: ──[H^{\otimes t}]──[ Controlled-G^{2^j} ]──[IQFT]──[M]
                          │
st_reg: ──[H^{\otimes n}]──┴──────────────────────
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Exact Counting | $O(N)$ |
| Quantum Counting | **$O(\sqrt{N})$** |

## Qiskit Implementation
```python
import numpy as np

def calculate_marked_count(measured_int, t, n):
    theta = (np.pi * measured_int) / (2**t)
    M = (2**n) * (np.sin(theta)**2)
    return round(M)

# Example: n=2 qubits (N=4), 1 marked state (M=1)
# Eigenphase theta = arcsin(sqrt(1/4)) = arcsin(0.5) = pi/6
# Phase value for QPE: 2*theta / (2*pi) = 1/6
# With t=4 qubits, expected measurement is round(16 * 1/6) = 3
measured_val = 3
t = 4
n = 2
M_est = calculate_marked_count(measured_val, t, n)
print(f"Estimated solution count M in N={2**n} space:", M_est)
```

## Example
For $n=4$ ($N=16$), $M=4$ solutions:
- $\sin\theta = \sqrt{4/16} = 0.5 \implies \theta = \pi/6$.
- Eigenphase parameter of $G$: $2\theta = \pi/3$.
- QPE output measuring $2\theta/(2\pi) = 1/6$.
- Reconstructed count: $M = 16 \sin^2(\pi/6) = 16(0.25) = 4$.

## Applications
Finding search bounds for Grover search when $M$ is unknown, quantum volume evaluation, and counting graph matchings.

## Limitations
Precision depends on the number of counting qubits $t$.

## Related Algorithms
- [[Grover Algorithm]]
- [[Quantum Phase Estimation]]
- [[Amplitude Estimation]]

## Prerequisites Graph
[[Grover Algorithm]] → [[Quantum Phase Estimation]] → [[Quantum Counting]]

## Resources
- Nielsen & Chuang, Section 5.3.3
- Qiskit Textbook: Quantum Counting