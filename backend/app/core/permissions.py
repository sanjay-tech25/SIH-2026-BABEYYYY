from typing import List
from app.constants.roles import UserRole
from app.core.exceptions import ForbiddenException


def check_role_permission(user_role: str, allowed_roles: List[UserRole]):
    """Verify that user_role belongs to one of allowed_roles."""
    if user_role not in [role.value for role in allowed_roles]:
        raise ForbiddenException(
            f"Operation requires one of the following roles: {[r.value for r in allowed_roles]}"
        )
