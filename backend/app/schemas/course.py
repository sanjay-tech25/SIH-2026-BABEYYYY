from typing import List, Optional
from pydantic import BaseModel


class LessonSummarySchema(BaseModel):
    id: str
    slug: str
    title: str
    order_index: int
    estimated_minutes: int
    xp_reward: int


class ModuleSummarySchema(BaseModel):
    id: str
    slug: str
    title: str
    order_index: int
    lessons: List[LessonSummarySchema] = []


class CourseRead(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    difficulty_level: str
    estimated_hours: int
    modules: List[ModuleSummarySchema] = []
