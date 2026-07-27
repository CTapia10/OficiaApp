# Oficia App — Project State (living)

> Vision / 3 pillars: see `.cursorrules` §3. Security rules: see `.cursorrules` §5. Closed sprints & resolved debt: see `docs/PROJECT_HISTORY.md`.

## 1. Now

- **Last closed:** Sprint 16 — Frontend integration (auth cookie httpOnly + Explore + Radar).
- **Next:** Sprint 17 — Immersive Feed (Frontend): wire `PostsController` to the Feed pillar (infinite scroll + cursor).

## 2. Stack map

### Backend (.NET 9 — Hexagonal)
- **Domain:** rich entities (`User`, profiles, `Category`, `JobRequest`, `JobContract`, `Review`, `Post`), enums, `BaseEntity.CreatedAt`. No IO.
- **Application:** `Ports/In` | `Ports/Out` | `UseCases/` | DTOs | `AddApplication()`.
- **Infrastructure:** EF Core + SQL Server, repos, `UnitOfWork`, BCrypt/JWT adapters, `AddInfrastructure(IConfiguration)`.
- **Api:** REST controllers, JWT Bearer + cookie bridge, thin `Program.cs`, CORS `AllowFrontend` → `localhost:3000`.

### Frontend (Next.js + TypeScript)
- **UI:** Tailwind, shadcn/ui, Lucide, Mobile-First.
- **State:** Zustand (`lib/auth/auth-store.ts` — profile only, never JWT) + TanStack Query (`app/providers.tsx`).
- **API:** `lib/api/api-client.ts` (`apiFetch`, `credentials: 'include'`, `ApiError`) + domain services + `hooks/use-*.ts`.
- **Mock vs real:** Feed + Requests still mock (`lib/oficia-data.ts`). Explore + Radar + Profile (username/email) consume the Api. Session bootstrap: `GET /api/users/me` via `useAuth()`.

## 3. Living constraints

(Not duplicated from `.cursorrules` §5 — those are mandatory there.)

- Packages `Microsoft.AspNetCore.*` / `Microsoft.EntityFrameworkCore.*` pinned to **9.0.14** (`net9.0`).
- JWT issued in Infrastructure (`JwtTokenService`); Bearer validated in Api. `JwtSettings` POCO in Application.
- Api pipeline: `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- `IUnitOfWork` owns `SaveChangesAsync`; repos only track changes.
- Domain `CreatedAt` maps to legacy column `FechaCreacion` (no destructive rename).
- `JobRequest.ImageUrls`: EF `PrimitiveCollection` (JSON column). Per-URL length enforced in Domain, not DDL.
- Cookie JWT extraction: `JwtBearerEvents.OnMessageReceived` reads `oficia_access_token` only if no `Authorization` header (Swagger/Postman priority).
- Agent git close-out: suggest `git commit -m "..."` only (Conventional Commits, English). **Do not** include `git add`; developer stages.

## 4. Backlog

- Sprint 17: Feed (Frontend) — `GET /api/posts/feed` + cursor infinite scroll.
- Sprint 18: Requests (Frontend) — `POST /api/job-requests` + client's own list; `RequestsView` still mock.
- Wire real `ClientProfile` / `ProfessionalProfile` into `ProfileView` (stats, history, avatar still mock).

## 5. Open debt

> Agent adds open items here without blocking the current sprint. Before the next feature sprint: validate each item still applies, run a Fixes sprint (or end-of-sprint fixes block). Move resolved items to `docs/PROJECT_HISTORY.md` — do not keep `[x]` here.

- [ ] **Radar applications design:** professionals apply via existing `JobContract`, or need `Application` / `JobApplication`? Does not block Feed frontend.
- [ ] **`AuthResponseDto.Token` still exists in Application** though Login no longer returns it in the body (cookie only). Consider an Api-owned public login shape.
- [ ] **No rate limiting / lockout on `POST /api/users/login`.** Candidate: `AddRateLimiter` (.NET 9) before exposing beyond localhost.
- [ ] **No refresh-token rotation.** JWT TTL 120 min; manual re-login. Acceptable for MVP; revisit if UX friction grows.
- [ ] **`ProfileView` mixes real data (username/email) with mock** (stats, contract history, avatar) until profiles are wired (Backlog).
- [ ] **Explore “verified” heuristic** (`pro.yearsOfExperience >= 5` in `explore-view.tsx`) is a visual placeholder, not a backend flag.
