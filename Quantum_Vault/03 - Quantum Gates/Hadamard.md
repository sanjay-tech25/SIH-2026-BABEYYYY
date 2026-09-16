---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - hadamard
  - superposition
---
# Hadamard

## Definition
The **Hadamard gate** ($H$) is a single-qubit unitary gate that transforms computational basis states $\{|0\rangle, |1\rangle\}$ into equal superposition basis states $\{|+\rangle, |-\rangle\}$.

## Why It Matters
The Hadamard gate is arguably the most essential single-qubit gate in quantum computing. It creates superposition from deterministic basis states and converts phase information into measurable amplitude differences.

## Intuition
- **Level 1 (Intuition)**: The Hadamard gate is a "superposition generator". It takes a definite 0 or 1 bit and creates a 50/50 quantum state. Applying $H$ twice returns the qubit back to its original state ($H^2 = I$).
- **Level 2 (Mathematical)**: Matrix $H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$. $H|0\rangle = |+\rangle = \frac{|0\rangle+|1\rangle}{\sqrt{2}}$, $H|1\rangle = |-\rangle = \frac{|0\rangle-|1\rangle}{\sqrt{2}}$.
- **Level 3 (Implementation)**: In Qiskit, `qc.h(0)` applies Hadamard to qubit index 0.

## Mathematical Foundation

### Matrix Representation
$$H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$

### Action on Computational Basis
$$H|0\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix} = |+\rangle$$
$$H|1\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 0 \\ 1 \end{pmatrix} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix} = |-\rangle$$

### Action on Superposition Basis
$$H|+\rangle = |0\rangle, \quad H|-\rangle = |1\rangle$$

### Algebraic Properties
- Hermitian: $H^\dagger = H$
- Unitary: $H^\dagger H = H^2 = I$ (Self-inverse)
- Conjugation relations: $H X H = Z$, $H Z H = X$

## Key Equations
$$H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$
$$H|x\rangle = \frac{1}{\sqrt{2}} \left(|0\rangle + (-1)^x |1\rangle\right) = \frac{1}{\sqrt{2}} \sum_{y \in \{0,1\}} (-1)^{x y} |y\rangle$$
$$H^{\otimes n} |0\rangle^{\otimes n} = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle$$

## Example
Apply $H$ to state $|-\rangle$:
$$H|-\rangle = H\left(\frac{|0\rangle - |1\rangle}{\sqrt{2}}\right) = \frac{1}{\sqrt{2}}(|+\rangle - |-\rangle) = \frac{1}{\sqrt{2}}\left(\frac{|0\rangle+|1\rangle}{\sqrt{2}} - \frac{|0\rangle-|1\rangle}{\sqrt{2}}\right) = \frac{2|1\rangle}{2} = |1\rangle$$

## Circuit
```text
q_0: ──[H]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)

sv = Statevector.from_instruction(qc)
print("Hadamard output statevector:", sv.data)
```

## Prerequisites
- [[Matrices]]
- [[Qubit]]

## Related Concepts
- [[Superposition]]
- [[Pauli X]]
- [[Pauli Z]]

## Algorithms Using This
Hadamard plays a central role across the algorithmic hierarchy:
- ├──→ [[Superposition]]
- ├──→ [[Deutsch Algorithm]]
- ├──→ [[Deutsch-Jozsa Algorithm]]
- ├──→ [[Bernstein-Vazirani Algorithm]]
- └──→ [[Grover Algorithm]]

## Common Mistakes
- Expecting $H$ to produce identical outputs for $|0\rangle$ and $|1\rangle$. Note that $H|1\rangle$ contains a crucial minus sign ($|-\rangle$) which causes destructive interference in algorithms!

## Further Learning
- Prove $H^{\otimes n} |x\rangle = \frac{1}{\sqrt{2^n}} \sum_{y \in \{0,1\}^n} (-1)^{x \cdot y} |y\rangle$.