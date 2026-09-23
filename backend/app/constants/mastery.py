from enum import Enum


class MasteryLevel(str, Enum):
    NOVICE = "NOVICE"            # P(L) < 0.40
    DEVELOPING = "DEVELOPING"    # 0.40 <= P(L) < 0.70
    PROFICIENT = "PROFICIENT"    # 0.70 <= P(L) < 0.85
    MASTERED = "MASTERED"        # P(L) >= 0.85


class RecommendationAction(str, Enum):
    ADVANCE = "ADVANCE"          # Passed concept threshold -> Move to next DAG node
    ADVANCE_WITH_SCAFFOLDING = "ADVANCE_WITH_SCAFFOLDING" # Proceed forward with adaptive hints
    ADAPTIVE_BRIDGE = "ADAPTIVE_BRIDGE" # Forward bridging scaffold without mandatory retake
    REINFORCE = "REINFORCE"      # Moderate understanding -> 2 practice cards on weak subtopic
    REVISE = "REVISE"            # Historical fallback (now supports forward bridge)

