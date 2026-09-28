from typing import List, Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.instructor_service import InstructorService
from app.schemas.instructor import (
    InstructorOverviewRead,
    StudentMonitoringItem,
    RemediationDispatchRequest,
    RemediationDispatchResponse
)
from app.schemas.common import APIResponse

router = APIRouter(prefix="/instructor", tags=["Instructor Analytics"])


@router.get(
    "/analytics",
    response_model=APIResponse[InstructorOverviewRead]
)
async def get_instructor_analytics(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns cohort size, average quiz performance, and concept struggle heatmap."""
    service = InstructorService(db)
    overview = await service.get_overview_analytics()
    return APIResponse(data=overview)


@router.get(
    "/students",
    response_model=APIResponse[List[StudentMonitoringItem]]
)
async def get_students_monitoring(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns student monitoring directory with active chapter, diagnostic scores, and integrity telemetry."""
    service = InstructorService(db)
    students = await service.get_students_monitoring()
    return APIResponse(data=students, message="Student monitoring directory retrieved")


@router.post(
    "/remediation/dispatch",
    response_model=APIResponse[RemediationDispatchResponse]
)
async def dispatch_remediation(
    req: RemediationDispatchRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Dispatches targeted pedagogical remediation katas to struggling learners."""
    service = InstructorService(db)
    res = await service.dispatch_remediation(req)
    return APIResponse(data=res, message="Remediation dispatched successfully")


@router.get(
    "/export/gradebook"
)
async def export_gradebook_csv(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Exports student cohort gradebook and integrity records in CSV format."""
    service = InstructorService(db)
    csv_content = await service.export_gradebook_csv()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=quantech_cohort_gradebook.csv"}
    )
