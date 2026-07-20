using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services
{
    public interface IProfessionalProfileService
    {
        Task CreateProfileAsync(Guid userId, CreateProfessionalProfileDto dto);
        Task AddCategoryAsync(Guid userId, Guid categoryId);
        Task<IEnumerable<ExploreProfessionalDto>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate);
    }
}
