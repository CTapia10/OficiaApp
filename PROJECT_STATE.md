# ESTADO DEL PROYECTO: OFICIA APP 🚀

## 1. VISIÓN GENERAL
Marketplace de oficios tipo Red Social Laboral. La experiencia de usuario debe sentirse fluida, inmersiva y premium (modo oscuro con acentos violeta/rosa).

## 2. ESTADO ACTUAL DEL DESARROLLO Y STACK TÉCNICO

### Track Backend (.NET 9 - Clean Architecture):
- **Domain:** Entidades ricas (`User`, `ClientProfile`, `ProfessionalProfile`, `Category`, `JobRequest`, `JobContract`, `Review`), constructores explícitos, colecciones de solo lectura (`IReadOnlyCollection`) y relaciones implícitas Muchos-a-Muchos encapsuladas.
- **Infrastructure:** EF Core, SQL Server, Fluent API (`.UsingEntity`), Patrón Repositorio (`UserRepository`, `CategoryRepository`). Carga Ansiosa (`.Include`, `.ThenInclude`), consultas dinámicas de alto rendimiento (`.AsNoTracking()`, `IQueryable`) y Base de Datos sincronizada vía Migraciones.
- **Application:** DTOs inmutables de entrada y salida (`record`), mapeo de datos con LINQ (`.Select()`), servicios con reglas de negocio estrictas (`UserService`, `ProfessionalProfileService`, `ClientProfileService`) y encriptación (BCrypt).
- **API:** Controladores RESTful (`UsersController`, etc.), inyección de dependencias (Scoped), manejo de Query Strings (`[FromQuery]`). Seguridad: Autenticación JWT (`[Authorize]`) y extracción segura de identidad mediante `User.Claims`.
- **Último hito backend:** Sprint 11 completado (Flujo seguro de creación de Perfiles, Asignación de Oficios N:M, y Motor de Búsqueda dinámico).

### Track Frontend (Iniciando):
- **Stack:** Next.js (React) + TypeScript.
- **UI/UX:** Tailwind CSS, shadcn/ui, Framer Motion, Lucide React (Enfoque Mobile-First).
- **Gestión de Estado:** Zustand (estado cliente) y TanStack Query (sincronización servidor/scroll infinito).

---

## 3. HISTORIAL DE SPRINTS
- ✅ **Sprints 1 al 11 (Backend Base):** Configuración de Clean Architecture. Creación del Dominio, Repositorios, Servicios de Aplicación (SRP). Flujo seguro de registro (`UsersController`), creación de perfiles y asignación de oficios.
- 🔄 **Sprint 12 (EN CURSO):** Inicialización del Frontend (Next.js) y conexión con la API de .NET.

## 4. FOCO ACTUAL: SPRINT 12 (Conexión Frontend-Backend)
**Objetivo:** Integrar el registro de usuarios del Frontend con el endpoint `POST /api/users/register` del Backend.

### Tareas Inmediatas (To-Do):
- [ ] Configurar variables de entorno en el frontend (`.env.local` con la URL base de la API).
- [ ] Configurar políticas **CORS** en `Program.cs` (.NET) para permitir peticiones desde `localhost:3000`.
- [ ] Crear la capa de servicios en el cliente (`services/authService.ts`) usando `fetch` para aislar la lógica de red de los componentes visuales.
- [ ] Conectar el formulario de registro de la UI con `authService.registerUser`.

## 5. PRÓXIMOS PASOS (Backlog)
- Implementar TanStack Query para el manejo de estados asíncronos y caché.
- Desarrollar la UI para el Onboarding Progresivo ("Ofrecer mis servicios") donde el `User` crea su `ProfessionalProfile`.
- Implementar el Feed visual Inmersivo.