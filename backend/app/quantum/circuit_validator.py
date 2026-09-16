from typing import Dict, Any, List
from app.core.config import settings
from app.core.exceptions import InvalidCircuitException

ALLOWED_GATES = {"H", "X", "Y", "Z", "S", "T", "CX", "CNOT", "CZ", "SWAP", "RX", "RY", "RZ", "MEASURE"}


class CircuitValidator:
    """Validates quantum circuit JSON definitions against size, depth, and syntax rules."""

    @classmethod
    def validate(cls, circuit_data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(circuit_data, dict):
            raise InvalidCircuitException("Circuit definition must be a JSON object.")

        num_qubits = circuit_data.get("num_qubits", 1)
        if not isinstance(num_qubits, int) or num_qubits < 1 or num_qubits > settings.QUANTUM_MAX_QUBITS:
            raise InvalidCircuitException(
                f"Number of qubits must be between 1 and {settings.QUANTUM_MAX_QUBITS}."
            )

        gates = circuit_data.get("gates", [])
        if not isinstance(gates, list):
            raise InvalidCircuitException("Gates must be an array of gate operations.")

        if len(gates) > settings.QUANTUM_MAX_DEPTH:
            raise InvalidCircuitException(
                f"Circuit depth exceeds max allowed limit of {settings.QUANTUM_MAX_DEPTH} gates."
            )

        for i, gate in enumerate(gates):
            if not isinstance(gate, dict):
                raise InvalidCircuitException(f"Gate at index {i} must be an object.")

            gate_type = gate.get("type", "").upper()
            if gate_type not in ALLOWED_GATES:
                raise InvalidCircuitException(
                    f"Unsupported gate type '{gate_type}' at index {i}. Allowed: {ALLOWED_GATES}"
                )

            targets = gate.get("targets", [])
            if not isinstance(targets, list) or not targets:
                raise InvalidCircuitException(f"Gate '{gate_type}' at index {i} has no target qubits.")

            for target in targets:
                if not isinstance(target, int) or target < 0 or target >= num_qubits:
                    raise InvalidCircuitException(
                        f"Target qubit index {target} out of range (0 to {num_qubits - 1})."
                    )

        return circuit_data
