---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - core-concept
  - entanglement
  - bell-states
  - non-locality
---
# Entanglement

## Definition
**Quantum Entanglement** is a phenomenon in which two or more qubits become inextricably correlated such that the quantum state of each individual qubit cannot be described independently of the state of the others, regardless of the physical distance separating them.

## Why It Matters
Entanglement is a fundamental resource for quantum computation and quantum communication. It enables non-local quantum correlations, quantum teleportation, superdense coding, and algorithms that outperform classical limits.

## Intuition
- **Level 1 (Intuition)**: Imagine a pair of magic dice. When rolled in separate rooms, each die lands on a random number (1 through 6). However, whenever you look at them, both dice ALWAYS land on the exact same number! That shared correlation without any physical wire is quantum entanglement.
- **Level 2 (Mathematical)**: A joint state $|\psi_{AB}\rangle \in \mathcal{H}_A \otimes \mathcal{H}_B$ is **separable** if it can be written as $|\psi_{AB}\rangle = |\psi_A\rangle \otimes |\psi_B\rangle$. A state is **entangled** if it is non-separable ($|\psi_{AB}\rangle \neq |\psi_A\rangle \otimes |\psi_B\rangle$).
- **Level 3 (Implementation)**: Entanglement is created in Qiskit by applying a Hadamard gate to qubit 0 followed by a CNOT gate with qubit 0 controlling qubit 1.

## Mathematical Foundation

### Separable vs Entangled States
- **Separable Example**:
  $$\frac{|00\rangle + |01\rangle + |10\rangle + |11\rangle}{2} = \left(\frac{|0\rangle+|1\rangle}{\sqrt{2}}\right) \otimes \left(\frac{|0\rangle+|1\rangle}{\sqrt{2}}\right) = |+\rangle \otimes |+\rangle$$
- **Entangled Example (Bell State $|\Phi^+\rangle$)**:
  $$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$
  Proof of non-separability: Assume $|\Phi^+\rangle = (a|0\rangle + b|1\rangle) \otimes (c|0\rangle + d|1\rangle) = ac|00\rangle + ad|01\rangle + bc|10\rangle + bd|11\rangle$.
  This requires $ad = 0$ and $bc = 0 \implies ac \cdot bd = 0$. But $ac = 1/\sqrt{2}$ and $bd = 1/\sqrt{2}$, yielding $(1/\sqrt{2})(1/\sqrt{2}) = 1/2 \neq 0$, a contradiction!

## Key Equations
$$\text{Bell State Generator: } |\Phi^+\rangle = \text{CNOT}_{0,1} (H \otimes I) |00\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$
$$\text{Separability Condition: } |\psi_{AB}\rangle = |\psi_A\rangle \otimes |\psi_B\rangle$$

## Example
Measure Qubit 0 of Bell state $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$:
- If outcome of Qubit 0 is $0$ (probability $50\%$), the global wave function instantly collapses to $|00\rangle$. Subsequent measurement of Qubit 1 yields $0$ with $100\%$ probability.
- If outcome of Qubit 0 is $1$ (probability $50\%$), the global wave function instantly collapses to $|11\rangle$. Subsequent measurement of Qubit 1 yields $1$ with $100\%$ probability.

## Circuit
```text
q_0: ──[H]──■──
            │
q_1: ───────⊕──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

sv = Statevector.from_instruction(qc)
print("Entangled Bell State |Phi+>:")
print(sv.data)
```

## Prerequisites
- [[Tensor Products]]
- [[CNOT]]
- [[Hadamard]]

## Related Concepts
- [[Bell States]]
- [[Superposition]]
- [[Measurement]]

## Algorithms Using This
- Quantum Teleportation, Superdense Coding, [[Shor Algorithm]], [[VQE]], and [[HHL]].

## Common Mistakes
- Believing entanglement enables faster-than-light classical communication. (Because measurement outcomes on single qubits are completely random, no signal can be transmitted without sending a classical message).

## Further Learning
- Read about Bell's Theorem and the CHSH inequality violation experiments.