---
name: oficia-review
description: Manual gate / auto-review for Oficia APP code against hexagonal layers, security, performance, and tests. Use when the user attaches this skill or says @oficia-review, oficia-review, or asks to review/approve a PR or pasted code. Optional step — not required in the 2-step flow. Does not spec new features, explain theory, or close the sprint.
disable-model-invocation: true
---

# Oficia Review

Gate manual / auto-review. `.cursorrules` §5–§7 ya están en contexto: no los copies. No leas `docs/PROJECT_HISTORY.md`. No specs features nuevos (eso es `@oficia-spec`). No actualices STATE ni armes el commit (eso es `@oficia-close`). **No des teoría** — la explicación detallada va en `@oficia-close`.

**Flujo normal (2 pasos):** `@oficia-spec` ya corre auto-gate antes de pedir aprobación. Usá este skill solo si el usuario pide review explícita o hay dudas antes de aprobar.

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/review_scan.py
python .cursor/skills/_oficia/scripts/validate_layers.py
```

Fallback: `py -3`. Sin args = diff git (unstaged + staged + untracked). Si pegaron archivos, pasalos como args. Capas: [layers.md](../_oficia/layers.md). Gate: [review.md](../_oficia/review.md).

## Veredicto

- 🔴 §5, §6 material o §7 → **no apruebes**.
- Preguntá "¿qué pasa con 10× datos?".
- Si el código lo escribió el agente y hay 🔴 → **corregilo en el mismo turno** y re-corré los scripts. No delegues el arreglo al usuario.
- Visual pura: JSX/Tailwind completo OK.

Formato: 🔴 debe corregir / 🟡 mejorar / 🟢 ok o nit. Sin teoría ni debrief.

Si está limpio: "PR Aprobado" (o paso cerrado) y pedí `@oficia-close`. No ejecutes close en este turno.
