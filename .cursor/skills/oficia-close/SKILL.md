---
name: oficia-close
description: Closes an approved Oficia APP sprint step by updating PROJECT_STATE.md and suggesting a Conventional Commit. Use when the user attaches this skill or says @oficia-close, oficia-close, or the step/PR is already approved. Does not spec features or re-review code.
disable-model-invocation: true
---

# Oficia Close

Solo si el paso ya está **aprobado** (`@oficia-review` o el usuario lo declara). No re-reviewees. No specs trabajo nuevo.

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/check_state.py
```

Fallback: `py -3`. Usá la salida para editar STATE con precisión.

## STATE

Actualizá `PROJECT_STATE.md`:

1. §1 Now/Next.
2. Constraints vivos (§3) si cambió el mapa (tests, clamp, puertos).
3. Deuda nueva → §5. Ítems **resueltos**: mover a `docs/PROJECT_HISTORY.md` (no dejes `[x]` en STATE).
4. Cierre de sprint: si §5 sigue con ítems, un Sprint de Fixes en el backlog. Prioridad: seguridad > perf que escala mal > tests bloqueantes > cosmética.

No leas HISTORY entero: solo append de lo que cerrás.

## Commit

Terminá con el bloque copy-paste (inglés, Conventional Commits). **Sin** `git add`.

```
git commit -m "type(scope): imperative summary"
```

Si tocaste `PROJECT_STATE.md` (casi siempre), va en el mismo commit sugerido.
