from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.assessment_service import AssessmentService
from app.schemas.assessment import AssessmentDetailRead, AssessmentSubmissionRequest, AssessmentResultRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.get("/{assessment_id}", response_model=APIResponse[AssessmentDetailRead])
async def get_assessment(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    result = await service.submit_assessment_attempt(current_user.id, assessment_id, req)
    return APIResponse(data=result, message="Assessment evaluated successfully")
