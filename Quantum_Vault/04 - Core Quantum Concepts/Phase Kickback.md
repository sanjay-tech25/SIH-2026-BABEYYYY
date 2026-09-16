---
type: concept
level: intermediate
status: completed
difficulty: medium
tags:
  - core-concept
  - phase-kickback
  - oracle
  - eigenvalues
---
# Phase Kickback

## Definition
**Phase Kickback** is a fundamental quantum mechanics mechanism where an eigenvalue phase shift introduced by a controlled operation on a target qubit gets "kicked back" onto the state of the control qubit.

## Why It Matters
Phase kickback is the secret engine powering quantum algorithm speedups. It converts function outputs evaluated on target qubits into phase shifts on control qubits, enabling quantum interference.

## Intuition
- **Level 1 (Intuition)**: Imagine pushing against a heavy wall on ice. Instead of moving the wall (target), you end up sliding backward yourself (control). In quantum phase kickback, acting on a target qubit in an eigenstate pushes the phase shift onto the control qubit instead!
- **Level 2 (Mathematical)**: Given controlled unitary $C-U$ with target in eigenstate $|u\rangle$ ($U|u\rangle = e^{2\pi i \theta}|u\rangle$):
  $$C-U \left[\left(\alpha|0\rangle + \beta|1\rangle\right) \otimes |u\rangle\right] = \left(\alpha|0\rangle + \beta e^{2\pi i \theta}|1\rangle\right) \otimes |u\rangle$$
- **Level 3 (Implementation)**: Preparing target qubit in $|-\rangle$ and applying CNOT kicks back a $-1$ phase ($e^{i\pi}$) to the control qubit if control is $|1\rangle$.

## Mathematical Foundation

### Derivation using CNOT
Let control qubit be in state $|+\rangle = \frac{|0\rangle+|1\rangle}{\sqrt{2}}$ and target qubit in state $|-\rangle = \frac{|0\rangle-|1\rangle}{\sqrt{2}}$:
$$|\psi_{in}\rangle = |+\rangle \otimes |-\rangle = \frac{1}{2} \left(|00\rangle - |01\rangle + |10\rangle - |11\rangle\right)$$
Apply CNOT (control qubit 0, target qubit 1):
$$\text{CNOT}|\psi_{in}\rangle = \frac{1}{2} \left(|00\rangle - |01\rangle + |11\rangle - |10\rangle\right) = \frac{1}{2}\left(|0\rangle(|0\rangle-|1\rangle) - |1\rangle(|0\rangle-|1\rangle)\right)$$
Factor out target state $|-\rangle$:
$$\text{CNOT}(|+\rangle \otimes |-\rangle) = \left(\frac{|0\rangle - |1\rangle}{\sqrt{2}}\right) \otimes \left(\frac{|0\rangle - |1\rangle}{\sqrt{2}}\right) = |-\rangle \otimes |-\rangle$$
The control qubit transformed from $|+\rangle$ to $|-\rangle$! The minus phase kicked back to the control qubit.

## Key Equations
$$\text{General Kickback: } C-U \left[\left(\frac{|0\rangle+|1\rangle}{\sqrt{2}}\right) \otimes |u\rangle\right] = \left(\frac{|0\rangle + e^{2\pi i \theta}|1\rangle}{\sqrt{2}}\right) \otimes |u\rangle$$
$$\text{CNOT Kickback: } \text{CNOT}\left(|+\rangle \otimes |-\rangle\right) = |-\rangle \otimes |-\rangle$$

## Example
Verify phase kickback for controlled phase gate $C-R_z(\theta)$ with target $|1\rangle$:
- $R_z(\theta)|1\rangle = e^{i\theta}|1\rangle$
- $C-R_z(\theta) \left[\frac{|0\rangle+|1\rangle}{\sqrt{2}} \otimes |1\rangle\right] = \left[\frac{|0\rangle + e^{i\theta}|1\rangle}{\sqrt{2}}\right] \otimes |1\rangle$
The control qubit acquires relative phase shift $e^{i\theta}$.

## Circuit
```text
q_0 (control): ──[H]──────■──────[H]──
                          │
q_1 (target) : ──[X]──[H]─⊕───────────
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)      # Control in |+>
qc.x(1)
qc.h(1)      # Target in |->

qc.cx(0, 1)  # CNOT kickback

sv = Statevector.from_instruction(qc)
print("Control qubit statevector (should be |->):")
print(sv.data)
```

## Prerequisites
- [[CNOT]]
- [[Quantum Oracle]]
- [[Eigenvalues & Eigenvectors]]

## Related Concepts
- [[Interference]]
- [[Superposition]]

## Algorithms Using This
Phase Kickback is essential in:
- ├──→ [[Deutsch Algorithm]]
- ├──→ [[Bernstein-Vazirani Algorithm]]
- └──→ [[Quantum Phase Estimation]]

## Common Mistakes
- Believing target qubit state changes during kickback. When target is in a true eigenstate $|u\rangle$, its state remains completely unchanged while the control qubit acquires the phase.

## Further Learning
- Practice applying phase kickback to $n$-qubit control registers in Quantum Phase Estimation.