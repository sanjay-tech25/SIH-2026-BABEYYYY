---
type: protocol
level: intermediate
status: completed
difficulty: medium
tags:
  - protocol
  - quantum-teleportation
  - entanglement
  - bell-state
---
# Quantum Teleportation

## Problem
Transmit an unknown single-qubit quantum state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ from Alice to Bob using a shared entangled Bell pair $|\Phi^+\rangle$ and two classical bits of communication, without physically transmitting the qubit itself.

---

## Prerequisites
- [[Entanglement]]
- [[Bell States]]
- [[CNOT]]
- [[Hadamard]]
- [[Single Qubit Measurement]]

---

## Mathematical Formulation

1. Initial 3-Qubit System State:
   $$|\Psi_0\rangle = |\psi\rangle_A \otimes |\Phi^+\rangle_{AB} = (\alpha|0\rangle + \beta|1\rangle) \otimes \frac{|00\rangle + |11\rangle}{\sqrt{2}}$$

2. Alice applies CNOT (qubit A on shared qubit B1) and Hadamard on qubit A:
   $$|\Psi_2\rangle = \frac{1}{2} \Big[ |00\rangle_A (\alpha|0\rangle + \beta|1\rangle)_B + |01\rangle_A (\alpha|1\rangle + \beta|0\rangle)_B + |10\rangle_A (\alpha|0\rangle - \beta|1\rangle)_B + |11\rangle_A (\alpha|1\rangle - \beta|0\rangle)_B \Big]$$

3. Alice measures her 2 qubits, yielding classical bits $m_1 m_2 \in \{00, 01, 10, 11\}$.

4. Bob applies correction gates $Z^{m_1} X^{m_2}$ to recover exact state $|\psi\rangle_B = \alpha|0\rangle + \beta|1\rangle$.

---

## Exercises

### Exercise 1: State Reconstruction Verification (Katas Task 1.4)
Suppose Alice measures classical outcome `10` ($m_1=1, m_2=0$). Show what state Bob holds before and after applying his correction operation.

**Solution Approach**:
- For outcome `10`, Bob's qubit is in state $\alpha|0\rangle - \beta|1\rangle = Z |\psi\rangle$.
- Bob applies $Z^{1} X^{0} = Z$.
- $Z (Z |\psi\rangle) = Z^2 |\psi\rangle = I |\psi\rangle = \alpha|0\rangle + \beta|1\rangle$.

**Key Takeaway**: Pauli Z cancels the negative relative phase on $|1\rangle$, perfectly restoring state $|\psi\rangle$.

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation from the archived Quantum Katas repository (`Teleportation/Tasks.qs`).

```qsharp
namespace Quantum.Katas.Teleportation {
    open Microsoft.Quantum.Intrinsic;

    // Task 1.3: Send state |ψ> from Alice to Bob
    operation Teleport (msg : Qubit, target : Qubit) : Unit {
        use ancilla = Qubit();
        // 1. Create Bell pair between Alice's ancilla and Bob's target
        H(ancilla);
        CNOT(ancilla, target);

        // 2. Alice's encoding transformations
        CNOT(msg, ancilla);
        H(msg);

        // 3. Measure Alice's qubits
        let m1 = M(msg);
        let m2 = M(ancilla);

        // 4. Bob's conditional corrections
        if (m2 == One) { X(target); }
        if (m1 == One) { Z(target); }

        Reset(ancilla);
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(3, 2)
# Prepare arbitrary input state |ψ> on q0
qc.rx(1.2, 0)
qc.rz(0.5, 0)

# Create Bell pair on q1, q2
qc.h(1)
qc.cx(1, 2)

# Teleportation protocol
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])

# Conditional corrections for Bob (q2)
with qc.if_test((qc.clbits[1], 1)):
    qc.x(2)
with qc.if_test((qc.clbits[0], 1)):
    qc.z(2)

print("Quantum Teleportation circuit assembled successfully.")
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `Teleportation/README.md`
- Source File: `Teleportation/Tasks.qs`
- Source File: `Teleportation/ReferenceImplementation.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/circuit/quantumcircuit.py`