---
type: algorithm
level: intermediate
status: completed
difficulty: medium
tags:
  - algorithm
  - phase-estimation
  - ipe
  - resource-efficient
---
# Iterative Phase Estimation

## Problem
Estimate eigenphase $\theta$ of unitary operator $U$ ($U|u\rangle = e^{2\pi i \theta}|u\rangle$) using **only a single ancilla qubit** instead of an $m$-qubit clock register.

## Advantage
Reduces qubit resource requirements dramatically from $m+1$ qubits to $2$ qubits, making high-precision phase estimation possible on near-term hardware.

## Implementation
```python
from qiskit import QuantumCircuit
import numpy as np

# Single ancilla qubit iterative phase measurement step
qc = QuantumCircuit(2, 1)
qc.h(0)
qc.cp(2 * np.pi * 0.25, 0, 1)  # Controlled unitary U^(2^k)
qc.h(0)
qc.measure(0, 0)

print("Iterative Phase Estimation step initialized.")
```

## Prerequisites
- [[Quantum Phase Estimation]]
- [[Phase Gates]]

## Microsoft Quantum Katas

**Topic:** Phase Estimation - Iterative Phase Estimation

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit