from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import crud
from app.schemas.analytics_schema import (
    EscalationAnalyticsItem,
    EscalationQueueItem,
    InfrastructureStats,
    IntentAnalyticsItem,
    InferenceVolumeItem,
    KnowledgeBaseStats,
)
from app.utils.helpers import get_db


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get(
    "/intents",
    response_model=list[IntentAnalyticsItem],
    status_code=status.HTTP_200_OK,
)
async def intent_analytics(db: Session = Depends(get_db)) -> list[IntentAnalyticsItem]:
    rows = crud.get_intent_distribution(db)
    return [IntentAnalyticsItem(intent=intent, count=count) for intent, count in rows]


@router.get(
    "/escalations",
    response_model=list[EscalationAnalyticsItem],
    status_code=status.HTTP_200_OK,
)
async def escalation_analytics(
    db: Session = Depends(get_db),
) -> list[EscalationAnalyticsItem]:
    rows = crud.get_escalation_distribution(db)
    return [EscalationAnalyticsItem(reason=reason, count=count) for reason, count in rows]


@router.get(
    "/escalation-queue",
    response_model=list[EscalationQueueItem],
    status_code=status.HTTP_200_OK,
)
async def escalation_queue(
    db: Session = Depends(get_db),
    limit: int = 10,
) -> list[EscalationQueueItem]:
    """Get recent escalation queue items with context from prediction logs."""
    rows = crud.get_escalation_queue(db, limit=limit)
    return [
        EscalationQueueItem(
            id=esc_id,
            ticket_id=ticket_id,
            intent=intent,
            confidence=confidence,
            reason=reason,
            team=team,
            created_at=None,
        )
        for esc_id, ticket_id, intent, confidence, reason, team in rows
    ]


@router.get(
    "/inference-volume-7d",
    response_model=list[InferenceVolumeItem],
    status_code=status.HTTP_200_OK,
)
async def inference_volume_7d(db: Session = Depends(get_db)) -> list[InferenceVolumeItem]:
    """Get daily inference counts for past 7 days."""
    rows = crud.get_inference_volume_7d(db)
    return [InferenceVolumeItem(date=date, count=count) for date, count in rows]


@router.get(
    "/infrastructure",
    response_model=InfrastructureStats,
    status_code=status.HTTP_200_OK,
)
async def infrastructure_stats(db: Session = Depends(get_db)) -> InfrastructureStats:
    """Get live infrastructure health metrics."""
    stats = crud.get_infrastructure_stats(db)
    return InfrastructureStats(**stats)


@router.get(
    "/knowledge-base",
    response_model=KnowledgeBaseStats,
    status_code=status.HTTP_200_OK,
)
async def knowledge_base_stats(db: Session = Depends(get_db)) -> KnowledgeBaseStats:
    """Get knowledge base statistics."""
    stats = crud.get_knowledge_base_stats(db)
    return KnowledgeBaseStats(**stats)
