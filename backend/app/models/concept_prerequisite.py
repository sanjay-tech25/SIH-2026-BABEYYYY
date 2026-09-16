from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class ConceptPrerequisite(Base, TimestampMixin):
    """Represents a directed edge in the curriculum knowledge DAG: prerequisite_id -> concept_id."""
    __tablename__ = "concept_prerequisites"
    __table_args__ = (
        UniqueConstraint("concept_id", "prerequisite_id", name="uq_concept_prerequisite"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), index=True, nullable=False)
    prerequisite_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="CASCADE"), index=True, nullable=False)
