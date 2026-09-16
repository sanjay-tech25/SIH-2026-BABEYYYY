---
type: roadmap
level: overview
status: completed
tags:
  - roadmap
  - katas
  - curriculum
---
# Learning Roadmap

This learning roadmap synthesizes the **Microsoft Quantum Katas progression** with modern quantum algorithms, hardware error mitigation, and practical Qiskit software development across **12 detailed stages**.

---

## Stage 1 — Mathematical Foundations
- **[[Complex Numbers]]**: Modulus, phase, Euler's identity $e^{i\theta} = \cos\theta + i\sin\theta$.
- **[[Vectors]]**: Dirac bra-ket notation $|\psi\rangle, \langle\psi|$, inner products, Hilbert spaces.
- **[[Matrices]]**: Matrix representations, Hermitian adjoints $A^\dagger$.
- **[[Tensor Products]]**: Kronecker products $\otimes$, composite multi-qubit vector spaces.
- **[[Eigenvalues & Eigenvectors]]**: Spectral decomposition, observables $\langle A \rangle$.
- **[[Probability]]**: Classical probability vs quantum probability amplitudes.
- **[[Unitary Matrices]]**: Norm-preserving operators $U^\dagger U = I$.

---

## Stage 2 — Qubits & Gates
- **[[Qubit]]**: Two-level quantum bit spanned by $|0\rangle$ and $|1
angle$.
- **[[Quantum State]]**: Statevector parameters and global phase invariance.
- **[[Pauli X]]**, **[[Pauli Y]]**, **[[Pauli Z]]**: Fundamental Pauli gate group.
- **[[Hadamard]]**: Equal superposition generator.
- **[[S Gate]]**, **[[T Gate]]**, **[[Phase Gates]]**, **[[Rotation Gates]]**: Single-qubit phase shifts $R_x, R_y, R_z$.
- **[[CNOT]]**, **[[CZ]]**, **[[SWAP]]**, **[[Multi Qubit Gates]]**: Two-qubit entangling gates.
- **[[Controlled Operations]]**, **[[Adjoint Operations]]**: Controlled unitaries $C-U$ and inverse operations $U^\dagger$.
- **[[Superposition]]**: Linear combination of basis states.

---

## Stage 3 — Measurement Progression
- **[[Measurement]]**: Projective measurements and wave function collapse.
- **[[Single Qubit Measurement]]**: Z-basis projection of single qubit state.
- **[[Multi Qubit Measurement]]**: Partial trace and multi-qubit joint measurements.
- **[[Born Rule]]**: Probability calculation $P(x) = |\langle x|\psi\rangle|^2$.
- **[[Parity Measurements]]**: Joint Pauli parity measurements $Z_i Z_j$.

---

## Stage 4 — Quantum Protocols
- **[[Random Number Generation]]**: True hardware quantum random bit generation.
- **[[Quantum Teleportation]]**: Transmitting unknown quantum states using shared entanglement and 2 classical bits.
- **[[Superdense Coding]]**: Transmitting 2 classical bits using 1 qubit over shared Bell state.
- **[[CHSH Game]]**, **[[GHZ Game]]**, **[[Mermin Peres Magic Square]]**: Non-local entanglement games violating Bell inequalities.

---

## Stage 5 — Oracles & Query Algorithms
- **[[Quantum Oracle]]**, **[[Marking Oracle]]**: Boolean function encoding $U_f |x, y\rangle = |x, y \oplus f(x)\rangle$ and phase oracles $O_f |x\rangle = (-1)^{f(x)}|x\rangle$.
- **[[Phase Kickback]]**: Eigenvalue phase kickback mechanism.
- **[[Reversible Computing]]**, **[[Truth Tables]]**, **[[Unitary Operations]]**: Uncomputation and reversible circuit design.
- **[[Deutsch Algorithm]]**: Evaluating 1-bit constant vs balanced function.
- **[[Deutsch-Jozsa Algorithm]]**: Multi-bit constant vs balanced function evaluation in 1 query.
- **[[Bernstein-Vazirani Algorithm]]**: Extracting hidden bit string $s$ in 1 query.
- **[[Simon Algorithm]]**: Finding hidden XOR periodic mask $s$ with exponential query speedup.

---

## Stage 6 — Search Algorithms (Grover)
- **[[Grover Algorithm]]**: Unstructured search in $O(\sqrt{N})$ queries.
- **[[Amplitude Amplification]]**: Generalized operator reflection $Q = -A S_0 A^\dagger S_\chi$.
- Applications: Solving **SAT**, **Graph Coloring**, **Database Search**, and **Knapsack** problems.

---

## Stage 7 — Reversible Arithmetic & Fourier Phase Estimation
- **[[Reversible Computing]]**, **[[Truth Tables]]**, **[[Quantum Arithmetic]]**: Quantum adders (Ripple Carry Adder) and modular exponentiation.
- **[[Quantum Fourier Transform]]**: QFT circuit, inverse QFT (IQFT).
- **[[Quantum Phase Estimation]]**: Estimating unitary eigenphases $U|u\rangle = e^{2\pi i \theta}|u\rangle$.
- **[[Iterative Phase Estimation]]**: Single ancilla qubit phase estimation.
- **[[Period Finding]]**: Order finding $a^r \equiv 1 \pmod N$.
- **[[Quantum Counting]]**: Combining Grover operator with QPE.
- **[[Shor Algorithm]]**: Polynomial-time integer factorization.

---

## Stage 8 — Advanced Algorithms
- **[[Amplitude Estimation]]**: Quadratic Monte Carlo speedup.
- **[[Quantum Walks]]**: Continuous and discrete quantum walks on graphs.
- **[[Quantum Simulation]]**: Trotter-Suzuki Hamiltonian dynamics simulation.
- **[[HHL]]**: Solving linear systems $A x = b$.

---

## Stage 9 — Modern NISQ & Variational Algorithms
*(Modern / Advanced Layer)*
- **[[NISQ]]**: Noisy Intermediate-Scale Quantum constraints.
- **[[VQE]]**: Variational Quantum Eigensolver for molecular ground states.
- **[[QAOA]]**: Quantum Approximate Optimization Algorithm for Max-Cut.

---

## Stage 10 — Quantum Cryptography
- **[[Quantum Cryptography]]**: Quantum key distribution principles and no-cloning theorem.
- **[[BB84]]**: Prepare-and-measure quantum key distribution protocol.
- **[[E91]]**: Entanglement-based Ekert QKD protocol.

---

## Stage 11 — Quantum Error Correction
- **[[Quantum Errors]]**: Bit flips $X$, phase flips $Z$, continuous phase errors.
- **[[Bit Flip Code]]**, **[[Phase Flip Code]]**: 3-qubit repetition codes.
- **[[Shor Code]]**: 9-qubit code correcting arbitrary single-qubit errors.
- **[[Steane Code]]**: 7-qubit CSS code.
- **[[Surface Code]]**: 2D topological surface code.

---

## Stage 12 — Hardware & Implementation
- **[[Quantum Noise]]**, **[[Decoherence]]**, **[[Gate Errors]]**, **[[Readout Errors]]**, **[[Error Mitigation]]**: Noise dynamics and zero-noise extrapolation.
- **[[Python]]**, **[[Qiskit]]**, **[[Qiskit Circuits]]**, **[[Qiskit Primitives]]**, **[[Circuit Experiments]]**, **[[Algorithm Implementations]]**, **[[Benchmarking]]**: Software SDK implementation track.