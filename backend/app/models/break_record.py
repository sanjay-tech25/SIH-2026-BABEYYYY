from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class BreakRecord(Base, TimestampMixin):
    __tablename__ = "break_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    focus_session_id: Mapped[str] = mapped_column(String(36), ForeignKey("focus_sessions.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    break_type: Mapped[str] = mapped_column(String(30), default="SHORT_BREAK", nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=300, nullable=False)  # 5 min default
    was_skipped: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    was_mandatory: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    focus_session = relationship("FocusSession", back_populates="breaks")
    user = relationship("User")
