---
type: gate
level: beginner
status: completed
difficulty: medium
tags:
  - gate
  - swap
  - routing
---
# SWAP

## Definition
The **SWAP gate** is a two-qubit unitary operation that exchanges the quantum states of two qubits: $|\psi\rangle \otimes |\phi\rangle \to |\phi\rangle \otimes |\psi\rangle$.

## Why It Matters
In physical quantum processors, qubits have limited native connectivity. SWAP gates are used by compilers to route quantum information across hardware couplings.

## Intuition
- **Level 1 (Intuition)**: The SWAP gate acts like a physical swap of two wire connections. If qubit A has state $|0\rangle$ and qubit B has state $|1\rangle$, SWAP leaves qubit A with $|1\rangle$ and qubit B with $|0\rangle$.
- **Level 2 (Mathematical)**: SWAP is constructed from three alternating CNOT gates: $\text{SWAP}_{0,1} = \text{CNOT}_{0,1} \text{CNOT}_{1,0} \text{CNOT}_{0,1}$.
- **Level 3 (Implementation)**: In Qiskit, `qc.swap(0, 1)` swaps qubits 0 and 1.

## Mathematical Foundation

### Matrix Representation
$$\text{SWAP} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

### Action on Basis States
$$\text{SWAP}|00\rangle = |00\rangle, \quad \text{SWAP}|01\rangle = |10\rangle$$
$$\text{SWAP}|10\rangle = |01\rangle, \quad \text{SWAP}|11\rangle = |11\rangle$$

## Key Equations
$$\text{SWAP} = \text{CNOT}_{0,1} \text{CNOT}_{1,0} \text{CNOT}_{0,1}$$
$$\text{SWAP}^2 = I$$

## Example
Verify 3-CNOT SWAP decomposition on $|01\rangle$:
1. $\text{CNOT}_{0,1}|01\rangle = |01\rangle$
2. $\text{CNOT}_{1,0}|01\rangle = |11\rangle$
3. $\text{CNOT}_{0,1}|11\rangle = |10\rangle$
Final output state is $|10\rangle$, successfully swapped!

## Circuit
```text
q_0: ──✕──
       │
q_1: ──✕──
```
Equivalent CNOT Decomposition:
```text
q_0: ──■──⊕──■──
       │  │  │
q_1: ──⊕──■──⊕──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.x(0)  # Prepare |10> state
qc.swap(0, 1)  # Swap to |01>

sv = Statevector.from_instruction(qc)
print("Statevector after SWAP:", sv.data)
```

## Prerequisites
- [[CNOT]]
- [[Matrices]]

## Related Concepts
- [[Tensor Products]]
- [[Qiskit]]

## Algorithms Using This
- [[Quantum Fourier Transform]] (Bit-reversal output layer) and transpiler connectivity mapping.

## Common Mistakes
- Inserting explicit SWAP gates into algorithms without realizing they add significant CNOT depth overhead on physical hardware.

## Further Learning
- Read about the $\sqrt{\text{SWAP}}$ gate used in neutral atom quantum platforms.