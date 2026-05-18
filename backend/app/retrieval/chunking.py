from __future__ import annotations


def chunk_text(text: str, chunk_size: int = 600, overlap: int = 80) -> list[str]:
    clean_text = text.strip()
    if not clean_text:
        return []
    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")

    chunks: list[str] = []
    start = 0
    while start < len(clean_text):
        end = min(start + chunk_size, len(clean_text))
        chunks.append(clean_text[start:end])
        if end == len(clean_text):
            break
        start = end - overlap
    return chunks
