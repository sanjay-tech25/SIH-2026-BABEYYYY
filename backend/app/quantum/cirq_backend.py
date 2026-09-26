import time
import math
from typing import Dict, Any, List
import cirq
import numpy as np
from app.quantum.base import QuantumBackend
from app.core.logging import logger


class CirqBackend(QuantumBackend):
    """Executes quantum circuits on Google Cirq native simulator."""

    async def execute_circuit(self, circuit_data: Dict[str, Any], shots: int = 1024) -> Dict[str, Any]:
        start_time = time.time()
        num_qubits = circuit_data.get("num_qubits", 1)
        gates = circuit_data.get("gates", [])

        # Create line qubits: q(0), q(1), ...
        qubits = [cirq.LineQubit(i) for i in range(num_qubits)]
        circuit = cirq.Circuit()

        # Place gates
        for g in gates:
            gtype = g.get("type", "").upper()
            targets = g.get("targets", [])
            if not targets:
                continue

            q0 = qubits[targets[0]]

            if gtype == "H":
                circuit.append(cirq.H(q0))
            elif gtype == "X":
                circuit.append(cirq.X(q0))
            elif gtype == "Y":
                circuit.append(cirq.Y(q0))
            elif gtype == "Z":
                circuit.append(cirq.Z(q0))
            elif gtype == "S":
                circuit.append(cirq.S(q0))
            elif gtype == "T":
                circuit.append(cirq.T(q0))
            elif gtype == "RX":
                angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                circuit.append(cirq.rx(angle).on(q0))
            elif gtype == "RY":
                angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                circuit.append(cirq.ry(angle).on(q0))
            elif gtype == "RZ":
                angle = g.get("params", {}).get("theta", math.pi / 2) if isinstance(g.get("params"), dict) else math.pi / 2
                circuit.append(cirq.rz(angle).on(q0))
            elif gtype in ("CX", "CNOT"):
                ctrl_idx = targets[0]
                tgt_idx = targets[1] if len(targets) > 1 else (1 if ctrl_idx == 0 else 0)
                if tgt_idx < num_qubits:
                    circuit.append(cirq.CNOT(qubits[ctrl_idx], qubits[tgt_idx]))
            elif gtype == "CZ":
                ctrl_idx = targets[0]
                tgt_idx = targets[1] if len(targets) > 1 else (1 if ctrl_idx == 0 else 0)
                if tgt_idx < num_qubits:
                    circuit.append(cirq.CZ(qubits[ctrl_idx], qubits[tgt_idx]))
            elif gtype == "SWAP":
                q1_idx = targets[0]
                q2_idx = targets[1] if len(targets) > 1 else (1 if q1_idx == 0 else 0)
                if q2_idx < num_qubits:
                    circuit.append(cirq.SWAP(qubits[q1_idx], qubits[q2_idx]))
            elif gtype in ("I", "ID"):
                circuit.append(cirq.I(q0))

        # Full statevector simulation before terminal measurement
        sim = cirq.Simulator()
        sim_result = sim.simulate(circuit, qubit_order=qubits)
        raw_sv = sim_result.final_state_vector

        # Convert statevector to formatted complex list
        statevector = [
            {"index": idx, "real": round(float(c.real), 4), "imag": round(float(c.imag), 4)}
            for idx, c in enumerate(raw_sv)
        ]

        # Calculate Bloch sphere vector coordinates for each individual qubit
        bloch_vectors = []
        for i in range(num_qubits):
            try:
                bv = cirq.bloch_vector_from_state_vector(raw_sv, i)
                bloch_vectors.append({
                    "qubit_index": i,
                    "x": round(float(bv[0]), 3),
                    "y": round(float(bv[1]), 3),
                    "z": round(float(bv[2]), 3)
                })
            except Exception:
                bloch_vectors.append({"qubit_index": i, "x": 0.0, "y": 0.0, "z": 1.0})

        # Terminal measurement for shot counts
        meas_circuit = circuit.copy()
        meas_circuit.append(cirq.measure(*qubits, key="m"))
        sample_result = sim.run(meas_circuit, repetitions=shots)
        measurements = sample_result.measurements["m"]

        # Aggregate counts
        counts: Dict[str, int] = {}
        for row in measurements:
            bitstring = "".join(str(bit) for bit in row)
            counts[bitstring] = counts.get(bitstring, 0) + 1

        exec_time = (time.time() - start_time) * 1000.0

        return {
            "backend": "google_cirq_simulator",
            "framework": "cirq",
            "shots": shots,
            "execution_time_ms": round(exec_time, 2),
            "counts": counts,
            "statevector": statevector,
            "bloch_vectors": bloch_vectors,
            "circuit_diagram": str(circuit)
        }
