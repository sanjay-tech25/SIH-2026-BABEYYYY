from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user import User
from app.models.learner_mastery import LearnerMastery
from app.models.assessment_attempt import AssessmentAttempt
from app.models.focus_session import FocusSession


class AnalyticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_overview_metrics(self) -> Dict[str, Any]:
        total_users = await self.db.scalar(select(func.count(User.id)))
        total_attempts = await self.db.scalar(select(func.count(AssessmentAttempt.id)))
        total_focus = await self.db.scalar(select(func.count(FocusSession.id)))
        avg_score = await self.db.scalar(select(func.avg(AssessmentAttempt.score_percentage)))

        return {
            "total_registered_learners": total_users or 0,
            "total_assessments_taken": total_attempts or 0,
            "total_focus_sessions_completed": total_focus or 0,
            "platform_average_quiz_score": round(float(avg_score or 0.0), 2)
        }

    async def get_concept_struggle_heatmap(self) -> List[Dict[str, Any]]:
        result = await self.db.execute(
            select(
                LearnerMastery.concept_id,
                func.avg(LearnerMastery.mastery_score).label("avg_mastery"),
                func.count(LearnerMastery.id).label("student_count")
            )
            .group_by(LearnerMastery.concept_id)
        )
        return [
            {
                "concept_id": row.concept_id,
                "average_mastery": round(float(row.avg_mastery), 3),
                "learners_tested": row.student_count
            }
            for row in result.all()
        ]
