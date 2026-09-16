from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.instructor import InstructorOverviewRead, ConceptHeatmapItem


class InstructorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analytics_repo = AnalyticsRepository(db)

    async def get_overview_analytics(self) -> InstructorOverviewRead:
        overview = await self.analytics_repo.get_overview_metrics()
        heatmap_data = await self.analytics_repo.get_concept_struggle_heatmap()

        heatmap_items = [
            ConceptHeatmapItem(
                concept_id=h["concept_id"],
                average_mastery=h["average_mastery"],
                learners_tested=h["learners_tested"]
            )
            for h in heatmap_data
        ]

        return InstructorOverviewRead(
            total_registered_learners=overview["total_registered_learners"],
            total_assessments_taken=overview["total_assessments_taken"],
            total_focus_sessions_completed=overview["total_focus_sessions_completed"],
            platform_average_quiz_score=overview["platform_average_quiz_score"],
            concept_struggle_heatmap=heatmap_items
        )
