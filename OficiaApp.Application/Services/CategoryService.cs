using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Repositories;

namespace OficiaApp.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    public CategoryService(ICategoryRepository categoryRepository) => _categoryRepository = categoryRepository;
    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync() => (await _categoryRepository.GetAllAsync()).Select(c => new CategoryResponseDto(c.Id, c.Name, c.Description));
}