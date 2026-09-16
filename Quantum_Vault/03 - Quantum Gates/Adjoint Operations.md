---
type: gate
level: beginner
status: completed
difficulty: easy
tags:
  - gate
  - adjoint
  - inverse
  - uncomputation
---
# Adjoint Operations

## Definition
An **Adjoint Operation** $U^\dagger$ (dagger or inverse operation) of a unitary gate $U$ is its conjugate transpose. Since $U$ is unitary, $U^\dagger = U^{-1}$.

## Why It Matters
Adjoint operations uncompute intermediate ancilla qubit states, reversing quantum transformations and enabling phase estimation routines ($\text{QFT}^\dagger$).

## Key Equations
$$U U^\dagger = U^\dagger U = I$$
$$(A B)^\dagger = B^\dagger A^\dagger$$

## Implementation
```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(1)
qc.t(0)
qc_inverse = qc.inverse()  # Generates T^dagger gate

print("Inverse Circuit Gates:", [gate.name for gate, _, _ in qc_inverse.data])
```

## Prerequisites
- [[Matrices]]
- [[Unitary Matrices]]

## Related Concepts
- [[Quantum Fourier Transform]]
- [[Reversible Computing]]

## Microsoft Quantum Katas

**Topic:** Adjoint Operations & Inverses

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit