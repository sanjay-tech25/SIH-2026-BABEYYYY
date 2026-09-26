import time
import math
from typing import Dict, Any, List
import pennylane as qml
import numpy as np
from app.quantum.base import QuantumBackend
from app.core.logging import logger


class PennyLaneBackend(QuantumBackend):
    """Executes quantum circuits on Xanadu PennyLane native simulator."""

    async def execute_circuit(self, circuit_data: Dict[str, Any], shots: int = 1024) -> Dict[str, Any]:
        start_time = time.time()
        num_qubits = circuit_data.get("num_qubits", 1)
        gates = circuit_data.get("gates", [])

        # Create PennyLane device
        dev = qml.device("default.qubit", wires=num_qubits)

        def apply_gates():
            for g in gates:
                gtype = g.get("type", "").upper()
                targets = g.get("targets", [])
                if not targets:
                    continue

                q0 = targets[0]
                if gtype == "H":
                    qml.Hadamard(wires=q0)
                elif gtype == "X":
                    qml.PauliX(wires=q0)
                elif gtype == "Y":
                    qml.PauliY(wires=q0)
                elif gtype == "Z":
                    qml.PauliZ(wires=q0)
                elif gtype == "S":
                    qml.S(wires=q0)
                elif gtype == "T":
                    qml.T(wires=q0)
                elif gtype == "RX":
                    angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                    qml.RX(angle, wires=q0)
                elif gtype == "RY":
                    angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                    qml.RY(angle, wires=q0)
                elif gtype == "RZ":
                    angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                    qml.RZ(angle, wires=q0)
                elif gtype in ("CX", "CNOT"):
                    ctrl = targets[0]
                    tgt = targets[1] if len(targets) > 1 else (1 if ctrl == 0 else 0)
                    if tgt < num_qubits:
                        qml.CNOT(wires=[ctrl, tgt])
                elif gtype == "CZ":
                    ctrl = targets[0]
                    tgt = targets[1] if len(targets) > 1 else (1 if ctrl == 0 else 0)
                    if tgt < num_qubits:
                        qml.CZ(wires=[ctrl, tgt])
                elif gtype == "SWAP":
                    q1 = targets[0]
                    q2 = targets[1] if len(targets) > 1 else (1 if q1 == 0 else 0)
                    if q2 < num_qubits:
                        qml.SWAP(wires=[q1, q2])
                elif gtype in ("I", "ID"):
                    qml.Identity(wires=q0)

        # 1. Analytic statevector and density matrix extraction
        @qml.qnode(dev)
        def state_circuit():
            apply_gates()
            return qml.state()

        raw_sv = state_circuit()
        sv_array = np.array(raw_sv, dtype=complex)

        statevector = [
            {"index": idx, "real": round(float(c.real), 4), "imag": round(float(c.imag), 4)}
            for idx, c in enumerate(sv_array)
        ]

        # Calculate Bloch sphere vector coordinates for each individual qubit
        bloch_vectors = []
        for i in range(num_qubits):
            try:
                # Expectation values of Pauli X, Y, Z for qubit i
                @qml.qnode(dev)
                def pauli_circuit(wire):
                    apply_gates()
                    return qml.expval(qml.PauliX(wire)), qml.expval(qml.PauliY(wire)), qml.expval(qml.PauliZ(wire))

                exp_x, exp_y, exp_z = pauli_circuit(i)
                bloch_vectors.append({
                    "qubit_index": i,
                    "x": round(float(exp_x), 3),
                    "y": round(float(exp_y), 3),
                    "z": round(float(exp_z), 3)
                })
            except Exception as e:
                logger.warning(f"PennyLane Bloch vector calculation exception for wire {i}: {e}")
                bloch_vectors.append({"qubit_index": i, "x": 0.0, "y": 0.0, "z": 1.0})

        # 2. Sampled execution for shot counts
        @qml.qnode(dev, shots=shots)
        def sample_circuit():
            apply_gates()
            return qml.sample()

        samples = sample_circuit()
        counts: Dict[str, int] = {}
        for sample in np.array(samples):
            if num_qubits == 1:
                bit_val = int(sample.item()) if hasattr(sample, "item") else int(sample)
                bitstring = str(bit_val)
            else:
                bitstring = "".join(str(int(bit)) for bit in sample)
            counts[bitstring] = counts.get(bitstring, 0) + 1

        exec_time = (time.time() - start_time) * 1000.0

        return {
            "backend": "xanadu_pennylane_simulator",
            "framework": "pennylane",
            "shots": shots,
            "execution_time_ms": round(exec_time, 2),
            "counts": counts,
            "statevector": statevector,
            "bloch_vectors": bloch_vectors
        }
