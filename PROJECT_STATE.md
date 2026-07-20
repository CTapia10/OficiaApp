# ESTADO DEL PROYECTO: OFICIA APP 🚀

## 1. VISIÓN GENERAL
Marketplace de oficios tipo Red Social Laboral. La experiencia de usuario debe sentirse fluida, inmersiva y premium (modo oscuro con acentos violeta/rosa).

## 2. ESTADO ACTUAL DEL DESARROLLO Y STACK TÉCNICO

### Track Backend (.NET 9 - Clean Architecture):
- **Domain:** Entidades ricas (`User`, `ClientProfile`, `ProfessionalProfile`, `Category`, `JobRequest`, `JobContract`, `Review`), constructores explícitos, colecciones de solo lectura (`IReadOnlyCollection`) y relaciones implícitas Muchos-a-Muchos encapsuladas.
- **Infrastructure:** EF Core, SQL Server, Fluent API (`.UsingEntity`), Patrón Repositorio (`UserRepository`, `CategoryRepository`). Carga Ansiosa (`.Include`, `.ThenInclude`), consultas dinámicas de alto rendimiento (`.AsNoTracking()`, `IQueryable`) y Base de Datos sincronizada vía Migraciones.
- **Application:** DTOs inmutables de entrada y salida (`record`), mapeo de datos con LINQ (`.Select()`), servicios con reglas de negocio estrictas (`UserService`, `ProfessionalProfileService`, `ClientProfileService`), encriptación (BCrypt) y emisión JWT (`ITokenService` / `TokenService` con `IOptions<JwtSettings>`).
- **API:** Controladores RESTful (`UsersController`, etc.), inyección de dependencias (Scoped), manejo de Query Strings (`[FromQuery]`). CORS configurado (`AllowFrontend` → `localhost:3000`). JWT Bearer registrado en `Program.cs` (`AddAuthentication` + `AddJwtBearer` + middleware `UseAuthentication` / `UseAuthorization`).
- **Último hito backend:** Sprint 13.1 — `GET /api/categories` público (DTO + `CategoryService` + `GetAllAsync` con `AsNoTracking`).

### Track Frontend (esqueleto UI listo):
- **Stack:** Next.js (React) + TypeScript.
- **UI/UX:** Tailwind CSS, shadcn/ui, Lucide React (Mobile-First). Vistas mock: Feed, Explorar, Radar, Solicitudes, Perfil (`lib/oficia-data.ts`).
- **Gestión de Estado (planificado):** Zustand + TanStack Query.
- **Integración API:** Pendiente (después de Auth backend completo).

### Decisiones técnicas relevantes:
- Packets `Microsoft.AspNetCore.*` alineados a **9.0.14** (compatible con `net9.0`).
- JWT: sección `JwtSettings` (`SecretKey` ≥ 32 chars, `Issuer`, `Audience`, `ExpirationInMinutes`) en `appsettings.Development.json`; clase tipada `JwtSettings` en Application (`Settings/JwtSettings.cs`), bindeada vía `Configure<JwtSettings>` en `Program.cs`.
- Pipeline API: `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- Roadmap backend → UI: Auth JWT → Explorar → Radar → Feed → integración frontend.

---

## 3. HISTORIAL DE SPRINTS
- ✅ **Sprints 1 al 11 (Backend Base):** Clean Architecture, Dominio, Repositorios, Servicios (SRP). Registro, perfiles, oficios N:M, search.
- ✅ **Frontend skeleton (v0):** Maquetación de los 3 pilares + perfil/solicitudes con datos mock.
- ✅ **Sprint 12 — Autenticación JWT (Backend):** Config JWT, TokenService, login, validación E2E con Bearer + fix EF tracking de perfiles.

## 4. FOCO ACTUAL: Sprint 13 🔄 — Explorar (Backend)

**Objetivo del sprint:** Exponer catálogo de categorías y search público de profesionales para el pilar Explorar.

### Tareas:
- [x] **13.1** `GET /api/categories` — DTO + service + repo `GetAll` + controlador público.
- [ ] **13.2** Enriquecer DTO de profesionales para cards de Explorar.
- [ ] **13.3** Search público con filtros (`[FromQuery]`).

## 5. PRÓXIMOS PASOS (Backlog post-Sprint 13)
- Sprint 14: Radar — capa completa de `JobRequest` (Domain extendido + API).
- Sprint 15: Feed inmersivo — entidad de posts + endpoint paginado.
- Sprint 16: Integración Frontend — `.env.local`, `authService.ts`, TanStack Query en Explorar/Radar.
