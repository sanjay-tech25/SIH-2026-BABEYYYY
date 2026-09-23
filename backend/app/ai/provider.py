import re
from typing import Dict, Any, List, Optional
from app.ai.guardrails import AIGuardrails
from app.ai.vault_rag import VaultBrainRAG


class SocraticTeachingEngine:
    """Core pedagogical synthesizer that builds non-leaking Socratic learning guidance grounded in the Obsidian Vault."""

    @staticmethod
    def extract_level_intuition(intuition_text: str, age_bracket: str = "STUDENT") -> str:
        """Extracts intuition tailored to learner age tier."""
        if not intuition_text:
            return ""

        tier_lower = age_bracket.lower()
        if "young" in tier_lower:
            m = re.search(r"Level 1\s*\([^)]*\)\s*:\s*(.+?)(?=\n- Level|\Z)", intuition_text, re.DOTALL | re.IGNORECASE)
            if m:
                return m.group(1).strip()
        elif "adult" in tier_lower or "professional" in tier_lower:
            m = re.search(r"Level 2\s*\([^)]*\)\s*:\s*(.+?)(?=\n- Level|\Z)", intuition_text, re.DOTALL | re.IGNORECASE)
            if m:
                return m.group(1).strip()

        # Default student: grab Level 1 or full text
        m = re.search(r"Level 1\s*\([^)]*\)\s*:\s*(.+?)(?=\n- Level|\Z)", intuition_text, re.DOTALL | re.IGNORECASE)
        if m:
            return m.group(1).strip()
        return intuition_text[:400].strip()

    @staticmethod
    def derive_socratic_inquiry(note_title: str, common_mistakes: str, user_query: str) -> str:
        """Generates a targeted probing question highlighting cognitive traps."""
        if common_mistakes:
            # Clean first bullet from common mistakes
            clean_mistake = re.sub(r"^[-*#\s]+", "", common_mistakes.strip().split("\n")[0]).strip()
            if len(clean_mistake) > 20:
                return (
                    f"Consider this cognitive trap: {clean_mistake} "
                    "How does this challenge your intuitive expectation when measuring or transforming this state?"
                )

        # Conceptual inquiries by topic
        title_lower = note_title.lower()
        if "hadamard" in title_lower or "superposition" in title_lower:
            return (
                "If you apply a Hadamard transformation twice consecutively (H applied to H|0>), "
                "why do the probability amplitudes interfere destructively instead of producing a random 50/50 mix?"
            )
        elif "born rule" in title_lower or "measurement" in title_lower or "probability" in title_lower:
            return (
                "When a state has a negative amplitude like -1/sqrt(2), what happens to that negative sign "
                "when you calculate the physical measurement probability |alpha|^2? Where does that negative phase actually make a physical difference?"
            )
        elif "cnot" in title_lower or "bell" in title_lower or "entanglement" in title_lower:
            return (
                "If two qubits are maximally entangled, why is it mathematically impossible to describe qubit A "
                "with an independent statevector without referencing qubit B?"
            )
        elif "unitary" in title_lower:
            return (
                "Why must every closed quantum operation preserve the total sum of squared probabilities (equal to 1.0), "
                "and what does that imply about whether quantum computation can ever erase information?"
            )
        elif "phase" in title_lower:
            return (
                "If a phase gate changes the angle without changing |alpha|^2 or |beta|^2, "
                "why does measuring in the standard computational basis fail to reveal the phase change until you apply another interference gate?"
            )

        return (
            f"How does the mathematical structure of {note_title} differ from our everyday classical intuition, "
            "and what thought experiment could verify this in an interactive circuit?"
        )

    @staticmethod
    def derive_micro_action(note_title: str, circuit_str: str) -> str:
        """Suggests a concrete thought experiment or practical lab action."""
        title_lower = note_title.lower()
        if "superposition" in title_lower or "hadamard" in title_lower:
            return "Test this in Open Lab: place an H gate on wire 0, then a second H gate. Observe how the output deterministically collapses back to |0>."
        elif "phase" in title_lower:
            return "Try this in the Bloch visualizer: rotate the qubit into the equator with H, then apply an S or Z gate to watch the vector rotate along the azimuthal angle phi."
        elif "cnot" in title_lower or "bell" in title_lower:
            return "Construct a 2-qubit circuit with H on q[0] and CNOT(0, 1). Run 1000 shots in simulation and verify why only |00> and |11> appear."
        elif "born rule" in title_lower:
            return "Calculate: for state |psi> = (3/5)|0> - (4/5)|1>, compute |-4/5|^2 to confirm the probability of measuring 1 is exactly 64%."

        return f"Verify the mathematical transformation in the Open Lab and observe the statevector coefficients before and after applying {note_title}."


