from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.models.user import User
from app.constants.roles import UserRole
from app.services.instructor_service import InstructorService
from app.schemas.instructor import InstructorOverviewRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/instructor", tags=["Instructor Analytics"])


@router.get(
    "/analytics",
    response_model=APIResponse[InstructorOverviewRead],
    dependencies=[Depends(require_role(UserRole.INSTRUCTOR, UserRole.ADMIN))]
)
async def get_instructor_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = InstructorService(db)
    overview = await service.get_overview_analytics()
    return APIResponse(data=overview)
