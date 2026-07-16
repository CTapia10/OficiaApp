using OficiaApp.Domain.Repositories;
using OficiaApp.Domain.Entities;
using OficiaApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace OficiaApp.Infrastructure.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            // User is already tracked after GetByIdAsync — do not call Users.Update(user).
            // BaseEntity assigns Id = Guid.NewGuid() in the ctor, so EF often tracks brand-new
            // dependents as Modified (UPDATE) instead of Added (INSERT). Force Added when missing in DB.
            await EnsureNewDependentIsInsertedAsync(user.ClientProfile);
            await EnsureNewDependentIsInsertedAsync(user.ProfessionalProfile);

            await _context.SaveChangesAsync();
        }

        private async Task EnsureNewDependentIsInsertedAsync<TEntity>(TEntity? entity) where TEntity : class
        {
            if (entity is null)
            {
                return;
            }

            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Added)
            {
                return;
            }

            if (entry.State == EntityState.Detached)
            {
                _context.Set<TEntity>().Add(entity);
                return;
            }

            var databaseValues = await entry.GetDatabaseValuesAsync();
            if (databaseValues is null)
            {
                entry.State = EntityState.Added;
            }
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.ProfessionalProfile)
                    .ThenInclude(p => p.Categories)
                .Include(u => u.ClientProfile)
                .FirstOrDefaultAsync(u => u.Id == id);

        }

        public async Task<IEnumerable<User>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate)
        {
            var query = _context.Users
                .Include(u => u.ProfessionalProfile)
                    .ThenInclude(p => p.Categories)
                .Where(u => u.ProfessionalProfile != null) // <-- ESTO ES CLAVE
                .AsNoTracking();

            if (categoryId.HasValue)
            {
                query = query.Where(u => u.ProfessionalProfile!.Categories.Any(c => c.Id == categoryId.Value));
            }

            if (maxHourlyRate.HasValue)
            {
                query = query.Where(u => u.ProfessionalProfile!.HourlyRate <= maxHourlyRate.Value);
            }

            return await query.ToListAsync();
        }
    }
}
