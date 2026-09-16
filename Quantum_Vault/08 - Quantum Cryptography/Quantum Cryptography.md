---
type: cryptography
level: intermediate
status: completed
difficulty: medium
tags:
  - cryptography
  - qkd
  - no-cloning
---
# Quantum Cryptography

## Overview
**Quantum Cryptography** uses quantum mechanics principles (such as state collapse upon measurement and the **No-Cloning Theorem**) to achieve provably secure key distribution (QKD) between two parties.

## Key Principles
1. **No-Cloning Theorem**: Unknown quantum states cannot be duplicated perfectly.
2. **Measurement Disturbance**: Any eavesdropper (Eve) attempting to intercept and measure quantum key signals inevitably introduces detectable errors ($> 11\%$ QBER).

## Prerequisites
- [[Measurement]]
- [[Born Rule]]

## Related Protocols
- [[BB84]]
- [[E91]]

## Microsoft Quantum Katas

**Topic:** Quantum Cryptography Katas

**Repository:**
https://github.com/microsoft/QuantumKatas

**Roadmap:**
https://github.com/microsoft/QuantumKatas/wiki/Roadmap

**Status:**
Archived reference

**Modern Alternative:**
Microsoft Quantum Development Kit / Qiskit