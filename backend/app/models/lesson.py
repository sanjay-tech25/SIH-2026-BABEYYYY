from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Lesson(Base, TimestampMixin):
    __tablename__ = "lessons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    module_id: Mapped[str] = mapped_column(String(36), ForeignKey("modules.id", ondelete="CASCADE"), index=True, nullable=False)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="RESTRICT"), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    content_cards: Mapped[dict] = mapped_column(JSON, default=list, nullable=False)  # Array of card objects

    module = relationship("Module", back_populates="lessons")
    concept = relationship("Concept", back_populates="lessons")
    resources = relationship("LearningResource", back_populates="lesson", cascade="all, delete-orphan")
    assessment = relationship("Assessment", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
