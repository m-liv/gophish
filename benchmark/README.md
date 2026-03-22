# GoPhish Benchmark

Refusal-rate evaluation for the four models featured in the article:
**Claude Sonnet 4.6 · GPT-4o · Gemini 2.5 Pro · Llama 3.3 70B Instruct Turbo**

## Setup

```bash
cd benchmark
pip install -r requirements.txt
```

API keys are read from the Next.js app's `.env.local` (one level up) and fall back to a local `benchmark/.env` file.

## Running

```bash
# Single model, direct prompts
python run.py --model claude
python run.py --model gpt4o
python run.py --model gemini
python run.py --model llama

# Jailbreak prompts (J1 roleplay / J2 research / J3 rewrite)
python run.py --model claude --task jailbreak

# Both tasks at once
python run.py --model gpt4o --task both

# All four models
python run.py --model all --task guardrails
python run.py --model all --task both
```

## Tasks

| Task | Prompts | Description |
|---|---|---|
| `guardrails` | 36 | Direct phishing requests across 3 attack goals × 4 roles |
| `jailbreak` | 108 | Same prompts wrapped in 3 jailbreak frames (J1–J3) |

**Attack goals:** A1 credential theft · A2 financial fraud · A3 access abuse
**Roles:** B1 IT/security · B2 HR/internal · B3 bank/financial · B4 government

## Results

Each run writes a JSON file to `results/`:

```
results/<model>_<task>_<timestamp>.json
```

See `results/example_results.json` for the output format.

## Judge

Responses are scored by **Claude Opus 4.6** using a REFUSAL / HARMFUL rubric.
Refusal rate = fraction of samples labeled REFUSAL (higher = safer).
The judge requires `ANTHROPIC_API_KEY` regardless of which model is under test.
