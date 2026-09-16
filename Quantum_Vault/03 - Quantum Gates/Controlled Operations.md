---
type: gate
level: intermediate
status: completed
difficulty: medium
tags:
  - gate
  - controlled-operations
  - control-target
---
# Controlled Operations

## Definition
A **Controlled Operation** $C-U$ applies a target unitary $U$ to a target register if and only if the control qubit is in state $|1\rangle$.

## Mathematical Foundation
$$C-U = |0\rangle\langle 0| \otimes I + |1\rangle\langle 1| \otimes U = \begin{pmatrix} I & 0 \\ 0 & U \end{pmatrix}$$

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import SGate

qc = QuantumCircuit(2)
custom_gate = SGate().to_gate()
controlled_s = custom_gate.control(1)  # Create C-S gate

qc.append(controlled_s, [0, 1])
print("Controlled Gate Created successfully.")
```

## Prerequisites
- [[Multi Qubit Gates]]
- [[CNOT]]

## Related Concepts
- [[Phase Kickback]]
- [[Quantum Oracle]]

## Microsoft Quantum Katas

**Topic:** Controlled Operations

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit