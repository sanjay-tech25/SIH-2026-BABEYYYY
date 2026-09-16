from datetime import date, timedelta
from typing import Dict, Any, List, Tuple


class GamificationEngine:
    """Evaluates streak continuations, streak freezes, and badge criteria rules."""

    @staticmethod
    def update_streak(
        current_streak: int,
        longest_streak: int,
        last_active_date: date,
        today: date,
        freeze_tokens: int
    ) -> Tuple[int, int, int, bool, str]:
        """
        Updates streak based on date delta.
        Returns: (new_current_streak, new_longest_streak, remaining_freeze_tokens, streak_saved_by_freeze, status_message)
        """
        delta_days = (today - last_active_date).days

        if delta_days == 0:
            # Already active today, streak unchanged
            return current_streak, longest_streak, freeze_tokens, False, "Active today"

        elif delta_days == 1:
            # Consecutive day! Increment streak
            new_streak = current_streak + 1
            new_longest = max(longest_streak, new_streak)
            return new_streak, new_longest, freeze_tokens, False, "Streak incremented"

        elif delta_days == 2 and freeze_tokens > 0:
            # Missed exactly 1 day, but saved by freeze token!
            return current_streak, longest_streak, freeze_tokens - 1, True, "Streak protected by freeze token"

        else:
            # Streak broken, reset to 1
            return 1, longest_streak, freeze_tokens, False, "Streak reset"

    @staticmethod
    def evaluate_badge_unlock(
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any]
    ) -> bool:
        """
        criteria: e.g. {"mastery_count": 3, "streak_days": 7, "circuits_executed": 1}
        user_stats: current user statistics
        """
        for metric, target in criteria.items():
            current_val = user_stats.get(metric, 0)
            if current_val < target:
                return False
        return True
