from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.course_repository import CourseRepository
from app.schemas.course import CourseRead, ModuleSummarySchema, LessonSummarySchema


class CurriculumService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.course_repo = CourseRepository(db)

    async def list_published_courses(self) -> List[CourseRead]:
        courses = await self.course_repo.get_all_published()
        result = []
        for c in courses:
            modules_list = []
            for m in c.modules:
                lessons_list = [
                    LessonSummarySchema(
                        id=l.id,
                        slug=l.slug,
                        title=l.title,
                        order_index=l.order_index,
                        estimated_minutes=l.estimated_minutes,
                        xp_reward=l.xp_reward
                    )
                    for l in m.lessons
                ]
                modules_list.append(
                    ModuleSummarySchema(
                        id=m.id,
                        slug=m.slug,
                        title=m.title,
                        order_index=m.order_index,
                        lessons=lessons_list
                    )
                )
            result.append(
                CourseRead(
                    id=c.id,
                    slug=c.slug,
                    title=c.title,
                    description=c.description,
                    difficulty_level=c.difficulty_level,
                    estimated_hours=c.estimated_hours,
                    modules=modules_list
                )
            )
        return result
