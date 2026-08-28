#!/usr/bin/env python3
"""Mechanical scan for Oficia .cursorrules §5/§6 shortcuts in changed files."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

from repo import repo_root

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

Rule = tuple[str, re.Pattern[str], str]

FAIL_RULES: list[Rule] = [
    ("jwt-in-web-storage", re.compile(r"(localStorage|sessionStorage).{0,80}(token|jwt)", re.I | re.S), "FAIL"),
    ("allow-any-origin", re.compile(r"AllowAnyOrigin\s*\(", re.I), "FAIL"),
    ("token-in-json-body", re.compile(r"(accessToken|access_token|jwt)\s*[:=]", re.I), "WARN"),
    ("dangerously-html", re.compile(r"dangerouslySetInnerHTML", re.I), "FAIL"),
    ("raw-sql-concat", re.compile(r"FromSql(Raw|Interpolated)\s*\(", re.I), "FAIL"),
    ("multipart-write", re.compile(r"multipart/form-data|FromForm", re.I), "WARN"),
]

PRESENTATION_FAIL = re.compile(
    r"\bapiFetch\b|from ['\"].*api-client['\"]|from ['\"][^'\"]*infrastructure/http/api-client",
    re.I,
)
RAW_FETCH = re.compile(r"\bfetch\s*\(")
CREDENTIALS = re.compile(r"credentials\s*:\s*['\"]include['\"]")


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


def scan_file(rel: str, text: str) -> list[tuple[str, str, str]]:
    hits: list[tuple[str, str, str]] = []
    norm = rel.replace("\\", "/")
    for name, pattern, severity in FAIL_RULES:
        if pattern.search(text):
            # AuthCookies / JWT plumbing mentions tokens by design.
            if name == "token-in-json-body" and (
                "AuthCookies" in rel or "JwtToken" in rel or "jwt-bearer" in rel.lower()
            ):
                continue
            hits.append((severity, name, rel))
    if ("/presentation/" in f"/{norm}" or "/app/" in f"/{norm}") and PRESENTATION_FAIL.search(text):
        hits.append(("FAIL", "presentation-apifetch", rel))
    if RAW_FETCH.search(text) and "api-client.ts" not in norm:
        if not CREDENTIALS.search(text):
            hits.append(("FAIL", "fetch-without-credentials", rel))
        elif "/presentation/" in f"/{norm}" or "/app/" in f"/{norm}":
            hits.append(("FAIL", "raw-fetch-outside-api-client", rel))
    return hits


def main(argv: list[str]) -> int:
    root = repo_root()
    rels = [a.replace("\\", "/") for a in argv[1:]] or git_changed(root)
    if not rels:
        print("OK no changed files")
        return 0

    fails = 0
    warns = 0
    scanned = 0
    for rel in rels:
        if rel.startswith(".cursor/"):
            continue
        path = root / rel
        if not path.is_file() or path.suffix.lower() not in {".cs", ".ts", ".tsx", ".js", ".jsx", ".json"}:
            continue
        scanned += 1
        text = path.read_text(encoding="utf-8", errors="replace")
        for severity, name, file_rel in scan_file(rel, text):
            print(f"{severity} {name} {file_rel}")
            if severity == "FAIL":
                fails += 1
            else:
                warns += 1

    print(f"SCANNED={scanned} FAIL={fails} WARN={warns}")
    print("HINT: mechanical only — still apply .cursorrules §5/§6/§7 judgment.")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
