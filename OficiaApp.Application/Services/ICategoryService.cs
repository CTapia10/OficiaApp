using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>> GetAllAsync();
}