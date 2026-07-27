# Oficia App — Project State (living)

> Vision / 3 pillars: see `.cursorrules` §3. Product UX/flows: see `docs/PRODUCT_MAP.md`. Security rules: see `.cursorrules` §5. Performance rules: see `.cursorrules` §6. Closed sprints & resolved debt: see `docs/PROJECT_HISTORY.md`.

## 1. Now

- **Last closed:** Sprint 17 — Feed (Frontend) wired to `GET /api/posts/feed` with cursor infinite scroll.
- **Next:** Sprint 18 — Requests (Frontend): `POST /api/job-requests` + client's own list.

## 2. Stack map

### Backend (.NET 9 — Hexagonal)
- **Domain:** rich entities (`User`, profiles, `Category`, `JobRequest`, `JobContract`, `Review`, `Post`), enums, `BaseEntity.CreatedAt`. No IO. (`JobApplication` planned — see PRODUCT_MAP.)
- **Application:** `Ports/In` | `Ports/Out` | `UseCases/` | DTOs | `AddApplication()`. Login returns identity only (no JWT).
- **Infrastructure:** EF Core + SQL Server, repos, `UnitOfWork`, BCrypt/JWT adapters, `AddInfrastructure(IConfiguration)`.
- **Api:** REST controllers, JWT Bearer + cookie bridge (Api issues JWT after login), rate limiter on login, thin `Program.cs`, CORS `AllowFrontend` → `localhost:3000`.

### Frontend (Next.js + TypeScript)
- **UI:** Tailwind, shadcn/ui, Lucide, Mobile-First.
- **State:** Zustand (`lib/auth/auth-store.ts` — profile only, never JWT) + TanStack Query (`app/providers.tsx`).
- **API:** `lib/api/api-client.ts` (`apiFetch`, `credentials: 'include'`, `ApiError`) + domain services + `hooks/use-*.ts`.
- **Mock vs real:** Feed now real (`lib/posts/posts-service.ts` + `hooks/use-feed.ts`, `useInfiniteQuery` cursor pagination). Requests still mock (`lib/oficia-data.ts`). Explore + Radar + Profile (username/email) consume the Api. Session bootstrap: `GET /api/users/me` via `useAuth()`.

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
- **Perf — list endpoints:** server-side page size clamp required (feed `take` still unbounded — see Open debt; when fixed, record the concrete max here, e.g. 50).
- **Perf — Feed FE:** cursor + `useInfiniteQuery` is the pattern for similar long lists (Radar, Requests); do not load unbounded collections into the client.
- **Perf — agent:** features that touch listados/queries/media/payloads must pass `.cursorrules` §7 checklist item 7 (§6 Performance).
- Agent git close-out: suggest `git commit -m "..."` only (Conventional Commits, English). **Do not** include `git add`; developer stages.

## 4. Backlog

- Sprint 18: Requests (Frontend) — `POST /api/job-requests` + client's own list; `RequestsView` still mock (align with PRODUCT_MAP).
- **Radar apply (pro):** request detail + `JobApplication` entity/endpoints; client accept → `JobContract` + `JobRequest.Accept()` (see PRODUCT_MAP).
- **Radar geo:** location fields on `JobRequest` + map/list by distance.
- **Refresh-token rotation** when UX friction after 120 min access TTL grows.
- **`IsVerified`** on `ProfessionalProfile` + Explore DTO (when a verification process exists).
- Wire real `ClientProfile` / `ProfessionalProfile` into `ProfileView` (stats, history, avatar still mock).

## 5. Open debt

> Agent adds open items here without blocking the current sprint. Before the next feature sprint: validate each item still applies, run a Fixes sprint (or end-of-sprint fixes block). Move resolved items to `docs/PROJECT_HISTORY.md` — do not keep `[x]` here. Priority: security > perf that scales badly > cosmetic.

- `PostResponseDto` has no author snapshot (`professionalProfileId` only, no name/avatar/rubro) nor social counters (likes/comments/shares). `FeedCard` was simplified to real fields; Pillar 1 (immersive feed) needs either an enriched feed DTO or a public "get professional profile by id" endpoint before social proof UI can come back. **Perf note:** hydrating author per card via N profile fetches would create an FE waterfall/N+1 — prefer DTO snapshot over per-item requests.
- **Perf + DoS:** `PostsController.GetFeed` / `PostService.GetFeedAsync` `take` param has no upper bound — a client can request an arbitrarily large page. Needs server-side clamp (e.g. `Math.Min(take, 50)`). Violates `.cursorrules` §6.2.
