---
type: implementation
level: beginner
status: completed
difficulty: easy
tags:
  - implementation
  - qiskit
  - python
  - sdk
---
# Qiskit

## Overview
**Qiskit** is an open-source Quantum Software Development Kit (SDK) developed by IBM for working with quantum computers at the level of circuits, pulses, and algorithms.

---

## Key Modules & Components

1. **`qiskit.circuit`**: `QuantumCircuit`, `QuantumRegister`, `ClassicalRegister`, and standard logic gate library ($H, X, Y, Z, \text{CNOT}, \dots$).
2. **`qiskit_aer`**: High-performance quantum simulator backend (`AerSimulator`) supporting statevector, density matrix, and noise models.
3. **`qiskit.quantum_info`**: Linear algebra statevector routines (`Statevector`, `DensityMatrix`, `Operator`, `SparsePauliOp`).
4. **`qiskit.visualization`**: Plotting utilities (`plot_histogram`, `plot_bloch_multivector`, `circuit_drawer`).
5. **`qiskit.primitives`**: Modern execution primitives (`Sampler` and `Estimator`).

---

## Basic Workflow Template

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

# 1. Build Circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# 2. Transpile / Prepare for Simulator
sim = AerSimulator()

# 3. Execute
job = sim.run(qc, shots=1000)
result = job.result()
counts = result.get_counts()

print("Measurement Counts:", counts)
```

---

## Statevector Inspection

```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# Extract statevector directly without measurement collapse
sv = Statevector.from_instruction(qc)
print("Statevector amplitudes:\n", sv.data)
print("Statevector probabilities:\n", sv.probabilities())
```

---

## Prerequisite & Connection Links
- **Prerequisites**: [[Python]], [[Qubit]], [[Quantum Gates]]
- **Related Notes**: [[Circuit Experiments]], [[Algorithm Implementations]]
- **Used In**: All practical algorithm implementations across the vault.