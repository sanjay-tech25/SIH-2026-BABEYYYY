---
type: error-correction
level: intermediate
status: completed
difficulty: medium
tags:
  - qec
  - bit-flip-code
  - repetition-code
---
# Bit Flip Code

## Definition
The 3-qubit **Bit Flip Code** encodes 1 logical qubit state $\alpha|0\rangle + \beta|1\rangle$ into 3 physical qubits:
$$|0_L\rangle = |000\rangle, \quad |1_L\rangle = |111\rangle$$

## Implementation
```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(5, 1)
# Encoding
qc.cx(0, 1)
qc.cx(0, 2)
# Syndrome measurement on ancillas 3, 4
qc.cx(0, 3); qc.cx(1, 3)
qc.cx(1, 4); qc.cx(2, 4)

print("Bit flip repetition code depth:", qc.depth())
```

## Prerequisites
- [[Quantum Errors]]
- [[Parity Measurements]]

## Microsoft Quantum Katas

**Topic:** Error Correction - Bit Flip Code

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit