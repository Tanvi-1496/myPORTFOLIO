import os
from pathlib import Path
from functools import lru_cache
from typing import List
from dotenv import load_dotenv

# Search for .env in backend/ or root directory
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
ROOT_DIR = BACKEND_DIR.parent

# Load environment variables
if (BACKEND_DIR / ".env").exists():
    load_dotenv(BACKEND_DIR / ".env")
elif (ROOT_DIR / ".env").exists():
    load_dotenv(ROOT_DIR / ".env")
else:
    load_dotenv()


class Settings:
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    _raw_origins: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://tanvijaware.vercel.app"
    )

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self._raw_origins.split(",") if origin.strip()]

    # Resend
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    CONTACT_TO_EMAIL: str = os.getenv("CONTACT_TO_EMAIL", "vibhavari.14092006@gmail.com")
    CONTACT_FROM_EMAIL: str = os.getenv("CONTACT_FROM_EMAIL", "Portfolio Contact <onboarding@resend.dev>")

    # SMTP Fallback
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "")

    # Supabase (Optional)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini").lower()
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")

    # GitHub
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")

    # Knowledge Base Path
    @property
    def KNOWLEDGE_BASE_PATH(self) -> Path:
        backend_kb = BACKEND_DIR / "knowledge.md"
        if backend_kb.exists():
            return backend_kb
        app_kb = CURRENT_DIR / "knowledge.md"
        if app_kb.exists():
            return app_kb
        return backend_kb


@lru_cache()
def get_settings() -> Settings:
    return Settings()
