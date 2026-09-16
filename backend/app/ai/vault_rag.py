import os
import re
from typing import Dict, List, Optional, Any
from app.parsers.obsidian_parser import ObsidianVaultParser, VaultNote


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

            # Exact title match bonus
            for token in query_tokens:
                if token in title_tokens:
                    score += 10
                if token in tag_tokens:
                    score += 5
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
                    "difficulty": note.difficulty
                })

        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]
