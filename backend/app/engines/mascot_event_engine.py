from typing import Dict, Any, Tuple
from app.constants.mascot_states import MascotState
from app.constants.roles import AgeBracket


class MascotEventEngine:
    """Translates platform lifecycle triggers into mascot emotional states and age-adapted dialogues."""

    @staticmethod
    def generate_reaction(
        event_type: str,
        age_bracket: str = AgeBracket.STUDENT.value,
        metadata: Dict[str, Any] = None
    ) -> Tuple[str, str]:
        """
        Returns: (mascot_state, dialogue_text)
        """
        metadata = metadata or {}
        is_adult = (age_bracket == AgeBracket.ADULT_PROFESSIONAL.value)
        concept = metadata.get("concept_name", "Quantum Computing")

        if event_type == "LOGIN":
            state = MascotState.HAPPY.value
            dialogue = "Welcome back! Let's resume your learning plan." if is_adult else "Welcome back! Ready for today's quantum mission?"

        elif event_type == "QUIZ_PASSED":
            state = MascotState.CELEBRATING.value
            score = metadata.get("score", 100)
            dialogue = f"Assessment passed ({score}%). Next node unlocked." if is_adult else f"Brilliant job! You mastered {concept}! "

        elif event_type == "QUIZ_FAILED":
            state = MascotState.ENCOURAGING.value
            dialogue = f"Mastery threshold not met for {concept}. Reviewing fundamentals." if is_adult else f"No worries! {concept} can be tricky. Let's review the visual cards together!"

        elif event_type == "BREAK_RECOMMENDED":
            state = MascotState.BREAK_REMINDER.value
            dialogue = "Focus session 1 completed. 5-minute break recommended." if is_adult else "Time for a 5-minute brain recharge! Great focus session."

        elif event_type == "BREAK_REQUIRED":
            state = MascotState.BREAK_REMINDER.value
            dialogue = "Two consecutive focus sessions logged. Mandatory break in effect." if is_adult else "Whoa, 2 focus cycles non-stop! Break is now required to stay sharp."

        elif event_type == "IDLE_DISTRACTED":
            state = MascotState.THINKING.value
            dialogue = "Session paused. Would you like a hint on this concept?" if is_adult else f"Stuck on {concept}? I can explain it with a simpler diagram!"

        elif event_type == "CIRCUIT_EXECUTED":
            state = MascotState.HAPPY.value
            dialogue = "Circuit simulation complete. Statevector & Bloch coordinates updated." if is_adult else "Your quantum circuit ran successfully! Look at those quantum probabilities!"

        elif event_type == "LEVEL_UP":
            state = MascotState.CELEBRATING.value
            lvl = metadata.get("new_level", 2)
            dialogue = f"Level {lvl} achieved." if is_adult else f" LEVEL UP! You've reached Level {lvl}! Keep rocking!"

        else:
            state = MascotState.IDLE.value
            dialogue = "Ready when you are." if is_adult else "Let's explore the quantum realm together!"

        return state, dialogue
