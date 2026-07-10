using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services
{
    public interface IProfessionalProfileService
    {
        Task CreateProfileAsync(Guid userId, CreateProfessionalProfileDto dto);
        Task AddCategoryAsync(Guid userId, Guid categoryId);
        Task<IEnumerable<ProfessionalResponseDto>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate);
    }
}
