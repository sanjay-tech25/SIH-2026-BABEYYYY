import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.course import Course
from app.models.module import Module
from app.models.concept import Concept
from app.models.concept_prerequisite import ConceptPrerequisite
from app.models.lesson import Lesson
from app.models.learning_resource import LearningResource
from app.models.achievement import Achievement


async def seed_curriculum(db: AsyncSession):
    print("[SEED] Seeding Concepts & Prerequisite DAG...")

    c_math = Concept(
        key="linear_algebra",
        name="Linear Algebra & Complex Numbers",
        description="Vectors, matrices, Dirac bra-ket notation, and complex probability amplitudes.",
        category="FOUNDATIONAL",
        mastery_threshold=0.85
    )
    c_qubit = Concept(
        key="qubit_state",
        name="Qubit & State Representation",
        description="State vectors, orthonormal basis |0> and |1>, and normalization conditions.",
        category="FOUNDATIONAL",
        mastery_threshold=0.85
    )
    c_super = Concept(
        key="superposition",
        name="Quantum Superposition & Bloch Sphere",
        description="Linear combinations of states, Hadamard transforms, and 3D Bloch sphere geometry.",
        category="CORE",
        mastery_threshold=0.80
    )
    c_entangle = Concept(
        key="entanglement",
        name="Quantum Entanglement & Bell States",
        description="Multi-qubit tensor products, non-locality, and Maximally Entangled Bell states.",
        category="CORE",
        mastery_threshold=0.80
    )
    c_gates = Concept(
        key="quantum_gates",
        name="Single & Multi-Qubit Gates",
        description="Unitary operations: Pauli X, Y, Z, Phase S/T gates, and Controlled-NOT (CX).",
        category="CORE",
        mastery_threshold=0.80
    )
    c_algo = Concept(
        key="grover_algorithm",
        name="Grover's Search Algorithm",
        description="Quantum amplitude amplification and quadratic speedup for unstructured search.",
        category="ADVANCED",
        mastery_threshold=0.70
    )

    db.add_all([c_math, c_qubit, c_super, c_entangle, c_gates, c_algo])
    await db.flush()

    # DAG Prerequisites
    prereqs = [
        ConceptPrerequisite(concept_id=c_qubit.id, prerequisite_id=c_math.id),
        ConceptPrerequisite(concept_id=c_super.id, prerequisite_id=c_qubit.id),
        ConceptPrerequisite(concept_id=c_gates.id, prerequisite_id=c_super.id),
        ConceptPrerequisite(concept_id=c_entangle.id, prerequisite_id=c_gates.id),
        ConceptPrerequisite(concept_id=c_algo.id, prerequisite_id=c_entangle.id),
    ]
    db.add_all(prereqs)
    await db.flush()

    print("[SEED] Seeding Quantum Computing Course & Modules...")
    course = Course(
        slug="quantum-foundations",
        title="Introduction to Quantum Computing & Circuits",
        description="Master the foundations of quantum mechanics, state vectors, superposition, entanglement, and build circuits in the Qiskit simulator.",
        difficulty_level="BEGINNER_TO_INTERMEDIATE",
        estimated_hours=12,
        is_published=True
    )
    db.add(course)
    await db.flush()

    # Module 1: Foundations
    m1 = Module(
        course_id=course.id,
        slug="module-1-foundations",
        title="Module 1: The Quantum Bit & Superposition",
        description="From classical bits to continuous probability amplitudes.",
        order_index=1
    )
    # Module 2: Circuits & Entanglement
    m2 = Module(
        course_id=course.id,
        slug="module-2-circuits",
        title="Module 2: Quantum Logic Gates & Entanglement",
        description="Manipulating multi-qubit states and creating Bell pairs.",
        order_index=2
    )
    db.add_all([m1, m2])
    await db.flush()

    # Lesson 1.1: Superposition Basics
    l1 = Lesson(
        module_id=m1.id,
        concept_id=c_super.id,
        slug="superposition-basics",
        title="Understanding Quantum Superposition",
        summary="Discover how qubits exist in linear combinations of 0 and 1 before measurement.",
        order_index=1,
        estimated_minutes=15,
        xp_reward=50,
        content_cards=[
            {
                "card_id": "card_1",
                "card_type": "CONCEPT_EXPLANATION",
                "title": "What is a Qubit?",
                "content": "Unlike a classical bit that is either 0 or 1, a quantum bit (qubit) can exist in a superposition."
            },
            {
                "card_id": "card_2",
                "card_type": "VISUAL_DIAGRAM",
                "title": "The Bloch Sphere",
                "content": "A geometric sphere where any pure single-qubit state can be represented as a point on the surface."
            }
        ]
    )

    # Lesson 1.2: Quantum Logic Gates
    l2 = Lesson(
        module_id=m2.id,
        concept_id=c_gates.id,
        slug="quantum-gates-intro",
        title="Quantum Logic Gates (H, X, CX)",
        summary="Learn how Hadamard (H) creates superposition and CNOT entangles qubits.",
        order_index=2,
        estimated_minutes=20,
        xp_reward=60,
        content_cards=[
            {
                "card_id": "card_2_1",
                "card_type": "CONCEPT_EXPLANATION",
                "title": "The Hadamard Gate",
                "content": "The Hadamard gate maps the basis states |0> into |+>."
            }
        ]
    )

    # Lesson 2.1: Bell State Entanglement
    l3 = Lesson(
        module_id=m2.id,
        concept_id=c_entangle.id,
        slug="bell-state-entanglement",
        title="Creating the Bell State |Phi+>",
        summary="Combine H and CNOT gates to construct maximal quantum entanglement.",
        order_index=3,
        estimated_minutes=25,
        xp_reward=75,
        content_cards=[
            {
                "card_id": "card_3_1",
                "card_type": "CONCEPT_EXPLANATION",
                "title": "Building a Bell Pair",
                "content": "Apply H on Qubit 0, then CX with Qubit 0 as control and Qubit 1 as target."
            }
        ]
    )

    db.add_all([l1, l2, l3])
    await db.flush()

    # Seed Badges
    b1 = Achievement(
        slug="quantum_explorer",
        title="Quantum Explorer",
        description="Completed your first quantum lesson and diagnostic assessment.",
        category="ONBOARDING",
        icon_url="badge_explorer.svg",
        xp_bonus=100,
        criteria_rules={"lessons_completed": 1}
    )
    b2 = Achievement(
        slug="bell_master",
        title="Entanglement Wizard",
        description="Successfully simulated a 2-qubit Bell State circuit in the Quantum Lab.",
        category="QUANTUM_LAB",
        icon_url="badge_bell.svg",
        xp_bonus=150,
        criteria_rules={"circuits_executed": 1}
    )
    b3 = Achievement(
        slug="streak_champion",
        title="7-Day Streak Champion",
        description="Maintained daily quantum study for 7 consecutive days.",
        category="STREAK",
        icon_url="badge_fire.svg",
        xp_bonus=200,
        criteria_rules={"streak_days": 7}
    )
    db.add_all([b1, b2, b3])
    await db.commit()
    print("[SUCCESS] Quantum curriculum & badges seeded successfully.")


if __name__ == "__main__":
    async def main():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with AsyncSessionLocal() as session:
            await seed_curriculum(session)
    asyncio.run(main())
