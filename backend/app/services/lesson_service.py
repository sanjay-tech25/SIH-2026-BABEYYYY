from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.lesson_repository import LessonRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.user_repository import UserRepository
from app.engines.progression_engine import ProgressionEngine
from app.core.websocket_manager import ws_manager
from app.schemas.lesson import LessonDetailRead, ResourceSchema


class LessonService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.lesson_repo = LessonRepository(db)
        self.progress_repo = ProgressRepository(db)
        self.user_repo = UserRepository(db)

    async def get_lesson_detail(self, lesson_id: str) -> Optional[LessonDetailRead]:
        lesson = await self.lesson_repo.get_with_details(lesson_id)
        if not lesson:
            return None

        resources_list = [
            ResourceSchema(
                id=r.id,
                resource_type=r.resource_type,
                title=r.title,
                content_payload=r.content_payload
            )
            for r in lesson.resources
        ]

        return LessonDetailRead(
            id=lesson.id,
            title=lesson.title,
            slug=lesson.slug,
            summary=lesson.summary,
            estimated_minutes=lesson.estimated_minutes,
            xp_reward=lesson.xp_reward,
            content_cards=lesson.content_cards if isinstance(lesson.content_cards, list) else [],
            resources=resources_list,
            assessment_id=lesson.assessment.id if lesson.assessment else None
        )

    async def complete_lesson(self, user_id: str, lesson_id: str, time_spent: int) -> dict:
        lesson = await self.lesson_repo.get(lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        xp = lesson.xp_reward

        # Record completion
        completion = await self.progress_repo.record_lesson_completion(
            user_id=user_id,
            lesson_id=lesson_id,
            time_spent=time_spent,
            xp_earned=xp
        )

        # Award XP
        await self.progress_repo.add_xp_transaction(
            user_id=user_id,
            amount=xp,
            source_type="LESSON_COMPLETE",
            description=f"Completed lesson: {lesson.title}"
        )

        # Update user total XP & level check
        profile = await self.user_repo.get_profile(user_id)
        leveled_up = False
        if profile:
            old_xp = profile.total_xp
            new_xp = old_xp + xp
            profile.total_xp = new_xp
            level_info = ProgressionEngine.check_level_up(old_xp, new_xp)
            if level_info["leveled_up"]:
                profile.current_level = level_info["new_level"]
                leveled_up = True
            await self.db.commit()

        # Update streak
        await self.progress_repo.get_or_create_streak(user_id)

        # Push real-time WS notification
        await ws_manager.send_personal_event(
            user_id=user_id,
            event_type="LESSON_COMPLETED",
            payload={"lesson_id": lesson_id, "xp_earned": xp, "leveled_up": leveled_up}
        )

        return {"success": True, "xp_earned": xp, "leveled_up": leveled_up}
