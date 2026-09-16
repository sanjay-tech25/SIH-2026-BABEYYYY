from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_goal import UserGoal
from app.models.user_preference import UserPreference


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .options(
                selectinload(User.profile),
                selectinload(User.goal),
                selectinload(User.preference),
                selectinload(User.streak)
            )
            .where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_full_user(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .options(
                selectinload(User.profile),
                selectinload(User.goal),
                selectinload(User.preference),
                selectinload(User.streak)
            )
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_profile(self, user_id: str) -> Optional[UserProfile]:
        result = await self.db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
        return result.scalar_one_or_none()

    async def get_preferences(self, user_id: str) -> Optional[UserPreference]:
        result = await self.db.execute(select(UserPreference).where(UserPreference.user_id == user_id))
        return result.scalar_one_or_none()
