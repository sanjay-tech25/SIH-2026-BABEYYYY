---
type: hub
level: overview
status: completed
tags:
  - dashboard
  - quantum
  - katas
  - index
---
# Quantum Algorithm Hub

Welcome to the **Quantum Algorithms Knowledge Base**, structured around the **Microsoft Quantum Katas learning path** and extended into modern quantum algorithms, error correction, hardware architectures, and Qiskit implementations.

---

## 🗺️ Extended Learning Roadmap Overview

The vault follows an expanded 12-stage progression:

```
[Math Foundations] ──► [Qubits & Gates] ──► [Measurements] ──► [Quantum Protocols]
                                                                     │
[Query Algorithms] ◄── [Core Concepts & Oracles] ◄───────────────────┘
        │
        ▼
[Search (Grover)] ──► [QFT & Phase Estimation] ──► [Factoring (Shor)]
                                                           │
        ┌──────────────────────────────────────────────────┘
        ▼
[Advanced & NISQ Layer] ──► [Cryptography & Error Correction] ──► [Hardware Layer]
```

---

## 📂 Vault Folder Directory Map

- **[[Learning Roadmap]]**: 12-stage Microsoft Quantum Katas roadmap & modern extension guide.
- **[[Algorithm Tracker]]**: Complete progress tracker across theory, math, circuit, and Qiskit implementations.
- **01 - Mathematics**: [[Complex Numbers]], [[Vectors]], [[Matrices]], [[Tensor Products]], [[Eigenvalues & Eigenvectors]], [[Probability]], [[Unitary Matrices]]
- **02 - Quantum Foundations**: [[Qubit]], [[Quantum State]], [[Pure States]], [[Mixed States]], [[Superposition]], [[Measurement]], [[Single Qubit Measurement]], [[Multi Qubit Measurement]], [[Bloch Sphere]], [[Normalization]], [[Born Rule]]
- **03 - Quantum Gates**: [[Pauli X]], [[Pauli Y]], [[Pauli Z]], [[Hadamard]], [[S Gate]], [[T Gate]], [[Phase Gates]], [[Rotation Gates]], [[CNOT]], [[CZ]], [[SWAP]], [[Multi Qubit Gates]], [[Controlled Operations]], [[Adjoint Operations]]
- **04 - Core Quantum Concepts**: [[Entanglement]], [[Bell States]], [[GHZ States]], [[Interference]], [[Quantum Oracle]], [[Marking Oracle]], [[Phase Kickback]], [[Reversible Computing]], [[Truth Tables]], [[Parity Measurements]], [[Unitary Operations]]
- **05 - Quantum Protocols**: [[Quantum Teleportation]], [[Superdense Coding]], [[CHSH Game]], [[GHZ Game]], [[Mermin Peres Magic Square]]
- **06 - Quantum Algorithms**: [[Random Number Generation]], [[Deutsch Algorithm]], [[Deutsch-Jozsa Algorithm]], [[Bernstein-Vazirani Algorithm]], [[Simon Algorithm]], [[Grover Algorithm]], [[Quantum Fourier Transform]], [[Quantum Arithmetic]], [[Quantum Phase Estimation]], [[Iterative Phase Estimation]], [[Period Finding]], [[Quantum Counting]], [[Shor Algorithm]]
- **07 - Advanced Algorithms**: [[Amplitude Amplification]], [[Amplitude Estimation]], [[Quantum Walks]], [[Quantum Simulation]], [[VQE]], [[QAOA]], [[HHL]]
- **08 - Quantum Cryptography**: [[Quantum Cryptography]], [[BB84]], [[E91]]
- **09 - Quantum Error Correction**: [[Quantum Errors]], [[Bit Flip Code]], [[Phase Flip Code]], [[Shor Code]], [[Steane Code]], [[Surface Code]]
- **10 - Quantum Computing Hardware**: [[Quantum Noise]], [[Decoherence]], [[NISQ]], [[Quantum Circuit Depth]], [[Gate Errors]], [[Readout Errors]], [[Error Mitigation]]
- **11 - Implementation**: [[Python]], [[Qiskit]], [[Qiskit Circuits]], [[Qiskit Primitives]], [[Circuit Experiments]], [[Algorithm Implementations]], [[Benchmarking]]
- **12 - Resources**: [[IBM Quantum]], [[Microsoft Quantum]], [[Quantum Katas]], [[Qiskit Documentation]], [[GitHub Repositories]], [[Courses]], [[Research Papers]]

---

## 📌 Key Algorithm Summary

| Algorithm | Domain | Complexity | Speedup |
|---|---|---|---|
| [[Deutsch-Jozsa Algorithm]] | Oracle Evaluation | $O(1)$ | Exponential vs Classical $O(2^{n-1})$ |
| [[Bernstein-Vazirani Algorithm]] | Secret Bit String | $O(1)$ | Linear query speedup $O(1)$ vs $O(n)$ |
| [[Simon Algorithm]] | Hidden Period Mask | $O(n)$ | Exponential vs Classical $O(2^{n/2})$ |
| [[Grover Algorithm]] | Unstructured Search | $O(\sqrt{N})$ | Quadratic vs Classical $O(N)$ |
| [[Shor Algorithm]] | Integer Factoring | $O((\log N)^3)$ | Polynomial vs Classical Sub-exponential |
| [[VQE]] / [[QAOA]] | NISQ Optimization | Hybrid Variational | Heuristic Speedup |
| [[HHL]] | Linear Systems $Ax=b$ | $O(s^2 \kappa^2 \log N)$ | Exponential in Vector Dimension $N$ |