---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - core-concept
  - bell-states
  - epr-pairs
  - entanglement
---
# Bell States

## Definition
The **Bell States** (or EPR pairs) are the four orthogonal, maximally entangled two-qubit quantum states. They form a complete orthonormal basis for a 4-dimensional two-qubit Hilbert space.

## Why It Matters
Bell states represent the maximum possible entanglement between two qubits. They serve as the foundational computational resource for Quantum Teleportation, Superdense Coding, and Quantum Key Distribution (QKD).

## Intuition
- **Level 1 (Intuition)**: The four Bell states represent the 4 canonical ways two qubits can be maximally linked—two states where the qubits match ($00$ or $11$) with positive/negative relative phase, and two states where the qubits are opposite ($01$ or $10$) with positive/negative relative phase.
- **Level 2 (Mathematical)**: Formed by applying $H$ to qubit 0 and CNOT from qubit 0 to qubit 1 with computational basis inputs $|x y\rangle$.
- **Level 3 (Implementation)**: Standard Qiskit routine transforms $|00\rangle, |01\rangle, |10\rangle, |11\rangle$ into the four Bell states $|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$.

## Mathematical Foundation

### The Four Bell Basis States
$$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$
$$|\Phi^-\rangle = \frac{|00\rangle - |11\rangle}{\sqrt{2}}$$
$$|\Psi^+\rangle = \frac{|01\rangle + |10\rangle}{\sqrt{2}}$$
$$|\Psi^-\rangle = \frac{|01\rangle - |10\rangle}{\sqrt{2}}$$

### Unified Matrix Generation Formula
$$|\text{Bell}_{xy}\rangle = \text{CNOT} (H \otimes I) |x y\rangle$$
- $|00\rangle \to |\Phi^+\rangle$
- $|01\rangle \to |\Psi^+\rangle$
- $|10\rangle \to |\Phi^-\rangle$
- $|11\rangle \to |\Psi^-\rangle$

## Key Equations
$$|\Phi^\pm\rangle = \frac{|00\rangle \pm |11\rangle}{\sqrt{2}}$$
$$|\Psi^\pm\rangle = \frac{|01\rangle \pm |10\rangle}{\sqrt{2}}$$
$$\langle \text{Bell}_i | \text{Bell}_j \rangle = \delta_{ij} \quad (\text{Orthonormal Basis})$$

## Example
Verify orthonormality of $|\Phi^+\rangle$ and $|\Phi^-\rangle$:
$$\langle \Phi^- | \Phi^+ \rangle = \left(\frac{\langle 00| - \langle 11|}{\sqrt{2}}\right) \left(\frac{|00\rangle + |11\rangle}{\sqrt{2}}\right) = \frac{1}{2}\left(\langle 00|00\rangle - \langle 11|11\rangle\right) = \frac{1}{2}(1 - 1) = 0$$

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

def create_bell_state(x, y):
    qc = QuantumCircuit(2)
    if x == 1:
        qc.x(0)
    if y == 1:
        qc.x(1)
    qc.h(0)
    qc.cx(0, 1)
    return Statevector.from_instruction(qc)

print("|Phi+>:", create_bell_state(0, 0).data)
print("|Psi+>:", create_bell_state(0, 1).data)
print("|Phi->:", create_bell_state(1, 0).data)
print("|Psi->:", create_bell_state(1, 1).data)
```

## Prerequisites
- [[Entanglement]]
- [[CNOT]]
- [[Hadamard]]

## Related Concepts
- [[Tensor Products]]
- [[Measurement]]

## Algorithms Using This
- Quantum Teleportation, Superdense Coding, and Entanglement Swapping.

## Common Mistakes
- Confusing Bell state indices (e.g., $|\Phi\rangle$ has equal qubit values; $|\Psi\rangle$ has opposite qubit values).

## Further Learning
- Practice building a Bell measurement circuit (reversing the Bell generator circuit by performing CNOT followed by $H$ on qubit 0).