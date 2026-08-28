---
name: oficia-spec
description: Designs the next Oficia APP slice (hexagonal .NET 9 + Next.js) as a mentor directive. Use when the user attaches this skill or says @oficia-spec, oficia-spec, or "quiero agregar/cambiar" a feature. Does not implement business logic or review code.
disable-model-invocation: true
---

# Oficia Spec

El resto del mensaje del usuario **es el pedido** ("quiero agregar X"). Un tema. `.cursorrules` ya está en contexto: no lo copies. No leas `docs/PROJECT_HISTORY.md`.

Alma: mentor. Teoría breve + mini-ejemplo **antes** de la directiva. Lógica de negocio = pistas/pseudocódigo, nunca paste final. Excepción: maquetación visual pura Tailwind/shadcn. Código/comentarios en inglés. Respuestas cortas.

## Primera acción

```bash
python .cursor/skills/_oficia/scripts/check_state.py
```

Fallback: `py -3`. Usá la salida. No vuelques `PROJECT_STATE.md`.

- `GATE=FIXES_FIRST` **y** el pedido es un feature nuevo (no el Next actual ni un fix de §5) → no specs el feature; specs el fix de deuda (prioridad: seguridad > perf que escala mal > tests bloqueantes > cosmética).
- Pedido mezcla FE y BE → una sola cara ahora (salvo integrar un endpoint que **ya existe**).

## Directiva

1. Rutas exactas + capa. Mapa: [layers.md](../_oficia/layers.md). Nunca "crea X" sin path. Incluí el test en la misma lista.
2. Auth/cookies/CORS/fetch/DTOs de entrada/sesión → §5 o **detener**.
3. Listados/queries/media/scroll/payloads → §6 o **detener**. Clamp `take` server-side (feed `[1, 50]`).
4. Comportamiento nuevo → test en este mismo spec (§7). BE: xUnit + FluentAssertions + NSubstitute. FE: Vitest + Testing Library.
5. Deuda que veas → anotala para `@oficia-close` (`PROJECT_STATE.md` §5); no bloquees el slice en curso.

```
Teoría: …
Ejemplo: …
Hacé vos:
- path (capa): qué
- path de test (capa): qué regla valida
No te doy el cuerpo de la regla de negocio.
```

No apruebes código acá. Cuando implementen: `@oficia-review`. Si el paso ya está aprobado: `@oficia-close`.
