import math
from typing import Dict, Any, Tuple


class ProgressionEngine:
    """Calculates level progression curves, XP thresholds, and level-up events."""

    # Formula: XP required for level N = 100 * (N - 1)^1.5
    BASE_XP = 100
    EXPONENT = 1.5

    @classmethod
    def calculate_level(cls, total_xp: int) -> Tuple[int, int, int]:
        """
        Calculates (current_level, xp_in_current_level, xp_needed_for_next_level).
        """
        if total_xp <= 0:
            return 1, 0, 100

        level = 1
        while True:
            xp_for_next = int(cls.BASE_XP * math.pow(level, cls.EXPONENT))
            if total_xp < xp_for_next:
                xp_for_curr = int(cls.BASE_XP * math.pow(level - 1, cls.EXPONENT)) if level > 1 else 0
                xp_in_level = total_xp - xp_for_curr
                xp_needed = xp_for_next - xp_for_curr
                return level, xp_in_level, xp_needed
            level += 1

    @classmethod
    def check_level_up(cls, old_xp: int, new_xp: int) -> Dict[str, Any]:
        """Detects if adding XP caused a level-up event."""
        old_level, _, _ = cls.calculate_level(old_xp)
        new_level, curr_in_lvl, needed = cls.calculate_level(new_xp)
        
        leveled_up = new_level > old_level
        return {
            "leveled_up": leveled_up,
            "old_level": old_level,
            "new_level": new_level,
            "current_level_xp": curr_in_lvl,
            "next_level_threshold": needed
        }
