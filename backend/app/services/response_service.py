from __future__ import annotations

from app.models.response_generator import build_customer_response


class ResponseService:
    def create_response_message(
        self,
        *,
        intent: str,
        queue: str,
        escalate: bool,
        policy_chunks: list[str],
    ) -> str:
        return build_customer_response(
            intent=intent,
            queue=queue,
            escalate=escalate,
            policy_chunks=policy_chunks,
        )


response_service = ResponseService()
