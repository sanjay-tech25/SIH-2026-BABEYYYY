---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - pure-states
  - statevector
  - density-matrix
---
# Pure States

## Definition
A **pure state** is a quantum state that can be fully described by a single state vector $|\psi\rangle$ in Hilbert space $\mathcal{H}$.

## Why It Matters
Pure states represent physical systems with maximum possible knowledge and zero classical uncertainty. Quantum algorithms act on pure states via unitary gate transformations.

## Intuition
- **Level 1 (Intuition)**: A pure state is like a laser beam pointing in a perfectly known direction. There is no classical randomness or thermal uncertainty about what state vector prepared the system.
- **Level 2 (Mathematical)**: Density matrix of a pure state is an idempotent projection operator $\rho = |\psi\rangle\langle\psi|$ satisfying $\rho^2 = \rho$ and purity $\text{Tr}(\rho^2) = 1$.
- **Level 3 (Implementation)**: Standard Qiskit state vectors initialized via `Statevector` represent pure states.

## Mathematical Foundation
$$\text{State Vector: } |\psi\rangle = \sum_x \alpha_x |x\rangle$$
$$\text{Pure Density Matrix: } \rho = |\psi\rangle\langle\psi|$$
$$\text{Purity Condition: } \gamma = \text{Tr}(\rho^2) = 1$$

## Key Equations
$$\rho = |\psi\rangle\langle\psi|$$
$$\text{Tr}(\rho^2) = 1$$

## Implementation
```python
from qiskit.quantum_info import Statevector, DensityMatrix
import numpy as np

sv = Statevector([1/np.sqrt(2), 1/np.sqrt(2)])
rho = DensityMatrix(sv)

purity = np.real(np.trace(rho.data @ rho.data))
print("Pure State Purity:", purity)
```

## Prerequisites
- [[Qubit]]
- [[Quantum State]]

## Related Concepts
- [[Mixed States]]
- [[Normalization]]

## Microsoft Quantum Katas

**Topic:** Quantum States & Pure States

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit