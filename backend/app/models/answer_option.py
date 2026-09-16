from sqlalchemy import String, Integer, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class AnswerOption(Base, TimestampMixin):
    __tablename__ = "answer_options"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), index=True, nullable=False)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    distractor_feedback: Mapped[str] = mapped_column(Text, nullable=True)  # Targeted explanation why this distractor is incorrect
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    question = relationship("Question", back_populates="options")
