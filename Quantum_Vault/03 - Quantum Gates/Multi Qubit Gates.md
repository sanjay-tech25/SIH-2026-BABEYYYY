---
type: gate
level: beginner
status: completed
difficulty: medium
tags:
  - gate
  - multi-qubit
  - cnot
  - cz
  - swap
---
# Multi Qubit Gates

## Definition
**Multi-Qubit Gates** are unitary operations acting simultaneously on two or more qubits. Key multi-qubit gates include CNOT (CX), CZ, SWAP, Toffoli (CCX), and Fredkin (CSWAP).

## Mathematical Foundation
- **CNOT**: $\text{diag}(I, X)$
- **CZ**: $\text{diag}(1, 1, 1, -1)$
- **Toffoli (CCX)**: 3-qubit gate flipping target if both controls are 1.

## Implementation
```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(3)
qc.cx(0, 1)        # 2-qubit CNOT
qc.cz(1, 2)        # 2-qubit CZ
qc.ccx(0, 1, 2)    # 3-qubit Toffoli
print("Multi-qubit circuit depth:", qc.depth())
```

## Prerequisites
- [[Tensor Products]]
- [[CNOT]]

## Related Concepts
- [[Controlled Operations]]
- [[Entanglement]]

## Microsoft Quantum Katas

**Topic:** Multi-Qubit Gates

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit