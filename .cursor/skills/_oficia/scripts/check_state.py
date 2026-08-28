#!/usr/bin/env python3
"""Print a compact snapshot of PROJECT_STATE.md (Now / Next / Open debt)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from repo import repo_root

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def _section(text: str, number: int) -> str:
    pattern = rf"^## {number}\. .*$"
    match = re.search(pattern, text, flags=re.MULTILINE)
    if not match:
        return ""
    start = match.end()
    nxt = re.search(r"^## \d+\. ", text[start:], flags=re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    return text[start:end].strip()


def _clip(text: str, max_len: int = 220) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_len:
        return text
    return text[: max_len - 1].rstrip() + "…"


def _first_bullets(section: str, limit: int = 8) -> list[str]:
    bullets: list[str] = []
    for raw in section.splitlines():
        line = raw.strip()
        if line.startswith("> ") or line.startswith(">"):
            continue
        if line.startswith("- "):
            bullets.append(_clip(line[2:].strip()))
        if len(bullets) >= limit:
            break
    return bullets


def main() -> int:
    root = repo_root()
    state = Path(root / "PROJECT_STATE.md").read_text(encoding="utf-8")
    now = _section(state, 1)
    debt = _section(state, 5)
    now_bullets = _first_bullets(now, limit=4)
    debt_bullets = _first_bullets(debt, limit=20)

    print(f"ROOT={root}")
    print("NOW:")
    for item in now_bullets:
        print(f"  - {item}")
    if not now_bullets:
        print("  - (empty)")
    print(f"OPEN_DEBT_COUNT={len(debt_bullets)}")
    print("OPEN_DEBT:")
    for item in debt_bullets:
        print(f"  - {item}")
    if not debt_bullets:
        print("  - (none)")
    gate = "FIXES_FIRST" if debt_bullets else "FEATURES_OK"
    print(f"GATE={gate}")
    print("HINT: do not dump PROJECT_STATE.md; do not read docs/PROJECT_HISTORY.md unless audit/balance.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
