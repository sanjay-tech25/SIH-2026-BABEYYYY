"""Quantum Digital Twin Engine: Reconstructs student mental model vs true mathematical quantum state."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import numpy as np


class DigitalTwinEvaluation(BaseModel):
    cognitive_calibration_index: float  # CCI in [0.0, 1.0]
    alignment_tier: str  # ALIGNED, PARTIALLY_CALIBRATED, DIVERGENT
    mental_model_summary: str
    recommended_focus: str


class QuantumDigitalTwinEngine:
    """Computes fidelity between student's mental model and actual quantum statevector."""

    @staticmethod
    def compute_cognitive_calibration_index(
        mental_amplitudes: List[complex],
        true_amplitudes: List[complex]
    ) -> float:
        """Computes fidelity CCI = |<psi_mental | psi_true>|^2."""
        if len(mental_amplitudes) != len(true_amplitudes) or not true_amplitudes:
            return 0.0

        v_mental = np.array(mental_amplitudes, dtype=complex)
        v_true = np.array(true_amplitudes, dtype=complex)

        # Normalize
        norm_m = np.linalg.norm(v_mental)
        norm_t = np.linalg.norm(v_true)

        if norm_m == 0 or norm_t == 0:
            return 0.0

        v_mental = v_mental / norm_m
        v_true = v_true / norm_t

        inner_product = np.vdot(v_mental, v_true)
        fidelity = float(np.abs(inner_product) ** 2)
        return float(np.clip(fidelity, 0.0, 1.0))

    def evaluate_twin(
        self,
        mental_distribution: Dict[str, float],
        actual_distribution: Dict[str, float],
        dimension: int = 2
    ) -> DigitalTwinEvaluation:
        """Estimates calibration fidelity from probability distributions."""
        all_keys = sorted(list(set(mental_distribution.keys()) | set(actual_distribution.keys())))
        
        # Approximate amplitudes as square root of probabilities
        mental_amps = [np.sqrt(mental_distribution.get(k, 0.0)) for k in all_keys]
        true_amps = [np.sqrt(actual_distribution.get(k, 0.0)) for k in all_keys]

        cci = self.compute_cognitive_calibration_index(mental_amps, true_amps)

        if cci >= 0.85:
            tier = "ALIGNED"
            summary = "Student mental model closely tracks the physical quantum state."
            focus = "Ready for advanced multi-qubit transformations."
        elif cci >= 0.50:
            tier = "PARTIALLY_CALIBRATED"
            summary = "Partial alignment with slight phase or amplitude estimation errors."
            focus = "Focus on basis projection and state interference."
        else:
            tier = "DIVERGENT"
            summary = "Significant divergence between mental model and actual quantum state."
            focus = "Review foundational superposition and unitary transformations."

        return DigitalTwinEvaluation(
            cognitive_calibration_index=round(cci, 4),
            alignment_tier=tier,
            mental_model_summary=summary,
            recommended_focus=focus,
        )
