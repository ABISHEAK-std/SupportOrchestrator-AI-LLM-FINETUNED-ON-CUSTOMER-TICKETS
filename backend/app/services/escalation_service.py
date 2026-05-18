from __future__ import annotations

from app.core.config import get_settings


class EscalationService:
    def evaluate(self, *, confidence: float, priority: str) -> tuple[bool, list[str]]:
        settings = get_settings()
        reasons: list[str] = []

        if confidence < settings.escalation_confidence_threshold:
            reasons.append("low_confidence")
        if priority == "critical":
            reasons.append("critical_priority")

        return (len(reasons) > 0), reasons


escalation_service = EscalationService()
