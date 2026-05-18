from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.logging_config import get_logger
from app.database import crud


logger = get_logger(__name__)


class LoggingService:
    def log_prediction(
        self,
        db: Session,
        *,
        intent: str,
        priority: str,
        confidence: float,
        queue: str,
    ) -> None:
        crud.create_prediction_log(
            db,
            intent=intent,
            priority=priority,
            confidence=confidence,
            queue=queue,
        )

    def log_escalations(self, db: Session, *, intent: str, reasons: list[str]) -> None:
        for reason in reasons:
            logger.warning("escalation_triggered intent=%s reason=%s", intent, reason)
            crud.create_escalation_log(db, reason=reason, intent=intent)

    def log_retrieval_failure(self, db: Session, *, intent: str, error_message: str) -> None:
        logger.error("retrieval_failure_logged intent=%s", intent)
        crud.create_retrieval_failure_log(db, intent=intent, error_message=error_message)


logging_service = LoggingService()
