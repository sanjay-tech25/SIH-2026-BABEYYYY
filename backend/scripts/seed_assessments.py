import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.concept import Concept
from app.models.lesson import Lesson
from app.models.assessment import Assessment
from app.models.question import Question
from app.models.answer_option import AnswerOption


async def seed_assessments(db: AsyncSession):
    print("[SEED] Seeding Diagnostic Assessment & Quizzes...")

    concepts_result = await db.execute(select(Concept))
    concepts = {c.key: c for c in concepts_result.scalars().all()}

    c_math = concepts.get("linear_algebra")
    c_super = concepts.get("superposition")

    diag = Assessment(
        assessment_type="DIAGNOSTIC",
        title="Initial Quantum Skills Diagnostic",
        description="A short diagnostic to determine your starting knowledge in math, superposition, and quantum gates.",
        pass_percentage=70,
        xp_reward=150
    )
    db.add(diag)
    await db.flush()

    # Question 1 (Math)
    q1 = Question(
        assessment_id=diag.id,
        concept_id=c_math.id if c_math else None,
        question_type="MULTIPLE_CHOICE",
        prompt="In quantum computing, if a state |psi> = alpha|0> + beta|1> is normalized, what must the amplitudes satisfy?",
        difficulty=1.0,
        order_index=1
    )
    db.add(q1)
    await db.flush()

    db.add_all([
        AnswerOption(question_id=q1.id, option_text="|alpha|^2 + |beta|^2 = 1", is_correct=True, order_index=1),
        AnswerOption(question_id=q1.id, option_text="alpha + beta = 1", is_correct=False, distractor_feedback="Probabilities are the absolute squares of amplitudes, not their direct sum.", order_index=2),
        AnswerOption(question_id=q1.id, option_text="alpha^2 + beta^2 = 0", is_correct=False, distractor_feedback="Normalization requires total probability to sum to 100% (1.0).", order_index=3),
        AnswerOption(question_id=q1.id, option_text="|alpha| + |beta| = 1", is_correct=False, distractor_feedback="Amplitudes can be complex numbers; their squared magnitudes must sum to 1.", order_index=4)
    ])

    # Question 2 (Superposition)
    q2 = Question(
        assessment_id=diag.id,
        concept_id=c_super.id if c_super else None,
        question_type="MULTIPLE_CHOICE",
        prompt="What happens to a qubit in superposition state (|0> + |1>)/sqrt(2) when it is measured in the computational basis?",
        difficulty=1.5,
        order_index=2
    )
    db.add(q2)
    await db.flush()

    db.add_all([
        AnswerOption(question_id=q2.id, option_text="It collapses probabilistically to either |0> or |1> with 50% probability.", is_correct=True, order_index=1),
        AnswerOption(question_id=q2.id, option_text="It remains in superposition simultaneously.", is_correct=False, distractor_feedback="Measurement destroys the fragile superposition, collapsing the state.", order_index=2),
        AnswerOption(question_id=q2.id, option_text="It always outputs 0.", is_correct=False, distractor_feedback="Equal amplitudes mean 50/50 probability, not a deterministic 0.", order_index=3),
        AnswerOption(question_id=q2.id, option_text="It doubles its energy state.", is_correct=False, distractor_feedback="Measurement does not amplify qubit energy.", order_index=4)
    ])

    # 2. Lesson 1 Quiz (Linked to Lesson)
    lessons_result = await db.execute(select(Lesson).where(Lesson.slug == "superposition-basics"))
    l1 = lessons_result.scalar_one_or_none()
    if l1:
        quiz1 = Assessment(
            lesson_id=l1.id,
            assessment_type="LESSON_QUIZ",
            title="Superposition Checkpoint Quiz",
            description="Test your understanding of superposition and Bloch vectors.",
            pass_percentage=70,
            xp_reward=100
        )
        db.add(quiz1)
        await db.flush()

        q_l1 = Question(
            assessment_id=quiz1.id,
            concept_id=l1.concept_id,
            question_type="MULTIPLE_CHOICE",
            prompt="Which quantum logic gate is used to transform a basis state |0> into the equal superposition state |+>?",
            difficulty=1.0,
            order_index=1
        )
        db.add(q_l1)
        await db.flush()

        db.add_all([
            AnswerOption(question_id=q_l1.id, option_text="Hadamard (H) Gate", is_correct=True, order_index=1),
            AnswerOption(question_id=q_l1.id, option_text="Pauli-X (NOT) Gate", is_correct=False, distractor_feedback="Pauli-X flips |0> to |1>, but does not create superposition.", order_index=2),
            AnswerOption(question_id=q_l1.id, option_text="Phase (S) Gate", is_correct=False, distractor_feedback="Phase gate introduces an imaginary phase, not equal superposition from |0>.", order_index=3),
            AnswerOption(question_id=q_l1.id, option_text="Measurement Gate", is_correct=False, distractor_feedback="Measurement collapses a state rather than creating superposition.", order_index=4)
        ])

    await db.commit()
    print("[SUCCESS] Diagnostic & Quiz assessments seeded successfully.")


if __name__ == "__main__":
    async def main():
        async with AsyncSessionLocal() as session:
            await seed_assessments(session)
    asyncio.run(main())
