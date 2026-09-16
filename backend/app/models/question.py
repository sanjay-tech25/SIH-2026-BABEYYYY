from sqlalchemy import String, Integer, Text, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Question(Base, TimestampMixin):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    assessment_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), index=True, nullable=False)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), index=True, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), default="MULTIPLE_CHOICE", nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=True)
    difficulty: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)  # 1.0 (easy) to 3.0 (hard)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    assessment = relationship("Assessment", back_populates="questions")
    concept = relationship("Concept")
    options = relationship("AnswerOption", back_populates="question", order_by="AnswerOption.order_index", cascade="all, delete-orphan")
