from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.qubot_v2 import (
    QubotResponseEnvelope,
    QubotEventEnvelope,
    QubotInteractionRequest,
    QubotSessionPayload,
)
from app.schemas.common import APIResponse
from app.engines.qubot_decision_engine import QUBOTDecisionEngine
from app.services.mascot_service import MascotService
from app.services.focus_service import FocusService
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/qubot", tags=["QUBOT Operations"])


@router.get("/state", response_model=APIResponse[QubotResponseEnvelope])
async def get_qubot_state(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """GET /api/v1/qubot/state - Returns current Qubot state snapshot for the active learner."""
    user_repo = UserRepository(db)
    full_user = await user_repo.get_full_user(current_user.id)
    age_bracket = full_user.profile.age_bracket if (full_user and full_user.profile) else "STUDENT"
    envelope = QUBOTDecisionEngine.evaluate_envelope(
        user_id=current_user.id,
        event_type="SESSION_RESUMED",
        age_bracket=age_bracket,
        metadata={"user_id": current_user.id}
    )
    return APIResponse(data=envelope, message="Current Qubot state retrieved")


@router.post("/events", response_model=APIResponse[QubotResponseEnvelope])
async def process_qubot_event(
    event: QubotEventEnvelope,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """POST /api/v1/qubot/events - Ingests a normalized learner event envelope."""
    user_repo = UserRepository(db)
    full_user = await user_repo.get_full_user(current_user.id)
    age_bracket = full_user.profile.age_bracket if (full_user and full_user.profile) else "STUDENT"
    meta = event.payload.copy()
    meta.update({
        "lesson_id": event.lesson_id,
        "question_id": event.question_id,
        "session_id": event.session_id,
        "user_id": current_user.id,
    })

    envelope = QUBOTDecisionEngine.evaluate_envelope(
        user_id=current_user.id,
        event_type=event.event_type,
        age_bracket=age_bracket,
        metadata=meta
    )
    return APIResponse(data=envelope, message="Qubot event processed")


@router.post("/interactions", response_model=APIResponse[QubotResponseEnvelope])
async def handle_qubot_interaction(
    req: QubotInteractionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """POST /api/v1/qubot/interactions - Handles explicit learner interactions with Qubot."""
    user_repo = UserRepository(db)
    full_user = await user_repo.get_full_user(current_user.id)
    age_bracket = full_user.profile.age_bracket if (full_user and full_user.profile) else "STUDENT"
    meta = req.context.copy()
    meta["interaction"] = req.interaction

    envelope = QUBOTDecisionEngine.evaluate_envelope(
        user_id=current_user.id,
        event_type=f"QUBOT_INTERACTION_{req.interaction}",
        age_bracket=age_bracket,
        metadata=meta
    )
    return APIResponse(data=envelope, message=f"Qubot interaction '{req.interaction}' handled")


@router.get("/session", response_model=APIResponse[QubotSessionPayload])
async def get_qubot_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """GET /api/v1/qubot/session - Retrieves active session and Pomodoro state."""
    focus_service = FocusService(db)
    latest = await focus_service.focus_repo.get_latest_session(current_user.id)
    
    if latest and latest.status in ["IN_FOCUS", "BREAK_SUGGESTED", "BREAK_REQUIRED", "BREAK_SKIPPED"]:
        payload = QubotSessionPayload(
            session_id=latest.id,
            pomodoro_state=latest.status,
            iteration=latest.cycle_number,
            break_status="REQUIRED" if latest.status == "BREAK_REQUIRED" else ("SKIPPED" if latest.break_skipped else "NONE")
        )
    else:
        payload = QubotSessionPayload(
            pomodoro_state="IDLE",
            iteration=1,
            break_status="NONE"
        )
    return APIResponse(data=payload, message="Active session retrieved")


@router.post("/session/start", response_model=APIResponse[QubotSessionPayload])
async def start_qubot_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """POST /api/v1/qubot/session/start - Initializes a new study session."""
    focus_service = FocusService(db)
    session_status = await focus_service.start_session(current_user.id)
    payload = QubotSessionPayload(
        pomodoro_state=session_status.status,
        iteration=session_status.cycle_number,
        break_status="NONE"
    )
    return APIResponse(data=payload, message="Study session started")


@router.post("/session/end", response_model=APIResponse[QubotSessionPayload])
async def end_qubot_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """POST /api/v1/qubot/session/end - Concludes active study session."""
    focus_service = FocusService(db)
    latest = await focus_service.focus_repo.get_latest_session(current_user.id)
    if latest and latest.status == "IN_FOCUS":
        await focus_service.complete_session(current_user.id)
    payload = QubotSessionPayload(
        pomodoro_state="IDLE",
        iteration=1,
        break_status="NONE"
    )
    return APIResponse(data=payload, message="Study session concluded")

