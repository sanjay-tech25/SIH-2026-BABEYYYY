from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class ConceptHeatmapItem(BaseModel):
    concept_id: str
    average_mastery: float
    learners_tested: int


class InstructorOverviewRead(BaseModel):
    total_registered_learners: int
    total_assessments_taken: int
    total_focus_sessions_completed: int
    platform_average_quiz_score: float
    concept_struggle_heatmap: List[ConceptHeatmapItem]


class StudentMonitoringItem(BaseModel):
    student_id: str
    email: str
    role: str
    active_chapter: str
    mastery_score: float
    diagnostic_tier: str
    integrity_confidence: float
    last_active: str


class RemediationDispatchRequest(BaseModel):
    student_id: str
    concept_id: str
    remediation_type: str = "TARGETED_KATA"
    custom_note: Optional[str] = None


class RemediationDispatchResponse(BaseModel):
    dispatch_id: str
    student_id: str
    concept_id: str
    status: str
    dispatched_at: float
    message: str
