---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - concept
  - parity-measurement
  - joint-measurement
  - error-correction
---
# Parity Measurements

## Definition
A **Parity Measurement** measures multi-qubit Pauli joint observables such as $Z_i Z_j$ or $X_i X_j$ without revealing individual qubit state values.

## Why It Matters
Parity measurements extract error syndrome information in Quantum Error Correction codes without destroying encoded quantum superpositions.

## Implementation
```python
from qiskit import QuantumCircuit

# Measure parity Z0 Z1 using ancilla qubit 2
qc = QuantumCircuit(3, 1)
qc.cx(0, 2)
qc.cx(1, 2)
qc.measure(2, 0)

print("Parity measurement circuit initialized.")
```

## Prerequisites
- [[Multi Qubit Measurement]]
- [[CNOT]]

## Related Concepts
- [[Quantum Errors]]
- [[Bit Flip Code]]

## Microsoft Quantum Katas

**Topic:** Measurements - Joint & Parity Measurements

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit