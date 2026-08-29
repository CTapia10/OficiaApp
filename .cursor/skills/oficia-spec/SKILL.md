---
name: oficia-spec
description: Designs and implements the next Oficia APP slice (hexagonal .NET 9 + Next.js). Use when the user attaches this skill or says @oficia-spec, oficia-spec, or "quiero agregar/cambiar" a feature. Does not explain theory or close the sprint.
disable-model-invocation: true
---

# Oficia Spec

El resto del mensaje del usuario **es el pedido** ("quiero agregar X"). Un tema. `.cursorrules` ya está en contexto: no lo copies. No leas `docs/PROJECT_HISTORY.md`.

Alma: implementador. Cero teoría, cero mini-ejemplos, cero justificaciones durante spec/dev. Código/comentarios en inglés. Respuestas cortas.

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/check_state.py
```

Fallback: `py -3`. Usá la salida. No vuelques `docs/PROJECT_STATE.md`.

- `GATE=FIXES_FIRST` **y** el pedido es un feature nuevo (no el Next actual ni un fix de §5) → no specs el feature; implementá el fix de deuda (prioridad: seguridad > perf que escala mal > tests bloqueantes > cosmética).
- Pedido mezcla FE y BE → una sola cara ahora (salvo integrar un endpoint que **ya existe**).

## Implementación

1. Rutas exactas + capa. Mapa: [layers.md](../_oficia/layers.md). Nunca "crea X" sin path. Incluí el test en la misma lista.
2. Auth/cookies/CORS/fetch/DTOs de entrada/sesión → §5 o **detener**.
3. Listados/queries/media/scroll/payloads → §6 o **detener**. Clamp `take` server-side (feed `[1, 50]`).
4. Comportamiento nuevo → test en este mismo slice (§7). BE: xUnit + FluentAssertions + NSubstitute. FE: Vitest + Testing Library.
5. Deuda que veas → anotala para `@oficia-close` (`docs/PROJECT_STATE.md` §5); no bloquees el slice en curso.
6. **Escribí el código completo** de todos los archivos listados (Domain/Application/Infrastructure/Api/FE + tests).

## Auto-gate (antes de pedir aprobación)

```bash
dotnet test OficiaApp.sln
pnpm test
python .cursor/skills/_oficia/scripts/review_scan.py
python .cursor/skills/_oficia/scripts/validate_layers.py
```

Si hay FAIL o tests rojos → corregí en el mismo turno. No pidas aprobación hasta que esté verde.

## Formato de salida

```
Plan:
- path (capa): qué
- path de test (capa): qué regla valida

[implementación real de todos los archivos]

Verificación: dotnet test / pnpm test + review_scan + validate_layers → verde
Listo para aprobar. Al aprobar: @oficia-close
```

No expliques decisiones acá. No apruebes el paso acá. La teoría va en `@oficia-close`.
