---
type: algorithm
level: intermediate
status: completed
difficulty: hard
tags:
  - algorithm
  - simon
  - exponential-speedup
  - hidden-period
---
# Simon Algorithm

## Problem
Given a black-box function $f: \{0,1\}^n \to \{0,1\}^n$ guaranteed to satisfy property $f(x) = f(y) \iff x \oplus y \in \{0^n, s\}$ for some hidden mask $s \in \{0,1\}^n$, find hidden string $s$.

## Classical Approach
Finding $s$ classically requires finding a collision $f(x) = f(y)$. By the Birthday Paradox, this requires querying $\approx 2^{n/2}$ values.
Classical query complexity: $O(2^{n/2})$.

## Quantum Idea
Simon's algorithm queries $f$ in equal superposition over two $n$-qubit registers. Measurement of the target register collapses the input register into a 2-state superposition $|x\rangle + |x \oplus s\rangle$. Final Hadamard transform yields bit strings $y$ satisfying linear equation $y \cdot s = 0 \pmod 2$. Solving $O(n)$ linear equations classically reconstructs $s$ in **polynomial time $O(n)$**.

## Prerequisites
- [[Bernstein-Vazirani Algorithm]]
- [[Entanglement]]
- [[Hadamard]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]

## Mathematical Formulation

Initial state: $|\psi_0\rangle = |0\rangle^{\otimes n} |0\rangle^{\otimes n}$.
Apply $H^{\otimes n}$ to first register:
$$|\psi_1\rangle = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle |0\rangle^{\otimes n}$$

Apply bit oracle $U_f |x, 0\rangle = |x, f(x)\rangle$:
$$|\psi_2\rangle = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle |f(x)\rangle$$

Measure second register (observing outcome $f(x_0)$):
First register collapses to state:
$$|\psi_3\rangle = \frac{|x_0\rangle + |x_0 \oplus s\rangle}{\sqrt{2}}$$

Apply $H^{\otimes n}$ to first register:
$$|\psi_4\rangle = \frac{1}{\sqrt{2^{n+1}}} \sum_{y \in \{0,1\}^n} \left( (-1)^{x_0 \cdot y} + (-1)^{(x_0 \oplus s) \cdot y} \right) |y\rangle = \frac{1}{\sqrt{2^{n+1}}} \sum_{y \in \{0,1\}^n} (-1)^{x_0 \cdot y} \left( 1 + (-1)^{s \cdot y} \right) |y\rangle$$

 amplitude of $|y\rangle$:
- If $s \cdot y = 1 \pmod 2$: Amplitude is $0$ (Destructive cancellation!).
- If $s \cdot y = 0 \pmod 2$: Amplitude is non-zero.

Measuring first register yields $y$ such that $y \cdot s = 0 \pmod 2$. Repeating $O(n)$ times gives $n-1$ linearly independent vectors to solve for $s$ via Gaussian elimination.

## Step-by-Step Algorithm
1. Initialize two $n$-qubit registers to $|0\rangle^{\otimes n}|0\rangle^{\otimes n}$.
2. Apply $H^{\otimes n}$ to first register.
3. Apply quantum oracle $U_f$.
4. Apply $H^{\otimes n}$ to first register.
5. Measure first register to get vector $y^{(i)}$ satisfying $y^{(i)} \cdot s = 0 \pmod 2$.
6. Repeat steps 1–5 $O(n)$ times until $n-1$ independent vectors are collected.
7. Solve classical linear system $M s = 0$ via Gaussian elimination to find $s$.

## Quantum Circuit
```text
q_in : ──[H^{\otimes n}]──■──[H^{\otimes n}]──[M]
                          │ U_f
q_out: ───────────────────⊕─────────────────────
```

## Complexity
| Method | Query Complexity |
|---|---|
| Classical | $O(2^{n/2})$ |
| Quantum | **$O(n)$** |

## Qiskit Implementation
```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def simon_circuit(n, s_mask):
    qc = QuantumCircuit(2*n, n)
    qc.h(range(n))
    
    # Oracle for s_mask (copy x to target then XOR s_mask)
    for i in range(n):
        qc.cx(i, n + i)
    if '1' in s_mask:
        first_1 = s_mask.find('1')
        for i, bit in enumerate(s_mask):
            if bit == '1':
                qc.cx(first_1, n + i)
                
    qc.h(range(n))
    qc.measure(range(n), range(n))
    return qc

n = 2
s_mask = "11"
qc = simon_circuit(n, s_mask)
sim = AerSimulator()
counts = sim.run(qc, shots=50).result().get_counts()
print(f"Simon's algorithm measurement counts for s={s_mask}:", counts)
```

## Example
For $n=2$, $s=11$. Measurements yield strings $y \in \{00, 11\}$ since $00 \cdot 11 = 0 \pmod 2$ and $11 \cdot 11 = 0 \pmod 2$.
Linear equation $y_1 s_1 + y_2 s_2 = 0 \implies 1 s_1 + 1 s_2 = 0 \implies s = 11$.

## Applications
Historical inspiration for Shor's algorithm (period finding via algebraic subgroup structure).

## Limitations
Requires solving linear systems classically as post-processing.

## Related Algorithms
- [[Bernstein-Vazirani Algorithm]]
- [[Period Finding]]
- [[Shor Algorithm]]

## Prerequisites Graph
[[Bernstein-Vazirani Algorithm]] → [[Entanglement]] → [[Simon Algorithm]]

## Resources
- Paper: Simon (1994), IEEE FOCS.
- Qiskit Textbook: Simon's Algorithm