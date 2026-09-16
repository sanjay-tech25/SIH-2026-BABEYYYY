from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class XPTransaction(Base, TimestampMixin):
    """Immutable ledger of all XP awarded to a user."""
    __tablename__ = "xp_transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)  # LESSON_COMPLETE, QUIZ_PASSED, etc.
    description: Mapped[str] = mapped_column(String(255), nullable=False)

    user = relationship("User", back_populates="xp_transactions")
