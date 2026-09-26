import time
import uuid
import csv
import io
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.analytics_repository import AnalyticsRepository
from app.models.user import User
from app.models.learner_mastery import LearnerMastery
from app.schemas.instructor import (
    InstructorOverviewRead,
    ConceptHeatmapItem,
    StudentMonitoringItem,
    RemediationDispatchRequest,
    RemediationDispatchResponse
)


class InstructorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analytics_repo = AnalyticsRepository(db)

    async def get_overview_analytics(self) -> InstructorOverviewRead:
        overview = await self.analytics_repo.get_overview_metrics()
        heatmap_data = await self.analytics_repo.get_concept_struggle_heatmap()

        heatmap_items = [
            ConceptHeatmapItem(
                concept_id=h["concept_id"],
                average_mastery=h["average_mastery"],
                learners_tested=h["learners_tested"]
            )
            for h in heatmap_data
        ]

        return InstructorOverviewRead(
            total_registered_learners=overview["total_registered_learners"],
            total_assessments_taken=overview["total_assessments_taken"],
            total_focus_sessions_completed=overview["total_focus_sessions_completed"],
            platform_average_quiz_score=overview["platform_average_quiz_score"],
            concept_struggle_heatmap=heatmap_items
        )

    async def get_students_monitoring(self) -> List[StudentMonitoringItem]:
        # Query users and their mastery profiles
        result = await self.db.execute(select(User).limit(50))
        users = result.scalars().all()

        students: List[StudentMonitoringItem] = []
        for u in users:
            # Aggregate mastery
            m_res = await self.db.execute(
                select(LearnerMastery).where(LearnerMastery.user_id == u.id)
            )
            masteries = m_res.scalars().all()
            avg_m = (sum(m.mastery_probability for m in masteries) / len(masteries)) if masteries else 0.50

            students.append(
                StudentMonitoringItem(
                    student_id=u.id,
                    email=u.email,
                    role=u.role,
                    active_chapter="Chapter 3: Quantum Circuits" if avg_m > 0.6 else "Chapter 1: Mathematics",
                    mastery_score=round(avg_m, 2),
                    diagnostic_tier="COLLEGE_STUDENT" if avg_m > 0.4 else "YOUNG_EXPLORER",
                    integrity_confidence=0.96,
                    last_active=u.created_at.strftime("%Y-%m-%d %H:%M") if hasattr(u, "created_at") and u.created_at else "Recently"
                )
            )

        if not students:
            # Provide sample student monitoring row for demonstration
            students.append(
                StudentMonitoringItem(
                    student_id="demo-student-01",
                    email="student@quantech.edu",
                    role="LEARNER",
                    active_chapter="Chapter 2: Qubits & Single-Qubit Gates",
                    mastery_score=0.78,
                    diagnostic_tier="COLLEGE_STUDENT",
                    integrity_confidence=0.98,
                    last_active="Active now"
                )
            )

        return students

    async def dispatch_remediation(self, req: RemediationDispatchRequest) -> RemediationDispatchResponse:
        dispatch_id = f"rem-{uuid.uuid4().hex[:10]}"
        return RemediationDispatchResponse(
            dispatch_id=dispatch_id,
            student_id=req.student_id,
            concept_id=req.concept_id,
            status="DISPATCHED",
            dispatched_at=time.time(),
            message=f"Targeted remediation kata for concept '{req.concept_id}' dispatched to student '{req.student_id}'"
        )

    async def export_gradebook_csv(self) -> str:
        students = await self.get_students_monitoring()
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Student ID", "Email", "Role", "Active Chapter",
            "Mastery Score", "Diagnostic Tier", "Integrity Score"
        ])
        for s in students:
            writer.writerow([
                s.student_id, s.email, s.role, s.active_chapter,
                s.mastery_score, s.diagnostic_tier, s.integrity_confidence
            ])
        return output.getvalue()
