---
type: protocol
level: intermediate
status: completed
difficulty: medium
tags:
  - protocol
  - superdense-coding
  - entanglement
---
# Superdense Coding

## Problem
Transmit two classical bits of information ($b_1 b_2 \in \{00, 01, 10, 11\}$) from Alice to Bob by physically transmitting only **one single qubit** over a shared entangled Bell state.

---

## Prerequisites
- [[Entanglement]]
- [[Bell States]]
- [[Pauli X]]
- [[Pauli Z]]

---

## Exercises

### Exercise 1: Encoding Bit Pair '01' (Katas Task 1.2)
Show the resulting 2-qubit state after Alice encodes bit string `01` onto her half of Bell pair $|\Phi^+\rangle$.

**Solution Approach**:
- $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$.
- Bit string `01` $\implies$ Alice applies $X$ to qubit 0.
- $(X \otimes I) \frac{|00\rangle + |11\rangle}{\sqrt{2}} = \frac{|10\rangle + |01\rangle}{\sqrt{2}} = |\Psi^+\rangle$.

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation from the archived Quantum Katas repository (`SuperdenseCoding/Tasks.qs`).

```qsharp
namespace Quantum.Katas.SuperdenseCoding {
    open Microsoft.Quantum.Intrinsic;

    operation EncodeMessageInQubit (qAlice : Qubit, message : Bool[]) : Unit {
        if (message[1]) { X(qAlice); }
        if (message[0]) { Z(qAlice); }
    }

    operation DecodeMessageFromQubits (qAlice : Qubit, qBob : Qubit) : Bool[] {
        CNOT(qAlice, qBob);
        H(qAlice);
        let b1 = M(qAlice) == One;
        let b2 = M(qBob) == One;
        return [b1, b2];
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def superdense_coding(bit_string):
    qc = QuantumCircuit(2, 2)
    # Bell pair creation
    qc.h(0)
    qc.cx(0, 1)
    
    # Alice encodes 2 bits on qubit 0
    if bit_string[1] == '1':
        qc.x(0)
    if bit_string[0] == '1':
        qc.z(0)
        
    # Bob receives qubit 0 and decodes
    qc.cx(0, 1)
    qc.h(0)
    qc.measure([0, 1], [0, 1])
    
    sim = AerSimulator()
    counts = sim.run(qc, shots=1000).result().get_counts()
    return counts

print("Superdense Coding '11' Result:", superdense_coding("11"))
```

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `SuperdenseCoding/README.md`
- Source File: `SuperdenseCoding/Tasks.qs`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/circuit/library/`