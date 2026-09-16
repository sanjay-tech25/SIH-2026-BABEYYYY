from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.engines.qubot_decision_engine import QUBOTDecisionEngine
from app.models.mascot_event import MascotEvent
from app.schemas.qubot import (
    QUBOTResponse,
    QUBOTEventRequest,
    QUBOTDistractionRequest,
    QUBOTPreferenceSchema,
)


class MascotService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_current_qubot_state(self, user_id: str) -> QUBOTResponse:
        user = await self.user_repo.get_full_user(user_id)
        age_bracket = user.profile.age_bracket if (user and user.profile) else "STUDENT"

        display_name = user.profile.display_name if (user and user.profile) else (user.email.split('@')[0] if user else "Learner")
        return QUBOTDecisionEngine.evaluate(
            user_id=user_id,
            event_type="LOGIN",
            age_bracket=age_bracket,
            metadata={"user_name": display_name}
        )

    async def process_event(
        self,
        user_id: str,
        event_type: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> QUBOTResponse:
        user = await self.user_repo.get_full_user(user_id)
        age_bracket = user.profile.age_bracket if (user and user.profile) else "STUDENT"

        response = QUBOTDecisionEngine.evaluate(
            user_id=user_id,
            event_type=event_type,
            age_bracket=age_bracket,
            metadata=metadata
        )

        # Log meaningful mascot events (non-empty messages)
        if response.message:
            event = MascotEvent(
                user_id=user_id,
                state=response.state.value if hasattr(response.state, 'value') else str(response.state),
                trigger_event=event_type,
                dialogue_text=response.message
            )
            self.db.add(event)
            await self.db.commit()

        return response

    async def handle_distraction(
        self,
        user_id: str,
        req: QUBOTDistractionRequest
    ) -> QUBOTResponse:
        return await self.process_event(
            user_id=user_id,
            event_type=req.signal_type,
            metadata={"lesson_id": req.context_lesson_id}
        )

    async def get_preferences(self, user_id: str) -> QUBOTPreferenceSchema:
        user = await self.user_repo.get_full_user(user_id)
        age_bracket = user.profile.age_bracket if (user and user.profile) else "STUDENT"
        tone = "PROFESSIONAL" if age_bracket == "ADULT_PROFESSIONAL" else ("PLAYFUL" if age_bracket == "YOUNG" else "BALANCED")

        return QUBOTPreferenceSchema(
            enabled=True,
            sound_enabled=True,
            animation_level="LOW" if age_bracket == "ADULT_PROFESSIONAL" else "MEDIUM",
            message_frequency="MINIMAL" if age_bracket == "ADULT_PROFESSIONAL" else "MODERATE",
            tone=tone,
            focus_reminders=True,
            break_reminders=True
        )
