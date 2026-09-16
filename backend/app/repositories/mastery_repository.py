from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.learner_mastery import LearnerMastery


class MasteryRepository(BaseRepository[LearnerMastery]):
    def __init__(self, db: AsyncSession):
        super().__init__(LearnerMastery, db)

    async def get_user_mastery_by_concept(self, user_id: str, concept_id: str) -> Optional[LearnerMastery]:
        result = await self.db.execute(
            select(LearnerMastery)
            .options(selectinload(LearnerMastery.concept))
            .where(
                LearnerMastery.user_id == user_id,
                LearnerMastery.concept_id == concept_id
            )
        )
        return result.scalar_one_or_none()

    async def get_all_user_masteries(self, user_id: str) -> List[LearnerMastery]:
        result = await self.db.execute(
            select(LearnerMastery)
            .options(selectinload(LearnerMastery.concept))
            .where(LearnerMastery.user_id == user_id)
        )
        return list(result.scalars().all())

    async def upsert_mastery(
        self,
        user_id: str,
        concept_id: str,
        mastery_score: float,
        confidence_score: float,
        mastery_level: str
    ) -> LearnerMastery:
        mastery = await self.get_user_mastery_by_concept(user_id, concept_id)
        if not mastery:
            mastery = LearnerMastery(
                user_id=user_id,
                concept_id=concept_id,
                mastery_score=mastery_score,
                confidence_score=confidence_score,
                mastery_level=mastery_level,
                last_assessed_at=datetime.now(timezone.utc)
            )
            self.db.add(mastery)
        else:
            mastery.mastery_score = mastery_score
            mastery.confidence_score = confidence_score
            mastery.mastery_level = mastery_level
            mastery.last_assessed_at = datetime.now(timezone.utc)
        
        await self.db.commit()
        await self.db.refresh(mastery)
        return mastery
