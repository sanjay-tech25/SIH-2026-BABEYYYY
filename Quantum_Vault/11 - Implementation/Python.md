---
type: implementation
level: beginner
status: completed
difficulty: easy
tags:
  - implementation
  - python
  - numpy
  - scipy
---
# Python

## Overview
**Python** is the primary programming language of quantum computing. Libraries such as **NumPy**, **SciPy**, and **Matplotlib** power state vector manipulation, matrix algebra, and visualization.

---

## Essential Scientific Libraries

### 1. NumPy for Quantum Linear Algebra
```python
import numpy as np

# Basis states
ket0 = np.array([1, 0], dtype=complex)
ket1 = np.array([0, 1], dtype=complex)

# Pauli X gate matrix
X = np.array([[0, 1], [1, 0]], dtype=complex)

# Gate application: X |0> = |1>
result = np.dot(X, ket0)
print("X |0> =", result)

# Tensor product |0> (x) |1>
ket01 = np.kron(ket0, ket1)
print("|01> vector:", ket01)
```

### 2. Complex Conjugate Transposition
```python
import numpy as np

# Create complex matrix
A = np.array([[1, 2j], [-2j, 3]], dtype=complex)

# Hermitian adjoint A^dagger
A_dagger = A.conj().T

# Check Hermitian: A^dagger == A
is_hermitian = np.allclose(A, A_dagger)
print("Is matrix Hermitian?", is_hermitian)
```

---

## Environment Setup Guide

```bash
# Recommended Virtual Environment setup
python -m venv quantum_env
source quantum_env/bin/activate  # On Windows: quantum_env\Scripts\activate

# Install core quantum stack
pip install qiskit qiskit-aer numpy scipy matplotlib
```

---

## Prerequisite & Connection Links
- **Prerequisites**: [[Complex Numbers]], [[Vectors]], [[Matrices]]
- **Related Notes**: [[Qiskit]], [[Circuit Experiments]]