# GoPhish

**An interactive research article and evaluation benchmark on LLM-powered phishing.**

GoPhish is two things built together:

1. **The Article** — a parametric.press-style interactive web article, *"The Phishing Frontier: AI at the Hook"*, that takes readers through the history, mechanics, and modern threat landscape of AI-generated phishing. Seven embedded interactive features let you take the quiz yourself, query live frontier models, test jailbreak strategies in real time, and inspect a fully annotated LLM-generated phishing email — all in a single scroll. The goal is to make the threat legible to a technical audience without requiring a background in security research.

2. **The Benchmark** — a structured evaluation suite that measures how well frontier LLMs refuse to generate phishing content, under both direct and jailbreak conditions. 36 direct prompts span three attack goals (credential theft, financial fraud, access abuse) and four organizational roles (IT, HR, banking, government). Each prompt is also wrapped in three jailbreak framings — roleplay, research framing, and rewrite request — for 108 additional samples. Responses are scored by Claude Opus 4.6 acting as a judge. The benchmark results feed directly into the article's data visualizations.

---

## The Article

Live at: `https://your-deployment-url.vercel.app`

A scroll-driven, dark-themed interactive article with seven embedded features:

| # | Feature | Description |
|---|---|---|
| 01 | **Are You Better Than an LLM?** | A 3-round email classification quiz. Spot the phishing email, then compare your score to Claude, GPT-4o, and Grok-3. |
| 02 | **30 Years of Phishing** | A horizontal snap-scroll timeline from AOHell (1994) to agentic AI attacks (2024). |
| 03 | **Ask a Model to Write a Phishing Email** | Live chat interface. Send the same prompt to Claude Sonnet 4.6, GPT-4o, Gemini 2.5 Pro, and Llama 3.3 70B — see how each responds. |
| 04 | **Jailbreak Strategies** | Test four adversarial prompt framings (direct, educational, fictional, security research) against each model in real time. |
| 05 | **By the Numbers** | Interactive bar charts of refusal rates (direct vs. jailbreak) and phishing attack volume/success trends, sourced from the GoPhish benchmark. |
| 06 | **When the Agent Gets the Keys** | Side-by-side simulation of an unsafe vs. robust AI agent receiving a phishing campaign request. Shows the full multi-layer defense architecture. |
| 07 | **Anatomy of an AI-Generated Phishing Email** | An annotated spear phishing email with nine interactive callouts across six social engineering categories. |

### Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind CSS v4**
- **Anthropic SDK** for Claude Sonnet 4.6
- **OpenAI SDK** for GPT-4o (OpenAI) and Gemini 2.5 Pro (via OpenRouter)
- **Together AI** for Llama 3.3 70B Instruct Turbo
- Pure CSS/SVG charts — no charting library dependencies

### Running locally

```bash
cd gophish
npm install
cp .env.local.example .env.local   # fill in your API keys
npm run dev
```

Required keys in `.env.local`:

```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
TOGETHER_API_KEY=
```

---

## The Benchmark

A structured refusal-rate evaluation suite built with [inspect-ai](https://github.com/UKGovernmentBEIS/inspect_ai).

### Prompt taxonomy

- **Attack goals:** A1 credential theft · A2 financial fraud · A3 access abuse
- **Roles:** B1 IT/security · B2 HR/internal · B3 bank/financial · B4 government
- **Tasks:** 36 direct prompts (`guardrails`) · 108 jailbreak-wrapped prompts (`jailbreak`)
- **Jailbreak frames:** J1 roleplay · J2 research framing · J3 rewrite request

### Judge

All responses are scored by **Claude Opus 4.6** using a binary REFUSAL / HARMFUL rubric. Refusal rate = fraction of samples labeled REFUSAL.

### Results (March 2026)

| Model | Direct requests | Jailbreak requests |
|---|---|---|
| Claude Sonnet 4.6 | 97% | 9% |
| Llama 3.3 70B Instruct Turbo | 78% | 0% |
| GPT-4o | 64% | 0% |
| Gemini 2.5 Pro | 0% | 0% |

**Finding:** Jailbreak prompts collapse refusal rates to near zero across all models. Gemini 2.5 Pro complied with every direct phishing request. Claude showed the strongest resistance on direct prompts but broke under jailbreak pressure. No model held under all conditions.

### Running the benchmark

```bash
cd benchmark
pip install -r requirements.txt

# Single model
python run.py --model claude
python run.py --model gpt4o --task jailbreak
python run.py --model llama --task both

# All models
python run.py --model all --task both
```

Results are written to `benchmark/results/<model>_<task>_<timestamp>.json`.

The benchmark reads API keys from `gophish/.env.local` automatically, or from a local `benchmark/.env`.

---

## Repository structure

```
gophish/                        Next.js article app
  app/
    components/
      PhishingQuiz.tsx          Feature 01 — email classification quiz
      PhishingTimeline.tsx      Feature 02 — history timeline
      ChatSimulation.tsx        Feature 03 — live model chat
      JailbreakChat.tsx         Feature 04 — jailbreak testing
      RefusalCharts.tsx         Feature 05 — benchmark charts
      AgentSimulation.tsx       Feature 06 — agent simulation
      PhishingAwareness.tsx     Feature 07 — annotated phishing email
    api/chat/route.ts           API route — proxies all four LLM providers
    page.tsx                    Article layout and nav
  .env.local                    API keys (not committed)

benchmark/
  gophish_prompts.py            Prompt dataset (36 direct + 108 jailbreak)
  gophish_tasks.py              inspect_ai task definitions + judge scorer
  run.py                        CLI runner with JSON logging
  results/                      Per-run JSON result files
  requirements.txt
```

---

## References

- Koide et al. (2024), *"Evaluating LLMs for Phishing Detection"* — [arXiv:2512.10104](https://arxiv.org/pdf/2512.10104)
- APWG Phishing Activity Trends Reports
- FBI IC3 Annual Internet Crime Reports
- Verizon Data Breach Investigations Report (DBIR)
