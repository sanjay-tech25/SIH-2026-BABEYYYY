from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.circuit_repository import CircuitRepository
from app.repositories.progress_repository import ProgressRepository
from app.quantum.circuit_validator import CircuitValidator
from app.quantum.quantum_execution_router import QuantumExecutionRouter
from app.quantum.circuit_optimizer import CircuitOptimizationEngine, CircuitOptimizationResult
from app.quantum.ibm_quantum_service import IBMQuantumService, IBMQJobSubmission, IBMQJobStatus, IBMQDevice
from app.quantum.qbraid_service import QBraidService, QBraidJobSubmission, QBraidJobStatus
from app.models.circuit import Circuit
from app.models.circuit_execution import CircuitExecution
from app.schemas.circuit import (
    CircuitCreateRequest,
    CircuitExecutionRequest,
    CircuitExecutionResultRead,
    BlochVectorRead,
    CircuitOptimizationRequest,
    CircuitOptimizationResponse,
    IBMQJobSubmissionRequest,
    IBMQJobStatusResponse,
    IBMQDeviceResponse,
    QBraidJobSubmissionRequest,
    QBraidJobStatusResponse
)


class CircuitService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.circuit_repo = CircuitRepository(db)
        self.progress_repo = ProgressRepository(db)
        self.execution_router = QuantumExecutionRouter()

    async def create_circuit(self, user_id: str, req: CircuitCreateRequest) -> Circuit:
        validated = CircuitValidator.validate(req.circuit_json)
        circuit = Circuit(
            user_id=user_id,
            name=req.name,
            description=req.description,
            num_qubits=req.num_qubits,
            circuit_json=validated,
            qasm_code=req.qasm_code,
            lesson_id=req.lesson_id
        )
        return await self.circuit_repo.create(circuit)

    async def list_user_circuits(self, user_id: str) -> List[Circuit]:
        return await self.circuit_repo.get_user_circuits(user_id)

    async def execute_circuit(self, user_id: str, req: CircuitExecutionRequest) -> CircuitExecutionResultRead:
        circuit_data = req.circuit_json
        target_circuit_id = req.circuit_id

        if target_circuit_id:
            db_circuit = await self.circuit_repo.get(target_circuit_id)
            if db_circuit:
                circuit_data = db_circuit.circuit_json

        if not circuit_data:
            # Default Bell State circuit
            circuit_data = {
                "num_qubits": 2,
                "gates": [
                    {"type": "H", "targets": [0]},
                    {"type": "CX", "targets": [0, 1]}
                ]
            }

        validated = CircuitValidator.validate(circuit_data)
        framework = req.framework or "qiskit"

        # If noise_config is requested and framework is qiskit, inject into circuit_data
        if req.noise_config and framework.lower() in ("qiskit", "aer"):
            validated["noise_model"] = req.noise_config

        sim_result = await self.execution_router.execute(
            validated,
            shots=req.shots,
            framework=framework
        )

        # Log execution if associated with circuit
        if target_circuit_id:
            execution = CircuitExecution(
                circuit_id=target_circuit_id,
                user_id=user_id,
                backend_name=sim_result["backend"],
                shots=sim_result["shots"],
                execution_time_ms=sim_result["execution_time_ms"],
                counts_result=sim_result["counts"],
                statevector_result=sim_result.get("statevector", []),
                bloch_vectors=sim_result.get("bloch_vectors", [])
            )
            await self.circuit_repo.create_execution(execution)

        # Award Quantum Lab XP
        await self.progress_repo.add_xp_transaction(
            user_id=user_id,
            amount=60,
            source_type="CIRCUIT_EXECUTED",
            description=f"Executed quantum circuit on {sim_result.get('framework', framework)} ({sim_result['shots']} shots)"
        )

        bloch_reads = [
            BlochVectorRead(
                qubit_index=b["qubit_index"],
                x=b["x"],
                y=b["y"],
                z=b["z"]
            )
            for b in sim_result.get("bloch_vectors", [])
        ]

        return CircuitExecutionResultRead(
            backend=sim_result["backend"],
            framework=sim_result.get("framework", framework),
            shots=sim_result["shots"],
            execution_time_ms=sim_result["execution_time_ms"],
            counts=sim_result["counts"],
            bloch_vectors=bloch_reads,
            noise_model_applied=sim_result.get("noise_model_applied", False),
            circuit_diagram=sim_result.get("circuit_diagram"),
            xp_earned=60
        )

    def optimize_circuit(self, req: CircuitOptimizationRequest) -> CircuitOptimizationResponse:
        res: CircuitOptimizationResult = CircuitOptimizationEngine.optimize_circuit(
            req.circuit_json,
            level=req.optimization_level
        )
        return CircuitOptimizationResponse(
            initial_gate_count=res.initial_gate_count,
            optimized_gate_count=res.optimized_gate_count,
            gate_count_reduction=res.gate_count_reduction,
            initial_depth=res.initial_depth,
            optimized_depth=res.optimized_depth,
            depth_reduction_pct=res.depth_reduction_pct,
            initial_two_qubit_count=res.initial_two_qubit_count,
            optimized_two_qubit_count=res.optimized_two_qubit_count,
            two_qubit_reduction=res.two_qubit_reduction,
            estimated_fidelity_gain_pct=res.estimated_fidelity_gain_pct,
            optimization_level=res.optimization_level,
            optimization_notes=res.optimization_notes,
            optimized_circuit_json=res.optimized_circuit_json
        )

    def list_hardware_backends(self) -> List[IBMQDeviceResponse]:
        backends = IBMQuantumService.list_hardware_backends()
        return [
            IBMQDeviceResponse(
                backend_name=b.backend_name,
                num_qubits=b.num_qubits,
                status=b.status,
                queue_depth=b.queue_depth,
                basis_gates=b.basis_gates,
                t1_avg_us=b.t1_avg_us,
                t2_avg_us=b.t2_avg_us,
                avg_readout_error=b.avg_readout_error,
                avg_cnot_error=b.avg_cnot_error,
                description=b.description
            )
            for b in backends
        ]

    async def submit_hardware_job(self, req: IBMQJobSubmissionRequest) -> IBMQJobStatusResponse:
        submission = IBMQJobSubmission(
            circuit_json=req.circuit_json,
            backend_name=req.backend_name,
            shots=req.shots,
            api_token=req.api_token
        )
        job: IBMQJobStatus = await IBMQuantumService.submit_job(submission)
        return IBMQJobStatusResponse(
            job_id=job.job_id,
            backend_name=job.backend_name,
            status=job.status,
            queue_position=job.queue_position,
            shots=job.shots,
            created_at=job.created_at,
            completed_at=job.completed_at,
            ideal_counts=job.ideal_counts,
            hardware_counts=job.hardware_counts,
            calibration_metrics=job.calibration_metrics,
            total_variation_distance=job.total_variation_distance,
            fidelity_score=job.fidelity_score
        )

    def get_hardware_job(self, job_id: str) -> Optional[IBMQJobStatusResponse]:
        job = IBMQuantumService.get_job(job_id)
        if not job:
            return None
        return IBMQJobStatusResponse(
            job_id=job.job_id,
            backend_name=job.backend_name,
            status=job.status,
            queue_position=job.queue_position,
            shots=job.shots,
            created_at=job.created_at,
            completed_at=job.completed_at,
            ideal_counts=job.ideal_counts,
            hardware_counts=job.hardware_counts,
            calibration_metrics=job.calibration_metrics,
            total_variation_distance=job.total_variation_distance,
            fidelity_score=job.fidelity_score
        )

    def list_qbraid_devices(self) -> List[Dict[str, Any]]:
        return QBraidService.list_devices()

    async def submit_qbraid_job(self, req: QBraidJobSubmissionRequest) -> QBraidJobStatusResponse:
        sub = QBraidJobSubmission(
            circuit_json=req.circuit_json,
            target_backend=req.target_backend,
            framework=req.framework,
            shots=req.shots,
            user_api_key=req.user_api_key
        )
        job: QBraidJobStatus = await QBraidService.submit_job(sub)
        return QBraidJobStatusResponse(
            job_id=job.job_id,
            status=job.status,
            target_backend=job.target_backend,
            framework=job.framework,
            shots=job.shots,
            created_at=job.created_at,
            completed_at=job.completed_at,
            counts=job.counts,
            execution_time_ms=job.execution_time_ms,
            device_properties=job.device_properties
        )

    def get_qbraid_job(self, job_id: str) -> Optional[QBraidJobStatusResponse]:
        job = QBraidService.get_job(job_id)
        if not job:
            return None
        return QBraidJobStatusResponse(
            job_id=job.job_id,
            status=job.status,
            target_backend=job.target_backend,
            framework=job.framework,
            shots=job.shots,
            created_at=job.created_at,
            completed_at=job.completed_at,
            counts=job.counts,
            execution_time_ms=job.execution_time_ms,
            device_properties=job.device_properties
        )
