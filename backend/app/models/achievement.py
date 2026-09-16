from sqlalchemy import String, Integer, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)  # e.g. "quantum_explorer"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="MASTERY", nullable=False)
    icon_url: Mapped[str] = mapped_column(String(255), default="badge_default.svg", nullable=False)
    xp_bonus: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    criteria_rules: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)  # e.g. {"mastery_count": 3}

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")
