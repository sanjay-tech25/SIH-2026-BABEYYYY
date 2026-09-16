from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class ContentCardSchema(BaseModel):
    card_id: str
    card_type: str  # "CONCEPT_EXPLANATION", "VISUAL_DIAGRAM", "INTERACTIVE_SNIPPET", "SUMMARY"
    title: str
    content: str
    media_url: Optional[str] = None


class ResourceSchema(BaseModel):
    id: str
    resource_type: str
    title: str
    content_payload: Dict[str, Any]


class LessonDetailRead(BaseModel):
    id: str
    title: str
    slug: str
    summary: str
    estimated_minutes: int
    xp_reward: int
    content_cards: List[Dict[str, Any]]
    resources: List[ResourceSchema] = []
    assessment_id: Optional[str] = None


class LessonCompleteRequest(BaseModel):
    time_spent_seconds: int = 600
