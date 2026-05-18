from __future__ import annotations

from typing import Any

from app.core.constants import ALLOWED_INTENTS, ALLOWED_PRIORITIES


def validate_ticket_text(ticket: str, max_characters: int) -> None:
    cleaned = ticket.strip()
    if not cleaned:
        raise ValueError("Ticket text cannot be empty")
    if len(cleaned) > max_characters:
        raise ValueError(f"Ticket exceeds maximum length of {max_characters}")


def validate_classification_payload(payload: dict[str, Any]) -> dict[str, Any]:
    required_keys = {"intent", "priority", "confidence"}
    missing_keys = required_keys - payload.keys()
    if missing_keys:
        raise ValueError(f"Missing required keys: {sorted(missing_keys)}")

    intent = str(payload["intent"]).strip()
    priority = str(payload["priority"]).strip()
    confidence = float(payload["confidence"])

    if intent not in ALLOWED_INTENTS:
        raise ValueError(f"Unsupported intent: {intent}")
    if priority not in ALLOWED_PRIORITIES:
        raise ValueError(f"Unsupported priority: {priority}")
    if confidence < 0.0 or confidence > 1.0:
        raise ValueError("Confidence must be between 0 and 1")

    return {"intent": intent, "priority": priority, "confidence": confidence}
