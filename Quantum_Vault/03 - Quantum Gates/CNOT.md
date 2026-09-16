---
type: gate
level: beginner
status: completed
difficulty: medium
tags:
  - gate
  - cnot
  - cx
  - entangling-gate
  - two-qubit
---
# CNOT

## Definition
The **CNOT gate** (Controlled-NOT or CX gate) is a two-qubit entangling unitary gate that flips the target qubit if and only if the control qubit is in state $|1\rangle$.

## Why It Matters
CNOT is the fundamental two-qubit logic gate. Combined with single-qubit rotation gates, CNOT forms a universal gate set capable of creating quantum entanglement.

## Intuition
- **Level 1 (Intuition)**: CNOT acts like a conditional light switch. If Qubit 0 (control) is 0, Qubit 1 (target) stays unchanged. If Qubit 0 is 1, Qubit 1 is flipped ($0 \leftrightarrow 1$).
- **Level 2 (Mathematical)**: 4x4 unitary matrix acting on composite space $\mathbb{C}^4$: $|c, t\rangle \to |c, t \oplus c\rangle$.
- **Level 3 (Implementation)**: In Qiskit, `qc.cx(control, target)` applies CNOT.

## Mathematical Foundation

### Matrix Representation
In standard 2-qubit computational basis $\{|00\rangle, |01\rangle, |10\rangle, |11\rangle\}$:
$$\text{CNOT} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{pmatrix}$$

### Action on Basis States
$$\text{CNOT}|00\rangle = |00\rangle$$
$$\text{CNOT}|01\rangle = |01\rangle$$
$$\text{CNOT}|10\rangle = |11\rangle \quad (\text{Target flipped!})$$
$$\text{CNOT}|11\rangle = |10\rangle \quad (\text{Target flipped!})$$

### Truth Table
| Control ($c$) | Target ($t$) | Output Control ($c'$) | Output Target ($t' = t \oplus c$) |
|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 |

## Key Equations
$$\text{CNOT}|c, t\rangle = |c, t \oplus c\rangle$$
$$\text{CNOT}^2 = I \quad (\text{Self-inverse})$$
$$\text{Bell State Generation: } \text{CNOT} (H \otimes I) |00\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$$

## Example
Apply CNOT to state $\frac{|00\rangle + |10\rangle}{\sqrt{2}} = |+\rangle \otimes |0\rangle$:
$$\text{CNOT}\left(\frac{|00\rangle + |10\rangle}{\sqrt{2}}\right) = \frac{\text{CNOT}|00\rangle + \text{CNOT}|10\rangle}{\sqrt{2}} = \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$$
This transforms a separable state into a maximally entangled Bell state!

## Circuit
```text
q_0: ──■──  (Control)
       │
q_1: ──⊕──  (Target)
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)  # Bell state generator

sv = Statevector.from_instruction(qc)
print("Bell state |Phi+> statevector:", sv.data)
```

## Prerequisites
- [[Tensor Products]]
- [[Pauli X]]
- [[Matrices]]

## Related Concepts
- [[Entanglement]]
- [[Bell States]]
- [[CZ]]
- [[SWAP]]

## Algorithms Using This
CNOT plays a fundamental role in multi-qubit algorithms:
- ├──→ [[Entanglement]]
- └──→ [[Bell States]]
- Used in [[Deutsch-Jozsa Algorithm]], [[Bernstein-Vazirani Algorithm]], [[Simon Algorithm]], [[Shor Algorithm]], and [[VQE]].

## Common Mistakes
- Reversing control and target qubit indices.
- Assuming CNOT only affects target qubit phases (see [[Phase Kickback]] where target eigenphases kick back onto the control qubit!).

## Further Learning
- Prove that swapping control and target qubits can be accomplished by sandwiching CNOT between four Hadamard gates: $(H \otimes H) \text{CNOT}_{0,1} (H \otimes H) = \text{CNOT}_{1,0}$.