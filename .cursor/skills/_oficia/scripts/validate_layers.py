#!/usr/bin/env python3
"""Classify hexagonal layers and flag obvious layer leaks."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

from repo import repo_root

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PREFIXES = (
    ("OficiaApp.Domain.Tests/", "backend-domain-tests"),
    ("OficiaApp.Application.Tests/", "backend-application-tests"),
    ("OficiaApp.Domain/", "backend-domain"),
    ("OficiaApp.Application/Ports/In/", "backend-ports-in"),
    ("OficiaApp.Application/Ports/Out/", "backend-ports-out"),
    ("OficiaApp.Application/UseCases/", "backend-use-cases"),
    ("OficiaApp.Application/DTOs/", "backend-dtos"),
    ("OficiaApp.Application/", "backend-application"),
    ("OficiaApp.Infrastructure/", "backend-infrastructure"),
    ("OficiaApp.Api/", "backend-api"),
    ("OficiaApp.Frontend/domain/", "frontend-domain"),
    ("OficiaApp.Frontend/application/ports/", "frontend-ports"),
    ("OficiaApp.Frontend/application/use-cases/", "frontend-use-cases"),
    ("OficiaApp.Frontend/infrastructure/http/", "frontend-http"),
    ("OficiaApp.Frontend/infrastructure/", "frontend-infrastructure"),
    ("OficiaApp.Frontend/presentation/", "frontend-presentation"),
    ("OficiaApp.Frontend/app/", "frontend-app"),
    ("OficiaApp.Frontend/", "frontend-other"),
)

DOMAIN_FORBIDDEN = re.compile(
    r"Microsoft\.EntityFrameworkCore|Microsoft\.AspNetCore|System\.Net\.Http",
    re.I,
)
FE_DOMAIN_FORBIDDEN = re.compile(r"from ['\"]react|from ['\"]zustand|apiFetch|fetch\(", re.I)
PRESENTATION_FORBIDDEN = re.compile(
    r"apiFetch|from ['\"].*api-client|from ['\"]@?/?.*infrastructure/http/api-client",
    re.I,
)


def git_changed(root: Path) -> list[str]:
    cmds = (
        ["git", "diff", "--name-only", "HEAD"],
        ["git", "diff", "--name-only", "--cached"],
        ["git", "ls-files", "--others", "--exclude-standard"],
    )
    names: set[str] = set()
    for cmd in cmds:
        result = subprocess.run(cmd, cwd=root, capture_output=True, text=True, encoding="utf-8")
        if result.returncode != 0:
            continue
        names.update(line.replace("\\", "/").strip() for line in result.stdout.splitlines() if line.strip())
    return sorted(names)


def classify(rel: str) -> str:
    norm = rel.replace("\\", "/")
    for prefix, layer in PREFIXES:
        if norm.startswith(prefix):
            return layer
    return "unknown"


def content_flags(rel: str, layer: str, text: str) -> list[str]:
    flags: list[str] = []
    if layer == "backend-domain" and DOMAIN_FORBIDDEN.search(text):
        flags.append("domain-io-leak")
    if layer == "frontend-domain" and FE_DOMAIN_FORBIDDEN.search(text):
        flags.append("fe-domain-framework-leak")
    if layer in {"frontend-presentation", "frontend-app"} and PRESENTATION_FORBIDDEN.search(text):
        flags.append("presentation-apifetch")
    if layer == "frontend-presentation" and re.search(r"\bfetch\s*\(", text) and "apiFetch" not in text:
        flags.append("presentation-raw-fetch")
    return flags


def main(argv: list[str]) -> int:
    root = repo_root()
    rels = [a.replace("\\", "/") for a in argv[1:]] or git_changed(root)
    if not rels:
        print("OK no files to classify (working tree clean)")
        return 0

    failed = 0
    for rel in rels:
        if rel.startswith(".cursor/"):
            continue
        layer = classify(rel)
        path = root / rel
        extra: list[str] = []
        if path.is_file() and path.suffix.lower() in {".cs", ".ts", ".tsx"}:
            extra = content_flags(rel, layer, path.read_text(encoding="utf-8", errors="replace"))
        status = "FAIL" if extra or layer == "unknown" else "OK"
        if status == "FAIL":
            failed += 1
        extra_txt = f" flags={','.join(extra)}" if extra else ""
        print(f"{status} {rel} layer={layer}{extra_txt}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
