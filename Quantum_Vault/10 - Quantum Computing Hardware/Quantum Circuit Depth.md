---
type: hardware
level: beginner
status: completed
difficulty: easy
tags:
  - hardware
  - circuit-depth
  - critical-path
---
# Quantum Circuit Depth

## Definition
**Quantum Circuit Depth** is the maximum length of the longest path of sequential gate execution steps from input to measurement.

## Implementation
```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.t(1)

print("Circuit Depth:", qc.depth())
```

## Prerequisites
- [[NISQ]]