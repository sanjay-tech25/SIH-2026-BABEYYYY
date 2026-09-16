---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - probability
  - born-rule
  - expectation-value
---
# Probability

## Definition
Quantum mechanics uses complex amplitudes $\alpha_x$ whose squared magnitudes $|\alpha_x|^2$ dictate classical measurement outcome probabilities.

---

## Key Formulas
$$P(x) = |\alpha_x|^2, \quad \sum_x P(x) = 1$$
$$\text{Expectation Value: } \langle A \rangle = \langle \psi | A | \psi \rangle$$

---

## Exercises

### Exercise 1: Expectation Value Calculation
Calculate expectation value $\langle Z \rangle$ for state $|+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$.

**Solution Approach**:
$$\langle + | Z | + \rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix} \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix} = \frac{1}{2}(1 - 1) = 0$$

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation (`tutorials/SingleQubitSystemMeasurements/Tasks.qs`).

---

## Modern Qiskit Implementation

```python
from qiskit.quantum_info import Statevector, SparsePauliOp
import numpy as np

sv = Statevector([1/np.sqrt(2), 1/np.sqrt(2)])
Z = SparsePauliOp("Z")
exp_val = np.real(sv.expectation_value(Z))

print("Expectation value <+|Z|+>:", exp_val)
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/SingleQubitSystemMeasurements/README.md`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/operators/sparse_pauli_op.py`