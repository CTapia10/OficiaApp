# Review gate

Correr `review_scan.py` y `validate_layers.py` primero. Lo mecánico no reemplaza el juicio de mentor.

## 🔴 Bloqueantes (no aprobar)

- §5: JWT fuera de cookie `httpOnly` `oficia_access_token`; token en body/localStorage/sessionStorage/store; `AllowAnyOrigin`; `fetch` ad-hoc sin `credentials: 'include'`; `apiFetch` desde `presentation/` o `app/`; logout que no borra la cookie con las mismas opciones; DTO de entrada sin validación server-side; secretos en FE o repo; `multipart`/`x-www-form-urlencoded` autenticado por cookie **sin** CSRF diseñado en STATE §5.
- §6 material: listado sin clamp/cursor; payload ilimitado; N+1 nuevo; "¿10× datos?" = full scan u O(n²).
- §7: comportamiento nuevo sin test en la capa correcta (salvo visual pura sin lógica).
- Capa: Domain con IO; controller con reglas de negocio; presentation importando `api-client`.

## 🟡 Pedir cambio (se puede mergear después)

- Naming, encapsulamiento, DI, re-renders evitables, waterfalls de fetch, `staleTime` absurdo, índices de filtros nuevos no documentados.

## 🟢 Nit

- Cosmética, comentarios, orden de imports.

## Mentoría en review

No reescribas la lógica de negocio por ellos. Señalá el invariante roto y pedí el arreglo. Visual pura: sí podés mostrar el JSX/Tailwind.

Aprobación = "PR Aprobado" / paso cerrado → el usuario adjunta `@oficia-close` (no ejecutes close acá).
