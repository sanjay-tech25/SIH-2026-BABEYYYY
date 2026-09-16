from app.core.database import Base
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_goal import UserGoal
from app.models.user_preference import UserPreference
from app.models.course import Course
from app.models.module import Module
from app.models.concept import Concept
from app.models.concept_prerequisite import ConceptPrerequisite
from app.models.lesson import Lesson
from app.models.learning_resource import LearningResource
from app.models.assessment import Assessment
from app.models.question import Question
from app.models.answer_option import AnswerOption
from app.models.assessment_attempt import AssessmentAttempt
from app.models.assessment_response import AssessmentResponse
from app.models.learner_mastery import LearnerMastery
from app.models.learning_path import LearningPath
from app.models.learning_path_item import LearningPathItem
from app.models.recommendation import Recommendation
from app.models.lesson_completion import LessonCompletion
from app.models.progress_event import ProgressEvent
from app.models.xp_transaction import XPTransaction
from app.models.streak import Streak
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement
from app.models.mascot_event import MascotEvent
from app.models.focus_session import FocusSession
from app.models.break_record import BreakRecord
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.models.circuit import Circuit
from app.models.circuit_execution import CircuitExecution
from app.models.audit_log import AuditLog

__all__ = [
    "Base",
    "User",
    "UserProfile",
    "UserGoal",
    "UserPreference",
    "Course",
    "Module",
    "Concept",
    "ConceptPrerequisite",
    "Lesson",
    "LearningResource",
    "Assessment",
    "Question",
    "AnswerOption",
    "AssessmentAttempt",
    "AssessmentResponse",
    "LearnerMastery",
    "LearningPath",
    "LearningPathItem",
    "Recommendation",
    "LessonCompletion",
    "ProgressEvent",
    "XPTransaction",
    "Streak",
    "Achievement",
    "UserAchievement",
    "MascotEvent",
    "FocusSession",
    "BreakRecord",
    "AIConversation",
    "AIMessage",
    "Circuit",
    "CircuitExecution",
    "AuditLog"
]
