from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.repositories.mastery_repository import MasteryRepository
from app.repositories.progress_repository import ProgressRepository
from app.engines.learning_engine import LearningEngine
from app.engines.recommendation_engine import RecommendationEngine
from app.schemas.common import APIResponse

router = APIRouter(prefix="/adaptive", tags=["Adaptive Learning"])


class AdaptiveAdvanceRequest(BaseModel):
    current_topic_id: Optional[str] = None
    target_topic_id: Optional[str] = None
    concept_id: Optional[str] = None


class AdaptiveScaffoldingRead(BaseModel):
    concept_name: str
    scaffolding_hints: List[str]
    can_advance: bool
    requires_retake: bool


class AdaptiveRoadmapRead(BaseModel):
    topological_sequence: List[str]
    mastered_concepts: List[str]
    strictly_unlocked: List[str]
    locked_nodes: List[str]
    recommended_next_concept: Optional[str]
    can_advance_freely: bool
    scaffolding_summary: Dict[str, List[str]]


class DifferentiatedRemediationRead(BaseModel):
    topic_id: str
    concept_name: str
    mode: str
    compulsion_reason: str
    misconception_deconstruction: Dict[str, str]
    visual_analogy: Dict[str, str]
    verification_challenge: Dict[str, Any]


CANONICAL_CONCEPTS = [
    "math_foundations",
    "state_vectors",
    "single_qubit_gates",
    "pauli_matrices",
    "bloch_sphere",
    "entanglement",
    "quantum_algorithms",
    "noise_mitigation"
]

CANONICAL_PREREQUISITES = [
    {"concept_id": "state_vectors", "prerequisite_id": "math_foundations"},
    {"concept_id": "single_qubit_gates", "prerequisite_id": "state_vectors"},
    {"concept_id": "pauli_matrices", "prerequisite_id": "single_qubit_gates"},
    {"concept_id": "bloch_sphere", "prerequisite_id": "single_qubit_gates"},
    {"concept_id": "entanglement", "prerequisite_id": "single_qubit_gates"},
    {"concept_id": "quantum_algorithms", "prerequisite_id": "entanglement"},
    {"concept_id": "noise_mitigation", "prerequisite_id": "quantum_algorithms"}
]


@router.get("/roadmap", response_model=APIResponse[AdaptiveRoadmapRead])
async def get_adaptive_roadmap(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns the authoritative adaptive roadmap showing mastered, unlocked, and strictly locked nodes."""
    mastery_repo = MasteryRepository(db)
    masteries = await mastery_repo.get_all_user_masteries(current_user.id)

    mastered_set = {
        m.concept_id for m in masteries if (m.mastery_score or 0) >= 0.70
    }

    path_data = LearningEngine.get_adaptive_learning_path(
        all_concepts=CANONICAL_CONCEPTS,
        prerequisites=CANONICAL_PREREQUISITES,
        mastered_concepts=mastered_set
    )

    scaffolding_summary = {
        cid: RecommendationEngine.get_concept_scaffolding(cid.replace("_", " ").title())
        for cid in CANONICAL_CONCEPTS
    }

    roadmap = AdaptiveRoadmapRead(
        topological_sequence=path_data["topological_sequence"],
        mastered_concepts=path_data["mastered_concepts"],
        strictly_unlocked=path_data["strictly_unlocked"],
        locked_nodes=path_data.get("locked_nodes", []),
        recommended_next_concept=path_data["recommended_next_concept"],
        can_advance_freely=path_data["can_advance_freely"],
        scaffolding_summary=scaffolding_summary
    )

    return APIResponse(data=roadmap, message="Authoritative adaptive roadmap retrieved")


@router.post("/advance", response_model=APIResponse[dict])
async def advance_adaptively(
    req: AdaptiveAdvanceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Enforces strict prerequisite mastery check before allowing the user to advance."""
    mastery_repo = MasteryRepository(db)
    progress_repo = ProgressRepository(db)

    # Check if user has mastered the prerequisite concept
    concept = req.concept_id or "math_foundations"
    user_mastery = await mastery_repo.get_user_mastery_by_concept(current_user.id, concept)
    mastery_score = user_mastery.mastery_score if user_mastery else 0.0

    if mastery_score < 0.70 and concept != "math_foundations":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Advancement blocked: Compulsory prerequisite remediation required for {concept}. Current mastery is {int(mastery_score * 100)}% (70% required)."
        )

    await progress_repo.add_xp_transaction(
        user_id=current_user.id,
        amount=30,
        source_type="ADAPTIVE_ADVANCE",
        description=f"Verified advancement to {req.target_topic_id or concept}"
    )
    await db.commit()

    return APIResponse(
        data={
            "success": True,
            "can_advance": True,
            "target_topic_id": req.target_topic_id,
            "message": "Mastery confirmed. Advancement granted."
        },
        message="Advancement authorized"
    )


