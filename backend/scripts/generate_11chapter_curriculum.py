"""Script to generate the complete 11-Chapter Curriculum for curriculumData.ts,
directly mapped 1:1 with the 11 domains in Quantum_Vault, with full 3-tier adaptive content,
lab missions, target outcomes, and verified quiz checks.
"""

import os
import json

CHAPTERS_DATA = [
    {
        "id": "ch-1",
        "number": 1,
        "vault_domain": "01 - Mathematics",
        "title": "Chapter 1: Mathematics of Quantum Computing",
        "subtitle": "Linear Algebra, Complex Hilbert Spaces & Tensor Products",
        "summary": "Master the mathematical foundation of quantum mechanics: complex vector spaces, inner products, unitary transformations, and tensor products.",
        "isStart": True,
        "topics": [
            {
                "id": "t1-1",
                "number": "1.1",
                "title": "Complex Numbers, Vectors & Dirac Bra-Ket Notation",
                "summary": "Understand state vectors |ψ⟩ in complex Hilbert space ℂ² and compute inner products ⟨φ|ψ⟩.",
                "minutes": 12,
                "content": {
                    "young": [
                        "Imagine a clock where the hand can not only point to numbers, but can also be stretched, rotated, and flipped using magic numbers called complex numbers!",
                        "In quantum computing, we use special arrows called Dirac kets like |0⟩ and |1⟩ to represent where our quantum particle is pointing."
                    ],
                    "student": [
                        "Quantum states are vectors in a complex Hilbert space ℂ². We denote column vectors as kets |ψ⟩ and their conjugate transpose row vectors as bras ⟨ψ| = (|ψ⟩)†.",
                        "The inner product ⟨φ|ψ⟩ computes the projection overlap amplitude between states, where ⟨ψ|ψ⟩ = 1 enforces normalization."
                    ],
                    "adult": [
                        "Information in quantum systems is represented by unit rays in a complex Hilbert space. The state vector |ψ⟩ = α|0⟩ + β|1⟩ has complex probability amplitudes α, β ∈ ℂ satisfying the normalization constraint |α|² + |β|² = 1.",
                        "Dirac bra-ket notation provides an efficient algebraic framework for spectral decompositions, projective measurements, and density matrix operations."
                    ]
                },
                "mathFormula": "⟨φ|ψ⟩ = ∑ᵢ φᵢ* ψᵢ,   with ⟨ψ|ψ⟩ = 1",
                "mathCaption": "Inner product and normalization condition in complex Hilbert space.",
                "lab": {
                    "id": "lab-1-1",
                    "title": "State Vector Normalization & Inner Product Lab",
                    "objective": "Initialize Qubit 0 into state |0⟩, verify normalization, and inspect measurement projection.",
                    "instructions": [
                        "Qubit 0 starts in default ground state |0⟩ = [1, 0]ᵀ.",
                        "Observe that the inner product ⟨0|0⟩ = 1 (100% probability).",
                        "Run simulation for 1,024 shots to observe deterministic ground state collapse."
                    ],
                    "initialCircuit": [],
                    "targetOutcome": "Measure 100% probability for state |0⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Counts:', counts)"
                },
                "check": {
                    "prompt": "If |ψ⟩ = (3/5)|0⟩ + (4/5)|1⟩, what is the probability of measuring state |1⟩?",
                    "options": [
                        {"id": "o1", "label": "4/5 (80%)"},
                        {"id": "o2", "label": "16/25 (64%)"},
                        {"id": "o3", "label": "9/25 (36%)"},
                        {"id": "o4", "label": "12/25 (48%)"}
                    ],
                    "correctId": "o2",
                    "explanation": "According to the Born Rule, probability is the squared magnitude of amplitude: P(1) = |4/5|² = 16/25 = 0.64 (64%)."
                }
            },
            {
                "id": "t1-2",
                "number": "1.2",
                "title": "Matrices, Unitary Operators & Tensor Products",
                "summary": "Explore how quantum gates act as unitary matrices (U†U = I) and composite systems combine via the Kronecker tensor product (⊗).",
                "minutes": 15,
                "content": {
                    "young": [
                        "When you combine two Lego blocks, you get a bigger structure! In quantum, when we combine two qubits, their mathematical worlds multiply together using the tensor product.",
                        "Every quantum gate is like a rigid rotation that never stretches or breaks the total probability of 100%."
                    ],
                    "student": [
                        "Quantum logic gates are represented by unitary matrices U satisfying U†U = UU† = I. Unitary operators preserve the L2 vector norm, ensuring total probability remains 1.",
                        "When combining multiple registers, the joint Hilbert space is the tensor product ℋ = ℋ_A ⊗ ℋ_B, scaling dimensions as 2ⁿ."
                    ],
                    "adult": [
                        "Quantum dynamics are strictly linear and norm-preserving: d⟨ψ|ψ⟩/dt = 0 implies unitary evolution U = exp(-iHt/ℏ).",
                        "The tensor product A ⊗ B creates an exponentially large 2ⁿ × 2ⁿ state space, allowing quantum parallelism across superposed basis states."
                    ]
                },
                "mathFormula": "U^† U = I,   dim(ℋ_A ⊗ ℋ_B) = 2^n",
                "mathCaption": "Unitary condition preserving inner products and exponential Hilbert dimension.",
                "lab": {
                    "id": "lab-1-2",
                    "title": "Multi-Qubit Tensor Product Sandbox",
                    "objective": "Combine two independent qubits into a 4-dimensional separable register and measure the joint states.",
                    "instructions": [
                        "Create a 2-qubit register in state |00⟩ = |0⟩ ⊗ |0⟩.",
                        "Apply a Hadamard gate to qubit 0 to create (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩+|10⟩)/√2.",
                        "Measure both wires to observe 50% |00⟩ and 50% |10⟩."
                    ],
                    "initialCircuit": ["H"],
                    "targetOutcome": "Measure equal 50/50 split across |00⟩ and |10⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Tensor Product Counts:', counts)"
                },
                "check": {
                    "prompt": "How many complex amplitude dimensions exist in an unconstrained 4-qubit quantum register?",
                    "options": [
                        {"id": "o1", "label": "4 dimensions"},
                        {"id": "o2", "label": "8 dimensions"},
                        {"id": "o3", "label": "16 dimensions (2⁴)"},
                        {"id": "o4", "label": "64 dimensions"}
                    ],
                    "correctId": "o3",
                    "explanation": "Each qubit doubles the state space: dim(ℂ² ⊗ ℂ² ⊗ ℂ² ⊗ ℂ²) = 2⁴ = 16 complex dimensions."
                }
            }
        ]
    },
    {
        "id": "ch-2",
        "number": 2,
        "vault_domain": "02 - Quantum Foundations",
        "title": "Chapter 2: Quantum Foundations & The Qubit",
        "subtitle": "Superposition, Born Rule & The 3D Bloch Sphere",
        "summary": "Transition from discrete classical bits to continuous quantum statevectors, master the superposition principle, and visualize states on the Bloch sphere.",
        "topics": [
            {
                "id": "t2-1",
                "number": "2.1",
                "title": "The Superposition Principle & State Collapse",
                "summary": "Understand how quantum systems exist in linear combinations of states simultaneously until projective measurement.",
                "minutes": 12,
                "content": {
                    "young": [
                        "A regular light switch is either ON or OFF. A quantum dimmer switch can be in a blend of both ON and OFF at the same time!",
                        "When someone looks at the quantum switch, it immediately snaps into either completely ON or completely OFF."
                    ],
                    "student": [
                        "The superposition principle states that any linear combination |ψ⟩ = α|0⟩ + β|1⟩ is a valid quantum state.",
                        "Measurement acts as a non-unitary projection P_i = |i⟩⟨i|, causing irreversible wave-function collapse according to the Born Rule."
                    ],
                    "adult": [
                        "In quantum mechanics, states adhere to the superposition principle of linear wave mechanics. The observable outcome is non-deterministic, governed by spectral projections.",
                        "Measurement fundamentally perturbs the system: post-measurement state |ψ'⟩ = P_m|ψ⟩ / √⟨ψ|P_m|ψ⟩ collapses coherent phase information into classical entropy."
                    ]
                },
                "mathFormula": "P(m) = |⟨m|ψ⟩|^2,   |ψ'⟩ = |m⟩",
                "mathCaption": "Born Rule measurement probability and wave-function collapse.",
                "lab": {
                    "id": "lab-2-1",
                    "title": "Superposition Generator Lab",
                    "objective": "Apply the Hadamard gate to prepare the equal superposition state |+⟩ and observe 50/50 measurement statistics.",
                    "instructions": [
                        "Add a Hadamard (H) gate to wire 0.",
                        "Measure wire 0 with 1,024 shots.",
                        "Verify measurement counts distribute evenly between |0⟩ and |1⟩."
                    ],
                    "initialCircuit": ["H"],
                    "targetOutcome": "Measure equal 50/50 distribution between |0⟩ and |1⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Superposition Counts:', counts)"
                },
                "check": {
                    "prompt": "If a qubit is in state |+⟩ = (|0⟩+|1⟩)/√2 and measured in the Z-basis, what is the probability of obtaining 0?",
                    "options": [
                        {"id": "o1", "label": "0%"},
                        {"id": "o2", "label": "50% (1/2)"},
                        {"id": "o3", "label": "70.7% (1/√2)"},
                        {"id": "o4", "label": "100%"}
                    ],
                    "correctId": "o2",
                    "explanation": "P(0) = |⟨0|+⟩|² = |1/√2|² = 1/2 = 50%."
                }
            },
            {
                "id": "t2-2",
                "number": "2.2",
                "title": "The Bloch Sphere Geometric Representation",
                "summary": "Map arbitrary single-qubit pure states onto the surface of the unit Bloch sphere parameterized by spherical angles (θ, φ).",
                "minutes": 14,
                "content": {
                    "young": [
                        "Imagine the Earth as a globe! The North Pole is |0⟩, the South Pole is |1⟩, and the equator has special states where both poles meet.",
                        "Any single qubit state is like a point on this sphere that you can rotate anywhere!"
                    ],
                    "student": [
                        "Any pure single-qubit state can be written as |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩, where θ ∈ [0, π] is the polar angle and φ ∈ [0, 2π) is the azimuthal relative phase.",
                        "The state vector corresponds to a 3D unit vector r⃗ = (sinθ cosφ, sinθ sinφ, cosθ) on the Bloch sphere."
                    ],
                    "adult": [
                        "The Bloch sphere provides an isomorphic mapping between SU(2)/U(1) projective Hilbert space and SO(3) rotations in ℝ³.",
                        "Global phase e^{iγ} is physically unobservable, leaving two real degrees of freedom (θ, φ) that determine expectation values ⟨σ_x⟩, ⟨σ_y⟩, ⟨σ_z⟩."
                    ]
                },
                "mathFormula": "|ψ⟩ = \\cos(\\theta/2)|0⟩ + e^{i\\phi}\\sin(\\theta/2)|1\\rangle",
                "mathCaption": "Spherical parameterization of single-qubit pure state on the Bloch sphere.",
                "lab": {
                    "id": "lab-2-2",
                    "title": "Bloch Sphere Pole-to-Pole Rotation Lab",
                    "objective": "Rotate a qubit from the North Pole (|0⟩) to the South Pole (|1⟩) using a Pauli-X bit-flip gate.",
                    "instructions": [
                        "Place an X gate on wire 0.",
                        "The state rotates π radians around the X-axis from θ=0 to θ=π.",
                        "Measure wire 0 to confirm 100% collapse into |1⟩."
                    ],
                    "initialCircuit": ["X"],
                    "targetOutcome": "Measure 100% probability for state |1⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.x(0)\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Bit-flip counts:', counts)"
                },
                "check": {
                    "prompt": "Which point on the Bloch sphere corresponds to polar angle θ = π/2 and azimuthal phase φ = 0?",
                    "options": [
                        {"id": "o1", "label": "North Pole |0⟩"},
                        {"id": "o2", "label": "South Pole |1⟩"},
                        {"id": "o3", "label": "Equator state |+⟩ = (|0⟩+|1⟩)/√2"},
                        {"id": "o4", "label": "Equator state |i⟩ = (|0⟩+i|1⟩)/√2"}
                    ],
                    "correctId": "o3",
                    "explanation": "cos(π/4)|0⟩ + e^{i(0)}sin(π/4)|1⟩ = (1/√2)|0⟩ + (1/√2)|1⟩ = |+⟩ on the positive X-axis of the equator."
                }
            }
        ]
    },
    {
        "id": "ch-3",
        "number": 3,
        "vault_domain": "03 - Quantum Gates",
        "title": "Chapter 3: Quantum Gates & Unitary Logic",
        "subtitle": "Pauli Operators, Phase Gates & Controlled Rotations",
        "summary": "Master fundamental quantum gate mechanics: Pauli X, Y, Z, Hadamard, Phase gates (S, T), and multi-qubit Controlled-NOT (CNOT).",
        "topics": [
            {
                "id": "t3-1",
                "number": "3.1",
                "title": "Pauli Operators (X, Y, Z) & Phase Shifting (S, T)",
                "summary": "Analyze single-qubit rotations, understand the difference between bit flips and phase flips, and inspect T gate π/4 rotations.",
                "minutes": 15,
                "content": {
                    "young": [
                        "The X gate flips the qubit like a coin (0 becomes 1). The Z gate is sneaky: it leaves the numbers alone but flips the secret plus-or-minus sign!",
                        "The S and T gates do smaller quarter and eighth turns around the vertical axis."
                    ],
                    "student": [
                        "The Pauli matrices {I, X, Y, Z} form a basis for Hermitian 2×2 matrices. Pauli-X acts as a bit-flip (NOT), Pauli-Z acts as a phase-flip (Z|1⟩ = -|1⟩), and Pauli-Y combines both with complex phase i.",
                        "The Phase gate S = √Z adds a π/2 phase shift, while the T gate T = √S adds a π/4 phase shift, essential for universal quantum computation."
                    ],
                    "adult": [
                        "The Clifford group is generated by {H, S, CNOT}. According to the Gottesman-Knill theorem, Clifford circuits are efficiently simulable classically.",
                        "Adding the non-Clifford T gate achieves universal fault-tolerant quantum computation by enabling arbitrary SU(2) rotations via the Solovay-Kitaev theorem."
                    ]
                },
                "mathFormula": "S = \\begin{bmatrix} 1 & 0 \\\\ 0 & i \\end{bmatrix},   T = \\begin{bmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{bmatrix}",
                "mathCaption": "Clifford Phase gate S and non-Clifford T gate unitary matrices.",
                "lab": {
                    "id": "lab-3-1",
                    "title": "Phase Shifter Interferometer Lab",
                    "objective": "Construct an H-S-S-H Mach-Zehnder circuit to observe destructive interference caused by a π phase shift.",
                    "instructions": [
                        "Place an H gate on wire 0.",
                        "Insert two consecutive S gates (S · S = Z gate).",
                        "Place a closing H gate and measure wire 0.",
                        "Confirm that the phase flip causes destructive cancellation on |0⟩, yielding 100% |1⟩."
                    ],
                    "initialCircuit": ["H", "S", "S", "H"],
                    "targetOutcome": "Measure 100% probability for state |1⟩ via interference",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.s(0)\nqc.s(0)\nqc.h(0)\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('H-S-S-H Interference counts:', counts)"
                },
                "check": {
                    "prompt": "What is the result of squaring the S gate (S · S)?",
                    "options": [
                        {"id": "o1", "label": "Identity gate I"},
                        {"id": "o2", "label": "Pauli-Z gate (diag(1, -1))"},
                        {"id": "o3", "label": "Pauli-X gate"},
                        {"id": "o4", "label": "T gate"}
                    ],
                    "correctId": "o2",
                    "explanation": "diag(1, i) · diag(1, i) = diag(1, i²) = diag(1, -1) = Pauli-Z gate."
                }
            },
            {
                "id": "t3-2",
                "number": "3.2",
                "title": "Controlled Gates (CNOT, CZ, SWAP)",
                "summary": "Master multi-qubit conditional operations where a control qubit's state determines whether a target unitary is applied.",
                "minutes": 16,
                "content": {
                    "young": [
                        "Imagine a robot that only flips switch #2 if switch #1 is turned ON. That is a CNOT gate!",
                        "If switch #1 is OFF (0), nothing happens. If switch #1 is ON (1), switch #2 flips!"
                    ],
                    "student": [
                        "The Controlled-NOT (CNOT or CX) gate operates on two qubits: if control is |1⟩, it applies Pauli-X to target: |c, t⟩ → |c, c ⊕ t⟩.",
                        "The Controlled-Z (CZ) gate is symmetric between wires and applies a -1 phase factor if and only if both qubits are |1⟩: CZ = diag(1, 1, 1, -1)."
                    ],
                    "adult": [
                        "Controlled operations can be synthesized from single-qubit gates and CNOTs using the Barenco decomposition.",
                        "The SWAP gate exchanges quantum states between wires and can be synthesized from three alternating CNOT gates: SWAP = CX_{0,1} CX_{1,0} CX_{0,1}."
                    ]
                },
                "mathFormula": "\\text{CNOT} = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{bmatrix}",
                "mathCaption": "CNOT gate matrix operating in the computational basis {|00⟩, |01⟩, |10⟩, |11⟩}.",
                "lab": {
                    "id": "lab-3-2",
                    "title": "CNOT Reversible Logic Lab",
                    "objective": "Verify conditional bit flipping: prepare state |10⟩ and apply CNOT(0, 1) to produce state |11⟩.",
                    "instructions": [
                        "Apply an X gate to wire 0 (control qubit set to |1⟩).",
                        "Attach a CNOT with control wire 0 and target wire 1.",
                        "Measure both wires to observe 100% collapse into |11⟩."
                    ],
                    "initialCircuit": ["X", "CX"],
                    "targetOutcome": "Measure 100% probability for state |11⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.x(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('CNOT counts:', counts)"
                },
                "check": {
                    "prompt": "If input state is |01⟩ (control=0, target=1) and a CNOT(0, 1) is applied, what is the output state?",
                    "options": [
                        {"id": "o1", "label": "|00⟩"},
                        {"id": "o2", "label": "|01⟩ (unchanged because control is 0)"},
                        {"id": "o3", "label": "|10⟩"},
                        {"id": "o4", "label": "|11⟩"}
                    ],
                    "correctId": "o2",
                    "explanation": "Because the control qubit is in state |0⟩, the target qubit is not modified. Output remains |01⟩."
                }
            }
        ]
    },
    {
        "id": "ch-4",
        "number": 4,
        "vault_domain": "04 - Core Quantum Concepts",
        "title": "Chapter 4: Core Quantum Concepts & Entanglement",
        "subtitle": "Bell States, Phase Kickback & Quantum Oracles",
        "summary": "Synthesize maximally entangled Bell states, understand Einstein-Podolsky-Rosen non-locality, master Phase Kickback, and construct quantum marking oracles.",
        "topics": [
            {
                "id": "t4-1",
                "number": "4.1",
                "title": "Entanglement & The 4 Bell States",
                "summary": "Generate the four canonical maximally entangled Bell states (|Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩) and observe non-local correlations.",
                "minutes": 16,
                "content": {
                    "young": [
                        "Imagine a pair of magic dice: no matter how far apart you take them, rolling a 6 on one instantly makes the other show a 6!",
                        "Albert Einstein called this 'spooky action at a distance', and it is the superpower of quantum computing!"
                    ],
                    "student": [
                        "Entangled states cannot be factored into product states: |ψ_AB⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩.",
                        "The four orthonormal Bell states form a complete basis for ℂ⁴, generated by applying H and CNOT gates with optional Pauli X/Z phase controls."
                    ],
                    "adult": [
                        "Bell states exhibit maximal entanglement entropy (von Neumann entropy S(ρ_A) = 1).",
                        "Local operations and classical communication (LOCC) cannot create entanglement. Bell's theorem proves no local hidden variable theory can reproduce these correlations."
                    ]
                },
                "mathFormula": "|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}},   |\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}}",
                "mathCaption": "The canonical Bell basis states in computational representation.",
                "lab": {
                    "id": "lab-4-1",
                    "title": "Bell State (|Φ⁺⟩) Synthesizer Lab",
                    "objective": "Generate the maximally entangled Bell pair |Φ⁺⟩ using Hadamard and CNOT, verifying 0% leakage into |01⟩/|10⟩.",
                    "instructions": [
                        "Put wire 0 into superposition with an H gate.",
                        "Entangle wire 1 with wire 0 using a CNOT.",
                        "Measure both wires to observe strictly correlated outcomes: 50% |00⟩ and 50% |11⟩."
                    ],
                    "initialCircuit": ["H", "CX"],
                    "targetOutcome": "Measure strictly correlated 50% |00⟩ and 50% |11⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=2000).result().get_counts()\nprint('Bell State Counts:', counts)"
                },
                "check": {
                    "prompt": "Which combination of gates converts ground state |00⟩ into Bell state |Φ⁻⟩ = (|00⟩-|11⟩)/√2?",
                    "options": [
                        {"id": "o1", "label": "H(0) then CNOT(0, 1)"},
                        {"id": "o2", "label": "X(0) then H(0) then CNOT(0, 1)"},
                        {"id": "o3", "label": "H(0) then Z(0) then CNOT(0, 1)"},
                        {"id": "o4", "label": "Both o2 and o3 produce |Φ⁻⟩"}
                    ],
                    "correctId": "o4",
                    "explanation": "Applying Z to control qubit flips the relative phase from + to -, producing (|00⟩-|11⟩)/√2."
                }
            },
            {
                "id": "t4-2",
                "number": "4.2",
                "title": "Phase Kickback & Quantum Oracles",
                "summary": "Master Phase Kickback: how target qubit eigenvalues kick back into control wire phase, powering all oracle algorithms.",
                "minutes": 18,
                "content": {
                    "young": [
                        "Normally, the control qubit tells the target qubit what to do. But in Phase Kickback, the target qubit pushes a minus sign backwards onto the control!",
                        "It is like a trampoline pushing back on the person who jumped on it."
                    ],
                    "student": [
                        "When an operator U acts on target state |u⟩ such that U|u⟩ = e^{iθ}|u⟩, controlled-U leaves the target unchanged while kicking phase e^{iθ} onto the control qubit: |c⟩|u⟩ → e^{i c θ}|c⟩|u⟩.",
                        "Preparing the target in eigenstate |-\\rangle = (|0⟩-|1⟩)/√2 with X gate flips the control phase: CNOT|x⟩|-\\rangle = (-1)ˣ|x⟩|-\\rangle."
                    ],
                    "adult": [
                        "Phase Kickback is the fundamental mechanism underpinning Deutsch-Jozsa, Simon, Shor's Phase Estimation, and Grover's search.",
                        "Marking oracles U_f|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ transform into phase oracles U_f|x⟩|-\\rangle = (-1)^{f(x)}|x⟩|-\\rangle via target state preparation."
                    ]
                },
                "mathFormula": "\\text{CNOT}|x\\rangle|-\\rangle = (-1)^x|x\\rangle|-\\rangle",
                "mathCaption": "Phase Kickback mechanism transferring target eigenvalue to control wire.",
                "lab": {
                    "id": "lab-4-2",
                    "title": "Phase Kickback Demonstration Lab",
                    "objective": "Prepare wire 1 in state |-⟩, apply CNOT(0, 1), and observe the phase shift reflected on wire 0.",
                    "instructions": [
                        "Set control wire 0 into |+⟩ using H(0).",
                        "Set target wire 1 into |-⟩ using X(1) followed by H(1).",
                        "Apply CNOT(0, 1) and inspect how wire 0 transforms from |+⟩ into |-⟩."
                    ],
                    "initialCircuit": ["H", "X", "H", "CX"],
                    "targetOutcome": "Observe Phase Kickback transforming control wire into |-⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 1)\nqc.h(0)     # Control in |+>\nqc.x(1)     # Target to |1>\nqc.h(1)     # Target to |->\nqc.cx(0, 1) # Phase kickback flips wire 0 to |->\nqc.h(0)     # H transforms |-> back to |1>\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Kickback result (100% outcome 1):', counts)"
                },
                "check": {
                    "prompt": "What eigenstate must the target qubit be in to achieve Phase Kickback under a CNOT gate?",
                    "options": [
                        {"id": "o1", "label": "|0⟩"},
                        {"id": "o2", "label": "|1⟩"},
                        {"id": "o3", "label": "|-⟩ = (|0⟩-|1⟩)/√2 (eigenstate of Pauli-X with eigenvalue -1)"},
                        {"id": "o4", "label": "|+⟩"}
                    ],
                    "correctId": "o3",
                    "explanation": "Because X|-⟩ = -|-⟩, the eigenvalue -1 kicks back to the control qubit as a relative phase (-1)ˣ."
                }
            }
        ]
    },
    {
        "id": "ch-5",
        "number": 5,
        "vault_domain": "05 - Quantum Protocols",
        "title": "Chapter 5: Quantum Communication Protocols",
        "subtitle": "Quantum Teleportation, Superdense Coding & Bell Games",
        "summary": "Transfer unknown quantum states using classical bits and entanglement (Teleportation), send 2 classical bits using 1 qubit (Superdense Coding), and test non-locality with CHSH.",
        "topics": [
            {
                "id": "t5-1",
                "number": "5.1",
                "title": "Quantum State Teleportation Protocol",
                "summary": "Transmitting an unknown qubit quantum state without transmitting the physical qubit itself, using a shared Bell pair and 2 classical bits.",
                "minutes": 18,
                "content": {
                    "young": [
                        "Quantum teleportation is not beam-me-up sci-fi for humans, but it DOES beam information!",
                        "Alice has a quantum secret. Using an entangled partner and a phone call with two classical bits, Bob's qubit transforms into Alice's secret!"
                    ],
                    "student": [
                        "Teleportation transfers an arbitrary unknown state |ψ⟩ = α|0⟩ + β|1⟩ from Alice to Bob using an EPR Bell pair and 2 classical bits of communication.",
                        "Alice performs a Bell-basis measurement on her secret qubit and entangled half, then Bob applies conditional corrections Z^{m0} X^{m1} to recover |ψ⟩."
                    ],
                    "adult": [
                        "The protocol does not violate the No-Cloning Theorem because Alice's measurement irreversibly destroys the original quantum state.",
                        "No faster-than-light signaling occurs because Bob cannot recover the state until receiving Alice's two classical measurement bits (bounded by c)."
                    ]
                },
                "mathFormula": "|\\psi\\rangle_{\\text{Bob}} = Z^{m_0} X^{m_1} |\\psi\\rangle_{\\text{recovered}}",
                "mathCaption": "Bob's conditional unitary correction recovering original quantum state.",
                "lab": {
                    "id": "lab-5-1",
                    "title": "3-Qubit Quantum Teleportation Lab",
                    "objective": "Assemble the complete 3-qubit teleportation circuit and transmit state |1⟩ from Alice to Bob.",
                    "instructions": [
                        "Prepare state to teleport on wire 0 (apply X to set |1⟩).",
                        "Create Bell pair between Alice (wire 1) and Bob (wire 2).",
                        "Execute Alice's Bell projection and measure wires 0 and 1."
                    ],
                    "initialCircuit": ["X", "H", "CX", "CX", "H"],
                    "targetOutcome": "Successfully teleport quantum state to wire 2",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/algorithms/teleportation.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(3, 2)\nqc.x(0)  # Teleport state |1>\nqc.h(1); qc.cx(1, 2)  # Bell pair\nqc.cx(0, 1); qc.h(0)  # Alice measurement\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\nprint(qc.draw(output='text'))"
                },
                "check": {
                    "prompt": "How many classical bits must Alice send to Bob to complete quantum teleportation?",
                    "options": [
                        {"id": "o1", "label": "0 bits (instantaneous)"},
                        {"id": "o2", "label": "1 bit"},
                        {"id": "o3", "label": "2 classical bits"},
                        {"id": "o4", "label": "Infinite continuous parameters"}
                    ],
                    "correctId": "o3",
                    "explanation": "Alice measures 2 qubits, producing 2 classical bits (00, 01, 10, or 11) that tell Bob which Pauli correction (I, X, Z, or ZX) to apply."
                }
            },
            {
                "id": "t5-2",
                "number": "5.2",
                "title": "Superdense Coding & The CHSH Game",
                "summary": "Transmit 2 classical bits by sending only 1 physical qubit using prior entanglement, and violate classical Bell inequalities.",
                "minutes": 16,
                "content": {
                    "young": [
                        "Imagine you could pack two letters into a single tiny envelope! Superdense coding lets you transmit two regular bits by mailing only one qubit.",
                        "This only works because Alice and Bob share a secret entangled link before sending the message!"
                    ],
                    "student": [
                        "In Superdense Coding, Alice applies one of {I, X, Z, XZ} to her half of a Bell pair to encode two classical bits (00, 01, 10, 11).",
                        "She transmits her single qubit to Bob, who performs a Bell measurement on both qubits to decode the two classical bits with 100% fidelity."
                    ],
                    "adult": [
                        "Superdense coding is the exact converse of quantum teleportation: 1 ebit + 1 qubit transmission = 2 classical bits capacity.",
                        "The CHSH game proves quantum non-locality: classical strategies achieve winning probability ≤ 75% (Bell inequality ≤ 2), while quantum entangled strategies achieve cos²(π/8) ≈ 85.4% (Tsirelson's bound 2√2)."
                    ]
                },
                "mathFormula": "\\langle CHSH \\rangle_{\\text{quantum}} = 2\\sqrt{2} \\approx 2.828 > 2",
                "mathCaption": "Tsirelson's bound violating classical Bell local realism.",
                "lab": {
                    "id": "lab-5-2",
                    "title": "Superdense Coding Encoder Lab",
                    "objective": "Encode 2 classical bits ('11') into a shared Bell pair and decode both bits on Bob's register.",
                    "instructions": [
                        "Initialize shared Bell pair on wires 0 and 1.",
                        "Alice encodes '11' by applying X and Z gates to wire 0.",
                        "Bob decodes by applying CNOT(0, 1) and H(0), then measuring both wires."
                    ],
                    "initialCircuit": ["H", "CX", "X", "Z", "CX", "H"],
                    "targetOutcome": "Decode 100% probability for classical message '11'",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0); qc.cx(0, 1)  # Shared EPR pair\nqc.x(0); qc.z(0)      # Alice encodes '11'\nqc.cx(0, 1); qc.h(0)  # Bob decodes\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Decoded message counts:', counts)"
                },
                "check": {
                    "prompt": "What is the maximum classical winning probability for the CHSH game vs the quantum entangled bound?",
                    "options": [
                        {"id": "o1", "label": "Classical 50% vs Quantum 100%"},
                        {"id": "o2", "label": "Classical 75% (3/4) vs Quantum ~85.4% (cos²(π/8))"},
                        {"id": "o3", "label": "Classical 90% vs Quantum 95%"},
                        {"id": "o4", "label": "Both achieve exactly 75%"}
                    ],
                    "correctId": "o2",
                    "explanation": "Classical strategies are bounded at 75% by Bell's theorem. Quantum entangled strategies reach Tsirelson's bound of cos²(π/8) ≈ 85.36%."
                }
            }
        ]
    },
    {
        "id": "ch-6",
        "number": 6,
        "vault_domain": "06 - Quantum Algorithms",
        "title": "Chapter 6: Foundational Quantum Algorithms",
        "subtitle": "Deutsch-Jozsa, Bernstein-Vazirani & Grover's Search",
        "summary": "Implement the landmark algorithms demonstrating exponential and quadratic quantum advantage: Deutsch-Jozsa, Bernstein-Vazirani, and Grover's search.",
        "topics": [
            {
                "id": "t6-1",
                "number": "6.1",
                "title": "Deutsch-Jozsa & Bernstein-Vazirani Oracles",
                "summary": "Determine global function properties with a single quantum query: distinguish constant vs balanced functions and discover hidden bitstrings.",
                "minutes": 20,
                "content": {
                    "young": [
                        "Imagine a secret mystery box. A regular computer has to look inside 100 times to check if every coin is identical.",
                        "A quantum computer uses superposition to inspect all coins in ONE single peek!"
                    ],
                    "student": [
                        "The Deutsch-Jozsa algorithm determines if a boolean function f: {0,1}ⁿ → {0,1} is constant (all 0s or all 1s) or balanced (half 0s, half 1s). Classical requires 2ⁿ⁻¹ + 1 queries; quantum requires exactly 1 query.",
                        "Bernstein-Vazirani finds a hidden bitstring s for f(x) = s · x (mod 2) in 1 query versus n classical queries."
                    ],
                    "adult": [
                        "Both algorithms leverage constructive and destructive interference: H^{⊗n} creates equal superposition, the oracle applies phase kickback (-1)^{f(x)}, and final H^{⊗n} concentrates amplitude into state |0...0⟩ if constant or |s⟩ for hidden string.",
                        "These algorithms demonstrate deterministic, exact quantum query complexity separation over classical models."
                    ]
                },
                "mathFormula": "|\\psi_\\text{out}\\rangle = \\frac{1}{2^n}\\sum_x \\sum_y (-1)^{x \\cdot y + f(x)}|y\\rangle",
                "mathCaption": "Hadamard transform interference concentrating amplitude on function property.",
                "lab": {
                    "id": "lab-6-1",
                    "title": "Bernstein-Vazirani Hidden String Lab",
                    "objective": "Discover a hidden 2-bit string ('11') in exactly 1 quantum query using phase kickback.",
                    "instructions": [
                        "Initialize 2 data qubits and 1 ancilla in |-⟩.",
                        "Apply Hadamard to all wires.",
                        "Apply CNOT oracle for hidden string '11'.",
                        "Apply closing Hadamards and measure data wires to reveal '11'."
                    ],
                    "initialCircuit": ["H", "X", "H", "CX", "CX", "H"],
                    "targetOutcome": "Measure hidden bitstring '11' with 100% probability in 1 query",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(3, 2)\nqc.h([0, 1]); qc.x(2); qc.h(2)  # Superposition and ancilla |->\nqc.cx(0, 2); qc.cx(1, 2)         # Oracle for hidden string '11'\nqc.h([0, 1])                     # Interference\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Recovered hidden string:', counts)"
                },
                "check": {
                    "prompt": "How many queries does Bernstein-Vazirani require to find an n-bit hidden string?",
                    "options": [
                        {"id": "o1", "label": "n queries"},
                        {"id": "o2", "label": "2ⁿ queries"},
                        {"id": "o3", "label": "Exactly 1 query"},
                        {"id": "o4", "label": "n/2 queries"}
                    ],
                    "correctId": "o3",
                    "explanation": "Bernstein-Vazirani recovers all n bits of the secret string s in a single quantum query using interference."
                }
            },
            {
                "id": "t6-2",
                "number": "6.2",
                "title": "Grover's Search Algorithm & Amplitude Amplification",
                "summary": "Search unstructured databases of size N with quadratic speedup O(√N) using phase inversion and inversion about the mean.",
                "minutes": 22,
                "content": {
                    "young": [
                        "Looking for a needle in a haystack usually takes forever. Grover's algorithm is like a magical magnet that makes the needle glow brighter and brighter!",
                        "Every round, the wrong answers shrink and the correct answer gets boosted."
                    ],
                    "student": [
                        "Grover's algorithm searches N = 2ⁿ unstructured elements in O(√N) iterations compared to classical O(N).",
                        "Each iteration consists of two steps: (1) Phase Oracle U_w flipping the target amplitude, (2) Grover Diffusion Operator D = 2|s⟩⟨s| - I inverting amplitudes about the average mean."
                    ],
                    "adult": [
                        "Grover's iteration can be visualized as a 2D geometric rotation in the subspace spanned by the target state |w⟩ and uniform superposition |s⟩.",
                        "Each Grover step rotates the statevector by angle 2θ, where sinθ = 1/√N. For N=4 (2 qubits), optimal iteration count R = ⌊(π/4)√N⌋ = 1 yields 100% success."
                    ]
                },
                "mathFormula": "G = (2|s\\rangle\\langle s| - I) U_w,   R \\approx \\frac{\\pi}{4}\\sqrt{N}",
                "mathCaption": "Grover diffusion operator and optimal iteration count.",
                "lab": {
                    "id": "lab-6-2",
                    "title": "2-Qubit Grover Search Lab",
                    "objective": "Implement the complete Grover search algorithm to amplify target item |11⟩ to 100% probability.",
                    "instructions": [
                        "Prepare uniform superposition with H on wires 0 and 1.",
                        "Apply the Phase Oracle: CZ(0, 1) marks |11⟩.",
                        "Apply the Grover Diffusion Operator (H-X-CZ-X-H).",
                        "Measure both wires to observe ~100% counts on |11⟩."
                    ],
                    "initialCircuit": ["H", "CZ", "H", "X", "CZ", "X", "H"],
                    "targetOutcome": "Measure target state |11⟩ with ~100% amplified probability",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/algorithms/06_grover.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h([0, 1])\nqc.cz(0, 1)  # Oracle for |11>\nqc.h([0, 1]); qc.x([0, 1]); qc.cz(0, 1); qc.x([0, 1]); qc.h([0, 1]) # Diffusion\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Grover search output:', counts)"
                },
                "check": {
                    "prompt": "What happens if you run 2 Grover iterations instead of 1 on a 2-qubit register (N=4)?",
                    "options": [
                        {"id": "o1", "label": "Probability stays at 100%"},
                        {"id": "o2", "label": "The state over-rotates past the target, reducing success probability to ~0%"},
                        {"id": "o3", "label": "The circuit crashes"},
                        {"id": "o4", "label": "Speedup doubles to quartic"}
                    ],
                    "correctId": "o2",
                    "explanation": "Grover search is a geometric rotation. Because 1 step reaches 90° (100%), a second step rotates to 180°, canceling the target amplitude."
                }
            }
        ]
    },
    {
        "id": "ch-7",
        "number": 7,
        "vault_domain": "07 - Advanced Algorithms",
        "title": "Chapter 7: Advanced Algorithms & Applications",
        "subtitle": "Quantum Phase Estimation, Shor's Algorithm & VQE",
        "summary": "Explore Quantum Fourier Transform (QFT), Quantum Phase Estimation (QPE), Shor's exponential factoring algorithm, and near-term Variational Quantum Eigensolvers (VQE).",
        "topics": [
            {
                "id": "t7-1",
                "number": "7.1",
                "title": "Quantum Phase Estimation & Shor's Algorithm",
                "summary": "Extract unitary eigenvalues using QFT and reduce exponential integer factorization to polynomial-time period finding.",
                "minutes": 24,
                "content": {
                    "young": [
                        "Classical computers find it super hard to crack huge secret passwords made of multiplied prime numbers.",
                        "Shor's algorithm acts like a quantum musical tuner that listens to the rhythm (period) of math and solves it in minutes!"
                    ],
                    "student": [
                        "Quantum Phase Estimation (QPE) estimates the phase θ in U|u⟩ = e^{2πiθ}|u⟩ using controlled-U rotations and Inverse QFT.",
                        "Shor's algorithm reduces factoring integer N into order-finding r such that a^r ≡ 1 (mod N), providing exponential speedup O((log N)³) over classical RSA cryptography."
                    ],
                    "adult": [
                        "QPE is the subroutine powering HHL for linear systems, quantum chemistry ground states, and period-finding.",
                        "Post-quantum cryptography (lattice-based, code-based) is actively being standardized by NIST to defend against Shor's algorithm running on fault-tolerant hardware."
                    ]
                },
                "mathFormula": "U|u\\rangle = e^{2\\pi i \\theta}|u\\rangle,   \\mathcal{O}((\\log N)^3)",
                "mathCaption": "Eigenvalue phase estimation and Shor's cubic polynomial complexity.",
                "lab": {
                    "id": "lab-7-1",
                    "title": "Quantum Fourier Transform (QFT) 2-Qubit Lab",
                    "objective": "Build a 2-qubit Quantum Fourier Transform circuit using Hadamard and Controlled-Phase rotations.",
                    "instructions": [
                        "Apply H to wire 0.",
                        "Apply Controlled-Phase CPhase(π/2) from wire 1 to wire 0.",
                        "Apply H to wire 1 and insert a final SWAP gate."
                    ],
                    "initialCircuit": ["H", "S", "H"],
                    "targetOutcome": "Synthesize discrete quantum Fourier transform state",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\nimport numpy as np\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cp(np.pi / 2, 1, 0)\nqc.h(1)\nqc.swap(0, 1)\nprint(qc.draw(output='text'))"
                },
                "check": {
                    "prompt": "What classical mathematical problem does Shor's algorithm solve to factor large RSA numbers?",
                    "options": [
                        {"id": "o1", "label": "Traveling Salesperson"},
                        {"id": "o2", "label": "Period finding (order finding of a^r ≡ 1 mod N)"},
                        {"id": "o3", "label": "Graph coloring"},
                        {"id": "o4", "label": "Matrix inversion"}
                    ],
                    "correctId": "o2",
                    "explanation": "Shor's algorithm uses QPE to find the period r of the modular exponential function f(x) = a^x mod N, from which factors gcd(a^{r/2} ± 1, N) are computed classically."
                }
            },
            {
                "id": "t7-2",
                "number": "7.2",
                "title": "Variational Quantum Eigensolver (VQE) & QAOA",
                "summary": "Solve molecular ground state energies and combinatorial optimization problems using hybrid quantum-classical variational loops.",
                "minutes": 22,
                "content": {
                    "young": [
                        "Imagine molding a piece of clay so it fits into the lowest energy valley. A quantum computer twists the shape, and a regular computer helps guide it downhill!",
                        "This helps scientists discover new medicines and batteries."
                    ],
                    "student": [
                        "VQE uses the Rayleigh-Ritz variational principle: ⟨H⟩_θ = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀.",
                        "A quantum processor prepares trial state |ψ(θ)⟩ with parameterized rotations, while a classical optimizer (COBYLA/SPSA) adjusts θ to minimize energy."
                    ],
                    "adult": [
                        "VQE overcomes shallow circuit depth constraints in NISQ devices by offloading optimization to classical coprocessors.",
                        "The Quantum Approximate Optimization Algorithm (QAOA) maps Max-Cut and NP-hard graph problems onto Ising spin Hamiltonians using alternating cost and mixer layers."
                    ]
                },
                "mathFormula": "\\min_\\theta \\langle\\psi(\\theta)|H|\\psi(\\theta)\\rangle = E_0",
                "mathCaption": "Variational principle bounding the ground state energy.",
                "lab": {
                    "id": "lab-7-2",
                    "title": "VQE Parameterized Ansätz Lab",
                    "objective": "Construct a parameterized Ry rotation ansätz and sweep parameter θ from 0 to π to find the energy minimum.",
                    "instructions": [
                        "Construct a 1-qubit circuit with parameterized Ry(θ) gate.",
                        "Bind parameter θ = π to rotate state to |1⟩ (eigenstate of Pauli-Z with energy -1).",
                        "Measure in Z-basis to confirm 100% probability for |1⟩."
                    ],
                    "initialCircuit": ["H"],
                    "targetOutcome": "Measure 100% |1⟩ at bound parameter θ = π",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/algorithms/04_vqe_advanced.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit.circuit import Parameter\nfrom qiskit_aer import AerSimulator\nimport numpy as np\n\ntheta = Parameter('θ')\nqc = QuantumCircuit(1, 1)\nqc.ry(theta, 0)\nqc.measure(0, 0)\n\nsim = AerSimulator()\nbound = qc.assign_parameters({theta: np.pi})\ncounts = sim.run(transpile(bound, sim), shots=1024).result().get_counts()\nprint('VQE ground state counts:', counts)"
                },
                "check": {
                    "prompt": "Why is VQE categorized as a 'hybrid quantum-classical' algorithm?",
                    "options": [
                        {"id": "o1", "label": "It uses classical wires instead of superconducting qubits"},
                        {"id": "o2", "label": "The quantum processor measures expectation values while a classical optimizer updates circuit parameters"},
                        {"id": "o3", "label": "It runs in an internet browser"},
                        {"id": "o4", "label": "It does not use quantum superposition"}
                    ],
                    "correctId": "o2",
                    "explanation": "VQE loops between quantum state preparation/measurement and classical gradient optimization to iteratively converge on E₀."
                }
            }
        ]
    },
    {
        "id": "ch-8",
        "number": 8,
        "vault_domain": "08 - Quantum Cryptography",
        "title": "Chapter 8: Quantum Cryptography & Key Distribution",
        "subtitle": "BB84 Protocol, E91 Entanglement & Quantum Security",
        "summary": "Achieve information-theoretic security using the laws of quantum physics: implement the BB84 single-photon protocol and E91 entanglement-based key exchange.",
        "topics": [
            {
                "id": "t8-1",
                "number": "8.1",
                "title": "The BB84 Protocol & Quantum Key Distribution",
                "summary": "Exchange unbreakable secret encryption keys using non-orthogonal photon polarizations and detect eavesdroppers via quantum collapse.",
                "minutes": 18,
                "content": {
                    "young": [
                        "If a spy tries to peek at a quantum secret letter, the letter magically tears itself up and changes! Alice and Bob will immediately know someone was snooping."
                    ],
                    "student": [
                        "In BB84, Alice encodes bits into random non-orthogonal bases: Computational (Z: {|0⟩,|1⟩}) or Hadamard (X: {|+⟩,|-⟩}).",
                        "Bob measures in random bases. They compare bases over a classical channel, discard mismatches (sifting), and estimate Quantum Bit Error Rate (QBER) to detect eavesdropping."
                    ],
                    "adult": [
                        "Information-theoretic security is guaranteed by the No-Cloning Theorem and Heisenberg uncertainty: an eavesdropper (Eve) attempting intercept-resend introduces an expected 25% error in the sifted key.",
                        "If QBER < 11%, Alice and Bob apply error correction and privacy amplification to extract a perfectly secret one-time pad key."
                    ]
                },
                "mathFormula": "\\text{QBER} = \\frac{E_\\text{error}}{N_\\text{sifted}},   \\text{Eve introduces } \\ge 25\\% \\text{ QBER}",
                "mathCaption": "Quantum Bit Error Rate threshold guaranteeing eavesdropper detection.",
                "lab": {
                    "id": "lab-8-1",
                    "title": "BB84 State Encoder Lab",
                    "objective": "Prepare Alice's qubit in the Hadamard X-basis (|+⟩), simulate transmission, and decode in matching basis.",
                    "instructions": [
                        "Alice sets bit=0 and basis=X by applying an H gate.",
                        "Bob measures in the matching X basis by applying H and measuring.",
                        "Confirm that matching bases yield deterministic outcome 0 with 0% error."
                    ],
                    "initialCircuit": ["H", "H"],
                    "targetOutcome": "Measure 100% correlation in matching measurement basis",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)  # Alice encodes in X-basis\nqc.h(0)  # Bob measures in matching X-basis\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('BB84 matching basis counts (100% 0):', counts)"
                },
                "check": {
                    "prompt": "What happens if an eavesdropper (Eve) measures Alice's photon in the Z-basis when Alice prepared it in the X-basis |+⟩?",
                    "options": [
                        {"id": "o1", "label": "Eve reads the exact state without changing it"},
                        {"id": "o2", "label": "The photon collapses to |0⟩ or |1⟩, destroying the X-basis superposition and creating detectable errors for Bob"},
                        {"id": "o3", "label": "The photon vanishes completely"},
                        {"id": "o4", "label": "Bob's computer turns off"}
                    ],
                    "correctId": "o2",
                    "explanation": "Measuring in the conjugate basis collapses the superposition into an eigenstate, introducing a 25% error rate that exposes Eve."
                }
            },
            {
                "id": "t8-2",
                "number": "8.2",
                "title": "E91 Entanglement-Based Quantum Cryptography",
                "summary": "Implement Ekert's 1991 protocol using entangled photon pairs and test the CHSH Bell inequality to certify privacy without trusting the source.",
                "minutes": 18,
                "content": {
                    "young": [
                        "Instead of Alice sending photons to Bob, a central station shoots entangled twins to both of them. Even if the station is evil, the twins can prove they are pure!"
                    ],
                    "student": [
                        "Artur Ekert's E91 protocol distributes entangled pairs |Φ⁺⟩ to Alice and Bob.",
                        "They measure along rotated angles to test the Bell-CHSH inequality. If CHSH = 2√2, the pairs are purely entangled with zero correlation to any third party (Eve)."
                    ],
                    "adult": [
                        "E91 is the foundation of Device-Independent Quantum Key Distribution (DI-QKD). Security is verified directly from statistical Bell inequality violation without trusting device internals."
                    ]
                },
                "mathFormula": "S = |E(a_1, b_1) - E(a_1, b_2)| + |E(a_2, b_1) + E(a_2, b_2)| = 2\\sqrt{2}",
                "mathCaption": "CHSH inequality violation certifying untrusted quantum channel security.",
                "lab": {
                    "id": "lab-8-2",
                    "title": "E91 Entangled Key Verification Lab",
                    "objective": "Generate shared EPR pairs and verify that Alice and Bob obtain perfectly anti-correlated or correlated secret keys.",
                    "instructions": [
                        "Create Bell pair |Φ⁺⟩ on wires 0 and 1.",
                        "Measure both wires in identical basis.",
                        "Confirm 100% key agreement between Alice and Bob."
                    ],
                    "initialCircuit": ["H", "CX"],
                    "targetOutcome": "Measure 100% correlation across shared EPR channel",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0); qc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('E91 shared key distribution:', counts)"
                },
                "check": {
                    "prompt": "How does E91 detect an eavesdropper attempting to intercept the entangled particles?",
                    "options": [
                        {"id": "o1", "label": "By monitoring internet ping times"},
                        {"id": "o2", "label": "Any eavesdropping destroys entanglement, reducing the CHSH correlation below 2√2 down to ≤ 2"},
                        {"id": "o3", "label": "By reading the serial number on the photon"},
                        {"id": "o4", "label": "Eve is detected by a classical firewall"}
                    ],
                    "correctId": "o2",
                    "explanation": "Entanglement monogamy ensures that if Alice and Bob share maximal entanglement, neither particle can be entangled with Eve. Interception reduces CHSH ≤ 2."
                }
            }
        ]
    },
    {
        "id": "ch-9",
        "number": 9,
        "vault_domain": "09 - Quantum Error Correction",
        "title": "Chapter 9: Quantum Error Correction",
        "subtitle": "Bit-Flip, Phase-Flip, Shor 9-Qubit & Surface Codes",
        "summary": "Protect delicate quantum states against decoherence without measuring the data qubit directly: implement 3-qubit bit-flip, phase-flip, and topological surface codes.",
        "topics": [
            {
                "id": "t9-1",
                "number": "9.1",
                "title": "The 3-Qubit Bit-Flip & Phase-Flip Codes",
                "summary": "Detect and correct single-qubit bit flips (X errors) and phase flips (Z errors) using syndrome extraction ancillas.",
                "minutes": 20,
                "content": {
                    "young": [
                        "Imagine you want to protect a glass vase from dropping. You make 3 identical vases and strap them together! If one gets a scratch, the other two tell you how to fix it."
                    ],
                    "student": [
                        "Quantum Error Correction (QEC) encodes 1 logical qubit into 3 physical qubits: |0_L⟩ = |000⟩, |1_L⟩ = |111⟩.",
                        "Syndrome measurement uses ancilla qubits to measure parity Z_0 Z_1 and Z_1 Z_2 without collapsing the superposed amplitudes α|000⟩ + β|111⟩."
                    ],
                    "adult": [
                        "The 3-qubit bit-flip code protects against Pauli-X errors. Conjugating by Hadamards (H^{⊗3}) converts it into a phase-flip code protecting against Pauli-Z errors.",
                        "Because any quantum error can be expanded in the Pauli basis {I, X, Y, Z}, correcting X and Z errors simultaneously enables correction of all arbitrary continuous errors."
                    ]
                },
                "mathFormula": "|0_L\\rangle = |000\\rangle,   |1_L\\rangle = |111\\rangle,   s_1 = Z_0 Z_1,   s_2 = Z_1 Z_2",
                "mathCaption": "Logical basis encoding and stabilizer syndrome extraction operators.",
                "lab": {
                    "id": "lab-9-1",
                    "title": "3-Qubit Bit-Flip Encoding Lab",
                    "objective": "Encode logical state |1_L⟩ = |111⟩ and verify that single-qubit bit flips can be detected via parity checks.",
                    "instructions": [
                        "Set data qubit 0 to |1⟩ with an X gate.",
                        "Encode into 3 physical qubits using CNOT(0, 1) and CNOT(0, 2).",
                        "Measure all 3 wires to verify 100% collapse into |111⟩."
                    ],
                    "initialCircuit": ["X", "CX", "CX"],
                    "targetOutcome": "Measure 100% |111⟩ for logical state |1_L⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(3, 3)\nqc.x(0)  # Input state |1>\nqc.cx(0, 1); qc.cx(0, 2)  # Encode into |111>\nqc.measure([0, 1, 2], [0, 1, 2])\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Logical qubit encoding counts:', counts)"
                },
                "check": {
                    "prompt": "Why can't we protect qubits simply by making copies (cloning) like classical triple modular redundancy?",
                    "options": [
                        {"id": "o1", "label": "Qubits are too expensive"},
                        {"id": "o2", "label": "The No-Cloning Theorem proves that unknown quantum states cannot be duplicated"},
                        {"id": "o3", "label": "Classical computers forbid copying"},
                        {"id": "o4", "label": "Copied qubits cancel each other out"}
                    ],
                    "correctId": "o2",
                    "explanation": "The No-Cloning Theorem forbids creating an identical copy of an arbitrary unknown quantum state |ψ⟩. QEC instead entangles states across non-local subspaces."
                }
            },
            {
                "id": "t9-2",
                "number": "9.2",
                "title": "The Shor 9-Qubit Code & Surface Codes",
                "summary": "Concatenate bit-flip and phase-flip codes into Shor's 9-qubit code and explore 2D topological surface code lattices.",
                "minutes": 22,
                "content": {
                    "young": [
                        "Imagine a chessboard of qubits. Some squares check for upside-down errors, and other squares check for spin errors!",
                        "Even if noisy wind blows over the board, the chessboard spots and cleans the errors automatically."
                    ],
                    "student": [
                        "The Shor 9-qubit code combines 3-qubit phase flip and bit flip codes: |0_L⟩ = (|000⟩+|111⟩)(|000⟩+|111⟩)(|000⟩+|111⟩)/2√2, correcting any arbitrary single-qubit error.",
                        "Surface codes arrange physical qubits on a 2D square lattice with alternating vertex (X-type) and plaquette (Z-type) stabilizer measurements."
                    ],
                    "adult": [
                        "Surface codes possess the highest fault-tolerance error threshold (~1% per physical gate) among known QEC codes with nearest-neighbor 2D planar connectivity.",
                        "Logical qubits are defined by topological defects or punctures; logical operations are performed via lattice surgery or code deformation."
                    ]
                },
                "mathFormula": "P_\\text{logical} \\propto \\left(\\frac{p}{p_\\text{th}}\\right)^{(d+1)/2},   p_\\text{th} \\approx 1\\%",
                "mathCaption": "Surface code exponential error suppression below physical fault-tolerance threshold.",
                "lab": {
                    "id": "lab-9-2",
                    "title": "Syndrome Parity Measurement Lab",
                    "objective": "Measure two-qubit parity Z_0 Z_1 using an ancilla qubit without collapsing the logical superposition.",
                    "instructions": [
                        "Prepare Bell state on data wires 0 and 1.",
                        "Connect CNOTs from wires 0 and 1 into ancilla wire 2.",
                        "Measure only ancilla wire 2 to extract parity syndrome (even parity = 0)."
                    ],
                    "initialCircuit": ["H", "CX", "CX", "CX"],
                    "targetOutcome": "Extract even parity syndrome 0 on ancilla wire",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(3, 1)\nqc.h(0); qc.cx(0, 1)  # Even parity Bell state\nqc.cx(0, 2); qc.cx(1, 2)  # Syndrome extraction onto wire 2\nqc.measure(2, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Parity syndrome counts (100% even parity 0):', counts)"
                },
                "check": {
                    "prompt": "What is the physical error threshold of 2D surface codes?",
                    "options": [
                        {"id": "o1", "label": "0.0001%"},
                        {"id": "o2", "label": "Approximately 1% physical gate fidelity"},
                        {"id": "o3", "label": "50%"},
                        {"id": "o4", "label": "100%"}
                    ],
                    "correctId": "o2",
                    "explanation": "Surface codes have an exceptionally high fault-tolerance threshold of ~1%, making them the primary architecture pursued by IBM, Google, and Quantinuum."
                }
            }
        ]
    },
    {
        "id": "ch-10",
        "number": 10,
        "vault_domain": "10 - Quantum Computing Hardware",
        "title": "Chapter 10: Quantum Computing Hardware & NISQ Constraints",
        "subtitle": "Decoherence, Noise Channels & Error Mitigation",
        "summary": "Understand physical quantum processors (superconducting transmons, trapped ions), relaxation (T1) and dephasing (T2) times, and Zero-Noise Extrapolation (ZNE).",
        "topics": [
            {
                "id": "t1-10",
                "number": "10.1",
                "title": "NISQ Constraints, Decoherence (T1, T2) & Noise Channels",
                "summary": "Model realistic hardware noise: energy relaxation (T1), dephasing (T2), and depolarizing channels on physical quantum processing units.",
                "minutes": 18,
                "content": {
                    "young": [
                        "Quantum chips are like delicate ice sculptures kept at near absolute-zero cold! Any heat or phone signal can cause them to melt (decohere).",
                        "We have to run our quantum programs before the ice melts!"
                    ],
                    "student": [
                        "In the Noisy Intermediate-Scale Quantum (NISQ) era, processors lack fault-tolerant error correction.",
                        "Two fundamental decoherence timescales limit quantum coherence: T1 (energy relaxation from |1⟩ to |0⟩) and T2 (dephasing loss of relative phase information)."
                    ],
                    "adult": [
                        "A quantum channel is modeled by completely positive trace-preserving (CPTP) maps in Kraus representation: ℰ(ρ) = ∑_k E_k ρ E_k†.",
                        "Depolarizing noise mixes pure state ρ with maximally mixed noise I/2 with probability p, driving statevectors inside the Bloch ball: |r⃗| < 1."
                    ]
                },
                "mathFormula": "T_2^* \\le T_2 \\le 2T_1,   \\mathcal{E}(\\rho) = (1-p)\\rho + \\frac{p}{3}(X\\rho X + Y\\rho Y + Z\\rho Z)",
                "mathCaption": "Decoherence relations and depolarizing noise CPTP map.",
                "lab": {
                    "id": "lab-10-1",
                    "title": "NISQ Depolarizing Noise Simulation Lab",
                    "objective": "Simulate a 5% depolarizing noise channel and observe state degradation and thermal leakage into state |0⟩.",
                    "instructions": [
                        "Apply Pauli-X to prepare target state |1⟩.",
                        "Execute on Qiskit Aer with depolarizing error model p=0.05.",
                        "Inspect thermal leakage shots into state |0⟩ (~5% leakage)."
                    ],
                    "initialCircuit": ["X"],
                    "targetOutcome": "Observe realistic NISQ noise leakage into state |0⟩",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/simulators/2_device_noise_simulation.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\nfrom qiskit_aer.noise import NoiseModel, depolarizing_error\n\nqc = QuantumCircuit(1, 1)\nqc.x(0)\nqc.measure(0, 0)\n\nnm = NoiseModel()\nnm.add_all_qubit_quantum_error(depolarizing_error(0.05, 1), ['x'])\n\nsim = AerSimulator(noise_model=nm)\ncounts = sim.run(transpile(qc, sim), shots=2000).result().get_counts()\nprint('Noisy execution counts (leakage into 0):', counts)"
                },
                "check": {
                    "prompt": "What is the physical relationship between relaxation time T1 and dephasing time T2?",
                    "options": [
                        {"id": "o1", "label": "T2 can be infinite while T1 is 0"},
                        {"id": "o2", "label": "T2 is fundamentally upper-bounded by 2·T1"},
                        {"id": "o3", "label": "T1 is always smaller than T2"},
                        {"id": "o4", "label": "T1 and T2 are completely unrelated"}
                    ],
                    "correctId": "o2",
                    "explanation": "Because energy relaxation (T1) also destroys relative phase, dephasing is bounded: 1/T2 = 1/(2T1) + 1/T_phi, giving T2 ≤ 2·T1."
                }
            },
            {
                "id": "t10-2",
                "number": "10.2",
                "title": "Zero-Noise Extrapolation (ZNE) & Error Mitigation",
                "summary": "Mitigate errors on NISQ devices without ancilla overhead: scale circuit noise intentionally and extrapolate back to zero-noise limit.",
                "minutes": 20,
                "content": {
                    "young": [
                        "If you take a photo with a little grain, and another photo with double grain, you can use math to predict what a photo with ZERO grain would look like!"
                    ],
                    "student": [
                        "Zero-Noise Extrapolation (ZNE) scales noise by stretching gate durations or inserting identity unitary pairs (e.g. U → U U† U).",
                        "Observables are measured at noise scale factors λ = {1, 3, 5}, then fit with polynomial or exponential curves to extrapolate E(λ → 0)."
                    ],
                    "adult": [
                        "Quantum Error Mitigation (QEM) differs from QEC: it does not correct individual states in real time, but rather recovers unbiased expectation values ⟨O⟩.",
                        "Other techniques include Readout Error Mitigation (M3 matrix inversion), Probabilistic Error Cancellation (PEC), and Clifford Data Regression (CDR)."
                    ]
                },
                "mathFormula": "\\langle O \\rangle_\\text{mitigated} = \\lim_{\\lambda \\to 0} f(\\lambda; \\{E(\\lambda_i)\\})",
                "mathCaption": "Zero-Noise Extrapolation limit estimating noiseless expectation value.",
                "lab": {
                    "id": "lab-10-2",
                    "title": "Gate-Level Noise Scaling Lab",
                    "objective": "Apply unitary folding (U U† U) to scale circuit depth and measure noise sensitivity.",
                    "instructions": [
                        "Create circuit with H gate.",
                        "Fold the gate by inserting H · H · H (algebraically identical to single H).",
                        "Compare noisy execution fidelity between scale factor λ=1 and λ=3."
                    ],
                    "initialCircuit": ["H", "H", "H"],
                    "targetOutcome": "Observe folded circuit behavior under noise simulation",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/simulators/2_device_noise_simulation.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1, 1)\nqc.h(0); qc.h(0); qc.h(0)  # Folded gate: 3x noise depth\nqc.measure(0, 0)\n\nsim = AerSimulator()\ncounts = sim.run(transpile(qc, sim), shots=1024).result().get_counts()\nprint('Folded circuit measurement counts:', counts)"
                },
                "check": {
                    "prompt": "How does Zero-Noise Extrapolation (ZNE) achieve error mitigation without extra physical qubits?",
                    "options": [
                        {"id": "o1", "label": "It cools the hardware down to 0 Kelvin"},
                        {"id": "o2", "label": "It measures at artificially amplified noise levels and extrapolates backward to zero noise"},
                        {"id": "o3", "label": "It deletes noisy shots"},
                        {"id": "o4", "label": "It guesses the answer"}
                    ],
                    "correctId": "o2",
                    "explanation": "ZNE measures expectation values across scaled noise factors (λ = 1, 3, 5) and uses curve fitting to extrapolate to the zero-noise limit λ = 0."
                }
            }
        ]
    },
    {
        "id": "ch-11",
        "number": 11,
        "vault_domain": "11 - Implementation",
        "title": "Chapter 11: Practical Quantum Programming with Qiskit 1.0+",
        "subtitle": "Transpiler Passes, Primitives (Sampler, Estimator) & Real Hardware",
        "summary": "Master modern Qiskit 1.0+ production workflows: Transpiler PassManagers, ISA circuit optimization, execution on IBM Quantum hardware via SamplerV2 and EstimatorV2.",
        "isEnd": True,
        "topics": [
            {
                "id": "t11-1",
                "number": "11.1",
                "title": "Qiskit 1.0 Architecture & Transpiler Optimization",
                "summary": "Deconstruct high-level quantum circuits into hardware basis gates using PassManagers and layout routing algorithms.",
                "minutes": 20,
                "content": {
                    "young": [
                        "High-level code is like writing in English. The transpiler is a super translator that converts your words into the exact language the quantum microchip understands!"
                    ],
                    "student": [
                        "In Qiskit 1.0+, circuits must be transformed into Instruction Set Architecture (ISA) circuits targeting physical hardware basis gates (e.g. {ECR, RZ, SX, X}).",
                        "The Transpiler optimizes circuit depth via 4 optimization levels (0=none, 1=light, 2=medium, 3=heavy) and routes multi-qubit gates using Sabre routing."
                    ],
                    "adult": [
                        "The Qiskit 1.0 standalone C++ core (`qiskit._accelerate`) delivers 10x-50x speedups in transpilation, routing, and synthesis passes.",
                        "Coupling maps, gate durations, and calibration metrics guide greedy layout and commutation analysis to minimize two-qubit gate counts."
                    ]
                },
                "mathFormula": "\\text{transpile}(qc, \\text{optimization\\_level}=3, \\text{basis\\_gates}=['ecr','rz','sx','x'])",
                "mathCaption": "Qiskit 1.0 ISA circuit compilation targeting physical basis gates.",
                "lab": {
                    "id": "lab-11-1",
                    "title": "Transpiler Optimization Level Benchmarking Lab",
                    "objective": "Transpile a multi-gate circuit across optimization levels 0 and 3, and benchmark the reduction in circuit depth and CNOT count.",
                    "instructions": [
                        "Construct a circuit with redundant gate sequences (e.g. H-H cancellation).",
                        "Transpile with `optimization_level=0` and record gate count.",
                        "Transpile with `optimization_level=3` and observe automatic gate cancellation."
                    ],
                    "initialCircuit": ["H", "H", "X", "X"],
                    "targetOutcome": "Observe Transpiler canceling redundant gate pairs into empty wire",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(1)\nqc.h(0); qc.h(0); qc.x(0); qc.x(0)  # Redundant identity sequence\n\nsim = AerSimulator()\nopt0 = transpile(qc, sim, optimization_level=0)\nopt3 = transpile(qc, sim, optimization_level=3)\n\nprint('Level 0 depth:', opt0.depth(), 'gates:', len(opt0))\nprint('Level 3 depth:', opt3.depth(), 'gates:', len(opt3))"
                },
                "check": {
                    "prompt": "What does Qiskit transpiler optimization level 3 perform on consecutive identical self-inverse gates (like H · H)?",
                    "options": [
                        {"id": "o1", "label": "It doubles them"},
                        {"id": "o2", "label": "It simplifies them to the identity operator, completely removing them from the physical circuit"},
                        {"id": "o3", "label": "It converts them to measurements"},
                        {"id": "o4", "label": "It halts with an error"}
                    ],
                    "correctId": "o2",
                    "explanation": "Because H² = I, optimization level 3 detects inverse unitary cancellations and eliminates redundant gates, decreasing circuit depth."
                }
            },
            {
                "id": "t11-2",
                "number": "11.2",
                "title": "Quantum Runtime Primitives: SamplerV2 & EstimatorV2",
                "summary": "Execute production quantum workloads using modern Qiskit Runtime Primitives: sample quasi-distributions and evaluate expectation values.",
                "minutes": 22,
                "content": {
                    "young": [
                        "Think of Sampler like taking a survey to see who voted for what, and Estimator like finding the exact temperature of a quantum chemical reaction!"
                    ],
                    "student": [
                        "Qiskit 1.0 organizes execution into two fundamental Primitive abstractions:",
                        "1. **SamplerV2**: Computes probability bitstring distributions from quantum measurements.",
                        "2. **EstimatorV2**: Computes expectation values ⟨ψ|O|ψ⟩ of Hermitian observable operators O (used in VQE and chemistry)."
                    ],
                    "adult": [
                        "Primitives decouple algorithm logic from low-level execution targets, automatically bundling readout error mitigation (TREX), dynamical decoupling, and ZNE.",
                        "Pubs (Primitive Unified Blocs) allow batching parameter vectors and circuits efficiently across quantum runtime sessions."
                    ]
                },
                "mathFormula": "\\text{EstimatorV2}: \\langle O \\rangle = \\text{Tr}(\\rho O),   \\text{SamplerV2}: P(x) = |\\langle x|\\psi\\rangle|^2",
                "mathCaption": "Mathematical definitions of Qiskit Runtime Primitives Estimator and Sampler.",
                "lab": {
                    "id": "lab-11-2",
                    "title": "Runtime Sampler Primitive Simulation Lab",
                    "objective": "Execute a Bell state circuit using Qiskit Aer's Sampler primitive and extract quasi-probability distributions.",
                    "instructions": [
                        "Construct a Bell state circuit.",
                        "Run using AerSimulator backend with 1,024 shots.",
                        "Verify that measured bitstrings '00' and '11' yield ~0.50 quasi-probabilities."
                    ],
                    "initialCircuit": ["H", "CX"],
                    "targetOutcome": "Extract quasi-probability distribution via Sampler",
                    "colabUrl": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
                    "pythonSnippet": "from qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(2, 2)\nqc.h(0); qc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\njob = sim.run(transpile(qc, sim), shots=1024)\ncounts = job.result().get_counts()\nprint('Runtime Sampler output:', counts)"
                },
                "check": {
                    "prompt": "When should an algorithm use EstimatorV2 instead of SamplerV2?",
                    "options": [
                        {"id": "o1", "label": "When measuring classical bits"},
                        {"id": "o2", "label": "When computing energy expectation values ⟨ψ|H|ψ⟩ of observables (like molecular Hamiltonians in VQE)"},
                        {"id": "o3", "label": "When turning off the simulator"},
                        {"id": "o4", "label": "EstimatorV2 is only for classical machine learning"}
                    ],
                    "correctId": "o2",
                    "explanation": "EstimatorV2 calculates expectation values of observable operators ⟨O⟩, making it the primitive of choice for VQE and QAOA."
                }
            }
        ]
    }
]

GITHUB_REPO = "sanjay-tech25/SIH-2026-BABEYYYY"
GITHUB_BRANCH = "main"

for _ch in CHAPTERS_DATA:
    for _top in _ch["topics"]:
        _top["lab"]["colabUrl"] = f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/{_top['lab']['id']}_{_top['id']}.ipynb"

def generate_typescript():
    ts_code = [
        "// Auto-generated complete 11-Chapter Curriculum Dataset for QUBOT",
        "// Directly mapped 1:1 with the 11 Domains of the Quantum Knowledge Base (Quantum_Vault)",
        "// Provides full 3-tier age-adaptive content, lab missions, and interactive Colab notebooks",
        "",
        "export interface LabMission {",
        "  id: string;",
        "  title: string;",
        "  objective: string;",
        "  instructions: string[];",
        "  initialCircuit: string[];",
        "  targetOutcome: string;",
        "  colabUrl: string;",
        "  pythonSnippet: string;",
        "}",
        "",
        "export interface TopicCheck {",
        "  prompt: string;",
        "  options: { id: string; label: string }[];",
        "  correctId: string;",
        "  explanation: string;",
        "}",
        "",
        "export interface Topic {",
        "  id: string;",
        "  number: string;",
        "  title: string;",
        "  summary: string;",
        "  minutes: number;",
        "  content: {",
        "    young: string[];",
        "    student: string[];",
        "    adult: string[];",
        "  };",
        "  mathFormula?: string;",
        "  mathCaption?: string;",
        "  lab: LabMission;",
        "  check: TopicCheck;",
        "}",
        "",
        "export interface Chapter {",
        "  id: string;",
        "  number: number;",
        "  vault_domain: string;",
        "  title: string;",
        "  subtitle: string;",
        "  summary: string;",
        "  isStart?: boolean;",
        "  isEnd?: boolean;",
        "  topics: Topic[];",
        "}",
        "",
        "export const CURRICULUM: Chapter[] = " + json.dumps(CHAPTERS_DATA, indent=2) + ";",
        ""
    ]
    return "\n".join(ts_code)

def main():
    ts_file = "d:/sih2026/frontend/src/data/curriculumData.ts"
    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(generate_typescript())
    print(f"Successfully wrote complete 11-Chapter Curriculum to {ts_file}")

if __name__ == "__main__":
    main()
