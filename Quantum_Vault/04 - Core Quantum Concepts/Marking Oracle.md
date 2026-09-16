---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - concept
  - marking-oracle
  - oracle
  - grover
---
# Marking Oracle

## Definition
A **Marking Oracle** $O_f$ flips the phase of solution basis states $|x\rangle$ where Boolean function $f(x) = 1$:
$$O_f |x\rangle = (-1)^{f(x)} |x\rangle$$

## Relation to Bit Oracles
A Bit Oracle $U_f |x, y\rangle = |x, y \oplus f(x)\rangle$ converts into a Marking Oracle by setting the target qubit $y = |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$ via [[Phase Kickback]].

## Key Equation
$$O_f = I - 2 \sum_{x: f(x)=1} |x\rangle\langle x|$$

## Implementation
```python
from qiskit import QuantumCircuit

# Marking Oracle for target state |11>
oracle = QuantumCircuit(2)
oracle.cz(0, 1)

print("Marking oracle CZ depth:", oracle.depth())
```

## Prerequisites
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Related Concepts
- [[Grover Algorithm]]
- [[Amplitude Amplification]]

## Microsoft Quantum Katas

**Topic:** Oracles - Marking Oracles & Phase Oracles

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit