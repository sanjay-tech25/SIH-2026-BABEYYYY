from typing import List, Dict, Any
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
