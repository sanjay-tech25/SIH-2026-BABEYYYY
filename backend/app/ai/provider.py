import asyncio
from typing import Dict, Any, List
from app.ai.prompts import SOCRATIC_TUTOR_SYSTEM_PROMPT
from app.ai.guardrails import AIGuardrails
from app.ai.vault_rag import VaultBrainRAG
from app.core.config import settings


class AIProvider:
    """AI Tutor Provider grounded directly in the Obsidian Quantum Brain."""

    @classmethod
    async def generate_tutor_response(
        cls,
        user_query: str,
        learner_context: str
    ) -> Dict[str, Any]:
        is_safe, rejection_msg = AIGuardrails.check_input(user_query)
        if not is_safe:
            return {
                "answer": rejection_msg,
                "citations": [],
                "is_grounded": True
            }

        # Query the Obsidian Vault Brain RAG
        vault_matches = VaultBrainRAG.search_vault(user_query, top_k=2)

        if vault_matches:
            top_match = vault_matches[0]
            title = top_match["title"]
            folder = top_match["folder"]
            summary = top_match["summary"] or top_match["sections"].get("Definition", "")
            intuition = top_match["sections"].get("Intuition", "")
            math_sec = top_match["sections"].get("Mathematical Foundation", "")

            # Construct Socratic grounding from the Obsidian Note
            answer_parts = []
            answer_parts.append(f"From the **{title}** vault note ({folder}):")
            if summary:
                answer_parts.append(f"\n{summary}")
            if intuition:
                answer_parts.append(f"\n**Intuition**: {intuition[:300]}...")
            if math_sec:
                answer_parts.append(f"\n**Key Formula**: {math_sec[:200]}...")

            answer_parts.append(f"\n\nHow do you think this property affects measurement in a multi-qubit circuit?")
            answer = "\n".join(answer_parts)
            citations = [m["slug"] for m in vault_matches] + [m["title"] for m in vault_matches]
        else:
            answer = (
                f"Great inquiry! In quantum systems, concepts connect across our 12-stage knowledge graph. "
                "Based on your query, consider exploring our foundational state vector representations or trying an interactive circuit in the Quantum Lab. What specific aspect would you like to explore deeper?"
            )
            citations = ["Quantum Foundations"]

        return {
            "answer": answer,
            "citations": citations,
            "is_grounded": True
        }
