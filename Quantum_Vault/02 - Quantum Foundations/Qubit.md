---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - qubit
  - statevector
---
# Qubit

## Definition
A **qubit** (quantum bit) is the fundamental unit of quantum information. Unlike a classical bit which can exist only in state 0 or 1, a single qubit exists in a normalized state space spanned by orthogonal basis states $|0\rangle$ and $|1\rangle$.

## Why It Matters
Qubits leverage quantum phenomena such as superposition and entanglement. A system of $n$ qubits can represent a superposition of $2^n$ basis states simultaneously, providing the structural foundation for quantum computing speedups.

## Intuition
- **Level 1 (Intuition)**: A classical bit is like a light switch (either strictly ON or OFF). A qubit is like a sphere's surface (the [[Bloch Sphere]]), where the state can point anywhere on the 3D sphere until measured.
- **Level 2 (Mathematical)**: A qubit state vector $|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$ is a unit vector in a 2-dimensional complex Hilbert space $\mathbb{C}^2$, with constraint $|\alpha|^2 + |\beta|^2 = 1$.
- **Level 3 (Implementation)**: In Qiskit, qubits are initialized into $|0\rangle$ inside a `QuantumCircuit` register and manipulated using logic gate matrices.

## Mathematical Foundation
$$\text{Computational Basis: } |0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \quad |1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$$
$$\text{General Qubit State: } |\psi\rangle = \alpha |0\rangle + \beta |1\rangle = \begin{pmatrix} \alpha \\ \beta \end{pmatrix}, \quad \alpha, \beta \in \mathbb{C}$$
$$\text{Normalization Constraint: } |\alpha|^2 + |\beta|^2 = 1$$

Using spherical polar angles on the Bloch sphere:
$$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$
where $\theta \in [0, \pi]$ and $\phi \in [0, 2\pi)$.

## Key Equations
$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$$
$$|\alpha|^2 + |\beta|^2 = 1$$
$$P(0) = |\alpha|^2, \quad P(1) = |\beta|^2$$

## Example
Consider a qubit in state $|\psi\rangle = \frac{1}{2}|0\rangle + \frac{\sqrt{3}}{2}|1\rangle$:
- Amplitude of $|0\rangle$: $\alpha = 1/2 \implies P(0) = (1/2)^2 = 1/4 = 25\%$
- Amplitude of $|1\rangle$: $\beta = \sqrt{3}/2 \implies P(1) = (\sqrt{3}/2)^2 = 3/4 = 75\%$

## Circuit
```text
q_0: ──[|0⟩]──[Gate]──░──[M]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Create circuit with 1 qubit
qc = QuantumCircuit(1)

# Statevector initialized to |0>
sv = Statevector.from_instruction(qc)
print("Initial State:", sv.data)

# Apply Hadamard gate to put qubit in superposition
qc.h(0)
sv_superposition = Statevector.from_instruction(qc)
print("State after H gate:", sv_superposition.data)
```

## Prerequisites
- [[Complex Numbers]]
- [[Vectors]]

## Related Concepts
- [[Quantum State]]
- [[Superposition]]
- [[Bloch Sphere]]
- [[Normalization]]

## Algorithms Using This
- Every quantum algorithm operates on registers of qubits.

## Common Mistakes
- Thinking a qubit stores two classical bits of data. (Holevo's bound proves an unread qubit can yield at most 1 classical bit of information upon measurement).
- Forgetting that measurement collapses the qubit state irreversibly into either $|0\rangle$ or $|1\rangle$.

## Further Learning
- Read about physical qubit realizations: superconducting transmon qubits, trapped ions, and photonic qubits.