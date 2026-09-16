---
type: algorithm
level: beginner
status: completed
difficulty: medium
tags:
  - algorithm
  - deutsch-jozsa
  - exponential-speedup
  - query-complexity
---
# Deutsch-Jozsa Algorithm

## Problem
Given a black-box boolean function $f: \{0,1\}^n \to \{0,1\}$ guaranteed to be either **constant** (returns 0 for all inputs or 1 for all inputs) or **balanced** (returns 0 for exactly half the inputs and 1 for the other half), determine which type $f$ is.

## Classical Approach
To guarantee deterministically whether $f$ is constant or balanced classically, you must evaluate $f$ for $2^{n-1} + 1$ inputs in the worst-case scenario.
Worst-case classical complexity: $O(2^{n-1})$.

## Quantum Idea
By querying an $n$-qubit input register in equal superposition, phase kickback encodes the inner product of function values across all inputs. Constructive interference concentrates all amplitude into state $|0\rangle^{\otimes n}$ if constant, while destructive interference cancels state $|0\rangle^{\otimes n}$ to zero amplitude if balanced. Requires **1 query**.

## Prerequisites
- [[Deutsch Algorithm]]
- [[Superposition]]
- [[Hadamard]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation
Initial state: $|\psi_0\rangle = |0\rangle^{\otimes n} |1\rangle$.
Apply $H^{\otimes n} \otimes H$:
$$|\psi_1\rangle = \left( \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle \right) |-\rangle$$

Apply Oracle $U_f$:
$$|\psi_2\rangle = \left( \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} (-1)^{f(x)} |x\rangle \right) |-\rangle$$

Apply $H^{\otimes n}$ to input register:
$$|\psi_3\rangle = \left( \frac{1}{2^n} \sum_{x \in \{0,1\}^n} \sum_{y \in \{0,1\}^n} (-1)^{x \cdot y + f(x)} |y\rangle \right) |-\rangle$$

Amplitude of all-zeros state $|y\rangle = |0\dots0\rangle$ (where $x \cdot 0 = 0$):
$$\alpha_{0\dots0} = \frac{1}{2^n} \sum_{x \in \{0,1\}^n} (-1)^{f(x)}$$
- If $f$ is Constant: $\alpha_{0\dots0} = \pm 1 \implies P(0\dots0) = 1$.
- If $f$ is Balanced: $\alpha_{0\dots0} = 0 \implies P(0\dots0) = 0$.

## Step-by-Step Algorithm
1. Prepare $(n+1)$-qubit register $|0\rangle^{\otimes n} |1\rangle$.
2. Apply Hadamard gates $H^{\otimes (n+1)}$.
3. Apply quantum oracle $U_f$.
4. Apply Hadamard gates $H^{\otimes n}$ to input register.
5. Measure $n$ input qubits. If outcome is $00\dots0$, $f$ is constant; otherwise, $f$ is balanced.

## Quantum Circuit
```text
q_0: ──[H]──■──[H]──[M]
q_1: ──[H]──│──[H]──[M]
            │ U_f
q_n: ──[H]──■──[H]──[M]
anc: ──[X]──[H]─⊕──────
```

## Complexity
| Method | Query Complexity |
|---|---|
| Classical (Deterministic) | $O(2^{n-1})$ |
| Quantum | **$O(1)$** |

## Qiskit Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def deutsch_jozsa_circuit(n, oracle_type="balanced"):
    qc = QuantumCircuit(n + 1, n)
    qc.x(n)
    qc.h(range(n + 1))
    
    # Oracle
    if oracle_type == "balanced":
        for i in range(n):
            qc.cx(i, n)
            
    qc.h(range(n))
    qc.measure(range(n), range(n))
    return qc

n = 3
qc = deutsch_jozsa_circuit(n, "balanced")
sim = AerSimulator()
counts = sim.run(qc, shots=100).result().get_counts()
print(f"Deutsch-Jozsa {n}-qubit balanced result:", counts)
```

## Example
For $n=2$, balanced oracle $f(x) = x_0$.
Final state on input qubits: $|01\rangle$. Measurement yields $01 \neq 00 \implies$ Balanced!

## Applications
Historic proof of exponential quantum query complexity advantage.

## Limitations
Requires prior promise that function is strictly constant or balanced.

## Related Algorithms
- [[Deutsch Algorithm]]
- [[Bernstein-Vazirani Algorithm]]
- [[Simon Algorithm]]

## Prerequisites Graph
[[Deutsch Algorithm]] → [[Superposition]] → [[Interference]] → [[Deutsch-Jozsa Algorithm]]

## Resources
- IBM Quantum Documentation: Deutsch-Jozsa
- Research Paper: Deutsch & Jozsa (1992), Proc. R. Soc. Lond. A.