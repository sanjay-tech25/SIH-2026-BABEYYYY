---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - measurement
  - single-qubit
---
# Single Qubit Measurement

## Definition
**Single-qubit measurement** is the projective observation of a single qubit's state in a specified basis (typically the computational basis $\{|0\rangle, |1\rangle\}$).

## Why It Matters
Single-qubit measurements extract a single classical bit of information ($0$ or $1$) from a quantum statevector amplitude while collapsing the state vector non-unitarily.

## Intuition
- **Level 1 (Intuition)**: Measuring a single qubit is like looking at one indicator light. If the qubit was in a 50/50 superposition, looking at it forces it to land deterministically on 0 or 1.
- **Level 2 (Mathematical)**: Projection operators $M_0 = |0\rangle\langle 0|$ and $M_1 = |1\rangle\langle 1|$. Probabilities $P(0) = |\alpha|^2$ and $P(1) = |\beta|^2$.
- **Level 3 (Implementation)**: In Qiskit, `qc.measure(0, 0)` measures qubit 0 into classical register bit 0.

## Key Equations
$$P(0) = |\alpha|^2, \quad P(1) = |\beta|^2$$
$$|\psi'\rangle = |0\rangle \text{ (if outcome 0)}, \quad |\psi'\rangle = |1\rangle \text{ (if outcome 1)}$$

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

sim = AerSimulator()
counts = sim.run(qc, shots=1000).result().get_counts()
print("Single Qubit Measurement Counts:", counts)
```

## Prerequisites
- [[Measurement]]
- [[Qubit]]

## Related Concepts
- [[Multi Qubit Measurement]]
- [[Born Rule]]

## Microsoft Quantum Katas

**Topic:** Measurements - Single Qubit Measurement

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit