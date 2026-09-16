from typing import Dict, Any, Tuple
from app.constants.focus_states import FocusStatus
from app.core.exceptions import BreakPolicyViolationException


class FocusPolicyEngine:
    """
    Authoritative state machine for Pomodoro focus sessions and health break policy.
    Rule 1: Session 1 completed -> BREAK_RECOMMENDED. User can skip.
    Rule 2: If skipped and Session 2 completed -> BREAK_REQUIRED (Mandatory rest).
    """

    @staticmethod
    def handle_session_completion(cycle_number: int, prev_break_skipped: bool) -> Tuple[str, bool, str]:
        """
        Determines the next focus status when a 25-min session finishes.
        Returns: (new_status, is_mandatory_break, message)
        """
        if cycle_number >= 2 and prev_break_skipped:
            return (
                FocusStatus.BREAK_REQUIRED.value,
                True,
                "Two consecutive focus cycles completed without rest. A mandatory break is now required."
            )
        else:
            return (
                FocusStatus.BREAK_RECOMMENDED.value,
                False,
                "Focus cycle completed. A 5-minute break is recommended to maintain peak focus."
            )

    @staticmethod
    def validate_new_session_permission(current_status: str, cycle_number: int, prev_break_skipped: bool) -> bool:
        """Checks if a learner is permitted to begin a new focus session."""
        if current_status == FocusStatus.BREAK_REQUIRED.value:
            raise BreakPolicyViolationException(
                "You have completed two consecutive focus sessions. You must complete a 5-minute break before starting another session."
            )
        return True

    @staticmethod
    def handle_distraction_event(idle_seconds: int) -> Dict[str, Any]:
        """Generates distraction remedy advice and mascot nudge."""
        if idle_seconds >= 180:  # 3 minutes or more
            return {
                "nudge_type": "RESET_OFFER",
                "recommended_action": "2_MIN_RESET",
                "message": "It looks like you've stepped away or might be stuck. How about a 2-minute reset or asking the AI Tutor?"
            }
        else:
            return {
                "nudge_type": "GENTLE_REMINDER",
                "recommended_action": "RESUME",
                "message": "Stay focused! You're making great progress on this quantum topic."
            }
