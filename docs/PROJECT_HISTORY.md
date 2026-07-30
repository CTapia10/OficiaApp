# Oficia App — Project History (cold memory)

> Do **not** load this file by default. Read only for audits, every-3-sprints balance, or when an old decision is relevant.
> On sprint close: append 3–5 bullets max; move resolved debt here; keep `PROJECT_STATE.md` free of `[x]` clutter.

## Sprint log

- ✅ **Sprints 1–11 (Backend base):** Clean Architecture, Domain, repositories, services (SRP). Register, profiles, trades N:M, search.
- ✅ **Frontend skeleton (v0):** Maquetación of the 3 pillars + profile/requests with mock data.
- ✅ **Sprint 12 — JWT auth (Backend):** JWT config, TokenService, login, E2E Bearer validation + EF tracking fix for profiles.
- ✅ **Sprint 13 — Explore (Backend):** `GET /api/categories`, `ExploreProfessionalDto`, public search `[AllowAnonymous]`.
- ✅ **Sprint 14 — Radar (Backend / JobRequest):** Enriched Domain + migration + Application Ports/UseCase + `JobRequestsController` (`POST /api/job-requests`, `GET /api/job-requests/open`).
- ✅ **Hexagonal refactor:** Ports In/Out, UseCases, security adapters, UoW, composition root, Domain hygiene.
- ✅ **Sprint 15 — Immersive Feed (Backend):** Domain (`Post` rich, cursor-based), Ports In/Out, `PostService`, `PostRepository` (cursor pagination `CreatedAt`+`Id`), `PostsController` (`POST /api/posts` `[Authorize]`, `GET /api/posts/feed` `[AllowAnonymous]`), migration `AddPostEntity` applied.
- ✅ **Fixes sprint — JobRequest length limits:** `TitleMaxLength=100`, `DescriptionMaxLength=2000`, `ImageUrlsMaxLength=2048` (per URL) + `MaxImagesUrls=10` in Domain; Fluent API (`HasMaxLength` on `Title`/`Description`, `PrimitiveCollection(...).ElementType().HasMaxLength(...)` on `ImageUrls`); migration `AddJobRequestLengthLimits` applied.
- ✅ **Sprint 16 — Frontend integration:** JWT via httpOnly cookie (`AuthCookies`, `Program.cs`, `UsersController.Login/Logout/Me`) + `[Required]`/`[EmailAddress]`/`[MinLength]` on `LoginUserDto`/`RegisterUserDto`; `api-client.ts` + `ApiError`; `authService` + `auth-store` (Zustand) + `useAuth`; `QueryClientProvider` (`app/providers.tsx`); Explore wired to `GET /api/categories` + `GET /api/professional-profile/search`; Radar wired to `GET /api/job-requests/open` (requires session); login/register/logout UI in `ProfileView`. E2E verified with `curl` (cookie set/read/cleared, 401 without session, CORS preflight with credentials).
- ✅ **Fixes sprint (post-Sprint 16):** `docs/PRODUCT_MAP.md`; login identity DTO without Token (Api issues JWT); rate limit on login; Explore verified heuristic removed; Open debt cleared.
- ✅ **Fixes sprint (post-Sprint 17):** Feed `take` server-side clamp (DoS fix); `PostResponseDto` author snapshot (`authorUsername`, `authorPrimaryCategory`); Open debt cleared.
- ✅ **Sprint Testing (Backend):** `OficiaApp.Domain.Tests` + `OficiaApp.Application.Tests` (xUnit, FluentAssertions, NSubstitute); `JobRequest` invariants; `UserService` register/login; `PostService` take clamp + cursor + create guards. CI workflow deferred to Open debt.
- ✅ **Sprint Hexagonal FE + Testing rules:** `.cursorrules` §7 Testing (DoD) + checklist §8; FE restructured to `domain/` | `application/ports` | `infrastructure/http` | `presentation/` | `app/`; backend hexagonal audit OK (controllers → Ports/In only). Vitest + CI remain Open debt.

## Resolved debt

### Hexagonal refactor
- [x] **CS8618** User/Review — mitigated with `= null!` on EF-materialized properties.
- [x] **CS8602** UserRepository — null-forgiving on `ThenInclude`.
- [x] **`JobRequest.SetTitle` / `SetDescription`** — now `void` and assign to the property.
- [x] **`JobRequestStatus` `[Description]`** — removed.
- [x] **`BaseEntity.FechaCreacion` → `CreatedAt`** — Domain in English; DB column still `FechaCreacion`.

### Sprint 15
- [x] **dotnet-ef CLI** outdated — `dotnet tool update --global dotnet-ef` (`9.0.9` → `10.0.10`, compatible with `net9.0` / runtime `9.0.14`).

### Fixes sprint (post-Sprint 15)
- [x] **Length limits** on `JobRequest.Title` / `Description` / `ImageUrl` — Domain + Fluent API + migration applied.
- [x] **Note:** on `PrimitiveCollection` (JSON), `HasMaxLength()` directly on the collection limits the full column string (all URLs concatenated in JSON), not each element — chain `.ElementType().HasMaxLength(...)`. Even then, that does not emit per-URL DDL; per-URL length enforcement lives in the Domain guard (`AddImageUrl`), which is correct under Clean Architecture.

### Fixes sprint (post-Sprint 16 — close Open debt)
- [x] **`AuthResponseDto.Token` removed** — Application login returns identity only (`UserId`, `Username`, `Email`); Api issues JWT via `ITokenService` and sets httpOnly cookie; body never includes the token.
- [x] **Login rate limiting** — `AddRateLimiter` policy `"login"` (fixed window per IP) + `[EnableRateLimiting("login")]` on `POST /api/users/login`.
- [x] **Explore “verified” heuristic removed** — no `BadgeCheck` from `yearsOfExperience >= 5`; real `IsVerified` deferred to backlog.
- [x] **Product map** — `docs/PRODUCT_MAP.md` (roles, pillars, Radar ↔ Mis solicitudes, `JobApplication` → `JobContract` on accept).
- [x] **MVP decisions (not debt):** refresh-token rotation deferred (120 min re-login OK); ProfileView mock stats/history/avatar until profiles wired; Radar apply/geo tracked in backlog.

### Fixes sprint (post-Sprint 17 — close Open debt)
- [x] **Perf + DoS — Feed `take` unbounded:** `PostService.GetFeedAsync` now clamps server-side to `[1, MaxPageSize=50]` (`DefaultPageSize=10` on invalid/zero/negative input). `PostsController.GetFeed` unchanged (clamp lives in Application, not Api, so any future caller gets the same guarantee).
- [x] **`PostResponseDto` author snapshot:** added `AuthorUsername` (from `User.Username`) and `AuthorPrimaryCategory` (first `ProfessionalProfile.Category.Name`, nullable) to `PostResponseDto`. `PostRepository.GetFeedAsync` now does `Include(ProfessionalProfile).ThenInclude(User)` + `Include(ProfessionalProfile).ThenInclude(Categories)` (single query, no N+1) instead of hydrating per-card. `FeedCard` (`OficiaApp.Frontend/components/oficia/feed-view.tsx`) shows real username + rubro instead of the "Profesional" placeholder.
- [x] **Split from the debt item:** social counters (likes/comments/shares) and author avatar were **not** implemented — no `Like`/`Comment` entities or avatar field exist in Domain; building them is new feature scope (new entities, migrations, endpoints, CSRF design for likes/comments as writes), not a fix. Moved to `PROJECT_STATE.md` §4 Backlog as explicit future sprints instead of lingering as vague Open debt.
