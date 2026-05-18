# AI Support Router Backend

FastAPI backend for deterministic AI-powered support routing.

## Run

1. Install dependencies:
   `pip install -r requirements.txt`
2. Start API:
   `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

## Core endpoints

- `GET /health`
- `POST /api/v1/classify-ticket`
- `POST /api/v1/process-ticket`
- `POST /api/v1/retrieve-policy`
- `GET /api/v1/analytics/intents`
- `GET /api/v1/analytics/escalations`
