---
type: implementation
level: intermediate
status: completed
difficulty: medium
tags:
  - implementation
  - benchmarking
  - randomized-benchmarking
---
# Benchmarking

## Overview
**Benchmarking** protocols evaluate quantum circuit optimization, execution runtimes, gate fidelities, and noise resilience across simulator and hardware backends.

## Implementation
```python
import time
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def benchmark_circuit(depth):
    qc = QuantumCircuit(2)
    for _ in range(depth):
        qc.h(0)
        qc.cx(0, 1)
        
    sim = AerSimulator()
    start = time.time()
    sim.run(qc, shots=1000).result()
    duration = time.time() - start
    return duration

print("Benchmarking 100-layer circuit simulation time:", benchmark_circuit(100), "seconds")
```

## Prerequisites
- [[Qiskit]]
- [[Quantum Circuit Depth]]