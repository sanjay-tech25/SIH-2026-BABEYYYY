from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user
from app.models.user import User
from app.services.user_service import UserService
from app.schemas.user import UserRead, UserProfileUpdateSchema
from app.schemas.common import APIResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=APIResponse[UserRead])
async def get_current_user_profile(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves the active learner profile with institutional affiliation, age tier, and competency metrics."""
    service = UserService(db)
    if current_user:
        user_data = await service.get_user_read(current_user.id)
    else:
        default_user = await service.get_or_create_default_user()
        user_data = await service.get_user_read(default_user.id)
    return APIResponse(data=user_data, message="Learner profile retrieved successfully")


@router.put("/me", response_model=APIResponse[UserRead])
async def update_current_user_profile(
    updates: UserProfileUpdateSchema,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Updates learner profile information including name, email, institution, department, and learning goals."""
    service = UserService(db)
    user_id = current_user.id if current_user else (await service.get_or_create_default_user()).id
    updated_user = await service.update_user_profile(user_id, updates)
    return APIResponse(data=updated_user, message="Learner profile updated successfully")


@router.patch("/me", response_model=APIResponse[UserRead])
async def patch_current_user_profile(
    updates: UserProfileUpdateSchema,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Partially updates learner profile fields."""
    service = UserService(db)
    user_id = current_user.id if current_user else (await service.get_or_create_default_user()).id
    updated_user = await service.update_user_profile(user_id, updates)
    return APIResponse(data=updated_user, message="Learner profile updated successfully")
