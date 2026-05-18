from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.classifier import classify_ticket
from app.retrieval.retriever import policy_retriever
from app.schemas.ticket_schema import (
    ClassificationOutput,
    ClassifyTicketResponse,
    ProcessTicketResponse,
    TicketRequest,
)
from app.services.escalation_service import escalation_service
from app.services.logging_service import logging_service
from app.services.response_service import response_service
from app.services.routing_service import routing_service
from app.utils.helpers import get_db
from app.utils.validators import validate_ticket_text


router = APIRouter(tags=["tickets"])


@router.post(
    "/classify-ticket",
    response_model=ClassifyTicketResponse,
    status_code=status.HTTP_200_OK,
)
async def classify_ticket_route(payload: TicketRequest) -> ClassifyTicketResponse:
    settings = get_settings()
    validate_ticket_text(payload.ticket, settings.max_ticket_characters)

    try:
        classification = await classify_ticket(payload.ticket)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ticket classification failed",
        ) from exc

    return ClassifyTicketResponse(
        classification=ClassificationOutput(**classification),
    )


@router.post(
    "/process-ticket",
    response_model=ProcessTicketResponse,
    status_code=status.HTTP_200_OK,
)
async def process_ticket(
    payload: TicketRequest,
    db: Session = Depends(get_db),
) -> ProcessTicketResponse:
    settings = get_settings()
    validate_ticket_text(payload.ticket, settings.max_ticket_characters)

    try:
        classification = await classify_ticket(payload.ticket)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ticket classification failed",
        ) from exc

    intent = str(classification["intent"])
    priority = str(classification["priority"])
    confidence = float(classification["confidence"])

    queue = routing_service.resolve_queue(intent)
    escalate, escalation_reasons = escalation_service.evaluate(
        confidence=confidence,
        priority=priority,
    )

    try:
        _, retrieved_docs = policy_retriever.retrieve(
            intent=intent,
            query=payload.ticket,
            top_k=settings.retrieval_top_k,
        )
    except Exception as exc:
        logging_service.log_retrieval_failure(
            db,
            intent=intent,
            error_message=str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Policy retrieval failed",
        ) from exc

    policy_chunks = [item.content for item in retrieved_docs]
    response_message = response_service.create_response_message(
        intent=intent,
        queue=queue,
        escalate=escalate,
        policy_chunks=policy_chunks,
    )

    logging_service.log_prediction(
        db,
        intent=intent,
        priority=priority,
        confidence=confidence,
        queue=queue,
    )
    if escalate:
        logging_service.log_escalations(db, intent=intent, reasons=escalation_reasons)

    return ProcessTicketResponse(
        classification=ClassificationOutput(
            intent=intent,
            priority=priority,
            confidence=confidence,
        ),
        queue=queue,
        escalate=escalate,
        escalation_reasons=escalation_reasons,
        retrieved_policy=policy_chunks,
        response_message=response_message,
    )
