from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.base import generate_uuid
from app.constants.mascot_states import MascotState


class MascotEvent(Base, TimestampMixin):
    __tablename__ = "mascot_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(30), default=MascotState.IDLE.value, nullable=False)
    trigger_event: Mapped[str] = mapped_column(String(100), nullable=False)
    dialogue_text: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_payload: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    user = relationship("User")
