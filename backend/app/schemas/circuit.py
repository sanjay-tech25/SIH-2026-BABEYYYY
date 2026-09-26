from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CircuitCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    num_qubits: int = Field(default=2, ge=1, le=10)
    circuit_json: Dict[str, Any]
    qasm_code: Optional[str] = None
    lesson_id: Optional[str] = None


class CircuitExecutionRequest(BaseModel):
    circuit_id: Optional[str] = None
    circuit_json: Optional[Dict[str, Any]] = None  # Can execute ad-hoc JSON directly
    shots: int = Field(default=1024, ge=10, le=8192)
    framework: Optional[str] = Field(default="qiskit", description="Execution target: qiskit, cirq, pennylane")
    noise_config: Optional[Dict[str, Any]] = Field(default=None, description="Physical noise parameters")


class BlochVectorRead(BaseModel):
    qubit_index: int
    x: float
    y: float
    z: float


class CircuitExecutionResultRead(BaseModel):
    backend: str
    framework: str = "qiskit"
    shots: int
    execution_time_ms: float
    counts: Dict[str, int]
    bloch_vectors: List[BlochVectorRead]
    noise_model_applied: bool = False
    circuit_diagram: Optional[str] = None
    xp_earned: int = 60


class CircuitOptimizationRequest(BaseModel):
    circuit_json: Dict[str, Any]
    optimization_level: int = Field(default=2, ge=0, le=3)


class CircuitOptimizationResponse(BaseModel):
    initial_gate_count: int
    optimized_gate_count: int
    gate_count_reduction: int
    initial_depth: int
    optimized_depth: int
    depth_reduction_pct: float
    initial_two_qubit_count: int
    optimized_two_qubit_count: int
    two_qubit_reduction: int
    estimated_fidelity_gain_pct: float
    optimization_level: int
    optimization_notes: List[str]
    optimized_circuit_json: Dict[str, Any]


class IBMQDeviceResponse(BaseModel):
    backend_name: str
    num_qubits: int
    status: str
    queue_depth: int
    basis_gates: List[str]
    t1_avg_us: float
    t2_avg_us: float
    avg_readout_error: float
    avg_cnot_error: float
    description: str


class IBMQJobSubmissionRequest(BaseModel):
    circuit_json: Dict[str, Any]
    backend_name: str = "ibm_brisbane"
    shots: int = Field(default=1024, ge=100, le=8192)
    api_token: Optional[str] = None


class IBMQJobStatusResponse(BaseModel):
    job_id: str
    backend_name: str
    status: str
    queue_position: int
    shots: int
    created_at: float
    completed_at: Optional[float] = None
    ideal_counts: Dict[str, int]
    hardware_counts: Dict[str, int]
    calibration_metrics: Dict[str, Any]
    total_variation_distance: float
    fidelity_score: float


class QBraidJobSubmissionRequest(BaseModel):
    circuit_json: Dict[str, Any]
    target_backend: str = "qbraid_sdk_simulator"
    framework: str = "qiskit"
    shots: int = Field(default=1024, ge=100, le=8192)
    user_api_key: Optional[str] = None


class QBraidJobStatusResponse(BaseModel):
    job_id: str
    status: str
    target_backend: str
    framework: str
    shots: int
    created_at: float
    completed_at: Optional[float] = None
    counts: Optional[Dict[str, int]] = None
    execution_time_ms: float
    device_properties: Dict[str, Any] = {}


class SandboxExecutionRequestSchema(BaseModel):
    code: str
    timeout_seconds: float = Field(default=5.0, ge=0.5, le=30.0)


class SandboxExecutionResponseSchema(BaseModel):
    success: bool
    stdout: str
    stderr: str
    execution_time_ms: float
    violations: List[str] = []
    circuit_found: bool = False
    metrics: Dict[str, Any] = {}
