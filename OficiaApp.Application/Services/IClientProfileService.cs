using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services
{
    public interface IClientProfileService
    {
        Task CreateClientProfileAsync(Guid userId, CreateClientProfileDto dto);
    }
}
