from typing import List, Dict, Any


class DiagnosticEngine:
    """Evaluates initial diagnostic quiz answers to determine starting level and skill baselines."""

    @staticmethod
    def evaluate_diagnostic(responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        responses: List of dicts with keys:
          - concept_key: str (e.g., 'linear_algebra', 'superposition', 'logic_gates')
          - is_correct: bool
          - difficulty: float (1.0 to 3.0)
        """
        if not responses:
            return {
                "initial_level": 1,
                "domain_scores": {},
                "placement_summary": "Beginner Track: Quantum Fundamentals"
            }

        domain_correct: Dict[str, float] = {}
        domain_total: Dict[str, float] = {}

        for resp in responses:
            domain = resp.get("concept_key", "general")
            weight = resp.get("difficulty", 1.0)
            domain_total[domain] = domain_total.get(domain, 0.0) + weight
            if resp.get("is_correct"):
                domain_correct[domain] = domain_correct.get(domain, 0.0) + weight

        domain_percentages = {
            domain: round((domain_correct.get(domain, 0.0) / total) * 100, 1)
            for domain, total in domain_total.items()
        }

        total_weight = sum(domain_total.values())
        total_correct_weight = sum(domain_correct.values())
        overall_percentage = (total_correct_weight / total_weight) * 100 if total_weight > 0 else 0.0

        if overall_percentage >= 75.0:
            initial_level = 3
            summary = "Advanced Track: Quantum Circuit Builder"
        elif overall_percentage >= 40.0:
            initial_level = 2
            summary = "Intermediate Track: Quantum Principles & Gates"
        else:
            initial_level = 1
            summary = "Beginner Track: Math & Quantum Foundations"

        return {
            "initial_level": initial_level,
            "overall_score_percentage": round(overall_percentage, 1),
            "domain_scores": domain_percentages,
            "placement_summary": summary
        }
