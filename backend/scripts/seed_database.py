import asyncio
import sys
from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_goal import UserGoal
from app.models.user_preference import UserPreference
from app.models.streak import Streak
from scripts.seed_curriculum import seed_curriculum
from scripts.seed_assessments import seed_assessments


async def seed_master():
    print("[INIT] Initializing database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        print("[SEED] Seeding Demo Users...")
        # Demo Learner
        learner = User(
            email="learner@quantum.io",
            password_hash=get_password_hash("password123"),
            role="LEARNER",
            is_active=True,
            is_onboarded=True
        )
        # Demo Instructor
        instructor = User(
            email="instructor@quantum.io",
            password_hash=get_password_hash("password123"),
            role="INSTRUCTOR",
            is_active=True,
            is_onboarded=True
        )
        db.add_all([learner, instructor])
        await db.flush()

        db.add_all([
            UserProfile(user_id=learner.id, display_name="Alex Quantum", age_bracket="STUDENT", persona="high_school_student", current_level=2, total_xp=320),
            UserGoal(user_id=learner.id, primary_goal="learn_quantum_basics", target_daily_minutes=30),
            UserPreference(user_id=learner.id, theme_mode="balanced", visual_density="standard"),
            Streak(user_id=learner.id, current_streak=4, longest_streak=7),

            UserProfile(user_id=instructor.id, display_name="Dr. Evelyn Vance", age_bracket="ADULT", persona="professor", current_level=10, total_xp=5000),
            UserGoal(user_id=instructor.id, primary_goal="teach_quantum"),
            UserPreference(user_id=instructor.id, theme_mode="professional", visual_density="compact"),
            Streak(user_id=instructor.id, current_streak=12, longest_streak=30)
        ])
        await db.commit()

        # Seed Curriculum & Assessments
        await seed_curriculum(db)
        await seed_assessments(db)

    print("[SUCCESS] Master database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_master())
