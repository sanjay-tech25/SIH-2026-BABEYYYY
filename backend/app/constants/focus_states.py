from enum import Enum


class FocusStatus(str, Enum):
    IDLE = "IDLE"
    IN_FOCUS = "IN_FOCUS"
    PAUSED = "PAUSED"
    BREAK_RECOMMENDED = "BREAK_RECOMMENDED"
    BREAK_SKIPPED = "BREAK_SKIPPED"
    BREAK_REQUIRED = "BREAK_REQUIRED"
    COMPLETED = "COMPLETED"


class BreakType(str, Enum):
    SHORT_BREAK = "SHORT_BREAK"  # 5 min
    LONG_BREAK = "LONG_BREAK"    # 15 min
    RESET_BREAK = "RESET_BREAK"  # 2 min (from distraction/idle nudge)
