from typing import Dict, Any
from app.constants.qubot_contracts import (
    StruggleType,
    StruggleSeverity,
    InterventionType,
    QUBOTActionType,
    QUBOTPriority,
)


class InterventionEngine:
    """Intervention Selection Engine (Section 10).

    Maps learner struggle classification, fatigue, and distraction diagnosis
    to the least disruptive, pedagogically optimal intervention.
    """

    @classmethod
    def select_intervention(
        cls,
        struggle_result: Dict[str, Any],
        fatigue_result: Dict[str, Any],
        distraction_result: Dict[str, Any],
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        struggle_type = struggle_result.get("type", StruggleType.NONE)
        severity = struggle_result.get("severity", StruggleSeverity.NORMAL)
        is_fatigued = fatigue_result.get("is_fatigued", False)
        is_distracted = distraction_result.get("is_distracted", False)

        # 1. Fatigue takes high priority: suggest rest over academic intervention
        if is_fatigued:
            return {
                "type": InterventionType.BREAK_SUGGESTION,
                "required": False,
                "action": QUBOTActionType.START_BREAK,
                "priority": QUBOTPriority.HIGH,
                "label": "Take a 5-Minute Break",
                "rationale": "Cognitive fatigue detected over extended focus cycle."
            }

        # 2. Distraction
        if is_distracted and struggle_type == StruggleType.NONE:
            return {
                "type": InterventionType.DISTRACTION_RESET,
                "required": False,
                "action": QUBOTActionType.RESUME_LEARNING,
                "priority": QUBOTPriority.NORMAL,
                "label": "Resume Session",
                "rationale": "Session idle or window blurred."
            }

        # 3. Struggle-specific Interventions
        if struggle_type == StruggleType.CONCEPTUAL:
            return {
                "type": InterventionType.ALTERNATIVE_EXPLANATION,
                "required": False,
                "action": QUBOTActionType.OPEN_ALTERNATIVE_EXPLANATION,
                "priority": QUBOTPriority.HIGH if severity in [StruggleSeverity.HIGH, StruggleSeverity.CRITICAL] else QUBOTPriority.MEDIUM,
                "label": "View Alternative Explanation",
                "rationale": "Repeated conceptual confusion detected."
            }

        elif struggle_type == StruggleType.PROCEDURAL:
            return {
                "type": InterventionType.STEP_BY_STEP_HINT,
                "required": False,
                "action": QUBOTActionType.NONE,
                "priority": QUBOTPriority.MEDIUM,
                "label": "Show Step Hint",
                "rationale": "Procedural friction on solving step."
            }

        elif struggle_type == StruggleType.REPEATED_ERROR:
            return {
                "type": InterventionType.MISTAKE_ANALYSIS,
                "required": False,
                "action": QUBOTActionType.OPEN_REVISION,
                "priority": QUBOTPriority.HIGH,
                "label": "Analyze Common Misconception",
                "rationale": "Multiple failed attempts on same problem."
            }

        elif struggle_type == StruggleType.GUESSING:
            return {
                "type": InterventionType.SLOW_DOWN_PROMPT,
                "required": False,
                "action": QUBOTActionType.NONE,
                "priority": QUBOTPriority.MEDIUM,
                "label": "Review Question Objective",
                "rationale": "Rapid response with incorrect answer indicates guessing."
            }

        elif struggle_type == StruggleType.TIME_PRESSURE:
            return {
                "type": InterventionType.REASSURANCE,
                "required": False,
                "action": QUBOTActionType.NONE,
                "priority": QUBOTPriority.LOW,
                "label": "Take Your Time",
                "rationale": "Significantly exceeding expected solving duration."
            }

        elif struggle_type == StruggleType.DIFFICULTY_MISMATCH:
            return {
                "type": InterventionType.RECOMMEND_PREREQUISITE,
                "required": False,
                "action": QUBOTActionType.VIEW_RECOMMENDATION,
                "priority": QUBOTPriority.HIGH,
                "label": "Review Prerequisite Concept",
                "rationale": "Problem difficulty exceeds estimated mastery baseline."
            }

        # Default: No intervention needed
        return {
            "type": InterventionType.NONE,
            "required": False,
            "action": QUBOTActionType.NONE,
            "priority": QUBOTPriority.LOW,
            "label": None,
            "rationale": "Learner proceeding normally."
        }
