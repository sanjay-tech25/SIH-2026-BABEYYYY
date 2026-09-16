from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class OnboardingProfileRequest(BaseModel):
    age_bracket: str = Field(default="STUDENT")  # YOUNG, STUDENT, ADULT
    persona: str = Field(default="high_school_student")
    primary_goal: str = Field(default="learn_quantum_basics")
    target_daily_minutes: int = Field(default=30)
    visual_density: str = Field(default="standard")
    reduced_motion: bool = Field(default=False)


class DiagnosticAnswerSubmission(BaseModel):
    question_id: str
    selected_option_id: str


class DiagnosticSubmissionRequest(BaseModel):
    answers: List[DiagnosticAnswerSubmission]


class DiagnosticResultResponse(BaseModel):
    initial_level: int
    overall_score_percentage: float
    domain_scores: Dict[str, float]
    placement_summary: str
    starting_course_id: str
