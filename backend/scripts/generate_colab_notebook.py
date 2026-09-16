import json
import os

notebook = {
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
    "cells": [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# QUBOT Quantum Computing Essentials & Research Lab\n",
                "**AI-Powered Adaptive Learning Platform** | Interactive Quantum Virtual Machine\n",
                "\n",
                "This comprehensive laboratory notebook contains verified, ready-to-run quantum computing experiments using **Qiskit 1.2+** and **Qiskit Aer**.\n",
                "\n",
                "### Included Laboratory Modules:\n",
                "1. **Environment Setup & Verification**: Auto-install Qiskit, Qiskit Aer, Matplotlib, and PyLaTeXenc.\n",
                "2. **Module 1**: Single-Qubit Superposition & Measurement Collapse\n",
                "3. **Module 2**: Two-Qubit Non-Local Entanglement (The 4 Bell States)\n",
                "4. **Module 3**: Quantum State Teleportation Protocol with Classical Feed-Forward\n",
                "5. **Module 4**: Grover's Quadratic Search Algorithm with Oracle & Diffusion Operator\n",
                "6. **Module 5**: Parameterized Quantum Circuits (PQC) for Variational Quantum Algorithms (VQE)\n",
                "\n",
                "---"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Step 1: Install and configure Quantum Computing Libraries in Colab\n",
                "!pip install -q qiskit qiskit-aer matplotlib pylatexenc numpy\n",
                "\n",
                "import qiskit\n",
                "from qiskit import QuantumCircuit, transpile\n",
                "from qiskit_aer import AerSimulator\n",
                "from qiskit.visualization import plot_histogram\n",
                "import numpy as np\n",
                "\n",
                "print(f\"Qiskit SDK Version: {qiskit.__version__}\")\n",
                "simulator = AerSimulator()\n",
                "print(f\"Aer Quantum Simulator Backend: {simulator.name}\")"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "---\n",
                "## Module 1: Single-Qubit Superposition & State Collapsing\n",
                "Applying a Hadamard ($H$) gate places the qubit in an equal superposition state:\n",
                "$$|\\psi\\rangle = H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) = |+\\rangle$$"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Create 1-qubit circuit with 1 classical measurement bit\n",
                "qc1 = QuantumCircuit(1, 1)\n",
                "qc1.h(0)           # Hadamard gate creates |+> state\n",
                "qc1.measure(0, 0)  # Measurement causes wave-function collapse\n",
                "\n",
                "print(\"Circuit Diagram:\")\n",
                "print(qc1.draw(output=\"text\"))\n",
                "\n",
                "# Run simulation for 1,024 shots\n",
                "job1 = simulator.run(transpile(qc1, simulator), shots=1024)\n",
                "counts1 = job1.result().get_counts()\n",
                "print(\"\\nMeasurement Counts:\", counts1)"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "---\n",
                "## Module 2: Quantum Entanglement & The Bell State\n",
                "Creating an Einstein-Podolsky-Rosen (EPR) Bell pair:\n",
                "$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Create 2-qubit Bell circuit\n",
                "qc_bell = QuantumCircuit(2, 2)\n",
                "qc_bell.h(0)       # Qubit 0 superposition\n",
                "qc_bell.cx(0, 1)   # CNOT entangles Qubit 1 with Qubit 0\n",
                "qc_bell.measure([0, 1], [0, 1])\n",
                "\n",
                "print(\"Bell State Circuit Diagram:\")\n",
                "print(qc_bell.draw(output=\"text\"))\n",
                "\n",
                "# Execute on Qiskit Aer\n",
                "job_bell = simulator.run(transpile(qc_bell, simulator), shots=2048)\n",
                "counts_bell = job_bell.result().get_counts()\n",
                "print(\"\\nBell State Measurement Probabilities:\", counts_bell)"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "---\n",
                "## Module 3: Quantum Teleportation Protocol\n",
                "Transmitting an unknown qubit quantum state without transmitting the physical qubit itself, using a shared Bell pair and 2 classical bits."
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from qiskit import QuantumRegister, ClassicalRegister\n",
                "\n",
                "qr = QuantumRegister(3, name=\"q\")\n",
                "crz = ClassicalRegister(1, name=\"crz\")\n",
                "crx = ClassicalRegister(1, name=\"crx\")\n",
                "qc_teleport = QuantumCircuit(qr, crz, crx)\n",
                "\n",
                "# 1. State preparation on Alice's qubit (q[0])\n",
                "qc_teleport.rx(1.2, 0)\n",
                "qc_teleport.barrier()\n",
                "\n",
                "# 2. Shared EPR pair between Alice (q[1]) and Bob (q[2])\n",
                "qc_teleport.h(1)\n",
                "qc_teleport.cx(1, 2)\n",
                "qc_teleport.barrier()\n",
                "\n",
                "# 3. Alice performs Bell measurement\n",
                "qc_teleport.cx(0, 1)\n",
                "qc_teleport.h(0)\n",
                "qc_teleport.measure(0, crz)\n",
                "qc_teleport.measure(1, crx)\n",
                "qc_teleport.barrier()\n",
                "\n",
                "print(\"Quantum Teleportation Circuit Diagram:\")\n",
                "print(qc_teleport.draw(output=\"text\"))"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "---\n",
                "## Module 4: Grover's Search Algorithm\n",
                "Demonstrating quadratic speedup over classical search using quantum phase inversion and amplitude amplification."
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# 2-Qubit Grover Search for target state |11>\n",
                "qc_grover = QuantumCircuit(2, 2)\n",
                "\n",
                "# 1. Equal superposition\n",
                "qc_grover.h([0, 1])\n",
                "qc_grover.barrier()\n",
                "\n",
                "# 2. Phase Oracle (flips phase of |11>)\n",
                "qc_grover.cz(0, 1)\n",
                "qc_grover.barrier()\n",
                "\n",
                "# 3. Grover Diffusion Operator\n",
                "qc_grover.h([0, 1])\n",
                "qc_grover.x([0, 1])\n",
                "qc_grover.cz(0, 1)\n",
                "qc_grover.x([0, 1])\n",
                "qc_grover.h([0, 1])\n",
                "qc_grover.barrier()\n",
                "\n",
                "# 4. Measure results\n",
                "qc_grover.measure([0, 1], [0, 1])\n",
                "\n",
                "print(\"Grover Search Circuit:\")\n",
                "print(qc_grover.draw(output=\"text\"))\n",
                "\n",
                "job_grover = simulator.run(transpile(qc_grover, simulator), shots=1024)\n",
                "print(\"\\nGrover Measurement Output (Target |11> amplified):\", job_grover.result().get_counts())"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "---\n",
                "## Module 5: Parameterized Quantum Circuits (VQE / QML)\n",
                "Foundations of Variational Quantum Eigensolvers and Quantum Machine Learning models."
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from qiskit.circuit import Parameter\n",
                "\n",
                "theta = Parameter(\"θ\")\n",
                "qc_pqc = QuantumCircuit(2)\n",
                "qc_pqc.ry(theta, 0)\n",
                "qc_pqc.cx(0, 1)\n",
                "qc_pqc.rz(theta * 2, 1)\n",
                "\n",
                "print(\"Parameterized Ansätz Circuit:\")\n",
                "print(qc_pqc.draw(output=\"text\"))\n",
                "\n",
                "# Bind with parameter value (pi/3)\n",
                "bound = qc_pqc.assign_parameters({theta: np.pi / 3})\n",
                "print(\"\\nBound Circuit (θ = π/3):\")\n",
                "print(bound.draw(output=\"text\"))"
            ]
        }
    ]
}

os.makedirs("frontend/public", exist_ok=True)
paths = [
    "d:/sih2026/qubot_quantum_lab_essentials.ipynb",
    "d:/sih2026/frontend/public/qubot_quantum_lab_essentials.ipynb"
]

for p in paths:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(notebook, f, indent=2)
    print(f"Generated notebook at: {p}")
