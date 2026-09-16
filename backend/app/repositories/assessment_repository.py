from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.assessment import Assessment
from app.models.question import Question
from app.models.answer_option import AnswerOption
from app.models.assessment_attempt import AssessmentAttempt
from app.models.assessment_response import AssessmentResponse


class AssessmentRepository(BaseRepository[Assessment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Assessment, db)

    async def get_with_questions(self, assessment_id: str) -> Optional[Assessment]:
        result = await self.db.execute(
            select(Assessment)
            .options(
                selectinload(Assessment.questions).selectinload(Question.options),
                selectinload(Assessment.questions).selectinload(Question.concept)
            )
            .where(Assessment.id == assessment_id)
        )
        return result.scalar_one_or_none()

    async def get_diagnostic_assessment(self) -> Optional[Assessment]:
        result = await self.db.execute(
            select(Assessment)
            .options(
                selectinload(Assessment.questions).selectinload(Question.options),
                selectinload(Assessment.questions).selectinload(Question.concept)
            )
            .where(Assessment.assessment_type == "DIAGNOSTIC")
        )
        return result.scalar_one_or_none()

    async def create_attempt(self, attempt: AssessmentAttempt) -> AssessmentAttempt:
        self.db.add(attempt)
        await self.db.commit()
        await self.db.refresh(attempt)
        return attempt

    async def get_attempt(self, attempt_id: str) -> Optional[AssessmentAttempt]:
        result = await self.db.execute(
            select(AssessmentAttempt)
            .options(
                selectinload(AssessmentAttempt.responses).selectinload(AssessmentResponse.question),
                selectinload(AssessmentAttempt.responses).selectinload(AssessmentResponse.selected_option),
                selectinload(AssessmentAttempt.assessment)
            )
            .where(AssessmentAttempt.id == attempt_id)
        )
        return result.scalar_one_or_none()

    async def get_user_attempts(self, user_id: str) -> List[AssessmentAttempt]:
        result = await self.db.execute(
            select(AssessmentAttempt)
            .where(AssessmentAttempt.user_id == user_id)
            .order_by(AssessmentAttempt.created_at.desc())
        )
        return list(result.scalars().all())
