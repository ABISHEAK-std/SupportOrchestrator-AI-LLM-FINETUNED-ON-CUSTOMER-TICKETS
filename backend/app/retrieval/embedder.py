from __future__ import annotations

from threading import Lock

from sentence_transformers import SentenceTransformer


class SentenceEmbedder:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        self._model_name = model_name
        self._model: SentenceTransformer | None = None
        self._lock = Lock()

    def _load(self) -> None:
        if self._model is not None:
            return
        with self._lock:
            if self._model is None:
                self._model = SentenceTransformer(self._model_name)

    def embed(self, text: str) -> list[float]:
        self._load()
        vector = self._model.encode(text, normalize_embeddings=True)
        return vector.tolist()


embedder = SentenceEmbedder()
