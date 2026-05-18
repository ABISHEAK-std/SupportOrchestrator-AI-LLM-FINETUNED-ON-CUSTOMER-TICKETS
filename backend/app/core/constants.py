from __future__ import annotations

ALLOWED_INTENTS = {
    "billing_inquiry",
    "refund_request",
    "technical_issue",
    "shipping_query",
}

ALLOWED_PRIORITIES = {"low", "medium", "high", "critical"}

INTENT_TO_QUEUE = {
    "billing_inquiry": "finance_team",
    "refund_request": "refunds_team",
    "technical_issue": "technical_support",
    "shipping_query": "logistics_team",
}

INTENT_TO_COLLECTION = {
    "billing_inquiry": "billing_docs",
    "refund_request": "refund_docs",
    "technical_issue": "technical_docs",
    "shipping_query": "shipping_docs",
}
