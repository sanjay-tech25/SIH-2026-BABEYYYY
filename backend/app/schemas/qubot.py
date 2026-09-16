from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.constants.mascot_states import MascotState
from app.constants.qubot_contracts import (
    QUBOTIntent,
    QUBOTActionType,
    QUBOTPriority,
    QUBOTTone,
    QUBOTAnimationLevel,
)


class QUBOTAction(BaseModel):
    type: QUBOTActionType = QUBOTActionType.NONE
    target_id: Optional[str] = None
    label: Optional[str] = None


class QUBOTResponse(BaseModel):
    mascot: str = "QUBOT"
    state: MascotState = MascotState.IDLE
    intent: QUBOTIntent = QUBOTIntent.WELCOME
    message: str
    dialogue: Optional[str] = None
    priority: QUBOTPriority = QUBOTPriority.NORMAL
    action: QUBOTAction = Field(default_factory=QUBOTAction)
    animation: str = "idle"
    dismissible: bool = True
    expires_at: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def model_post_init(self, __context: Any) -> None:
        if not self.dialogue:
            self.dialogue = self.message


class QUBOTEventRequest(BaseModel):
    event_type: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class QUBOTDistractionRequest(BaseModel):
    signal_type: str = "WINDOW_BLUR"  # TAB_SWITCH, WINDOW_BLUR, USER_INACTIVE
    context_lesson_id: Optional[str] = None


class QUBOTPreferenceSchema(BaseModel):
    enabled: bool = True
    sound_enabled: bool = True
    animation_level: QUBOTAnimationLevel = QUBOTAnimationLevel.MEDIUM
    message_frequency: str = "MODERATE"  # MINIMAL, MODERATE, FREQUENT
    tone: QUBOTTone = QUBOTTone.BALANCED
    focus_reminders: bool = True
    break_reminders: bool = True
