from typing import Dict, Any, Optional
from app.quantum.base import QuantumBackend
from app.quantum.qiskit_backend import QiskitBackend
from app.quantum.cirq_backend import CirqBackend
from app.quantum.pennylane_backend import PennyLaneBackend
from app.core.logging import logger


class QuantumExecutionRouter:
    """Unified router directing circuit simulation requests to selected framework backends:
    - IBM Qiskit Aer ('qiskit', 'aer')
    - Google Cirq ('cirq')
    - Xanadu PennyLane ('pennylane')
    """

    def __init__(self):
        self._qiskit_backend = QiskitBackend()
        self._cirq_backend = CirqBackend()
        self._pennylane_backend = PennyLaneBackend()

    def get_backend(self, framework: Optional[str] = None) -> QuantumBackend:
        fw = (framework or "qiskit").strip().lower()
        if fw in ("cirq", "google_cirq"):
            return self._cirq_backend
        elif fw in ("pennylane", "xanadu_pennylane", "pl"):
            return self._pennylane_backend
        else:
            return self._qiskit_backend

    async def execute(self, circuit_data: Dict[str, Any], shots: int = 1024, framework: Optional[str] = "qiskit") -> Dict[str, Any]:
        backend = self.get_backend(framework)
        return await backend.execute_circuit(circuit_data, shots=shots)
