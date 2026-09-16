---
type: gate
level: intermediate
status: completed
difficulty: medium
tags:
  - gate
  - t-gate
  - non-clifford
  - universal-gate-set
---
# T Gate

## Definition
The **T gate** ($\pi/8$ gate, $\sqrt{S}$) is a single-qubit unitary gate that shifts the phase of basis state $|1\rangle$ by $\pi/4$ radians ($45^\circ$).

## Why It Matters
The T gate is a **non-Clifford gate**. Adding the T gate to the Clifford set ($H, S, \text{CNOT}$) creates a **universal quantum gate set**, capable of approximating any arbitrary unitary operation to arbitrary precision.

## Intuition
- **Level 1 (Intuition)**: Applying T twice gives S ($T^2 = S$), and applying T four times gives Z ($T^4 = Z$). It rotates the qubit by $45^\circ$ around the Bloch $Z$-axis.
- **Level 2 (Mathematical)**: Matrix $T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & \frac{1+i}{\sqrt{2}} \end{pmatrix}$.
- **Level 3 (Implementation)**: In Qiskit, `qc.t(0)` applies the T gate; `qc.tdg(0)` applies $T^\dagger$.

## Mathematical Foundation

### Matrix Representation
$$T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix}$$
Conjugate transpose $T^\dagger$:
$$T^\dagger = \begin{pmatrix} 1 & 0 \\ 0 & e^{-i\pi/4} \end{pmatrix}$$

### Action on Basis States
$$T|0\rangle = |0\rangle, \quad T|1\rangle = e^{i\pi/4}|1\rangle = \frac{1+i}{\sqrt{2}}|1\rangle$$

## Key Equations
$$T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix}$$
$$T^2 = S, \quad T^4 = Z$$
$$T T^\dagger = I$$

## Example
Apply $T$ to $|+\rangle$:
$$T|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{e^{i\pi/4}}{\sqrt{2}}|1\rangle$$

## Circuit
```text
q_0: ──[T]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)
qc.t(0)

sv = Statevector.from_instruction(qc)
print("Statevector after H then T:", sv.data)
```

## Prerequisites
- [[Complex Numbers]]
- [[S Gate]]
- [[Pauli Z]]

## Related Concepts
- [[Hadamard]]
- [[Bloch Sphere]]

## Algorithms Using This
- Universal fault-tolerant circuits and T-factory magic state distillation.

## Common Mistakes
- Historical naming confusion: $T$ is called the $\pi/8$ gate because up to a global phase, $T = e^{i\pi/8} \begin{pmatrix} e^{-i\pi/8} & 0 \\ 0 & e^{i\pi/8} \end{pmatrix} = R_z(\pi/4)$, even though the relative phase shift is $\pi/4$.

## Further Learning
- Read about the Solovay-Kitaev theorem on efficient approximation of arbitrary single-qubit unitaries using sequences of $H$ and $T$ gates.