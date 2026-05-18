from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class RetrievalRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=4000)
    intent: str
    top_k: int = Field(default=3, ge=1, le=20)
    metadata_filter: dict[str, Any] | None = None


class RetrievalResult(BaseModel):
    document_id: str
    content: str
    score: float
    metadata: dict[str, Any]


class RetrievalResponse(BaseModel):
    intent: str
    collection_name: str
    results: list[RetrievalResult]
