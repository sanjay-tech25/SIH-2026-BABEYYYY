from typing import List, Dict, Any, Optional


class AssessmentEngine:
    """Evaluates assessment attempts, computes scores, and compiles targeted distractor feedback."""

    @staticmethod
    def evaluate_attempt(
        questions: List[Dict[str, Any]],
        answers: Dict[str, str]  # question_id -> selected_option_id
    ) -> Dict[str, Any]:
        """
        questions: List of question dicts containing:
          - id: str
          - prompt: str
          - concept_id: str
          - options: List of option dicts (id, is_correct, distractor_feedback, option_text)
        """
        total = len(questions)
        if total == 0:
            return {"score_percentage": 0.0, "correct_count": 0, "total": 0, "passed": False, "feedback": []}

        correct_count = 0
        feedback_list = []
        concept_breakdown: Dict[str, Dict[str, int]] = {}

        for q in questions:
            q_id = q["id"]
            c_id = q.get("concept_id", "default")
            if c_id not in concept_breakdown:
                concept_breakdown[c_id] = {"correct": 0, "total": 0}
            concept_breakdown[c_id]["total"] += 1

            selected_opt_id = answers.get(q_id)
            selected_option = next((opt for opt in q["options"] if opt["id"] == selected_opt_id), None)
            correct_option = next((opt for opt in q["options"] if opt.get("is_correct")), None)

            is_correct = bool(selected_option and selected_option.get("is_correct"))
            if is_correct:
                correct_count += 1
                concept_breakdown[c_id]["correct"] += 1
                feedback_list.append({
                    "question_id": q_id,
                    "is_correct": True,
                    "feedback_text": "Correct! Well done."
                })
            else:
                distractor_note = (
                    selected_option.get("distractor_feedback")
                    if selected_option and selected_option.get("distractor_feedback")
                    else q.get("explanation", "Review the concept material.")
                )
                feedback_list.append({
                    "question_id": q_id,
                    "is_correct": False,
                    "selected_option_id": selected_opt_id,
                    "correct_option_id": correct_option["id"] if correct_option else None,
                    "feedback_text": distractor_note
                })

        score_percentage = round((correct_count / total) * 100.0, 1)
        passed = score_percentage >= 70.0

        return {
            "score_percentage": score_percentage,
            "correct_count": correct_count,
            "total_questions": total,
            "passed": passed,
            "feedback": feedback_list,
            "concept_breakdown": concept_breakdown
        }
