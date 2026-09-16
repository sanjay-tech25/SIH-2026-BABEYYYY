import asyncio
import sys
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.user_profile import UserProfile


async def create_admin(email: str = "admin@quantum.io", password: str = "admin123"):
    async with AsyncSessionLocal() as db:
        admin = User(
            email=email,
            password_hash=get_password_hash(password),
            role="ADMIN",
            is_active=True,
            is_onboarded=True
        )
        db.add(admin)
        await db.flush()

        profile = UserProfile(
            user_id=admin.id,
            display_name="Root Administrator",
            age_bracket="ADULT",
            persona="system_admin",
            current_level=99,
            total_xp=99999
        )
        db.add(profile)
        await db.commit()
        print(f"[SUCCESS] Admin user created successfully: {email}")


if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@quantum.io"
    password = sys.argv[2] if len(sys.argv) > 2 else "admin123"
    asyncio.run(create_admin(email, password))
