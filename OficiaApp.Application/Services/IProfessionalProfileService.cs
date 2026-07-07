using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services
{
    public interface IProfessionalProfileService
    {
        Task CreateProfileAsync(Guid userId, CreateProfessionalProfileDto dto);
    }
}
