---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - hhl
  - linear-systems
  - exponential-speedup
---
# HHL

## Problem
Given a Hermitian $N \times N$ matrix $A$ ($N=2^n$) with condition number $\kappa$ and vector $\vec{b}$, find vector $|x\rangle$ satisfying the linear system of equations:
$$A |x\rangle = |b\rangle \implies |x\rangle = A^{-1} |b\rangle$$

## Classical Approach
Classical algorithms for solving dense linear systems (like Gaussian elimination) require $O(N^3) = O(2^{3n})$ operations. Conjugate Gradient for sparse matrices requires $O(N s \kappa) = O(2^n s \kappa)$ operations.

## Quantum Idea
The **Harrow-Hassidim-Lloyd (HHL)** algorithm uses **Quantum Phase Estimation** to decompose $|b\rangle$ into the eigenbasis of $A$, applies controlled ancilla rotation to perform scalar division by eigenvalues $\lambda_j^{-1}$, and uncomputes phase estimation. Computes $|x\rangle$ with **exponential speedup $O(s^2 \kappa^2 \log N / \epsilon)$**.

## Prerequisites
- [[Quantum Phase Estimation]]
- [[Eigenvalues & Eigenvectors]]
- [[Matrices]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Phase Kickback]]

## Mathematical Formulation

1. Spectral Decomposition of $A$:
   $$A = \sum_{j=0}^{N-1} \lambda_j |u_j\rangle\langle u_j|$$

2. Vector $|b\rangle$ in Eigenbasis:
   $$|b\rangle = \sum_{j=0}^{N-1} \beta_j |u_j\rangle$$

3. Step 1: QPE on $U = e^{i A t}$ transforms state:
   $$\sum_{j} \beta_j |u_j\rangle |\lambda_j\rangle |0\rangle_{anc}$$

4. Step 2: Controlled Ancilla Rotation by $R_y(2 \arcsin(C/\lambda_j))$:
   $$\sum_{j} \beta_j |u_j\rangle |\lambda_j\rangle \left( \sqrt{1 - \frac{C^2}{\lambda_j^2}} |0\rangle_{anc} + \frac{C}{\lambda_j} |1\rangle_{anc} \right)$$

5. Step 3: Uncompute QPE ($\text{QPE}^\dagger$):
   $$\sum_{j} \beta_j |u_j\rangle |0\rangle \left( \sqrt{1 - \frac{C^2}{\lambda_j^2}} |0\rangle_{anc} + \frac{C}{\lambda_j} |1\rangle_{anc} \right)$$

6. Step 4: Measure Ancilla Qubit observing outcome $|1\rangle_{anc}$:
   Post-selected state is proportional to:
   $$|x\rangle = \sum_{j} \frac{\beta_j}{\lambda_j} |u_j\rangle = A^{-1}|b\rangle$$

## Step-by-Step Algorithm
1. Encode vector $|b\rangle$ into $n$-qubit quantum state register.
2. Run Quantum Phase Estimation using $e^{i A t}$ to write eigenphases $|\lambda_j\rangle$ into clock register.
3. Apply controlled rotation to ancilla qubit to achieve factor $C/\lambda_j$.
4. Run Inverse QPE ($\text{QPE}^\dagger$) to uncompute clock register back to $|0\rangle$.
5. Measure ancilla qubit. Upon measuring $|1\rangle$, state register contains solution vector $|x\rangle = A^{-1}|b\rangle$.

## Quantum Circuit
```text
b_reg : ──[|b⟩]──────■──────[IQPE]──[ Solution |x⟩ ]
                     │        │
clock : ──[|0⟩]──[ QPE ]──────┼─────────────────────
                     │        │
ancilla:──[|0⟩]──────┴──[Ry]──┴──────[M (Post-select 1)]
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Dense Solver | $O(N^3) = O(2^{3n})$ |
| Classical Sparse Solver | $O(N s \kappa)$ |
| Quantum HHL | **$O(s^2 \kappa^2 \log N / \epsilon)$** |

## Qiskit Implementation
```python
import numpy as np
from qiskit.circuit.library import HHL

# HHL algorithm structure demonstration
print("HHL Algorithm: Solves A|x> = |b>")
print("Quantum Complexity: O(s^2 * kappa^2 * log(N) / epsilon)")
print("Achieves exponential speedup in vector dimension N over classical Gaussian elimination.")
```

## Example
Solve simple diagonal linear system:
$$A = \begin{pmatrix} 2 & 0 \\ 0 & 1 \end{pmatrix}, \quad |b\rangle = |0\rangle$$
- Eigenvalues: $\lambda_1 = 2, \lambda_2 = 1$.
- Ancilla rotation scales $|0\rangle$ by $1/\lambda_1 = 1/2$.
- Solution state $|x\rangle \propto \frac{1}{2}|0\rangle$, matching $A^{-1}|b\rangle = \begin{pmatrix} 1/2 & 0 \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 1/2 \\ 0 \end{pmatrix}$.

## Applications
Quantum Machine Learning (Quantum SVM, Linear Regression), Finite Element Analysis, Differential Equations simulation, and Electromagnetic scattering.

## Limitations
Requires efficient state preparation for $|b\rangle$, sparse Hermitian $A$, and post-selection readout.

## Related Algorithms
- [[Quantum Phase Estimation]]
- [[VQE]]

## Prerequisites Graph
[[Quantum Phase Estimation]] → [[Eigenvalues & Eigenvectors]] → [[HHL]]

## Resources
- Paper: Harrow, Hassidim, Lloyd (2009), Phys. Rev. Lett.
- Qiskit Linear Solvers Documentation