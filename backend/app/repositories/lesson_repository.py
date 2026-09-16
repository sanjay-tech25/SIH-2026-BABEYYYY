from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.lesson import Lesson
from app.models.learning_resource import LearningResource


class LessonRepository(BaseRepository[Lesson]):
    def __init__(self, db: AsyncSession):
        super().__init__(Lesson, db)

    async def get_with_details(self, lesson_id: str) -> Optional[Lesson]:
        result = await self.db.execute(
            select(Lesson)
            .options(
                selectinload(Lesson.resources),
                selectinload(Lesson.concept),
                selectinload(Lesson.assessment)
            )
            .where(Lesson.id == lesson_id)
        )
        return result.scalar_one_or_none()

    async def get_by_concept(self, concept_id: str) -> List[Lesson]:
        result = await self.db.execute(
            select(Lesson)
            .options(selectinload(Lesson.resources))
            .where(Lesson.concept_id == concept_id)
            .order_by(Lesson.order_index)
        )
        return list(result.scalars().all())

    async def get_resources_by_lesson(self, lesson_id: str) -> List[LearningResource]:
        result = await self.db.execute(
            select(LearningResource).where(LearningResource.lesson_id == lesson_id)
        )
        return list(result.scalars().all())
