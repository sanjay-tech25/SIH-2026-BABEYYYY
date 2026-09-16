import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_auth_registration_and_login_flow(client: AsyncClient):
    # 1. Health check
    health_resp = await client.get("/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "healthy"

    # 2. Register new user
    reg_payload = {
        "email": "tester@quantum.io",
        "password": "strongpassword123",
        "display_name": "Quantum Tester",
        "age_bracket": "STUDENT"
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    data = reg_resp.json()["data"]
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["role"] == "LEARNER"

    # 3. Login with credentials
    login_payload = {
        "email": "tester@quantum.io",
        "password": "strongpassword123"
    }
    login_resp = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    token_data = login_resp.json()["data"]
    access_token = token_data["access_token"]
    refresh_token = token_data["refresh_token"]

    # 4. Access /users/me
    headers = {"Authorization": f"Bearer {access_token}"}
    me_resp = await client.get("/api/v1/users/me", headers=headers)
    assert me_resp.status_code == 200
    user_info = me_resp.json()["data"]
    assert user_info["email"] == "tester@quantum.io"
    assert "age_tier_config" in user_info
    assert user_info["age_tier_config"]["theme_mode"] == "balanced"

    # 5. Refresh token
    ref_resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert ref_resp.status_code == 200
    assert "access_token" in ref_resp.json()["data"]
