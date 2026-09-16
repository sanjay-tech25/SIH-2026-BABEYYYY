from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.progress_repository import ProgressRepository
from app.repositories.mastery_repository import MasteryRepository
from app.repositories.user_repository import UserRepository
from app.engines.progression_engine import ProgressionEngine
from app.schemas.progress import ProgressOverviewRead, StreakStatusRead, ConceptMasterySummary


class ProgressService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.progress_repo = ProgressRepository(db)
        self.mastery_repo = MasteryRepository(db)
        self.user_repo = UserRepository(db)

    async def get_user_progress_overview(self, user_id: str) -> ProgressOverviewRead:
        profile = await self.user_repo.get_profile(user_id)
        total_xp = profile.total_xp if profile else 0

        level, xp_in_lvl, needed = ProgressionEngine.calculate_level(total_xp)

        streak = await self.progress_repo.get_or_create_streak(user_id)
        streak_read = StreakStatusRead(
            current_streak=streak.current_streak,
            longest_streak=streak.longest_streak,
            freeze_tokens_available=streak.freeze_tokens_available,
            active_today=True
        )

        completed_lessons = await self.progress_repo.get_completed_lesson_ids(user_id)
        masteries = await self.mastery_repo.get_all_user_masteries(user_id)

        mastery_summaries = [
            ConceptMasterySummary(
                concept_id=m.concept_id,
                concept_name=m.concept.name if m.concept else "Concept",
                category=m.concept.category if m.concept else "CORE",
                mastery_score=m.mastery_score,
                mastery_level=m.mastery_level
            )
            for m in masteries
        ]

        return ProgressOverviewRead(
            current_level=level,
            total_xp=total_xp,
            xp_in_level=xp_in_lvl,
            xp_needed_next_level=needed,
            streak=streak_read,
            completed_lessons_count=len(completed_lessons),
            concept_masteries=mastery_summaries
        )