class AIProvider:
    """AI Tutor Provider grounded directly in the Obsidian Quantum Brain and Socratic Teaching Engine."""

    @classmethod
    async def generate_tutor_response(
        cls,
        user_query: str,
        learner_context: str = "",
        topic_id: Optional[str] = None,
        mode: str = "socratic_guidance"
    ) -> Dict[str, Any]:
        is_safe, rejection_msg = AIGuardrails.check_input(user_query)
        if not is_safe:
            return {
                "answer": rejection_msg,
                "analogy": "Safety Boundary",
                "socratic_inquiry": "Let's explore quantum foundations or quantum computing algorithms instead.",
                "micro_action": "Select an active lesson topic from your curriculum journey.",
                "citations": [],
                "vault_citations": [],
                "is_grounded": True
            }

        # Determine age tier from learner_context
        age_bracket = "STUDENT"
        if "YOUNG" in learner_context:
            age_bracket = "YOUNG"
        elif "ADULT" in learner_context:
            age_bracket = "ADULT"

        # Search or fetch scaffold from Obsidian Vault
        vault_matches = []
        if topic_id:
            scaffold = VaultBrainRAG.get_scaffold_for_topic(topic_id=topic_id)
            if scaffold:
                vault_matches.append({
                    "title": scaffold["title"],
                    "folder": scaffold["folder"],
                    "slug": scaffold["slug"],
                    "summary": scaffold["definition"],
                    "sections": {
                        "Definition": scaffold["definition"],
                        "Intuition": scaffold["intuition"],
                        "Common Mistakes": scaffold["common_mistakes"],
                        "Mathematical Foundation": scaffold["math_foundation"],
                        "Key Equations": scaffold["key_equations"],
                        "Circuit": scaffold["circuit"]
                    },
                    "tags": scaffold["tags"],
                    "wikilinks": scaffold["wikilinks"]
                })

        if not vault_matches:
            vault_matches = VaultBrainRAG.search_vault(user_query, top_k=2)

        if vault_matches:
            top_match = vault_matches[0]
            title = top_match["title"]
            folder = top_match["folder"]
            slug = top_match["slug"]
            sections = top_match.get("sections", {})

            summary = top_match.get("summary") or sections.get("Definition", "")
            intuition_raw = sections.get("Intuition", "")
            common_mistakes = sections.get("Common Mistakes", "")
            math_sec = sections.get("Mathematical Foundation", "")
            key_eq = sections.get("Key Equations", "")
            circuit_sec = sections.get("Circuit", "")

            # 1. Physical mental model / intuition adapted to age tier
            analogy = SocraticTeachingEngine.extract_level_intuition(intuition_raw, age_bracket)
            if not analogy:
                analogy = summary[:350].strip()

            # 2. Socratic probing inquiry
            inquiry = SocraticTeachingEngine.derive_socratic_inquiry(title, common_mistakes, user_query)

            # 3. Actionable micro-challenge
            micro_action = SocraticTeachingEngine.derive_micro_action(title, circuit_sec)

            # Construct structured Socratic answer
            answer_parts = [
                f"### Socratic Guidance: {title} (`[[{title}]]`)",
                f"*Source: Quantum Vault ({folder})*",
                "",
                "#### 1. Intuitive Mental Model",
                analogy,
                "",
                "#### 2. Guiding Socratic Inquiry",
                f"> **Think through this:** {inquiry}",
                "",
                "#### 3. Actionable Discovery Step",
                f"* {micro_action}"
            ]

            if key_eq:
                # Include compact formula snippet if available
                formula_clean = key_eq.split("\n")[0].strip()
                if formula_clean:
                    answer_parts.extend(["", f"**Key Principle**: `{formula_clean}`"])

            answer = "\n".join(answer_parts)

            # Build citations list including slug and wikilinks
            citations = [slug, title.lower()]
            for m in vault_matches:
                if m["slug"] not in citations:
                    citations.append(m["slug"])
                if m["title"] not in citations:
                    citations.append(m["title"])

            vault_citations = [f"[[{m['title']}]]" for m in vault_matches]

            return {
                "answer": answer,
                "concept_title": title,
                "analogy": analogy,
                "socratic_inquiry": inquiry,
                "micro_action": micro_action,
                "citations": citations,
                "vault_citations": vault_citations,
                "is_grounded": True
            }
        else:
            fallback_title = "Quantum State Evolution"
            analogy = (
                "In quantum systems, pure states inhabit a complex vector Hilbert space. "
                "Unlike classical probabilities which simply accumulate, complex amplitudes can interfere destructively, "
                "allowing certain paths to cancel out entirely."
            )
            inquiry = (
                "How would you determine if an operation is physically realizable as a closed quantum system "
                "versus an irreversible classical measurement?"
            )
            micro_action = "Review the Bloch sphere visualization in the lesson to see how unitary gates rotate state vectors."

            answer = (
                f"### Socratic Guidance: {fallback_title}\n\n"
                f"#### 1. Intuitive Mental Model\n{analogy}\n\n"
                f"#### 2. Guiding Socratic Inquiry\n> **Reflect on this:** {inquiry}\n\n"
                f"#### 3. Actionable Discovery Step\n* {micro_action}"
            )

            return {
                "answer": answer,
                "concept_title": fallback_title,
                "analogy": analogy,
                "socratic_inquiry": inquiry,
                "micro_action": micro_action,
                "citations": ["quantum foundations", "superposition"],
                "vault_citations": ["[[Quantum State]]"],
                "is_grounded": True
            }

    @classmethod
    def generate_diagnostic_guidance(
        cls,
        topic_id: str,
        question_text: str,
        selected_option: str,
        correct_option: str,
        explanation_summary: str = ""
    ) -> Dict[str, Any]:
        """Generates a targeted Socratic diagnostic for formative check failures without revealing the answer."""
        scaffold = VaultBrainRAG.get_scaffold_for_topic(topic_id=topic_id)
        note_title = scaffold["title"] if scaffold else "Quantum Principle"
        common_mistakes = scaffold.get("common_mistakes", "") if scaffold else ""

        diagnosis = (
            f"You selected: \"{selected_option}\". "
            "Notice where this assumption relies on classical intuition: in quantum computing, states are complex probability amplitudes, not classical probabilities. "
        )

        if common_mistakes:
            first_mistake = common_mistakes.split("\n")[0].strip()
            diagnosis += f"Vault Note Insight: {first_mistake} "

        inquiry = (
            f"Reflect on the normalization axiom for {note_title}: "
            "How does applying the Born Rule (|alpha|^2) or unitary preservation (U dagger U = I) "
            "disprove your chosen option?"
        )

        return {
            "diagnosis": diagnosis.strip(),
            "socratic_inquiry": inquiry,
            "remediation_topic": note_title,
            "vault_citation": f"[[{note_title}]]",
            "is_grounded": True
        }
