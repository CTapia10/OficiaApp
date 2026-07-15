# ESTADO DEL PROYECTO: OFICIA APP 🚀

## 1. VISIÓN GENERAL
Marketplace de oficios tipo Red Social Laboral. La experiencia de usuario debe sentirse fluida, inmersiva y premium (modo oscuro con acentos violeta/rosa).

## 2. ESTADO ACTUAL DEL DESARROLLO Y STACK TÉCNICO

### Track Backend (.NET 9 - Clean Architecture):
- **Domain:** Entidades ricas (`User`, `ClientProfile`, `ProfessionalProfile`, `Category`, `JobRequest`, `JobContract`, `Review`), constructores explícitos, colecciones de solo lectura (`IReadOnlyCollection`) y relaciones implícitas Muchos-a-Muchos encapsuladas.
- **Infrastructure:** EF Core, SQL Server, Fluent API (`.UsingEntity`), Patrón Repositorio (`UserRepository`, `CategoryRepository`). Carga Ansiosa (`.Include`, `.ThenInclude`), consultas dinámicas de alto rendimiento (`.AsNoTracking()`, `IQueryable`) y Base de Datos sincronizada vía Migraciones.
- **Application:** DTOs inmutables de entrada y salida (`record`), mapeo de datos con LINQ (`.Select()`), servicios con reglas de negocio estrictas (`UserService`, `ProfessionalProfileService`, `ClientProfileService`), encriptación (BCrypt) y emisión JWT (`ITokenService` / `TokenService` con `IOptions<JwtSettings>`).
- **API:** Controladores RESTful (`UsersController`, etc.), inyección de dependencias (Scoped), manejo de Query Strings (`[FromQuery]`). CORS configurado (`AllowFrontend` → `localhost:3000`). JWT Bearer registrado en `Program.cs` (`AddAuthentication` + `AddJwtBearer` + middleware `UseAuthentication` / `UseAuthorization`).
- **Último hito backend:** Sprint 12 — Tarea 12.2 completada (`TokenService` + DI). Pendiente endpoint login (12.3).

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
- 🔄 **Sprint 12 (EN CURSO) — Autenticación JWT (Backend):** Desbloquear `[Authorize]` y habilitar login/token para perfiles y futuros flujos.

## 4. FOCO ACTUAL: SPRINT 12 — Autenticación JWT

**Objetivo del sprint:** Emitir y validar JWT para que los endpoints protegidos funcionen de extremo a extremo.

### Tareas:
- [x] **12.1** Configurar JWT en API (`JwtSettings`, paquete JwtBearer 9.0.14, `AddAuthentication`/`AddJwtBearer`, middleware).
- [x] **12.2** Crear `ITokenService` / `TokenService` en Application, `JwtSettings` tipado, paquetes JWT, registro en DI.
- [ ] **12.3** ← **SIGUIENTE** — Endpoint `POST /api/users/login` + DTOs + reglas en `UserService` (BCrypt verify + generar token).
- [ ] **12.4** Validar flujo: register → login → llamar endpoint `[Authorize]` con Bearer token.

## 5. PRÓXIMOS PASOS (Backlog post-Sprint 12)
- Sprint 13: Explorar — `GET /api/categories`, enriquecer DTO de pros, search público.
- Sprint 14: Radar — capa completa de `JobRequest` (Domain extendido + API).
- Sprint 15: Feed inmersivo — entidad de posts + endpoint paginado.
- Sprint 16: Integración Frontend — `.env.local`, `authService.ts`, TanStack Query en Explorar/Radar.
