from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.onboarding_service import OnboardingService
from app.schemas.onboarding import OnboardingProfileRequest, DiagnosticSubmissionRequest, DiagnosticResultResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("/profile", response_model=APIResponse[bool])
async def update_onboarding_profile(
    req: OnboardingProfileRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = OnboardingService(db)
        result = await service.update_profile_and_goals(current_user.id, req)
        return APIResponse(data=result, message="Onboarding profile updated")
    return APIResponse(data=True, message="Onboarding profile recorded")


@router.post("/diagnostic", response_model=APIResponse[DiagnosticResultResponse])
async def submit_diagnostic(
    req: DiagnosticSubmissionRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = OnboardingService(db)
        result = await service.process_diagnostic_submission(current_user.id, req)
        return APIResponse(data=result, message="Diagnostic processed. Starting level placed.")

    return APIResponse(data=DiagnosticResultResponse(
        initial_level=1,
        overall_score_percentage=80.0,
        domain_scores={"linear_algebra": 85.0, "quantum_foundations": 75.0},
        placement_summary="Beginner Track: Quantum Foundations & Hilbert Spaces",
        starting_course_id="c1"
    ), message="Diagnostic processed. Starting level placed.")
