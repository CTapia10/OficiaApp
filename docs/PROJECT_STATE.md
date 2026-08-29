# Oficia App — Project State (living)



> Vision / 3 pillars: see `.cursorrules` §3. Product UX/flows: see `docs/PRODUCT_MAP.md`. Security: `.cursorrules` §5. Performance: §6. Testing: §7. Closed sprints & resolved debt: `docs/PROJECT_HISTORY.md`.



## 1. Now



- **Last closed:** Sprint 27 — Radar apply: `JobApplication` (Domain + endpoints apply/list/accept → `JobContract` + `JobRequest.Accept()`), FE cotización en Radar + postulaciones/aceptar en Requests. Living docs moved to `docs/` (`PROJECT_STATE`, `PRODUCT_MAP`, `PROJECT_HISTORY`). Tests: 26 Domain + 32 Application; 17 Vitest.

- **Next:** Fixes — DataAnnotations on `CreateJobRequestDto` / `CreatePostDto` (§5.4). Then profile read-side (`GET` perfiles + stats reales).



## 2. Stack map



### Backend (.NET 9 — Hexagonal) — audited OK

- **Domain:** rich entities (`User`, profiles, `Category`, `JobRequest`, `JobApplication`, `JobContract`, `Review`, `Post`), enums, `BaseEntity.CreatedAt`. No IO.

- **Application:** `Ports/In` | `Ports/Out` | `UseCases/` | DTOs | `AddApplication()`. Login returns identity only (no JWT).

- **Infrastructure:** EF Core + SQL Server, repos, `UnitOfWork`, BCrypt/JWT adapters, `AddInfrastructure(IConfiguration)`.

- **Api:** thin controllers via Ports/In only; JWT cookie issuance is transport adapter concern (`ITokenService` + `AuthCookies` in `UsersController.Login`). Rate limit on login; CORS → `localhost:3000`.

- **Tests:** `OficiaApp.Domain.Tests` (xUnit + FluentAssertions) | `OficiaApp.Application.Tests` (xUnit + FluentAssertions + NSubstitute). Run: `dotnet test OficiaApp.sln`.

- **Audit (this sprint):** No Domain IO; no business logic in controllers beyond HTTP mapping; Infrastructure implements Ports/Out. No structural rewrite needed.



### Frontend (Next.js — Hexagonal)

