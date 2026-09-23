from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_optional_current_user
from app.models.user import User
from app.services.ai_tutor_service import AITutorService
from app.ai.provider import AIProvider
from app.schemas.ai_tutor import TutorQueryRequest, TutorAnswerResponse, TopicScaffoldResponse
from app.schemas.common import APIResponse
from pydantic import BaseModel

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])


class DiagnosticRequest(BaseModel):
    topic_id: str
    question_text: str
    selected_option: str
    correct_option: str
    explanation_summary: Optional[str] = ""


class ChatFallbackRequest(BaseModel):
    message: Optional[str] = None
    query: Optional[str] = None
    current_concept: Optional[str] = None
    current_lesson: Optional[str] = None
    current_topic_id: Optional[str] = None
    mode: Optional[str] = "socratic_guidance"


@router.post("/ask", response_model=APIResponse[TutorAnswerResponse])
async def ask_tutor(
    req: TutorQueryRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    service = AITutorService(db)
    result = await service.ask_tutor(user_id, req)
    return APIResponse(data=result)


@router.post("/chat")
async def chat_compat(
    req: ChatFallbackRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Compatibility endpoint for chat callers."""
    query_text = req.message or req.query or "Explain this quantum concept"
    tutor_req = TutorQueryRequest(
        query=query_text,
        current_concept_id=req.current_concept,
        current_topic_id=req.current_topic_id,
        mode=req.mode or "socratic_guidance"
    )
    user_id = current_user.id if current_user else None
    service = AITutorService(db)
    result = await service.ask_tutor(user_id, tutor_req)
    return {
        "reply": result.answer,
        "answer": result.answer,
        "concept_title": result.concept_title,
        "analogy": result.analogy,
        "socratic_inquiry": result.socratic_inquiry,
        "micro_action": result.micro_action,
        "citations": result.citations,
        "vault_citations": result.vault_citations,
        "is_grounded": result.is_grounded
    }


@router.get("/scaffold/{topic_id}", response_model=APIResponse[TopicScaffoldResponse])
async def get_topic_scaffold(
    topic_id: str,
    db: AsyncSession = Depends(get_db)
):
    service = AITutorService(db)
    result = service.get_topic_scaffold(topic_id)
    return APIResponse(data=result)


@router.post("/diagnostic")
async def get_socratic_diagnostic(
    req: DiagnosticRequest
):
    """Provides targeted Socratic diagnostic for incorrect answers."""
    result = AIProvider.generate_diagnostic_guidance(
        topic_id=req.topic_id,
        question_text=req.question_text,
        selected_option=req.selected_option,
        correct_option=req.correct_option,
        explanation_summary=req.explanation_summary or ""
    )
    return APIResponse(data=result)
