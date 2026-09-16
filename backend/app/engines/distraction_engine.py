from typing import Dict, Any


class DistractionEngine:
    """Distraction Remedy Engine (Section 19).

    Detects learner distraction through window blurs, tab switching, and prolonged idle periods.
    Provides calm, non-punitive reset interventions.
    """

    @classmethod
    def evaluate(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        inactivity_seconds = telemetry.get("inactivity_seconds", 0)
        tab_switches = telemetry.get("tab_switches_count", 0)
        window_blurred = telemetry.get("window_blurred", False)

        # Inactivity signal: >120s idle
        idle_signal = min(max((inactivity_seconds - 60) / 180.0, 0.0), 1.0) if inactivity_seconds > 60 else 0.0
        switch_signal = min(tab_switches / 4.0, 1.0)
        blur_signal = 1.0 if window_blurred else 0.0

        distraction_score = round(
            (idle_signal * 0.40) + (switch_signal * 0.35) + (blur_signal * 0.25),
            3
        )
        is_distracted = (distraction_score >= 0.50) or (window_blurred and inactivity_seconds > 90)

        if distraction_score >= 0.75:
            suggested_action = "START_RESET"
        elif is_distracted:
            suggested_action = "RESUME_LEARNING"
        else:
            suggested_action = "NONE"

        return {
            "distraction_score": distraction_score,
            "is_distracted": is_distracted,
            "suggested_action": suggested_action,
            "signals": {
                "idle_signal": round(idle_signal, 2),
                "switch_signal": round(switch_signal, 2),
                "blur_signal": blur_signal,
            }
        }
