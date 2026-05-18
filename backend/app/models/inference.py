from __future__ import annotations

import json
from threading import Lock

import torch

from app.core.config import get_settings


class InferenceRuntime:
    def __init__(self) -> None:
        self._lock = Lock()
        self._model = None
        self._tokenizer = None
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._mock_mode = not torch.cuda.is_available()

    @property
    def is_loaded(self) -> bool:
        return self._model is not None or self._mock_mode

    def load_model(self) -> None:
        if self.is_loaded:
            return

        with self._lock:
            if self.is_loaded:
                return

            if self._mock_mode:
                return

            from peft import PeftModel
            from unsloth import FastLanguageModel

            settings = get_settings()
            model, tokenizer = FastLanguageModel.from_pretrained(
                model_name=settings.model_name,
                max_seq_length=2048,
                dtype=None,
                load_in_4bit=torch.cuda.is_available(),
            )
            model = PeftModel.from_pretrained(model, str(settings.model_adapter_path))
            model.eval()

            self._model = model
            self._tokenizer = tokenizer

    def generate(self, prompt: str) -> str:
        if not self.is_loaded:
            raise RuntimeError("Inference model is not loaded")

        if self._mock_mode:
            return self._generate_mock()

        settings = get_settings()
        inputs = self._tokenizer(prompt, return_tensors="pt").to(self._device)

        with torch.inference_mode():
            outputs = self._model.generate(
                **inputs,
                max_new_tokens=settings.model_max_new_tokens,
                temperature=settings.model_temperature,
                top_p=settings.model_top_p,
                do_sample=settings.model_do_sample,
                pad_token_id=self._tokenizer.eos_token_id,
            )

        generated_tokens = outputs[:, inputs["input_ids"].shape[1] :]
        response = self._tokenizer.decode(generated_tokens[0], skip_special_tokens=True)
        return response.strip()

    def _generate_mock(self) -> str:
        """Mock response for CPU testing."""
        return json.dumps(
            {
                "intent": "billing_inquiry",
                "priority": "medium",
                "confidence": 0.85,
            }
        )


inference_runtime = InferenceRuntime()
