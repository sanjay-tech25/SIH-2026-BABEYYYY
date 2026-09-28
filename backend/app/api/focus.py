from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.focus_service import FocusService
from app.schemas.focus import FocusSessionStartRequest, FocusStatusResponse, DistractionEventRequest
from app.schemas.common import APIResponse

router = APIRouter(prefix="/focus", tags=["Focus"])


@router.post("/start", response_model=APIResponse[FocusStatusResponse])
async def start_focus(
    req: FocusSessionStartRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = FocusService(db)
        status_resp = await service.start_session(current_user.id, req.target_duration_seconds)
        return APIResponse(data=status_resp)
    return APIResponse(data=FocusStatusResponse(
        session_id="guest_session",
        is_active=True,
        is_break_locked=False,
        break_duration_seconds=300,
        consecutive_sessions=1,
        message="Focus session active"
    ))


@router.post("/complete", response_model=APIResponse[FocusStatusResponse])
async def complete_focus(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = FocusService(db)
        status_resp = await service.complete_session(current_user.id)
        return APIResponse(data=status_resp)
    return APIResponse(data=FocusStatusResponse(
        session_id="guest_session",
        is_active=False,
        is_break_locked=False,
        break_duration_seconds=0,
        consecutive_sessions=0,
        message="Focus session completed"
    ))


@router.post("/break-skip", response_model=APIResponse[FocusStatusResponse])
async def skip_break(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = FocusService(db)
        status_resp = await service.skip_break(current_user.id)
        return APIResponse(data=status_resp)
    return APIResponse(data=FocusStatusResponse(
        session_id="guest_session",
        is_active=True,
        is_break_locked=False,
        break_duration_seconds=0,
        consecutive_sessions=1,
        message="Break skipped"
    ))


@router.post("/break-done", response_model=APIResponse[FocusStatusResponse])
async def complete_break(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = FocusService(db)
        status_resp = await service.complete_break(current_user.id)
        return APIResponse(data=status_resp)
    return APIResponse(data=FocusStatusResponse(
        session_id="guest_session",
        is_active=False,
        is_break_locked=False,
        break_duration_seconds=0,
        consecutive_sessions=0,
        message="Break completed"
    ))


@router.post("/distraction", response_model=APIResponse[dict])
async def record_distraction(
    req: DistractionEventRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = FocusService(db)
        nudge = await service.handle_distraction_event(current_user.id, req.idle_duration_seconds)
        return APIResponse(data=nudge, message="Distraction event processed and nudge dispatched")
    return APIResponse(data={"nudge": "Stay focused on quantum computing!"}, message="Distraction event processed")
