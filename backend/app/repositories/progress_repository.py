from typing import List, Optional
from datetime import date, datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.learning_path import LearningPath
from app.models.learning_path_item import LearningPathItem
from app.models.lesson_completion import LessonCompletion
from app.models.xp_transaction import XPTransaction
from app.models.streak import Streak
from app.models.progress_event import ProgressEvent


class ProgressRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_learning_path(self, user_id: str) -> Optional[LearningPath]:
        result = await self.db.execute(
            select(LearningPath)
            .options(
                selectinload(LearningPath.items).selectinload(LearningPathItem.lesson),
                selectinload(LearningPath.course)
            )
            .where(LearningPath.user_id == user_id, LearningPath.is_active == True)
        )
        return result.scalar_one_or_none()

    async def create_learning_path(self, path: LearningPath) -> LearningPath:
        self.db.add(path)
        await self.db.commit()
        await self.db.refresh(path)
        return path

    async def record_lesson_completion(self, user_id: str, lesson_id: str, time_spent: int, xp_earned: int) -> LessonCompletion:
        result = await self.db.execute(
            select(LessonCompletion).where(
                LessonCompletion.user_id == user_id,
                LessonCompletion.lesson_id == lesson_id
            )
        )
        completion = result.scalar_one_or_none()
        if not completion:
            completion = LessonCompletion(
                user_id=user_id,
                lesson_id=lesson_id,
                time_spent_seconds=time_spent,
                xp_earned=xp_earned
            )
            self.db.add(completion)
        else:
            completion.time_spent_seconds += time_spent
        await self.db.commit()
        await self.db.refresh(completion)
        return completion

    async def get_completed_lesson_ids(self, user_id: str) -> List[str]:
        result = await self.db.execute(
            select(LessonCompletion.lesson_id).where(LessonCompletion.user_id == user_id)
        )
        return list(result.scalars().all())

    async def add_xp_transaction(self, user_id: str, amount: int, source_type: str, description: str) -> XPTransaction:
        tx = XPTransaction(
            user_id=user_id,
            amount=amount,
            source_type=source_type,
            description=description
        )
        self.db.add(tx)
        await self.db.commit()
        await self.db.refresh(tx)
        return tx

    async def get_user_total_xp(self, user_id: str) -> int:
        result = await self.db.execute(
            select(func.coalesce(func.sum(XPTransaction.amount), 0)).where(XPTransaction.user_id == user_id)
        )
        return int(result.scalar_one())

    async def get_or_create_streak(self, user_id: str) -> Streak:
        result = await self.db.execute(select(Streak).where(Streak.user_id == user_id))
        streak = result.scalar_one_or_none()
        if not streak:
            streak = Streak(
                user_id=user_id,
                current_streak=1,
                longest_streak=1,
                last_activity_date=datetime.now(timezone.utc).date()
            )
            self.db.add(streak)
            await self.db.commit()
            await self.db.refresh(streak)
        return streak

    async def record_progress_event(self, user_id: str, event_type: str, payload: dict) -> ProgressEvent:
        event = ProgressEvent(user_id=user_id, event_type=event_type, event_payload=payload)
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event
