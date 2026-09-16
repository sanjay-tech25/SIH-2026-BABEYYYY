from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.ai.provider import AIProvider
from app.ai.tutor_context import TutorContextBuilder
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.schemas.ai_tutor import TutorQueryRequest, TutorAnswerResponse


class AITutorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def ask_tutor(self, user_id: str, req: TutorQueryRequest) -> TutorAnswerResponse:
        user = await self.user_repo.get_full_user(user_id)
        age_bracket = user.profile.age_bracket if user and user.profile else "STUDENT"

        # Build context
        context = TutorContextBuilder.build_context(
            age_bracket=age_bracket,
            current_concept="Quantum Superposition",
            mastery_score=0.75
        )

        # Get or create conversation
        if req.conversation_id:
            conv_id = req.conversation_id
        else:
            conv = AIConversation(user_id=user_id, title=req.query[:40])
            self.db.add(conv)
            await self.db.flush()
            conv_id = conv.id

        # Save user message
        user_msg = AIMessage(
            conversation_id=conv_id,
            sender="USER",
            content=req.query,
            citations=[]
        )
        self.db.add(user_msg)

        # Generate Socratic AI response
        ai_result = await AIProvider.generate_tutor_response(
            user_query=req.query,
            learner_context=context
        )

        tutor_msg = AIMessage(
            conversation_id=conv_id,
            sender="TUTOR",
            content=ai_result["answer"],
            citations=ai_result["citations"]
        )
        self.db.add(tutor_msg)
        await self.db.commit()

        return TutorAnswerResponse(
            conversation_id=conv_id,
            answer=ai_result["answer"],
            citations=ai_result["citations"],
            is_grounded=ai_result["is_grounded"]
        )
