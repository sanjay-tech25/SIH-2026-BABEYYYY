---
type: gate
level: intermediate
status: completed
difficulty: medium
tags:
  - gate
  - cz
  - controlled-z
  - symmetric-gate
---
# CZ

## Definition
The **CZ gate** (Controlled-Z gate) is a symmetric two-qubit unitary gate that applies a phase flip (multiplication by $-1$) to the joint state if and only if both qubits are in state $|1\rangle$.

## Why It Matters
Because CZ is mathematically symmetric with respect to control and target qubits, it is the native entangling gate on many superconducting and neutral atom quantum hardware architectures.

## Intuition
- **Level 1 (Intuition)**: CZ does nothing to $|00\rangle, |01\rangle, |10\rangle$, but flips the phase of state $|11\rangle \to -|11\rangle$. Neither qubit changes bit value; only the joint phase is updated.
- **Level 2 (Mathematical)**: Matrix $\text{CZ} = \text{diag}(1, 1, 1, -1)$. Equivalence: $\text{CZ}_{0,1} = (I \otimes H) \text{CNOT}_{0,1} (I \otimes H)$.
- **Level 3 (Implementation)**: In Qiskit, `qc.cz(0, 1)` applies the CZ gate between qubit 0 and qubit 1.

## Mathematical Foundation

### Matrix Representation
$$\text{CZ} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & -1 \end{pmatrix}$$

### Action on Basis States
$$\text{CZ}|00\rangle = |00\rangle, \quad \text{CZ}|01\rangle = |01\rangle$$
$$\text{CZ}|10\rangle = |10\rangle, \quad \text{CZ}|11\rangle = -|11\rangle$$

## Key Equations
$$\text{CZ}|q_0, q_1\rangle = (-1)^{q_0 q_1} |q_0, q_1\rangle$$
$$\text{CZ} = (I \otimes H) \text{CNOT} (I \otimes H)$$
$$\text{CZ}^\dagger = \text{CZ}$$

## Example
Convert CNOT to CZ using Hadamard on target qubit:
$$\text{CNOT}|10\rangle = |11\rangle$$
Applying $H$ on target before and after:
$$(I \otimes H) \text{CZ} (I \otimes H) |10\rangle = (I \otimes H) \text{CZ} \left(|1\rangle \otimes |+\rangle\right) = (I \otimes H) \left(\frac{|10\rangle - |11\rangle}{\sqrt{2}}\right) = |11\rangle$$

## Circuit
```text
q_0: ──■──
       │
q_1: ──■──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.h(1)
qc.cz(0, 1)  # Apply CZ to |++> state

sv = Statevector.from_instruction(qc)
print("Statevector after CZ on |++>:", sv.data)
```

## Prerequisites
- [[Pauli Z]]
- [[CNOT]]

## Related Concepts
- [[Hadamard]]
- [[Entanglement]]
- [[Phase Kickback]]

## Algorithms Using This
- Cluster state quantum computing, [[Grover Algorithm]] oracle phases, and [[QAOA]] ansatz designs.

## Common Mistakes
- Thinking CZ has a designated control and target qubit. Because $(-1)^{a b} = (-1)^{b a}$, swapping control and target indices produces the exact same gate matrix.

## Further Learning
- Practice building multi-controlled CZ gates for Grover diffusion operators.