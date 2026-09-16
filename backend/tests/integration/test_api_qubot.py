import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_qubot_api_endpoints(client: AsyncClient):
    # 1. Register and get token
    reg_payload = {
        "email": "qubot_learner@quantum.io",
        "password": "qubotpassword123",
        "display_name": "Qubot Learner",
        "age_bracket": "YOUNG"
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    token = reg_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. GET /api/v1/qubot/state
    state_resp = await client.get("/api/v1/qubot/state", headers=headers)
    assert state_resp.status_code == 200
    state_data = state_resp.json()["data"]
    assert "qubot" in state_data
    assert "message" in state_data
    assert "intervention" in state_data
    assert "session" in state_data
    assert "meta" in state_data
    assert state_data["qubot"]["state"] is not None

    # 3. POST /api/v1/qubot/events (Simulate rapid guessing)
    event_payload = {
        "event_type": "ANSWER_WRONG",
        "payload": {
            "concept_name": "Hadamard Gate",
            "time_on_current_task_seconds": 2,
            "recent_errors": 2,
            "attempts_on_current_question": 2,
            "is_rapid_response": True,
            "is_wrong_answer": True
        }
    }
    event_resp = await client.post("/api/v1/qubot/events", json=event_payload, headers=headers)
    assert event_resp.status_code == 200
    event_data = event_resp.json()["data"]
    assert event_data["message"]["visible"] is True
    assert event_data["qubot"]["animation"] in ["think", "gentle_encourage", "concerned"]

    # 4. POST /api/v1/qubot/interactions
    interaction_payload = {
        "interaction": "REQUEST_HINT",
        "context": {"concept_name": "Phase Gate"}
    }
    interact_resp = await client.post("/api/v1/qubot/interactions", json=interaction_payload, headers=headers)
    assert interact_resp.status_code == 200
    assert "qubot" in interact_resp.json()["data"]

    # 5. GET /api/v1/qubot/session
    session_resp = await client.get("/api/v1/qubot/session", headers=headers)
    assert session_resp.status_code == 200
    assert session_resp.json()["data"]["pomodoro_state"] in ["IDLE", "FOCUS_ACTIVE"]
