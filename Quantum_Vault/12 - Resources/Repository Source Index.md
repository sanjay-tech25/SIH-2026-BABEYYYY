---
type: resource
level: overview
status: completed
tags:
  - resource
  - source-index
  - quantum-katas
  - qiskit
---
# Repository Source Index

This index provides a comprehensive structural mapping from the local source files in the **Microsoft Quantum Katas** (`QuantumKatas-main`) and **Qiskit** (`qiskit-main`) repositories to their corresponding Obsidian knowledge base notes.

---

## 1. Microsoft Quantum Katas Source Mapping

| Katas Module / Topic | Local Repository Relative Path | Primary Obsidian Note | Content Types Included |
|---|---|---|---|
| Complex Arithmetic | `tutorials/ComplexArithmetic/` | [[Complex Numbers]] | Theory, Exercises, Q# Reference |
| Linear Algebra | `tutorials/LinearAlgebra/` | [[Vectors]], [[Matrices]], [[Unitary Matrices]] | Theory, Exercises, Q# Reference |
| Qubit & Single Qubit System | `tutorials/Qubit/`, `tutorials/SingleQubitGates/` | [[Qubit]], [[Quantum State]], [[Pauli X]], [[Pauli Y]], [[Pauli Z]], [[Hadamard]] | Theory, Exercises, Q# Reference |
| Multi-Qubit Systems & Gates | `tutorials/MultiQubitSystems/`, `tutorials/MultiQubitGates/`, `BasicGates/` | [[Multi Qubit Gates]], [[CNOT]], [[CZ]], [[SWAP]], [[Controlled Operations]] | Theory, Exercises, Q# Reference |
| Superposition | `Superposition/` | [[Superposition]] | Theory, Exercises, Q# Reference |
| Single & Multi Qubit Measurements | `tutorials/SingleQubitSystemMeasurements/`, `tutorials/MultiQubitSystemMeasurements/`, `Measurements/` | [[Measurement]], [[Single Qubit Measurement]], [[Multi Qubit Measurement]], [[Born Rule]] | Theory, Exercises, Q# Reference |
| Joint & Parity Measurements | `JointMeasurements/` | [[Parity Measurements]] | Theory, Exercises, Q# Reference |
| Unitary Operations & Patterns | `UnitaryPatterns/`, `DistinguishUnitaries/` | [[Unitary Operations]], [[Adjoint Operations]] | Theory, Exercises, Q# Reference |
| Quantum Teleportation | `Teleportation/` | [[Quantum Teleportation]] | Protocol, Exercises, Q# Reference |
| Superdense Coding | `SuperdenseCoding/` | [[Superdense Coding]] | Protocol, Exercises, Q# Reference |
| Entanglement Games | `CHSHGame/`, `GHZGame/`, `MagicSquareGame/` | [[CHSH Game]], [[GHZ Game]], [[Mermin Peres Magic Square]] | Protocol, Non-locality, Exercises |
| Oracles & Truth Tables | `MarkingOracles/`, `TruthTables/`, `tutorials/Oracles/` | [[Quantum Oracle]], [[Marking Oracle]], [[Phase Kickback]], [[Truth Tables]], [[Reversible Computing]] | Theory, Exercises, Q# Reference |
| Deutsch-Jozsa Algorithm | `DeutschJozsaAlgorithm/`, `tutorials/ExploringDeutschJozsaAlgorithm/` | [[Deutsch Algorithm]], [[Deutsch-Jozsa Algorithm]] | Theory, Algorithm, Exercises |
| Bernstein-Vazirani & Simon | `SimonsAlgorithm/` | [[Bernstein-Vazirani Algorithm]], [[Simon Algorithm]] | Theory, Algorithm, Exercises |
| Grover Search & Applications | `GroversAlgorithm/`, `SolveSATWithGrover/`, `GraphColoring/`, `BoundedKnapsack/` | [[Grover Algorithm]], [[Amplitude Amplification]] | Theory, Algorithm, SAT/Coloring Exercises |
| Reversible Ripple Carry Adder | `RippleCarryAdder/` | [[Quantum Arithmetic]], [[Reversible Computing]] | Theory, Circuit, Exercises |
| Quantum Fourier Transform | `QFT/` | [[Quantum Fourier Transform]] | Theory, Algorithm, Exercises |
| Quantum Phase Estimation | `PhaseEstimation/` | [[Quantum Phase Estimation]], [[Iterative Phase Estimation]], [[Quantum Counting]] | Theory, Phase Estimation, Exercises |
| Quantum Key Distribution (BB84) | `KeyDistribution_BB84/` | [[Quantum Cryptography]], [[BB84]] | Protocol, QKD, Exercises |
| Quantum Error Correction | `QEC_BitFlipCode/` | [[Quantum Errors]], [[Bit Flip Code]] | QEC, Syndrome Detection, Exercises |
| Quantum Random Number Generator | `tutorials/RandomNumberGeneration/` | [[Random Number Generation]] | QRNG, Superposition, Code |

---

## 2. Qiskit Repository Source Mapping

| Qiskit Submodule | Local Repository Relative Path | Primary Obsidian Note | Modern API Component |
|---|---|---|---|
| Core Quantum Circuit Class | `qiskit/circuit/quantumcircuit.py` | [[Qiskit Circuits]] | `QuantumCircuit` |
| Standard Gate Library | `qiskit/circuit/library/` | [[Qiskit Circuits]], [[Quantum Gates]] | `HGate`, `CXGate`, `QFT`, `GroverOperator` |
| Primitives Interface | `qiskit/primitives/` | [[Qiskit Primitives]] | `StatevectorSampler`, `StatevectorEstimator` |
| Quantum Information | `qiskit/quantum_info/` | [[Circuit Experiments]], [[Qiskit]] | `Statevector`, `DensityMatrix`, `Operator`, `SparsePauliOp` |
| Transpiler Optimization Passes | `qiskit/transpiler/` | [[Benchmarking]], [[Quantum Circuit Depth]] | `transpile`, `PassManager` |
| Providers & Aer Simulator | `qiskit/providers/` | [[Circuit Experiments]], [[Benchmarking]] | `AerSimulator` |