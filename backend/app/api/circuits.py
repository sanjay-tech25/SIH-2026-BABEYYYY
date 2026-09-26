from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.circuit_service import CircuitService
from app.quantum.colab_launcher import ColabLauncher
from app.quantum.quantum_sandbox import QuantumCodeSandbox, SandboxExecutionRequest
from app.schemas.circuit import (
    CircuitCreateRequest,
    CircuitExecutionRequest,
    CircuitExecutionResultRead,
    CircuitOptimizationRequest,
    CircuitOptimizationResponse,
    IBMQDeviceResponse,
    IBMQJobSubmissionRequest,
    IBMQJobStatusResponse,
    QBraidJobSubmissionRequest,
    QBraidJobStatusResponse,
    SandboxExecutionRequestSchema,
    SandboxExecutionResponseSchema
)
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
    """Executes a quantum circuit on Qiskit Aer, Google Cirq, or Xanadu PennyLane,
    with optional NISQ hardware physical noise modeling."""
    service = CircuitService(db)
    result = await service.execute_circuit(current_user.id, req)
    return APIResponse(data=result, message=f"Circuit simulation completed successfully on {result.framework}")


@router.post("/optimize", response_model=APIResponse[CircuitOptimizationResponse])
async def optimize_circuit(
    req: CircuitOptimizationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Performs automated quantum circuit optimization via involution gate cancellation,
    rotation angle fusion, and Qiskit Transpiler pass-managers."""
    service = CircuitService(db)
    result = service.optimize_circuit(req)
    return APIResponse(data=result, message=f"Circuit optimized: {result.gate_count_reduction} gates eliminated, depth reduced by {result.depth_reduction_pct}%")


@router.post("/sandbox/execute", response_model=APIResponse[SandboxExecutionResponseSchema])
async def execute_sandbox_code(
    req: SandboxExecutionRequestSchema,
    current_user: User = Depends(get_current_user)
):
    """Executes arbitrary quantum Python scripts inside a hardened, AST-filtered sandbox."""
    res = await QuantumCodeSandbox.execute_secure(
        SandboxExecutionRequest(code=req.code, timeout_seconds=req.timeout_seconds)
    )
    return APIResponse(
        data=SandboxExecutionResponseSchema(
            success=res.success,
            stdout=res.stdout,
            stderr=res.stderr,
            execution_time_ms=res.execution_time_ms,
            violations=res.violations,
            circuit_found=res.circuit_found,
            metrics=res.metrics
        ),
        message="Sandbox execution finished" if res.success else "Sandbox execution blocked or failed"
    )


@router.get("/hardware/backends", response_model=APIResponse[List[IBMQDeviceResponse]])
async def list_hardware_backends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lists available physical IBM Quantum hardware backends with real-time T1/T2 calibration metrics."""
    service = CircuitService(db)
    backends = service.list_hardware_backends()
    return APIResponse(data=backends, message="Active quantum hardware backends retrieved")


@router.post("/hardware/submit", response_model=APIResponse[IBMQJobStatusResponse])
async def submit_hardware_job(
    req: IBMQJobSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits a circuit to the physical quantum hardware execution pipeline,
    comparing ideal simulation with physical calibration noise."""
    service = CircuitService(db)
    job = await service.submit_hardware_job(req)
    return APIResponse(data=job, message=f"Job submitted to {req.backend_name} successfully")


@router.get("/hardware/jobs/{job_id}", response_model=APIResponse[IBMQJobStatusResponse])
async def get_hardware_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Polls status and counts of a physical quantum hardware job."""
    service = CircuitService(db)
    job = service.get_hardware_job(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Quantum job {job_id} not found")
    return APIResponse(data=job, message="Hardware job status retrieved")


@router.get("/qbraid/devices", response_model=APIResponse[List[Dict[str, Any]]])
async def list_qbraid_devices(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lists supported devices and environments in the qBraid multi-SDK cloud workspace."""
    service = CircuitService(db)
    devices = service.list_qbraid_devices()
    return APIResponse(data=devices, message="qBraid devices retrieved")


@router.post("/qbraid/submit", response_model=APIResponse[QBraidJobStatusResponse])
async def submit_qbraid_job(
    req: QBraidJobSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits circuit to qBraid unified cloud execution connector."""
    service = CircuitService(db)
    job = await service.submit_qbraid_job(req)
    return APIResponse(data=job, message="qBraid job submitted successfully")


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
