---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - pauli-x
  - bit-flip
---
# Pauli X

## Definition
The **Pauli X gate** (quantum NOT gate) is a single-qubit unitary gate that performs a bit-flip operation, swapping basis states $|0\rangle$ and $|1\rangle$.

## Why It Matters
It is the direct quantum analogue of the classical boolean NOT gate and acts as a key building block for bit flips, state initialization, and parity operations.

## Intuition
- **Level 1 (Intuition)**: If a qubit is in state $|0\rangle$, Pauli X switches it to $|1\rangle$, and vice versa. On the Bloch sphere, it rotates the state vector by $\pi$ radians ($180^\circ$) around the $X$-axis.
- **Level 2 (Mathematical)**: Matrix $X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$. $X|0\rangle = |1\rangle$, $X|1\rangle = |0\rangle$.
- **Level 3 (Implementation)**: In Qiskit, `qc.x(0)` applies the Pauli X gate to qubit index 0.

## Mathematical Foundation

### Matrix Representation
$$X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$$

### Action on Basis States
$$X|0\rangle = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \end{pmatrix} = |1\rangle$$
$$X|1\rangle = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 1 \\ 0 \end{pmatrix} = |0\rangle$$

### Algebraic Properties
- Hermitian: $X^\dagger = X$
- Unitary: $X^\dagger X = X^2 = I$ (Self-inverse)
- Eigenvalues: $\lambda_1 = +1, \lambda_2 = -1$
- Eigenstates: $|+\rangle = \frac{|0\rangle+|1\rangle}{\sqrt{2}}, |-\rangle = \frac{|0\rangle-|1\rangle}{\sqrt{2}}$

## Key Equations
$$X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$$
$$X(\alpha|0\rangle + \beta|1\rangle) = \beta|0\rangle + \alpha|1\rangle$$
$$X^2 = I$$

## Example
Apply $X$ to state $|\psi\rangle = \frac{\sqrt{3}}{2}|0\rangle + \frac{1}{2}|1\rangle$:
$$X|\psi\rangle = \frac{1}{2}|0\rangle + \frac{\sqrt{3}}{2}|1\rangle$$

## Circuit
```text
q_0: ──[X]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.x(0)  # Apply Pauli X

sv = Statevector.from_instruction(qc)
print("State vector after X gate:", sv.data)
```

## Prerequisites
- [[Matrices]]
- [[Qubit]]

## Related Concepts
- [[Pauli Y]]
- [[Pauli Z]]
- [[CNOT]]

## Algorithms Using This
- [[Deutsch Algorithm]]
- [[Deutsch-Jozsa Algorithm]]
- [[Grover Algorithm]]

## Common Mistakes
- Expecting $X$ to flip phases. $X$ swaps amplitudes $\alpha \leftrightarrow \beta$. Phase flip is performed by Pauli $Z$.

## Further Learning
- Study arbitrary $X$-axis rotation gate $R_x(\theta) = e^{-i\theta X/2} = \cos(\theta/2)I - i\sin(\theta/2)X$.