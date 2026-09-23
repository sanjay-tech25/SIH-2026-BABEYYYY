from typing import List, Optional
from pydantic import BaseModel, Field


class TutorQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    current_concept_id: Optional[str] = None
    current_topic_id: Optional[str] = None
    current_chapter_id: Optional[str] = None
    mode: Optional[str] = "socratic_guidance"  # "socratic_guidance", "misconception_remedy", "concept_discovery", "thought_experiment"
    conversation_id: Optional[str] = None
    selected_option: Optional[str] = None
    correct_option: Optional[str] = None


class TutorAnswerResponse(BaseModel):
    conversation_id: str
    answer: str
    concept_title: Optional[str] = None
    analogy: Optional[str] = None
    socratic_inquiry: Optional[str] = None
    micro_action: Optional[str] = None
    citations: List[str] = []
    vault_citations: List[str] = []
    is_grounded: bool = True


class TopicScaffoldResponse(BaseModel):
    topic_id: str
    title: str
    folder: str
    slug: str
    definition: str
    intuition: str
    common_mistakes: str
    math_foundation: str
    key_equations: str
    circuit: str
    vault_citations: List[str] = []
