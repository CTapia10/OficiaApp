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
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.ProfessionalProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

    }
}
