using Microsoft.EntityFrameworkCore;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;
using OficiaApp.Infrastructure.Data;

namespace OficiaApp.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Category?> GetByIdAsync(Guid id) => await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        public async Task<IEnumerable<Category>> GetAllAsync() => await _context.Categories.AsNoTracking().ToListAsync();
    }
}