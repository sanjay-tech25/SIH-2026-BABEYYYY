import pytest
from datetime import date
from app.engines.diagnostic_engine import DiagnosticEngine
from app.engines.mastery_engine import MasteryEngine
from app.engines.assessment_engine import AssessmentEngine
from app.engines.learning_engine import LearningEngine
from app.engines.recommendation_engine import RecommendationEngine
from app.engines.progression_engine import ProgressionEngine
from app.engines.gamification_engine import GamificationEngine
from app.engines.focus_policy_engine import FocusPolicyEngine
from app.core.exceptions import BreakPolicyViolationException


def test_diagnostic_engine():
    responses = [
        {"concept_key": "linear_algebra", "is_correct": True, "difficulty": 1.0},
        {"concept_key": "superposition", "is_correct": True, "difficulty": 1.5},
        {"concept_key": "quantum_gates", "is_correct": False, "difficulty": 2.0},
    ]
    res = DiagnosticEngine.evaluate_diagnostic(responses)
    assert "initial_level" in res
    assert res["initial_level"] in (1, 2, 3)
    assert res["overall_score_percentage"] > 0


def test_mastery_engine_bkt_progression():
    # Answering correctly should increase mastery
    p_initial = 0.30
    p_updated, conf, level = MasteryEngine.update_mastery(prior_mastery=p_initial, is_correct=True)
    assert p_updated > p_initial

    # Answering incorrectly should decrease or temper mastery
    p_updated_wrong, _, _ = MasteryEngine.update_mastery(prior_mastery=0.80, is_correct=False)
    assert p_updated_wrong < 0.80


def test_concept_specific_thresholds():
    assert MasteryEngine.is_concept_mastered(0.86, "FOUNDATIONAL") is True
    assert MasteryEngine.is_concept_mastered(0.82, "FOUNDATIONAL") is False
    assert MasteryEngine.is_concept_mastered(0.82, "CORE") is True
    assert MasteryEngine.is_concept_mastered(0.72, "ADVANCED") is True


def test_assessment_engine():
    questions = [
        {
            "id": "q1",
            "prompt": "What is a qubit?",
            "concept_id": "c1",
            "options": [
                {"id": "opt1", "is_correct": True},
                {"id": "opt2", "is_correct": False, "distractor_feedback": "Wrong"}
            ]
        }
    ]
    res_correct = AssessmentEngine.evaluate_attempt(questions, {"q1": "opt1"})
    assert res_correct["passed"] is True
    assert res_correct["correct_count"] == 1

    res_wrong = AssessmentEngine.evaluate_attempt(questions, {"q1": "opt2"})
    assert res_wrong["passed"] is False
    assert res_wrong["correct_count"] == 0


def test_learning_engine_dag():
    concept_ids = ["c1", "c2", "c3"]
    prereqs = [
        {"concept_id": "c2", "prerequisite_id": "c1"},
        {"concept_id": "c3", "prerequisite_id": "c2"}
    ]
    sorted_order = LearningEngine.topological_sort_concepts(concept_ids, prereqs)
    assert sorted_order == ["c1", "c2", "c3"]

    unlocked = LearningEngine.get_unlocked_concepts(concept_ids, prereqs, {"c1"})
    assert "c2" in unlocked
    assert "c3" not in unlocked


def test_recommendation_engine():
    rec_adv = RecommendationEngine.determine_next_action("Superposition", 0.90, threshold=0.80)
    assert rec_adv["action"] == "ADVANCE"

    rec_reinf = RecommendationEngine.determine_next_action("Superposition", 0.65, threshold=0.80)
    assert rec_reinf["action"] == "REINFORCE"

    rec_rev = RecommendationEngine.determine_next_action("Superposition", 0.30, threshold=0.80)
    assert rec_rev["action"] == "REVISE"


def test_progression_engine():
    level1, in_lvl, needed = ProgressionEngine.calculate_level(0)
    assert level1 == 1

    level2, _, _ = ProgressionEngine.calculate_level(300)
    assert level2 >= 2

    level_up_check = ProgressionEngine.check_level_up(50, 400)
    assert level_up_check["leveled_up"] is True


def test_gamification_streak_and_freeze():
    today = date(2026, 9, 10)
    yesterday = date(2026, 9, 9)
    two_days_ago = date(2026, 9, 8)

    # Normal consecutive day
    curr, longest, freeze, saved, _ = GamificationEngine.update_streak(3, 3, yesterday, today, 2)
    assert curr == 4

    # Missed day saved by freeze token
    curr, longest, freeze, saved, _ = GamificationEngine.update_streak(3, 3, two_days_ago, today, 2)
    assert curr == 3
    assert freeze == 1
    assert saved is True


def test_focus_policy_engine_break_enforcement():
    # Session 1 completion
    status1, is_mand1, _ = FocusPolicyEngine.handle_session_completion(cycle_number=1, prev_break_skipped=False)
    assert status1 == "BREAK_RECOMMENDED"
    assert is_mand1 is False

    # Session 2 completion after skipping break 1
    status2, is_mand2, _ = FocusPolicyEngine.handle_session_completion(cycle_number=2, prev_break_skipped=True)
    assert status2 == "BREAK_REQUIRED"
    assert is_mand2 is True

    # Validate permission should raise if BREAK_REQUIRED
    with pytest.raises(BreakPolicyViolationException):
        FocusPolicyEngine.validate_new_session_permission("BREAK_REQUIRED", 3, True)
