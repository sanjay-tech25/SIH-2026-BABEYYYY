---
type: concept
level: beginner
status: completed
difficulty: easy
tags:
  - concept
  - truth-tables
  - boolean-logic
  - reversible
---
# Truth Tables

## Definition
A **Truth Table** specifies classical output strings $f(x_1, \dots, x_n)$ for all $2^n$ binary input combinations.

## Reversible Mapping
To embed a classical truth table into quantum circuits, map input $|x\rangle$ and target $|y\rangle$ reversibly:
$$|x\rangle |y\rangle \to |x\rangle |y \oplus f(x)\rangle$$

## Prerequisites
- [[Reversible Computing]]

## Related Concepts
- [[Quantum Oracle]]
- [[Marking Oracle]]

## Microsoft Quantum Katas

**Topic:** Truth Tables & Oracles

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit