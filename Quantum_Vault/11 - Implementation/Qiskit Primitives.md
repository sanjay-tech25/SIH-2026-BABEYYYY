---
type: implementation
level: intermediate
status: completed
difficulty: medium
tags:
  - implementation
  - qiskit
  - primitives
  - sampler
  - estimator
---
# Qiskit Primitives

## Overview
**Qiskit Primitives** provide high-level interfaces for algorithmic execution on quantum simulators and hardware:
1. **`Sampler`**: Calculates quasiprobability distributions and shot measurement bit counts.
2. **`Estimator`**: Calculates expectation values $\langle \psi | H | \psi \rangle$ of target operators/Hamiltonians.

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler, StatevectorEstimator
from qiskit.quantum_info import SparsePauliOp

# Sampler Example
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

sampler = StatevectorSampler()
pub = (qc,)
job = sampler.run([pub])
result = job.result()
print("Sampler execution finished successfully.")

# Estimator Example
qc_est = QuantumCircuit(1)
qc_est.h(0)
H = SparsePauliOp.from_list([("Z", 1.0)])

estimator = StatevectorEstimator()
pub_est = (qc_est, H)
job_est = estimator.run([pub_est])
print("Estimator expectation value calculated successfully.")
```

## Prerequisites
- [[Qiskit]]
- [[Qiskit Circuits]]