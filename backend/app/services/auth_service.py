from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_goal import UserGoal
from app.models.user_preference import UserPreference
from app.models.streak import Streak
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedException, DuplicateEntityException
from app.schemas.auth import RegisterRequest, LoginRequest, OAuth2LoginRequest, TokenResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, req: RegisterRequest) -> TokenResponse:
        existing = await self.user_repo.get_by_email(req.email)
        if existing:
            raise DuplicateEntityException("User", "email", req.email)

        role = req.role if req.role in ("LEARNER", "INSTRUCTOR", "ADMIN") else "LEARNER"
        user = User(
            email=req.email,
            password_hash=get_password_hash(req.password),
            role=role,
            is_active=True,
            is_onboarded=False
        )
        self.db.add(user)
        await self.db.flush()

        profile = UserProfile(
            user_id=user.id,
            display_name=req.display_name,
            age_bracket=req.age_bracket,
            persona="student" if req.age_bracket == "STUDENT" else "explorer"
        )
        goal = UserGoal(user_id=user.id)
        preference = UserPreference(user_id=user.id)
        streak = Streak(user_id=user.id)

        self.db.add_all([profile, goal, preference, streak])
        await self.db.commit()
        await self.db.refresh(user)

        access_token = create_access_token(user.id, role=user.role)
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            is_onboarded=user.is_onboarded
        )

    async def login(self, req: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(req.email)
        if not user or not verify_password(req.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password.")

        access_token = create_access_token(user.id, role=user.role)
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            is_onboarded=user.is_onboarded
        )

    async def oauth2_login(self, req: OAuth2LoginRequest) -> TokenResponse:
        """Handles Google / GitHub / Institutional OAuth2 social login tokens."""
        user = await self.user_repo.get_by_email(req.email)

        if not user:
            # Create user on first SSO login
            role = req.role if req.role in ("LEARNER", "INSTRUCTOR", "ADMIN") else "LEARNER"
            user = User(
                email=req.email,
                password_hash=get_password_hash("oauth2_federated_sso"),
                role=role,
                is_active=True,
                is_onboarded=True
            )
            self.db.add(user)
            await self.db.flush()

            profile = UserProfile(
                user_id=user.id,
                display_name=req.display_name or "Quantum Scholar",
                age_bracket="STUDENT",
                persona="student"
            )
            goal = UserGoal(user_id=user.id)
            preference = UserPreference(user_id=user.id)
            streak = Streak(user_id=user.id)

            self.db.add_all([profile, goal, preference, streak])
            await self.db.commit()
            await self.db.refresh(user)

        access_token = create_access_token(user.id, role=user.role)
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            is_onboarded=user.is_onboarded
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token.")

        user_id = payload.get("sub")
        user = await self.user_repo.get(user_id)
        if not user:
            raise UnauthorizedException("User not found.")

        access_token = create_access_token(user.id, role=user.role)
        new_refresh = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh,
            user_id=user.id,
            role=user.role,
            is_onboarded=user.is_onboarded
        )
