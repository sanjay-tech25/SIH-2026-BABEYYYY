---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - s-gate
  - phase-gate
  - clifford
---
# S Gate

## Definition
The **S gate** (Phase gate, $\sqrt{Z}$) is a single-qubit unitary gate that shifts the phase of basis state $|1\rangle$ by $\pi/2$ radians ($90^\circ$).

## Why It Matters
The S gate is a fundamental member of the **Clifford group**, which maps Pauli operators to Pauli operators. It acts as an intermediate phase gate between identity and Pauli Z.

## Intuition
- **Level 1 (Intuition)**: Applying S twice is identical to applying Z ($S^2 = Z$). It rotates the qubit state vector by $90^\circ$ around the Bloch sphere $Z$-axis.
- **Level 2 (Mathematical)**: Matrix $S = \begin{pmatrix} 1 & 0 \\ 0 & i \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/2} \end{pmatrix}$.
- **Level 3 (Implementation)**: In Qiskit, `qc.s(0)` applies the S gate; `qc.sdg(0)` applies $S^\dagger$.

## Mathematical Foundation

### Matrix Representation
$$S = \begin{pmatrix} 1 & 0 \\ 0 & i \end{pmatrix}$$
Conjugate transpose $S^\dagger$ ($S$-dagger):
$$S^\dagger = \begin{pmatrix} 1 & 0 \\ 0 & -i \end{pmatrix}$$

### Action on Basis States
$$S|0\rangle = |0\rangle, \quad S|1\rangle = i|1\rangle$$
Action on $|+\rangle$:
$$S|+\rangle = \frac{|0\rangle + i|1\rangle}{\sqrt{2}} = |+i\rangle$$

## Key Equations
$$S = \begin{pmatrix} 1 & 0 \\ 0 & i \end{pmatrix}$$
$$S^2 = Z$$
$$S S^\dagger = I$$

## Example
Apply $S$ to state $|+\rangle$:
$$S|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{i}{\sqrt{2}}|1\rangle = |+i\rangle$$
This moves the state vector to the $+Y$ pole on the Bloch sphere equator.

## Circuit
```text
q_0: ──[S]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)
qc.s(0)

sv = Statevector.from_instruction(qc)
print("Statevector after H then S:", sv.data)
```

## Prerequisites
- [[Complex Numbers]]
- [[Pauli Z]]

## Related Concepts
- [[T Gate]]
- [[Bloch Sphere]]

## Algorithms Using This
- [[Quantum Fourier Transform]]
- Fault-tolerant quantum computing architectures.

## Common Mistakes
- Confusing $S$ ($90^\circ$ phase shift) with $T$ ($45^\circ$ phase shift).

## Further Learning
- Read about the Gottesman-Knill theorem and why Clifford gates ($H, S, \text{CNOT}$) can be simulated efficiently on classical computers.