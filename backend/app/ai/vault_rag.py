import os
import re
from typing import Dict, List, Optional, Any
from app.parsers.obsidian_parser import ObsidianVaultParser, VaultNote


# Canonical mapping from curriculum topic IDs to primary Vault note titles
TOPIC_TO_NOTE_MAP: Dict[str, str] = {
    "t1-1": "Born Rule",
    "t1-2": "Unitary Operations",
    "t2-1": "Superposition",
    "t2-2": "Pauli X",
    "t3-1": "Phase Gates",
    "t3-2": "Bloch Sphere",
    "t4-1": "CNOT",
    "t4-2": "Bell States",
    "t5-1": "Reversible Computing",
    "t5-2": "Quantum Teleportation",
    "t6-1": "Deutsch Algorithm",
    "t6-2": "Bernstein-Vazirani Algorithm",
    "t7-1": "Grover Algorithm",
    "t7-2": "Amplitude Amplification",
    "t8-1": "Quantum Fourier Transform",
    "t8-2": "Quantum Phase Estimation",
    "t9-1": "VQE",
    "t9-2": "QAOA",
    "t10-1": "Decoherence",
    "t10-2": "Quantum Noise",
    "t11-1": "Bit Flip Code",
    "t11-2": "Phase Flip Code",
    "t12-1": "NISQ",
    "t12-2": "Quantum Circuit Depth"
}


class VaultBrainRAG:
    """Provides semantic search and context retrieval over the Obsidian Knowledge Vault for the AI Tutor."""

    _notes_cache: Optional[List[VaultNote]] = None

    @classmethod
    def get_all_notes(cls) -> List[VaultNote]:
        if cls._notes_cache is not None:
            return cls._notes_cache

        # Locate Quantum_Vault directory
        cur_dir = os.path.dirname(os.path.abspath(__file__))
        vault_path = os.path.abspath(os.path.join(cur_dir, "..", "..", "..", "Quantum_Vault"))
        if not os.path.isdir(vault_path):
            return []

        cls._notes_cache = ObsidianVaultParser.scan_vault(vault_path)
        return cls._notes_cache

    @classmethod
    def get_note_by_title_or_slug(cls, identifier: str) -> Optional[VaultNote]:
        notes = cls.get_all_notes()
        norm_id = identifier.lower().replace("-", " ").replace("_", " ").strip()
        for note in notes:
            if (
                note.title.lower() == norm_id
                or note.slug.lower() == norm_id.replace(" ", "_")
                or norm_id in note.title.lower()
            ):
                return note
        return None

    @classmethod
    def search_vault(cls, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        notes = cls.get_all_notes()
        if not notes:
            return []

        query_tokens = set(re.findall(r"\w+", query.lower()))
        if not query_tokens:
            return []

        scored_results = []
        for note in notes:
            score = 0
            title_tokens = set(re.findall(r"\w+", note.title.lower()))
            tag_tokens = set(re.findall(r"\w+", " ".join(note.tags).lower()))
            content_tokens = set(re.findall(r"\w+", note.content.lower()))

            # Exact title matches have highest weight
            for token in query_tokens:
                if token in title_tokens:
                    score += 15
                if token in tag_tokens:
                    score += 6
                if token in content_tokens:
                    score += 1

            if score > 0:
                scored_results.append({
                    "score": score,
                    "title": note.title,
                    "folder": note.folder,
                    "slug": note.slug,
                    "summary": note.summary,
                    "sections": note.sections,
                    "tags": note.tags,
                    "difficulty": note.difficulty,
                    "wikilinks": note.wikilinks,
                    "relative_path": note.relative_path
                })

        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]

    @classmethod
    def get_scaffold_for_topic(
        cls,
        topic_id: Optional[str] = None,
        topic_title: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Retrieves structured Socratic guidance material directly from the vault note corresponding to a topic."""
        target_note: Optional[VaultNote] = None

        # 1. Try topic ID direct map
        if topic_id and topic_id in TOPIC_TO_NOTE_MAP:
            target_note = cls.get_note_by_title_or_slug(TOPIC_TO_NOTE_MAP[topic_id])

        # 2. Try topic title search
        if not target_note and topic_title:
            matches = cls.search_vault(topic_title, top_k=1)
            if matches:
                target_note = cls.get_note_by_title_or_slug(matches[0]["title"])

        # 3. Fallback to first available note
        if not target_note:
            all_notes = cls.get_all_notes()
            if all_notes:
                target_note = all_notes[0]
            else:
                return None

        # Cleanly extract pedagogical sections
        sections = target_note.sections
        intuition = sections.get("Intuition", "")
        definition = sections.get("Definition", target_note.summary)
        common_mistakes = sections.get("Common Mistakes", "")
        math_sec = sections.get("Mathematical Foundation", "")
        key_equations = sections.get("Key Equations", "")
        circuit_sec = sections.get("Circuit", "")

        return {
            "title": target_note.title,
            "folder": target_note.folder,
            "slug": target_note.slug,
            "definition": definition.strip(),
            "intuition": intuition.strip(),
            "common_mistakes": common_mistakes.strip(),
            "math_foundation": math_sec.strip(),
            "key_equations": key_equations.strip(),
            "circuit": circuit_sec.strip(),
            "tags": target_note.tags,
            "wikilinks": target_note.wikilinks[:4]
        }
