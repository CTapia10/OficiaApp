using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task AddUserAsync(User user);
    Task<User?> GetByIdAsync(Guid id);
    Task UpdateAsync(User user);
    Task<IEnumerable<User>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate);
}
