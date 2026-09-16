import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.concept import Concept
from app.models.concept_prerequisite import ConceptPrerequisite
from app.models.course import Course
from app.engines.learning_engine import LearningEngine


async def validate_content():
    print("[CHECK] Validating curriculum knowledge graph integrity...")
    async with AsyncSessionLocal() as db:
        concepts = list((await db.execute(select(Concept))).scalars().all())
        prereqs = list((await db.execute(select(ConceptPrerequisite))).scalars().all())
        courses = list((await db.execute(select(Course))).scalars().all())

        concept_ids = [c.id for c in concepts]
        prereq_edges = [{"concept_id": p.concept_id, "prerequisite_id": p.prerequisite_id} for p in prereqs]

        sorted_order = LearningEngine.topological_sort_concepts(concept_ids, prereq_edges)

        assert len(sorted_order) == len(concept_ids), "Cyclic dependency detected in concept prerequisites!"
        assert len(courses) > 0, "No courses found in database!"

        print(f"[SUCCESS] Validation Passed: {len(concepts)} concepts in DAG, {len(courses)} courses, no graph cycles.")


if __name__ == "__main__":
    asyncio.run(validate_content())
