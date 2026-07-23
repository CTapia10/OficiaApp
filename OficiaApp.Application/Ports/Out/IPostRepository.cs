using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IPostRepository
{
    Task AddAsync(Post post);
    Task<IReadOnlyList<Post>> GetFeedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int take);
}