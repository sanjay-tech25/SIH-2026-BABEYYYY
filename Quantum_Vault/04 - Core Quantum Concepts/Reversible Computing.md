---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - concept
  - reversible-computing
  - uncomputation
  - landauer
---
# Reversible Computing

## Definition
**Reversible Computing** is a computational paradigm where every state transformation is bijective (one-to-one) and deterministic in both forward and backward directions, conserving information without heat dissipation (Landauer's Principle).

## Why It Matters
Because quantum operators are unitary ($U^\dagger U = I$), quantum computation is strictly reversible. Classical logic functions must be converted to reversible forms before embedding into quantum circuits.

## Key Concepts
1. **Uncomputation**: Reversing scratch ancilla calculations $f(x)$ back to $|0\rangle$ using $U^\dagger$.
2. **Reversible Gates**: Toffoli (CCX), CNOT, SWAP, Fredkin (CSWAP).

## Implementation
```python
from qiskit import QuantumCircuit

# Reversible AND gate using Toffoli
qc = QuantumCircuit(3)
qc.ccx(0, 1, 2)  # target q2 holds a AND b
print("Reversible AND gate circuit depth:", qc.depth())
```

## Prerequisites
- [[Truth Tables]]
- [[Adjoint Operations]]

## Related Concepts
- [[Quantum Arithmetic]]
- [[Unitary Operations]]

## Microsoft Quantum Katas

**Topic:** Reversible Computing

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit