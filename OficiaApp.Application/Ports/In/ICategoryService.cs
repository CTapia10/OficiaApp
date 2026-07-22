using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>> GetAllAsync();
}
