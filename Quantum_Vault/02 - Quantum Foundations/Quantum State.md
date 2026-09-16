---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - quantum-state
  - density-matrix
---
# Quantum State

## Definition
A **quantum state** encapsulates all physical information about a quantum system. A state can be **pure** (described by a single state vector $|\psi\rangle$) or **mixed** (a statistical ensemble of pure states described by a density matrix $\rho$).

## Why It Matters
State vectors dictate how quantum information evolves under unitary transforms ($|\psi'\rangle = U|\psi\rangle$). Understanding state representations is critical for quantum simulation and quantum algorithm design.

## Intuition
- **Level 1 (Intuition)**: A pure quantum state is a precise, definite wave function direction. A mixed state is like having a weighted coin where you are uncertain which pure quantum state was prepared.
- **Level 2 (Mathematical)**: Pure state: $\rho = |\psi\rangle\langle\psi|$ with $\text{Tr}(\rho^2) = 1$. Mixed state: $\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$ with $\text{Tr}(\rho^2) < 1$.
- **Level 3 (Implementation)**: Statevectors in Qiskit inspect complete amplitude vectors, while density matrices describe noisy/mixed state systems.

## Mathematical Foundation

### Pure State Representation
$$|\psi\rangle = \sum_{x \in \{0,1\}^n} \alpha_x |x\rangle$$

### Density Matrix Representation
$$\rho = \sum_i p_i |\psi_i\rangle \langle \psi_i|, \quad \sum_i p_i = 1, \quad p_i \ge 0$$
Properties of Density Matrix $\rho$:
1. Hermitian: $\rho^\dagger = \rho$
2. Unit Trace: $\text{Tr}(\rho) = 1$
3. Positive Semi-definite: $\langle v|\rho|v\rangle \ge 0$ for all $|v\rangle$

### Global Phase Invariance
Two states $|\psi\rangle$ and $e^{i\gamma}|\psi\rangle$ represent identical physical quantum states because measurement probabilities for any operator $A$ are unchanged:
$$\langle e^{i\gamma}\psi | A | e^{i\gamma}\psi \rangle = e^{-i\gamma} e^{i\gamma} \langle \psi | A | \psi \rangle = \langle \psi | A | \psi \rangle$$

## Key Equations
$$\text{Pure Density Matrix: } \rho = |\psi\rangle\langle\psi|$$
$$\text{Purity Metric: } \gamma = \text{Tr}(\rho^2) \quad (\gamma = 1 \text{ for pure}, \gamma < 1 \text{ for mixed})$$
$$\text{Global Phase Equivalence: } |\psi\rangle \equiv e^{i\gamma}|\psi\rangle$$

## Example
Pure state $|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$:
$$\rho = |+\rangle\langle+| = \frac{1}{2}\begin{pmatrix} 1 \\ 1 \end{pmatrix} \begin{pmatrix} 1 & 1 \end{pmatrix} = \begin{pmatrix} 1/2 & 1/2 \\ 1/2 & 1/2 \end{pmatrix}$$
Verify Purity: $\text{Tr}(\rho^2) = (1/4 + 1/4) + (1/4 + 1/4) = 1$.

## Circuit
In circuit execution, initial state $|0\dots0\rangle$ evolves through quantum gates into final state $|\psi_{final}\rangle$.

## Implementation
```python
from qiskit.quantum_info import Statevector, DensityMatrix
import numpy as np

# Create pure state |+>
ket_plus = np.array([1, 1]) / np.sqrt(2)
sv = Statevector(ket_plus)

# Density matrix of pure state
rho_pure = DensityMatrix(sv)
print("Pure State Density Matrix:\n", rho_pure.data)
print("Purity:", np.real(np.trace(rho_pure.data @ rho_pure.data)))
```

## Prerequisites
- [[Vectors]]
- [[Matrices]]
- [[Qubit]]

## Related Concepts
- [[Normalization]]
- [[Superposition]]
- [[Bloch Sphere]]

## Algorithms Using This
- All quantum algorithms evolve quantum state vectors.

## Common Mistakes
- Treating relative phase $e^{i\phi}$ (which creates physical interference) as if it were an unobservable global phase $e^{i\gamma}$.

## Further Learning
- Read about partial trace operation $\text{Tr}_B(\rho_{AB})$ to extract subsystems of entangled quantum states.