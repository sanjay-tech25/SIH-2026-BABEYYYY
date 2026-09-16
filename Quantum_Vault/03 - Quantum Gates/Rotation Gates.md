---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - rotation-gates
  - rx
  - ry
  - rz
---
# Rotation Gates

## Definition
**Rotation Gates** ($R_x(\theta), R_y(\theta), R_z(\theta)$) are single-qubit unitaries that rotate a qubit's Bloch sphere state vector around the $X$, $Y$, or $Z$ axis by angle $\theta$.

## Mathematical Foundation
$$R_x(\theta) = e^{-i \frac{\theta}{2} X} = \begin{pmatrix} \cos(\theta/2) & -i\sin(\theta/2) \\ -i\sin(\theta/2) & \cos(\theta/2) \end{pmatrix}$$
$$R_y(\theta) = e^{-i \frac{\theta}{2} Y} = \begin{pmatrix} \cos(\theta/2) & -\sin(\theta/2) \\ \sin(\theta/2) & \cos(\theta/2) \end{pmatrix}$$
$$R_z(\theta) = e^{-i \frac{\theta}{2} Z} = \begin{pmatrix} e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2} \end{pmatrix}$$

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import numpy as np

qc = QuantumCircuit(1)
qc.rx(np.pi / 2, 0)
qc.ry(np.pi / 4, 0)

sv = Statevector.from_instruction(qc)
print("Statevector after Rx and Ry:", sv.data)
```

## Prerequisites
- [[Pauli X]]
- [[Pauli Y]]
- [[Pauli Z]]

## Related Concepts
- [[Bloch Sphere]]
- [[Phase Gates]]

## Microsoft Quantum Katas

**Topic:** Single Qubit Gates - Rotation Gates

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit