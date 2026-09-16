from typing import List, Optional
from pydantic import BaseModel, Field


class TutorQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    current_concept_id: Optional[str] = None
    conversation_id: Optional[str] = None


class TutorAnswerResponse(BaseModel):
    conversation_id: str
    answer: str
    citations: List[str] = []
    is_grounded: bool = True
