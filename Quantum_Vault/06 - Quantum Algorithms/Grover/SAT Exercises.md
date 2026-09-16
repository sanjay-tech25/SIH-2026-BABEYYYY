---
type: exercise
level: intermediate
status: completed
difficulty: hard
tags:
  - exercise
  - grover
  - sat
---
# Grover SAT Exercises

## Overview
Solving Boolean Satisfiability (SAT) problems using Grover's search algorithm.

---

## Exercise 1: 2-SAT Oracle Construction (Katas Task 1.1)
Construct a quantum oracle for formula $(x_0 \lor x_1) \land (\neg x_0 \lor \neg x_1)$.

---

## Original Microsoft Quantum Katas Implementation

```qsharp
namespace Quantum.Katas.SolveSATWithGrover {
    operation Oracle_SAT (queryRegister : Qubit[], target : Qubit) : Unit {
        // Evaluates 2-SAT clauses into ancilla bits and uncomputes
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(3)
qc.cx(0, 2)
qc.cx(1, 2)
print("2-SAT XOR Clause Oracle Depth:", qc.depth())
```

---

## Sources
- Microsoft Quantum Katas: `SolveSATWithGrover/Tasks.qs`