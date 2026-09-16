---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - quantum-walks
  - discrete-walk
  - continuous-walk
---
# Quantum Walks

## Definition
**Quantum Walks** are quantum mechanical analogues of classical random walks, defined on graph vertices $V$. They propagate via unitary coin operations and shift operators, exhibiting quadratic spreading speedup $r \propto t$ compared to classical diffusion $r \propto \sqrt{t}$.

## Types
1. **Discrete Quantum Walk**: Uses coin register $|c\rangle$ and position register $|x\rangle$ with step operator $S(C \otimes I)$.
2. **Continuous-Time Quantum Walk**: Driven directly by graph Hamiltonian adjacency matrix $H = A$, state evolution $|\psi(t)\rangle = e^{-i A t} |\psi(0)\rangle$.

## Implementation
```python
from qiskit import QuantumCircuit
import numpy as np

# Single step of 1D discrete quantum walk
qc = QuantumCircuit(3)
qc.h(0)  # Coin flip
qc.cx(0, 1)  # Conditional shift right
qc.x(0)
qc.cx(0, 2)  # Conditional shift left
qc.x(0)

print("Discrete Quantum Walk step circuit depth:", qc.depth())
```

## Prerequisites
- [[Unitary Operations]]
- [[Superposition]]

## Related Concepts
- [[Grover Algorithm]]
- [[Quantum Simulation]]

## Microsoft Quantum Katas

**Topic:** Advanced Quantum Algorithms - Quantum Walks

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit