---
type: algorithm
level: beginner
status: completed
difficulty: easy
tags:
  - algorithm
  - deutsch
  - oracle
  - query-complexity
---
# Deutsch Algorithm

## Problem
Given a black-box boolean function $f: \{0,1\} \to \{0,1\}$ that takes a single bit input and returns a single bit output, determine whether $f$ is **constant** ($f(0) = f(1)$) or **balanced** ($f(0) \neq f(1)$).

## Classical Approach
Classically, you must evaluate the function twice ($f(0)$ and $f(1)$) and compare the results:
- If $f(0) == f(1)$, $f$ is constant.
- If $f(0) \neq f(1)$, $f$ is balanced.
Requires **2 function evaluations (queries)**.

## Quantum Idea
By preparing the input qubit in superposition and the target qubit in $|-\rangle$, [[Phase Kickback]] encodes the global function property into relative phases. A final Hadamard gate interference step reveals whether the function is constant or balanced in **a single query**.

## Prerequisites
- [[Qubit]]
- [[Hadamard]]
- [[CNOT]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation

Initial state $|01\rangle$:
$$|\psi_0\rangle = |0\rangle |1\rangle$$

Apply $H \otimes H$:
$$|\psi_1\rangle = \left(\frac{|0\rangle + |1\rangle}{\sqrt{2}}\right) \left(\frac{|0\rangle - |1\rangle}{\sqrt{2}}\right)$$

Apply bit oracle $U_f |x, y\rangle = |x, y \oplus f(x)\rangle$:
$$|\psi_2\rangle = \frac{1}{2} \sum_{x \in \{0,1\}} (-1)^{f(x)} |x\rangle (|0\rangle - |1\rangle) = \left[ \frac{(-1)^{f(0)}|0\rangle + (-1)^{f(1)}|1\rangle}{\sqrt{2}} \right] |-\rangle$$

Factoring out $(-1)^{f(0)}$ global phase:
$$|\psi_2\rangle = (-1)^{f(0)} \left[ \frac{|0\rangle + (-1)^{f(0) \oplus f(1)} |1\rangle}{\sqrt{2}} \right] |-\rangle$$

Apply Hadamard to input qubit $H \otimes I$:
- If $f(0) \oplus f(1) = 0$ (Constant): Input qubit becomes $(-1)^{f(0)}|0\rangle$. Measuring yields **0**.
- If $f(0) \oplus f(1) = 1$ (Balanced): Input qubit becomes $(-1)^{f(0)}|1\rangle$. Measuring yields **1**.

## Step-by-Step Algorithm
1. Prepare 2-qubit state $|01\rangle$.
2. Apply Hadamard gates to both qubits: $H \otimes H$.
3. Query the quantum oracle $U_f$.
4. Apply Hadamard gate $H$ to the first qubit.
5. Measure the first qubit. Output $0 \implies$ Constant, $1 \implies$ Balanced.

## Quantum Circuit
```text
q_0: ──[0]──[H]──■──[H]──[M]
                 │ U_f
q_1: ──[1]──[H]──⊕──────────
```

## Complexity
| Method | Query Complexity |
|---|---|
| Classical | 2 Queries |
| Quantum | **1 Query** |

## Qiskit Implementation
```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def run_deutsch(oracle_type="balanced"):
    qc = QuantumCircuit(2, 1)
    
    # Initialize state |01>
    qc.x(1)
    qc.h(0)
    qc.h(1)
    
    # Oracle implementation
    if oracle_type == "constant_1":
        qc.x(1) # f(x) = 1
    elif oracle_type == "balanced":
        qc.cx(0, 1) # f(x) = x
        
    # Final Hadamard and Measurement
    qc.h(0)
    qc.measure(0, 0)
    
    sim = AerSimulator()
    result = sim.run(qc, shots=100).result()
    return result.get_counts()

print("Deutsch Balanced Result:", run_deutsch("balanced"))
print("Deutsch Constant Result:", run_deutsch("constant_1"))
```

## Example
Let $f(x) = x$ (Balanced function: $f(0)=0, f(1)=1$).
1. State after $U_f$: $\frac{1}{\sqrt{2}}(|0\rangle - |1\rangle)|-\rangle = |-\rangle |-\rangle$.
2. Apply $H$ to qubit 0: $H|-\rangle = |1\rangle$.
3. Measurement yields outcome **1** (Balanced!).

## Applications
Demonstrates deterministic quantum advantage over classical computation in oracle query complexity.

## Limitations
Applies only to single-bit boolean functions ($n=1$).

## Related Algorithms
- [[Deutsch-Jozsa Algorithm]]
- [[Bernstein-Vazirani Algorithm]]

## Prerequisites Graph
[[Complex Numbers]] → [[Vectors]] → [[Tensor Products]] → [[Qubit]] → [[Hadamard]] → [[Phase Kickback]] → [[Deutsch Algorithm]]

## Resources
- IBM Quantum Learning: Deutsch Algorithm Module
- Nielsen & Chuang, Quantum Computation and Quantum Information (Section 1.4.3)