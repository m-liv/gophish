#!/usr/bin/env python3
"""
GoPhish benchmark runner.

Usage:
  python run.py --model claude
  python run.py --model gpt4o --task jailbreak
  python run.py --model llama --task both
  python run.py --model all --task guardrails

Supported --model values : claude | gpt4o | gemini | llama | all
Supported --task values  : guardrails | jailbreak | both  (default: guardrails)

Results are written to results/<model>_<task>_<timestamp>.json
"""

import argparse
import json
import os
import sys
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

# Load keys from the Next.js app's .env.local, then a local .env if present.
_repo_root = Path(__file__).parent.parent
load_dotenv(_repo_root / "gophish" / ".env.local", override=False)
load_dotenv(Path(__file__).parent / ".env", override=False)

from inspect_ai import eval as inspect_eval  # noqa: E402 (after dotenv)
from inspect_ai.log import EvalLog  # noqa: E402

from gophish_tasks import gophish_guardrails, gophish_jailbreak  # noqa: E402

# ---------------------------------------------------------------------------
# Model registry
# Article models: Claude Sonnet 4.6 · GPT-4o · Gemini 2.5 Pro · Llama 3.3 70B
# ---------------------------------------------------------------------------
MODELS: dict[str, dict] = {
    "claude": {
        "display": "Claude Sonnet 4.6",
        "model_id": "anthropic/claude-sonnet-4-6",
        # Uses ANTHROPIC_API_KEY natively — no env override needed.
    },
    "gpt4o": {
        "display": "GPT-4o",
        "model_id": "openai/gpt-4o",
        # Uses OPENAI_API_KEY natively.
    },
    "gemini": {
        "display": "Gemini 2.5 Pro",
        # Routed through OpenRouter using the OpenAI-compatible provider.
        "model_id": "openai/google/gemini-2.5-pro-preview-03-25",
        "env_override": {
            "OPENAI_API_KEY": lambda: os.environ.get("OPENROUTER_API_KEY", ""),
            "OPENAI_BASE_URL": lambda: "https://openrouter.ai/api/v1",
        },
    },
    "llama": {
        "display": "Llama 3.3 70B Instruct Turbo",
        # Together AI has a native inspect_ai provider.
        "model_id": "together/meta-llama/Llama-3.3-70B-Instruct-Turbo",
        # Uses TOGETHER_API_KEY natively.
    },
}

RESULTS_DIR = Path(__file__).parent / "results"
RESULTS_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

@contextmanager
def _env_patch(overrides: dict[str, str]):
    """Temporarily patch os.environ entries, restoring originals on exit."""
    saved = {k: os.environ.get(k) for k in overrides}
    os.environ.update(overrides)
    try:
        yield
    finally:
        for k, v in saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v


def _build_breakdown(samples) -> dict:
    by_goal: dict[str, dict] = {}
    by_role: dict[str, dict] = {}
    by_jailbreak: dict[str, dict] = {}

    for s in samples:
        score_obj = (s.scores or {}).get("claude_judge_scorer")
        is_refusal = bool(score_obj and score_obj.value == 1.0)

        goal = (s.metadata or {}).get("goal", "unknown")
        role = (s.metadata or {}).get("role", "unknown")
        jailbreak = (s.metadata or {}).get("jailbreak")

        for bucket, key in [(by_goal, goal), (by_role, role)]:
            bucket.setdefault(key, {"refusals": 0, "total": 0})
            bucket[key]["total"] += 1
            if is_refusal:
                bucket[key]["refusals"] += 1

        if jailbreak:
            by_jailbreak.setdefault(jailbreak, {"refusals": 0, "total": 0})
            by_jailbreak[jailbreak]["total"] += 1
            if is_refusal:
                by_jailbreak[jailbreak]["refusals"] += 1

    def _rates(bucket: dict) -> dict:
        return {
            k: {
                **v,
                "refusal_rate": round(v["refusals"] / v["total"], 3) if v["total"] else 0,
            }
            for k, v in sorted(bucket.items())
        }

    result = {"by_goal": _rates(by_goal), "by_role": _rates(by_role)}
    if by_jailbreak:
        result["by_jailbreak"] = _rates(by_jailbreak)
    return result


def _extract_results(log: EvalLog, model_alias: str, task_name: str) -> dict:
    samples = log.samples or []
    total = len(samples)
    refusals = sum(
        1
        for s in samples
        if (s.scores or {}).get("claude_judge_scorer") and
           (s.scores or {})["claude_judge_scorer"].value == 1.0
    )

    return {
        "run_id": getattr(getattr(log, "eval", None), "run_id", None)
                  or datetime.now(timezone.utc).isoformat(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "model_alias": model_alias,
        "model_id": MODELS[model_alias]["model_id"],
        "display_name": MODELS[model_alias]["display"],
        "task": task_name,
        "total_samples": total,
        "refusals": refusals,
        "harmful": total - refusals,
        "refusal_rate": round(refusals / total, 3) if total else 0,
        "breakdown": _build_breakdown(samples),
    }


def _run_task(model_alias: str, task_fn, task_name: str) -> dict:
    cfg = MODELS[model_alias]
    model_id = cfg["model_id"]

    # Build any env overrides (callables are evaluated lazily so .env is loaded first)
    raw_overrides = cfg.get("env_override", {})
    overrides = {k: (v() if callable(v) else v) for k, v in raw_overrides.items()}

    print(f"\n→ {cfg['display']} / {task_name}  [{model_id}]")

    with _env_patch(overrides):
        logs: list[EvalLog] = inspect_eval(task_fn(), model=model_id)

    log = logs[0]
    result = _extract_results(log, model_alias, task_name)

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
    out_path = RESULTS_DIR / f"{model_alias}_{task_name}_{ts}.json"
    out_path.write_text(json.dumps(result, indent=2))
    print(f"  refusal_rate={result['refusal_rate']:.1%}  ({result['refusals']}/{result['total_samples']})")
    print(f"  saved → {out_path.relative_to(Path(__file__).parent)}")

    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Run GoPhish refusal evaluation.")
    parser.add_argument(
        "--model",
        required=True,
        choices=[*MODELS.keys(), "all"],
        help="Model alias to evaluate, or 'all' to run every model.",
    )
    parser.add_argument(
        "--task",
        default="guardrails",
        choices=["guardrails", "jailbreak", "both"],
        help="Which task to run (default: guardrails).",
    )
    args = parser.parse_args()

    model_aliases = list(MODELS.keys()) if args.model == "all" else [args.model]
    tasks: list[tuple[str, object]] = []
    if args.task in ("guardrails", "both"):
        tasks.append(("guardrails", gophish_guardrails))
    if args.task in ("jailbreak", "both"):
        tasks.append(("jailbreak", gophish_jailbreak))

    all_results = []
    for alias in model_aliases:
        for task_name, task_fn in tasks:
            result = _run_task(alias, task_fn, task_name)
            all_results.append(result)

    if len(all_results) > 1:
        print("\n── Summary ──────────────────────────────────")
        for r in all_results:
            print(f"  {r['display_name']:42s}  {r['task']:12s}  {r['refusal_rate']:.1%}")


if __name__ == "__main__":
    main()
