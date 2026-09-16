---
type: algorithm
level: beginner
status: completed
difficulty: easy
tags:
  - algorithm
  - qrng
  - superposition
  - measurement
---
# Random Number Generation

## Problem
Generate true, unpredictable non-deterministic random numbers using physical quantum collapse rather than pseudo-random classical software generators.

## Quantum Idea
Prepare qubit state $|+\rangle = H|0\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$. Measurement in computational basis collapses to $0$ or $1$ with exact probability $50\%$.

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def generate_random_bits(n_bits):
    qc = QuantumCircuit(n_bits, n_bits)
    qc.h(range(n_bits))
    qc.measure(range(n_bits), range(n_bits))
    
    sim = AerSimulator()
    result = sim.run(qc, shots=1).result().get_counts()
    return list(result.keys())[0]

print("Hardware QRNG Generated 8-Bit String:", generate_random_bits(8))
```

## Prerequisites
- [[Superposition]]
- [[Measurement]]

## Microsoft Quantum Katas

**Topic:** Quantum Random Number Generator

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit