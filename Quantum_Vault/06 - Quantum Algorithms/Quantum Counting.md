---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - quantum-counting
  - grover
  - qpe
---
# Quantum Counting

## Problem
Given an oracle $f(x)$ over search space $N = 2^n$, determine the **exact number of marked solutions $M$** without querying all items.

## Quantum Idea (Grover + Phase Estimation)
Quantum Counting explicitly combines:
1. **Grover Operator $G$**: Acts as a 2D rotation operator with eigenvalues $e^{\pm i 2\theta}$, where $\sin^2\theta = M/N$.
2. **Quantum Phase Estimation (QPE)**: Measures the eigenphase $2\theta$ of $G$.
3. **Amplitude Estimation**: Reconstructs $M = N \sin^2\theta$ in **$O(\sqrt{N})$ queries**, yielding quadratic speedup over classical $O(N)$.

## Key Equations
$$\sin\theta = \sqrt{\frac{M}{N}}$$
$$\text{Measured Phase: } \phi = \frac{2\theta}{2\pi} = \frac{\theta}{\pi}$$
$$M = N \sin^2(\pi \cdot \phi)$$

## Implementation
```python
import numpy as np

def calculate_solution_count(measured_phase_int, t_bits, n_qubits):
    theta = (np.pi * measured_phase_int) / (2**t_bits)
    N = 2**n_qubits
    M = N * (np.sin(theta)**2)
    return round(M)

print("Calculated solution count M=", calculate_solution_count(3, t_bits=4, n_qubits=2))
```

## Prerequisites
- [[Grover Algorithm]]
- [[Quantum Phase Estimation]]
- [[Amplitude Estimation]]

## Microsoft Quantum Katas

**Topic:** Quantum Counting Katas

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit