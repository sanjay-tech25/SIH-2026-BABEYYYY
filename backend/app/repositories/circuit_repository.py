from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.circuit import Circuit
from app.models.circuit_execution import CircuitExecution


class CircuitRepository(BaseRepository[Circuit]):
    def __init__(self, db: AsyncSession):
        super().__init__(Circuit, db)

    async def get_user_circuits(self, user_id: str) -> List[Circuit]:
        result = await self.db.execute(
            select(Circuit)
            .where(Circuit.user_id == user_id)
            .order_by(Circuit.updated_at.desc())
        )
        return list(result.scalars().all())

    async def create_execution(self, execution: CircuitExecution) -> CircuitExecution:
        self.db.add(execution)
        await self.db.commit()
        await self.db.refresh(execution)
        return execution

    async def get_circuit_with_executions(self, circuit_id: str) -> Optional[Circuit]:
        result = await self.db.execute(
            select(Circuit)
            .options(selectinload(Circuit.executions))
            .where(Circuit.id == circuit_id)
        )
        return result.scalar_one_or_none()
