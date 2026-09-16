---
type: hardware
level: intermediate
status: completed
difficulty: medium
tags:
  - hardware
  - nisq
  - variational
---
# NISQ

## Definition
**Noisy Intermediate-Scale Quantum (NISQ)** refers to current quantum processors (50–1000 qubits) lacking full fault-tolerant error correction.

## Key Constraints
- Limited circuit depth before decoherence.
- High gate error rates ($\sim 10^{-3}$).
- Prefers variational algorithms like [[VQE]] and [[QAOA]].

## Prerequisites
- [[Quantum Noise]]
- [[Decoherence]]