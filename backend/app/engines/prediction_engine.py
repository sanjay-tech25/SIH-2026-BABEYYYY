"""Predict -> Simulate -> Explain Engine: Computes distribution divergence and triggers Socratic explanations."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import numpy as np


class PredictionEvaluationResult(BaseModel):
    divergence_score: float = Field(..., description="Total Variation Distance D_TV in [0.0, 1.0]")
    is_accurate: bool
    accuracy_tier: str  # EXACT_MATCH, MINOR_DEVIATION, SIGNIFICANT_DIVERGENCE
    xp_bonus: int
    feedback_message: str
    requires_socratic_explanation: bool


class PredictionEngine:
    """Evaluates committed quantum predictions against simulated outcomes."""

    @staticmethod
    def compute_total_variation_distance(
        predicted: Dict[str, float],
        actual: Dict[str, float]
    ) -> float:
        """Computes D_TV = 0.5 * sum |P(x) - Q(x)| across all basis states."""
        all_keys = set(predicted.keys()) | set(actual.keys())
        diff_sum = sum(abs(predicted.get(k, 0.0) - actual.get(k, 0.0)) for k in all_keys)
        return float(np.clip(0.5 * diff_sum, 0.0, 1.0))

    def evaluate_prediction(
        self,
        predicted_distribution: Dict[str, float],
        actual_distribution: Dict[str, float]
    ) -> PredictionEvaluationResult:
        """Evaluates prediction accuracy, computes XP bonus, and triggers Socratic reflection."""
        d_tv = self.compute_total_variation_distance(predicted_distribution, actual_distribution)

        if d_tv <= 0.10:
            return PredictionEvaluationResult(
                divergence_score=round(d_tv, 4),
                is_accurate=True,
                accuracy_tier="EXACT_MATCH",
                xp_bonus=25,
                feedback_message="Brilliant prediction! Your quantum hypothesis matches the simulation outcome.",
                requires_socratic_explanation=False,
            )
        elif d_tv <= 0.35:
            return PredictionEvaluationResult(
                divergence_score=round(d_tv, 4),
                is_accurate=False,
                accuracy_tier="MINOR_DEVIATION",
                xp_bonus=10,
                feedback_message="Close! There is a slight phase or shot distribution difference. Inspect your relative phases.",
                requires_socratic_explanation=False,
            )
        else:
            return PredictionEvaluationResult(
                divergence_score=round(d_tv, 4),
                is_accurate=False,
                accuracy_tier="SIGNIFICANT_DIVERGENCE",
                xp_bonus=0,
                feedback_message="Your prediction differed significantly from the simulated state. Let's analyze why!",
                requires_socratic_explanation=True,
            )
