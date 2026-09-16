from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.course import Course
from app.models.module import Module
from app.models.concept import Concept
from app.models.concept_prerequisite import ConceptPrerequisite


class CourseRepository(BaseRepository[Course]):
    def __init__(self, db: AsyncSession):
        super().__init__(Course, db)

    async def get_by_slug(self, slug: str) -> Optional[Course]:
        result = await self.db.execute(
            select(Course)
            .options(
                selectinload(Course.modules).selectinload(Module.lessons)
            )
            .where(Course.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_all_published(self) -> List[Course]:
        result = await self.db.execute(
            select(Course)
            .options(selectinload(Course.modules).selectinload(Module.lessons))
            .where(Course.is_published == True)
        )
        return list(result.scalars().all())

    async def get_all_concepts(self) -> List[Concept]:
        result = await self.db.execute(select(Concept))
        return list(result.scalars().all())

    async def get_concept_by_key(self, key: str) -> Optional[Concept]:
        result = await self.db.execute(select(Concept).where(Concept.key == key))
        return result.scalar_one_or_none()

    async def get_concept_prerequisites(self, concept_id: str) -> List[ConceptPrerequisite]:
        result = await self.db.execute(
            select(ConceptPrerequisite).where(ConceptPrerequisite.concept_id == concept_id)
        )
        return list(result.scalars().all())
