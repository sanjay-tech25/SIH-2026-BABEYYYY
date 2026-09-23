"""API Router for Quantum Innovations: Predict-Simulate-Explain, Digital Twin, Misconceptions, Transpilation, Skill Passport, Error Hierarchy, and Explanations."""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.engines.misconception_engine import QuantumMisconceptionEngine, MisconceptionDiagnostic
from app.engines.prediction_engine import PredictionEngine, PredictionEvaluationResult
from app.engines.digital_twin_engine import QuantumDigitalTwinEngine, DigitalTwinEvaluation
from app.quantum.translation_engine import QuantumTranslationEngine, TranslationResult
from app.services.skill_passport_service import SkillPassportService, SkillToken
from app.engines.error_hierarchy_engine import QuantumErrorHierarchyEngine, QuantumDiagnosticError
from app.ai.provider import AIProvider

router = APIRouter(prefix="", tags=["Quantum Innovations"])

misconception_engine = QuantumMisconceptionEngine()
prediction_engine = PredictionEngine()
digital_twin_engine = QuantumDigitalTwinEngine()
translation_engine = QuantumTranslationEngine()


class PredictRequest(BaseModel):
    predicted_distribution: Dict[str, float]
    actual_distribution: Dict[str, float]


class TranspileRequest(BaseModel):
    num_qubits: int = Field(default=2, ge=1, le=10)
    gates: List[Dict[str, Any]]


class DigitalTwinRequest(BaseModel):
    mental_distribution: Dict[str, float]
    actual_distribution: Dict[str, float]


class MisconceptionRequest(BaseModel):
    circuit_gates: List[Dict[str, Any]]
    predicted_distribution: Optional[Dict[str, float]] = None
    actual_distribution: Optional[Dict[str, float]] = None
    interaction_context: Optional[Dict[str, Any]] = None


class PassportRequest(BaseModel):
    user_id: int
    concept_id: str
    concept_name: str
    mastery_score: float = Field(..., ge=0.0, le=1.0)
    transfer_tested: bool = True


class ErrorAnalysisRequest(BaseModel):
    circuit_data: Dict[str, Any]
    intended_goal: Optional[str] = None
    prediction_divergence: Optional[float] = None


class ExplainCircuitRequest(BaseModel):
    circuit_data: Dict[str, Any]
    age_bracket: str = "STUDENT"


class ExplainResultRequest(BaseModel):
    circuit_data: Dict[str, Any]
    counts: Dict[str, int]
    shots: int = 1024


class WhyFailedRequest(BaseModel):
    question_text: Optional[str] = ""
    selected_option: Optional[str] = ""
    correct_option: Optional[str] = ""
    explanation_summary: Optional[str] = ""
    concept_id: Optional[str] = None
    topic_id: Optional[str] = None
    question_id: Optional[str] = None
    student_answer: Optional[str] = None
    correct_answer: Optional[str] = None


@router.post("/circuits/predict", response_model=PredictionEvaluationResult)
def evaluate_circuit_prediction(req: PredictRequest):
    """Evaluates prediction divergence and awards XP bonus."""
    return prediction_engine.evaluate_prediction(
        req.predicted_distribution,
        req.actual_distribution
    )


@router.post("/circuits/translate", response_model=TranslationResult)
def translate_circuit(req: TranspileRequest):
    """Transpiles visual circuit AST into OpenQASM, Qiskit Python, PennyLane, and Google Cirq."""
    return translation_engine.transpile(req.num_qubits, req.gates)


@router.post("/digital-twin/evaluate", response_model=DigitalTwinEvaluation)
def evaluate_digital_twin(req: DigitalTwinRequest):
    """Estimates Cognitive Calibration Index (CCI) between learner mental model and quantum state."""
    return digital_twin_engine.evaluate_twin(
        req.mental_distribution,
        req.actual_distribution
    )


