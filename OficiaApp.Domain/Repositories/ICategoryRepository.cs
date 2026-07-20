using OficiaApp.Domain.Entities;

namespace OficiaApp.Domain.Repositories
{
    public interface ICategoryRepository
    {
    Task<Category?> GetByIdAsync(Guid id);

    Task<IEnumerable<Category>> GetAllAsync();
    }
}
