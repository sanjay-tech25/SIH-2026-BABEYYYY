from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class Circuit(Base, TimestampMixin):
    __tablename__ = "circuits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    num_qubits: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    circuit_json: Mapped[dict] = mapped_column(JSON, nullable=False)  # Gates, connections, measurements
    qasm_code: Mapped[str] = mapped_column(Text, nullable=True)

    user = relationship("User")
    lesson = relationship("Lesson")
    executions = relationship("CircuitExecution", back_populates="circuit", cascade="all, delete-orphan")
