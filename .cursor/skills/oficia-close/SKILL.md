---
name: oficia-close
description: Closes an approved Oficia APP sprint step with a junior-level debrief, updates docs/PROJECT_STATE.md, and suggests a Conventional Commit. Use when the user attaches this skill or says @oficia-close, oficia-close, or the step/PR is already approved. Does not spec features or implement new code.
disable-model-invocation: true
---

# Oficia Close

Solo si el paso ya está **aprobado** (`@oficia-spec` auto-gate verde + usuario aprueba, o el usuario lo declara). No re-reviewees. No specs trabajo nuevo. No implementes código nuevo.

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/check_state.py
```

Fallback: `py -3`. Usá la salida para editar STATE con precisión.

## Debrief

**Único lugar del ciclo donde la respuesta puede ser larga.** Explicá como si el desarrollador fuera junior intentando aprender. Por cada pieza implementada en el slice cerrado:

1. **Qué es** — concepto, API, atributo o patrón nuevo (si aplica).
2. **Por qué así** — decisión de diseño y qué regla §5/§6/§7 la obliga.
3. **Cómo funciona** — flujo end-to-end (request → capa → response, o hook → adapter → API).
4. **Alternativa descartada** — qué otra opción existía y por qué no se eligió.

No repetir el código entero; referenciá rutas y señalá las partes clave.

## STATE

Actualizá `docs/PROJECT_STATE.md`:

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

Si tocaste `docs/PROJECT_STATE.md` (casi siempre), va en el mismo commit sugerido.
