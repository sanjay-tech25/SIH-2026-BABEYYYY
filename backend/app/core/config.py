from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "SIH Adaptive Learning & Quantum Platform"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Security & JWT
    SECRET_KEY: str = "supersecretdevelopmentkeypleasereplaceinproduction"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sih_adaptive.db"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:8000"
    ]

    # Quantum Simulation Settings
    QUANTUM_MAX_QUBITS: int = 10
    QUANTUM_MAX_DEPTH: int = 100
    QUANTUM_DEFAULT_SHOTS: int = 1024

    # AI Tutor
    AI_PROVIDER: str = "mock"  # "mock", "gemini", "openai"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # QUBOT Struggle Detection & Behavioral Configuration (Sections 7, 9, 34)
    QUBOT_STRUGGLE_WEIGHTS: dict = {
        "error_weight": 0.25,
        "time_weight": 0.15,
        "repetition_weight": 0.15,
        "hint_weight": 0.10,
        "concept_failure_weight": 0.20,
        "backtracking_weight": 0.05,
        "accuracy_drop_weight": 0.10,
    }
    QUBOT_STRUGGLE_THRESHOLDS: dict = {
        "mild": 0.30,
        "moderate": 0.50,
        "high": 0.70,
        "critical": 0.85,
    }
    QUBOT_POMODORO_SETTINGS: dict = {
        "focus_duration_seconds": 1500,
        "break_duration_seconds": 300,
        "max_skippable_breaks": 1,
        "mandatory_break_after_iteration": 2,
    }
    QUBOT_DEFAULT_COOLDOWN_SECONDS: int = 30


settings = Settings()

