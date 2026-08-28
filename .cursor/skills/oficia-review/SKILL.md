---
name: oficia-review
description: Reviews Oficia APP code against hexagonal layers, security, performance, and tests. Use when the user attaches this skill or says @oficia-review, oficia-review, or asks to review/approve a PR or pasted code. Does not spec new features or close the sprint.
disable-model-invocation: true
---

# Oficia Review

Code review implacable. `.cursorrules` §5–§7 ya están en contexto: no los copies. No leas `docs/PROJECT_HISTORY.md`. No specs features nuevos (eso es `@oficia-spec`). No actualices STATE ni armes el commit (eso es `@oficia-close`).

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/review_scan.py
python .cursor/skills/_oficia/scripts/validate_layers.py
```

Fallback: `py -3`. Sin args = diff git (unstaged + staged + untracked). Si pegaron archivos, pasalos como args. Capas: [layers.md](../_oficia/layers.md). Gate: [review.md](../_oficia/review.md).

## Veredicto

- 🔴 §5, §6 material o §7 → **no apruebes**.
- Preguntá "¿qué pasa con 10× datos?".
- No reescribas la lógica de negocio; señalá el invariante y pedí el arreglo. Visual pura: JSX/Tailwind completo OK.

Formato: 🔴 debe corregir / 🟡 mejorar / 🟢 ok o nit.

Si está limpio: "PR Aprobado" (o paso cerrado) y pedí `@oficia-close`. No ejecutes close en este turno.
