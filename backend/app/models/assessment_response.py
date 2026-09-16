from sqlalchemy import String, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class AssessmentResponse(Base, TimestampMixin):
    __tablename__ = "assessment_responses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    attempt_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_attempts.id", ondelete="CASCADE"), index=True, nullable=False)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), index=True, nullable=False)
    selected_option_id: Mapped[str] = mapped_column(String(36), ForeignKey("answer_options.id", ondelete="CASCADE"), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    response_time_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    attempt = relationship("AssessmentAttempt", back_populates="responses")
    question = relationship("Question")
    selected_option = relationship("AnswerOption")
