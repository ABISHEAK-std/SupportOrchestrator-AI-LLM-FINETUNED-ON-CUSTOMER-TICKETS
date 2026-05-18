from __future__ import annotations


def format_policy_lines(policy_chunks: list[str]) -> str:
    if not policy_chunks:
        return "No matching policy snippet was found."
    return "\n".join(f"- {chunk}" for chunk in policy_chunks)
