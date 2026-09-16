from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class UserPreference(Base, TimestampMixin):
    __tablename__ = "user_preferences"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme_mode: Mapped[str] = mapped_column(String(20), default="system", nullable=False)  # dark, light, system
    reduced_motion: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    mascot_verbosity: Mapped[str] = mapped_column(String(20), default="normal", nullable=False)  # minimal, normal, enthusiastic
    sound_effects_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    visual_density: Mapped[str] = mapped_column(String(20), default="standard", nullable=False)  # compact, standard, spacious

    user = relationship("User", back_populates="preference")
