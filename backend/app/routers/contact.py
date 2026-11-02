import logging
from typing import Optional
# pyrefly: ignore[missing-import]
from fastapi import APIRouter, HTTPException, Request, status
# pyrefly: ignore[missing-import]
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.limiter import limiter
from app.services.email import deliver_contact_message

logger = logging.getLogger("portfolio.routers.contact")

router = APIRouter()


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80, description="Sender name")
    email: EmailStr = Field(..., description="Sender valid email address")
    message: str = Field(..., min_length=10, max_length=2000, description="Message content")
    website: Optional[str] = Field(default="", description="Honeypot field (must remain empty)")

    @field_validator("name", "message", mode="before")
    @classmethod
    def strip_text(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value


class ContactResponse(BaseModel):
    ok: bool = True


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit contact message",
)
@limiter.limit("5/hour")
async def handle_contact(
    request: Request,
    payload: ContactRequest,
) -> ContactResponse:
    # 1. Honeypot check: If 'website' field contains any value, silently return success without sending
    if payload.website and payload.website.strip():
        logger.info(
            "Honeypot triggered, silently ignoring submission",
            extra={"client_ip": request.client.host if request.client else "unknown"},
        )
        return ContactResponse(ok=True)

    # 2. Attempt delivery (Resend HTTP API -> SMTP fallback -> Dev simulation)
    try:
        delivered = await deliver_contact_message(
            name=payload.name,
            email=payload.email,
            message=payload.message,
        )
    except Exception:
        logger.error(
            "Failed delivering contact message",
            extra={"client_ip": request.client.host if request.client else "unknown"},
            exc_info=False,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to deliver message at this time.",
        )

    if not delivered:
        logger.warning(
            "Contact delivery could not be completed",
            extra={"client_ip": request.client.host if request.client else "unknown"},
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to deliver message at this time.",
        )

    return ContactResponse(ok=True)
