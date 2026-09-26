from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    display_name: str = Field(..., min_length=2, max_length=100)
    age_bracket: str = Field(default="STUDENT")  # YOUNG, STUDENT, ADULT
    role: str = Field(default="LEARNER")  # LEARNER, INSTRUCTOR, ADMIN


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OAuth2LoginRequest(BaseModel):
    provider: str = Field(..., description="google, github, or institutional_sso")
    provider_token: str
    email: EmailStr
    display_name: Optional[str] = "Quantum Learner"
    role: Optional[str] = "LEARNER"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    is_onboarded: bool


class RefreshTokenRequest(BaseModel):
    refresh_token: str
