from __future__ import annotations

from pydantic import BaseModel, Field


class TicketRequest(BaseModel):
    ticket: str = Field(..., min_length=1, max_length=4000)


class ClassificationOutput(BaseModel):
    intent: str
    priority: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class ClassifyTicketResponse(BaseModel):
    classification: ClassificationOutput


class ProcessTicketResponse(BaseModel):
    classification: ClassificationOutput
    queue: str
    escalate: bool
    escalation_reasons: list[str]
    retrieved_policy: list[str]
    response_message: str
