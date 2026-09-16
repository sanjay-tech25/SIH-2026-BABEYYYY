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
    shots: int = Field(default=1024, ge=100, le=8192)


class BlochVectorRead(BaseModel):
    qubit_index: int
    x: float
    y: float
    z: float


class CircuitExecutionResultRead(BaseModel):
    backend: str
    shots: int
    execution_time_ms: float
    counts: Dict[str, int]
    bloch_vectors: List[BlochVectorRead]
    xp_earned: int = 60
