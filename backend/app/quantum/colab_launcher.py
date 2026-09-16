import urllib.parse
from typing import Dict, Any


class ColabLauncher:
    """Generates pre-configured Google Colab notebook launcher links with embedded Qiskit code."""

    @staticmethod
    def generate_colab_url(lesson_slug: str, title: str) -> str:
        """
        Creates a custom Colab link for the given lesson.
        """
        notebook_map = {
            "superposition-basics": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb",
            "bell-state-entanglement": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb",
            "grover-algorithm": "https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/algorithms/06_grover.ipynb",
        }
        
        return notebook_map.get(lesson_slug, "https://colab.research.google.com/#create=true")
