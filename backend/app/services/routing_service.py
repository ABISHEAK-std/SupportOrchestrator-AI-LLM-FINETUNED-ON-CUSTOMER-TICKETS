from __future__ import annotations

from app.core.constants import INTENT_TO_QUEUE


class RoutingService:
    def resolve_queue(self, intent: str) -> str:
        return INTENT_TO_QUEUE.get(intent, "general_support")


routing_service = RoutingService()
