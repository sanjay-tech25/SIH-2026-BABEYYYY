---
type: implementation
level: beginner
status: completed
difficulty: easy
tags:
  - implementation
  - qiskit
  - circuits
---
# Qiskit Circuits

## Overview
**Qiskit Circuits** center around the `QuantumCircuit` class, which manages quantum registers, classical registers, gate operations, transpilation, and measurement operations.

## Key Methods
- `qc.h(qubit)`
- `qc.cx(control, target)`
- `qc.measure(qubits, clbits)`
- `qc.depth()`
- `qc.draw('text')`

## Implementation
```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

print(qc.draw('text'))
```

## Prerequisites
- [[Qiskit]]
- [[Python]]