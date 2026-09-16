from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.curriculum_service import CurriculumService
from app.schemas.course import CourseRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=APIResponse[List[CourseRead]])
async def get_courses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CurriculumService(db)
    courses = await service.list_published_courses()
    return APIResponse(data=courses)
