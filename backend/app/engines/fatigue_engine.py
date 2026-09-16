from typing import Dict, Any


class FatigueDetectionEngine:
    """Fatigue Detection Engine (Section 20).

    Distinguishes cognitive fatigue from conceptual struggle by analyzing session duration,
    declining accuracy slope, response latency elongation, and continuous focus duration.
    """

    @classmethod
    def evaluate(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        session_duration = telemetry.get("session_duration_seconds", 0)
        recent_accuracy = telemetry.get("recent_accuracy", 1.0)
        baseline_accuracy = telemetry.get("baseline_accuracy", 0.8)
        avg_response_time = telemetry.get("avg_response_time_seconds", 30)
        expected_time = max(telemetry.get("expected_time_seconds", 30), 1)

        # 1. Duration Signal (Ramps up after 45 mins / 2700s)
        duration_signal = min(max((session_duration - 1800) / 3600.0, 0.0), 1.0)

        # 2. Performance Degradation Signal
        acc_drop = max(baseline_accuracy - recent_accuracy, 0.0)
        degradation_signal = min(acc_drop / 0.4, 1.0)

        # 3. Latency Elongation Signal
        latency_ratio = avg_response_time / expected_time
        latency_signal = min(max((latency_ratio - 1.2) / 1.5, 0.0), 1.0) if latency_ratio > 1.2 else 0.0

        # Weighted Fatigue Score
        fatigue_score = round(
            (duration_signal * 0.45) + (degradation_signal * 0.35) + (latency_signal * 0.20),
            3
        )
        is_fatigued = (fatigue_score >= 0.55) or (session_duration > 3600 and acc_drop > 0.2)
        confidence = round(min(0.65 + (duration_signal * 0.30), 0.95), 2)

        return {
            "fatigue_score": fatigue_score,
            "confidence": confidence,
            "is_fatigued": is_fatigued,
            "signals": {
                "duration_signal": round(duration_signal, 2),
                "degradation_signal": round(degradation_signal, 2),
                "latency_signal": round(latency_signal, 2),
            }
        }
