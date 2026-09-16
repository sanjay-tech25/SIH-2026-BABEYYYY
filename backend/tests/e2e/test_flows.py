import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_e2e_onboarding_and_diagnostic_flow(client: AsyncClient):
    # Step 1: Register User
    reg = await client.post("/api/v1/auth/register", json={
        "email": "e2e_student@quantum.io",
        "password": "password123",
        "display_name": "E2E Student",
        "age_bracket": "STUDENT"
    })
    token = reg.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Set Onboarding Goals & Profile
    profile_resp = await client.post("/api/v1/onboarding/profile", json={
        "age_bracket": "STUDENT",
        "persona": "high_school_student",
        "primary_goal": "learn_quantum_basics",
        "target_daily_minutes": 30,
        "visual_density": "standard",
        "reduced_motion": False
    }, headers=headers)
    assert profile_resp.status_code == 200

    # Step 3: Submit Diagnostic Quiz
    diag_resp = await client.post("/api/v1/onboarding/diagnostic", json={
        "answers": [
            {"question_id": "dummy_q1", "selected_option_id": "opt1"}
        ]
    }, headers=headers)
    assert diag_resp.status_code == 200
    diag_data = diag_resp.json()["data"]
    assert "initial_level" in diag_data
    assert "starting_course_id" in diag_data

    # Step 4: Verify Progress and XP recorded
    prog_resp = await client.get("/api/v1/progress/summary", headers=headers)
    assert prog_resp.status_code == 200
    prog_data = prog_resp.json()["data"]
    assert prog_data["total_xp"] >= 150  # Awarded from diagnostic


@pytest.mark.asyncio
async def test_e2e_focus_mandatory_break_enforcement(client: AsyncClient):
    reg = await client.post("/api/v1/auth/register", json={
        "email": "focus_hero@quantum.io",
        "password": "password123",
        "display_name": "Focus Hero",
        "age_bracket": "ADULT"
    })
    token = reg.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Cycle 1: Start -> Complete -> Skip Break
    await client.post("/api/v1/focus/start", json={"target_duration_seconds": 1500}, headers=headers)
    c1_done = await client.post("/api/v1/focus/complete", headers=headers)
    assert c1_done.json()["data"]["status"] == "BREAK_RECOMMENDED"

    skip_resp = await client.post("/api/v1/focus/break-skip", headers=headers)
    assert skip_resp.json()["data"]["status"] == "BREAK_SKIPPED"

    # Cycle 2 (Consecutive after skipping): Start -> Complete
    await client.post("/api/v1/focus/start", json={"target_duration_seconds": 1500}, headers=headers)
    c2_done = await client.post("/api/v1/focus/complete", headers=headers)
    assert c2_done.json()["data"]["status"] == "BREAK_REQUIRED"
    assert c2_done.json()["data"]["is_mandatory_break"] is True

    # Attempting to start Cycle 3 WITHOUT taking a break must fail with HTTP 423 (Locked)
    blocked_start = await client.post("/api/v1/focus/start", json={"target_duration_seconds": 1500}, headers=headers)
    assert blocked_start.status_code == 423
    assert blocked_start.json()["error"]["code"] == "BREAK_REQUIRED"

    # Complete the mandatory break
    break_done = await client.post("/api/v1/focus/break-done", headers=headers)
    assert break_done.json()["data"]["status"] == "IDLE"

    # Now starting a new focus cycle is permitted
    new_start = await client.post("/api/v1/focus/start", json={"target_duration_seconds": 1500}, headers=headers)
    assert new_start.status_code == 200
    assert new_start.json()["data"]["status"] == "IN_FOCUS"
