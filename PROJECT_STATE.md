# Oficia App — Project State (living)



> Vision / 3 pillars: see `.cursorrules` §3. Product UX/flows: see `docs/PRODUCT_MAP.md`. Security: `.cursorrules` §5. Performance: §6. Testing: §7. Closed sprints & resolved debt: `docs/PROJECT_HISTORY.md`.



## 1. Now



- **Last closed:** Sprint 18 (read side) — `GET /api/job-requests/my` (Api/Application/Infra, clamp `take` + `IReadOnlyList` consistente en `IJobRequestRepository`) + FE wiring: `jobRequestsApi.getMy/create` (port+adapter), `useMyJobRequests`, `RequestsView` conectado a datos reales (categoría resuelta vía `useCategories`, badge con los 6 status reales del enum, sin `budget`/`proName`/`quotes` — dependen de `JobApplication`, backlog aparte). FE test: `use-my-job-requests.test.tsx` (primer test de hook + TanStack Query del proyecto, patrón: `renderHook` + `QueryClientProvider` wrapper + `vi.mock` del adapter, sin MSW).

- **Next:** Sprint 18 (write side) — formulario de creación detrás del botón "Nueva" en `RequestsView` (`POST /api/job-requests` ya existe en el backend) + `useCreateJobRequest` (mutation) + invalidación de la query `['job-requests', 'mine']` al crear. Incluir FE test de la mutation/formulario.



## 2. Stack map



### Backend (.NET 9 — Hexagonal) — audited OK

- **Domain:** rich entities (`User`, profiles, `Category`, `JobRequest`, `JobContract`, `Review`, `Post`), enums, `BaseEntity.CreatedAt`. No IO. (`JobApplication` planned — see PRODUCT_MAP.)

- **Application:** `Ports/In` | `Ports/Out` | `UseCases/` | DTOs | `AddApplication()`. Login returns identity only (no JWT).

- **Infrastructure:** EF Core + SQL Server, repos, `UnitOfWork`, BCrypt/JWT adapters, `AddInfrastructure(IConfiguration)`.

- **Api:** thin controllers via Ports/In only; JWT cookie issuance is transport adapter concern (`ITokenService` + `AuthCookies` in `UsersController.Login`). Rate limit on login; CORS → `localhost:3000`.

- **Tests:** `OficiaApp.Domain.Tests` (xUnit + FluentAssertions) | `OficiaApp.Application.Tests` (xUnit + FluentAssertions + NSubstitute). Run: `dotnet test OficiaApp.sln`.

- **Audit (this sprint):** No Domain IO; no business logic in controllers beyond HTTP mapping; Infrastructure implements Ports/Out. No structural rewrite needed.



### Frontend (Next.js — Hexagonal)

