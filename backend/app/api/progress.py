from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.progress_service import ProgressService
from app.schemas.progress import ProgressOverviewRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/summary", response_model=APIResponse[ProgressOverviewRead])
async def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProgressService(db)
    summary = await service.get_user_progress_overview(current_user.id)
    return APIResponse(data=summary)
