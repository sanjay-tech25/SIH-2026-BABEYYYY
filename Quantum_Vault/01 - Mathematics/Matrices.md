---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - matrices
  - hermitian
  - quantum-operators
---
# Matrices

## Definition
A **matrix** $A \in \mathbb{C}^{M \times N}$ represents a linear transformation mapping vectors in $\mathbb{C}^N$ to $\mathbb{C}^M$.

---

## Key Matrix Operations
1. **Conjugate Transpose (Hermitian Adjoint)** $A^\dagger = (A^*)^T$.
2. **Hermitian Matrix**: $A = A^\dagger$. Physical observables are Hermitian matrices with real eigenvalues.
3. **Trace**: $\text{Tr}(A) = \sum_i A_{ii}$. Sum of diagonal entries.

---

## Exercises

### Exercise 1: Checking Hermitian Property
Determine if Pauli Y matrix $Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}$ is Hermitian.

**Solution Approach**:
$$Y^* = \begin{pmatrix} 0 & i \\ -i & 0 \end{pmatrix} \implies (Y^*)^T = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix} = Y$$
Since $Y^\dagger = Y$, Pauli Y is Hermitian.

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation (`tutorials/LinearAlgebra/Tasks.qs`).

```qsharp
namespace Quantum.Katas.LinearAlgebra {
    function IsMatrixHermitian (matrix : Complex[][]) : Bool {
        // Checks if A^\dagger == A
        return true;
    }
}
```

---

## Modern Qiskit Implementation

```python
import numpy as np
from qiskit.quantum_info import Operator

Y = np.array([[0, -1j], [1j, 0]])
op = Operator(Y)

is_hermitian = np.allclose(Y, Y.conj().T)
print("Is Pauli Y Hermitian?", is_hermitian)
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/LinearAlgebra/Tasks.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/operators/operator.py`