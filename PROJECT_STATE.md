# Oficia App — Project State (living)

> Vision / 3 pillars: see `.cursorrules` §3. Product UX/flows: see `docs/PRODUCT_MAP.md`. Security rules: see `.cursorrules` §5. Performance rules: see `.cursorrules` §6. Closed sprints & resolved debt: see `docs/PROJECT_HISTORY.md`.

## 1. Now

- **Last closed:** Sprint Testing (Backend) — xUnit Domain + Application unit tests (`JobRequest`, `UserService`, `PostService` clamp/cursor). Open debt: CI workflow pending.
- **Next:** Sprint 18 — Requests (Frontend): `POST /api/job-requests` + client's own list.

## 2. Stack map

### Backend (.NET 9 — Hexagonal)
- **Domain:** rich entities (`User`, profiles, `Category`, `JobRequest`, `JobContract`, `Review`, `Post`), enums, `BaseEntity.CreatedAt`. No IO. (`JobApplication` planned — see PRODUCT_MAP.)
- **Application:** `Ports/In` | `Ports/Out` | `UseCases/` | DTOs | `AddApplication()`. Login returns identity only (no JWT).
- **Infrastructure:** EF Core + SQL Server, repos, `UnitOfWork`, BCrypt/JWT adapters, `AddInfrastructure(IConfiguration)`.
- **Api:** REST controllers, JWT Bearer + cookie bridge (Api issues JWT after login), rate limiter on login, thin `Program.cs`, CORS `AllowFrontend` → `localhost:3000`.
- **Tests:** `OficiaApp.Domain.Tests` (xUnit + FluentAssertions) | `OficiaApp.Application.Tests` (xUnit + FluentAssertions + NSubstitute). Run: `dotnet test OficiaApp.sln`.

### Frontend (Next.js + TypeScript)
- **UI:** Tailwind, shadcn/ui, Lucide, Mobile-First.
- **State:** Zustand (`lib/auth/auth-store.ts` — profile only, never JWT) + TanStack Query (`app/providers.tsx`).
- **API:** `lib/api/api-client.ts` (`apiFetch`, `credentials: 'include'`, `ApiError`) + domain services + `hooks/use-*.ts`.
- **Mock vs real:** Feed now real (`lib/posts/posts-service.ts` + `hooks/use-feed.ts`, `useInfiniteQuery` cursor pagination), `PostResponseDto` includes author snapshot (`authorUsername`, `authorPrimaryCategory`) — no avatar field yet (Domain has none, see backlog). Requests still mock (`lib/oficia-data.ts`). Explore + Radar + Profile (username/email) consume the Api. Session bootstrap: `GET /api/users/me` via `useAuth()`.

## 3. Living constraints

(Not duplicated from `.cursorrules` §5 Security or §6 Performance — those are mandatory there.)

- Packages `Microsoft.AspNetCore.*` / `Microsoft.EntityFrameworkCore.*` pinned to **9.0.14** (`net9.0`).
- JWT issued in Infrastructure (`JwtTokenService`) via Api after successful login; Bearer validated in Api. `JwtSettings` POCO in Application.
- Api pipeline: `UseCors` → `UseRateLimiter` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- `IUnitOfWork` owns `SaveChangesAsync`; repos only track changes.
- Domain `CreatedAt` maps to legacy column `FechaCreacion` (no destructive rename).
- `JobRequest.ImageUrls`: EF `PrimitiveCollection` (JSON column). Per-URL length enforced in Domain, not DDL.
- Cookie JWT extraction: `JwtBearerEvents.OnMessageReceived` reads `oficia_access_token` only if no `Authorization` header (Swagger/Postman priority).
- Login: fixed-window rate limit policy `"login"` (per IP). No account lockout entity yet.
- **Perf — list endpoints:** server-side page size clamp is the required pattern for any new list endpoint. Feed (`PostService.GetFeedAsync`): `take` clamped server-side to `[1, 50]` (`DefaultPageSize=10`, `MaxPageSize=50`), invalid/zero/negative falls back to default.
- **Perf — Feed FE:** cursor + `useInfiniteQuery` is the pattern for similar long lists (Radar, Requests); do not load unbounded collections into the client.
- **Perf — agent:** features that touch listados/queries/media/payloads must pass `.cursorrules` §7 checklist item 7 (§6 Performance).
- **Tests:** run `dotnet test OficiaApp.sln` before merge when Domain/Application behavior changes. Prefer unit tests against Ports/Out mocks; no DB/HTTP in Domain/Application test projects.
- Agent git close-out: suggest `git commit -m "..."` only (Conventional Commits, English). **Do not** include `git add`; developer stages.

## 4. Backlog

- Sprint 18: Requests (Frontend) — `POST /api/job-requests` + client's own list; `RequestsView` still mock (align with PRODUCT_MAP).
- **Radar apply (pro):** request detail + `JobApplication` entity/endpoints; client accept → `JobContract` + `JobRequest.Accept()` (see PRODUCT_MAP).
- **Radar geo:** location fields on `JobRequest` + map/list by distance.
- **Refresh-token rotation** when UX friction after 120 min access TTL grows.
- **`IsVerified`** on `ProfessionalProfile` + Explore DTO (when a verification process exists).
- Wire real `ClientProfile` / `ProfessionalProfile` into `ProfileView` (stats, history, avatar still mock).
- **Social feed interactions (new Domain concept):** `Like`/`Comment` entities + migrations + endpoints + write-path CSRF design (`.cursorrules` §5.3, since likes/comments are writes) before `FeedCard`'s like/comment/share buttons can be wired to real counters. Sized as its own feature sprint, not a fix (no entities exist today).
- **Author avatar in feed:** no `AvatarUrl` (or equivalent media field) exists on `User`/`ProfessionalProfile` yet — needs Domain field + migration + upload/storage design before `PostResponseDto` can carry a real avatar. `FeedCard` shows a generic icon until then.
- **Later testing:** Api integration (`WebApplicationFactory` — cookies/JWT/CORS), Frontend Vitest (`api-client` / auth).

## 5. Open debt

> Agent adds open items here without blocking the current sprint. Before the next feature sprint: validate each item still applies, run a Fixes sprint (or end-of-sprint fixes block). Move resolved items to `docs/PROJECT_HISTORY.md` — do not keep `[x]` here. Priority: security > perf that scales badly > cosmetic.

- **CI:** `.github/workflows` empty — no automated `dotnet test` on PR/push (cosmetic/process; add workflow when convenient).
