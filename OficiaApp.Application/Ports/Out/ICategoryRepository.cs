using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id);
    Task<IEnumerable<Category>> GetAllAsync();
}
