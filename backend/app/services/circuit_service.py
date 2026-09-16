from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.circuit_repository import CircuitRepository
from app.repositories.progress_repository import ProgressRepository
from app.quantum.circuit_validator import CircuitValidator
from app.quantum.qiskit_backend import QiskitBackend
from app.models.circuit import Circuit
from app.models.circuit_execution import CircuitExecution
from app.schemas.circuit import CircuitCreateRequest, CircuitExecutionRequest, CircuitExecutionResultRead, BlochVectorRead


class CircuitService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.circuit_repo = CircuitRepository(db)
        self.progress_repo = ProgressRepository(db)
        self.quantum_backend = QiskitBackend()

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
        sim_result = await self.quantum_backend.execute_circuit(validated, shots=req.shots)

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
            description=f"Executed quantum circuit simulation ({sim_result['shots']} shots)"
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
            shots=sim_result["shots"],
            execution_time_ms=sim_result["execution_time_ms"],
            counts=sim_result["counts"],
            bloch_vectors=bloch_reads,
            xp_earned=60
        )
