from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.ai.provider import AIProvider
from app.ai.vault_rag import VaultBrainRAG
from app.ai.tutor_context import TutorContextBuilder
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.schemas.ai_tutor import TutorQueryRequest, TutorAnswerResponse, TopicScaffoldResponse


class AITutorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def ask_tutor(self, user_id: Optional[str], req: TutorQueryRequest) -> TutorAnswerResponse:
        age_bracket = "STUDENT"
        if user_id:
            user = await self.user_repo.get_full_user(user_id)
            if user and user.profile and user.profile.age_bracket:
                age_bracket = user.profile.age_bracket

        # Build context
        current_concept = req.current_concept_id or req.current_topic_id or "Quantum Computing Foundations"
        context = TutorContextBuilder.build_context(
            age_bracket=age_bracket,
            current_concept=current_concept,
            mastery_score=0.80
        )

        conv_id = req.conversation_id or f"conv_{int(__import__('time').time() * 1000)}"

        # If user_id is provided, persist to database
        if user_id:
            try:
                if not req.conversation_id:
                    conv = AIConversation(user_id=user_id, title=req.query[:40])
                    self.db.add(conv)
                    await self.db.flush()
                    conv_id = conv.id

                user_msg = AIMessage(
                    conversation_id=conv_id,
                    sender="USER",
                    content=req.query,
                    citations=[]
                )
                self.db.add(user_msg)
            except Exception:
                pass

        # Generate Socratic AI response
        ai_result = await AIProvider.generate_tutor_response(
            user_query=req.query,
            learner_context=context,
            topic_id=req.current_topic_id,
            mode=req.mode or "socratic_guidance"
        )

        if user_id:
            try:
                tutor_msg = AIMessage(
                    conversation_id=conv_id,
                    sender="TUTOR",
                    content=ai_result["answer"],
                    citations=ai_result.get("citations", [])
                )
                self.db.add(tutor_msg)
                await self.db.commit()
            except Exception:
                pass

        return TutorAnswerResponse(
            conversation_id=conv_id,
            answer=ai_result["answer"],
            concept_title=ai_result.get("concept_title"),
            analogy=ai_result.get("analogy"),
            socratic_inquiry=ai_result.get("socratic_inquiry"),
            micro_action=ai_result.get("micro_action"),
            citations=ai_result.get("citations", []),
            vault_citations=ai_result.get("vault_citations", []),
            is_grounded=ai_result.get("is_grounded", True)
        )

    def get_topic_scaffold(self, topic_id: str, topic_title: Optional[str] = None) -> TopicScaffoldResponse:
        scaffold = VaultBrainRAG.get_scaffold_for_topic(topic_id=topic_id, topic_title=topic_title)
        if not scaffold:
            return TopicScaffoldResponse(
                topic_id=topic_id,
                title="Quantum Superposition",
                folder="02 - Quantum Foundations",
                slug="superposition",
                definition="A fundamental principle of quantum mechanics where a system can exist in a linear combination of states.",
                intuition="Like a compass needle pointing along the equator rather than strictly North or South.",
                common_mistakes="Assuming the state is secretly 0 or 1 before measurement.",
                math_foundation="|psi> = alpha|0> + beta|1>",
                key_equations="|alpha|^2 + |beta|^2 = 1",
                circuit="qc.h(0)",
                vault_citations=["[[Superposition]]"]
            )

        return TopicScaffoldResponse(
            topic_id=topic_id,
            title=scaffold["title"],
            folder=scaffold["folder"],
            slug=scaffold["slug"],
            definition=scaffold["definition"],
            intuition=scaffold["intuition"],
            common_mistakes=scaffold["common_mistakes"],
            math_foundation=scaffold["math_foundation"],
            key_equations=scaffold["key_equations"],
            circuit=scaffold["circuit"],
            vault_citations=[f"[[{scaffold['title']}]]"]
        )
