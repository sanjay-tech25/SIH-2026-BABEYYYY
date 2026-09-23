from typing import List, Dict, Any, Optional


class AssessmentEngine:
    """Evaluates assessment attempts using Concept-Importance Weighting and Foundational Gating.
    
    Foundational concepts are strictly gated: a failure in critical axioms triggers compulsory
    remediation and blocks advancement until verified mastery is demonstrated.
    """

    CONCEPT_CATEGORY_WEIGHTS = {
        "FOUNDATIONAL": 2.0,
        "CORE": 1.2,
        "ADVANCED": 1.0,
    }

    @classmethod
    def get_concept_category(cls, concept_id: str) -> str:
        cid = concept_id.lower()
        if any(term in cid for term in ["foundat", "math", "vector", "qubit", "hilbert", "state", "born"]):
            return "FOUNDATIONAL"
        if any(term in cid for term in ["algo", "grover", "shor", "error", "mitigat", "vqe", "runtime"]):
            return "ADVANCED"
        return "CORE"

    @classmethod
    def evaluate_attempt(
        cls,
        questions: List[Dict[str, Any]],
        answers: Dict[str, str]  # question_id -> selected_option_id
    ) -> Dict[str, Any]:
        """
        questions: List of question dicts containing:
          - id: str
          - prompt: str
          - concept_id: str
          - category: Optional[str] (FOUNDATIONAL, CORE, ADVANCED)
          - options: List of option dicts (id, is_correct, distractor_feedback, option_text)
        """
        total = len(questions)
        if total == 0:
            return {
                "score_percentage": 0.0,
                "raw_score_percentage": 0.0,
                "correct_count": 0,
                "total_questions": 0,
                "passed": False,
                "can_advance": False,
                "compulsory_retake": True,
                "foundational_breach": False,
                "failed_critical_concepts": [],
                "feedback": [],
                "concept_breakdown": {}
            }

        correct_count = 0
        feedback_list = []
        concept_breakdown: Dict[str, Dict[str, Any]] = {}
        failed_critical_concepts = []

        total_weight = 0.0
        earned_weight = 0.0

        for q in questions:
            q_id = q["id"]
            c_id = q.get("concept_id", "default")
            category = q.get("category") or cls.get_concept_category(c_id)
            weight = q.get("weight") or cls.CONCEPT_CATEGORY_WEIGHTS.get(category, 1.0)
            total_weight += weight

            if c_id not in concept_breakdown:
                concept_breakdown[c_id] = {
                    "correct": 0,
                    "total": 0,
                    "category": category,
                    "weight": weight
                }
            concept_breakdown[c_id]["total"] += 1

            selected_opt_id = answers.get(q_id)
            selected_option = next((opt for opt in q["options"] if opt["id"] == selected_opt_id), None)
            correct_option = next((opt for opt in q["options"] if opt.get("is_correct")), None)

            is_correct = bool(selected_option and selected_option.get("is_correct"))
            if is_correct:
                correct_count += 1
                earned_weight += weight
                concept_breakdown[c_id]["correct"] += 1
                feedback_list.append({
                    "question_id": q_id,
                    "is_correct": True,
                    "concept_id": c_id,
                    "category": category,
                    "feedback_text": "Correct! Demonstrated verified understanding of concept axioms."
                })
            else:
                if category == "FOUNDATIONAL" and c_id not in failed_critical_concepts:
                    failed_critical_concepts.append(c_id)

                distractor_note = (
                    selected_option.get("distractor_feedback")
                    if selected_option and selected_option.get("distractor_feedback")
                    else q.get("explanation", "Review the concept material.")
                )
                feedback_list.append({
                    "question_id": q_id,
                    "is_correct": False,
                    "concept_id": c_id,
                    "category": category,
                    "selected_option_id": selected_opt_id,
                    "correct_option_id": correct_option["id"] if correct_option else None,
                    "feedback_text": distractor_note
                })

        raw_score_percentage = round((correct_count / total) * 100.0, 1)
        weighted_score_percentage = round((earned_weight / total_weight) * 100.0, 1) if total_weight > 0 else 0.0

        # Strict Gate: If any foundational concept is completely failed, trigger foundational breach
        foundational_breach = len(failed_critical_concepts) > 0

        # Must score >= 70.0% weighted AND have zero critical foundational breaches
        passed = (weighted_score_percentage >= 70.0) and not foundational_breach
        can_advance = passed
        compulsory_retake = not passed

        return {
            "score_percentage": weighted_score_percentage,
            "raw_score_percentage": raw_score_percentage,
            "correct_count": correct_count,
            "total_questions": total,
            "passed": passed,
            "can_advance": can_advance,
            "compulsory_retake": compulsory_retake,
            "foundational_breach": foundational_breach,
            "failed_critical_concepts": failed_critical_concepts,
            "feedback": feedback_list,
            "concept_breakdown": concept_breakdown
        }

