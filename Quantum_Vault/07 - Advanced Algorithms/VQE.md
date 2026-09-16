---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - vqe
  - nisq
  - quantum-chemistry
  - variational
---
# VQE

## Problem
Given a complex quantum system Hamiltonian operator $H$, find its lowest eigenvalue $E_0$ (the **ground state energy**) and its corresponding ground state wave function $|E_0\rangle$.

## Classical Approach
Classically, diagonalizing an $n$-qubit Hamiltonian matrix of size $2^n \times 2^n$ requires $O(2^{3n})$ memory and computational operations, making quantum chemistry simulations for large molecules impossible.

## Quantum Idea
The **Variational Quantum Eigensolver (VQE)** is a hybrid quantum-classical algorithm. A quantum computer prepares a parameterized ansatz state $|\psi(\mathbf{\theta})\rangle$ and measures expectation value $\langle H \rangle_\mathbf{\theta}$. A classical optimizer then updates parameters $\mathbf{\theta}$ to minimize energy, bound by the **Variational Principle**. Designed specifically for **NISQ** hardware.

## Prerequisites
- [[Eigenvalues & Eigenvectors]]
- [[Quantum State]]
- [[Qiskit]]

## Core Quantum Concepts
- [[Superposition]]
- [[Entanglement]]
- [[Measurement]]

## Mathematical Formulation

### The Variational Principle
For any normalized trial state $|\psi(\mathbf{\theta})\rangle$ and Hermitian Hamiltonian $H$:
$$E(\mathbf{\theta}) = \langle \psi(\mathbf{\theta}) | H | \psi(\mathbf{\theta}) \rangle \ge E_0$$
The expectation value is guaranteed to be an upper bound on true ground state energy $E_0$.

### Pauli Operator Decomposition
Hamiltonian $H$ is expressed as a linear combination of Pauli strings $P_i \in \{I, X, Y, Z\}^{\otimes n}$:
$$H = \sum_{i} c_i P_i$$
Energy expectation value computed on quantum hardware:
$$\langle H \rangle_\mathbf{\theta} = \sum_{i} c_i \langle \psi(\mathbf{\theta}) | P_i | \psi(\mathbf{\theta}) \rangle$$

## Step-by-Step Algorithm
1. Map molecular/physical problem to qubit Hamiltonian $H = \sum c_i P_i$.
2. Choose a parameterized circuit ansatz $U(\mathbf{\theta})$ (e.g. RealAmplitudes, EfficientSU2).
3. On Quantum Hardware / Simulator:
   a. Prepare state $|\psi(\mathbf{\theta})\rangle = U(\mathbf{\theta})|0\rangle$.
   b. Measure expectation values $\langle P_i \rangle$ for all Pauli strings.
   c. Sum results to compute $E(\mathbf{\theta}) = \sum c_i \langle P_i \rangle$.
4. On Classical Computer:
   a. Pass $E(\mathbf{\theta})$ to a classical optimizer (COBYLA, SPSA, L-BFGS-B).
   b. Update parameters $\mathbf{\theta} \to \mathbf{\theta}'$.
5. Repeat steps 3–4 until energy convergence $|E(\mathbf{\theta}') - E(\mathbf{\theta})| < \epsilon$.

## Quantum Circuit
```text
q_0: ──[ R_y(θ_0) ]──■──[ R_y(θ_2) ]──[ Measure Pauli P_i ]
                     │
q_1: ──[ R_y(θ_1) ]──⊕──[ R_y(θ_3) ]──[ Measure Pauli P_i ]
```

## Complexity
| Method | Complexity |
|---|---|
| Full Classical Diagonalization | $O(2^{3n})$ |
| Hybrid VQE | **Short-depth NISQ circuit + classical loop** |

## Qiskit Implementation
```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp, Statevector
from scipy.optimize import minimize

# Define 2-qubit Hamiltonian: H = 0.5*Z0 + 0.5*X1
H = SparsePauliOp.from_list([("IZ", 0.5), ("XI", 0.5)])

def ansatz(params):
    qc = QuantumCircuit(2)
    qc.ry(params[0], 0)
    qc.ry(params[1], 1)
    qc.cx(0, 1)
    return qc

def cost_function(params):
    qc = ansatz(params)
    sv = Statevector.from_instruction(qc)
    # Compute expectation value <ψ|H|ψ>
    energy = np.real(sv.expectation_value(H))
    return energy

# Minimize energy classically using COBYLA
init_params = [0.1, 0.1]
res = minimize(cost_function, init_params, method='COBYLA')
print("VQE Discovered Minimum Energy Ground State:", res.fun)
```

## Example
Consider $H = Z$. Lowest eigenvalue is $-1$ (state $|1\rangle$).
- Trial state $|\psi(\theta)\rangle = \cos(\theta/2)|0\rangle + \sin(\theta/2)|1\rangle$.
- Energy $\langle Z \rangle = \cos^2(\theta/2) - \sin^2(\theta/2) = \cos\theta$.
- Classical optimizer drives $\theta \to \pi \implies E(\pi) = -1.0$.

## Applications
Molecular energy surface calculation, drug discovery, materials science simulation, and quantum chemistry.

## Limitations
Prone to barren plateaus in optimization landscape for deep circuits and sensitive to NISQ hardware noise.

## Related Algorithms
- [[QAOA]]
- [[Eigenvalues & Eigenvectors]]

## Prerequisites Graph
[[Eigenvalues & Eigenvectors]] → [[Quantum State]] → [[Qiskit]] → [[VQE]]

## Resources
- Paper: Peruzzo et al. (2014), Nature Communications.
- Qiskit Nature Documentation: VQE Tutorial