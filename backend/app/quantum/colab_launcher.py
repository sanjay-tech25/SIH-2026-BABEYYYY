"""Colab Launcher: Generates pre-configured, pedagogically optimized Google Colab launcher links
and provides full notebook schemas for all 5 chapters and 11 curriculum topics.
"""

import json
import os
from typing import Dict, Any, Optional

GITHUB_REPO = "sanjay-tech25/SIH-2026-BABEYYYY"
GITHUB_BRANCH = "main"

NOTEBOOK_TUTORIAL_MAP = {
    # Chapter 1: Mathematics of Quantum Computing (01 - Mathematics)
    "t1-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-1-1_t1-1.ipynb",
    "lab-1-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-1-1_t1-1.ipynb",
    "t1-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-1-2_t1-2.ipynb",
    "lab-1-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-1-2_t1-2.ipynb",

    # Chapter 2: Quantum Foundations & The Qubit (02 - Quantum Foundations)
    "t2-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-2-1_t2-1.ipynb",
    "lab-2-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-2-1_t2-1.ipynb",
    "t2-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-2-2_t2-2.ipynb",
    "lab-2-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-2-2_t2-2.ipynb",

    # Chapter 3: Quantum Gates & Unitary Logic (03 - Quantum Gates)
    "t3-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-3-1_t3-1.ipynb",
    "lab-3-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-3-1_t3-1.ipynb",
    "t3-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-3-2_t3-2.ipynb",
    "lab-3-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-3-2_t3-2.ipynb",

    # Chapter 4: Core Quantum Concepts & Entanglement (04 - Core Quantum Concepts)
    "t4-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-4-1_t4-1.ipynb",
    "lab-4-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-4-1_t4-1.ipynb",
    "bell-state-entanglement": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-4-1_t4-1.ipynb",
    "t4-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-4-2_t4-2.ipynb",
    "lab-4-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-4-2_t4-2.ipynb",

    # Chapter 5: Quantum Communication Protocols (05 - Quantum Protocols)
    "t5-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-5-1_t5-1.ipynb",
    "lab-5-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-5-1_t5-1.ipynb",
    "teleportation": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-5-1_t5-1.ipynb",
    "t5-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-5-2_t5-2.ipynb",
    "lab-5-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-5-2_t5-2.ipynb",

    # Chapter 6: Foundational Quantum Algorithms (06 - Quantum Algorithms)
    "t6-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-6-1_t6-1.ipynb",
    "lab-6-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-6-1_t6-1.ipynb",
    "t6-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-6-2_t6-2.ipynb",
    "lab-6-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-6-2_t6-2.ipynb",
    "grover": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-6-2_t6-2.ipynb",

    # Chapter 7: Advanced Algorithms & Applications (07 - Advanced Algorithms)
    "t7-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-7-1_t7-1.ipynb",
    "lab-7-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-7-1_t7-1.ipynb",
    "t7-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-7-2_t7-2.ipynb",
    "lab-7-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-7-2_t7-2.ipynb",
    "vqe": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-7-2_t7-2.ipynb",

    # Chapter 8: Quantum Cryptography (08 - Quantum Cryptography)
    "t8-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-8-1_t8-1.ipynb",
    "lab-8-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-8-1_t8-1.ipynb",
    "t8-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-8-2_t8-2.ipynb",
    "lab-8-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-8-2_t8-2.ipynb",

    # Chapter 9: Quantum Error Correction (09 - Quantum Error Correction)
    "t9-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-9-1_t9-1.ipynb",
    "lab-9-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-9-1_t9-1.ipynb",
    "t9-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-9-2_t9-2.ipynb",
    "lab-9-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-9-2_t9-2.ipynb",

    # Chapter 10: Quantum Computing Hardware & NISQ Constraints (10 - Quantum Computing Hardware)
    "t1-10": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-10-1_t1-10.ipynb",
    "t10-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-10-1_t1-10.ipynb",
    "lab-10-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-10-1_t1-10.ipynb",
    "t10-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-10-2_t10-2.ipynb",
    "lab-10-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-10-2_t10-2.ipynb",

    # Chapter 11: Practical Quantum Programming with Qiskit 1.0+ (11 - Implementation)
    "t11-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-11-1_t11-1.ipynb",
    "lab-11-1": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-11-1_t11-1.ipynb",
    "t11-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-11-2_t11-2.ipynb",
    "lab-11-2": f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/topics/lab-11-2_t11-2.ipynb",
}


class ColabLauncher:
    """Generates pre-configured Google Colab notebook launcher links with embedded Qiskit code."""

    @staticmethod
    def generate_colab_url(lesson_slug: str, title: Optional[str] = None) -> str:
        """
        Creates a custom Colab link for the given lesson or topic ID.
        """
        slug_clean = lesson_slug.strip().lower()
        if slug_clean in NOTEBOOK_TUTORIAL_MAP:
            return NOTEBOOK_TUTORIAL_MAP[slug_clean]
        
        # Fallback to master lab notebook in this repository
        return f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/notebooks/qubot_master_lab.ipynb"

    @staticmethod
    def get_topic_notebook(topic_id: str) -> Optional[Dict[str, Any]]:
        """
        Loads the generated topic notebook JSON from the local notebooks repository.
        """
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../notebooks/topics"))
        if not os.path.exists(base_dir):
            return None

        for fname in os.listdir(base_dir):
            if fname.endswith(".ipynb") and (topic_id in fname or topic_id.replace("-", "") in fname):
                filepath = os.path.join(base_dir, fname)
                with open(filepath, "r", encoding="utf-8") as f:
                    return json.load(f)
        return None
