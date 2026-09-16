from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class FocusSessionStartRequest(BaseModel):
    target_duration_seconds: int = Field(default=1500, ge=300, le=7200)  # 25 mins default


class FocusStatusResponse(BaseModel):
    status: str
    cycle_number: int
    is_mandatory_break: bool
    break_skipped: bool
    message: str


class DistractionEventRequest(BaseModel):
    idle_duration_seconds: int
    event_context: Optional[str] = "lesson_view"
