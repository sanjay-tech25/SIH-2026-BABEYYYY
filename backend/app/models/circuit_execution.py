from sqlalchemy import String, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid


class CircuitExecution(Base, TimestampMixin):
    __tablename__ = "circuit_executions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    circuit_id: Mapped[str] = mapped_column(String(36), ForeignKey("circuits.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    backend_name: Mapped[str] = mapped_column(String(50), default="qiskit_aer_simulator", nullable=False)
    shots: Mapped[int] = mapped_column(Integer, default=1024, nullable=False)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    counts_result: Mapped[dict] = mapped_column(JSON, nullable=False)  # e.g. {"00": 512, "11": 512}
    statevector_result: Mapped[dict] = mapped_column(JSON, default=list, nullable=True)  # Amplitudes & phases
    bloch_vectors: Mapped[dict] = mapped_column(JSON, default=list, nullable=True)  # Array of (x, y, z) per qubit

    circuit = relationship("Circuit", back_populates="executions")
    user = relationship("User")
