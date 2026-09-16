---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - born-rule
  - probability
---
# Born Rule

## Definition
The **Born Rule** is a fundamental postulate of quantum mechanics formulated by Max Born. It states that the probability $P(x)$ of measuring a quantum state $|\psi\rangle$ to land in computational basis eigenstate $|x\rangle$ equals the square magnitude of its probability amplitude.

## Why It Matters
The Born Rule connects quantum wave function amplitudes $\alpha_x \in \mathbb{C}$ to physical real-valued measurement probabilities $P(x) \in [0, 1]$.

## Mathematical Foundation
$$P(x) = |\langle x | \psi \rangle|^2 = \langle \psi | (|x\rangle\langle x|) | \psi \rangle$$
For single qubit $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$:
$$P(0) = |\alpha|^2, \quad P(1) = |\beta|^2$$

## Key Equations
$$P(x) = |\langle x | \psi \rangle|^2$$
$$\sum_x P(x) = \sum_x |\alpha_x|^2 = 1$$

## Implementation
```python
import numpy as np

# State amplitudes
alpha = 0.6
beta = 0.8j

prob_0 = np.abs(alpha)**2
prob_1 = np.abs(beta)**2

print(f"Born Rule Probabilities: P(0)={prob_0:.2f}, P(1)={prob_1:.2f}")
```

## Prerequisites
- [[Probability]]
- [[Quantum State]]

## Related Concepts
- [[Measurement]]
- [[Normalization]]

## Microsoft Quantum Katas

**Topic:** Measurements - Born Rule & Probabilities

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit