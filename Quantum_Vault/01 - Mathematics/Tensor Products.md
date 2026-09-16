---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - tensor-product
  - kronecker
  - multi-qubit
---
# Tensor Products

## Definition
The **tensor product** (Kronecker product) $\otimes$ combines individual vector spaces to form composite multi-qubit state vector spaces.

---

## Mathematical Formulation
For $2 \times 2$ matrices $A$ and $B$:
$$A \otimes B = \begin{pmatrix} A_{11} B & A_{12} B \\ A_{21} B & A_{22} B \end{pmatrix}$$

---

## Exercises

### Exercise 1: State Vector Tensor Product
Compute $|0\rangle \otimes |1\rangle$.

**Solution Approach**:
$$|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \quad |1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$$
$$|01\rangle = \begin{pmatrix} 1 \cdot \begin{pmatrix} 0 \\ 1 \end{pmatrix} \\ 0 \cdot \begin{pmatrix} 0 \\ 1 \end{pmatrix} \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \\ 0 \\ 0 \end{pmatrix}$$

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation (`tutorials/MultiQubitSystems/Tasks.qs`).

```qsharp
namespace Quantum.Katas.MultiQubitSystems {
    // Tensor product of states
}
```

---

## Modern Qiskit Implementation

```python
import numpy as np

ket0 = np.array([1, 0])
ket1 = np.array([0, 1])
ket01 = np.kron(ket0, ket1)

print("|01> tensor product vector:", ket01)
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/MultiQubitSystems/README.md`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/states/statevector.py`