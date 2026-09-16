from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.mascot_service import MascotService
from app.schemas.qubot import (
    QUBOTResponse,
    QUBOTEventRequest,
    QUBOTDistractionRequest,
    QUBOTPreferenceSchema,
)
from app.schemas.mascot import MascotStateResponse, MascotInteractionRequest
from app.schemas.common import APIResponse

router = APIRouter(prefix="/mascot", tags=["QUBOT Companion"])


@router.get("/state", response_model=APIResponse[QUBOTResponse])
async def get_mascot_state(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MascotService(db)
    state = await service.get_current_qubot_state(current_user.id)
    return APIResponse(data=state)


@router.post("/event", response_model=APIResponse[QUBOTResponse])
async def process_mascot_event(
    req: QUBOTEventRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MascotService(db)
    response = await service.process_event(
        user_id=current_user.id,
        event_type=req.event_type,
        metadata=req.metadata
    )
    return APIResponse(data=response)


@router.post("/distraction", response_model=APIResponse[QUBOTResponse])
async def handle_distraction(
    req: QUBOTDistractionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MascotService(db)
    response = await service.handle_distraction(current_user.id, req)
    return APIResponse(data=response)


@router.get("/preferences", response_model=APIResponse[QUBOTPreferenceSchema])
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MascotService(db)
    prefs = await service.get_preferences(current_user.id)
    return APIResponse(data=prefs)


@router.post("/interact", response_model=APIResponse[QUBOTResponse])
async def interact_with_mascot(
    req: MascotInteractionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = MascotService(db)
    response = await service.process_event(
        user_id=current_user.id,
        event_type="TAP",
        metadata={"interaction_type": req.interaction_type}
    )
    return APIResponse(data=response)
