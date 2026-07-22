using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;

namespace OficiaApp.Application.UseCases;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository) => _categoryRepository = categoryRepository;

    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync() =>
        (await _categoryRepository.GetAllAsync())
            .Select(c => new CategoryResponseDto(c.Id, c.Name, c.Description));
}
