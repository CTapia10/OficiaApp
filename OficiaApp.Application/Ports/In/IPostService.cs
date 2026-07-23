using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface IPostService
{
    Task<PostResponseDto> CreateAsync(Guid userId, CreatePostDto dto);
    Task<FeedResultDto> GetFeedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int take);
}
