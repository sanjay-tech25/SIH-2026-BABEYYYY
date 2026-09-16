from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class UserGoal(Base, TimestampMixin):
    __tablename__ = "user_goals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    primary_goal: Mapped[str] = mapped_column(String(100), default="learn_quantum_basics", nullable=False)
    target_daily_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    target_timeline_weeks: Mapped[int] = mapped_column(Integer, default=4, nullable=False)

    user = relationship("User", back_populates="goal")
