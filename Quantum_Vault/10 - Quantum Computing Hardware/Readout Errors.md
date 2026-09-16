---
type: hardware
level: intermediate
status: completed
difficulty: medium
tags:
  - hardware
  - readout-error
  - measurement
---
# Readout Errors

## Definition
**Readout Errors** (Measurement Assignment Errors) occur when a qubit in physical state $|0\rangle$ is misidentified as $1$ or vice versa during measurement.

## Implementation
```python
from qiskit_aer.noise import NoiseModel, ReadoutError

# Define custom readout error matrix
matrix = [[0.95, 0.05], [0.03, 0.97]]
readout_err = ReadoutError(matrix)
noise_model = NoiseModel()
noise_model.add_all_qubit_readout_error(readout_err)

print("Readout Error noise model created.")
```

## Prerequisites
- [[Measurement]]
- [[Quantum Noise]]