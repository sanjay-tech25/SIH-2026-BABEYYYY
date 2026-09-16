from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid
from app.constants.roles import AgeBracket


class UserProfile(Base, TimestampMixin):
    __tablename__ = "user_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    age_bracket: Mapped[str] = mapped_column(String(20), default=AgeBracket.STUDENT.value, nullable=False)
    persona: Mapped[str] = mapped_column(String(50), default="high_school_student", nullable=False)
    current_level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    total_xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(255), default="default_avatar.png", nullable=False)

    user = relationship("User", back_populates="profile")
