from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class LearningResource(Base, TimestampMixin):
    __tablename__ = "learning_resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="CASCADE"), index=True, nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)  # DIAGRAM, SIMULATION_WIDGET, CHEATSHEET, COLAB_NOTEBOOK
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content_payload: Mapped[dict] = mapped_column(JSON, nullable=False)

    lesson = relationship("Lesson", back_populates="resources")
