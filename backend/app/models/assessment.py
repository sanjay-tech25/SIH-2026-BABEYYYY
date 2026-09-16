from sqlalchemy import String, Integer, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Assessment(Base, TimestampMixin):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="CASCADE"), unique=True, nullable=True)
    assessment_type: Mapped[str] = mapped_column(String(50), default="LESSON_QUIZ", nullable=False)  # DIAGNOSTIC, LESSON_QUIZ, MODULE_TEST
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    pass_percentage: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    lesson = relationship("Lesson", back_populates="assessment")
    questions = relationship("Question", back_populates="assessment", order_by="Question.order_index", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")
