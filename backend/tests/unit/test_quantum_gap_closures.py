import pytest
from app.quantum.cirq_backend import CirqBackend
from app.quantum.pennylane_backend import PennyLaneBackend
from app.quantum.quantum_execution_router import QuantumExecutionRouter
from app.quantum.circuit_optimizer import CircuitOptimizationEngine
from app.quantum.quantum_sandbox import QuantumCodeSandbox, SandboxExecutionRequest
from app.quantum.ibm_quantum_service import IBMQuantumService, IBMQJobSubmission
from app.quantum.qbraid_service import QBraidService, QBraidJobSubmission
from app.quantum.qiskit_backend import QiskitBackend


@pytest.mark.asyncio
async def test_cirq_backend_execution():
    backend = CirqBackend()
    circuit = {
        "num_qubits": 2,
        "gates": [
            {"type": "H", "targets": [0]},
            {"type": "CX", "targets": [0, 1]}
        ]
    }
    res = await backend.execute_circuit(circuit, shots=200)
    assert res["backend"] == "google_cirq_simulator"
    assert res["framework"] == "cirq"
    assert "00" in res["counts"] or "11" in res["counts"]
    assert len(res["bloch_vectors"]) == 2
    assert res["bloch_vectors"][0]["qubit_index"] == 0


@pytest.mark.asyncio
async def test_pennylane_backend_execution():
    backend = PennyLaneBackend()
    circuit = {
        "num_qubits": 2,
        "gates": [
            {"type": "H", "targets": [0]},
            {"type": "CX", "targets": [0, 1]}
        ]
    }
    res = await backend.execute_circuit(circuit, shots=200)
    assert res["backend"] == "xanadu_pennylane_simulator"
    assert res["framework"] == "pennylane"
    assert "00" in res["counts"] or "11" in res["counts"]
    assert len(res["bloch_vectors"]) == 2


@pytest.mark.asyncio
async def test_quantum_execution_router():
    router = QuantumExecutionRouter()
    circuit = {"num_qubits": 1, "gates": [{"type": "X", "targets": [0]}]}

    res_qiskit = await router.execute(circuit, shots=100, framework="qiskit")
    assert res_qiskit["framework"] == "qiskit"

    res_cirq = await router.execute(circuit, shots=100, framework="cirq")
    assert res_cirq["framework"] == "cirq"

    res_pl = await router.execute(circuit, shots=100, framework="pennylane")
    assert res_pl["framework"] == "pennylane"


def test_circuit_optimizer_gate_cancellation():
    circuit = {
        "num_qubits": 2,
        "gates": [
            {"type": "H", "targets": [0]},
            {"type": "H", "targets": [0]},  # cancels
            {"type": "CX", "targets": [0, 1]},
            {"type": "CX", "targets": [0, 1]},  # cancels
            {"type": "X", "targets": [1]}
        ]
    }
    res = CircuitOptimizationEngine.optimize_circuit(circuit, level=2)
    assert res.initial_gate_count == 5
    assert res.optimized_gate_count == 1
    assert res.gate_count_reduction == 4
    assert res.two_qubit_reduction == 2
    assert len(res.optimization_notes) >= 2


@pytest.mark.asyncio
async def test_quantum_sandbox_safe_and_malicious():
    safe_code = """
from qiskit import QuantumCircuit
qc = QuantumCircuit(1)
qc.x(0)
print("Circuit Qubits:", qc.num_qubits)
"""
    res_safe = await QuantumCodeSandbox.execute_secure(SandboxExecutionRequest(code=safe_code))
    assert res_safe.success is True
    assert "Circuit Qubits: 1" in res_safe.stdout
    assert res_safe.circuit_found is True
    assert len(res_safe.violations) == 0

    malicious_code = """
import os
os.listdir('.')
"""
    res_bad = await QuantumCodeSandbox.execute_secure(SandboxExecutionRequest(code=malicious_code))
    assert res_bad.success is False
    assert len(res_bad.violations) > 0
    assert any("os" in v for v in res_bad.violations)


@pytest.mark.asyncio
async def test_ibm_quantum_hardware_service():
    devices = IBMQuantumService.list_hardware_backends()
    assert len(devices) >= 3
    assert any(d.backend_name == "ibm_brisbane" for d in devices)

    sub = IBMQJobSubmission(
        circuit_json={"num_qubits": 2, "gates": [{"type": "H", "targets": [0]}, {"type": "CX", "targets": [0, 1]}]},
        backend_name="ibm_brisbane",
        shots=500
    )
    job = await IBMQuantumService.submit_job(sub)
    assert job.status == "COMPLETED"
    assert job.backend_name == "ibm_brisbane"
    assert len(job.ideal_counts) > 0
    assert len(job.hardware_counts) > 0
    assert job.fidelity_score > 0.0
    assert "t1_us" in job.calibration_metrics


@pytest.mark.asyncio
async def test_qbraid_cloud_service():
    devices = QBraidService.list_devices()
    assert len(devices) >= 2

    sub = QBraidJobSubmission(
        circuit_json={"num_qubits": 1, "gates": [{"type": "H", "targets": [0]}]},
        target_backend="qbraid_sdk_simulator",
        framework="qiskit",
        shots=300
    )
    job = await QBraidService.submit_job(sub)
    assert job.status == "COMPLETED"
    assert job.target_backend == "qbraid_sdk_simulator"
    assert job.counts is not None


@pytest.mark.asyncio
async def test_qiskit_nisq_noise_model():
    backend = QiskitBackend()
    circuit = {"num_qubits": 2, "gates": [{"type": "H", "targets": [0]}, {"type": "CX", "targets": [0, 1]}]}
    res = await backend.execute_circuit(
        circuit,
        shots=400,
        noise_config={"enabled": True, "depolarizing_error": 0.04, "readout_error": 0.02}
    )
    assert res["noise_model_applied"] is True
    assert res["backend"] == "qiskit_aer_noisy_simulator"
    assert len(res["counts"]) >= 2
