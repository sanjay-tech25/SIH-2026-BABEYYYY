---
type: math
level: beginner
status: completed
difficulty: easy
tags:
  - math
  - complex-numbers
  - euler-identity
  - phase
---
# Complex Numbers

## Definition
A **complex number** $z \in \mathbb{C}$ is an extension of the real numbers expressed as:
$$z = a + bi$$
where $a = \text{Re}(z)$ is the real part, $b = \text{Im}(z)$ is the imaginary part, and $i$ is the imaginary unit satisfying $i^2 = -1$.

---

## Polar Form & Euler's Identity
Complex numbers can be represented in polar coordinates $(r, \theta)$:
$$z = r e^{i\theta} = r (\cos\theta + i\sin\theta)$$
where $r = |z| = \sqrt{a^2 + b^2}$ is the modulus and $\theta = \text{arg}(z) = \arctan(b/a)$ is the phase.

---

## Exercises

### Exercise 1: Complex Conjugate Multiplication
Given $z = 3 + 4i$, calculate the product $z \cdot z^*$.

**Solution Approach**:
$$z^* = 3 - 4i$$
$$z \cdot z^* = (3 + 4i)(3 - 4i) = 3^2 - (4i)^2 = 9 - 16(-1) = 9 + 16 = 25 = |z|^2$$

**Key Takeaway**: The product of any complex number with its complex conjugate always yields a non-negative real scalar equal to the squared magnitude $|z|^2$.

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation from the archived Quantum Katas repository (`tutorials/ComplexArithmetic/Tasks.qs`).

```qsharp
namespace Quantum.Katas.ComplexArithmetic {
    open Microsoft.Quantum.Math;

    // Task 1.1: Complex numbers arithmetic
    function ComplexConjugate (c : Complex) : Complex {
        return Complex(c.Real, -c.Imag);
    }
}
```

---

## Modern Qiskit Implementation

```python
import numpy as np

# Complex numbers in Python/NumPy
z = 3 + 4j
z_conj = np.conj(z)
magnitude_sq = np.real(z * z_conj)

print(f"Complex number z: {z}")
print(f"Conjugate z*: {z_conj}")
print(f"Squared magnitude |z|^2: {magnitude_sq}")
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `tutorials/ComplexArithmetic/README.md`
- Source File: `tutorials/ComplexArithmetic/Tasks.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/quantum_info/operators/`