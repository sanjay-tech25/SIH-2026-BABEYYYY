---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - eigenvalues
  - eigenvectors
  - spectral-decomposition
---
# Eigenvalues & Eigenvectors

## Definition
For a matrix $A$, an **eigenvector** $|v\rangle \ne 0$ and **eigenvalue** $\lambda$ satisfy:
$$A |v\rangle = \lambda |v\rangle$$

---

## Exercises

### Exercise 1: Pauli Z Eigenvalues
Find eigenvalues and eigenvectors of Pauli Z $Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$.

**Solution Approach**:
$$Z |0\rangle = 1 |0\rangle \implies \text{Eigenvalue } \lambda_1 = +1, \text{ Eigenvector } |0\rangle$$
$$Z |1\rangle = -1 |1\rangle \implies \text{Eigenvalue } \lambda_2 = -1, \text{ Eigenvector } |1\rangle$$

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation (`tutorials/LinearAlgebra/Tasks.qs`).

---

## Modern Qiskit Implementation

```python
import numpy as np

Z = np.array([[1, 0], [0, -1]])
eigenvals, eigenvecs = np.linalg.eig(Z)

print("Pauli Z Eigenvalues:", eigenvals)
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/LinearAlgebra/Tasks.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/operators/`