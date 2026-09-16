---
type: algorithm
level: intermediate
status: completed
difficulty: medium
tags:
  - algorithm
  - quantum-arithmetic
  - ripple-carry-adder
  - modular-exponentiation
---
# Quantum Arithmetic

## Problem
Perform arithmetic operations (addition, subtraction, multiplication, modular exponentiation) reversibly on quantum registers.

## Key Architectures

### 1. Quantum Ripple Carry Adder (Draper / Cuccaro Adder)
Reversibly adds two $n$-qubit integers $|a\rangle|b\rangle \to |a\rangle|a+b\rangle$ using CNOT and Toffoli gates.

### 2. QFT-Based Adder (Draper Adder)
Applies QFT to target register $|b\rangle$, applies controlled phase rotations $R_k$ parameterized by input $|a\rangle$, and applies inverse QFT ($\text{QFT}^\dagger$).

## Implementation
```python
from qiskit import QuantumCircuit
import numpy as np

# QFT-based addition of 1 to target register
qc = QuantumCircuit(2)
qc.h(0)
qc.h(1)
qc.p(np.pi / 2, 0)
qc.h(1)

print("Quantum Arithmetic QFT addition block depth:", qc.depth())
```

## Prerequisites
- [[Reversible Computing]]
- [[Truth Tables]]
- [[Quantum Fourier Transform]]

## Related Concepts
- [[Period Finding]]
- [[Shor Algorithm]]

## Microsoft Quantum Katas

**Topic:** Reversible Computing & Ripple Carry Adders

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit