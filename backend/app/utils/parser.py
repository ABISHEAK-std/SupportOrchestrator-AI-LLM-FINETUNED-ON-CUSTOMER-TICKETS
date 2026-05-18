from __future__ import annotations

import json
import re
from typing import Any


JSON_OBJECT_PATTERN = re.compile(r"\{.*\}", re.DOTALL)


def extract_json_object(raw_text: str) -> dict[str, Any]:
    match = JSON_OBJECT_PATTERN.search(raw_text)
    if not match:
        raise ValueError("No JSON object found in model output")
    return json.loads(match.group(0))
