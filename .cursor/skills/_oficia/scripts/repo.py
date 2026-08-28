"""Locate the Oficia App repo root (PROJECT_STATE.md + OficiaApp.sln)."""

from __future__ import annotations

from pathlib import Path


def repo_root() -> Path:
    here = Path(__file__).resolve()
    for candidate in [here.parent, *here.parents]:
        if (candidate / "PROJECT_STATE.md").is_file() and (candidate / "OficiaApp.sln").is_file():
            return candidate
    cwd = Path.cwd()
    if (cwd / "PROJECT_STATE.md").is_file():
        return cwd
    raise SystemExit("error: PROJECT_STATE.md not found (run from repo root or via this skill's scripts/)")
