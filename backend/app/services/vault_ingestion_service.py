import os
import re
from typing import Dict, List, Any, Optional, Set, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.parsers.obsidian_parser import ObsidianVaultParser, VaultNote
from app.models.course import Course
from app.models.module import Module
from app.models.concept import Concept
from app.models.concept_prerequisite import ConceptPrerequisite
from app.models.lesson import Lesson
from app.models.learning_resource import LearningResource


class VaultIngestionService:
    """Synchronizes Obsidian Vault Markdown notes with the Backend Knowledge Graph."""

    STAGE_CATEGORIES = {
        "01 - Mathematics": ("FOUNDATIONAL", 0.85, 1),
        "02 - Quantum Foundations": ("FOUNDATIONAL", 0.85, 2),
        "03 - Quantum Gates": ("CORE", 0.80, 3),
        "04 - Core Quantum Concepts": ("CORE", 0.80, 4),
        "05 - Quantum Protocols": ("CORE", 0.80, 5),
        "06 - Quantum Algorithms": ("CORE", 0.80, 6),
        "07 - Advanced Algorithms": ("ADVANCED", 0.70, 7),
        "08 - Quantum Cryptography": ("ADVANCED", 0.70, 8),
        "09 - Quantum Error Correction": ("ADVANCED", 0.70, 9),
        "10 - Quantum Computing Hardware": ("ADVANCED", 0.70, 10),
        "11 - Implementation": ("CORE", 0.80, 11),
        "12 - Resources": ("FOUNDATIONAL", 0.80, 12),
    }

    @classmethod
    def _build_content_cards(cls, note: VaultNote) -> List[Dict[str, Any]]:
        """Transforms a parsed markdown note into clean structured content cards for the UI."""
        cards = []

        # Card 1: Definition & Overview
        cards.append({
            "card_id": f"{note.slug}_def",
            "type": "CONCEPT",
            "title": f"Understanding {note.title}",
            "body": note.sections.get("Definition", note.summary or f"Core concept: {note.title}"),
            "hint": "Master the foundational definition before moving to circuits."
        })

        # Card 2: Intuition / Why It Matters
        intuition_text = note.sections.get("Intuition", "")
        why_text = note.sections.get("Why It Matters", "")
        if intuition_text or why_text:
            combined_intuition = f"{why_text}\n\n{intuition_text}".strip()
            cards.append({
                "card_id": f"{note.slug}_intuition",
                "type": "INTUITION",
                "title": "Mental Model & Intuition",
                "body": combined_intuition,
                "hint": "Think about how this behaves geometrically on the Bloch sphere."
            })

        # Card 3: Mathematical Formulation
        math_text = note.sections.get("Mathematical Foundation", "")
        eq_text = note.sections.get("Key Equations", "")
        if math_text or eq_text:
            cards.append({
                "card_id": f"{note.slug}_math",
                "type": "MATH_THEORY",
                "title": "Mathematical Formulation",
                "body": f"{math_text}\n\n{eq_text}".strip(),
                "hint": "Review the bra-ket inner products and matrix representations."
            })

        # Card 4: Circuit / Implementation
        circuit_text = note.sections.get("Circuit", "")
        impl_text = note.sections.get("Implementation", "")
        if circuit_text or impl_text or note.code_snippets:
            cards.append({
                "card_id": f"{note.slug}_code",
                "type": "SIMULATION",
                "title": "Circuit & Qiskit Implementation",
                "body": f"{circuit_text}\n\n{impl_text}".strip(),
                "hint": "You can simulate this directly in the Quantum Lab tab."
            })

        # Card 5: Exercises & Katas
        exercise_text = note.sections.get("Exercises", "")
        if exercise_text:
            cards.append({
                "card_id": f"{note.slug}_exercise",
                "type": "PRACTICE",
                "title": "Exercises & Practice",
                "body": exercise_text[:1500],
                "hint": "Work through these solutions to solidify understanding."
            })

        return cards

    @classmethod
    async def ingest_vault(cls, db: AsyncSession, vault_root: str) -> Dict[str, Any]:
        """Main ingestion pipeline."""
        if not os.path.isdir(vault_root):
            raise FileNotFoundError(f"Obsidian Vault directory not found: {vault_root}")

        notes = ObsidianVaultParser.scan_vault(vault_root)
        if not notes:
            return {"status": "empty", "message": f"No markdown notes found in {vault_root}"}

        # 1. Ensure Master Course Exists
        course_slug = "quantum-vault-master"
        stmt = select(Course).where(Course.slug == course_slug)
        res = await db.execute(stmt)
        course = res.scalar_one_or_none()

        if not course:
            course = Course(
                slug=course_slug,
                title="Quantum Computing Knowledge Brain",
                description="Comprehensive 12-stage quantum curriculum directly ingested from the Obsidian Knowledge Brain.",
                difficulty_level="BEGINNER_TO_ADVANCED",
                estimated_hours=40,
                is_published=True
            )
            db.add(course)
            await db.flush()

        # 2. Synchronize Modules for Stages
        folder_names = sorted(list(set(n.folder for n in notes)))
        module_map: Dict[str, Module] = {}

        for folder in folder_names:
            if folder == "00 - Dashboard" or folder == "Root":
                continue

            stage_info = cls.STAGE_CATEGORIES.get(folder, ("CORE", 0.80, 99))
            mod_slug = re.sub(r"[^a-zA-Z0-9]+", "-", folder.lower()).strip("-")

            stmt = select(Module).where(Module.course_id == course.id, Module.slug == mod_slug)
            res = await db.execute(stmt)
            mod = res.scalar_one_or_none()

            if not mod:
                clean_title = re.sub(r"^\d+\s*-\s*", "", folder)
                mod = Module(
                    course_id=course.id,
                    slug=mod_slug,
                    title=f"{folder[:2]}. {clean_title}",
                    description=f"Curriculum stage {folder} covering {clean_title}.",
                    order_index=stage_info[2]
                )
                db.add(mod)
                await db.flush()

            module_map[folder] = mod

        # 3. Synchronize Concepts
        concept_map: Dict[str, Concept] = {}
        title_to_slug: Dict[str, str] = {}

        for note in notes:
            clean_title_key = note.title.lower().strip()
            title_to_slug[clean_title_key] = note.slug
            base_name = os.path.splitext(os.path.basename(note.file_path))[0].lower().strip()
            title_to_slug[base_name] = note.slug

            stage_info = cls.STAGE_CATEGORIES.get(note.folder, ("CORE", 0.80, 50))
            category, default_threshold, _ = stage_info

            # Override threshold based on frontmatter if provided
            if note.level == "beginner" or note.difficulty == "easy":
                threshold = 0.85
            elif note.level == "intermediate" or note.difficulty == "medium":
                threshold = 0.80
            else:
                threshold = 0.70

            stmt = select(Concept).where(Concept.key == note.slug)
            res = await db.execute(stmt)
            concept = res.scalar_one_or_none()

            if not concept:
                concept = Concept(
                    key=note.slug,
                    name=note.title,
                    description=note.summary or f"Vault concept covering {note.title}",
                    category=category,
                    mastery_threshold=threshold
                )
                db.add(concept)
                await db.flush()
            else:
                concept.name = note.title
                concept.description = note.summary or concept.description
                concept.category = category
                concept.mastery_threshold = threshold

            concept_map[note.slug] = concept

        # 4. Ingest Lessons and Learning Resources
        lessons_created = 0
        resources_created = 0

        for idx, note in enumerate(notes):
            if note.folder not in module_map:
                continue

            target_module = module_map[note.folder]
            target_concept = concept_map.get(note.slug)
            if not target_concept:
                continue

            lesson_slug = f"lesson-{note.slug}"
            stmt = select(Lesson).where(Lesson.module_id == target_module.id, Lesson.slug == lesson_slug)
            res = await db.execute(stmt)
            lesson = res.scalar_one_or_none()

            cards = cls._build_content_cards(note)
            est_mins = 10 if note.difficulty == "easy" else (20 if note.difficulty == "medium" else 30)
            xp = 50 if note.difficulty == "easy" else (75 if note.difficulty == "medium" else 100)

            if not lesson:
                lesson = Lesson(
                    module_id=target_module.id,
                    concept_id=target_concept.id,
                    slug=lesson_slug,
                    title=note.title,
                    summary=note.summary or f"Deep dive into {note.title}.",
                    order_index=idx + 1,
                    estimated_minutes=est_mins,
                    xp_reward=xp,
                    content_cards=cards
                )
                db.add(lesson)
                await db.flush()
                lessons_created += 1
            else:
                lesson.title = note.title
                lesson.summary = note.summary or lesson.summary
                lesson.content_cards = cards
                lesson.estimated_minutes = est_mins
                lesson.xp_reward = xp

            # Code Snippet Resources
            for s_idx, snippet in enumerate(note.code_snippets):
                res_title = f"{note.title} - Code Snippet {s_idx + 1} ({snippet['language']})"
                lr = LearningResource(
                    lesson_id=lesson.id,
                    resource_type="SIMULATION_WIDGET" if snippet['language'] in ['python', 'qiskit'] else "CODE_SNIPPET",
                    title=res_title,
                    content_payload=snippet
                )
                db.add(lr)
                resources_created += 1

        # 5. Build Knowledge Graph DAG Edges from Wikilinks
        # Load existing edges to prevent duplicates
        stmt = select(ConceptPrerequisite)
        res = await db.execute(stmt)
        existing_edges = res.scalars().all()
        seen_pairs: Set[Tuple[str, str]] = set(
            (edge.concept_id, edge.prerequisite_id) for edge in existing_edges
        )

        prereqs_created = 0
        for note in notes:
            child_concept = concept_map.get(note.slug)
            if not child_concept:
                continue

            for link_target in note.wikilinks:
                clean_target = link_target.lower().strip()
                target_slug = title_to_slug.get(clean_target)
                if not target_slug or target_slug == note.slug:
                    continue

                parent_concept = concept_map.get(target_slug)
                if not parent_concept:
                    continue

                pair = (child_concept.id, parent_concept.id)
                if pair not in seen_pairs:
                    seen_pairs.add(pair)
                    prereq = ConceptPrerequisite(
                        concept_id=child_concept.id,
                        prerequisite_id=parent_concept.id
                    )
                    db.add(prereq)
                    prereqs_created += 1

        await db.commit()

        return {
            "status": "success",
            "notes_parsed": len(notes),
            "modules_synced": len(module_map),
            "concepts_synced": len(concept_map),
            "prerequisites_created": prereqs_created,
            "lessons_created": lessons_created,
            "resources_created": resources_created
        }
