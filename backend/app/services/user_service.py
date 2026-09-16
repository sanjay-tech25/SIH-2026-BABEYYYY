from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import UserRead, UserProfileSchema, UserPreferenceSchema, AgeTierConfigSchema, AgeTierFeaturesSchema
from app.constants.roles import AgeBracket


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

    async def get_user_read(self, user_id: str) -> UserRead:
        user = await self.user_repo.get_full_user(user_id)
        if not user:
            raise ValueError(f"User {user_id} not found")

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
                avatar_url=user.profile.avatar_url
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
