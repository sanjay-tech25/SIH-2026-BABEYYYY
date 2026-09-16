from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.achievement_repository import AchievementRepository
from app.schemas.achievement import AchievementRead


class AchievementService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ach_repo = AchievementRepository(db)

    async def list_user_achievements(self, user_id: str) -> List[AchievementRead]:
        all_badges = await self.ach_repo.get_all_badges()
        unlocked = await self.ach_repo.get_user_unlocked_achievements(user_id)
        unlocked_map = {u.achievement_id: u.unlocked_at for u in unlocked}

        result = []
        for badge in all_badges:
            is_unlocked = badge.id in unlocked_map
            result.append(
                AchievementRead(
                    id=badge.id,
                    slug=badge.slug,
                    title=badge.title,
                    description=badge.description,
                    category=badge.category,
                    icon_url=badge.icon_url,
                    xp_bonus=badge.xp_bonus,
                    unlocked=is_unlocked,
                    unlocked_at=unlocked_map[badge.id].isoformat() if is_unlocked else None
                )
            )
        return result
