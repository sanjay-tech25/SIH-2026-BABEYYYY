from typing import Any, Optional
from fastapi import HTTPException, status


class DomainException(HTTPException):
    """Base domain exception with consistent error payload formatting."""
    def __init__(
        self,
        status_code: int,
        detail: str,
        code: str = "DOMAIN_ERROR",
        extra: Optional[Any] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": detail, "extra": extra}
        )


class EntityNotFoundException(DomainException):
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_name} with identifier '{entity_id}' was not found.",
            code="ENTITY_NOT_FOUND",
            extra={"entity": entity_name, "id": str(entity_id)}
        )


class UnauthorizedException(DomainException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            code="UNAUTHORIZED"
        )


class ForbiddenException(DomainException):
    def __init__(self, detail: str = "Operation not permitted for current user role"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            code="FORBIDDEN"
        )


class BreakPolicyViolationException(DomainException):
    def __init__(self, detail: str = "A mandatory break is required before starting a new focus cycle."):
        super().__init__(
            status_code=status.HTTP_423_LOCKED,
            detail=detail,
            code="BREAK_REQUIRED"
        )


class InvalidCircuitException(DomainException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
            detail=detail,
            code="INVALID_QUANTUM_CIRCUIT"
        )


class DuplicateEntityException(DomainException):
    def __init__(self, entity_name: str, field_name: str, value: Any):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{entity_name} with {field_name} '{value}' already exists.",
            code="DUPLICATE_ENTITY",
            extra={"entity": entity_name, "field": field_name, "value": str(value)}
        )
