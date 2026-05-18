from __future__ import annotations

from time import perf_counter

from starlette.concurrency import run_in_threadpool

from app.core.logging_config import get_logger
from app.models.inference import inference_runtime
from app.utils.parser import extract_json_object
from app.utils.validators import validate_classification_payload


logger = get_logger(__name__)


def _build_prompt(ticket_text: str) -> str:
    return f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a support routing decision engine.
Return only valid JSON with keys: intent, priority, confidence.
Valid intents: billing_inquiry, refund_request, technical_issue, shipping_query.
Valid priorities: low, medium, high, critical.
confidence must be a number between 0 and 1.
<|eot_id|><|start_header_id|>user<|end_header_id|>
Classify this support ticket:
{ticket_text}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""


async def classify_ticket(ticket_text: str) -> dict[str, float | str]:
    prompt = _build_prompt(ticket_text)
    start = perf_counter()
    raw_response = await run_in_threadpool(inference_runtime.generate, prompt)
    latency_ms = (perf_counter() - start) * 1000
    logger.info("inference_latency_ms=%.2f", latency_ms)

    payload = extract_json_object(raw_response)
    validated = validate_classification_payload(payload)
    return validated
