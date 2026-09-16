---
type: foundation
level: intermediate
status: completed
difficulty: medium
tags:
  - foundation
  - mixed-states
  - density-matrix
  - noise
---
# Mixed States

## Definition
A **mixed state** represents a statistical ensemble of pure quantum states $|\psi_i\rangle$, each occurring with classical probability $p_i$. It is described mathematically by a density matrix $\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$.

## Why It Matters
Mixed states are essential for describing open quantum systems, decoherence, thermal noise, and subsystems of entangled multi-qubit states.

## Intuition
- **Level 1 (Intuition)**: A pure state is like knowing with $100\%$ certainty the direction of a arrow. A mixed state is like having classical uncertainty—for example, a $50\%$ chance the arrow points Up ($|0\rangle$) and a $50\%$ chance it points Down ($|1\rangle$).
- **Level 2 (Mathematical)**: Density matrix $\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$ with $\sum p_i = 1$. Purity satisfies $\text{Tr}(\rho^2) < 1$. Maximally mixed single-qubit state is $\rho = \frac{1}{2}I$.
- **Level 3 (Implementation)**: DensityMatrix objects in Qiskit represent mixed states resulting from noisy channel simulations.

## Mathematical Foundation
$$\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|, \quad p_i \ge 0, \quad \sum_i p_i = 1$$
$$\text{Purity: } \text{Tr}(\rho^2) < 1 \quad (\text{For non-pure mixed states})$$

## Key Equations
$$\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$$
$$\text{Maximally Mixed State: } \rho = \frac{I}{d}$$

## Implementation
```python
from qiskit.quantum_info import DensityMatrix
import numpy as np

# Maximally mixed single-qubit state (50% |0>, 50% |1>)
rho_mixed = DensityMatrix(0.5 * np.eye(2))

purity = np.real(np.trace(rho_mixed.data @ rho_mixed.data))
print("Mixed State Purity:", purity)
```

## Prerequisites
- [[Quantum State]]
- [[Pure States]]

## Related Concepts
- [[Quantum Noise]]
- [[Decoherence]]

## Microsoft Quantum Katas

**Topic:** Mixed States & Density Matrices

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit