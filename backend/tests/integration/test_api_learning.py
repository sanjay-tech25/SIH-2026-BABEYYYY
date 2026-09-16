import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_learning_endpoints(client: AsyncClient):
    # Register and login user
    reg = await client.post("/api/v1/auth/register", json={
        "email": "learner_api@quantum.io",
        "password": "password123",
        "display_name": "API Learner",
        "age_bracket": "STUDENT"
    })
    token = reg.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch courses
    courses_resp = await client.get("/api/v1/courses", headers=headers)
    assert courses_resp.status_code == 200

    # 2. Focus API - Start and Complete Session
    focus_start = await client.post("/api/v1/focus/start", json={"target_duration_seconds": 1500}, headers=headers)
    assert focus_start.status_code == 200
    assert focus_start.json()["data"]["status"] == "IN_FOCUS"

    focus_complete = await client.post("/api/v1/focus/complete", headers=headers)
    assert focus_complete.status_code == 200
    assert focus_complete.json()["data"]["status"] == "BREAK_RECOMMENDED"

    # 3. Focus API - Skip break (Iteration 1 skip allowed)
    focus_skip = await client.post("/api/v1/focus/break-skip", headers=headers)
    assert focus_skip.status_code == 200
    assert focus_skip.json()["data"]["status"] == "BREAK_SKIPPED"

    # 4. Mascot state
    mascot_resp = await client.get("/api/v1/mascot/state", headers=headers)
    assert mascot_resp.status_code == 200
    assert "dialogue" in mascot_resp.json()["data"]

    # 5. AI Tutor Question
    tutor_resp = await client.post("/api/v1/tutor/ask", json={"query": "Explain Hadamard gate"}, headers=headers)
    assert tutor_resp.status_code == 200
    assert "answer" in tutor_resp.json()["data"]

    # 6. Quantum Circuit Execution
    circuit_payload = {
        "shots": 1024,
        "circuit_json": {
            "num_qubits": 2,
            "gates": [
                {"type": "H", "targets": [0]},
                {"type": "CX", "targets": [0, 1]}
            ]
        }
    }
    sim_resp = await client.post("/api/v1/circuits/execute", json=circuit_payload, headers=headers)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()["data"]
    assert "counts" in sim_data
    assert sim_data["xp_earned"] == 60
