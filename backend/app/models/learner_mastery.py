from datetime import datetime, timezone
from sqlalchemy import String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class LearnerMastery(Base, TimestampMixin):
    __tablename__ = "learner_masteries"
    __table_args__ = (
        UniqueConstraint("user_id", "concept_id", name="uq_user_concept_mastery"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), index=True, nullable=False)
    mastery_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # P(Mastery) from 0.0 to 1.0
    confidence_score: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    mastery_level: Mapped[str] = mapped_column(String(20), default="NOVICE", nullable=False)  # NOVICE, DEVELOPING, PROFICIENT, MASTERED
    last_assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="masteries")
    concept = relationship("Concept", back_populates="masteries")
