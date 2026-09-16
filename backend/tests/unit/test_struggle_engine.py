import pytest
from app.constants.qubot_contracts import StruggleType, StruggleSeverity, InterventionType
from app.engines.struggle_engine import StruggleDetectionEngine
from app.engines.fatigue_engine import FatigueDetectionEngine
from app.engines.distraction_engine import DistractionEngine
from app.engines.intervention_engine import InterventionEngine
from app.engines.qubot_decision_engine import QUBOTDecisionEngine


def test_struggle_engine_normal_learner():
    telemetry = {
        "recent_attempts": 5,
        "recent_errors": 0,
        "time_on_current_task_seconds": 30,
        "expected_time_seconds": 60,
        "attempts_on_current_question": 1,
        "hints_used": 0,
        "consecutive_concept_failures": 0,
        "baseline_accuracy": 0.9,
        "recent_accuracy": 0.9,
    }
    result = StruggleDetectionEngine.evaluate(telemetry)
    assert result["score"] < 0.30
    assert result["severity"] == StruggleSeverity.NORMAL
    assert result["type"] == StruggleType.NONE
    assert result["confidence"] >= 0.90


def test_struggle_engine_conceptual_struggle():
    telemetry = {
        "recent_attempts": 4,
        "recent_errors": 3,
        "time_on_current_task_seconds": 90,
        "expected_time_seconds": 60,
        "attempts_on_current_question": 2,
        "hints_used": 2,
        "consecutive_concept_failures": 2,
        "baseline_accuracy": 0.8,
        "recent_accuracy": 0.25,
    }
    result = StruggleDetectionEngine.evaluate(telemetry)
    assert result["score"] >= 0.40
    assert result["type"] == StruggleType.CONCEPTUAL
    assert result["signals"]["concept_failure_signal"] >= 0.5


def test_struggle_engine_rapid_guessing():
    telemetry = {
        "recent_attempts": 3,
        "recent_errors": 2,
        "time_on_current_task_seconds": 2,  # <4 seconds
        "expected_time_seconds": 60,
        "attempts_on_current_question": 2,
        "hints_used": 0,
        "is_rapid_response": True,
        "is_wrong_answer": True,
    }
    result = StruggleDetectionEngine.evaluate(telemetry)
    assert result["type"] == StruggleType.GUESSING
    assert result["signals"]["rapid_guessing"] is True


def test_fatigue_engine_detection():
    # Long session (>1hr) + performance drop
    telemetry = {
        "session_duration_seconds": 4000,
        "baseline_accuracy": 0.85,
        "recent_accuracy": 0.45,
        "avg_response_time_seconds": 75,
        "expected_time_seconds": 30,
    }
    result = FatigueDetectionEngine.evaluate(telemetry)
    assert result["is_fatigued"] is True
    assert result["fatigue_score"] >= 0.50


def test_distraction_engine():
    telemetry = {
        "inactivity_seconds": 150,
        "tab_switches_count": 3,
        "window_blurred": True,
    }
    result = DistractionEngine.evaluate(telemetry)
    assert result["is_distracted"] is True
    assert result["suggested_action"] in ["START_RESET", "RESUME_LEARNING"]


def test_intervention_selection():
    struggle_res = {
        "type": StruggleType.CONCEPTUAL,
        "severity": StruggleSeverity.HIGH
    }
    fatigue_res = {"is_fatigued": False}
    distraction_res = {"is_distracted": False}
    
    intervention = InterventionEngine.select_intervention(
        struggle_res, fatigue_res, distraction_res, {}
    )
    assert intervention["type"] == InterventionType.ALTERNATIVE_EXPLANATION

    # Fatigue takes precedence
    fatigue_res["is_fatigued"] = True
    fatigue_intervention = InterventionEngine.select_intervention(
        struggle_res, fatigue_res, distraction_res, {}
    )
    assert fatigue_intervention["type"] == InterventionType.BREAK_SUGGESTION


def test_qubot_envelope_response():
    env = QUBOTDecisionEngine.evaluate_envelope(
        user_id="test_user_123",
        event_type="ANSWER_WRONG",
        age_bracket="YOUNG",
        metadata={"concept_name": "Superposition", "consecutive_concept_failures": 2, "recent_errors": 2}
    )
    assert env.qubot.state in ["ENCOURAGING", "EXPLAINING"]
    assert env.message.visible is True
    assert len(env.message.text) > 0
    assert env.session.iteration == 1
    assert env.meta.cooldown_seconds > 0
