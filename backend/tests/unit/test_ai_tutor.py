import pytest
from app.ai.guardrails import AIGuardrails
from app.ai.tutor_context import TutorContextBuilder
from app.ai.provider import AIProvider


def test_ai_guardrails_domain_check():
    valid, _ = AIGuardrails.check_input("Can you explain how a Hadamard gate creates superposition?")
    assert valid is True

    invalid, reason = AIGuardrails.check_input("Tell me about celebrity gossip and politics")
    assert invalid is False
    assert "dedicated Quantum Learning Assistant" in reason


def test_tutor_context_builder():
    context = TutorContextBuilder.build_context(
        age_bracket="STUDENT",
        current_concept="Superposition",
        mastery_score=0.75,
        recent_mistake="Confused phase with amplitude"
    )
    assert "STUDENT" in context
    assert "Superposition" in context
    assert "Confused phase with amplitude" in context


@pytest.mark.asyncio
async def test_ai_provider_response():
    resp = await AIProvider.generate_tutor_response(
        user_query="What is quantum superposition?",
        learner_context="Age Tier: STUDENT"
    )
    assert "answer" in resp
    assert len(resp["citations"]) > 0
    assert "superposition" in resp["citations"]
    assert "analogy" in resp
    assert "socratic_inquiry" in resp
    assert "micro_action" in resp


def test_ai_provider_diagnostic():
    diag = AIProvider.generate_diagnostic_guidance(
        topic_id="t1-1",
        question_text="What is the probability of measuring state |1>?",
        selected_option="-16/25 because amplitude is negative",
        correct_option="16/25 by Born Rule"
    )
    assert diag["is_grounded"] is True
    assert "Born Rule" in diag["remediation_topic"] or "Principle" in diag["remediation_topic"]
    assert "socratic_inquiry" in diag