@router.get("/remediation/{topic_id}", response_model=APIResponse[DifferentiatedRemediationRead])
async def get_differentiated_remediation(
    topic_id: str,
    current_user: User = Depends(get_current_user)
):
    """Returns specialized differentiated remediation content: Misconception Deconstruction,

    Physical/Visual Analogy, and an Interactive Verification Puzzle.
    """
    remediation_bank: Dict[str, Dict[str, Any]] = {
        "t1-1": {
            "concept_name": "Complex Hilbert Spaces & State Vectors",
            "mode": "VISUAL_ANALOGY",
            "compulsion_reason": "Failure to normalize state vectors (|α|² + |β|² = 1) or confusion with classical binary bits.",
            "misconception_deconstruction": {
                "trap": "Believing a qubit is a hidden variable with 50% probability like an uninspected coin under a cup.",
                "reality": "A qubit exists in a genuine coherent statevector until measurement projects it onto the computational basis.",
                "rule": "Total probability must strictly satisfy ⟨ψ|ψ⟩ = 1.0 (Unitary conservation)."
            },
            "visual_analogy": {
                "headline": "The Compass Needle in 3D Space",
                "analogy": "Imagine a compass needle suspended in a glass sphere. It is not 'half North and half South'—it points in a distinct 3D geometric direction. Projective measurement is like illuminating the needle from above: you only see its shadow on the Z-axis."
            },
            "verification_challenge": {
                "question": "If state |ψ⟩ = (1/√2)|0⟩ - (1/√2)|1⟩, what is the probability P(1) of measuring |1⟩?",
                "options": ["0%", "50%", "-50%", "100%"],
                "correct_index": 1,
                "explanation": "P(1) = |-1/√2|² = 1/2 = 50%. The negative amplitude affects interference, but squared magnitude is strictly positive."
            }
        },
        "t1-2": {
            "concept_name": "Bloch Sphere Geometry & State Rotations",
            "mode": "INTERACTIVE_SIMULATION",
            "compulsion_reason": "Confusing global phase e^(iθ) with relative phase e^(iφ) along the equator.",
            "misconception_deconstruction": {
                "trap": "Assuming e^(iθ)|ψ⟩ produces an observable difference in measurement statistics.",
                "reality": "Global phase cancels out completely in all projection operators |⟨x|ψ⟩|² = |e^(iθ)⟨x|ψ⟩|².",
                "rule": "Only relative phase between |0⟩ and |1⟩ rotates the statevector along the equator."
            },
            "visual_analogy": {
                "headline": "The Clock Face with a Rotatable Dial",
                "analogy": "Global phase is like rotating the entire clock on the wall—the relative positions of the hands do not change. Relative phase moves the hour hand relative to the minute hand, fundamentally changing the state."
            },
            "verification_challenge": {
                "question": "Which axis does the state |+⟩ = (|0⟩ + |1⟩)/√2 point along on the Bloch Sphere?",
                "options": ["+Z axis (North Pole)", "+X axis (Equator)", "-Z axis (South Pole)", "+Y axis (Equator)"],
                "correct_index": 1,
                "explanation": "|+⟩ has θ = π/2, φ = 0, which corresponds to coordinates (1, 0, 0) along the +X axis."
            }
        },
        "default": {
            "concept_name": "Quantum Mechanics Foundations",
            "mode": "MISCONCEPTION_DEBUGGER",
            "compulsion_reason": "Sub-threshold concept performance requires verified cognitive recalibration.",
            "misconception_deconstruction": {
                "trap": "Applying classical Boolean logic to coherent unitary operations.",
                "reality": "Quantum gates are reversible unitary matrices preserving inner products (U†U = I).",
                "rule": "All quantum state evolutions must be completely deterministic and reversible until measurement."
            },
            "visual_analogy": {
                "headline": "Reversible Optical Beam Splitters",
                "analogy": "Unitary quantum gates behave like lossless beam splitters and mirrors. Photons interfere constructively or destructively, conserving total photon energy without loss."
            },
            "verification_challenge": {
                "question": "What is the conjugate transpose condition for any valid quantum gate U?",
                "options": ["U + U† = 0", "U†U = I (Identity)", "det(U) = 0", "U² = 0"],
                "correct_index": 1,
                "explanation": "Every valid quantum logic gate must be unitary: U†U = UU† = I."
            }
        }
    }

    data = remediation_bank.get(topic_id, remediation_bank["default"])
    return APIResponse(
        data=DifferentiatedRemediationRead(
            topic_id=topic_id,
            concept_name=data["concept_name"],
            mode=data["mode"],
            compulsion_reason=data["compulsion_reason"],
            misconception_deconstruction=data["misconception_deconstruction"],
            visual_analogy=data["visual_analogy"],
            verification_challenge=data["verification_challenge"]
        ),
        message="Differentiated remediation package generated"
    )
