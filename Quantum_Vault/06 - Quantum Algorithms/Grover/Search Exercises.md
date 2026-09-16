---
type: exercise
level: intermediate
status: completed
difficulty: medium
tags:
  - exercise
  - grover
  - search
---
# Grover Search Exercises

## Exercise Overview
Practical Katas exercises focusing on fundamental Grover search operations, oracle construction, and phase reflections.

---

## Exercises

### Exercise 1: State Inversion / Oracle Reflection (Katas Task 1.1)
Implement phase oracle for single target state $|101\rangle$.

**Solution Approach**:
Apply $X$ on bit 1 to flip $|101\rangle \to |111\rangle$, apply multi-controlled $Z$, and revert $X$.

---

## Original Microsoft Quantum Katas Implementation

```qsharp
namespace Quantum.Katas.GroversAlgorithm {
    operation Oracle_Target101 (qs : Qubit[]) : Unit {
        X(qs[1]);
        Controlled Z([qs[0], qs[1]], qs[2]);
        X(qs[1]);
    }
}
```

---

## Modern Qiskit Implementation

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(3)
qc.x(1)
qc.h(2)
qc.mcx([0, 1], 2)
qc.h(2)
qc.x(1)

print("Target |101| phase oracle generated.")
```

---

## Sources
- Microsoft Quantum Katas: `GroversAlgorithm/Tasks.qs`