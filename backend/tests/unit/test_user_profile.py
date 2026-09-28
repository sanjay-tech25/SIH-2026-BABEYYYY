import pytest
from httpx import AsyncClient
from app.main import app
from app.services.user_service import UserService
from app.schemas.user import UserProfileUpdateSchema
from app.core.database import AsyncSessionLocal


@pytest.mark.asyncio
async def test_get_and_update_user_profile():
    async with AsyncSessionLocal() as db:
        service = UserService(db)
        default_user = await service.get_or_create_default_user()
        assert default_user is not None
        assert default_user.email == "manoj.quantum@edu.in"

        # Test reading user profile
        user_read = await service.get_user_read(default_user.id)
        assert user_read.profile is not None
        assert user_read.profile.display_name == "Manoj Kumar"
        assert "IIT Madras" in user_read.profile.institution

        # Test updating user profile
        updates = UserProfileUpdateSchema(
            display_name="Manoj Kumar Ph.D.",
            institution="Indian Institute of Technology Madras",
            department="Centre for Quantum Science & Technologies",
            learning_goal="Master Quantum Error Correction and Fault-Tolerant Algorithms"
        )
        updated_read = await service.update_user_profile(default_user.id, updates)
        assert updated_read.profile.display_name == "Manoj Kumar Ph.D."
        assert updated_read.profile.institution == "Indian Institute of Technology Madras"
        assert updated_read.profile.department == "Centre for Quantum Science & Technologies"
        assert "Fault-Tolerant" in updated_read.profile.learning_goal
