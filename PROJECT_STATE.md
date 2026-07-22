# ESTADO DEL PROYECTO: OFICIA APP 🚀

## 1. VISIÓN GENERAL
Marketplace de oficios tipo Red Social Laboral. La experiencia de usuario debe sentirse fluida, inmersiva y premium (modo oscuro con acentos violeta/rosa).

## 2. ESTADO ACTUAL DEL DESARROLLO Y STACK TÉCNICO

### Track Backend (.NET 9 - Clean Architecture):
- **Domain:** Entidades ricas (`User`, `ClientProfile`, `ProfessionalProfile`, `Category`, `JobRequest`, `JobContract`, `Review`), constructores explícitos, colecciones de solo lectura (`IReadOnlyCollection`) y relaciones implícitas Muchos-a-Muchos encapsuladas.
- **Infrastructure:** EF Core, SQL Server, Fluent API (`.UsingEntity`, `PrimitiveCollection`), Patrón Repositorio (`UserRepository`, `CategoryRepository`). Carga Ansiosa (`.Include`, `.ThenInclude`), consultas dinámicas de alto rendimiento (`.AsNoTracking()`, `IQueryable`) y Base de Datos sincronizada vía Migraciones.
- **Application:** DTOs inmutables de entrada y salida (`record`), mapeo de datos con LINQ (`.Select()`), servicios con reglas de negocio estrictas (`UserService`, `ProfessionalProfileService`, `ClientProfileService`), encriptación (BCrypt) y emisión JWT (`ITokenService` / `TokenService` con `IOptions<JwtSettings>`).
- **API:** Controladores RESTful (`UsersController`, etc.), inyección de dependencias (Scoped), manejo de Query Strings (`[FromQuery]`). CORS configurado (`AllowFrontend` → `localhost:3000`). JWT Bearer registrado en `Program.cs` (`AddAuthentication` + `AddJwtBearer` + middleware `UseAuthentication` / `UseAuthorization`).
- **Último hito backend:** Sprint 14 en curso — Domain `JobRequest` enriquecido; migración `EnrichJobRequestStatusAndImages` aplicada a DB.

### Track Frontend (esqueleto UI listo):
- **Stack:** Next.js (React) + TypeScript.
- **UI/UX:** Tailwind CSS, shadcn/ui, Lucide React (Mobile-First). Vistas mock: Feed, Explorar, Radar, Solicitudes, Perfil (`lib/oficia-data.ts`).
- **Gestión de Estado (planificado):** Zustand + TanStack Query.
- **Integración API:** Pendiente (después de Auth backend completo).

