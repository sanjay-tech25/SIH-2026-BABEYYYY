import pytest
from app.engines.assessment_engine import AssessmentEngine
from app.engines.recommendation_engine import RecommendationEngine
from app.engines.learning_engine import LearningEngine
from app.engines.qubot_decision_engine import QUBOTDecisionEngine
from app.constants.mastery import RecommendationAction


def test_assessment_engine_concept_importance_weighting():
    # Questions with mixed importance:
    # q1 is FOUNDATIONAL (weight 2.0)
    # q2 is ADVANCED (weight 1.0)
    questions = [
        {
            "id": "q1",
            "prompt": "State vector normalization condition?",
            "concept_id": "math_foundations",
            "category": "FOUNDATIONAL",
            "options": [
                {"id": "o1", "is_correct": False},
                {"id": "o2", "is_correct": True}
            ]
        },
        {
            "id": "q2",
            "prompt": "Grover search query complexity?",
            "concept_id": "grover_algorithms",
            "category": "ADVANCED",
            "options": [
                {"id": "o3", "is_correct": True},
                {"id": "o4", "is_correct": False}
            ]
        }
    ]

    # Case A: Answering the advanced question right (1.0 weight) but missing foundational (2.0 weight)
    # Total weight = 3.0. Earned = 1.0 (33.3%). Foundational breach = True.
    res_breach = AssessmentEngine.evaluate_attempt(questions, {"q1": "o1", "q2": "o3"})
    assert res_breach["passed"] is False
    assert res_breach["can_advance"] is False
    assert res_breach["compulsory_retake"] is True
    assert res_breach["foundational_breach"] is True
    assert "math_foundations" in res_breach["failed_critical_concepts"]

    # Case B: Answering foundational right (2.0) and advanced right (1.0) -> 100%
    res_pass = AssessmentEngine.evaluate_attempt(questions, {"q1": "o2", "q2": "o3"})
    assert res_pass["passed"] is True
    assert res_pass["can_advance"] is True
    assert res_pass["compulsory_retake"] is False
    assert res_pass["foundational_breach"] is False


def test_recommendation_engine_strict_compulsion_on_failure():
    # If a learner scores below threshold, advancement must be BLOCKED
    rec_failed = RecommendationEngine.determine_next_action(
        concept_name="State Vectors",
        mastery_score=0.45,
        threshold=0.80,
        prerequisite_concept_name="Linear Algebra",
        foundational_breach=True
    )
    assert rec_failed["action"] == "REVISE"
    assert rec_failed["can_advance"] is False
    assert rec_failed["requires_retake"] is True
    assert rec_failed["compulsion_level"] == "MANDATORY_DIFFERENTIATED_RETAKE"
    assert rec_failed["remediation_plan"] is not None
    assert rec_failed["remediation_plan"]["mode"] == "VISUAL_ANALOGY"
    assert "Advancement Blocked" in rec_failed["rationale"]

    # If mastery is confirmed >= threshold, advancement is unlocked
    rec_passed = RecommendationEngine.determine_next_action(
        concept_name="State Vectors",
        mastery_score=0.88,
        threshold=0.80,
        foundational_breach=False
    )
    assert rec_passed["action"] == "ADVANCE"
    assert rec_passed["can_advance"] is True
    assert rec_passed["requires_retake"] is False
    assert rec_passed["compulsion_level"] == "NONE"


def test_learning_engine_strict_prerequisite_locking():
    concepts = ["math", "vectors", "gates", "algorithms"]
    prereqs = [
        {"concept_id": "vectors", "prerequisite_id": "math"},
        {"concept_id": "gates", "prerequisite_id": "vectors"},
        {"concept_id": "algorithms", "prerequisite_id": "gates"}
    ]
    # Without mastering 'math', 'vectors', 'gates', and 'algorithms' are strictly locked
    unlocked = LearningEngine.get_unlocked_concepts(
        concepts, prereqs, mastered_concepts=set()
    )
    assert unlocked == ["math"]

    # When 'math' is mastered, ONLY 'vectors' unlocks
    unlocked_after_math = LearningEngine.get_unlocked_concepts(
        concepts, prereqs, mastered_concepts={"math"}
    )
    assert unlocked_after_math == ["vectors"]


def test_qubot_compulsory_remediation_messaging():
    envelope = QUBOTDecisionEngine.evaluate_envelope(
        user_id="test_learner_1",
        event_type="QUIZ_FAILED",
        age_bracket="STUDENT",
        metadata={"concept_name": "Bloch Sphere", "score": 40}
    )
    msg = envelope.message.text
    # Authoritative and demanding: must require remediation before retake
    assert "Advancement paused" in msg or "locked" in msg
    assert "Bloch Sphere" in msg
