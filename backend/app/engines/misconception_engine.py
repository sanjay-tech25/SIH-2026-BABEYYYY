"""Quantum Misconception Engine: Detects cognitive anti-patterns and prescribes targeted remediation."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import numpy as np


class MisconceptionDiagnostic(BaseModel):
    code: str
    name: str
    detected: bool
    confidence: float
    description: str
    remediation_kata: str
    remediation_vault_note: str


class QuantumMisconceptionEngine:
    """Classifies cognitive anti-patterns across quantum circuit predictions and modifications."""

    TAXONOMY = {
        "MC-01": {
            "name": "Classical Probability Fallacy",
            "description": "Treats quantum amplitudes as classical non-interfering probabilities, missing constructive/destructive phase interference.",
            "remediation_kata": "Phase Cancellation & Double Hadamard Lab",
            "remediation_vault_note": "04 - Core Quantum Concepts/Interference.md",
        },
        "MC-02": {
            "name": "Measurement Non-Destructiveness",
            "description": "Assumes superposition persists after projective measurement.",
            "remediation_kata": "State Projection & Consecutive Measurement Kata",
            "remediation_vault_note": "02 - Quantum Foundations/Measurement.md",
        },
        "MC-03": {
            "name": "FTL Entanglement Signaling",
            "description": "Believes measuring one entangled qubit instantaneously transmits classical information.",
            "remediation_kata": "No-Communication Theorem & Teleportation Classical Channel Lab",
            "remediation_vault_note": "05 - Quantum Protocols/Quantum Teleportation.md",
        },
        "MC-04": {
            "name": "Hadamard as Random Number Generator",
            "description": "Believes Hadamard gate is a 50/50 dice roll rather than a deterministic unitary rotation satisfying H*H = I.",
            "remediation_kata": "Unitary Involution Verification (H^2 = I)",
            "remediation_vault_note": "03 - Quantum Gates/Hadamard.md",
        },
        "MC-05": {
            "name": "Phase Kickback Inversion Fallacy",
            "description": "Assumes control qubit alters target state without recognizing target eigenstate kicks relative phase into control.",
            "remediation_kata": "Eigenstate Kickback on CX Kata",
            "remediation_vault_note": "04 - Core Quantum Concepts/Phase Kickback.md",
        },
        "MC-06": {
            "name": "Global vs Relative Phase Equivalence",
            "description": "Confuses global phase (unobservable scalar) with relative phase between basis states.",
            "remediation_kata": "Bloch Equatorial Rotation vs Global Phase Multiplier",
            "remediation_vault_note": "03 - Quantum Gates/Phase Gates.md",
        },
        "MC-07": {
            "name": "Quantum Cloning Fallacy",
            "description": "Assumes CNOT copies an arbitrary unknown quantum state onto target.",
            "remediation_kata": "No-Cloning Theorem Non-Linearity Proof Lab",
            "remediation_vault_note": "04 - Core Quantum Concepts/Entanglement.md",
        },
        "MC-08": {
            "name": "Register Endianness Confusion",
            "description": "Confuses Qiskit little-endian ordering |q1 q0> with textbook big-endian |q0 q1>.",
            "remediation_kata": "Bit String Index Alignment Kata",
            "remediation_vault_note": "02 - Quantum Foundations/Multi Qubit Measurement.md",
        },
        "MC-09": {
            "name": "Grover Search as Database Lookup",
            "description": "Believes Grover iterates items sequentially rather than rotating statevector in 2D Hilbert subspace.",
            "remediation_kata": "2D Geometric State Rotation Visualization",
            "remediation_vault_note": "06 - Quantum Algorithms/Grover Algorithm.md",
        },
        "MC-10": {
            "name": "Parallel Superposition Fallacy",
            "description": "Assumes an N-qubit superposition allows simultaneously reading out 2^N outputs in a single execution.",
            "remediation_kata": "Projective Measurement & Born Rule Amplitude Sampling",
            "remediation_vault_note": "02 - Quantum Foundations/Born Rule.md",
        },
    }

    def evaluate(
        self,
        circuit_gates: List[Dict[str, Any]],
        predicted_distribution: Optional[Dict[str, float]] = None,
        actual_distribution: Optional[Dict[str, float]] = None,
        interaction_context: Optional[Dict[str, Any]] = None,
    ) -> List[MisconceptionDiagnostic]:
        """Diagnoses likely misconceptions from circuit composition and predictive divergence."""
        diagnostics = []
        interaction = interaction_context or {}

        # Heuristic 1: Double Hadamard predicting 50/50 (MC-01 / MC-04)
        h_gates = [g for g in circuit_gates if g.get("gate", "").upper() == "H"]
        if len(h_gates) >= 2 and predicted_distribution:
            p0 = predicted_distribution.get("0", 0.0)
            p1 = predicted_distribution.get("1", 0.0)
            if abs(p0 - 0.5) < 0.15 and abs(p1 - 0.5) < 0.15:
                # Learner predicted random 50/50 after H + H
                diagnostics.append(self._build_diagnostic("MC-01", confidence=0.92))
                diagnostics.append(self._build_diagnostic("MC-04", confidence=0.88))

        # Heuristic 2: Endianness Confusion (MC-08)
        if predicted_distribution and actual_distribution:
            # Check if predicted distribution matches reversed bitkeys
            reversed_matches = 0
            total_keys = 0
            for k, p_prob in predicted_distribution.items():
                rev_k = k[::-1]
                if rev_k != k and rev_k in actual_distribution:
                    total_keys += 1
                    if abs(p_prob - actual_distribution[rev_k]) < 0.15:
                        reversed_matches += 1
            if total_keys > 0 and reversed_matches == total_keys:
                diagnostics.append(self._build_diagnostic("MC-08", confidence=0.95))

        # Heuristic 3: Measurement Non-Destructiveness (MC-02)
        measure_indices = [i for i, g in enumerate(circuit_gates) if g.get("gate", "").upper() == "M"]
        if len(measure_indices) > 0 and measure_indices[0] < len(circuit_gates) - 1:
            # Gate placed after measurement
            diagnostics.append(self._build_diagnostic("MC-02", confidence=0.85))

        # Heuristic 4: Phase Kickback Inversion (MC-05)
        has_cx = any(g.get("gate", "").upper() in ("CX", "CNOT") for g in circuit_gates)
        if has_cx and interaction.get("target_in_minus_state", False):
            if interaction.get("expected_control_phase_unchanged", False):
                diagnostics.append(self._build_diagnostic("MC-05", confidence=0.90))

        # Heuristic 5: Fallback general divergence
        if not diagnostics and predicted_distribution and actual_distribution:
            # Check total variation distance
            d_tv = 0.5 * sum(
                abs(predicted_distribution.get(k, 0.0) - actual_distribution.get(k, 0.0))
                for k in set(predicted_distribution) | set(actual_distribution)
            )
            if d_tv > 0.40:
                diagnostics.append(self._build_diagnostic("MC-01", confidence=0.75))

        return diagnostics

    def _build_diagnostic(self, code: str, confidence: float) -> MisconceptionDiagnostic:
        info = self.TAXONOMY[code]
        return MisconceptionDiagnostic(
            code=code,
            name=info["name"],
            detected=True,
            confidence=confidence,
            description=info["description"],
            remediation_kata=info["remediation_kata"],
            remediation_vault_note=info["remediation_vault_note"],
        )
