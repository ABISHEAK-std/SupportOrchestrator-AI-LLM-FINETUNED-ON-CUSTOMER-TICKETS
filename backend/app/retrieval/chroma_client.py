from __future__ import annotations

from threading import Lock

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import get_settings
from app.core.constants import INTENT_TO_COLLECTION


class ChromaStore:
    def __init__(self) -> None:
        self._client: chromadb.PersistentClient | None = None
        self._lock = Lock()

    def _get_client(self) -> chromadb.PersistentClient:
        if self._client is not None:
            return self._client

        with self._lock:
            if self._client is None:
                settings = get_settings()
                self._client = chromadb.PersistentClient(
                    path=str(settings.chroma_persist_path)
                )
        return self._client

    def get_collection_for_intent(self, intent: str) -> Collection:
        if intent not in INTENT_TO_COLLECTION:
            raise ValueError(f"No collection mapping found for intent '{intent}'")
        collection_name = INTENT_TO_COLLECTION[intent]
        client = self._get_client()
        return client.get_or_create_collection(name=collection_name)


chroma_store = ChromaStore()
