---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - superposition
  - quantum-parallelism
---
# Superposition

## Definition
**Superposition** is the principle of quantum mechanics allowing a system to exist simultaneously in a linear combination of all its fundamental basis states until a measurement is performed.

## Why It Matters
Superposition enables **quantum parallelism**. By placing an $n$-qubit register into equal superposition, a single quantum operation or oracle query acts on all $2^n$ computational basis states simultaneously.

## Intuition
- **Level 1 (Intuition)**: A classical musical note is played at a single frequency. A chord is a superposition of multiple musical frequencies sounding simultaneously. A quantum state superposition plays all basis state "frequencies" at once.
- **Level 2 (Mathematical)**: State $|\psi\rangle = \sum_{x=0}^{2^n-1} c_x |x\rangle$. If all $c_x = \frac{1}{\sqrt{2^n}}$, it is an equal superposition of all $2^n$ basis strings.
- **Level 3 (Implementation)**: Applying Hadamard gates ($H^{\otimes n}$) to register $|0\rangle^{\otimes n}$ creates an equal superposition state vector in Qiskit.

## Mathematical Foundation
Applying $H$ to single qubit $|0\rangle$:
$$H|0\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle = |+\rangle$$
Applying $H^{\otimes n}$ to $n$-qubit state $|0\rangle^{\otimes n}$:
$$H^{\otimes n}|0\dots0\rangle = \frac{1}{\sqrt{2^n}} \sum_{x \in \{0,1\}^n} |x\rangle$$

## Key Equations
$$\text{Equal Superposition: } |\psi\rangle = \frac{1}{\sqrt{2^n}} \sum_{x=0}^{2^n-1} |x\rangle$$
$$\text{Superposition Measurement Probability: } P(x) = \left|\frac{1}{\sqrt{2^n}}\right|^2 = \frac{1}{2^n}$$

## Example
For 2 qubits:
$$H^{\otimes 2}|00\rangle = (H|0\rangle) \otimes (H|0\rangle) = \frac{1}{2} |00\rangle + \frac{1}{2} |01\rangle + \frac{1}{2} |10\rangle + \frac{1}{2} |11\rangle$$
Measuring this state yields each of the 4 strings with equal probability $P = (1/2)^2 = 1/4 = 25\%$.

## Circuit
```text
q_0: ──[H]──
q_1: ──[H]──
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

n = 3
qc = QuantumCircuit(n)
qc.h(range(n))  # Apply H gate to all n qubits

sv = Statevector.from_instruction(qc)
print("3-Qubit Equal Superposition Amplitudes:")
for i, amp in enumerate(sv.data):
    print(f"|{i:03b}⟩ : {amp:.4f}")
```

## Prerequisites
- [[Qubit]]
- [[Quantum State]]
- [[Hadamard]]

## Related Concepts
- [[Interference]]
- [[Measurement]]
- [[Quantum Oracle]]

## Algorithms Using This
- [[Deutsch Algorithm]]
- [[Deutsch-Jozsa Algorithm]]
- [[Bernstein-Vazirani Algorithm]]
- [[Simon Algorithm]]
- [[Grover Algorithm]]
- [[Quantum Fourier Transform]]

## Common Mistakes
- Believing superposition allows reading out $2^n$ values in a single measurement. Measurement collapses the state to only ONE basis outcome. Interference must be used to filter target outcomes!

## Further Learning
- Explore how destructive interference is used alongside superposition to cancel out incorrect computational paths.