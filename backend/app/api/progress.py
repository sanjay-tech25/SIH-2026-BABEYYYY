from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.progress_service import ProgressService
from app.schemas.progress import ProgressOverviewRead, StreakStatusRead, ConceptMasterySummary
from app.schemas.common import APIResponse

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/summary", response_model=APIResponse[ProgressOverviewRead])
async def get_progress_summary(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        service = ProgressService(db)
        summary = await service.get_user_progress_overview(current_user.id)
        return APIResponse(data=summary)

    return APIResponse(data=ProgressOverviewRead(
        current_level=4,
        total_xp=3450,
        xp_in_level=450,
        xp_needed_next_level=1500,
        streak=StreakStatusRead(
            current_streak=5,
            longest_streak=12,
            freeze_tokens_available=2,
            active_today=True
        ),
        completed_lessons_count=14,
        concept_masteries=[
            ConceptMasterySummary(concept_id="math_foundations", concept_name="Linear Algebra & Hilbert Spaces", category="FOUNDATIONAL", mastery_score=0.95, mastery_level="MASTERED"),
            ConceptMasterySummary(concept_id="bloch_sphere", concept_name="Bloch Sphere & Relative Phase", category="CORE", mastery_score=0.91, mastery_level="MASTERED"),
            ConceptMasterySummary(concept_id="single_qubit_gates", concept_name="Unitary Operations & Pauli Gates", category="CORE", mastery_score=0.83, mastery_level="PROFICIENT"),
            ConceptMasterySummary(concept_id="entanglement", concept_name="Bell States & Teleportation", category="ADVANCED", mastery_score=0.71, mastery_level="DEVELOPING"),
        ]
    ))
