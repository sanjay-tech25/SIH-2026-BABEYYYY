from typing import Optional, Dict, Any
from pydantic import BaseModel


class MascotStateResponse(BaseModel):
    state: str  # HAPPY, THINKING, ENCOURAGING, CELEBRATING, etc.
    dialogue: str
    last_trigger: str
    metadata: Dict[str, Any] = {}


class MascotInteractionRequest(BaseModel):
    interaction_type: str = "TAP"  # "TAP", "HELP_REQUEST", "IDLE"
    current_screen: Optional[str] = "dashboard"


class IdleNudgeRequest(BaseModel):
    idle_duration_seconds: int
    current_concept_key: Optional[str] = None