### Decisiones técnicas relevantes:
- Packets `Microsoft.AspNetCore.*` y `Microsoft.EntityFrameworkCore.*` alineados a **9.0.14** (compatible con `net9.0`).
- JWT: sección `JwtSettings` (`SecretKey` ≥ 32 chars, `Issuer`, `Audience`, `ExpirationInMinutes`) en `appsettings.Development.json`; clase tipada `JwtSettings` en Application (`Settings/JwtSettings.cs`), bindeada vía `Configure<JwtSettings>` en `Program.cs`.
- Pipeline API: `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- Roadmap backend → UI: Auth JWT → Explorar → Radar → Feed → integración frontend.
- **JobRequest.ImageUrls:** mapeado con `PrimitiveCollection` (columna JSON `ImageUrls` en SQL Server). No usar `.Property<List<string>>` — rompe el scaffolding de migraciones en EF Core 9 (bug `NullabilityInfoContext`).
- **Git al cerrar tarea:** el agente solo sugiere `git commit -m "..."` (Conventional Commits, mensaje en inglés). **No** incluir `git add`; el staging lo hace el desarrollador.

---

## 3. HISTORIAL DE SPRINTS
- ✅ **Sprints 1 al 11 (Backend Base):** Clean Architecture, Dominio, Repositorios, Servicios (SRP). Registro, perfiles, oficios N:M, search.
- ✅ **Frontend skeleton (v0):** Maquetación de los 3 pilares + perfil/solicitudes con datos mock.
- ✅ **Sprint 12 — Autenticación JWT (Backend):** Config JWT, TokenService, login, validación E2E con Bearer + fix EF tracking de perfiles.
- ✅ **Sprint 13 — Explorar (Backend):** `GET /api/categories`, `ExploreProfessionalDto`, search público `[AllowAnonymous]`.

## 4. FOCO ACTUAL: Sprint 14 🔄 — Radar (Backend / JobRequest)

**Objetivo del sprint:** Capa completa de `JobRequest` (Domain → Infrastructure → Application → API) para el pilar Radar.

### Tareas:
- [x] **14.1** Domain — enum `JobRequestStatus` + entidad rica `JobRequest` (transiciones `Accept`/`Start`/`Complete`/`Cancel`/`Reject`).
- [x] **14.2** Infrastructure — Fluent API `PrimitiveCollection` + migración `EnrichJobRequestStatusAndImages` (`Status` + `ImageUrls`).
- [x] **14.3** Aplicar migración a DB (`dotnet ef database update`) — aplicada.
- [ ] **14.4** Application — DTOs + `IJobRequestService` / repo (crear solicitud, listar abiertas para Radar).
- [ ] **14.5** API — controlador autenticado de JobRequests.

## 5. BACKLOG
- **Sprint Fix (gate obligatorio antes de Sprint 15):** vaciar §6 de ítems vigentes (warnings CS8618/CS8602, `SetTitle`/`SetDescription`, tooling `dotnet-ef`, naming `FechaCreacion`, etc.).
- Sprint 15: Feed inmersivo — entidad de posts + endpoint paginado.
- Sprint 16: Integración Frontend — `.env.local`, `authService.ts`, TanStack Query en Explorar/Radar.

---

## 6. DEUDA TÉCNICA / PENDIENTES

> Convención (ver también `.cursorrules`): el agente agrega aquí todo warning, bug preexistente o incumplimiento de reglas detectado durante el trabajo, **sin bloquear el sprint en curso**. Antes de abrir el siguiente Sprint de features, validar vigencia de cada ítem y ejecutar un **Sprint de Fixes** (o bloque de fixes al cierre) para no acumular deuda.

### Warnings de compilación (preexistentes)
- [ ] **CS8618** — `OficiaApp.Domain/Entities/User.cs`: propiedades no-nullable (`Username`, `PasswordHash`, `Email`) sin valor garantizado al salir del constructor.
- [ ] **CS8618** — `OficiaApp.Domain/Entities/Review.cs`: `Comment` no-nullable sin inicialización en constructor.
- [ ] **CS8602** — `OficiaApp.Infrastructure/Repositories/UserRepository.cs` (~L70, L80): posible dereference de referencia null.

### Domain / Clean Architecture
- [ ] **`JobRequest.SetTitle` / `SetDescription`** (`OficiaApp.Domain/Entities/JobRequest.cs`): hoy validan y *devuelven* el string, pero no asignan a `Title`/`Description` cuando se llaman como métodos de mutación. El constructor los usa bien (`Title = SetTitle(title)`), pero el naming sugiere setter de dominio. Refactor a `void SetTitle(...)` / `void SetDescription(...)` que asignen a la propiedad, o renombrar a validadores privados.
- [ ] **Límites de longitud** en `Title` / `Description` / `ImageUrl`: aún no definidos; cuando se fijen, aplicar en Dominio + Fluent API (`HasMaxLength`).
- [ ] **`JobRequestStatus` atributos `[Description]`** (`OficiaApp.Domain/Enums/JobRequestStatus.cs`): no aportan valor de dominio hoy; evaluar si se usan (API/UI) o limpiarlos.
- [ ] **Enums con valor base 1:** EF/migraciones suelen defaultar `int` a `0`. Al agregar columnas de status, verificar que el `defaultValue` de la migración coincida con el primer valor del enum (ej. `Pending = 1`). Ya corregido en `EnrichJobRequestStatusAndImages`.
- [ ] **Diseño Radar — postulaciones:** definir si los profesionales postulan vía `JobContract` existente o se necesita entidad `Application`/`JobApplication`. Pendiente antes de 14.4/14.5.

### Infrastructure / Tooling
- [ ] **dotnet-ef CLI** instalado en máquina: tools `9.0.9` < runtime `9.0.14`. Actualizar global tool: `dotnet tool update --global dotnet-ef`.
- [x] **Migración `EnrichJobRequestStatusAndImages` aplicada a DB** (Status default 1 = Pending, ImageUrls default `[]`).

### Naming / consistencia
- [ ] **`BaseEntity.FechaCreacion`** en español vs resto del dominio en inglés — unificar naming (preferible inglés: `CreatedAt`).
