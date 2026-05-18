from __future__ import annotations

from app.utils.formatter import format_policy_lines


def build_customer_response(
    intent: str,
    queue: str,
    escalate: bool,
    policy_chunks: list[str],
) -> str:
    escalation_note = (
        "Your ticket has been escalated to a senior specialist."
        if escalate
        else "Your ticket is being handled by the assigned team."
    )
    policy_text = format_policy_lines(policy_chunks)
    return (
        f"Issue category: {intent.replace('_', ' ').title()}\n"
        f"Assigned queue: {queue}\n"
        f"{escalation_note}\n"
        f"Relevant policy:\n{policy_text}"
    )
