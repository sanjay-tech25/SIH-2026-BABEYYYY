from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.lesson_service import LessonService
from app.schemas.lesson import LessonDetailRead, LessonCompleteRequest
from app.schemas.common import APIResponse

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("/{lesson_id}", response_model=APIResponse[LessonDetailRead])
async def get_lesson(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = LessonService(db)
    lesson = await service.get_lesson_detail(lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return APIResponse(data=lesson)


@router.post("/{lesson_id}/complete", response_model=APIResponse[dict])
async def complete_lesson(
    lesson_id: str,
    req: LessonCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = LessonService(db)
    result = await service.complete_lesson(current_user.id, lesson_id, req.time_spent_seconds)
    return APIResponse(data=result, message="Lesson marked completed")
