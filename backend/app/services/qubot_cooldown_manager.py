import time
from typing import Dict, Tuple


class QUBOTCooldownManager:
    """Manages cooldown intervals to prevent repetitive mascot popups and notification spam."""

    COOLDOWNS = {
        "DISTRACTION_REMINDER": 300,   # 5 minutes
        "FOCUS_REMINDER": 180,         # 3 minutes
        "HINT": 60,                    # 1 minute
        "LEARNING_ENCOURAGEMENT": 120, # 2 minutes
        "CELEBRATION": 30,             # 30 seconds
    }

    # In-memory user cooldown registry: { (user_id, category): last_triggered_timestamp }
    _last_triggers: Dict[Tuple[str, str], float] = {}

    @classmethod
    def can_trigger(cls, user_id: str, category: str) -> bool:
        cooldown = cls.COOLDOWNS.get(category, 0)
        if cooldown == 0:
            return True

        key = (user_id, category)
        now = time.time()
        last_time = cls._last_triggers.get(key, 0)

        if now - last_time < cooldown:
            return False

        cls._last_triggers[key] = now
        return True

    @classmethod
    def reset_for_user(cls, user_id: str):
        keys_to_del = [k for k in cls._last_triggers if k[0] == user_id]
        for k in keys_to_del:
            del cls._last_triggers[k]