- **domain/** — types only (`auth`, `posts`, `categories`, `professionals`, `job-requests`, `job-applications`, `profiles`). No fetch/React/Zustand.

- **application/ports/out/** — API port interfaces (`AuthApiPort`, `PostsApiPort`, `JobRequestsApiPort`, `JobApplicationsApiPort`, `ClientProfileApiPort`, `ProfessionalProfileApiPort`, …); **application/use-cases/** — reserved for thin orchestration.

- **infrastructure/http/** — `api-client.ts` (`apiFetch`, `credentials: 'include'`), `api-error.ts`, `*-api.adapter.ts` implementing ports.

- **presentation/** — `components/`, `hooks/`, `context/` (`app-navigation`), `stores/` (Zustand profile only, never JWT), `mocks/`, `lib/utils.ts`. Hooks depend on adapters, not `apiFetch` directly.

- **app/** — Next.js App Router (delivery) + TanStack Query (`app/providers.tsx`).

- **Mock vs real:** Feed, Explore, Radar (list + apply), Requests (read + create + list/accept applications), Auth, Profile onboarding (POST), Create post — API real. Profile stats/historial/avatar still mock until `GET` perfiles. Social feed actions UI disabled (pending Domain sprint).

- **Tests FE:** Vitest + Testing Library (`vitest.config.ts`, `vitest.setup.ts`, `pnpm test`). Hook tests: `use-my-job-requests`, `use-open-job-requests`, `use-create-job-request`, `use-create-post`, `use-create-client-profile`, `use-create-professional-profile`, `use-create-job-application`, `use-job-applications`, `use-accept-job-application`. `allowBuilds` for `msw`/`sharp` approved in `pnpm-workspace.yaml`.



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

- Living docs live under `docs/` (`PROJECT_STATE.md`, `PRODUCT_MAP.md`, `PROJECT_HISTORY.md`). Skill scripts locate the repo via `OficiaApp.sln` + `docs/PROJECT_STATE.md`.

- **Perf — list endpoints:** server-side page size clamp is the required pattern for any new list endpoint. Feed (`PostService.GetFeedAsync`), JobRequest lists (`GetOpenAsync`, `GetByUserIdAsync`), and JobApplication list (`GetByJobRequestIdAsync` via `ClampPage`): `take` clamped to `[1, 50]` (`DefaultPageSize=10`, `MaxPageSize=50`); `skip < 0` floors to `0`.

- **JobApplication uniqueness:** one application per `(JobRequestId, ProfessionalProfileId)`; one `JobContract` per `JobRequestId` (unique indexes).

- **Perf — Feed FE:** cursor + `useInfiniteQuery` for long lists (Radar, Requests).

- **DoD — feature:** código en capa hexagonal correcta + tests del comportamiento nuevo (backend xUnit; FE Vitest cuando exista — si no, deuda §5).

- **Tests BE:** `dotnet test OficiaApp.sln` before merge when Domain/Application behavior changes.

- **FE hexagonal:** presentation must not call `apiFetch` directly; use `infrastructure/http/*-api.adapter.ts` implementing `application/ports/out/*`.

- **Agent workflow (2 steps):** `@oficia-spec` (plan + implementation + auto-gate: `dotnet test` / `pnpm test` + `review_scan.py` + `validate_layers.py`) → user approves → `@oficia-close` (junior debrief + STATE + commit). `@oficia-review` is optional (manual gate).
- **Agent implements the code;** teaching deferred to `@oficia-close` debrief. During spec/dev: no theory, no pseudocode — only plan, paths, and code.
- Agent git close-out: suggest `git commit -m "..."` only (Conventional Commits, English). **Do not** include `git add`; developer stages.



## 4. Backlog



- **Fixes (antes del próximo feature):** DataAnnotations on `CreateJobRequestDto` / `CreatePostDto` (input DTOs without server-side validation — §5.4). Remaining §5 items are blocked on other backlog features, not independent fixes.

- **Radar geo:** location fields on `JobRequest` + map/list by distance.

- **Refresh-token rotation** when UX friction after 120 min access TTL grows.

- **`IsVerified`** on `ProfessionalProfile` + Explore DTO (when a verification process exists).

- **Profile read-side:** `GET /api/client-profile`, `GET /api/professional-profile`, stats agregadas; wire `ProfileView` stats/historial/avatar reales.

- **Profile PATCH:** editar perfil desde UI.

- **Social feed interactions (new Domain concept):** `Like`/`Comment` entities + migrations + endpoints + write-path CSRF design (`.cursorrules` §5.3) before `FeedCard` like/comment/share wired.

- **Author avatar in feed:** needs Domain field + migration + upload/storage before DTO can carry avatar.

- **Explore server-side text search:** `q` query param on `GET /api/professional-profile/search` (today client-side filter only).

- **Notifications:** campana + backend.

- **Routing URL** (`/explorar`, `/perfil`) — optional UX polish.

- **Later testing:** Api integration (`WebApplicationFactory` — cookies/JWT/CORS).



## 5. Open debt



> Agent adds open items here without blocking the current sprint. Before the next feature sprint: validate each item still applies, run a Fixes sprint (or end-of-sprint fixes block). Move resolved items to `docs/PROJECT_HISTORY.md` — do not keep `[x]` here. Priority: security > perf that scales badly > test gaps > cosmetic.

- **Profile mode vs Api:** `ModeSwitch` / `isPro` persisted in `localStorage` until `GET /api/users/me` exposes profile flags (client/professional).

- **Profile stats/historial/avatar:** still mock in `ProfileView` — blocked on profile `GET` endpoints (see backlog).

- **Explore text search:** client-side only; server-side `q` not implemented (see backlog).

- **Social feed:** like/comment/share/share UI disabled with tooltip — blocked on Domain sprint + CSRF design.

- **Edit profile:** button disabled — blocked on `PATCH` profile endpoints.

- **Notifications:** toast "próximamente" only — no backend.

- **Input DTO validation gap:** `CreateJobRequestDto` and `CreatePostDto` have no DataAnnotations (pre-existing). `CreateJobApplicationDto` in this sprint does (`[Required]` + `[Range]`).
