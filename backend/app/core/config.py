"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field


class Settings(BaseModel):
    app_name: str = Field(default="AI Support Router")
    environment: str = Field(default="development")
    api_prefix: str = Field(default="/api/v1")
    debug: bool = Field(default=False)

    model_name: str = Field(default="unsloth/Llama-3.2-1B-Instruct-bnb-4bit")
    model_adapter_path: Path = Field(
        default=Path("..\\support_router_model_4_final\\support_router_model")
    )
    model_max_new_tokens: int = Field(default=128, ge=32, le=512)
    model_temperature: float = Field(default=0.0, ge=0.0, le=1.0)
    model_top_p: float = Field(default=1.0, ge=0.0, le=1.0)
    model_do_sample: bool = Field(default=False)

    chroma_persist_path: Path = Field(default=Path("chroma_db"))
    knowledge_base_path: Path = Field(default=Path("knowledge_base"))
    retrieval_top_k: int = Field(default=3, ge=1, le=20)

    confidence_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    escalation_confidence_threshold: float = Field(default=0.65, ge=0.0, le=1.0)
    max_ticket_characters: int = Field(default=4000, ge=128)

    database_url: str = Field(default="sqlite:///./support_router.db")

    log_level: str = Field(default="INFO")
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"]
    )

    @classmethod
    def from_env(cls) -> "Settings":
        raw_cors_origins = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        )
        cors_origins = [origin.strip() for origin in raw_cors_origins.split(",") if origin.strip()]

        return cls(
            app_name=os.getenv("APP_NAME", "AI Support Router"),
            environment=os.getenv("ENVIRONMENT", "development"),
            api_prefix=os.getenv("API_PREFIX", "/api/v1"),
            debug=os.getenv("DEBUG", "false").strip().lower() == "true",
            model_name=os.getenv(
                "MODEL_NAME",
                "unsloth/Llama-3.2-1B-Instruct-bnb-4bit",
            ),
            model_adapter_path=Path(
                os.getenv(
                    "MODEL_ADAPTER_PATH",
                    "..\\support_router_model_4_final\\support_router_model",
                )
            ),
            model_max_new_tokens=int(os.getenv("MODEL_MAX_NEW_TOKENS", "128")),
            model_temperature=float(os.getenv("MODEL_TEMPERATURE", "0.0")),
            model_top_p=float(os.getenv("MODEL_TOP_P", "1.0")),
            model_do_sample=os.getenv("MODEL_DO_SAMPLE", "false").strip().lower()
            == "true",
            chroma_persist_path=Path(os.getenv("CHROMA_PATH", "chroma_db")),
            knowledge_base_path=Path(
                os.getenv("KNOWLEDGE_BASE_PATH", "knowledge_base")
            ),
            retrieval_top_k=int(os.getenv("RETRIEVAL_TOP_K", "3")),
            confidence_threshold=float(os.getenv("CONFIDENCE_THRESHOLD", "0.7")),
            escalation_confidence_threshold=float(
                os.getenv("ESCALATION_CONFIDENCE_THRESHOLD", "0.65")
            ),
            max_ticket_characters=int(os.getenv("MAX_TICKET_CHARACTERS", "4000")),
            database_url=os.getenv("DATABASE_URL", "sqlite:///./support_router.db"),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
            cors_origins=cors_origins,
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached settings instance for the process lifetime."""
    return Settings.from_env()
