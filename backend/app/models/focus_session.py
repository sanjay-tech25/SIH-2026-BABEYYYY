from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid
from app.constants.focus_states import FocusStatus


class FocusSession(Base, TimestampMixin):
    __tablename__ = "focus_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    cycle_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)  # 1 for first session, 2 for consecutive
    target_duration_seconds: Mapped[int] = mapped_column(Integer, default=1500, nullable=False)  # 25 min default
    actual_duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default=FocusStatus.IN_FOCUS.value, nullable=False)
    break_skipped: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="focus_sessions")
    breaks = relationship("BreakRecord", back_populates="focus_session", cascade="all, delete-orphan")
