---
type: error-correction
level: advanced
status: completed
difficulty: hard
tags:
  - qec
  - shor-code
  - 9-qubit-code
---
# Shor Code

## Definition
The 9-qubit **Shor Code** concatenates the 3-qubit bit flip code with the 3-qubit phase flip code to correct **arbitrary single-qubit errors** ($X$, $Y$, or $Z$).

## Logical States
$$|0_L\rangle = \frac{(|000\rangle+|111\rangle)(|000\rangle+|111\rangle)(|000\rangle+|111\rangle)}{2\sqrt{2}}$$
$$|1_L\rangle = \frac{(|000\rangle-|111\rangle)(|000\rangle-|111\rangle)(|000\rangle-|111\rangle)}{2\sqrt{2}}$$

## Prerequisites
- [[Bit Flip Code]]
- [[Phase Flip Code]]

## Microsoft Quantum Katas

**Topic:** Error Correction - Shor 9-Qubit Code

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit