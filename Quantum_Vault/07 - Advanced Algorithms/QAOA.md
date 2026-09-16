---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - qaoa
  - nisq
  - optimization
  - max-cut
---
# QAOA

## Problem
Given a combinatorial optimization problem defined on a graph $G=(V, E)$ (such as **Max-Cut**, Graph Coloring, or Traveling Salesperson), find a bit string $x \in \{0,1\}^n$ that maximizes cost function $C(x)$.

## Classical Approach
NP-hard combinatorial optimization problems like Max-Cut require checking $2^n$ candidate assignments in the worst case.

## Quantum Idea
The **Quantum Approximate Optimization Algorithm (QAOA)** is a hybrid variational algorithm that alternates between applying a **Problem Hamiltonian Unitary** $e^{-i \gamma H_C}$ and a **Mixer Hamiltonian Unitary** $e^{-i \beta H_B}$ for $p$ steps. Classical optimization tunes parameters $(\mathbf{\gamma}, \mathbf{\beta})$ to maximize target solution cost.

## Prerequisites
- [[VQE]]
- [[Pauli Z]]
- [[Pauli X]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Entanglement]]

## Mathematical Formulation

### 1. Cost Hamiltonian $H_C$
For Max-Cut on graph $G=(V, E)$:
$$H_C = \sum_{(i,j) \in E} \frac{1}{2} (I - Z_i Z_j)$$
Target: Maximize expectation value $\langle H_C \rangle$.

### 2. Mixer Hamiltonian $H_B$
$$H_B = \sum_{i \in V} X_i$$

### 3. QAOA State Preparation ($p$ layers)
Starting from equal superposition $|s\rangle = H^{\otimes n}|0\rangle^{\otimes n}$:
$$|\gamma, \beta\rangle = \left( \prod_{k=1}^p e^{-i \beta_k H_B} e^{-i \gamma_k H_C} \right) |s\rangle$$

## Step-by-Step Algorithm
1. Construct Cost Hamiltonian $H_C$ and Mixer $H_B$ for graph problem.
2. Initialize equal superposition state $|s\rangle = H^{\otimes n}|0\rangle^{\otimes n}$.
3. For layer depth $p$, apply alternating unitaries $U(H_C, \gamma_k)$ and $U(H_B, \beta_k)$.
4. Measure state in computational basis to estimate cost $\langle H_C \rangle_{\mathbf{\gamma}, \mathbf{\beta}}$.
5. Use classical optimizer to update parameters $(\mathbf{\gamma}, \mathbf{\beta})$ maximizing expected cost.
6. Sample final optimized circuit state to extract high-scoring cut string $x$.

## Quantum Circuit
```text
q_0: ──[H]──[  e^{-i γ Z_0 Z_1}  ]──[ e^{-i β X_0} ]──[M]
            │                     │
q_1: ──[H]──┴─────────────────────[ e^{-i β X_1} ]──[M]
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Exact Search | $O(2^n)$ |
| Hybrid QAOA | **Polynomial-depth NISQ circuit + classical loop** |

## Qiskit Implementation
```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

def qaoa_maxcut_2qubit(gamma, beta):
    qc = QuantumCircuit(2, 2)
    # Equal superposition
    qc.h([0, 1])
    
    # Cost Unitary e^{-i γ (I - Z0 Z1)/2}
    qc.rzz(gamma, 0, 1)
    
    # Mixer Unitary e^{-i β X}
    qc.rx(2 * beta, 0)
    qc.rx(2 * beta, 1)
    
    return qc

gamma, beta = 0.5, 0.5
qc = qaoa_maxcut_2qubit(gamma, beta)
sv = Statevector.from_instruction(qc)
print("QAOA statevector for Max-Cut:\n", np.round(sv.data, 3))
```

## Example
Max-Cut on 2 connected nodes (1 edge):
- Cost states $|01\rangle$ and $|10\rangle$ have cut value 1.
- Cost states $|00\rangle$ and $|11\rangle$ have cut value 0.
- Optimal QAOA parameters $(\gamma, \beta)$ drive state amplitudes into superposition of $|01\rangle$ and $|10\rangle$.

## Applications
Portfolio optimization, logistics routing, network design, and scheduling.

## Limitations
Optimization performance sensitive to hyperparameter choices and depth $p$.

## Related Algorithms
- [[VQE]]
- [[Grover Algorithm]]

## Prerequisites Graph
[[VQE]] → [[Pauli Z]] → [[Pauli X]] → [[QAOA]]

## Resources
- Paper: Farhi, Goldstone, Gutmann (2014), arXiv:1411.4028.
- Qiskit Optimization Documentation: QAOA Tutorial