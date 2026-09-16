---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - amplitude-estimation
  - monte-carlo
  - quantum-finance
---
# Amplitude Estimation

## Problem
Given a quantum state preparation algorithm $A|0\rangle = \sqrt{1-a}|\psi_0\rangle + \sqrt{a}|\psi_1\rangle$, estimate amplitude parameter $a \in [0, 1]$ to within error precision $\epsilon$.

## Classical Approach
Classical Monte Carlo sampling requires $N = O(1/\epsilon^2)$ samples to estimate probability $a$ to error tolerance $\epsilon$ (Central Limit Theorem).

## Quantum Idea
Amplitude Estimation combines **Amplitude Amplification** with **Quantum Phase Estimation**. It achieves a **quadratic quantum speedup**, estimating $a$ to precision $\epsilon$ using only **$O(1/\epsilon)$ quantum queries**.

## Prerequisites
- [[Amplitude Amplification]]
- [[Quantum Phase Estimation]]
- [[Quantum Counting]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Phase Kickback]]

## Mathematical Formulation

1. State Preparation Operator $A$:
   $$A|0\rangle = \cos(\theta/2)|\psi_0\rangle + \sin(\theta/2)|\psi_1\rangle$$
   where $a = \sin^2(\theta/2)$.

2. Grover Operator $Q = -A S_0 A^\dagger S_\chi$:
   Eigenvalues of $Q$ are $e^{\pm i \theta}$.

3. QPE Execution:
   Applying QPE to $Q$ with $m$ evaluation qubits estimates angle $\theta$.
   Measured integer outcome $y \in \{0, \dots, M-1\}$ (where $M = 2^m$) yields:
   $$\tilde{\theta} = \frac{2\pi y}{M}$$

4. Amplitude Reconstructed:
   $$\tilde{a} = \sin^2\left(\frac{\tilde{\theta}}{2}\right) = \sin^2\left(\frac{\pi y}{2^m}\right)$$

## Step-by-Step Algorithm
1. Prepare $m$ evaluation qubits in $|0\rangle^{\otimes m}$ and state register in $|0\rangle^{\otimes n}$.
2. Apply Hadamard gates $H^{\otimes m}$ to evaluation qubits.
3. Apply state preparation operator $A$ to state register.
4. Apply Controlled-$Q^{2^j}$ operations for $j=0, \dots, m-1$.
5. Apply $\text{QFT}^\dagger$ to evaluation qubits.
6. Measure evaluation qubits to get integer $y$.
7. Compute $\tilde{a} = \sin^2\left(\frac{\pi y}{2^m}\right)$.

## Quantum Circuit
```text
eval_reg : ──[H^{\otimes m}]──[ Controlled-Q^{2^j} ]──[IQFT]──[M]
                              │
state_reg: ──[    A    ]──────┴─────────────────────
```

## Complexity
| Method | Query Complexity for Error $\epsilon$ |
|---|---|
| Classical Monte Carlo | $O(1/\epsilon^2)$ |
| Quantum Amplitude Estimation | **$O(1/\epsilon)$** |

## Qiskit Implementation
```python
import numpy as np

def estimate_amplitude(y_measured, m_qubits):
    theta_est = (np.pi * y_measured) / (2**m_qubits)
    a_est = np.sin(theta_est)**2
    return a_est

# Example: target amplitude a = 0.5 (theta = pi/2)
# Expected QPE integer outcome y for m=4 qubits: y = 4 (since 4/16 * pi = pi/4 -> sin^2(pi/4) = 0.5)
y_outcome = 4
m = 4
estimated_a = estimate_amplitude(y_outcome, m)
print(f"Estimated amplitude 'a' with {m} evaluation qubits:", estimated_a)
```

## Example
Estimate probability $a = 0.25$ ($\theta = \pi/3$):
- Target value $a = \sin^2(\pi/6) = 0.25$.
- QPE outcome $y$ yields estimate $\tilde{\theta} = \pi/3$.
- Reconstructed amplitude: $\tilde{a} = \sin^2(\pi/6) = 0.25$.

## Applications
Quantum Financial Option Pricing, Risk Analysis, Monte Carlo Integration speedups, and Machine Learning.

## Limitations
Requires building controlled power gates $Q^{2^j}$.

## Related Algorithms
- [[Amplitude Amplification]]
- [[Quantum Counting]]

## Prerequisites Graph
[[Amplitude Amplification]] → [[Quantum Phase Estimation]] → [[Amplitude Estimation]]

## Resources
- Paper: Brassard et al. (2002), Quantum Amplitude Amplification and Estimation.
- Qiskit Finance Module Documentation