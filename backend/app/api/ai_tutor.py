from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.ai_tutor_service import AITutorService
from app.schemas.ai_tutor import TutorQueryRequest, TutorAnswerResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])


@router.post("/ask", response_model=APIResponse[TutorAnswerResponse])
async def ask_tutor(
    req: TutorQueryRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AITutorService(db)
    result = await service.ask_tutor(current_user.id, req)
    return APIResponse(data=result)
