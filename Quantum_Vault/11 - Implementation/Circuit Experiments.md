---
type: implementation
level: beginner
status: completed
difficulty: medium
tags:
  - implementation
  - experiments
  - statevector
  - interference
---
# Circuit Experiments

## Overview
Hands-on experimental scripts designed to test and verify fundamental quantum properties using Qiskit simulators.

---

## Experiment 1: Verifying Quantum Interference

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def interference_experiment(phase_shift=True):
    qc = QuantumCircuit(1, 1)
    qc.h(0)
    if phase_shift:
        qc.z(0)  # Apply phase flip
    qc.h(0)
    qc.measure(0, 0)
    
    sim = AerSimulator()
    counts = sim.run(qc, shots=1000).result().get_counts()
    return counts

print("H -> H (Constructive for |0>):", interference_experiment(phase_shift=False))
print("H -> Z -> H (Destructive for |0>):", interference_experiment(phase_shift=True))
```

---

## Experiment 2: Entanglement Correlation Measurement

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)  # Create Bell state |Phi+>
qc.measure([0, 1], [0, 1])

sim = AerSimulator()
counts = sim.run(qc, shots=1000).result().get_counts()
print("Bell State Correlation Measurements:", counts)
# Notice: Only '00' and '11' appear, proving non-local correlation!
```

---

## Prerequisite & Connection Links
- **Prerequisites**: [[Qiskit]], [[Interference]], [[Entanglement]]
- **Related Notes**: [[Algorithm Implementations]]