from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
import uuid
from app.constants.qubot_contracts import (
    QUBOTState,
    QUBOTEmotion,
    QUBOTAnimation,
    QUBOTIntent,
    QUBOTPriority,
    InterventionType,
    QUBOTActionType,
)


class QubotCharacterSnapshot(BaseModel):
    """Qubot character state, emotion, and semantic animation (Section 11, 12, 13, 14)."""
    state: QUBOTState = QUBOTState.IDLE
    emotion: QUBOTEmotion = QUBOTEmotion.NEUTRAL
    animation: str = QUBOTAnimation.IDLE_BREATHE.value


class QubotMessagePayload(BaseModel):
    """Qubot dialogue message and intent (Section 15)."""
    visible: bool = True
    intent: QUBOTIntent = QUBOTIntent.WELCOME
    text: str = ""


class QubotInterventionPayload(BaseModel):
    """Structured intervention details (Section 10)."""
    type: InterventionType = InterventionType.NONE
    required: bool = False
    action: QUBOTActionType = QUBOTActionType.NONE
    label: Optional[str] = None
    target_id: Optional[str] = None


class QubotSessionPayload(BaseModel):
    """Session and Pomodoro operational state (Section 18, 25)."""
    session_id: Optional[str] = None
    pomodoro_state: str = "IDLE"  # IDLE, FOCUS_ACTIVE, BREAK_SUGGESTED, BREAK_ACTIVE, BREAK_REQUIRED
    iteration: int = 1
    break_status: str = "NONE"  # NONE, SUGGESTED, SKIPPED, ACTIVE, REQUIRED


class QubotMetaPayload(BaseModel):
    """Cooldown and priority metadata (Section 26, 27)."""
    priority: QUBOTPriority = QUBOTPriority.NORMAL
    cooldown_seconds: int = 30
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class QubotResponseEnvelope(BaseModel):
    """Canonical Qubot Response Contract defined in Section 17."""
    qubot: QubotCharacterSnapshot = Field(default_factory=QubotCharacterSnapshot)
    message: QubotMessagePayload = Field(default_factory=QubotMessagePayload)
    intervention: QubotInterventionPayload = Field(default_factory=QubotInterventionPayload)
    session: QubotSessionPayload = Field(default_factory=QubotSessionPayload)
    meta: QubotMetaPayload = Field(default_factory=QubotMetaPayload)


class QubotEventEnvelope(BaseModel):
    """Normalized Event Envelope defined in Section 4."""
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    lesson_id: Optional[str] = None
    question_id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    payload: Dict[str, Any] = Field(default_factory=dict)


class QubotInteractionRequest(BaseModel):
    """Client Interaction Request defined in Section 16."""
    interaction: str  # REQUEST_HINT, ALTERNATIVE_EXPLANATION, TAKE_BREAK, SKIP_BREAK, DISMISS
    context: Dict[str, Any] = Field(default_factory=dict)
