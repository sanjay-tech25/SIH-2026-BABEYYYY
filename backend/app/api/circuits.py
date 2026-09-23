from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.circuit_service import CircuitService
from app.quantum.colab_launcher import ColabLauncher
from app.schemas.circuit import CircuitCreateRequest, CircuitExecutionRequest, CircuitExecutionResultRead
from app.schemas.common import APIResponse

router = APIRouter(prefix="/circuits", tags=["Quantum Lab"])



@router.post("", response_model=APIResponse[dict])
async def create_circuit(
    req: CircuitCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CircuitService(db)
    circuit = await service.create_circuit(current_user.id, req)
    return APIResponse(data={"circuit_id": circuit.id, "name": circuit.name}, message="Circuit saved successfully")


@router.post("/execute", response_model=APIResponse[CircuitExecutionResultRead])
async def execute_circuit(
    req: CircuitExecutionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CircuitService(db)
    result = await service.execute_circuit(current_user.id, req)
    return APIResponse(data=result, message="Circuit simulation completed successfully")


@router.get("/colab/{lesson_slug}", response_model=APIResponse[dict])
async def get_colab_link(
    lesson_slug: str,
    current_user: User = Depends(get_current_user)
):
    url = ColabLauncher.generate_colab_url(lesson_slug, lesson_slug)
    return APIResponse(data={"colab_url": url})


@router.get("/notebook/{topic_id}")
async def get_topic_notebook(
    topic_id: str
):
    """Returns the dedicated, self-grading IPython notebook structure for the specified topic."""
    nb = ColabLauncher.get_topic_notebook(topic_id)
    if nb:
        return nb
    return APIResponse(data={"message": f"Topic notebook {topic_id} available in /notebooks/qubot_master_lab.ipynb"})

