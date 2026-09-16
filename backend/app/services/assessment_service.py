from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.mastery_repository import MasteryRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.user_repository import UserRepository
from app.engines.assessment_engine import AssessmentEngine
from app.engines.mastery_engine import MasteryEngine
from app.engines.recommendation_engine import RecommendationEngine
from app.engines.progression_engine import ProgressionEngine
from app.models.assessment_attempt import AssessmentAttempt
from app.models.assessment_response import AssessmentResponse
from app.core.websocket_manager import ws_manager
from app.schemas.assessment import (
    AssessmentDetailRead,
    QuestionRead,
    AnswerOptionRead,
    AssessmentSubmissionRequest,
    AssessmentResultRead,
    QuestionFeedbackRead
)


class AssessmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.assessment_repo = AssessmentRepository(db)
        self.mastery_repo = MasteryRepository(db)
        self.progress_repo = ProgressRepository(db)
        self.user_repo = UserRepository(db)

    async def get_assessment_for_quiz(self, assessment_id: str) -> Optional[AssessmentDetailRead]:
        assessment = await self.assessment_repo.get_with_questions(assessment_id)
        if not assessment:
            return None

        questions_list = []
        for q in assessment.questions:
            options_list = [
                AnswerOptionRead(id=opt.id, option_text=opt.option_text, order_index=opt.order_index)
                for opt in q.options
            ]
            questions_list.append(
                QuestionRead(
                    id=q.id,
                    question_type=q.question_type,
                    prompt=q.prompt,
                    difficulty=q.difficulty,
                    order_index=q.order_index,
                    options=options_list
                )
            )

        return AssessmentDetailRead(
            id=assessment.id,
            title=assessment.title,
            description=assessment.description,
            pass_percentage=assessment.pass_percentage,
            xp_reward=assessment.xp_reward,
            questions=questions_list
        )

    async def submit_assessment_attempt(
        self,
        user_id: str,
        assessment_id: str,
        req: AssessmentSubmissionRequest
    ) -> AssessmentResultRead:
        assessment = await self.assessment_repo.get_with_questions(assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")

        # Prepare questions dict for engine
        questions_payload = []
        for q in assessment.questions:
            questions_payload.append({
                "id": q.id,
                "prompt": q.prompt,
                "concept_id": q.concept_id,
                "options": [
                    {
                        "id": opt.id,
                        "is_correct": opt.is_correct,
                        "distractor_feedback": opt.distractor_feedback,
                        "option_text": opt.option_text
                    }
                    for opt in q.options
                ]
            })

        answers_map = {ans.question_id: ans.selected_option_id for ans in req.answers}
        eval_result = AssessmentEngine.evaluate_attempt(questions_payload, answers_map)

        xp_earned = assessment.xp_reward if eval_result["passed"] else 25

        # Create Attempt Record
        attempt = AssessmentAttempt(
            user_id=user_id,
            assessment_id=assessment_id,
            score_percentage=eval_result["score_percentage"],
            total_questions=eval_result["total_questions"],
            correct_count=eval_result["correct_count"],
            passed=eval_result["passed"],
            xp_earned=xp_earned
        )
        self.db.add(attempt)
        await self.db.flush()

        # Save individual responses
        for fb in eval_result["feedback"]:
            q_id = fb["question_id"]
            selected_opt = answers_map.get(q_id)
            if selected_opt:
                resp = AssessmentResponse(
                    attempt_id=attempt.id,
                    question_id=q_id,
                    selected_option_id=selected_opt,
                    is_correct=fb["is_correct"]
                )
                self.db.add(resp)

        # Update Mastery Engine for each tested concept
        new_mastery_score = 0.5
        mastery_level = "DEVELOPING"
        primary_concept_name = "Quantum Concept"

        for concept_id, breakdown in eval_result.get("concept_breakdown", {}).items():
            prior = await self.mastery_repo.get_user_mastery_by_concept(user_id, concept_id)
            prior_score = prior.mastery_score if prior else 0.20
            is_concept_passed = (breakdown["correct"] / max(1, breakdown["total"])) >= 0.70

            new_score, conf, m_level = MasteryEngine.update_mastery(
                prior_mastery=prior_score,
                is_correct=is_concept_passed
            )
            await self.mastery_repo.upsert_mastery(
                user_id=user_id,
                concept_id=concept_id,
                mastery_score=new_score,
                confidence_score=conf,
                mastery_level=m_level
            )
            new_mastery_score = new_score
            mastery_level = m_level
            if prior and prior.concept:
                primary_concept_name = prior.concept.name

        # Calculate Recommendation
        rec = RecommendationEngine.determine_next_action(
            concept_name=primary_concept_name,
            mastery_score=new_mastery_score
        )

        # Award XP
        await self.progress_repo.add_xp_transaction(
            user_id=user_id,
            amount=xp_earned,
            source_type="QUIZ_PASSED" if eval_result["passed"] else "QUIZ_ATTEMPT",
            description=f"Assessment result: {assessment.title} ({eval_result['score_percentage']}%)"
        )

        # Update User XP & Level
        profile = await self.user_repo.get_profile(user_id)
        if profile:
            old_xp = profile.total_xp
            profile.total_xp += xp_earned
            level_info = ProgressionEngine.check_level_up(old_xp, profile.total_xp)
            if level_info["leveled_up"]:
                profile.current_level = level_info["new_level"]

        await self.db.commit()

        # Send WebSocket Event for Mascot reaction
        event_type = "QUIZ_PASSED" if eval_result["passed"] else "QUIZ_FAILED"
        await ws_manager.send_personal_event(
            user_id=user_id,
            event_type=event_type,
            payload={
                "score": eval_result["score_percentage"],
                "passed": eval_result["passed"],
                "concept_name": primary_concept_name
            }
        )

        feedback_list = [
            QuestionFeedbackRead(
                question_id=f["question_id"],
                is_correct=f["is_correct"],
                selected_option_id=f.get("selected_option_id"),
                correct_option_id=f.get("correct_option_id"),
                feedback_text=f["feedback_text"]
            )
            for f in eval_result["feedback"]
        ]

        return AssessmentResultRead(
            attempt_id=attempt.id,
            score_percentage=eval_result["score_percentage"],
            correct_count=eval_result["correct_count"],
            total_questions=eval_result["total_questions"],
            passed=eval_result["passed"],
            xp_earned=xp_earned,
            new_mastery_score=new_mastery_score,
            mastery_level=mastery_level,
            recommendation=rec,
            feedback=feedback_list
        )
