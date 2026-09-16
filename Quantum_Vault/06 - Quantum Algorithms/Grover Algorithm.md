---
type: algorithm
level: intermediate
status: completed
difficulty: medium
tags:
  - algorithm
  - grover
  - search
  - amplitude-amplification
---
# Grover Algorithm

## Problem
Given an unstructured search space of $N = 2^n$ items and an oracle $f(x)$ where $f(x) = 1$ for marked solution items and $f(x) = 0$ otherwise, find a solution $x^*$.

---

## Structure & Component Breakdown

```text
Grover Algorithm
│
├── Search Problem
├── Oracle (Marking States)
├── Phase Inversion
├── Diffusion Operator (Reflection about Mean)
├── Amplitude Amplification
├── Optimal Number of Iterations R ≈ (π/4) √(N/M)
├── Handling Multiple Solutions M
└── Applications & Exercises
    ├── [[Search Exercises]]
    ├── [[SAT Exercises]]
    ├── [[Graph Coloring Exercises]]
    └── [[Knapsack Exercises]]
```

---

## Mathematical Formulation

1. Equal Superposition State Initialization:
   $$|s\rangle = H^{\otimes n}|0\rangle = \frac{1}{\sqrt{N}} \sum_{x=0}^{N-1} |x\rangle$$

2. Phase Inversion (Oracle Reflection $U_\omega$):
   $$U_\omega = I - 2 |\omega\rangle\langle \omega|$$

3. Diffusion Operator (Reflection about Mean $U_s$):
   $$U_s = 2 |s\rangle\langle s| - I = H^{\otimes n} (2|0\rangle\langle 0| - I) H^{\otimes n}$$

4. Grover Iteration Operator $G = U_s U_\omega$:
   Rotates state vector toward solution state $|\omega\rangle$ by angle $2\theta$ where $\sin\theta = \frac{1}{\sqrt{N}}$.

5. Optimal Iteration Count:
   $$R \approx \left\lfloor \frac{\pi}{4} \sqrt{\frac{N}{M}} \right\rfloor$$

---

## Original Microsoft Quantum Katas Implementation

> Legacy/reference Q# implementation (`GroversAlgorithm/Tasks.qs`).

```qsharp
namespace Quantum.Katas.GroversAlgorithm {
    open Microsoft.Quantum.Intrinsic;
    open Microsoft.Quantum.Canon;

    operation GroverSearch (register : Qubit[], oracle : ((Qubit[], Qubit) => Unit), iterations : Int) : Unit {
        ApplyToEach(H, register);
        use target = Qubit();
        X(target);
        H(target);

        for _ in 1 .. iterations {
            oracle(register, target);
            // Diffusion operator
            ApplyToEach(H, register);
            ApplyToEach(X, register);
            Controlled Z(Most(register), Tail(register));
            ApplyToEach(X, register);
            ApplyToEach(H, register);
        }
        Reset(target);
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator
from qiskit_aer import AerSimulator

# Oracle for target state |11>
oracle = QuantumCircuit(2)
oracle.cz(0, 1)

grover_op = GroverOperator(oracle)

qc = QuantumCircuit(2, 2)
qc.h([0, 1])
qc.append(grover_op, [0, 1])
qc.measure([0, 1], [0, 1])

sim = AerSimulator()
counts = sim.run(qc, shots=1000).result().get_counts()
print("Grover Search Output Counts:", counts)
```

---

## Sub-Topics & Application Exercises
- [[Search Exercises]]
- [[SAT Exercises]]
- [[Graph Coloring Exercises]]
- [[Knapsack Exercises]]

---

## Sources

### Microsoft Quantum Katas
- Repository: https://github.com/microsoft/QuantumKatas
- Source File: `GroversAlgorithm/README.md`
- Source File: `GroversAlgorithm/Tasks.qs`
- Source File: `tutorials/ExploringGroversAlgorithm/`

### Qiskit
- Repository: https://github.com/Qiskit/qiskit
- Source File: `qiskit/circuit/library/algorithm_components/grover_operator.py`