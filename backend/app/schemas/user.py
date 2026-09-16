from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class AgeTierFeaturesSchema(BaseModel):
    show_xp_bursts: bool = True
    show_streak_animations: bool = True
    mascot_voice_prompts: bool = True
    dense_data_tables: bool = False


class AgeTierConfigSchema(BaseModel):
    theme_mode: str = "balanced"  # playful, balanced, professional
    visual_density: str = "standard"  # spacious, standard, compact
    mascot_presence: str = "interactive"  # prominent, interactive, subtle
    gamification_intensity: str = "high"  # high, balanced, minimal
    animation_profile: str = "smooth_active"  # dynamic, smooth_active, minimal
    features: AgeTierFeaturesSchema = AgeTierFeaturesSchema()


class UserProfileSchema(BaseModel):
    display_name: str
    age_bracket: str
    persona: str
    current_level: int
    total_xp: int
    avatar_url: str


class UserPreferenceSchema(BaseModel):
    theme_mode: str
    reduced_motion: bool
    mascot_verbosity: str
    sound_effects_enabled: bool
    visual_density: str


class UserRead(BaseModel):
    id: str
    email: EmailStr
    role: str
    is_active: bool
    is_onboarded: bool
    profile: Optional[UserProfileSchema] = None
    preference: Optional[UserPreferenceSchema] = None
    age_tier_config: AgeTierConfigSchema = AgeTierConfigSchema()
