---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - pauli-z
  - phase-flip
---
# Pauli Z

## Definition
The **Pauli Z gate** is a single-qubit unitary gate that leaves basis state $|0\rangle$ unchanged while flipping the phase of basis state $|1\rangle$ by multiplying it by $-1$.

## Why It Matters
Phase flips are fundamental to quantum algorithms. While bit flips swap state entries, phase flips alter phase relationship patterns, enabling amplitude interference.

## Intuition
- **Level 1 (Intuition)**: Z leaves $|0\rangle$ alone, but turns $|1\rangle$ into $-|1\rangle$. On the Bloch sphere, Z rotates the state vector by $\pi$ radians around the vertical $Z$-axis.
- **Level 2 (Mathematical)**: Matrix $Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$. $Z(\alpha|0\rangle + \beta|1\rangle) = \alpha|0\rangle - \beta|1\rangle$.
- **Level 3 (Implementation)**: In Qiskit, `qc.z(0)` applies the Z gate to qubit 0.

## Mathematical Foundation

### Matrix Representation
$$Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$$

### Action on Basis States
$$Z|0\rangle = |0\rangle, \quad Z|1\rangle = -|1\rangle$$
Action on superposition basis $|+\rangle$ and $|-\rangle$:
$$Z|+\rangle = |-\rangle, \quad Z|-\rangle = |+\rangle$$

### Algebraic Properties
- Hermitian: $Z^\dagger = Z$
- Unitary: $Z^\dagger Z = Z^2 = I$
- Eigenvalues: $\lambda_1 = +1, \lambda_2 = -1$
- Eigenstates: $|0\rangle$ and $|1\rangle$ (Computational basis states are eigenstates of Z!)

## Key Equations
$$Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$$
$$Z(\alpha|0\rangle + \beta|1\rangle) = \alpha|0\rangle - \beta|1\rangle$$
$$Z|+\rangle = |-\rangle$$

## Example
Apply $Z$ to state $|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$:
$$Z|+\rangle = \frac{1}{\sqrt{2}}Z|0\rangle + \frac{1}{\sqrt{2}}Z|1\rangle = \frac{1}{\sqrt{2}}|0\rangle - \frac{1}{\sqrt{2}}|1\rangle = |-\rangle$$

## Circuit
```text
q_0: ──[Z]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)  # Create |+> state
qc.z(0)  # Apply Z -> converts |+> to |->

sv = Statevector.from_instruction(qc)
print("Statevector after H then Z:", sv.data)
```

## Prerequisites
- [[Matrices]]
- [[Qubit]]

## Related Concepts
- [[Pauli X]]
- [[Pauli Y]]
- [[S Gate]]
- [[T Gate]]

## Algorithms Using This
- [[Phase Kickback]]
- [[Grover Algorithm]]
- [[Deutsch Algorithm]]

## Common Mistakes
- Expecting $Z$ to change measurement probabilities of state $|1\rangle$ when measured directly in computational basis ($|-1|^2 = 1$). $Z$ only has physical consequences when combined with superposition or basis rotation gates (like Hadamard).

## Further Learning
- Prove that $H Z H = X$ (Basis transformation between X and Z operators).