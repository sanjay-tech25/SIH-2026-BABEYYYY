from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.focus_session import FocusSession
from app.models.break_record import BreakRecord
from app.constants.focus_states import FocusStatus


class FocusRepository(BaseRepository[FocusSession]):
    def __init__(self, db: AsyncSession):
        super().__init__(FocusSession, db)

    async def get_latest_session(self, user_id: str) -> Optional[FocusSession]:
        result = await self.db.execute(
            select(FocusSession)
            .options(selectinload(FocusSession.breaks))
            .where(FocusSession.user_id == user_id)
            .order_by(FocusSession.started_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def record_break(
        self,
        focus_session_id: str,
        user_id: str,
        break_type: str,
        duration_seconds: int,
        was_skipped: bool,
        was_mandatory: bool
    ) -> BreakRecord:
        record = BreakRecord(
            focus_session_id=focus_session_id,
            user_id=user_id,
            break_type=break_type,
            duration_seconds=duration_seconds,
            was_skipped=was_skipped,
            was_mandatory=was_mandatory,
            completed_at=datetime.now(timezone.utc)
        )
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record
