from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.achievement_service import AchievementService
from app.schemas.achievement import AchievementRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("", response_model=APIResponse[List[AchievementRead]])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AchievementService(db)
    badges = await service.list_user_achievements(current_user.id)
    return APIResponse(data=badges)
