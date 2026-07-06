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
    }
}
