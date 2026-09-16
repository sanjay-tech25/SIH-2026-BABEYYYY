import pytest
from app.quantum.circuit_validator import CircuitValidator
from app.quantum.visualization_data import VisualizationData
from app.quantum.qiskit_backend import QiskitBackend
from app.core.exceptions import InvalidCircuitException


def test_circuit_validator_valid():
    valid_circuit = {
        "num_qubits": 2,
        "gates": [
            {"type": "H", "targets": [0]},
            {"type": "CX", "targets": [0, 1]}
        ]
    }
    validated = CircuitValidator.validate(valid_circuit)
    assert validated["num_qubits"] == 2


def test_circuit_validator_invalid_qubits():
    invalid_circuit = {"num_qubits": 50, "gates": []}
    with pytest.raises(InvalidCircuitException):
        CircuitValidator.validate(invalid_circuit)


def test_circuit_validator_invalid_gate():
    invalid_circuit = {
        "num_qubits": 2,
        "gates": [{"type": "MAGIC_QUANTUM_GATE", "targets": [0]}]
    }
    with pytest.raises(InvalidCircuitException):
        CircuitValidator.validate(invalid_circuit)


def test_bloch_coordinates():
    # |0> state: alpha=1, beta=0 -> z=1, x=0, y=0
    x, y, z = VisualizationData.calculate_bloch_coordinates(1.0 + 0.0j, 0.0 + 0.0j)
    assert z == 1.0
    assert x == 0.0
    assert y == 0.0

    # |1> state: alpha=0, beta=1 -> z=-1, x=0, y=0
    x, y, z = VisualizationData.calculate_bloch_coordinates(0.0 + 0.0j, 1.0 + 0.0j)
    assert z == -1.0


@pytest.mark.asyncio
async def test_qiskit_backend_simulation():
    backend = QiskitBackend()
    circuit = {
        "num_qubits": 2,
        "gates": [
            {"type": "H", "targets": [0]},
            {"type": "CX", "targets": [0, 1]}
        ]
    }
    result = await backend.execute_circuit(circuit, shots=1024)
    assert "counts" in result
    assert result["shots"] == 1024
    assert len(result["bloch_vectors"]) >= 2
