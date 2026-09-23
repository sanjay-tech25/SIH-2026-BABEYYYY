from typing import Dict, Any, Optional, List
from app.constants.mastery import RecommendationAction


class RecommendationEngine:
    """Computes next pedagogical recommendation with non-blocking adaptive progression.
    
    Allows learners to advance continuously without mandatory lesson/quiz retakes,
    injecting dynamic scaffolding and bridges as they progress.
    """

    @classmethod
    def get_concept_scaffolding(cls, concept_name: str) -> List[str]:
        """Provides concise adaptive micro-scaffolds and intuitions for concepts."""
        scaffolds = {
            "Superposition": [
                "Intuition: A qubit isn't 0 OR 1, it holds amplitudes α|0⟩ + β|1⟩ where |α|² + |β|² = 1.",
                "Visual Tip: Look at the equator of the Bloch sphere (|0⟩ is North pole, |1⟩ is South pole).",
                "Quick Rule: Hadamard gate H turns |0⟩ into equal superposition |+⟩."
            ],
            "Entanglement": [
                "Intuition: Measuring one qubit instantaneously determines the state of its entangled partner.",
                "Visual Tip: Bell states cannot be factored into two individual single-qubit statevectors.",
                "Quick Rule: A CNOT gate with a control in superposition creates maximum 2-qubit entanglement."
            ],
            "Phase Kickback": [
                "Intuition: When the target qubit is an eigenstate of the gate, eigenvalues kick back to the control qubit.",
                "Quick Rule: |−⟩ is an eigenstate of Pauli X with eigenvalue −1."
            ],
            "Quantum Gates": [
                "Intuition: Quantum gates are unitary rotation matrices (U†U = I) preserving total probability 1.",
                "Quick Rule: Pauli X flips |0⟩ ↔ |1⟩ (NOT gate), Pauli Z flips phase of |1⟩."
            ]
        }
        for key, hints in scaffolds.items():
            if key.lower() in concept_name.lower():
                return hints
        return [
            f"Adaptive Scaffolding: Remember that {concept_name} operates on unitary transformations in Hilbert space.",
            "Use interactive visual representations to build your quantum intuition as you proceed."
        ]

    @classmethod
    def determine_next_action(
        cls,
        concept_name: str,
        mastery_score: float,
        threshold: float = 0.80,
        prerequisite_concept_name: Optional[str] = None,
        foundational_breach: bool = False
    ) -> Dict[str, Any]:
        """
        Decision Matrix (Strict Concept-Importance Gating & Compulsory Remediation):
          - P(M) >= threshold and not breach: ADVANCE (Verified Mastery -> Unlock Next Node)
          - 0.50 <= P(M) < threshold: REINFORCE (Compulsory Targeted Micro-Lesson Retake)
          - P(M) < 0.50 or foundational_breach: REVISE (Strict Lock -> Compulsory Differentiated Retake)
        """
        scaffolding_hints = cls.get_concept_scaffolding(concept_name)

        if mastery_score >= threshold and not foundational_breach:
            action = RecommendationAction.ADVANCE.value
            rationale = (
                f"Mastery Verified! You achieved {int(mastery_score * 100)}% on {concept_name} (Threshold: {int(threshold * 100)}%). "
                "Downstream curriculum nodes are unlocked."
            )
            can_advance = True
            requires_retake = False
            compulsion_level = "NONE"
            remediation_mode = "NONE"
            suggested_action_cta = "Advance to Next Chapter"
        elif mastery_score >= 0.50 and not foundational_breach:
            action = RecommendationAction.REINFORCE.value
            rationale = (
                f"Reinforcement Compulsory: You achieved baseline principles of {concept_name} ({int(mastery_score * 100)}%), "
                f"but fell short of the required {int(threshold * 100)}% mastery threshold. Advancement is locked until you complete targeted micro-practice."
            )
            can_advance = False
            requires_retake = True
            compulsion_level = "COMPULSORY_REINFORCEMENT"
            remediation_mode = "INTERACTIVE_SIMULATION"
            suggested_action_cta = "Start Targeted Simulation Retake"
        else:
            action = RecommendationAction.REVISE.value
            breach_note = " Critical foundational concept failed." if foundational_breach else ""
            if prerequisite_concept_name:
                rationale = (
                    f"Advancement Blocked:{breach_note} {concept_name} requires uncompromised mastery in {prerequisite_concept_name}. "
                    f"You scored {int(mastery_score * 100)}% (Required: {int(threshold * 100)}%). "
                    "Compulsory Differentiated Remediation must be completed before re-taking the assessment."
                )
            else:
                rationale = (
                    f"Advancement Blocked:{breach_note} Mastery score of {int(mastery_score * 100)}% is below the required {int(threshold * 100)}% threshold. "
                    "You cannot move to subsequent chapters without demonstrating mastery. Compulsory Differentiated Remediation is active."
                )
            can_advance = False
            requires_retake = True
            compulsion_level = "MANDATORY_DIFFERENTIATED_RETAKE"
            remediation_mode = "VISUAL_ANALOGY" if foundational_breach else "MISCONCEPTION_DEBUGGER"
            suggested_action_cta = "Launch Compulsory Differentiated Retake"

        remediation_plan = None
        if requires_retake:
            remediation_plan = {
                "mode": remediation_mode,
                "concept_name": concept_name,
                "prerequisite": prerequisite_concept_name,
                "focus_hints": scaffolding_hints,
                "required_score_to_unlock": int(threshold * 100),
                "tasks": [
                    {"id": "t1", "type": "MISCONCEPTION_DECONSTRUCTION", "label": f"Deconstruct cognitive trap for {concept_name}"},
                    {"id": "t2", "type": "VISUAL_REMODELING", "label": "Review geometric Bloch sphere / amplitude phase model"},
                    {"id": "t3", "type": "VERIFICATION_CHECK", "label": "Pass interactive verification challenge before retaking exam"}
                ]
            }

        return {
            "action": action,
            "mastery_score": mastery_score,
            "threshold": threshold,
            "can_advance": can_advance,
            "requires_retake": requires_retake,
            "compulsion_level": compulsion_level,
            "remediation_mode": remediation_mode,
            "rationale": rationale,
            "scaffolding_hints": scaffolding_hints,
            "remediation_plan": remediation_plan,
            "suggested_action_cta": suggested_action_cta
        }


