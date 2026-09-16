---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - concept
  - ghz-state
  - entanglement
  - multi-qubit
---
# GHZ States

## Definition
A **Greenberger-Horne-Zeilinger (GHZ) state** is a maximally entangled $n$-qubit quantum state ($n \ge 3$) defined by:
$$|\text{GHZ}_n\rangle = \frac{|0\rangle^{\otimes n} + |1\rangle^{\otimes n}}{\sqrt{2}}$$

## Why It Matters
GHZ states exhibit non-local multi-particle quantum correlations that cannot be explained by local hidden variable theories, demonstrating non-locality without inequalities.

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

def create_ghz(n):
    qc = QuantumCircuit(n)
    qc.h(0)
    for i in range(n - 1):
        qc.cx(i, i + 1)
    return qc

ghz3 = create_ghz(3)
sv = Statevector.from_instruction(ghz3)
print("3-Qubit GHZ Statevector Amplitudes:", sv.data)
```

## Prerequisites
- [[Bell States]]
- [[Entanglement]]

## Related Concepts
- [[GHZ Game]]
- [[Multi Qubit Measurement]]

## Microsoft Quantum Katas

**Topic:** Entanglement - GHZ States

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit