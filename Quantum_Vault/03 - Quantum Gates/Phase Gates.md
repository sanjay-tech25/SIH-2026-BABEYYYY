---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - phase-gate
  - pauli-z
  - rz
---
# Phase Gates

## Definition
**Phase Gates** are single-qubit unitary operations that leave basis state $|0\rangle$ unchanged while shifting the complex phase of basis state $|1\rangle$ by an angle $\phi$:
$$P(\phi) = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\phi} \end{pmatrix}$$

## Why It Matters
Phase gates allow continuous control over the azimuthal angle on the Bloch sphere equator. Special cases include Pauli Z ($\phi = \pi$), S gate ($\phi = \pi/2$), and T gate ($\phi = \pi/4$).

## Key Equations
$$P(\phi) = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\phi} \end{pmatrix}$$
$$P(\phi) |0\rangle = |0\rangle, \quad P(\phi) |1\rangle = e^{i\phi}|1\rangle$$

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import numpy as np

qc = QuantumCircuit(1)
qc.h(0)
qc.p(np.pi / 3, 0)  # Apply Phase shift pi/3

sv = Statevector.from_instruction(qc)
print("Statevector after P(pi/3):", sv.data)
```

## Prerequisites
- [[Pauli Z]]
- [[S Gate]]
- [[T Gate]]

## Related Concepts
- [[Rotation Gates]]
- [[Bloch Sphere]]

## Microsoft Quantum Katas

**Topic:** Single Qubit Gates - Phase Gates

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit