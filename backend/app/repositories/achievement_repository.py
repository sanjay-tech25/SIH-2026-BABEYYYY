from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement


class AchievementRepository(BaseRepository[Achievement]):
    def __init__(self, db: AsyncSession):
        super().__init__(Achievement, db)

    async def get_all_badges(self) -> List[Achievement]:
        result = await self.db.execute(select(Achievement))
        return list(result.scalars().all())

    async def get_user_unlocked_achievements(self, user_id: str) -> List[UserAchievement]:
        result = await self.db.execute(
            select(UserAchievement)
            .options(selectinload(UserAchievement.achievement))
            .where(UserAchievement.user_id == user_id)
        )
        return list(result.scalars().all())

    async def unlock_achievement(self, user_id: str, achievement_id: str) -> Optional[UserAchievement]:
        result = await self.db.execute(
            select(UserAchievement).where(
                UserAchievement.user_id == user_id,
                UserAchievement.achievement_id == achievement_id
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            return None  # Already unlocked

        user_ach = UserAchievement(
            user_id=user_id,
            achievement_id=achievement_id,
            unlocked_at=datetime.now(timezone.utc)
        )
        self.db.add(user_ach)
        await self.db.commit()
        await self.db.refresh(user_ach)
        return user_ach
