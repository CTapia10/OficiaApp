# ESTADO DEL PROYECTO: OFICIA APP 🚀

## 1. VISIÓN GENERAL
Marketplace de oficios tipo Red Social Laboral. La experiencia de usuario debe sentirse fluida, inmersiva y premium (modo oscuro con acentos violeta/rosa).

## 2. ESTADO ACTUAL DEL DESARROLLO Y STACK TÉCNICO

### Track Backend (.NET 9 - Arquitectura Hexagonal / Ports & Adapters):
- **Domain (núcleo puro):** Entidades ricas (`User`, `ClientProfile`, `ProfessionalProfile`, `Category`, `JobRequest`, `JobContract`, `Review`), enums, `BaseEntity.CreatedAt`. Sin interfaces de IO.
- **Application (hexágono):** `Ports/In` (casos de uso), `Ports/Out` (repos, hasher, token, UoW), `UseCases/`, DTOs, `AddApplication()`. Sin BCrypt/JWT/EF.
- **Infrastructure (driven adapters):** EF Core + SQL Server, `Persistence/Repositories`, `UnitOfWork`, `Security/BCryptPasswordHasher`, `Security/JwtTokenService`, `AddInfrastructure(IConfiguration)`.
- **API (driving adapter):** Controllers RESTful, JWT Bearer validation en el host, `Program.cs` delgado (`AddApplication` + `AddInfrastructure`). CORS `AllowFrontend` → `localhost:3000`.
- **Último hito backend:** Refactor Hexagonal completo + Sprint 14 cerrado (`JobRequest` Ports/UseCase/Repo/Controller).

### Track Frontend (integración real iniciada):
- **Stack:** Next.js (React) + TypeScript.
- **UI/UX:** Tailwind CSS, shadcn/ui, Lucide React (Mobile-First). Feed y Solicitudes siguen en mock (`lib/oficia-data.ts`); Explorar, Radar y Perfil ya consumen la Api real.
- **Gestión de Estado:** Zustand (`lib/auth/auth-store.ts`, solo perfil de usuario — nunca el JWT) + TanStack Query (`app/providers.tsx`, `QueryClientProvider` por sesión de navegador vía `useState`).
- **Integración API:** `lib/api/api-client.ts` (`apiFetch<T>`, `credentials: 'include'`, `ApiError` tipado). Servicios por dominio en `lib/<dominio>/*-service.ts` + hooks en `hooks/use-*.ts`.
- **Sesión (Sprint 16):** JWT transportado en cookie `httpOnly` (`oficia_access_token`), nunca en `localStorage` ni en el body de las respuestas — mitiga robo de token por XSS. Bootstrap de sesión vía `GET /api/users/me` en `useAuth()`.

### Decisiones técnicas relevantes:
- Packets `Microsoft.AspNetCore.*` y `Microsoft.EntityFrameworkCore.*` alineados a **9.0.14** (compatible con `net9.0`).
- JWT: emisión en Infrastructure (`JwtTokenService`); validación Bearer en Api. `JwtSettings` POCO en Application.
- Pipeline API: `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- `IUnitOfWork` centraliza `SaveChangesAsync`; repositorios solo trackean cambios.
- `CreatedAt` en Domain mapeado a columna legacy `FechaCreacion` (sin migración destructiva).
- **JobRequest.ImageUrls:** mapeado con `PrimitiveCollection` (columna JSON `ImageUrls` en SQL Server).
- **Cookie de sesión (`AuthCookies`, Api):** `HttpOnly` + `Secure=true` + `SameSite=None`. Frontend (`:3000`) y Api (`:7086`) son orígenes distintos para el navegador (scheme http vs https = "schemeful same-site"), por eso `SameSite=None` es obligatorio y exige que la Api corra siempre en HTTPS, incluso en desarrollo (`dotnet run --launch-profile https`).
- **CORS con credenciales:** `AllowCredentials()` + whitelist explícita de orígenes (`Cors:AllowedOrigins`); no es compatible con `AllowAnyOrigin()`.
- **Extracción de JWT desde cookie:** `JwtBearerEvents.OnMessageReceived` en `Program.cs` lee `oficia_access_token` solo si no vino un header `Authorization` explícito (prioridad para Swagger/Postman/tests).
- **Mitigación CSRF:** sin token CSRF dedicado. Se apoya en que los endpoints de escritura exigen `Content-Type: application/json` (un `<form>` cross-site no puede setear ese header sin JS) + CORS restringido a orígenes de la whitelist. Válido mientras la Api sea JSON-only; revisar si en el futuro se aceptan `multipart/form-data` o `x-www-form-urlencoded`.
- **Git al cerrar tarea:** el agente solo sugiere `git commit -m "..."` (Conventional Commits, mensaje en inglés). **No** incluir `git add`; el staging lo hace el desarrollador.
- **Seguridad (Sprint 16 → `.cursorrules` §5):** sesión JWT solo en cookie httpOnly; CORS con credenciales + whitelist; `credentials: 'include'` en el cliente; DTOs con validación server-side; secretos fuera del frontend. Cualquier feature que toque auth/CORS/fetch/sesión debe cumplir esas reglas (no negociable).

---

## 3. HISTORIAL DE SPRINTS
- ✅ **Sprints 1 al 11 (Backend Base):** Clean Architecture, Dominio, Repositorios, Servicios (SRP). Registro, perfiles, oficios N:M, search.
- ✅ **Frontend skeleton (v0):** Maquetación de los 3 pilares + perfil/solicitudes con datos mock.
- ✅ **Sprint 12 — Autenticación JWT (Backend):** Config JWT, TokenService, login, validación E2E con Bearer + fix EF tracking de perfiles.
- ✅ **Sprint 13 — Explorar (Backend):** `GET /api/categories`, `ExploreProfessionalDto`, search público `[AllowAnonymous]`.
- ✅ **Sprint 14 — Radar (Backend / JobRequest):** Domain enriquecido + migración + Application Ports/UseCase + `JobRequestsController` (`POST /api/job-requests`, `GET /api/job-requests/open`).
- ✅ **Refactor Hexagonal:** Ports In/Out, UseCases, security adapters, UoW, composition root, Domain hygiene.
- ✅ **Sprint 15 — Feed inmersivo (Backend):** Domain (`Post` rico, cursor-based), Ports In/Out, `PostService`, `PostRepository` (paginación por cursor `CreatedAt`+`Id`), `PostsController` (`POST /api/posts` `[Authorize]`, `GET /api/posts/feed` `[AllowAnonymous]`), migración `AddPostEntity` aplicada.
- ✅ **Sprint de Fixes — Límites de longitud `JobRequest`:** `TitleMaxLength=100`, `DescriptionMaxLength=2000`, `ImageUrlsMaxLength=2048` (por URL) + `MaxImagesUrls=10` (cantidad) en Domain; Fluent API (`HasMaxLength` en `Title`/`Description`, `PrimitiveCollection(...).ElementType().HasMaxLength(...)` en `ImageUrls`); migración `AddJobRequestLengthLimits` aplicada.
- ✅ **Sprint 16 — Integración Frontend:** sesión JWT vía cookie `httpOnly` (`AuthCookies`, `Program.cs`, `UsersController.Login/Logout/Me`) + `[Required]/[EmailAddress]/[MinLength]` en `LoginUserDto`/`RegisterUserDto`; `api-client.ts` + `ApiError`; `authService` + `auth-store` (Zustand) + `useAuth`; `QueryClientProvider` (`app/providers.tsx`); Explorar conectado a `GET /api/categories` + `GET /api/professional-profile/search`; Radar conectado a `GET /api/job-requests/open` (requiere sesión); UI de login/registro/logout en `ProfileView`. Probado E2E con `curl` (cookie set/leída/borrada, 401 sin sesión, CORS preflight con credenciales).

## 4. FOCO ACTUAL: Sprint Fix / siguiente feature

**Completado:** Hexagonal + Radar JobRequest (14.4–14.5) + Feed Post (Sprint 15) + Fix límites de longitud `JobRequest` + Sprint 16 (Integración Frontend: auth + Explorar + Radar).

### Próximo:
- Sprint 17: Feed inmersivo (Frontend).

---

## 5. BACKLOG
- Sprint 17: Feed inmersivo (Frontend) — conectar `PostsController` al pilar Feed (scroll infinito con cursor).
- Sprint 18: Solicitudes (Frontend) — conectar `POST /api/job-requests` (creación) y listado propio del cliente; hoy `RequestsView` sigue en mock.
- Conectar `ClientProfile`/`ProfessionalProfile` reales a `ProfileView` (hoy solo username/email vienen de la Api; stats, historial y avatar siguen mock).

---

## 6. DEUDA TÉCNICA / PENDIENTES

> Convención (ver también `.cursorrules`): el agente agrega aquí todo warning, bug preexistente o incumplimiento de reglas detectado durante el trabajo, **sin bloquear el sprint en curso**. Antes de abrir el siguiente Sprint de features, validar vigencia de cada ítem y ejecutar un **Sprint de Fixes** (o bloque de fixes al cierre) para no acumular deuda.

### Resuelto en refactor Hexagonal
- [x] **CS8618** User/Review — mitigado con `= null!` en propiedades materializadas por EF.
- [x] **CS8602** UserRepository — null-forgiving en `ThenInclude`.
- [x] **`JobRequest.SetTitle` / `SetDescription`** — ahora `void` y asignan a la propiedad.
- [x] **`JobRequestStatus` `[Description]`** — eliminados.
- [x] **`BaseEntity.FechaCreacion` → `CreatedAt`** — Domain en inglés; columna DB sigue `FechaCreacion`.

### Vigente
- [ ] **Diseño Radar — postulaciones:** definir si los profesionales postulan vía `JobContract` existente o se necesita entidad `Application`/`JobApplication`. No bloquea Sprint 16 (frontend solo consume `GET /api/job-requests/open`).

### Resuelto en Sprint 15
- [x] **dotnet-ef CLI** desactualizado — `dotnet tool update --global dotnet-ef` ejecutado (`9.0.9` → `10.0.10`, compatible con proyecto `net9.0`/runtime `9.0.14`).

### Resuelto en Sprint de Fixes (post-Sprint 15)
- [x] **Límites de longitud** en `JobRequest.Title` / `Description` / `ImageUrl` — Domain + Fluent API + migración aplicada.
- [x] **Nota técnica:** en `PrimitiveCollection` (JSON), `HasMaxLength()` directo sobre la colección limita el string completo de la columna (todas las URLs concatenadas en JSON), no cada elemento — hay que encadenar `.ElementType().HasMaxLength(...)`. Aun así, ese `ElementType().HasMaxLength()` no genera DDL (no hay columna real por URL); la enforcement de longitud por URL vive únicamente en el guard del Dominio (`AddImageUrl`), que es el lugar correcto en Clean Architecture.

### Vigente (detectada en Sprint 16)
- [ ] **`AuthResponseDto.Token` sigue existiendo en Application** aunque `UsersController.Login` ya no lo expone en el body (solo va en la cookie httpOnly). No bloquea nada, pero el DTO miente sobre lo que realmente viaja al cliente; evaluar si el "shape público" de login debería vivir como un DTO propio de Api en vez de reusar `AuthResponseDto`.
- [ ] **Sin rate limiting / lockout en `POST /api/users/login`.** Hoy nada impide fuerza bruta de contraseñas. Candidato a `AspNetCoreRateLimit` o middleware nativo de .NET 9 (`AddRateLimiter`) antes de exponer la Api fuera de localhost.
- [ ] **Sin rotación/refresh token.** El JWT expira a los 120 min y el usuario debe volver a loguearse manualmente (no hay silent refresh). Aceptable para el MVP actual; revisar si la fricción de UX lo justifica en un sprint futuro.
- [ ] **`ProfileView` mezcla datos reales (username/email) con mock** (stats, historial de contratos, avatar) hasta que se conecten `ClientProfile`/`ProfessionalProfile` reales (ver Backlog §5).
- [ ] **Heurística "verificado" en Explorar** (`pro.yearsOfExperience >= 5` en `explore-view.tsx`) es un placeholder visual, no un flag real de verificación del backend.
