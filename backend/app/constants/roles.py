from enum import Enum


class UserRole(str, Enum):
    LEARNER = "LEARNER"
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"


class AgeBracket(str, Enum):
    YOUNG = "YOUNG"                      # < 16 years
    STUDENT = "STUDENT"                  # 16-24 years
    ADULT_PROFESSIONAL = "ADULT"         # 25+ years
