---
type: algorithm
level: beginner
status: completed
difficulty: medium
tags:
  - algorithm
  - bernstein-vazirani
  - secret-string
  - query-complexity
---
# Bernstein-Vazirani Algorithm

## Problem
Given an oracle function $f(x) = s \cdot x \pmod 2 = \left(\sum_{i=0}^{n-1} s_i x_i\right) \pmod 2$ where $s \in \{0,1\}^n$ is a hidden binary string, find $s$.

## Classical Approach
Classically, to uncover hidden string $s$, you must query the oracle with unit bit strings $x = 100\dots0, 010\dots0, \dots, 000\dots1$ one bit at a time.
Classical query complexity: $n$ queries.

## Quantum Idea
Using superposition and phase kickback, the inner product $s \cdot x$ is converted into phase factors $(-1)^{s \cdot x}$. Applying Hadamard gates $H^{\otimes n}$ performs an exact Fourier inverse transform over $\mathbb{Z}_2^n$, outputting state vector $|s\rangle$ directly in **1 query**.

## Prerequisites
- [[Deutsch-Jozsa Algorithm]]
- [[Phase Kickback]]
- [[Hadamard]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation

Initial state: $|\psi_0\rangle = |0\rangle^{\otimes n} |1\rangle$.
Apply $H^{\otimes n} \otimes H$:
$$|\psi_1\rangle = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle |-\rangle$$

Apply Oracle $U_f |x, y\rangle = |x, y \oplus (s \cdot x)\rangle$:
$$|\psi_2\rangle = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} (-1)^{s \cdot x} |x\rangle |-\rangle$$

Apply $H^{\otimes n}$ to input register:
$$|\psi_3\rangle = \frac{1}{2^n} \sum_{x \in \{0,1\}^n} \sum_{y \in \{0,1\}^n} (-1)^{s \cdot x + x \cdot y} |y\rangle |-\rangle = \frac{1}{2^n} \sum_{y \in \{0,1\}^n} \left( \sum_{x \in \{0,1\}^n} (-1)^{x \cdot (s \oplus y)} \right) |y\rangle |-\rangle$$

By orthogonality of Hadamard basis:
$$\sum_{x \in \{0,1\}^n} (-1)^{x \cdot (s \oplus y)} = 2^n \delta_{s, y}$$
Thus $|\psi_3\rangle = |s\rangle |-\rangle$. Measuring input register yields string $s$ with $100\%$ probability!

## Step-by-Step Algorithm
1. Initialize $(n+1)$-qubit state $|0\rangle^{\otimes n}|1\rangle$.
2. Apply $H^{\otimes (n+1)}$.
3. Apply quantum oracle $U_f$.
4. Apply $H^{\otimes n}$ to input register.
5. Measure input qubits to obtain secret string $s$.

## Quantum Circuit
```text
q_0: ──[H]──■──────────[H]──[M]  (s_0)
q_1: ──[H]──│──■───────[H]──[M]  (s_1)
            │  │ U_f
q_n: ──[H]──│──│──■────[H]──[M]  (s_n)
anc: ──[X]──[H]─⊕──⊕──⊕─────────
```

## Complexity
| Method | Query Complexity |
|---|---|
| Classical | $n$ Queries |
| Quantum | **1 Query** |

## Qiskit Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def bernstein_vazirani(s):
    n = len(s)
    qc = QuantumCircuit(n + 1, n)
    qc.x(n)
    qc.h(range(n + 1))
    
    # Oracle for s (apply CNOT where bit s_i == '1')
    for i, bit in enumerate(reversed(s)):
        if bit == '1':
            qc.cx(i, n)
            
    qc.h(range(n))
    qc.measure(range(n), range(n))
    
    sim = AerSimulator()
    counts = sim.run(qc, shots=1).result().get_counts()
    return list(counts.keys())[0]

secret = "1011"
print(f"Secret string: {secret}, Recovered: {bernstein_vazirani(secret)}")
```

## Example
Let $s = 101$ ($n=3$).
1. State after Oracle: $\frac{1}{\sqrt{8}}\sum_{x} (-1)^{x_0 + x_2}|x\rangle$.
2. Final $H^{\otimes 3}$ transforms state to $|101\rangle$. Measurement yields `101`.

## Applications
Primary building block for Quantum Key Distribution and oracular search primitives.

## Limitations
Requires linear inner product structure $f(x) = s \cdot x$.

## Related Algorithms
- [[Deutsch-Jozsa Algorithm]]
- [[Simon Algorithm]]

## Prerequisites Graph
[[Deutsch-Jozsa Algorithm]] → [[Phase Kickback]] → [[Bernstein-Vazirani Algorithm]]

## Resources
- Qiskit Textbook: Bernstein-Vazirani Algorithm
- Paper: Bernstein & Vazirani (1993), SIAM J. Comput.