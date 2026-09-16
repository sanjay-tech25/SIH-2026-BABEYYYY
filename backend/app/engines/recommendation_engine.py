from typing import Dict, Any, Optional
from app.constants.mastery import RecommendationAction


class RecommendationEngine:
    """Computes next pedagogical recommendation: ADVANCE, REINFORCE, or REVISE."""

    @staticmethod
    def determine_next_action(
        concept_name: str,
        mastery_score: float,
        threshold: float = 0.80,
        prerequisite_concept_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Decision Matrix:
          - P(M) >= threshold: ADVANCE (Unlock next DAG node)
          - 0.50 <= P(M) < threshold: REINFORCE (Targeted micro-lessons on weak subtopics)
          - P(M) < 0.50: REVISE (Step back to prerequisite foundation)
        """
        if mastery_score >= threshold:
            action = RecommendationAction.ADVANCE.value
            rationale = f"Great work! You have mastered {concept_name} (Score: {int(mastery_score*100)}%). Ready to advance to the next challenge."
        elif mastery_score >= 0.50:
            action = RecommendationAction.REINFORCE.value
            rationale = f"You understand the core principles of {concept_name}, but need reinforcement on key subtleties before advancing."
        else:
            action = RecommendationAction.REVISE.value
            if prerequisite_concept_name:
                rationale = f"{concept_name} requires strong foundations in {prerequisite_concept_name}. Let's review foundational concepts first."
            else:
                rationale = f"Let's review the fundamental definitions and visual diagrams for {concept_name} to build confidence."

        return {
            "action": action,
            "mastery_score": mastery_score,
            "threshold": threshold,
            "rationale": rationale
        }
