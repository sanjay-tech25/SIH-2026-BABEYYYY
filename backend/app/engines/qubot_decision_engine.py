from typing import Dict, Any, Optional
from app.constants.mascot_states import MascotState
from app.constants.roles import AgeBracket
from app.constants.qubot_contracts import (
    QUBOTState,
    QUBOTEmotion,
    QUBOTAnimation,
    QUBOTIntent,
    QUBOTActionType,
    QUBOTPriority,
    StruggleType,
    StruggleSeverity,
    InterventionType,
)
from app.schemas.qubot import QUBOTResponse, QUBOTAction
from app.schemas.qubot_v2 import (
    QubotResponseEnvelope,
    QubotCharacterSnapshot,
    QubotMessagePayload,
    QubotInterventionPayload,
    QubotSessionPayload,
    QubotMetaPayload,
)
from app.services.qubot_cooldown_manager import QUBOTCooldownManager
from app.engines.struggle_engine import StruggleDetectionEngine
from app.engines.fatigue_engine import FatigueDetectionEngine
from app.engines.distraction_engine import DistractionEngine
from app.engines.intervention_engine import InterventionEngine


class QUBOTDecisionEngine:
    """Canonical Behavioral Decision Engine (Sections 10, 11, 12, 13, 14, 15, 17).

    Evaluates normalized events, calculates multi-signal struggle/fatigue/distraction,
    selects appropriate pedagogical interventions, and outputs structured Qubot responses.
    """

    @classmethod
    def evaluate_envelope(
        cls,
        user_id: str,
        event_type: str,
        age_bracket: str = AgeBracket.STUDENT.value,
        metadata: Optional[Dict[str, Any]] = None
    ) -> QubotResponseEnvelope:
        metadata = metadata or {}
        is_young = (age_bracket == AgeBracket.YOUNG.value)
        is_adult = (age_bracket == AgeBracket.ADULT_PROFESSIONAL.value)
        concept = metadata.get("concept_name", "Quantum Computing")
        lesson_id = metadata.get("lesson_id")
        score = metadata.get("score", 0)

        # 1. Run Detection Engines
        struggle = StruggleDetectionEngine.evaluate(metadata)
        fatigue = FatigueDetectionEngine.evaluate(metadata)
        distraction = DistractionEngine.evaluate(metadata)

        # 2. Select Pedagogical Intervention
        intervention_info = InterventionEngine.select_intervention(
            struggle_result=struggle,
            fatigue_result=fatigue,
            distraction_result=distraction,
            metadata=metadata
        )

        # 3. Default Neutral Baseline
        state = QUBOTState.IDLE
        emotion = QUBOTEmotion.NEUTRAL
        animation = QUBOTAnimation.IDLE_BREATHE.value
        intent = QUBOTIntent.WELCOME
        text = "Ready when you are." if is_adult else "Ready to explore the quantum universe!"
        priority = QUBOTPriority.LOW
        cooldown_seconds = 30

        # 4. Event & Intervention Mapping
        if fatigue["is_fatigued"] or event_type == "BREAK_REQUIRED":
            state = QUBOTState.BREAK_REQUIRED
            emotion = QUBOTEmotion.CONCERNED
            animation = QUBOTAnimation.BREAK_SUGGEST.value
            intent = QUBOTIntent.BREAK_REQUIRED
            priority = QUBOTPriority.CRITICAL
            cooldown_seconds = 60
            if is_young:
                text = "Hold on, Quantum Pilot!  2 non-stop sessions! Brain recharge required now!"
            elif is_adult:
                text = "Two consecutive focus sessions logged. Mandatory 5-minute break in effect."
            else:
                text = "Two focus blocks completed without rest. Mandatory break active to maintain cognitive peak."

        elif intervention_info["type"] == InterventionType.BREAK_SUGGESTION or event_type in ["BREAK_RECOMMENDED", "BREAK_SUGGESTED"]:
            state = QUBOTState.BREAK_SUGGESTED
            emotion = QUBOTEmotion.CALM
            animation = QUBOTAnimation.SLEEPY.value
            intent = QUBOTIntent.BREAK_SUGGESTION
            priority = QUBOTPriority.HIGH
            cooldown_seconds = 60
            if is_young:
                text = "Mission complete!  A 5-minute snack & stretch break is recommended!"
            elif is_adult:
                text = "Focus session logged. 5-minute cognitive rest suggested."
            else:
                text = "Solid 25-minute focus session. A 5-minute break helps consolidate memory."

        elif intervention_info["type"] == InterventionType.ALTERNATIVE_EXPLANATION:
            state = QUBOTState.EXPLAINING
            emotion = QUBOTEmotion.SUPPORTIVE
            animation = QUBOTAnimation.EXPLAIN.value
            intent = QUBOTIntent.ALTERNATIVE_EXPLANATION
            priority = QUBOTPriority.HIGH
            cooldown_seconds = 45
            if is_young:
                text = f"No worries! {concept} can be tricky. Let's look at this with a spinning coin analogy!"
            elif is_adult:
                text = f"Alternative derivation available for {concept}. Reviewing prerequisite matrix representation."
            else:
                text = f"Let's try examining {concept} from a different visual perspective."

        elif intervention_info["type"] == InterventionType.SLOW_DOWN_PROMPT:
            state = QUBOTState.THINKING
            emotion = QUBOTEmotion.THOUGHTFUL
            animation = QUBOTAnimation.THINK.value
            intent = QUBOTIntent.GUESSING_WARNING
            priority = QUBOTPriority.MEDIUM
            cooldown_seconds = 30
            if is_young:
                text = "Take a breath, space cadet!  Read the question carefully before picking!"
            elif is_adult:
                text = "Rapid submission detected. Take a moment to analyze the question requirements."
            else:
                text = "Take your time on this one. Let's think through what the question is asking."

        elif event_type in ["LOGIN", "SESSION_STARTED"]:
            state = QUBOTState.GREETING
            emotion = QUBOTEmotion.HAPPY
            animation = QUBOTAnimation.WAVE.value
            intent = QUBOTIntent.WELCOME
            priority = QUBOTPriority.LOW
            if is_young:
                text = "Welcome back, Space Explorer!  Ready for today's quantum mission?"
            elif is_adult:
                text = "Welcome back. Resuming your quantum curriculum track."
            else:
                text = "Welcome back! Let's pick up where you left off."

        elif event_type in ["QUIZ_PASSED", "ANSWER_CORRECT"]:
            state = QUBOTState.CELEBRATING
            emotion = QUBOTEmotion.PROUD
            animation = QUBOTAnimation.CELEBRATE.value
            intent = QUBOTIntent.CORRECT_ANSWER
            priority = QUBOTPriority.NORMAL
            if is_young:
                text = f"WOOHOO!  You mastered {concept}! Next quantum secret unlocked!"
            elif is_adult:
                text = f"Concept '{concept}' validated ({score}%). Prerequisite satisfied."
            else:
                text = f"Great work! You demonstrated solid mastery of {concept}."

        elif event_type in ["QUIZ_FAILED", "ANSWER_WRONG"]:
            state = QUBOTState.ENCOURAGING
            emotion = QUBOTEmotion.SUPPORTIVE
            animation = QUBOTAnimation.GENTLE_ENCOURAGE.value
            intent = QUBOTIntent.INCORRECT_ANSWER
            priority = QUBOTPriority.NORMAL
            if is_young:
                text = f"Hold your thrusters, Space Cadet!  Quantum physics needs strong foundations! Advancement paused until we power up with this visual mission!"
            elif is_adult:
                text = f"Mastery threshold not met for '{concept}'. Progression is locked until compulsory differentiated remediation is validated."
            else:
                text = f"Advancement paused on '{concept}'. Quantum mechanics doesn't forgive skipped foundations! I've loaded a differentiated visual breakdown for you before your retake."



        elif event_type in ["WINDOW_BLUR", "TAB_SWITCH", "USER_INACTIVE", "LONG_INACTIVITY"]:
            if not QUBOTCooldownManager.can_trigger(user_id, "DISTRACTION_REMINDER"):
                text = ""
                priority = QUBOTPriority.LOW
            else:
                state = QUBOTState.WAITING
                emotion = QUBOTEmotion.CURIOUS
                animation = QUBOTAnimation.LOOK_RIGHT.value
                intent = QUBOTIntent.SESSION_RESUME
                priority = QUBOTPriority.NORMAL
                if is_young:
                    text = "Stepped away? QUBOT is keeping your place ready whenever you're back! "
                elif is_adult:
                    text = "Session paused. Ready to resume when you are."
                else:
                    text = "Looks like you stepped away for a moment. Jump back in whenever you're ready."

        elif event_type == "CIRCUIT_EXECUTED":
            state = QUBOTState.CELEBRATING
            emotion = QUBOTEmotion.EXCITED
            animation = QUBOTAnimation.SMALL_HAPPY.value
            intent = QUBOTIntent.ENCOURAGE
            priority = QUBOTPriority.LOW
            if is_young:
                text = "Circuit executed!  Statevector calculated in the quantum realm!"
            elif is_adult:
                text = "Qiskit simulation complete. Statevector & Bloch coordinates updated."
            else:
                text = "Quantum circuit simulation finished. Review your statevector probabilities."

        elif event_type == "LEVEL_UP":
            lvl = metadata.get("new_level", 2)
            state = QUBOTState.CELEBRATING
            emotion = QUBOTEmotion.PROUD
            animation = QUBOTAnimation.CELEBRATE.value
            intent = QUBOTIntent.MILESTONE
            priority = QUBOTPriority.HIGH
            text = f" LEVEL UP! You reached Level {lvl}!" if is_young else f"Level {lvl} achieved. New track unlocked."

        # Build Response Envelope
        envelope = QubotResponseEnvelope(
            qubot=QubotCharacterSnapshot(
                state=state,
                emotion=emotion,
                animation=animation,
            ),
            message=QubotMessagePayload(
                visible=bool(text),
                intent=intent,
                text=text,
            ),
            intervention=QubotInterventionPayload(
                type=intervention_info.get("type", InterventionType.NONE),
                required=intervention_info.get("required", False),
                action=intervention_info.get("action", QUBOTActionType.NONE),
                label=intervention_info.get("label"),
                target_id=lesson_id,
            ),
            session=QubotSessionPayload(
                session_id=metadata.get("session_id"),
                pomodoro_state=metadata.get("pomodoro_state", "IDLE"),
                iteration=metadata.get("pomodoro_iteration", 1),
                break_status=metadata.get("break_status", "NONE"),
            ),
            meta=QubotMetaPayload(
                priority=priority,
                cooldown_seconds=cooldown_seconds,
            )
        )
        return envelope

    @classmethod
    def evaluate(
        cls,
        user_id: str,
        event_type: str,
        age_bracket: str = AgeBracket.STUDENT.value,
        metadata: Optional[Dict[str, Any]] = None
    ) -> QUBOTResponse:
        """Legacy evaluate method returning QUBOTResponse for backward compatibility."""
        env = cls.evaluate_envelope(user_id, event_type, age_bracket, metadata)
        
        # Map QUBOTState to MascotState
        state_mapping = {
            QUBOTState.IDLE: MascotState.IDLE,
            QUBOTState.GREETING: MascotState.IDLE,
            QUBOTState.CELEBRATING: MascotState.CELEBRATING,
            QUBOTState.ENCOURAGING: MascotState.ENCOURAGING,
            QUBOTState.THINKING: MascotState.THINKING,
            QUBOTState.CONFUSED: MascotState.CONFUSED,
            QUBOTState.BREAK_SUGGESTED: MascotState.BREAK_SUGGESTED,
            QUBOTState.BREAK_REQUIRED: MascotState.BREAK_REQUIRED,
            QUBOTState.BREAK_ACTIVE: MascotState.BREAK_ACTIVE,
        }
        mascot_state = state_mapping.get(env.qubot.state, MascotState.IDLE)

        return QUBOTResponse(
            mascot="QUBOT",
            state=mascot_state,
            intent=env.message.intent,
            message=env.message.text,
            priority=env.meta.priority,
            animation=env.qubot.animation,
            action=QUBOTAction(
                type=env.intervention.action,
                target_id=env.intervention.target_id,
                label=env.intervention.label,
            ),
            metadata=metadata or {},
        )
