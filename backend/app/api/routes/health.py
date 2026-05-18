from __future__ import annotations

from fastapi import APIRouter

from app.models.inference import inference_runtime


router = APIRouter(tags=["health"])


@router.get("/health", status_code=200)
async def health() -> dict[str, str | bool]:
    return {"status": "ok", "model_loaded": inference_runtime.is_loaded}
