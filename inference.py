import unsloth  
from unsloth import FastLanguageModel
from peft import PeftModel
import torch
import json

base_model = "unsloth/Llama-3.2-1B-Instruct-bnb-4bit"

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=base_model,
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=True,
)

model = PeftModel.from_pretrained(
    model,
    "./support_router_model"
)

model.eval()


def classify_ticket(ticket_text):

    prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a customer support routing AI.
Return ONLY valid JSON.

<|eot_id|><|start_header_id|>user<|end_header_id|>

Classify this support ticket:

{ticket_text}

<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    outputs = model.generate(
        **inputs,
        max_new_tokens=80,
        temperature=0.1,
        do_sample=False,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )

    return response


if __name__ == "__main__":

    ticket = "My payment failed twice and I need refund urgently"

    result = classify_ticket(ticket)

    print(result)