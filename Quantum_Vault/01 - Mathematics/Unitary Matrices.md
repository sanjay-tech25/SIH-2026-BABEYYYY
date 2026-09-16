---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - matrices
  - unitary
  - quantum-gates
---
# Unitary Matrices

## Definition
A square complex matrix $U$ is **unitary** if its conjugate transpose $U^\dagger$ equals its inverse $U^{-1}$:
$$U^\dagger U = U U^\dagger = I$$

## Why It Matters
In quantum mechanics, all closed quantum system time evolutions and quantum logic gates are represented strictly by unitary operators. Unitary evolution preserves vector norm lengths, ensuring probability conservation ($\sum P(x) = 1$).

## Intuition
- **Level 1 (Intuition)**: A unitary matrix acts as a generalized rotation in complex vector space. It changes the direction of a statevector arrow without stretching or shrinking its length.
- **Level 2 (Mathematical)**: Inner products are invariant under unitary transformations: $\langle U \phi | U \psi \rangle = \langle \phi | U^\dagger U | \psi \rangle = \langle \phi | \psi \rangle$.
- **Level 3 (Implementation)**: Qiskit checks unitarity when custom `Operator` objects are instantiated; non-unitary matrices trigger errors.

## Mathematical Foundation

### Unitary Conditions
1. $U^\dagger U = I$
2. Norm preservation: $\| U |\psi\rangle \| = \| |\psi\rangle \|$
3. Determinant magnitude: $|\det(U)| = 1 \implies \det(U) = e^{i\phi}$
4. Eigenvalues lie on complex unit circle: $\lambda_j = e^{i\theta_j}$

## Key Equations
$$U^\dagger U = U U^\dagger = I$$
$$\langle U \phi | U \psi \rangle = \langle \phi | \psi \rangle$$
$$\| U |\psi\rangle \| = \| |\psi\rangle \|$$

## Example
Verify that single-qubit rotation $R_z(\theta) = \begin{pmatrix} e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2} \end{pmatrix}$ is unitary:
$$R_z(\theta)^\dagger = \begin{pmatrix} e^{i\theta/2} & 0 \\ 0 & e^{-i\theta/2} \end{pmatrix}$$
$$R_z(\theta)^\dagger R_z(\theta) = \begin{pmatrix} e^{i\theta/2} e^{-i\theta/2} & 0 \\ 0 & e^{-i\theta/2} e^{i\theta/2} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} = I$$

## Circuit
Every quantum gate or circuit block corresponds to a composite unitary matrix.

## Implementation
```python
import numpy as np

def is_unitary(matrix):
    U = np.array(matrix, dtype=complex)
    identity = np.eye(U.shape[0])
    return np.allclose(U.conj().T @ U, identity)

# Test Pauli Y gate
Y = np.array([[0, -1j], [1j, 0]])
print("Is Pauli Y Unitary?", is_unitary(Y))
```

## Prerequisites
- [[Matrices]]
- [[Complex Numbers]]

## Related Concepts
- [[Vectors]]
- [[Eigenvalues & Eigenvectors]]
- [[Pauli X]]
- [[Hadamard]]

## Algorithms Using This
All quantum gates and circuits are unitary transformations.

## Microsoft Quantum Katas

**Topic:** Linear Algebra & Unitary Matrices

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit