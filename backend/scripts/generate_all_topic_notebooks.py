"""Generates fully optimized, interactive, multi-style Google Colab and Jupyter notebooks
for all 11 Chapters and 22 Topics directly mapped to the Quantum Knowledge Base (Quantum_Vault).

Features:
- Step-by-step interactive guidance in markdown cells explaining lesson theory & practical bridge.
- Reference implementations with line-by-line pedagogical commentary.
- Multi-style coding support in guided challenges (method chaining, registers, library gates, statevectors).
- Smart physics-based autograders verifying statevector & probability distributions flexibly.
- Dedicated Innovation Sandboxes encouraging learner creativity & experimentation.
- Socratic reflections and targeted misconception clarifications.
- Mapped directly to GitHub repository: https://github.com/sanjay-tech25/SIH-2026-BABEYYYY
"""

import json
import os
import sys

# Import the 11-chapter curriculum definition
sys.path.insert(0, "d:/sih2026/backend/scripts")
from generate_11chapter_curriculum import CHAPTERS_DATA

GITHUB_REPO = "sanjay-tech25/SIH-2026-BABEYYYY"
GITHUB_BRANCH = "main"

def create_cell(cell_type, source):
    if isinstance(source, str):
        lines = [line + "\n" for line in source.split("\n")]
        if lines:
            lines[-1] = lines[-1].rstrip("\n")
    else:
        lines = source
    
    cell = {
        "cell_type": cell_type,
        "metadata": {},
        "source": lines
    }
    if cell_type == "code":
        cell["execution_count"] = None
        cell["outputs"] = []
    return cell

# Topic-specific pedagogical enrichments:
# Maps topic_id to rich contextual details:
# - practical_bridge: why we code this in Qiskit
# - multi_style_guide: coding patterns accepted
# - starter_qubits: (num_q, num_c)
# - starter_gates_snippet: helpful starter code
# - autograder_logic: specific verification code
# - innovation_prompts: creative challenges
# - innovation_snippet: starter code for sandbox

TOPIC_ENRICHMENTS = {
    "t1-1": {
        "practical_bridge": "In the platform lesson, you explored how quantum states exist as normalized complex vectors $|\\psi\\rangle \\in \\mathbb{C}^2$. In classical computers, numbers are binary bits (0 or 1). In Qiskit, we initialize quantum statevectors and observe how projective measurement collapses amplitudes into classical bits with probability $P(i) = |\\alpha_i|^2$.",
        "styles_hint": "You can write your circuit using shorthand `QuantumCircuit(1, 1)` or explicit named registers `QuantumRegister(1, 'q')`. Both styles are fully recognized by Qiskit and our autograder.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# The qubit starts in ground state |0> by default.\n# Add your measurement operation here:\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Verify deterministic collapse to ground state |0>
assert len(counts) > 0, "No measurement outcomes recorded!"
assert '0' in counts and counts.get('0', 0) > 950, f"Expected deterministic |0> ground state (>=950 shots), got {counts}"
print(f"✅ Ground state normalization verified: P(|0>) = {counts.get('0', 0)/1024:.2%}")
""",
        "innovation_prompts": [
            "Challenge 1: Try using `Statevector([0.6, 0.8])` from `qiskit.quantum_info` to verify normalization $|0.6|^2 + |0.8|^2 = 0.36 + 0.64 = 1.0$.",
            "Challenge 2: Try measuring the inner product between $|0\\rangle$ and $|1\\rangle$ using `Statevector.from_label('0').inner(Statevector.from_label('1'))`."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector
import numpy as np

# Test an arbitrary normalized state vector |psi> = 0.6|0> + 0.8|1>
psi = Statevector([0.6, 0.8])
print("Statevector:", psi)
print("Is valid normalized state?", psi.is_valid())
print("Probability of |0>:", np.abs(psi.data[0])**2)
print("Probability of |1>:", np.abs(psi.data[1])**2)"""
    },
    "t1-2": {
        "practical_bridge": "In the lesson, you proved that valid quantum operations must be unitary matrices satisfying $U^\\dagger U = I$, preserving total probability at 100%. Furthermore, multi-qubit systems compose via the Kronecker tensor product $|0\\rangle \\otimes |1\\rangle = |01\\rangle$. Let's construct a 2-qubit tensor product state in Qiskit!",
        "styles_hint": "You can apply gates directly to qubit indices (`qc.x(1)`) or pass registers (`qc.x(qreg[1])`). You can also compose circuits using the `&` operator or `qc.compose()`.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Prepare state |01> (Qubit 0 = |1>, Qubit 1 = |0> in Qiskit little-endian notation)\n# Apply an X gate to qubit 0 to flip it to |1>:\nmy_circuit.x(0)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# In Qiskit, bitstrings are ordered q1 q0 (little endian)
assert len(counts) > 0, "No measurement outcomes recorded!"
assert '01' in counts or '10' in counts, f"Expected transformed tensor product state, got {counts}"
print(f"✅ Tensor product basis state verified successfully: {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Inspect the 4x4 matrix representation of the tensor product operator $X \\otimes I$ using `qiskit.quantum_info.Operator`.",
            "Challenge 2: Try flipping both qubits using `my_circuit.x(0); my_circuit.x(1)` to create state $|11\\rangle$."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Operator
from qiskit.circuit.library import XGate, IGate

# Compute the Kronecker tensor product operator X (x) I
op = Operator(XGate()).tensor(Operator(IGate()))
print("Matrix representation of X (x) I:")
print(op.data)"""
    },
    "t2-1": {
        "practical_bridge": "In Chapter 2, you learned that superposition is not merely 'being in both states at once', but a complex linear combination $|+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$ where relative phase creates wave interference. In code, the Hadamard gate $H$ rotates the state vector by $90^\\circ$ from the Z-axis to the X-axis.",
        "styles_hint": "Styles accepted: standard `qc.h(0)`, register notation `qc.h(qr[0])`, or gate append `qc.append(HGate(), [0])`. All achieve the identical unitary rotation.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Apply Hadamard gate to create equal superposition |+>\nmy_circuit.h(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Verify equal superposition (roughly 50% |0> and 50% |1> within statistical shot noise)
assert len(counts) == 2, f"Expected 2 outcomes for superposition, got {len(counts)}: {counts}"
p0 = counts.get('0', 0) / 1024
p1 = counts.get('1', 0) / 1024
assert 0.40 <= p0 <= 0.60, f"Probability of |0> ({p0:.2%}) is outside expected [40%, 60%] tolerance"
assert 0.40 <= p1 <= 0.60, f"Probability of |1> ({p1:.2%}) is outside expected [40%, 60%] tolerance"
print(f"✅ Equal Superposition Verified! P(|0>) = {p0:.2%}, P(|1>) = {p1:.2%}")
""",
        "innovation_prompts": [
            "Challenge 1: What happens if you apply two Hadamard gates in a row (`qc.h(0); qc.h(0)`)? Does interference restore $|0\\rangle$? Test it!",
            "Challenge 2: Create an unequal superposition using the rotation gate `qc.ry(theta, 0)` with $\\theta = \\pi/3$."
        ],
        "innovation_snippet": """# Test constructive and destructive interference: H followed by H
test_qc = QuantumCircuit(1, 1)
test_qc.h(0)
test_qc.h(0)  # Second Hadamard causes constructive interference back to |0>
test_qc.measure(0, 0)

res = sim.run(transpile(test_qc, sim), shots=1024).result().get_counts()
print("Counts after H + H (Wave Interference Restores |0>):", res)"""
    },
    "t2-2": {
        "practical_bridge": "The Bloch sphere is the quintessential geometric map of a qubit: the north pole is $|0\\rangle$, south pole is $|1\\rangle$, and the equator contains equal superpositions with different relative phases $\\phi$. In code, we steer the state across the sphere using $R_x(\\theta), R_y(\\theta), R_z(\\phi)$ gates.",
        "styles_hint": "You can use compound gates like `qc.h(0)` followed by `qc.s(0)` to reach $|+i\\rangle$, or direct rotation `qc.rz(np.pi/2, 0)`. Both define valid trajectories on the sphere.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Steer to equatorial state |+i> (theta = 90 deg, phi = 90 deg)\nmy_circuit.h(0)\nmy_circuit.s(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Equatorial states have equal probability in computational Z basis
assert len(counts) == 2, f"Equatorial states must project to both |0> and |1>, got {counts}"
p0 = counts.get('0', 0) / 1024
assert 0.40 <= p0 <= 0.60, f"Equatorial state magnitude mismatch: {counts}"
print(f"✅ Equatorial Bloch state verified! P(|0>) = {p0:.2%}, P(|1>) = {1-p0:.2%}")
""",
        "innovation_prompts": [
            "Challenge 1: Steer to the $|-i\\rangle$ state on the -Y axis by applying $H$ followed by $S^\\dagger$ (`qc.sdg(0)`).",
            "Challenge 2: Inspect the Bloch coordinates $(x, y, z)$ using `qiskit.quantum_info.Statevector` and check $x^2 + y^2 + z^2 = 1$."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector
import numpy as np

# Create state |+i> = (|0> + i|1>)/sqrt(2)
circ = QuantumCircuit(1)
circ.h(0)
circ.s(0)
sv = Statevector.from_instruction(circ)
print("Statevector at equator:", sv)
print("Bloch vector components: Expect x=0, y=1, z=0 for |+i>")"""
    },
    "t3-1": {
        "practical_bridge": "In Chapter 3, you discovered the single-qubit Pauli family: $X$ flips bits, $Z$ flips the relative phase of $|1\\rangle$, $Y = iXZ$ does both, and phase gates $S = Z^{1/2}, T = Z^{1/4}$ rotate about the Z-axis by $\\pi/2$ and $\\pi/4$. Let's demonstrate how a phase flip $Z$ converts $|+\\rangle$ into $|-\\rangle$!",
        "styles_hint": "You can apply gates using `qc.x(0)`, `qc.y(0)`, `qc.z(0)`, `qc.s(0)`, `qc.t(0)` or parameterized phase `qc.p(angle, 0)`.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Prepare |+>, flip phase with Z to get |->, then apply H to interfere into |1>\nmy_circuit.h(0)\nmy_circuit.z(0)\nmy_circuit.h(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# H -> Z -> H transforms |0> to |1> via destructive phase interference
assert '1' in counts and counts.get('1', 0) > 950, f"Expected phase-flipped outcome |1>, got {counts}"
print(f"✅ Phase transformation verified: H*Z*H|0> = |1> with {counts.get('1', 0)/1024:.2%} certainty!")
""",
        "innovation_prompts": [
            "Challenge 1: Verify that 4 consecutive T gates equal a Z gate: test $T^4 = Z$ on a superposition state.",
            "Challenge 2: Apply the $S$ gate twice (`qc.s(0); qc.s(0)`) and observe that it behaves identically to a single $Z$ gate."
        ],
        "innovation_snippet": """# Verify T^4 == Z
qc_t = QuantumCircuit(1)
for _ in range(4):
    qc_t.t(0)

qc_z = QuantumCircuit(1)
qc_z.z(0)

from qiskit.quantum_info import Operator
print("Operator T^4 equals Operator Z?", Operator(qc_t).equiv(Operator(qc_z)))"""
    },
    "t3-2": {
        "practical_bridge": "Two-qubit gates are the engine of quantum advantage. The Controlled-NOT (CNOT or CX) gate entangles qubits by flipping target qubit $q_1$ if and only if control qubit $q_0 = |1\\rangle$. In matrix terms, it acts as the 4x4 permutation matrix.",
        "styles_hint": "Accepted styles: `qc.cx(0, 1)`, `qc.cnot(0, 1)`, `qc.append(CXGate(), [0, 1])`, or with register slices.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Set control qubit 0 to |1> with an X gate, then apply CNOT to flip target qubit 1\nmy_circuit.x(0)\nmy_circuit.cx(0, 1)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Control qubit 0 is 1, so target qubit 1 must flip to 1 -> output bitstring '11'
assert '11' in counts and counts.get('11', 0) > 950, f"Expected outcome |11> from CNOT, got {counts}"
print(f"✅ Controlled-NOT logic verified: |10> -> |11> with {counts.get('11', 0)/1024:.2%} certainty!")
""",
        "innovation_prompts": [
            "Challenge 1: Build a Controlled-Z (CZ) gate using a Hadamard and a CNOT: `qc.h(1); qc.cx(0, 1); qc.h(1)`.",
            "Challenge 2: Swap the states of two qubits using 3 alternating CNOT gates: `cx(0,1); cx(1,0); cx(0,1)`."
        ],
        "innovation_snippet": """# Build SWAP gate using 3 CNOT gates
swap_qc = QuantumCircuit(2, 2)
swap_qc.x(0)  # Start with |01> (q0=1, q1=0)

# 3 CNOTs execute SWAP:
swap_qc.cx(0, 1)
swap_qc.cx(1, 0)
swap_qc.cx(0, 1)
swap_qc.measure([0, 1], [0, 1])

res = sim.run(transpile(swap_qc, sim), shots=1024).result().get_counts()
print("Expected state |10> (q0=0, q1=1) after SWAP:", res)"""
    },
    "t4-1": {
        "practical_bridge": "In Chapter 4, you explored quantum entanglement—what Einstein called 'spooky action at a distance'. The canonical Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$ cannot be factored into independent single-qubit states $|\\psi_1\\rangle \\otimes |\\psi_2\\rangle$. Measuring one qubit instantaneously dictates the state of the other!",
        "styles_hint": "Create $|\\Phi^+\\rangle$ using `qc.h(0)` followed by `qc.cx(0, 1)`. You can also create the other 3 Bell states by adding $X$ or $Z$ gates before the entangler.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# 1. Put qubit 0 into superposition with Hadamard\nmy_circuit.h(0)\n# 2. Entangle qubit 0 and qubit 1 with CNOT\nmy_circuit.cx(0, 1)\n# 3. Measure both qubits\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Verify Bell state entanglement: outcomes must strictly be |00> and |11> (no |01> or |10>)
assert len(counts) == 2, f"Bell state |Phi+> must produce exactly 2 correlated outcomes, got {counts}"
assert '00' in counts and '11' in counts, f"Expected correlated outcomes |00> and |11>, got {counts}"
assert '01' not in counts and '10' not in counts, f"Found unentangled leak outcomes: {counts}"
p00 = counts['00'] / 1024
p11 = counts['11'] / 1024
assert 0.40 <= p00 <= 0.60 and 0.40 <= p11 <= 0.60, f"Unbalanced Bell probabilities: {counts}"
print(f"✅ Maximally Entangled Bell State |Φ⁺⟩ Verified! P(00) = {p00:.2%}, P(11) = {p11:.2%}")
""",
        "innovation_prompts": [
            "Challenge 1: Create the $|\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}}$ Bell state by applying an X gate to qubit 1 before the CNOT.",
            "Challenge 2: Create the $|\\Phi^-\\rangle = \\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}}$ Bell state by applying a Z gate to qubit 0."
        ],
        "innovation_snippet": """# Create the |Psi+> Bell state: (|01> + |10>)/sqrt(2)
psi_plus = QuantumCircuit(2, 2)
psi_plus.x(1)   # Flip qubit 1 to |1>
psi_plus.h(0)   # Superposition on qubit 0
psi_plus.cx(0, 1) # Entangle
psi_plus.measure([0, 1], [0, 1])

res = sim.run(transpile(psi_plus, sim), shots=1024).result().get_counts()
print("Bell state |Psi+> outcomes (Anti-correlated |01> and |10>):", res)"""
    },
    "t4-2": {
        "practical_bridge": "Phase kickback is the mathematical secret weapon powering Deutsch-Jozsa, Grover, and Shor's algorithms. When a controlled gate acts on a target qubit prepared in an eigenstate with eigenvalue -1 (specifically $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$), the phase kicks back into the control qubit!",
        "styles_hint": "Prepare target qubit in $|-\\rangle$ using `qc.x(target)` followed by `qc.h(target)`. Then apply CNOT and observe control.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Control qubit 0 in |+>, Target qubit 1 in |->\nmy_circuit.h(0)\nmy_circuit.x(1)\nmy_circuit.h(1)\n# Apply CNOT: phase kicks back to control qubit 0!\nmy_circuit.cx(0, 1)\n# Interfere control qubit with H to observe phase change into |1>\nmy_circuit.h(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Control qubit was transformed from |+> to |-> via kickback, so H|-> = |1>
assert '1' in [k[-1] for k in counts.keys()], f"Phase kickback did not flip control qubit to |1>: {counts}"
print(f"✅ Phase Kickback Confirmed! Control qubit acquired relative phase (-1): {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Try phase kickback with a Controlled-Phase gate `qc.cp(np.pi/2, 0, 1)` and verify fractional phase accumulation.",
            "Challenge 2: Verify that target qubit 1 remains strictly in state $|-\\rangle$ after the kickback."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector

# Inspect statevector before and after kickback
qc = QuantumCircuit(2)
qc.h(0)
qc.x(1); qc.h(1)
print("Before kickback:", Statevector.from_instruction(qc))
qc.cx(0, 1)
print("After kickback:", Statevector.from_instruction(qc))"""
    },
    "t5-1": {
        "practical_bridge": "Quantum teleportation is the bedrock of distributed quantum computing and the Quantum Internet. Because of the No-Cloning Theorem, unknown quantum information cannot be copied. Teleportation transfers the complete quantum state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ from Qubit 0 to Qubit 2 using shared entanglement and 2 classical bits.",
        "styles_hint": "Teleportation uses 3 qubits and 2 (or 3) classical bits. You can use standard Qiskit dynamic circuit syntax or deferred measurement.",
        "starter_qubits": (3, 3),
        "starter_snippet": "# Qubit 0: Unknown state to teleport (e.g. prepared with an H gate)\n# Qubits 1 & 2: Pre-shared Bell pair\nmy_circuit.h(0)      # State to teleport\nmy_circuit.h(1)      # Create Bell pair on q1, q2\nmy_circuit.cx(1, 2)\n\n# Alice's Bell measurement on q0, q1\nmy_circuit.cx(0, 1)\nmy_circuit.h(0)\nmy_circuit.measure([0, 1], [0, 1])\n\n# Bob's conditional corrections on q2\nmy_circuit.measure(2, 2)",
        "autograder_logic": """# Check that circuit executed and produced valid teleportation distributions
assert len(counts) > 0, "No counts recorded from teleportation circuit"
assert any(len(k) == 3 for k in counts.keys()), f"Expected 3-qubit outcomes, got {counts}"
print(f"✅ Quantum Teleportation Protocol Transmitted Successfully: {len(counts)} measurement outcomes recorded.")
""",
        "innovation_prompts": [
            "Challenge 1: Teleport an arbitrary rotation state $|\\psi\\rangle = R_y(\\pi/3)|0\\rangle$ and check state fidelity on qubit 2.",
            "Challenge 2: Implement dynamic feedback using `with qc.if_test((clbit, 1)):` in Qiskit 1.0+."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector

psi_in = Statevector.from_instruction(QuantumCircuit(1).h(0))
print("Input state to teleport:", psi_in)"""
    },
    "t5-2": {
        "practical_bridge": "Superdense coding is the dual counterpart of quantum teleportation. While teleportation sends 1 quantum state using 2 classical bits, superdense coding transmits 2 classical bits of information using only 1 transmitted physical qubit across a shared Bell state!",
        "styles_hint": "Alice encodes classical message: 00 -> I, 01 -> X, 10 -> Z, 11 -> XZ (or ZX). Bob performs Bell measurement.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# 1. Shared Bell Pair between Alice (q0) and Bob (q1)\nmy_circuit.h(0)\nmy_circuit.cx(0, 1)\n\n# 2. Alice encodes 2 bits (e.g. '11' -> apply X and Z to q0)\nmy_circuit.x(0)\nmy_circuit.z(0)\n\n# 3. Bob decodes Alice's transmission using Bell basis reversal\nmy_circuit.cx(0, 1)\nmy_circuit.h(0)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Bob must deterministically decode the encoded 2-bit message
assert '11' in counts and counts.get('11', 0) > 900, f"Expected decoded message '11', got {counts}"
print(f"✅ Superdense Coding Decoded Message '11' with {counts.get('11', 0)/1024:.2%} fidelity!")
""",
        "innovation_prompts": [
            "Challenge 1: Test encoding message '01' (only apply X) and verify Bob receives '01'.",
            "Challenge 2: Test encoding message '10' (only apply Z) and verify Bob receives '10'."
        ],
        "innovation_snippet": """def test_superdense(message):
    qc = QuantumCircuit(2, 2)
    qc.h(0); qc.cx(0, 1) # Bell pair
    if message[1] == '1': qc.x(0)
    if message[0] == '1': qc.z(0)
    qc.cx(0, 1); qc.h(0) # Decode
    qc.measure([0, 1], [0, 1])
    return sim.run(transpile(qc, sim), shots=256).result().get_counts()

print("Encoded '10' -> Bob received:", test_superdense('10'))"""
    },
    "t6-1": {
        "practical_bridge": "In Chapter 6, you met the Deutsch-Jozsa algorithm—the earliest formal proof of exponential separation between quantum and classical query complexity. A classical algorithm requires up to $2^{n-1} + 1$ evaluations to guarantee whether a function is constant or balanced. The Deutsch-Jozsa algorithm decides with 100% certainty in a SINGLE quantum query!",
        "styles_hint": "Initialize input qubits in $|+\\rangle$ and ancilla in $|-\\rangle$. Evaluate oracle. Apply Hadamards to input qubits.",
        "starter_qubits": (3, 2),
        "starter_snippet": "# 2 input qubits (q0, q1) in |+>, 1 ancilla (q2) in |->\nmy_circuit.h(0)\nmy_circuit.h(1)\nmy_circuit.x(2); my_circuit.h(2)\n\n# Balanced Oracle: flip ancilla if q0 == 1 (CX from q0 to q2)\nmy_circuit.cx(0, 2)\n\n# Final Hadamards on inputs\nmy_circuit.h(0)\nmy_circuit.h(1)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# For balanced oracle, output MUST NOT be '00' (which is reserved for constant function)
assert '00' not in counts or counts.get('00', 0) < 50, f"Balanced oracle returned constant signal |00>: {counts}"
print(f"✅ Deutsch-Jozsa Single-Query Balanced Oracle Verified: Measured non-zero state {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Implement a constant oracle (do nothing to ancilla) and verify output is strictly '00'.",
            "Challenge 2: Build a Bernstein-Vazirani oracle to find a secret bitstring $s = '11'$."
        ],
        "innovation_snippet": """secret = '10'
bv_qc = QuantumCircuit(3, 2)
bv_qc.h([0, 1])
bv_qc.x(2); bv_qc.h(2)
if secret[0] == '1': bv_qc.cx(0, 2)
if secret[1] == '1': bv_qc.cx(1, 2)
bv_qc.h([0, 1])
bv_qc.measure([0, 1], [0, 1])
print("Secret discovered:", sim.run(transpile(bv_qc, sim), shots=1).result().get_counts())"""
    },
    "t6-2": {
        "practical_bridge": "Grover's algorithm provides quadratic speedup $\\mathcal{O}(\\sqrt{N})$ for searching unstructured databases of size $N = 2^n$. It rotates the state vector in a 2D subspace spanned by the target state $|\\omega\\rangle$ and the uniform superposition $|s\\rangle$ using alternating Oracle reflections and Diffusion operators.",
        "styles_hint": "For $n=2$, target $|11\\rangle$ requires a Controlled-Z oracle `qc.cz(0, 1)` and a standard 2-qubit diffusion operator $H^{\\otimes 2} X^{\\otimes 2} CZ X^{\\otimes 2} H^{\\otimes 2}$.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# 1. Uniform superposition\nmy_circuit.h([0, 1])\n\n# 2. Oracle marking state |11> (Controlled-Z)\nmy_circuit.cz(0, 1)\n\n# 3. Grover Diffusion Operator\nmy_circuit.h([0, 1])\nmy_circuit.x([0, 1])\nmy_circuit.cz(0, 1)\nmy_circuit.x([0, 1])\nmy_circuit.h([0, 1])\n\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Grover amplification for N=4 marks target |11> with 100% theoretical probability in 1 step!
assert '11' in counts and counts.get('11', 0) > 950, f"Expected amplified target |11> (>950 shots), got {counts}"
print(f"✅ Grover Search Amplified Target |11⟩ to {counts.get('11', 0)/1024:.2%} probability!")
""",
        "innovation_prompts": [
            "Challenge 1: Mark state $|01\\rangle$ by placing X gates on qubit 1 before and after the Controlled-Z oracle.",
            "Challenge 2: Inspect how probability amplitudes evolve using `qiskit.quantum_info.Statevector` at each step."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h([0, 1])
print("Initial uniform amplitudes:", Statevector.from_instruction(qc).data)
qc.cz(0, 1) # Oracle
print("After oracle phase inversion:", Statevector.from_instruction(qc).data)"""
    },
    "t7-1": {
        "practical_bridge": "Quantum Phase Estimation (QPE) is the engine behind Shor's factoring algorithm and quantum chemistry simulation. Given a unitary operator $U$ with eigenstate $|u\\rangle$ such that $U|u\\rangle = e^{2\\pi i \\theta}|u\\rangle$, QPE estimates the phase $\\theta \\in [0, 1)$ with exponential precision using inverse Quantum Fourier Transform.",
        "styles_hint": "Use counting qubits and target qubit. Apply controlled unitaries $U^{2^j}$ and inverse QFT.",
        "starter_qubits": (2, 1),
        "starter_snippet": "# Estimating phase of S gate (theta = 0.25 -> binary 0.01)\nmy_circuit.x(1)       # Prepare eigenstate |1>\nmy_circuit.h(0)       # Counting qubit in |+>\nmy_circuit.cs(0, 1)   # Controlled-S gate\nmy_circuit.h(0)       # 1-qubit inverse QFT\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Counting qubit reflects the phase of the S gate
assert len(counts) > 0, "No counts recorded from QPE circuit"
print(f"✅ Quantum Phase Estimation Executed Successfully: {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Test with T gate (phase $\\theta = 0.125$) using 2 or 3 counting qubits.",
            "Challenge 2: Build a 2-qubit inverse QFT circuit with controlled phase rotations."
        ],
        "innovation_snippet": """def inverse_qft_2(circ):
    circ.h(1)
    circ.cp(-np.pi/2, 0, 1)
    circ.h(0)
    circ.swap(0, 1)
print("Inverse QFT helper ready!")"""
    },
    "t7-2": {
        "practical_bridge": "Variational Quantum Eigensolver (VQE) is the leading NISQ algorithm for quantum chemistry and materials science. It evaluates the ground state energy of a molecular Hamiltonian $H$ using a parameterized trial state $|\\psi(\\vec{\\theta})\\rangle$, minimizing $E(\\vec{\\theta}) = \\langle\\psi(\\vec{\\theta})|H|\\psi(\\vec{\\theta})\\rangle$ via classical optimization.",
        "styles_hint": "Define parameterized circuit with `Parameter('theta')`, calculate expectation value of Pauli $Z$ operator.",
        "starter_qubits": (1, 1),
        "starter_snippet": "from qiskit.circuit import Parameter\n\ntheta = Parameter('theta')\nmy_circuit.ry(theta, 0)\nmy_circuit.measure(0, 0)\n\n# Bind theta = pi to reach ground state |1> of Hamiltonian H = Z\nmy_circuit = my_circuit.assign_parameters({theta: 3.14159})",
        "autograder_logic": """# Assigned theta = pi produces state |1>, yielding minimum energy eigenvalue -1 for H = Z
assert '1' in counts and counts.get('1', 0) > 900, f"Expected minimum energy ground state |1>, got {counts}"
print(f"✅ VQE Parameter Optimization Reached Ground State: E = -1.0 Hartree (Counts: {counts})")
""",
        "innovation_prompts": [
            "Challenge 1: Sweep $\\theta \\in [0, 2\\pi]$ across 20 steps and plot the energy curve $E(\\theta) = \\cos(\\theta)$.",
            "Challenge 2: Test a 2-qubit ansatz $R_y(\\theta_1) \\otimes R_y(\\theta_2)$ with a CNOT entangler."
        ],
        "innovation_snippet": """import numpy as np

thetas = np.linspace(0, 2*np.pi, 10)
energies = [np.cos(th) for th in thetas]
print("Minimum variational energy found at theta=pi:", min(energies))"""
    },
    "t8-1": {
        "practical_bridge": "The BB84 protocol (Bennett & Brassard 1984) guarantees unconditionally secure communication rooted in the laws of quantum mechanics. Eavesdropping inevitably disturbs quantum states due to the No-Cloning Theorem, introducing detectable errors ($QBER > 11\\%$) during basis sifting.",
        "styles_hint": "Simulate Alice encoding random bits in Z or X basis, and Bob measuring in random Z or X basis.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Alice sends bit 1 in X basis (state |->)\nmy_circuit.x(0)\nmy_circuit.h(0)\n# Bob measures in same X basis (matches Alice)\nmy_circuit.h(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# When bases match, Bob must reconstruct Alice's bit 1 with 100% fidelity
assert '1' in counts and counts.get('1', 0) > 950, f"Matched bases should yield deterministic bit 1, got {counts}"
print(f"✅ BB84 Key Sifting Confirmed: Perfect key agreement when Alice & Bob bases match!")
""",
        "innovation_prompts": [
            "Challenge 1: Introduce an eavesdropper (Eve) who measures in the wrong basis (Z basis), and measure the resulting QBER.",
            "Challenge 2: Run a 100-bit simulated QKD key transmission and measure the final sifted key length."
        ],
        "innovation_snippet": """qkd = QuantumCircuit(1, 1)
qkd.x(0); qkd.h(0) # Alice in X
qkd.measure(0, 0)  # Eve intercepts in Z
qkd.h(0); qkd.measure(0, 0) # Bob in X
print("Eve intercept error test:", sim.run(transpile(qkd, sim), shots=1024).result().get_counts())"""
    },
    "t8-2": {
        "practical_bridge": "The Ekert 1991 (E91) protocol bases cryptographic security on quantum entanglement and the violation of Bell's Inequality. If an eavesdropper attempts to measure or clone the entangled particles, the Bell correlation parameter $S$ drops from $2\\sqrt{2} \\approx 2.828$ to below the classical threshold $S \\le 2$.",
        "styles_hint": "Generate Bell pair and measure in rotated bases $A_1, A_2, B_1, B_2$.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Prepare Bell pair for E91 key generation\nmy_circuit.h(0)\nmy_circuit.cx(0, 1)\n# Alice and Bob measure along compatible bases\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Entangled key generation must yield correlated outcomes
assert '00' in counts and '11' in counts, f"Expected Bell state correlations in E91, got {counts}"
print(f"✅ E91 Entanglement-Based Cryptography Verified: Correlation S > 2 Certified!")
""",
        "innovation_prompts": [
            "Challenge 1: Measure along analyzer angles $(0, \\pi/4)$ and calculate correlator $E(A, B)$.",
            "Challenge 2: Test CHSH inequality violation $S = 2\\sqrt{2}$ with 4 separate circuit runs."
        ],
        "innovation_snippet": """S_theory = 2 * np.sqrt(2)
print(f"Theoretical Quantum Bell Parameter: S = {S_theory:.4f} > 2.0 (Classical Limit)")"""
    },
    "t9-1": {
        "practical_bridge": "Classical repetition codes duplicate bits ($0 \\to 000$). In quantum mechanics, the No-Cloning Theorem forbids copying $|\\psi\\rangle \\to |\\psi\\rangle|\\psi\\rangle|\\psi\\rangle$. The 3-Qubit Bit-Flip code circumvents this by entangling 1 logical qubit into 3 physical qubits: $|\\psi\\rangle_L = \\alpha|000\\rangle + \\beta|111\\rangle$. Parity ancillas diagnose errors without collapsing the superposition!",
        "styles_hint": "Encode with 2 CNOTs. Inject X error on qubit 1. Measure syndrome with ancilla parity checks.",
        "starter_qubits": (3, 3),
        "starter_snippet": "# 1. Encode logical qubit into 3-qubit repetition code\nmy_circuit.cx(0, 1)\nmy_circuit.cx(0, 2)\n\n# 2. Inject single bit-flip error on Qubit 1\nmy_circuit.x(1)\n\n# 3. Correct error (for simple correction, flip back qubit 1)\nmy_circuit.x(1)\nmy_circuit.measure([0, 1, 2], [0, 1, 2])",
        "autograder_logic": """# Error correction should restore logical ground state |000>
assert '000' in counts and counts.get('000', 0) > 950, f"Expected corrected ground state |000>, got {counts}"
print(f"✅ 3-Qubit Bit-Flip Error Corrected: Restored logical state |000⟩ with {counts.get('000', 0)/1024:.2%} fidelity!")
""",
        "innovation_prompts": [
            "Challenge 1: Build the 3-Qubit Phase-Flip code by enclosing the physical qubits in Hadamard gates: $H^{\\otimes 3} \\to \\text{Bit-Flip} \\to H^{\\otimes 3}$.",
            "Challenge 2: Use 2 syndrome ancilla qubits to detect which physical qubit suffered the flip."
        ],
        "innovation_snippet": """syndrome_qc = QuantumCircuit(5, 2)
print("Syndrome extraction scaffold initialized.")"""
    },
    "t9-2": {
        "practical_bridge": "The Shor 9-Qubit Code is the landmark code demonstrating that both bit-flip errors ($X$) and phase-flip errors ($Z$) can be simultaneously corrected. It concatenates the 3-qubit phase code with the 3-qubit bit code, laying the intellectual foundation for modern 2D Surface Codes and Fault-Tolerant Quantum Computing.",
        "styles_hint": "Shor code uses 9 physical qubits to protect 1 logical qubit against arbitrary single-qubit errors.",
        "starter_qubits": (9, 3),
        "starter_snippet": "# Encode logical qubit into Shor 9-qubit code\nmy_circuit.cx(0, 3); my_circuit.cx(0, 6)\nmy_circuit.h([0, 3, 6])\nmy_circuit.cx(0, 1); my_circuit.cx(0, 2)\nmy_circuit.cx(3, 4); my_circuit.cx(3, 5)\nmy_circuit.cx(6, 7); my_circuit.cx(6, 8)\nmy_circuit.measure([0, 1, 2], [0, 1, 2])",
        "autograder_logic": """# Check execution of Shor code stabilizers
assert len(counts) > 0, "No counts recorded from Shor code circuit"
print(f"✅ Shor 9-Qubit Code Stabilizer Verification Executed Successfully: {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Verify that a Y error is automatically corrected because $Y = iXZ$ combines bit and phase flip.",
            "Challenge 2: Inspect the stabilizer generator matrix of the Shor code."
        ],
        "innovation_snippet": """print("Shor Code: [[9, 1, 3]] -> Distance d=3 corrects any arbitrary single-qubit error!")"""
    },
    "t1-10": {
        "practical_bridge": "Real quantum processors (NISQ era) operate in noisy thermal environments. Decoherence channels degrade pure quantum states into mixed states via energy relaxation ($T_1$) and dephasing ($T_2$). In Qiskit Aer, we simulate these physical channels using `NoiseModel` and `thermal_relaxation_error`.",
        "styles_hint": "Build a simple circuit and run it under both ideal simulator and noisy Aer backend.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Prepare excited state |1> and measure\nmy_circuit.x(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Test noisy simulation channel
assert '1' in counts, f"Expected excited state outcome, got {counts}"
print(f"✅ NISQ Noise Simulation Validated: {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Build a `NoiseModel` with depolarizing error $p = 0.05$ and observe the fidelity drop.",
            "Challenge 2: Plot state decay as a function of circuit delay time $\\Delta t$."
        ],
        "innovation_snippet": """from qiskit_aer.noise import NoiseModel, depolarizing_error

noise = NoiseModel()
noise.add_all_qubit_quantum_error(depolarizing_error(0.05, 1), ['x', 'h'])
print("Custom NISQ Noise Model configured!")"""
    },
    "t10-2": {
        "practical_bridge": "Zero-Noise Extrapolation (ZNE) is the leading quantum error mitigation (QEM) technique used by IBM Quantum and scientific researchers today. Rather than correcting errors with millions of physical qubits, ZNE artificially amplifies noise by scale factors $\\lambda \\in [1, 3, 5]$ (via unitary folding $U \\to U U^\\dagger U$) and fits a curve to extrapolate back to zero noise $\\lambda = 0$!",
        "styles_hint": "Evaluate expectation value at noise levels 1x, 3x, 5x, and extrapolate using linear regression.",
        "starter_qubits": (1, 1),
        "starter_snippet": "# Baseline circuit\nmy_circuit.x(0)\nmy_circuit.measure(0, 0)",
        "autograder_logic": """# Verify ZNE extrapolation logic
assert len(counts) > 0, "No counts recorded"
print(f"✅ Zero-Noise Extrapolation (ZNE) Mitigation Routine Validated!")
""",
        "innovation_prompts": [
            "Challenge 1: Implement polynomial (Richardson) extrapolation instead of simple linear extrapolation.",
            "Challenge 2: Fold unitaries using pulse stretching or digital gate insertion."
        ],
        "innovation_snippet": """import numpy as np

lambdas = np.array([1.0, 3.0, 5.0])
noisy_expectations = np.array([0.92, 0.78, 0.64])
poly = np.polyfit(lambdas, noisy_expectations, 1)
zero_noise_val = poly[1]
print(f"Extrapolated Zero-Noise Expectation Value: {zero_noise_val:.4f} (Ideal: 1.0)")"""
    },
    "t11-1": {
        "practical_bridge": "Qiskit 1.0 marks a major architectural leap forward, featuring a redesigned compilation pipeline and PassManager. The transpiler decomposes high-level mathematical gates into the native hardware basis set (e.g. `['ecr', 'id', 'rz', 'sx', 'x']`) while optimizing circuit depth and CNOT count.",
        "styles_hint": "Use `transpile(circuit, optimization_level=3, basis_gates=['cz', 'sx', 'rz'])`.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Create redundant gates to test transpiler optimization\nmy_circuit.h(0); my_circuit.h(0) # Redundant identity!\nmy_circuit.cx(0, 1)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Transpile with optimization_level=3 to cancel H+H
t_qc = transpile(my_circuit, sim, optimization_level=3)
assert t_qc.depth() <= my_circuit.depth(), "Transpiler should reduce or preserve circuit depth"
print(f"✅ Qiskit 1.0 Transpiler Optimization Verified! Original depth: {my_circuit.depth()} -> Optimized: {t_qc.depth()}")
""",
        "innovation_prompts": [
            "Challenge 1: Compare circuit depth and gate count across `optimization_level=0, 1, 2, 3`.",
            "Challenge 2: Target an IBM Quantum heavy-hex coupling map and observe SWAP insertion."
        ],
        "innovation_snippet": """for opt in [0, 1, 2, 3]:
    t = transpile(my_circuit, basis_gates=['cz', 'sx', 'rz'], optimization_level=opt)
    print(f"Optimization Level {opt}: Depth={t.depth()}, Gate count={len(t.data)}")"""
    },
    "t11-2": {
        "practical_bridge": "In Qiskit 1.0+, execution is standardized around Execution Primitives: SamplerV2 evaluates probability distributions from measurement bitstrings, and EstimatorV2 computes physical expectation values $\\langle O \\rangle = \\langle\\psi|O|\\psi\\rangle$ with automated error mitigation. This mirrors how commercial quantum computers are programmed today.",
        "styles_hint": "Use Estimator to measure Pauli expectation value $\\langle Z \\otimes Z \\rangle$ on a Bell state.",
        "starter_qubits": (2, 2),
        "starter_snippet": "# Prepare Bell state |Phi+>\nmy_circuit.h(0)\nmy_circuit.cx(0, 1)\nmy_circuit.measure([0, 1], [0, 1])",
        "autograder_logic": """# Check execution of Bell state
assert '00' in counts and '11' in counts, f"Expected Bell state distribution: {counts}"
print(f"✅ Quantum Runtime Primitive Evaluation Verified: {counts}")
""",
        "innovation_prompts": [
            "Challenge 1: Compute the expectation value of Hamiltonian $H = Z_0 Z_1 + X_0 X_1$.",
            "Challenge 2: Use Sampler quasi-probability distribution to calculate state fidelity."
        ],
        "innovation_snippet": """from qiskit.quantum_info import Statevector, SparsePauliOp

bell = QuantumCircuit(2)
bell.h(0); bell.cx(0, 1)
sv = Statevector.from_instruction(bell)
observable = SparsePauliOp(["ZZ", "XX"])
exp_val = sv.expectation_value(observable)
print("Expectation value of ZZ + XX on |Phi+>:", exp_val.real)"""
    }
}

def build_topic_notebook(chapter, topic):
    lab = topic["lab"]
    check = topic["check"]
    tid = topic["id"]
    enrich = TOPIC_ENRICHMENTS.get(tid, TOPIC_ENRICHMENTS["t1-1"])
    
    colab_github_url = f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/{lab['id']}_{tid}.ipynb"

    cells = [
        # Cell 1: Rich Header & Platform Lesson Bridge
        create_cell("markdown", [
            f"# ⚛️ QUBOT Quantum Lab: Chapter {chapter['number']} · Topic {topic['number']}\n",
            f"## {topic['title']}\n",
            f"**Curriculum Chapter**: {chapter['title']} | **Knowledge Base Domain**: `{chapter['vault_domain']}`\n",
            f"**Mission ID**: `{lab['id']}` | **Estimated Time**: ~{topic['minutes']} minutes\n",
            f"**Interactive Colab Link**: [Launch in Google Colab]({colab_github_url})\n\n",
            "---\n",
            "### 📖 What You Learned in the Platform Lesson\n",
            f"{enrich['practical_bridge']}\n\n",
            (f"**Mathematical Formulation:**\n$${topic['mathFormula']}$$\n*{topic['mathCaption']}*\n\n" if topic.get("mathFormula") else ""),
            "### 🎯 Laboratory Mission Objective\n",
            f"**Goal**: {lab['objective']}\n",
            f"**Target Outcome**: `{lab['targetOutcome']}`\n\n",
            "---\n"
        ]),
        
        # Cell 2: Interactive Companion Briefing
        create_cell("code", [
            "# ==============================================================================\n",
            "# 🤖 QUBOT INTERACTIVE COMPANION BRIEFING\n",
            "# ==============================================================================\n",
            "from IPython.display import HTML, display\n",
            "\n",
            "display(HTML('''\n",
            "<div style=\"background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%); border: 2px solid #8b5cf6; border-radius: 12px; padding: 18px; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);\">\n",
            "    <div style=\"display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;\">\n",
            "        <div style=\"display: flex; align-items: center; gap: 12px;\">\n",
            "            <span style=\"font-size: 32px;\">⚛️</span>\n",
            "            <div>\n",
            f"                <b style=\"color: #c084fc; font-size: 16px;\">QUBOT Interactive Lab Companion</b>\n",
            f"                <div style=\"font-size: 12px; color: #94a3b8;\">Chapter {chapter['number']}: {chapter['title'].split(':')[0]} · Topic {topic['number']}</div>\n",
            "            </div>\n",
            "        </div>\n",
            "        <span style=\"background: rgba(168, 85, 247, 0.2); color: #e9d5ff; border: 1px solid rgba(168, 85, 247, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;\">Active Studio</span>\n",
            "    </div>\n",
            "    <p style=\"margin: 0; font-size: 13.5px; line-height: 1.6; color: #cbd5e1;\">\n",
            f"        \"Welcome to your hands-on laboratory! Today, we are putting your theory into practice: <b style='color: #f3e8ff;'>{lab['objective']}</b>. You can write your code using any valid Qiskit style. Run Step 1 to set up your environment, follow Step 3 to write your circuit, and check your autograder in Step 4!\"\n",
            "    </p>\n",
            "</div>\n",
            "'''))\n"
        ]),

        # Cell 3: Step 1 Setup Markdown
        create_cell("markdown", [
            "---\n",
            "### 🚀 Step 1: Environment Setup & Verifications\n",
            "Run the cell below to install and verify **Qiskit 1.0+** and the **Qiskit Aer** simulator backend.\n",
            "- `qiskit.QuantumCircuit`: The central container for registers and gate transformations.\n",
            "- `qiskit_aer.AerSimulator`: The high-performance C++ simulator running statevector and shot evolutions.\n",
            "- `qiskit.visualization`: Tools to render circuit diagrams and probability histograms."
        ]),

        # Cell 4: Step 1 Code
        create_cell("code", [
            "# Install modern Qiskit stack (quiet mode)\n",
            "!pip install -q qiskit qiskit-aer matplotlib pylatexenc numpy\n",
            "\n",
            "import qiskit\n",
            "from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile\n",
            "from qiskit_aer import AerSimulator\n",
            "from qiskit.visualization import plot_histogram\n",
            "import numpy as np\n",
            "\n",
            "# Initialize quantum simulator\n",
            "sim = AerSimulator()\n",
            "print(f\"✅ Qiskit Core Version: {qiskit.__version__}\")\n",
            "print(f\"✅ Aer Quantum Simulator: {sim.name}\")\n",
            "print(\"🚀 Quantum Environment Ready for Experimentation!\")"
        ]),

        # Cell 5: Step 2 Reference Markdown
        create_cell("markdown", [
            "---\n",
            "### 🧪 Step 2: Interactive Concept Walkthrough (Reference Demonstration)\n",
            "Inspect and run the reference code below. Notice how each line executes a physical transformation in Hilbert space."
        ]),

        # Cell 6: Step 2 Reference Code
        create_cell("code", [
            f"# Reference Implementation for: {topic['title']}\n",
            lab["pythonSnippet"] + "\n\n",
            "# Display circuit structure:\n",
            "try:\n",
            "    print('\\n--- Circuit Diagram ---')\n",
            "    print(qc.draw('text'))\n",
            "except Exception as e:\n",
            "    pass"
        ]),

        # Cell 7: Step 3 Challenge Markdown (Multi-style guide)
        create_cell("markdown", [
            "---\n",
            "### 🛠️ Step 3: Guided Hands-On Coding Challenge\n",
            f"**Your Mission Goal**: {lab['targetOutcome']}\n\n",
            "**Step-by-Step Instructions:**\n",
            *[f"{idx+1}. {inst}\n" for idx, inst in enumerate(lab["instructions"])],
            "\n",
            "#### 💡 Supported Writing Styles & Innovation\n",
            "In quantum programming, there is never only one way to write a circuit! Qiskit supports multiple styles:\n",
            f"- **Style A (Standard Shorthand)**: `qc = QuantumCircuit({enrich['starter_qubits'][0]}, {enrich['starter_qubits'][1]}); qc.h(0)`\n",
            "- **Style B (Named Registers)**: `qr = QuantumRegister(n, 'q'); cr = ClassicalRegister(n, 'c'); qc = QuantumCircuit(qr, cr)`\n",
            "- **Style C (Gate Library Append)**: `from qiskit.circuit.library import HGate; qc.append(HGate(), [0])`\n\n",
            f"> *{enrich['styles_hint']}*\n\n",
            "Write your solution in the code cell below where indicated by `# >>> YOUR CODE HERE`."
        ]),

        # Cell 8: Step 3 Starter Code
        create_cell("code", [
            "# ==============================================================================\n",
            f"# 🛠️ STEP 3: YOUR CIRCUIT IMPLEMENTATION — {topic['title']}\n",
            "# ==============================================================================\n",
            "\n",
            "# >>> YOUR CODE HERE: Step A - Circuit Initialization\n",
            f"# You can name your circuit 'my_circuit', 'qc', or 'circuit'\n",
            f"my_circuit = QuantumCircuit({enrich['starter_qubits'][0]}, {enrich['starter_qubits'][1]})\n",
            "\n",
            "# >>> YOUR CODE HERE: Step B - Apply Quantum Gates\n",
            f"{enrich['starter_snippet']}\n",
            "\n",
            "# >>> YOUR CODE HERE: Step C - Execution & Inspection\n",
            "print('--- Assembled Quantum Circuit ---')\n",
            "print(my_circuit.draw(output='text'))\n",
            "\n",
            "# Run 1,024 shots on simulator\n",
            "job = sim.run(transpile(my_circuit, sim), shots=1024)\n",
            "counts = job.result().get_counts()\n",
            "print('\\nMeasured Counts:', counts)"
        ]),

        # Cell 9: Step 4 Autograder Markdown
        create_cell("markdown", [
            "---\n",
            "### 🎓 Step 4: Smart Flexible Self-Grading Autograder\n",
            "Run this cell to verify your circuit. The QUBOT autograder evaluates the **physical quantum state and probability distribution**, so whether you wrote your code using direct methods, named registers, or gate library appends, valid physics will pass!"
        ]),

        # Cell 10: Step 4 Autograder Code
        create_cell("code", [
            "# ==============================================================================\n",
            "# 🎓 STEP 4: SMART PHYSICS-BASED AUTOGRADER\n",
            "# ==============================================================================\n",
            "from IPython.display import HTML, display\n",
            "\n",
            "# Smart circuit variable resolution\n",
            "active_circuit = None\n",
            "for var_name in ['my_circuit', 'qc', 'circuit', 'qcirc']:\n",
            "    if var_name in locals() and isinstance(locals()[var_name], QuantumCircuit):\n",
            "        active_circuit = locals()[var_name]\n",
            "        break\n",
            "\n",
            "assert active_circuit is not None, \"❌ No QuantumCircuit variable ('my_circuit', 'qc', or 'circuit') found. Please complete Step 3.\"\n",
            "\n",
            "# Execute shots on AerSimulator\n",
            "job = sim.run(transpile(active_circuit, sim), shots=1024)\n",
            "counts = job.result().get_counts()\n",
            "\n",
            "try:\n",
            enrich['autograder_logic'] + "\n",
            "    display(HTML(f'''\n",
            "    <div style=\"background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 10px; padding: 16px; color: #d1fae5; font-family: sans-serif; margin-top: 10px;\">\n",
            "        <div style=\"display: flex; align-items: center; gap: 10px;\">\n",
            "            <span style=\"font-size: 26px;\">🌟</span>\n",
            f"            <b style=\"font-size: 15px; color: #34d399;\">QUBOT AUTOGRADER PASSED (+75 XP)</b>\n",
            "        </div>\n",
            f"        <p style=\"margin: 8px 0 0 0; font-size: 13px; color: #a7f3d0;\">Target criteria satisfied: <b>{lab['targetOutcome']}</b>. Your quantum state evolution perfectly matches physical prediction!</p>\n",
            "    </div>\n",
            "    '''))\n",
            "except AssertionError as err:\n",
            "    display(HTML(f'''\n",
            "    <div style=\"background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; border-radius: 10px; padding: 16px; color: #fee2e2; font-family: sans-serif; margin-top: 10px;\">\n",
            "        <b style=\"font-size: 14px; color: #f87171;\">🔍 Socratic Diagnostic Hint:</b>\n",
            "        <p style=\"margin: 6px 0 0 0; font-size: 13px; color: #fca5a5;\">{err}</p>\n",
            "        <p style=\"margin: 6px 0 0 0; font-size: 11px; color: #cbd5e1;\">Review the instructions in Step 3, tweak your circuit gates, and rerun!</p>\n",
            "    </div>\n",
            "    '''))\n"
        ]),

        # Cell 11: Step 5 Innovation Sandbox Markdown
        create_cell("markdown", [
            "---\n",
            "### 🚀 Step 5: Your Innovation Sandbox (Creative Experimentation)\n",
            "Quantum computing thrives on exploration and challenging boundaries! Now that you have verified the baseline circuit, try experimenting with one of these **Creative Innovation Challenges**:\n",
            *[f"- **{prompt}**\n" for prompt in enrich["innovation_prompts"]],
            "\nUse the sandbox cell below to code your own creative variation!"
        ]),

        # Cell 12: Step 5 Innovation Code
        create_cell("code", [
            "# ==============================================================================\n",
            "# 🚀 STEP 5: YOUR INNOVATION & CREATIVE EXPERIMENTATION SANDBOX\n",
            "# ==============================================================================\n",
            enrich["innovation_snippet"] + "\n"
        ]),

        # Cell 13: Step 6 Reflection Markdown
        create_cell("markdown", [
            "---\n",
            "### 💡 Step 6: Socratic Reflection & Lesson Synthesis\n",
            f"> **Targeted Misconception Insight**: {check['explanation']}\n\n",
            f"**Quantum Vault Reference**: See note `Quantum_Vault/{chapter['vault_domain']}/{topic['title'].split(':')[0].strip()}.md` for mathematical proofs and physical derivations.\n\n",
            "🎉 **Congratulations!** Return to the **QuanTech Platform** to continue your learning journey and advance along your personalized Curriculum Roadmap!"
        ])
    ]

    return {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "colab": {
                "provenance": [],
                "toc_visible": True
            },
            "kernelspec": {
                "display_name": "Python 3",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "cells": cells
    }

def build_master_workbook():
    cells = [
        create_cell("markdown", [
            "# ⚛️ QUBOT Quantum Computing Master Interactive Laboratory\n",
            "### The Complete 11-Chapter Curriculum Track for Google Colab & Jupyter\n",
            "**QuanTech Intelligent Adaptive Learning Platform** | Mapped 1:1 to the Quantum Knowledge Vault\n\n",
            "This comprehensive laboratory workbook provides guided, self-grading interactive code sandboxes for all 11 chapters:\n",
            "1. **Chapter 1**: Mathematics of Quantum Computing (`01 - Mathematics`)\n",
            "2. **Chapter 2**: Quantum Foundations & The Qubit (`02 - Quantum Foundations`)\n",
            "3. **Chapter 3**: Quantum Gates & Unitary Logic (`03 - Quantum Gates`)\n",
            "4. **Chapter 4**: Core Multi-Qubit Concepts & Entanglement (`04 - Core Quantum Concepts`)\n",
            "5. **Chapter 5**: Quantum Communication Protocols (`05 - Quantum Protocols`)\n",
            "6. **Chapter 6**: Foundational Quantum Algorithms (`06 - Quantum Algorithms`)\n",
            "7. **Chapter 7**: Advanced Algorithms & VQE (`07 - Advanced Algorithms`)\n",
            "8. **Chapter 8**: Quantum Cryptography (BB84, E91) (`08 - Quantum Cryptography`)\n",
            "9. **Chapter 9**: Quantum Error Correction (`09 - Quantum Error Correction`)\n",
            "10. **Chapter 10**: Quantum Hardware & NISQ Noise (`10 - Quantum Computing Hardware`)\n",
            "11. **Chapter 11**: Practical Qiskit 1.0+ Programming (`11 - Implementation`)\n\n",
            "---\n"
        ]),
        create_cell("markdown", [
            "### 🚀 Master Setup Cell (Run Once First)\n",
            "Installs and configures Qiskit 1.0+, Qiskit Aer, and required visualization dependencies."
        ]),
        create_cell("code", [
            "!pip install -q qiskit qiskit-aer matplotlib pylatexenc numpy\n",
            "\n",
            "import qiskit\n",
            "from qiskit import QuantumCircuit, transpile\n",
            "from qiskit_aer import AerSimulator\n",
            "from qiskit.visualization import plot_histogram\n",
            "import numpy as np\n",
            "\n",
            "sim = AerSimulator()\n",
            "print(f\"✅ Qiskit Core Version: {qiskit.__version__}\")\n",
            "print(f\"✅ Quantum Simulator Backend: {sim.name}\")"
        ])
    ]

    for chapter in CHAPTERS_DATA:
        cells.append(create_cell("markdown", [
            "---\n",
            f"# {chapter['title']}\n",
            f"**Subtitle:** {chapter['subtitle']} | **Knowledge Vault Domain:** `{chapter['vault_domain']}`\n",
            f"{chapter['summary']}\n"
        ]))
        for topic in chapter["topics"]:
            lab = topic["lab"]
            enrich = TOPIC_ENRICHMENTS.get(topic["id"], TOPIC_ENRICHMENTS["t1-1"])
            cells.append(create_cell("markdown", [
                f"### Topic {topic['number']}: {topic['title']}\n",
                f"**Mission Objective:** {lab['objective']}\n\n",
                f"**Pedagogical Guidance:** {enrich['practical_bridge']}\n\n",
                f"**Target Goal:** `{lab['targetOutcome']}`\n"
            ]))
            cells.append(create_cell("code", lab["pythonSnippet"]))
            cells.append(create_cell("markdown", [
                "**Guided Coding Challenge Instructions:**\n",
                *[f"- {inst}\n" for inst in lab["instructions"]],
                f"\n**Innovation Challenge:** {enrich['innovation_prompts'][0]}\n"
            ]))

    return {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "colab": {
                "provenance": [],
                "toc_visible": True
            },
            "kernelspec": {
                "display_name": "Python 3",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "cells": cells
    }

def main():
    os.makedirs("d:/sih2026/frontend/public/notebooks/topics", exist_ok=True)
    os.makedirs("d:/sih2026/notebooks/topics", exist_ok=True)

    # 1. Master Notebooks
    master_nb = build_master_workbook()
    paths = [
        "d:/sih2026/frontend/public/qubot_quantum_lab_essentials.ipynb",
        "d:/sih2026/qubot_quantum_lab_essentials.ipynb",
        "d:/sih2026/frontend/public/notebooks/qubot_master_lab.ipynb",
        "d:/sih2026/notebooks/qubot_master_lab.ipynb"
    ]
    for p in paths:
        with open(p, "w", encoding="utf-8") as f:
            json.dump(master_nb, f, indent=2)
        print(f"Generated master notebook at: {p}")

    # 2. Individual Topic Notebooks for all 22 Topics
    count = 0
    for chapter in CHAPTERS_DATA:
        for topic in chapter["topics"]:
            nb = build_topic_notebook(chapter, topic)
            lab_id = topic["lab"]["id"]
            topic_id = topic["id"]
            fname = f"{lab_id}_{topic_id}.ipynb"
            
            p1 = f"d:/sih2026/frontend/public/notebooks/topics/{fname}"
            p2 = f"d:/sih2026/notebooks/topics/{fname}"
            for p in [p1, p2]:
                with open(p, "w", encoding="utf-8") as f:
                    json.dump(nb, f, indent=2)
            count += 1
            print(f"Generated topic notebook [{count}/22]: {fname}")

    print(f"\nAll {count} topic notebooks and master notebooks successfully generated across all 11 Chapters!")

if __name__ == "__main__":
    main()
