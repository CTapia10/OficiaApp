using OficiaApp.Domain.Entities;

namespace OficiaApp.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);

        Task AddUserAsync(User user);

        Task<User?> GetByIdAsync(Guid id);
        Task UpdateAsync(User user);
    }
}
