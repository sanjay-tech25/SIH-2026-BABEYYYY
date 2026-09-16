from typing import List, Optional
from pydantic import BaseModel


class ConceptMasterySummary(BaseModel):
    concept_id: str
    concept_name: str
    category: str
    mastery_score: float
    mastery_level: str


class StreakStatusRead(BaseModel):
    current_streak: int
    longest_streak: int
    freeze_tokens_available: int
    active_today: bool


class ProgressOverviewRead(BaseModel):
    current_level: int
    total_xp: int
    xp_in_level: int
    xp_needed_next_level: int
    streak: StreakStatusRead
    completed_lessons_count: int
    concept_masteries: List[ConceptMasterySummary]
