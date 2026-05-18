from __future__ import annotations

import asyncio
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from app.api.routes.analytics import router as analytics_router
from app.api.routes.health import router as health_router
from app.api.routes.retrieval import router as retrieval_router
from app.api.routes.tickets import router as tickets_router
from app.core.config import get_settings
from app.core.logging_config import configure_logging, get_logger
from app.database.db import init_db
from app.models.inference import inference_runtime


logger = get_logger(__name__)
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(tickets_router, prefix=settings.api_prefix)
app.include_router(retrieval_router, prefix=settings.api_prefix)
app.include_router(analytics_router, prefix=settings.api_prefix)


@app.on_event("startup")
async def startup_event() -> None:
    configure_logging(settings.log_level)
    init_db()
    Path(settings.chroma_persist_path).mkdir(parents=True, exist_ok=True)
    Path(settings.knowledge_base_path).mkdir(parents=True, exist_ok=True)
    await run_in_threadpool(inference_runtime.load_model)
    logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await asyncio.sleep(0)
    logger.info("Application shutdown complete")
