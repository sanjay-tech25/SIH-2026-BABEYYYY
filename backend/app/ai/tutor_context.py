from typing import Dict, Any, Optional


class TutorContextBuilder:
    """Builds sanitized, PII-free learner context for AI prompt grounding."""

    @staticmethod
    def build_context(
        age_bracket: str,
        current_concept: str,
        mastery_score: float,
        recent_mistake: Optional[str] = None
    ) -> str:
        """Assembles context block for the Socratic system prompt."""
        context_str = f"LEARNER PROFILE:\n- Age Tier: {age_bracket}\n- Current Concept: {current_concept}\n- Concept Mastery: {int(mastery_score * 100)}%"
        if recent_mistake:
            context_str += f"\n- Recent Struggled Question / Misconception: {recent_mistake}"
        return context_str
