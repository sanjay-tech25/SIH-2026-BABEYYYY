from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.focus_repository import FocusRepository
from app.repositories.progress_repository import ProgressRepository
from app.engines.focus_policy_engine import FocusPolicyEngine
from app.models.focus_session import FocusSession
from app.constants.focus_states import FocusStatus
from app.core.websocket_manager import ws_manager
from app.schemas.focus import FocusStatusResponse


class FocusService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.focus_repo = FocusRepository(db)
        self.progress_repo = ProgressRepository(db)

    async def start_session(self, user_id: str, target_seconds: int = 1500) -> FocusStatusResponse:
        latest = await self.focus_repo.get_latest_session(user_id)
        current_status = latest.status if latest else FocusStatus.IDLE.value
        is_consecutive_skip = (latest is not None and latest.status == FocusStatus.BREAK_SKIPPED.value)
        cycle = (latest.cycle_number + 1) if is_consecutive_skip else 1
        prev_skipped = latest.break_skipped if latest else False

        # Verify permission (Raises exception if BREAK_REQUIRED)
        FocusPolicyEngine.validate_new_session_permission(current_status, cycle, prev_skipped)

        session = FocusSession(
            user_id=user_id,
            cycle_number=cycle,
            target_duration_seconds=target_seconds,
            status=FocusStatus.IN_FOCUS.value,
            break_skipped=prev_skipped,
            started_at=datetime.now(timezone.utc)
        )
        await self.focus_repo.create(session)

        return FocusStatusResponse(
            status=FocusStatus.IN_FOCUS.value,
            cycle_number=cycle,
            is_mandatory_break=False,
            break_skipped=prev_skipped,
            message="Focus session active. Deep work mode engaged."
        )

    async def complete_session(self, user_id: str) -> FocusStatusResponse:
        latest = await self.focus_repo.get_latest_session(user_id)
        if not latest or latest.status != FocusStatus.IN_FOCUS.value:
            raise ValueError("No active focus session found to complete.")

        latest.completed_at = datetime.now(timezone.utc)
        latest.actual_duration_seconds = latest.target_duration_seconds
        latest.xp_earned = 40

        # Determine next state via FocusPolicyEngine
        new_status, is_mandatory, msg = FocusPolicyEngine.handle_session_completion(
            cycle_number=latest.cycle_number,
            prev_break_skipped=latest.break_skipped
        )
        latest.status = new_status

        # Award focus XP
        await self.progress_repo.add_xp_transaction(
            user_id=user_id,
            amount=40,
            source_type="FOCUS_SESSION_DONE",
            description=f"Completed {latest.target_duration_seconds // 60}-minute focus session"
        )

        await self.db.commit()

        # Push WS event
        event_type = "BREAK_REQUIRED" if is_mandatory else "BREAK_RECOMMENDED"
        await ws_manager.send_personal_event(
            user_id=user_id,
            event_type=event_type,
            payload={"cycle_number": latest.cycle_number, "is_mandatory": is_mandatory, "message": msg}
        )

        return FocusStatusResponse(
            status=new_status,
            cycle_number=latest.cycle_number,
            is_mandatory_break=is_mandatory,
            break_skipped=latest.break_skipped,
            message=msg
        )

    async def skip_break(self, user_id: str) -> FocusStatusResponse:
        latest = await self.focus_repo.get_latest_session(user_id)
        if not latest:
            raise ValueError("No focus session found.")

        if latest.status == FocusStatus.BREAK_REQUIRED.value:
            raise ValueError("Cannot skip a mandatory break.")

        latest.status = FocusStatus.BREAK_SKIPPED.value
        latest.break_skipped = True

        # Log break record
        await self.focus_repo.record_break(
            focus_session_id=latest.id,
            user_id=user_id,
            break_type="SHORT_BREAK",
            duration_seconds=0,
            was_skipped=True,
            was_mandatory=False
        )
        await self.db.commit()

        return FocusStatusResponse(
            status=FocusStatus.BREAK_SKIPPED.value,
            cycle_number=latest.cycle_number,
            is_mandatory_break=False,
            break_skipped=True,
            message="Break skipped. Next completed session will require a mandatory break."
        )

    async def complete_break(self, user_id: str) -> FocusStatusResponse:
        latest = await self.focus_repo.get_latest_session(user_id)
        if latest:
            was_mandatory = (latest.status == FocusStatus.BREAK_REQUIRED.value)
            latest.status = FocusStatus.COMPLETED.value
            latest.break_skipped = False

            await self.focus_repo.record_break(
                focus_session_id=latest.id,
                user_id=user_id,
                break_type="SHORT_BREAK",
                duration_seconds=300,
                was_skipped=False,
                was_mandatory=was_mandatory
            )
            await self.db.commit()

        return FocusStatusResponse(
            status=FocusStatus.IDLE.value,
            cycle_number=1,
            is_mandatory_break=False,
            break_skipped=False,
            message="Break completed! You're recharged and ready for your next focus session."
        )

    async def handle_distraction_event(self, user_id: str, idle_seconds: int) -> dict:
        nudge = FocusPolicyEngine.handle_distraction_event(idle_seconds)
        await ws_manager.send_personal_event(
            user_id=user_id,
            event_type="IDLE_DISTRACTED",
            payload=nudge
        )
        return nudge
