using OficiaApp.Application.Ports.Out;
using OficiaApp.Infrastructure.Data;
using OficiaApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace OficiaApp.Infrastructure.Persistence.Repositories;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _context;

    public PostRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Post post)
    {
        await _context.Posts.AddAsync(post);
    }

    public async Task<IReadOnlyList<Post>> GetFeedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int take)
    {
        IQueryable<Post> query = _context.Posts
            .AsNoTracking()
            .Include(p => p.ProfessionalProfile)
                .ThenInclude(pp => pp.User)
            .Include(p => p.ProfessionalProfile)
                .ThenInclude(pp => pp.Categories);

        if (cursorCreatedAt.HasValue && cursorId.HasValue)
        {
            query = query.Where(p =>
                p.CreatedAt < cursorCreatedAt.Value ||
                (p.CreatedAt == cursorCreatedAt.Value && p.Id.CompareTo(cursorId.Value) < 0));
        }

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id)
            .Take(take)
            .ToListAsync();
    }
}
