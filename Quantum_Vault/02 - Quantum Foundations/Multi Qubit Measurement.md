---
type: foundation
level: intermediate
status: completed
difficulty: medium
tags:
  - foundation
  - measurement
  - multi-qubit
  - partial-measurement
---
# Multi Qubit Measurement

## Definition
**Multi-qubit measurement** involves measuring subset registers or all qubits in an $n$-qubit system, resulting in statevector collapse into sub-spaces or computational basis bit strings.

## Why It Matters
Multi-qubit measurements allow selective readout of target algorithm outputs while maintaining or collapsing sub-register states (e.g. ancilla post-selection in HHL or measurement in QPE).

## Intuition
- **Level 1 (Intuition)**: If two qubits are entangled (like Bell state $\frac{|00\rangle+|11\rangle}{\sqrt{2}}$), measuring just the first qubit instantly collapses the second qubit's state even if you haven't looked at the second qubit yet!
- **Level 2 (Mathematical)**: Measuring subset register $A$ uses projection $P_{x_A} \otimes I_B$. Probability $P(x_A) = \text{Tr}((P_{x_A} \otimes I_B) \rho)$.
- **Level 3 (Implementation)**: In Qiskit, `qc.measure([0, 1], [0, 1])` measures multiple qubits simultaneously.

## Key Equations
$$P(x) = |\langle x_0 x_1 \dots x_{n-1} | \psi \rangle|^2$$

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)  # Bell state
qc.measure([0, 1], [0, 1])

sim = AerSimulator()
counts = sim.run(qc, shots=1000).result().get_counts()
print("Multi-Qubit Bell State Measurement:", counts)
```

## Prerequisites
- [[Measurement]]
- [[Single Qubit Measurement]]
- [[Entanglement]]

## Related Concepts
- [[Parity Measurements]]
- [[Born Rule]]

## Microsoft Quantum Katas

**Topic:** Measurements - Multi Qubit Measurements

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit