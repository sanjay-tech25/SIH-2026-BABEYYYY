from typing import Dict, Any, Tuple
from app.constants.mastery import MasteryLevel


class MasteryEngine:
    """Bayesian Knowledge Tracing (BKT) engine for dynamic concept mastery calculation."""

    # Default BKT Parameters
    P_GUESS = 0.20     # Probability of guessing correctly without mastery
    P_SLIP = 0.10      # Probability of slipping (answering wrong despite mastery)
    P_TRANSIT = 0.15   # Probability of learning transition during a step

    @classmethod
    def update_mastery(
        cls,
        prior_mastery: float,
        is_correct: bool,
        p_guess: float = P_GUESS,
        p_slip: float = P_SLIP,
        p_transit: float = P_TRANSIT
    ) -> Tuple[float, float, str]:
        """
        Updates P(L_t) after observing a single response.
        Returns: (posterior_mastery, confidence_score, mastery_level)
        """
        prior = max(0.01, min(0.99, prior_mastery))

        if is_correct:
            # P(L_t | Correct)
            numerator = prior * (1.0 - p_slip)
            denominator = numerator + (1.0 - prior) * p_guess
        else:
            # P(L_t | Incorrect)
            numerator = prior * p_slip
            denominator = numerator + (1.0 - prior) * (1.0 - p_guess)

        p_learned_given_obs = numerator / denominator if denominator > 0 else prior

        # Apply learning transition: P(L_t+1) = P(L_t|obs) + (1 - P(L_t|obs)) * P_T
        posterior_mastery = p_learned_given_obs + (1.0 - p_learned_given_obs) * p_transit
        posterior_mastery = round(max(0.0, min(1.0, posterior_mastery)), 4)

        # Confidence heuristic based on distance from uncertainty (0.5)
        confidence = round(1.0 - 2.0 * abs(0.5 - posterior_mastery) * 0.3, 2)

        # Map to level enum
        if posterior_mastery >= 0.85:
            level = MasteryLevel.MASTERED.value
        elif posterior_mastery >= 0.70:
            level = MasteryLevel.PROFICIENT.value
        elif posterior_mastery >= 0.40:
            level = MasteryLevel.DEVELOPING.value
        else:
            level = MasteryLevel.NOVICE.value

        return posterior_mastery, confidence, level

    @staticmethod
    def is_concept_mastered(mastery_score: float, category: str = "CORE") -> bool:
        """Evaluates concept mastery against category-specific thresholds."""
        thresholds = {
            "FOUNDATIONAL": 0.85,
            "CORE": 0.80,
            "ADVANCED": 0.70
        }
        required_threshold = thresholds.get(category.upper(), 0.80)
        return mastery_score >= required_threshold
