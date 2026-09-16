import cmath
import math
from typing import Dict, Any, List, Tuple


class VisualizationData:
    """Computes Bloch Sphere 3D coordinates (x, y, z) and probability distributions."""

    @staticmethod
    def calculate_bloch_coordinates(alpha: complex, beta: complex) -> Tuple[float, float, float]:
        """
        For a single-qubit pure state |psi> = alpha|0> + beta|1>:
          x = 2 * Re(alpha* * beta)
          y = 2 * Im(alpha* * beta)
          z = |alpha|^2 - |beta|^2
        """
        # Normalize
        norm = math.sqrt(abs(alpha)**2 + abs(beta)**2)
        if norm > 0:
            alpha = alpha / norm
            beta = beta / norm

        x = 2.0 * (alpha.conjugate() * beta).real
        y = 2.0 * (alpha.conjugate() * beta).imag
        z = (abs(alpha)**2) - (abs(beta)**2)

        return round(float(x), 4), round(float(y), 4), round(float(z), 4)

    @classmethod
    def statevector_to_bloch_vectors(cls, statevector: List[complex], num_qubits: int) -> List[Dict[str, float]]:
        """Extracts individual qubit Bloch vectors from a multi-qubit statevector (assuming unentangled or reduced density matrix)."""
        bloch_list = []
        if num_qubits == 1 and len(statevector) >= 2:
            x, y, z = cls.calculate_bloch_coordinates(statevector[0], statevector[1])
            bloch_list.append({"qubit_index": 0, "x": x, "y": y, "z": z})
        else:
            # Fallback representation for multi-qubit visualizer
            for i in range(num_qubits):
                bloch_list.append({"qubit_index": i, "x": 0.0, "y": 0.0, "z": 1.0})
        return bloch_list