- **domain/** — types only (`auth`, `posts`, `categories`, `professionals`, `job-requests`). No fetch/React/Zustand.

- **application/ports/out/** — API port interfaces (`AuthApiPort`, `PostsApiPort`, …); **application/use-cases/** — reserved for thin orchestration.

- **infrastructure/http/** — `api-client.ts` (`apiFetch`, `credentials: 'include'`), `api-error.ts`, `*-api.adapter.ts` implementing ports.

- **presentation/** — `components/`, `hooks/`, `stores/` (Zustand profile only, never JWT), `mocks/`, `lib/utils.ts`. Hooks depend on adapters, not `apiFetch` directly.

- **app/** — Next.js App Router (delivery) + TanStack Query (`app/providers.tsx`).

- **Mock vs real:** Feed real (posts adapter + `use-feed`); Requests read-side real (`use-my-job-requests` + `RequestsView`), create form still pending (backlog). Explore + Radar + Profile consume Api. Session: `GET /api/users/me` via `useAuth()`.

- **Tests FE:** Vitest + Testing Library installed (`vitest.config.ts`, `vitest.setup.ts`, `pnpm test`). First test: `presentation/lib/utils.test.ts`. `allowBuilds` for `msw`/`sharp` approved in `pnpm-workspace.yaml`.



## 3. Living constraints



(Not duplicated from `.cursorrules` §5–§7 — those are mandatory there.)



- Packages `Microsoft.AspNetCore.*` / `Microsoft.EntityFrameworkCore.*` pinned to **9.0.14** (`net9.0`).

- JWT issued in Infrastructure (`JwtTokenService`) via Api after successful login; Bearer validated in Api. `JwtSettings` POCO in Application.

- Api pipeline: `UseCors` → `UseRateLimiter` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.

- `IUnitOfWork` owns `SaveChangesAsync`; repos only track changes.

- Domain `CreatedAt` maps to legacy column `FechaCreacion` (no destructive rename).

- `JobRequest.ImageUrls`: EF `PrimitiveCollection` (JSON column). Per-URL length enforced in Domain, not DDL.

- Cookie JWT extraction: `JwtBearerEvents.OnMessageReceived` reads `oficia_access_token` only if no `Authorization` header (Swagger/Postman priority).

- Login: fixed-window rate limit policy `"login"` (per IP). No account lockout entity yet.

- **Perf — list endpoints:** server-side page size clamp is the required pattern for any new list endpoint. Feed (`PostService.GetFeedAsync`): `take` clamped to `[1, 50]` (`DefaultPageSize=10`, `MaxPageSize=50`).

- **Perf — Feed FE:** cursor + `useInfiniteQuery` for long lists (Radar, Requests).

- **DoD — feature:** código en capa hexagonal correcta + tests del comportamiento nuevo (backend xUnit; FE Vitest cuando exista — si no, deuda §5).

- **Tests BE:** `dotnet test OficiaApp.sln` before merge when Domain/Application behavior changes.

- **FE hexagonal:** presentation must not call `apiFetch` directly; use `infrastructure/http/*-api.adapter.ts` implementing `application/ports/out/*`.

- Agent git close-out: suggest `git commit -m "..."` only (Conventional Commits, English). **Do not** include `git add`; developer stages.

- **Agent skills (explicit):** `@oficia-spec` (nuevo slice), `@oficia-review` (gate), `@oficia-close` (STATE + commit). Shared scripts: `python .cursor/skills/_oficia/scripts/check_state.py` (no dump this file). Does not replace `.cursorrules`. Do not attach `@oficia-dev` (removed).



## 4. Backlog



- Sprint 18: Requests (Frontend) — `POST /api/job-requests` + client's own list; wire `RequestsView` (align with PRODUCT_MAP). Include FE tests (Vitest must exist).

- **Radar apply (pro):** request detail + `JobApplication` entity/endpoints; client accept → `JobContract` + `JobRequest.Accept()` (see PRODUCT_MAP).

- **Radar geo:** location fields on `JobRequest` + map/list by distance.

- **Refresh-token rotation** when UX friction after 120 min access TTL grows.

- **`IsVerified`** on `ProfessionalProfile` + Explore DTO (when a verification process exists).

- Wire real `ClientProfile` / `ProfessionalProfile` into `ProfileView` (stats, history, avatar still mock).

- **Social feed interactions (new Domain concept):** `Like`/`Comment` entities + migrations + endpoints + write-path CSRF design (`.cursorrules` §5.3) before `FeedCard` like/comment/share wired. Own feature sprint.

- **Author avatar in feed:** needs Domain field + migration + upload/storage before DTO can carry avatar.

- **Later testing:** Api integration (`WebApplicationFactory` — cookies/JWT/CORS).



## 5. Open debt



> Agent adds open items here without blocking the current sprint. Before the next feature sprint: validate each item still applies, run a Fixes sprint (or end-of-sprint fixes block). Move resolved items to `docs/PROJECT_HISTORY.md` — do not keep `[x]` here. Priority: security > perf that scales badly > test gaps > cosmetic.



- **Perf — `JobRequestRepository.GetOpenAsync` (Radar) sin límite:** devuelve *todas* las `JobRequest` en `Pending` sin `take`/cursor (`OficiaApp.Infrastructure/Persistence/Repositories/JobRequestRepository.cs`). Con 10x de solicitudes esto es un payload sin tope (viola §6.2). No se toca en Sprint 18 (foco: lista propia del cliente, acotada por usuario) — atender cuando se aborde "Radar apply (pro)" en el backlog.

- **Build roto (detectado, no bloquea foco elegido):** `IJobRequestRepository.GetByClientProfileIdAsync(Guid, int, int)` ya está declarado pero `JobRequestRepository` no lo implementa → `dotnet build` falla ahora mismo. Es justo el primer paso del Sprint 18 en curso.

