---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - pauli-y
  - bit-phase-flip
---
# Pauli Y

## Definition
The **Pauli Y gate** is a single-qubit unitary operation that combines a bit-flip (X) and a phase-flip (Z) simultaneously, accompanied by an imaginary factor $i$.

## Why It Matters
Pauli Y forms part of the single-qubit Pauli operator group $\{I, X, Y, Z\}$, which spans the space of all 2x2 complex matrices and underpins quantum error correction.

## Intuition
- **Level 1 (Intuition)**: Pauli Y flips $|0\rangle \to i|1\rangle$ and $|1\rangle \to -i|0\rangle$. On the Bloch sphere, it rotates the qubit state vector by $\pi$ radians around the $Y$-axis.
- **Level 2 (Mathematical)**: Matrix $Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix} = iXZ$.
- **Level 3 (Implementation)**: In Qiskit, `qc.y(0)` applies the Pauli Y gate to qubit index 0.

## Mathematical Foundation

### Matrix Representation
$$Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}$$

### Action on Basis States
$$Y|0\rangle = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ i \end{pmatrix} = i|1\rangle$$
$$Y|1\rangle = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}\begin{pmatrix} 0 \\ 1 \end{pmatrix} = \begin{pmatrix} -i \\ 0 \end{pmatrix} = -i|0\rangle$$

### Algebraic Properties
- Hermitian: $Y^\dagger = Y$
- Unitary: $Y^\dagger Y = Y^2 = I$
- Eigenvalues: $\lambda_1 = +1, \lambda_2 = -1$
- Eigenstates: $|+i\rangle = \frac{|0\rangle+i|1\rangle}{\sqrt{2}}, |-i\rangle = \frac{|0\rangle-i|1\rangle}{\sqrt{2}}$

## Key Equations
$$Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}$$
$$Y = iXZ = -iZX$$
$$Y^2 = I$$

## Example
Apply $Y$ to state $|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$:
$$Y|+\rangle = \frac{1}{\sqrt{2}}(i|1\rangle - i|0\rangle) = \frac{-i}{\sqrt{2}}|0\rangle + \frac{i}{\sqrt{2}}|1\rangle = -i |-\rangle$$

## Circuit
```text
q_0: ──[Y]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.y(0)

sv = Statevector.from_instruction(qc)
print("State vector after Y gate:", sv.data)
```

## Prerequisites
- [[Matrices]]
- [[Complex Numbers]]

## Related Concepts
- [[Pauli X]]
- [[Pauli Z]]
- [[Bloch Sphere]]

## Algorithms Using This
- Quantum Error Correction codes and Variational Quantum Eigensolver ([[VQE]]) Hamiltonians.

## Common Mistakes
- Forgetting the imaginary phase factors $+i$ and $-i$ introduced by $Y$.

## Further Learning
- Practice deriving $R_y(\theta) = e^{-i\theta Y/2} = \cos(\theta/2)I - i\sin(\theta/2)Y$.