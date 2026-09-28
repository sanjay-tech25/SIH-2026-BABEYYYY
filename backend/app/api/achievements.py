from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.achievement_service import AchievementService
from app.schemas.achievement import AchievementRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("", response_model=APIResponse[List[AchievementRead]])
async def get_achievements(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = AchievementService(db)
        badges = await service.list_user_achievements(current_user.id)
        return APIResponse(data=badges)

    return APIResponse(data=[
        AchievementRead(id="b1", slug="quantum_pioneer", title="Quantum Pioneer", description="Executed first genuine quantum circuit simulation.", category="MILESTONE", icon_url="/icons/pioneer.svg", xp_bonus=50, unlocked=True, unlocked_at="2026-09-01T10:00:00Z"),
        AchievementRead(id="b2", slug="born_rule_master", title="Born Rule Master", description="Predicted measurement collapse distribution with zero divergence.", category="MASTERY", icon_url="/icons/target.svg", xp_bonus=100, unlocked=True, unlocked_at="2026-09-10T12:00:00Z"),
        AchievementRead(id="b3", slug="bell_entangler", title="Bell State Weaver", description="Synthesized maximally entangled 2-qubit EPR pairs.", category="MASTERY", icon_url="/icons/atom.svg", xp_bonus=150, unlocked=True, unlocked_at="2026-09-20T15:00:00Z"),
    ])
