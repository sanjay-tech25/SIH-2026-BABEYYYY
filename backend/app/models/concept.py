from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Concept(Base, TimestampMixin):
    __tablename__ = "concepts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)  # e.g. "superposition"
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="CORE", nullable=False)  # FOUNDATIONAL, CORE, ADVANCED
    mastery_threshold: Mapped[float] = mapped_column(Float, default=0.80, nullable=False)  # 0.85, 0.80, 0.70

    lessons = relationship("Lesson", back_populates="concept")
    masteries = relationship("LearnerMastery", back_populates="concept", cascade="all, delete-orphan")
