---
type: protocol
level: intermediate
status: completed
difficulty: medium
tags:
  - protocol
  - chsh-game
  - bell-inequality
  - non-locality
---
# CHSH Game

## Problem
Alice and Bob play a non-local game. A referee gives Alice random bit $x \in \{0,1\}$ and Bob random bit $y \in \{0,1\}$. Without communicating, Alice outputs bit $a$ and Bob outputs bit $b$. They win if $a \oplus b = x \cdot y$.

## Classical Limit
Classically, the maximum winning probability is bounded by **$75\%$** (Bell's Inequality, CHSH inequality $S \le 2$).

## Quantum Advantage
By sharing an entangled Bell state $|\Phi^+\rangle$, Alice and Bob achieve a winning probability of **$\cos^2(\pi/8) \approx 85.36\%$** (Tsirelson's Bound $S = 2\sqrt{2} \approx 2.828$).

## Implementation
```python
import numpy as np

quantum_win_prob = np.cos(np.pi / 8)**2
print(f"CHSH Quantum Winning Probability: {quantum_win_prob * 100:.2f}% vs Classical 75%")
```

## Prerequisites
- [[Entanglement]]
- [[Bell States]]

## Related Protocols
- [[GHZ Game]]
- [[Mermin Peres Magic Square]]

## Microsoft Quantum Katas

**Topic:** Entanglement Games - CHSH Game

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit