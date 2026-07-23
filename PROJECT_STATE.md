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

### Track Frontend (esqueleto UI listo):
- **Stack:** Next.js (React) + TypeScript.
- **UI/UX:** Tailwind CSS, shadcn/ui, Lucide React (Mobile-First). Vistas mock: Feed, Explorar, Radar, Solicitudes, Perfil (`lib/oficia-data.ts`).
- **Gestión de Estado (planificado):** Zustand + TanStack Query.
- **Integración API:** Pendiente (después de Auth backend completo).

### Decisiones técnicas relevantes:
- Packets `Microsoft.AspNetCore.*` y `Microsoft.EntityFrameworkCore.*` alineados a **9.0.14** (compatible con `net9.0`).
- JWT: emisión en Infrastructure (`JwtTokenService`); validación Bearer en Api. `JwtSettings` POCO en Application.
- Pipeline API: `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- `IUnitOfWork` centraliza `SaveChangesAsync`; repositorios solo trackean cambios.
- `CreatedAt` en Domain mapeado a columna legacy `FechaCreacion` (sin migración destructiva).
- **JobRequest.ImageUrls:** mapeado con `PrimitiveCollection` (columna JSON `ImageUrls` en SQL Server).
- **Git al cerrar tarea:** el agente solo sugiere `git commit -m "..."` (Conventional Commits, mensaje en inglés). **No** incluir `git add`; el staging lo hace el desarrollador.

---

## 3. HISTORIAL DE SPRINTS
- ✅ **Sprints 1 al 11 (Backend Base):** Clean Architecture, Dominio, Repositorios, Servicios (SRP). Registro, perfiles, oficios N:M, search.
- ✅ **Frontend skeleton (v0):** Maquetación de los 3 pilares + perfil/solicitudes con datos mock.
- ✅ **Sprint 12 — Autenticación JWT (Backend):** Config JWT, TokenService, login, validación E2E con Bearer + fix EF tracking de perfiles.
- ✅ **Sprint 13 — Explorar (Backend):** `GET /api/categories`, `ExploreProfessionalDto`, search público `[AllowAnonymous]`.
- ✅ **Sprint 14 — Radar (Backend / JobRequest):** Domain enriquecido + migración + Application Ports/UseCase + `JobRequestsController` (`POST /api/job-requests`, `GET /api/job-requests/open`).
- ✅ **Refactor Hexagonal:** Ports In/Out, UseCases, security adapters, UoW, composition root, Domain hygiene.
- ✅ **Sprint 15 — Feed inmersivo (Backend):** Domain (`Post` rico, cursor-based), Ports In/Out, `PostService`, `PostRepository` (paginación por cursor `CreatedAt`+`Id`), `PostsController` (`POST /api/posts` `[Authorize]`, `GET /api/posts/feed` `[AllowAnonymous]`), migración `AddPostEntity` aplicada.

## 4. FOCO ACTUAL: Sprint Fix / siguiente feature

**Completado:** Hexagonal + Radar JobRequest (14.4–14.5) + Feed Post (Sprint 15).

### Próximo:
- Sprint 16: Integración Frontend, o Sprint de Fixes sobre deuda §6 vigente.

---

## 5. BACKLOG
- Sprint 16: Integración Frontend — `.env.local`, `authService.ts`, TanStack Query en Explorar/Radar.
- Sprint 17: Feed inmersivo (Frontend) — conectar `PostsController` al pilar Feed (scroll infinito con cursor).

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
- [ ] **Límites de longitud** en `Title` / `Description` / `ImageUrl`: aún no definidos; cuando se fijen, aplicar en Dominio + Fluent API (`HasMaxLength`).
- [ ] **Diseño Radar — postulaciones:** definir si los profesionales postulan vía `JobContract` existente o se necesita entidad `Application`/`JobApplication`.

### Resuelto en Sprint 15
- [x] **dotnet-ef CLI** desactualizado — `dotnet tool update --global dotnet-ef` ejecutado (`9.0.9` → `10.0.10`, compatible con proyecto `net9.0`/runtime `9.0.14`).
