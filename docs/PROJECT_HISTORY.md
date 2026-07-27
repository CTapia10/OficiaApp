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
