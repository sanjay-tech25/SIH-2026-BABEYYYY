from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.user import (
    UserRead,
    UserProfileSchema,
    UserProfileUpdateSchema,
    UserPreferenceSchema,
    AgeTierConfigSchema,
    AgeTierFeaturesSchema,
)
from app.constants.roles import AgeBracket, UserRole


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    @classmethod
    def get_age_tier_config(cls, age_bracket: str) -> AgeTierConfigSchema:
        """Generates dynamic presentation configuration based on age bracket."""
        if age_bracket == AgeBracket.YOUNG.value:
            return AgeTierConfigSchema(
                theme_mode="playful",
                visual_density="spacious",
                mascot_presence="prominent",
                gamification_intensity="high",
                animation_profile="dynamic",
                features=AgeTierFeaturesSchema(
                    show_xp_bursts=True,
                    show_streak_animations=True,
                    mascot_voice_prompts=True,
                    dense_data_tables=False
                )
            )
        elif age_bracket == AgeBracket.ADULT_PROFESSIONAL.value:
            return AgeTierConfigSchema(
                theme_mode="professional",
                visual_density="compact",
                mascot_presence="subtle",
                gamification_intensity="minimal",
                animation_profile="minimal",
                features=AgeTierFeaturesSchema(
                    show_xp_bursts=False,
                    show_streak_animations=True,
                    mascot_voice_prompts=False,
                    dense_data_tables=True
                )
            )
        else:  # STUDENT
            return AgeTierConfigSchema(
                theme_mode="balanced",
                visual_density="standard",
                mascot_presence="interactive",
                gamification_intensity="high",
                animation_profile="smooth_active",
                features=AgeTierFeaturesSchema(
                    show_xp_bursts=True,
                    show_streak_animations=True,
                    mascot_voice_prompts=True,
                    dense_data_tables=False
                )
            )

    async def get_or_create_default_user(self) -> User:
        """Returns the first user in DB, or creates a standard quantum learner if DB is fresh."""
        result = await self.db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        if user:
            full_user = await self.user_repo.get_full_user(user.id)
            if full_user:
                return full_user
            return user

        # Fresh database fallback: create standard learner
        new_user = User(
            email="manoj.quantum@edu.in",
            password_hash="mock_hash_quantum_2026",
            role=UserRole.LEARNER.value,
            is_active=True,
            is_onboarded=True
        )
        self.db.add(new_user)
        await self.db.flush()

        profile = UserProfile(
            user_id=new_user.id,
            display_name="Manoj Kumar",
            age_bracket=AgeBracket.STUDENT.value,
            persona="undergraduate_physics",
            current_level=3,
            total_xp=450,
            avatar_url="M",
            institution="Department of Physics & Quantum Computing, IIT Madras",
            department="Center for Quantum Information and Computation",
            learning_goal="Master Quantum Information Theory & NISQ Algorithms for Quantum Supremacy Benchmark"
        )
        self.db.add(profile)
        await self.db.commit()
        return await self.user_repo.get_full_user(new_user.id)

    async def get_user_read(self, user_id: str) -> UserRead:
        user = await self.user_repo.get_full_user(user_id)
        if not user:
            user = await self.get_or_create_default_user()

        age_bracket = user.profile.age_bracket if user.profile else "STUDENT"
        age_tier_config = self.get_age_tier_config(age_bracket)

        profile_schema = None
        if user.profile:
            profile_schema = UserProfileSchema(
                display_name=user.profile.display_name,
                age_bracket=user.profile.age_bracket,
                persona=user.profile.persona,
                current_level=user.profile.current_level,
                total_xp=user.profile.total_xp,
                avatar_url=user.profile.avatar_url or "M",
                institution=getattr(user.profile, 'institution', None) or "Department of Physics & Quantum Computing, IIT Madras",
                department=getattr(user.profile, 'department', None) or "Center for Quantum Information and Computation",
                learning_goal=getattr(user.profile, 'learning_goal', None) or "Master Quantum Information Theory & NISQ Algorithms for Quantum Supremacy Benchmark"
            )

        pref_schema = None
        if user.preference:
            pref_schema = UserPreferenceSchema(
                theme_mode=user.preference.theme_mode,
                reduced_motion=user.preference.reduced_motion,
                mascot_verbosity=user.preference.mascot_verbosity,
                sound_effects_enabled=user.preference.sound_effects_enabled,
                visual_density=user.preference.visual_density
            )

        return UserRead(
            id=user.id,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            is_onboarded=user.is_onboarded,
            profile=profile_schema,
            preference=pref_schema,
            age_tier_config=age_tier_config
        )

    async def update_user_profile(self, user_id: str, updates: UserProfileUpdateSchema) -> UserRead:
        user = await self.user_repo.get_full_user(user_id)
        if not user:
            user = await self.get_or_create_default_user()
            user_id = user.id

        if updates.email:
            user.email = updates.email
        if updates.role:
            user.role = updates.role

        profile = await self.user_repo.get_profile(user_id)
        if not profile:
            profile = UserProfile(
                user_id=user_id,
                display_name=updates.display_name or user.email.split("@")[0],
                age_bracket=updates.age_bracket or AgeBracket.STUDENT.value,
                persona=updates.persona or "undergraduate_physics",
                current_level=1,
                total_xp=0,
                avatar_url=updates.avatar_url or "Q",
                institution=updates.institution,
                department=updates.department,
                learning_goal=updates.learning_goal
            )
            self.db.add(profile)
        else:
            if updates.display_name is not None:
                profile.display_name = updates.display_name
            if updates.age_bracket is not None:
                profile.age_bracket = updates.age_bracket
            if updates.persona is not None:
                profile.persona = updates.persona
            if updates.institution is not None:
                profile.institution = updates.institution
            if updates.department is not None:
                profile.department = updates.department
            if updates.learning_goal is not None:
                profile.learning_goal = updates.learning_goal
            if updates.avatar_url is not None:
                profile.avatar_url = updates.avatar_url

        await self.db.commit()
        return await self.get_user_read(user_id)
