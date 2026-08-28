# Oficia hexagonal paths

Usar rutas desde la raíz del repo. El script `scripts/validate_layers.py` es la fuente mecánica; esta tabla es para redactar directivas.

## Backend

| Capa | Path | Vive aquí | Prohibido |
|---|---|---|---|
| Domain | `OficiaApp.Domain/` | Entidades, enums, invariantes | IO, EF, HTTP, ASP.NET |
| Application | `OficiaApp.Application/Ports/In/` | Contratos de use case | EF, HTTP |
| Application | `OficiaApp.Application/Ports/Out/` | Contratos de persistencia/adapters | Implementaciones IO |
| Application | `OficiaApp.Application/UseCases/` | Servicios de aplicación | DbContext, controllers |
| Application | `OficiaApp.Application/DTOs/` | Contratos de aplicación | Entidades ricas filtradas a la Api |
| Infrastructure | `OficiaApp.Infrastructure/` | EF, repos, BCrypt/JWT adapters | Reglas de negocio nuevas |
| Api | `OficiaApp.Api/` | Controllers thin vía Ports/In, cookies | Lógica de negocio |
| Domain tests | `OficiaApp.Domain.Tests/` | Invariantes; sin IO ni mocks de infra | NSubstitute de repos EF |
| Application tests | `OficiaApp.Application.Tests/` | Use cases + mocks Ports/Out | DB/HTTP real |

Verificar BE: `dotnet test OficiaApp.sln`

## Frontend

| Capa | Path | Vive aquí | Prohibido |
|---|---|---|---|
| Domain | `OficiaApp.Frontend/domain/` | Types only | fetch, React, Zustand |
| Ports | `OficiaApp.Frontend/application/ports/out/` | Interfaces API | fetch, React |
| Use cases | `OficiaApp.Frontend/application/use-cases/` | Orquestación thin | `apiFetch` directo |
| HTTP | `OficiaApp.Frontend/infrastructure/http/` | `api-client.ts`, `*-api.adapter.ts` | UI |
| Presentation | `OficiaApp.Frontend/presentation/` | components, hooks, stores (perfil, nunca JWT) | `apiFetch` / `api-client` |
| App | `OficiaApp.Frontend/app/` | App Router, providers | Llamar `apiFetch` |

Tests FE: colocalizados `*.test.ts` / `*.test.tsx` (Vitest + Testing Library). Patrón de hooks: `renderHook` + `QueryClientProvider` + `vi.mock` del adapter.

`fetch` al backend **solo** vía `apiFetch` (`credentials: 'include'`). Presentation habla con adapters, no con `apiFetch`.
