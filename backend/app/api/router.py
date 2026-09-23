from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.onboarding import router as onboarding_router
from app.api.courses import router as courses_router
from app.api.lessons import router as lessons_router
from app.api.assessments import router as assessments_router
from app.api.progress import router as progress_router
from app.api.achievements import router as achievements_router
from app.api.focus import router as focus_router
from app.api.mascot import router as mascot_router
from app.api.ai_tutor import router as ai_tutor_router
from app.api.circuits import router as circuits_router
from app.api.instructor import router as instructor_router
from app.api.qubot import router as qubot_router
from app.api.websocket import router as ws_router
from app.api.v1.quantum_innovations_router import router as innovations_router

from app.api.adaptive import router as adaptive_router

api_router = APIRouter()

# Register sub-routers
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(onboarding_router)
api_router.include_router(courses_router)
api_router.include_router(lessons_router)
api_router.include_router(assessments_router)
api_router.include_router(progress_router)
api_router.include_router(achievements_router)
api_router.include_router(focus_router)
api_router.include_router(mascot_router)
api_router.include_router(qubot_router)
api_router.include_router(ai_tutor_router)
api_router.include_router(circuits_router)
api_router.include_router(instructor_router)
api_router.include_router(ws_router)
api_router.include_router(innovations_router)
api_router.include_router(adaptive_router)


