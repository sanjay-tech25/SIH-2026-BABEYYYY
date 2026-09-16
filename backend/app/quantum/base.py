from abc import ABC, abstractmethod
from typing import Dict, Any


class QuantumBackend(ABC):
    """Abstract interface for quantum simulator/hardware backends."""

    @abstractmethod
    async def execute_circuit(self, circuit_data: Dict[str, Any], shots: int = 1024) -> Dict[str, Any]:
        """Executes a validated quantum circuit and returns raw simulation results."""
        pass
