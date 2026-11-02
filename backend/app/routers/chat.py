import logging
from typing import Any, Dict, List
# pyrefly: ignore[missing-import]
from fastapi import APIRouter, Request, status
# pyrefly: ignore[missing-import]
from pydantic import BaseModel, Field, field_validator

from app.limiter import limiter
from app.services.llm import FALLBACK_ANSWER, generate_chat_response

logger = logging.getLogger("portfolio.routers.chat")

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="User query")
    history: List[Dict[str, Any]] = Field(default_factory=list, description="Recent conversation turns")

    @field_validator("message", mode="before")
    @classmethod
    def clean_message(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value


class ChatResponse(BaseModel):
    answer: str
    showContactLink: bool


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Portfolio AI chatbot query",
)
@limiter.limit("20/minute")
async def handle_chat(
    request: Request,
    payload: ChatRequest,
) -> ChatResponse:
    # Retain only the last 6 history turns for context efficiency
    trimmed_history: List[Dict[str, str]] = []
    for turn in payload.history[-6:]:
        role = turn.get("role") or turn.get("from") or "user"
        content = turn.get("content") or turn.get("text") or ""
        if isinstance(content, str) and content.strip():
            trimmed_history.append({"role": str(role), "content": str(content)[:500]})

    try:
        answer, show_link = await generate_chat_response(
            message=payload.message,
            history=trimmed_history,
        )
        return ChatResponse(answer=answer, showContactLink=show_link)
    except Exception:
        logger.error(
            "Unexpected error during chat processing",
            extra={"client_ip": request.client.host if request.client else "unknown"},
            exc_info=False,
        )
        # Always return graceful fallback answer with HTTP 200
        return ChatResponse(answer=FALLBACK_ANSWER, showContactLink=True)
