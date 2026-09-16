from sqlalchemy import String, Text, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid
from app.constants.mastery import RecommendationAction


class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), index=True, nullable=False)
    target_lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(20), default=RecommendationAction.ADVANCE.value, nullable=False)
    rationale: Mapped[str] = mapped_column(Text, nullable=False)
    mastery_at_decision: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    user = relationship("User")
    concept = relationship("Concept")
    target_lesson = relationship("Lesson")
