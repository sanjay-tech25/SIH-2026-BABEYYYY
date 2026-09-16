---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - vectors
  - dirac-notation
  - hilbert-space
---
# Vectors

## Definition
In quantum computing, state vectors represent quantum states as column vectors in a complex Hilbert space $\mathcal{H}^N$.

---

## Dirac Bra-Ket Notation
- **Ket** $|v\rangle$: Column vector $\begin{pmatrix} v_1 \\ v_2 \end{pmatrix}$
- **Bra** $\langle v|$: Row vector with complex conjugate entries $(v_1^*, v_2^*)$
- **Inner Product** $\langle u | v \rangle$: Complex scalar value.
- **Norm**: $\| |v\rangle \| = \sqrt{\langle v | v \rangle} = 1$ for valid quantum state vectors.

---

## Exercises

### Exercise 1: State Vector Inner Product
Calculate $\langle \psi | \phi \rangle$ for $|\psi\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{i}{\sqrt{2}}|1\rangle$ and $|\phi\rangle = \frac{1}{\sqrt{2}}|0\rangle - \frac{1}{\sqrt{2}}|1\rangle$.

**Solution Approach**:
$$\langle \psi | = \begin{pmatrix} \frac{1}{\sqrt{2}} & -\frac{i}{\sqrt{2}} \end{pmatrix}, \quad |\phi\rangle = \begin{pmatrix} \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} \end{pmatrix}$$
$$\langle \psi | \phi \rangle = \left(\frac{1}{\sqrt{2}}\right)\left(\frac{1}{\sqrt{2}}\right) + \left(-\frac{i}{\sqrt{2}}\right)\left(-\frac{1}{\sqrt{2}}\right) = \frac{1}{2} + \frac{i}{2} = \frac{1+i}{2}$$

**Key Takeaway**: Complex inner products encode probability overlaps and phase relationship details between quantum states.

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation from the archived Quantum Katas repository (`tutorials/LinearAlgebra/Tasks.qs`).

```qsharp
namespace Quantum.Katas.LinearAlgebra {
    // Task: Inner product of two vectors
    function VectorInnerProduct (v1 : Complex[], v2 : Complex[]) : Complex {
        mutable result = Complex(0.0, 0.0);
        for i in 0 .. Length(v1) - 1 {
            let term = ComplexTimes(ComplexConjugate(v1[i]), v2[i]);
            set result = ComplexAdd(result, term);
        }
        return result;
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit.quantum_info import Statevector
import numpy as np

v1 = Statevector([1/np.sqrt(2), 1j/np.sqrt(2)])
v2 = Statevector([1/np.sqrt(2), -1/np.sqrt(2)])

inner_prod = v1.inner(v2)
print("Vector Inner Product <v1|v2>:", inner_prod)
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/LinearAlgebra/README.md`
- Source File: `tutorials/LinearAlgebra/Tasks.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/states/statevector.py`