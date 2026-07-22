using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface IClientProfileService
{
    Task CreateClientProfileAsync(Guid userId, CreateClientProfileDto dto);
}
