from __future__ import annotations

from typing import Any

from app.core.logging_config import get_logger
from app.retrieval.chroma_client import chroma_store
from app.retrieval.embedder import embedder
from app.schemas.retrieval_schema import RetrievalResult


logger = get_logger(__name__)


class PolicyRetriever:
    def retrieve(
        self,
        *,
        intent: str,
        query: str,
        top_k: int,
        metadata_filter: dict[str, Any] | None = None,
    ) -> tuple[str, list[RetrievalResult]]:
        try:
            collection = chroma_store.get_collection_for_intent(intent)
            query_embedding = embedder.embed(query)
            response = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=metadata_filter or None,
            )
        except Exception as exc:
            logger.error("retrieval_failure intent=%s error=%s", intent, str(exc))
            raise

        ids = response.get("ids", [[]])[0]
        documents = response.get("documents", [[]])[0]
        distances = response.get("distances", [[]])[0]
        metadatas = response.get("metadatas", [[]])[0]

        results: list[RetrievalResult] = []
        for doc_id, content, distance, metadata in zip(
            ids, documents, distances, metadatas, strict=False
        ):
            score = float(1.0 / (1.0 + float(distance)))
            results.append(
                RetrievalResult(
                    document_id=str(doc_id),
                    content=str(content),
                    score=score,
                    metadata=metadata or {},
                )
            )

        return collection.name, results


policy_retriever = PolicyRetriever()
