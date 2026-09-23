"""Quantum Error Hierarchy Engine: Evaluates 4 distinct tiers of quantum errors (L1 to L4).
Section 4.4: L1 Code Error, L2 Circuit Error, L3 Conceptual Error, L4 Algorithmic Error.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from enum import Enum


class ErrorLevel(str, Enum):
    L1_CODE_ERROR = "L1_CODE_ERROR"
    L2_CIRCUIT_ERROR = "L2_CIRCUIT_ERROR"
    L3_CONCEPTUAL_ERROR = "L3_CONCEPTUAL_ERROR"
    L4_ALGORITHMIC_ERROR = "L4_ALGORITHMIC_ERROR"


class QuantumDiagnosticError(BaseModel):
    level: ErrorLevel
    title: str
    message: str
    remedy: str
    affected_components: List[str]


class QuantumErrorHierarchyEngine:
    """Classifies quantum errors across the 4-level pedagogical hierarchy."""

    @classmethod
    def analyze(
        cls,
        circuit_data: Dict[str, Any],
        intended_goal: Optional[str] = None,
        prediction_divergence: Optional[float] = None
    ) -> List[QuantumDiagnosticError]:
        errors: List[QuantumDiagnosticError] = []
        num_qubits = circuit_data.get("num_qubits", 1)
        gates = circuit_data.get("gates", [])

        # --- L1: Code / Syntax Error Check ---
        for idx, g in enumerate(gates):
            if not isinstance(g, dict) or "gate" not in g and "type" not in g:
                errors.append(QuantumDiagnosticError(
                    level=ErrorLevel.L1_CODE_ERROR,
                    title="Malformed Gate Syntax",
                    message=f"Gate at index {idx} lacks required 'gate' or 'type' descriptor.",
                    remedy="Format gate as a structured dictionary with 'gate' and wire coordinates.",
                    affected_components=[f"gate_index_{idx}"]
                ))

        # --- L2: Circuit Placement & Topological Error Check ---
        measured_qubits = set()
        for idx, g in enumerate(gates):
            if not isinstance(g, dict):
                continue
            gtype = g.get("gate", g.get("type", "")).upper()
            target = g.get("qubit", g.get("target", 0))
            control = g.get("control", None)

            if target >= num_qubits or (control is not None and control >= num_qubits):
                errors.append(QuantumDiagnosticError(
                    level=ErrorLevel.L2_CIRCUIT_ERROR,
                    title="Out-of-Bounds Qubit Index",
                    message=f"Gate '{gtype}' references wire {max(target, control or 0)}, but circuit only has {num_qubits} qubits.",
                    remedy=f"Expand circuit qubit register or constrain wire indices to [0, {num_qubits - 1}].",
                    affected_components=[f"wire_{target}"]
                ))

            if gtype in ("CX", "CNOT", "CZ") and control is not None and control == target:
                errors.append(QuantumDiagnosticError(
                    level=ErrorLevel.L2_CIRCUIT_ERROR,
                    title="Identical Control and Target Wires",
                    message=f"Multi-qubit gate '{gtype}' has identical control and target wire ({control}).",
                    remedy="Control and target must operate on distinct quantum wires.",
                    affected_components=[f"wire_{control}"]
                ))

            if target in measured_qubits:
                errors.append(QuantumDiagnosticError(
                    level=ErrorLevel.L2_CIRCUIT_ERROR,
                    title="Post-Measurement Gate Placement",
                    message=f"Gate '{gtype}' placed on qubit {target} after projective measurement.",
                    remedy="Apply all coherent unitary operations before terminal measurement gates.",
                    affected_components=[f"wire_{target}"]
                ))

            if gtype == "M":
                measured_qubits.add(target)

        # --- L3: Conceptual Error Check (Prediction divergence) ---
        if prediction_divergence is not None and prediction_divergence > 0.35:
            errors.append(QuantumDiagnosticError(
                level=ErrorLevel.L3_CONCEPTUAL_ERROR,
                title="Conceptual Phase / Amplitude Divergence",
                message="Your predicted probability distribution diverged significantly from the simulated quantum state.",
                remedy="Inspect relative phase cancellations and statevector projections.",
                affected_components=["prediction_modal"]
            ))

        # --- L4: Algorithmic Error Check (Goal Intent Failure) ---
        dict_gates = [g for g in gates if isinstance(g, dict)]
        if intended_goal:
            goal_lower = intended_goal.lower()
            if "bell" in goal_lower or "entangle" in goal_lower:
                has_h = any(g.get("gate", g.get("type", "")).upper() == "H" for g in dict_gates)
                has_cx = any(g.get("gate", g.get("type", "")).upper() in ("CX", "CNOT") for g in dict_gates)
                if not (has_h and has_cx):
                    errors.append(QuantumDiagnosticError(
                        level=ErrorLevel.L4_ALGORITHMIC_ERROR,
                        title="Bell State Algorithm Incomplete",
                        message="A Bell state requires a Hadamard gate to create superposition, followed by a CNOT gate to entangle.",
                        remedy="Apply an H gate to control wire q0, then connect a CNOT targeting q1.",
                        affected_components=["circuit_composer"]
                    ))
            elif "grover" in goal_lower:
                has_diffusion = len(dict_gates) >= 4
                if not has_diffusion:
                    errors.append(QuantumDiagnosticError(
                        level=ErrorLevel.L4_ALGORITHMIC_ERROR,
                        title="Grover Diffusion Operator Missing",
                        message="Grover's algorithm requires oracle phase inversion followed by an amplitude diffusion operator (H-X-CZ-X-H).",
                        remedy="Construct the diffusion operator to amplify the marked state probability.",
                        affected_components=["circuit_composer"]
                    ))

        return errors
