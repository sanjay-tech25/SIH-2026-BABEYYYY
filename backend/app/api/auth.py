from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import RegisterRequest, LoginRequest, OAuth2LoginRequest, TokenResponse, RefreshTokenRequest
from app.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.register(req)
    return APIResponse(data=result, message="User registered successfully")


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.login(req)
    return APIResponse(data=result, message="Login successful")


@router.post("/oauth2/callback", response_model=APIResponse[TokenResponse])
async def oauth2_callback(req: OAuth2LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticates or creates a federated SSO account via Google or GitHub."""
    service = AuthService(db)
    result = await service.oauth2_login(req)
    return APIResponse(data=result, message=f"Successfully authenticated via {req.provider}")


@router.post("/refresh", response_model=APIResponse[TokenResponse])
async def refresh_token(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.refresh(req.refresh_token)
    return APIResponse(data=result, message="Token refreshed successfully")
