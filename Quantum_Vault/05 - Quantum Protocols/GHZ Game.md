---
type: protocol
level: intermediate
status: completed
difficulty: medium
tags:
  - protocol
  - ghz-game
  - non-locality
---
# GHZ Game

## Problem
A 3-player non-local game played by Alice, Bob, and Charlie. The referee sends input bits $(r, s, t)$ such that $r \oplus s \oplus t = 0$. Players win if outputs $(a, b, c)$ satisfy $a \oplus b \oplus c = r \lor s \lor t$.

## Advantage
Classically, maximum winning probability is **$75\%$**. Sharing a 3-qubit [[GHZ States]] state allows winning with **$100\%$ determinism**!

## Prerequisites
- [[GHZ States]]
- [[CHSH Game]]

## Related Protocols
- [[Mermin Peres Magic Square]]

## Microsoft Quantum Katas

**Topic:** Entanglement Games - GHZ Game

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit