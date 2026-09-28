from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.assessment_service import AssessmentService
from app.schemas.assessment import AssessmentDetailRead, AssessmentSubmissionRequest, AssessmentResultRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.get("/{assessment_id}", response_model=APIResponse[AssessmentDetailRead])
async def get_assessment(
    assessment_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = await service.get_assessment_for_quiz(assessment_id)
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return APIResponse(data=assessment)


@router.post("/{assessment_id}/submit", response_model=APIResponse[AssessmentResultRead])
async def submit_assessment(
    assessment_id: str,
    req: AssessmentSubmissionRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    user_id = current_user.id if current_user else None
    if not user_id:
        res = await db.execute(select(User).limit(1))
        first_u = res.scalar_one_or_none()
        if first_u:
            user_id = first_u.id
        else:
            user_id = "guest_user"

    result = await service.submit_assessment_attempt(user_id, assessment_id, req)
    return APIResponse(data=result, message="Assessment evaluated successfully")
