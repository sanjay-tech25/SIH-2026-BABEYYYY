from enum import Enum


class MasteryLevel(str, Enum):
    NOVICE = "NOVICE"            # P(L) < 0.40
    DEVELOPING = "DEVELOPING"    # 0.40 <= P(L) < 0.70
    PROFICIENT = "PROFICIENT"    # 0.70 <= P(L) < 0.85
    MASTERED = "MASTERED"        # P(L) >= 0.85


class RecommendationAction(str, Enum):
    ADVANCE = "ADVANCE"          # Passed concept threshold -> Move to next DAG node
    REINFORCE = "REINFORCE"      # Moderate understanding -> 2 practice cards on weak subtopic
    REVISE = "REVISE"            # Weak understanding -> Fall back to prerequisite concept node