@router.post("/misconceptions/evaluate", response_model=List[MisconceptionDiagnostic])
def evaluate_misconceptions(req: MisconceptionRequest):
    """Diagnoses cognitive anti-patterns (MC-01 through MC-10)."""
    return misconception_engine.evaluate(
        circuit_gates=req.circuit_gates,
        predicted_distribution=req.predicted_distribution,
        actual_distribution=req.actual_distribution,
        interaction_context=req.interaction_context
    )


@router.post("/passport/generate", response_model=SkillToken)
def generate_skill_token(req: PassportRequest):
    """Generates a cryptographically signed Skill Passport evidence token."""
    return SkillPassportService.generate_token(
        user_id=req.user_id,
        concept_id=req.concept_id,
        concept_name=req.concept_name,
        mastery_score=req.mastery_score,
        transfer_tested=req.transfer_tested
    )


@router.post("/errors/analyze", response_model=List[QuantumDiagnosticError])
def analyze_quantum_errors(req: ErrorAnalysisRequest):
    """Evaluates circuit across 4-level error hierarchy (L1 Code, L2 Circuit, L3 Conceptual, L4 Algorithmic)."""
    return QuantumErrorHierarchyEngine.analyze(
        circuit_data=req.circuit_data,
        intended_goal=req.intended_goal,
        prediction_divergence=req.prediction_divergence
    )


@router.post("/circuits/explain-circuit")
def explain_my_circuit(req: ExplainCircuitRequest):
    """Functionality 34: Explains the physical and mathematical transformations occurring in the circuit."""
    gates = req.circuit_data.get("gates", [])
    num_q = req.circuit_data.get("num_qubits", 1)
    gate_names = [g.get("gate", g.get("type", "")) for g in gates]

    explanation = (
        f"This {num_q}-qubit quantum circuit applies {len(gates)} operations: {', '.join(gate_names)}. "
        "It initializes the qubits in the ground state |0⟩, applies unitary rotations to create superposition, "
        "and couples wires to generate entanglement before projecting onto the measurement basis."
    )
    return {
        "summary": explanation,
        "step_by_step": [
            f"Step {i+1}: Applying {g.get('gate', g.get('type', ''))} gate." for i, g in enumerate(gates)
        ]
    }


@router.post("/circuits/explain-result")
def explain_my_result(req: ExplainResultRequest):
    """Functionality 35: Socratic explanation of why the circuit produced its specific measurement distribution."""
    counts = req.counts
    total = sum(counts.values()) or req.shots
    dominant_states = [k for k, v in counts.items() if (v / total) >= 0.35]

    explanation = (
        f"Across {total} shots, the circuit collapsed into the dominant basis states: {', '.join(dominant_states)}. "
        "The relative frequencies reflect the squared probability amplitudes |α|² and |β|² computed via the Born Rule. "
        "Any non-zero leakage into unexpected states indicates quantum noise or incomplete destructive phase interference."
    )
    return {
        "analysis": explanation,
        "dominant_states": dominant_states,
        "entropy": "high" if len(counts) > 2 else "low"
    }


@router.post("/assessments/why-failed")
def why_did_my_answer_fail(req: WhyFailedRequest):
    """Functionality 36: Socratic diagnosis of conceptual gap grounded in Obsidian Vault."""
    topic_id = req.topic_id or req.concept_id or "t1-1"
    selected = req.selected_option or req.student_answer or "Selected Choice"
    correct = req.correct_option or req.correct_answer or "Correct Choice"
    q_text = req.question_text or req.question_id or "Quantum Question"
    diag = AIProvider.generate_diagnostic_guidance(
        topic_id=topic_id,
        question_text=q_text,
        selected_option=selected,
        correct_option=correct,
        explanation_summary=req.explanation_summary or ""
    )
    return {
        "diagnosis": diag["diagnosis"],
        "socratic_inquiry": diag["socratic_inquiry"],
        "explanation": f"{diag['diagnosis']} {diag['socratic_inquiry']}",
        "remediation_topic": diag["remediation_topic"],
        "vault_citation": diag["vault_citation"],
        "is_grounded": True
    }
