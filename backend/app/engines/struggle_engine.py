from typing import Dict, Any, Optional
from app.constants.qubot_contracts import StruggleType, StruggleSeverity
from app.core.config import settings


class StruggleDetectionEngine:
    """Multi-Signal Struggle & Confusion Detection Engine (Sections 6, 7, 8, 9).

    Consumes normalized learner state telemetry and computes a weighted struggle score [0.0, 1.0],
    determines severity, and classifies the dominant struggle root cause with confidence.
    """

    @classmethod
    def evaluate(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        weights = settings.QUBOT_STRUGGLE_WEIGHTS
        thresholds = settings.QUBOT_STRUGGLE_THRESHOLDS

        # 1. Extract Signals
        recent_attempts = max(telemetry.get("recent_attempts", 1), 1)
        recent_errors = telemetry.get("recent_errors", 0)
        error_rate = min(max(recent_errors / recent_attempts, 0.0), 1.0)

        time_spent = telemetry.get("time_on_current_task_seconds", 0)
        expected_time = max(telemetry.get("expected_time_seconds", 60), 1)
        time_ratio = time_spent / expected_time
        # Time signal ramps up if taking significantly longer than expected
        time_signal = min(max((time_ratio - 1.0) / 2.0, 0.0), 1.0) if time_ratio > 1.0 else 0.0

        question_attempts = telemetry.get("attempts_on_current_question", 1)
        repetition_signal = min(max((question_attempts - 1) / 3.0, 0.0), 1.0)

        hints_used = telemetry.get("hints_used", 0)
        hint_signal = min(hints_used / 3.0, 1.0)

        consecutive_concept_failures = telemetry.get("consecutive_concept_failures", 0)
        concept_failure_signal = min(consecutive_concept_failures / 2.0, 1.0)

        backtracking_count = telemetry.get("backtracking_count", 0)
        backtracking_signal = min(backtracking_count / 2.0, 1.0)

        baseline_accuracy = telemetry.get("baseline_accuracy", 0.7)
        recent_accuracy = telemetry.get("recent_accuracy", baseline_accuracy)
        acc_drop = max(baseline_accuracy - recent_accuracy, 0.0)
        accuracy_drop_signal = min(acc_drop / 0.5, 1.0)

        # Rapid Guessing Detector: fast response (<4s) + wrong answer
        is_rapid_guessing = telemetry.get("is_rapid_response", False) and telemetry.get("is_wrong_answer", False)
        if time_spent < 4 and recent_errors > 0 and question_attempts > 1:
            is_rapid_guessing = True

        # Inactivity signal
        inactivity_seconds = telemetry.get("inactivity_seconds", 0)
        is_prolonged_inactivity = inactivity_seconds > 180

        # Mastery/Difficulty Mismatch
        current_difficulty = telemetry.get("difficulty", 1)
        mastery = telemetry.get("mastery", 0.5)
        difficulty_mismatch = (current_difficulty > 2 and mastery < 0.3)

        # 2. Weighted Struggle Score
        raw_score = (
            weights.get("error_weight", 0.25) * error_rate
            + weights.get("time_weight", 0.15) * time_signal
            + weights.get("repetition_weight", 0.15) * repetition_signal
            + weights.get("hint_weight", 0.10) * hint_signal
            + weights.get("concept_failure_weight", 0.20) * concept_failure_signal
            + weights.get("backtracking_weight", 0.05) * backtracking_signal
            + weights.get("accuracy_drop_weight", 0.10) * accuracy_drop_signal
        )
        struggle_score = round(min(max(raw_score, 0.0), 1.0), 3)

        # 3. Classify Struggle Severity
        if struggle_score >= thresholds.get("critical", 0.85):
            severity = StruggleSeverity.CRITICAL
        elif struggle_score >= thresholds.get("high", 0.70):
            severity = StruggleSeverity.HIGH
        elif struggle_score >= thresholds.get("moderate", 0.50):
            severity = StruggleSeverity.MODERATE
        elif struggle_score >= thresholds.get("mild", 0.30):
            severity = StruggleSeverity.MILD
        else:
            severity = StruggleSeverity.NORMAL

        # 4. Classify Dominant Struggle Type & Confidence
        if struggle_score < thresholds.get("mild", 0.30) and not is_rapid_guessing:
            struggle_type = StruggleType.NONE
            confidence = 0.95
        elif is_rapid_guessing:
            struggle_type = StruggleType.GUESSING
            confidence = 0.90
        elif difficulty_mismatch:
            struggle_type = StruggleType.DIFFICULTY_MISMATCH
            confidence = 0.85
        elif concept_failure_signal >= 0.5 or (hint_signal >= 0.6 and error_rate >= 0.5):
            struggle_type = StruggleType.CONCEPTUAL
            confidence = round(min(0.70 + (concept_failure_signal * 0.25), 0.99), 2)
        elif repetition_signal >= 0.6 and error_rate >= 0.5:
            struggle_type = StruggleType.REPEATED_ERROR
            confidence = 0.85
        elif time_signal >= 0.7:
            struggle_type = StruggleType.TIME_PRESSURE
            confidence = 0.80
        elif is_prolonged_inactivity:
            struggle_type = StruggleType.DISTRACTION
            confidence = 0.75
        else:
            struggle_type = StruggleType.PROCEDURAL
            confidence = 0.70

        return {
            "score": struggle_score,
            "severity": severity,
            "type": struggle_type,
            "confidence": confidence,
            "signals": {
                "error_rate": round(error_rate, 2),
                "time_signal": round(time_signal, 2),
                "repetition_signal": round(repetition_signal, 2),
                "hint_signal": round(hint_signal, 2),
                "concept_failure_signal": round(concept_failure_signal, 2),
                "accuracy_drop_signal": round(accuracy_drop_signal, 2),
                "rapid_guessing": is_rapid_guessing,
            }
        }
