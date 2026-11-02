import logging
import sys
# pyrefly: ignore[missing-import]
from fastapi import FastAPI, Request, Response, status
# pyrefly: ignore[missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore[missing-import]
from fastapi.responses import JSONResponse
# pyrefly: ignore[missing-import]
from slowapi import _rate_limit_exceeded_handler
# pyrefly: ignore[missing-import]
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.limiter import limiter
from app.routers import chat, contact, stats

# Configure structured logging without logging request bodies or sensitive secrets
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("portfolio.main")

settings = get_settings()

app = FastAPI(
    title="Tanvi Portfolio Backend API",
    description="Production-grade API backend supporting contact delivery, AI assistant, and stats aggregation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

# Register slowapi rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
origins = settings.ALLOWED_ORIGINS
logger.info(f"Configuring CORS for origins: {origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Request Size Limit Middleware (Max 100 KB)
MAX_REQUEST_SIZE = 100 * 1024  # 100 KB


@app.middleware("http")
async def limit_request_size_middleware(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_SIZE:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={"detail": "Request payload exceeds allowed limit (100 KB)."},
                )
        except ValueError:
            pass
    return await call_next(request)


# Global Exception Handler to prevent leakage of internal tracebacks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception caught", exc_info=False)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Please try again later."},
    )


# Health Check Endpoint
@app.get("/api/health", summary="Health check endpoint")
async def health_check():
    return {"status": "ok"}


# Mount Routers under /api
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(stats.router, prefix="/api", tags=["Stats"])
