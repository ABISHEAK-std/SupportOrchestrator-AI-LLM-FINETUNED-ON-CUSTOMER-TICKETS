from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class IntentAnalyticsItem(BaseModel):
    intent: str
    count: int


class EscalationAnalyticsItem(BaseModel):
    reason: str
    count: int


class EscalationQueueItem(BaseModel):
    id: int
    ticket_id: str
    intent: str
    confidence: float
    reason: str
    team: str
    created_at: datetime = None

    class Config:
        from_attributes = True


class InferenceVolumeItem(BaseModel):
    date: str
    count: int


class InfrastructureStats(BaseModel):
    gpu_utilization: int
    api_latency_ms: int
    chroma_health: str
    cluster_status: str


class KnowledgeBaseStats(BaseModel):
    active_collections: int
    total_embeddings: int
    indexing_status: str
    chunk_success_rate: float
