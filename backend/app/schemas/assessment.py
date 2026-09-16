from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AnswerOptionRead(BaseModel):
    id: str
    option_text: str
    order_index: int


class QuestionRead(BaseModel):
    id: str
    question_type: str
    prompt: str
    difficulty: float
    order_index: int
    options: List[AnswerOptionRead]


class AssessmentDetailRead(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    pass_percentage: int
    xp_reward: int
    questions: List[QuestionRead]


class SubmitAnswerItem(BaseModel):
    question_id: str
    selected_option_id: str


class AssessmentSubmissionRequest(BaseModel):
    answers: List[SubmitAnswerItem]


class QuestionFeedbackRead(BaseModel):
    question_id: str
    is_correct: bool
    selected_option_id: Optional[str] = None
    correct_option_id: Optional[str] = None
    feedback_text: str


class AssessmentResultRead(BaseModel):
    attempt_id: str
    score_percentage: float
    correct_count: int
    total_questions: int
    passed: bool
    xp_earned: int
    new_mastery_score: float
    mastery_level: str
    recommendation: Dict[str, Any]
    feedback: List[QuestionFeedbackRead]
