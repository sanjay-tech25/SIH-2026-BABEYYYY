import re
from typing import Tuple

DISALLOWED_PATTERNS = [
    r"politics",
    r"celebrity gossip",
    r"hack into",
    r"write an exploit",
    r"crypto investment",
]


class AIGuardrails:
    """Enforces strict domain boundaries (Quantum/Math/Physics) and content safety."""

    @staticmethod
    def check_input(query: str) -> Tuple[bool, str]:
        """
        Validates whether user prompt is within domain.
        Returns: (is_valid, rejection_reason)
        """
        query_lower = query.lower()
        for pattern in DISALLOWED_PATTERNS:
            if re.search(pattern, query_lower):
                return False, "I am your dedicated Quantum Learning Assistant. Let's keep our focus on quantum mechanics, computing concepts, and math foundations!"

        return True, ""
