from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.retrieval.retriever import policy_retriever
from app.schemas.retrieval_schema import RetrievalRequest, RetrievalResponse
from app.services.logging_service import logging_service
from app.utils.helpers import get_db


router = APIRouter(tags=["retrieval"])


@router.post(
    "/retrieve-policy",
    response_model=RetrievalResponse,
    status_code=status.HTTP_200_OK,
)
async def retrieve_policy(
    payload: RetrievalRequest,
    db: Session = Depends(get_db),
) -> RetrievalResponse:
    try:
        collection_name, results = policy_retriever.retrieve(
            intent=payload.intent,
            query=payload.query,
            top_k=payload.top_k,
            metadata_filter=payload.metadata_filter,
        )
    except Exception as exc:
        logging_service.log_retrieval_failure(
            db,
            intent=payload.intent,
            error_message=str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Retrieval failed",
        ) from exc

    return RetrievalResponse(
        intent=payload.intent,
        collection_name=collection_name,
        results=results,
    )
