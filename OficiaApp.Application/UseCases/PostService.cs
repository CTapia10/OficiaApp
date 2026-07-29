using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.UseCases;

public class PostService : IPostService
{
    // Server-side clamp: prevents an unbounded `take` from becoming a DoS / large-payload vector (.cursorrules §6.2).
    private const int DefaultPageSize = 10;
    private const int MaxPageSize = 50;

    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;

    public PostService(IPostRepository postRepository, IUnitOfWork unitOfWork, IUserRepository userRepository){
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
    }

    public async Task<PostResponseDto> CreateAsync(Guid userId, CreatePostDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found", nameof(userId));
        }
        if (user.ProfessionalProfile == null)
        {
            throw new InvalidOperationException("User does not have a professional profile.");
        }
        var post = new Post(user.ProfessionalProfile.Id, dto.MediaUrl, dto.Caption);
        await _postRepository.AddAsync(post);
        await _unitOfWork.SaveChangesAsync();
        var primaryCategory = user.ProfessionalProfile.Categories.FirstOrDefault()?.Name;
        return MapToDto(post, user.Username, primaryCategory);
    }
    public async Task<FeedResultDto> GetFeedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int take)
    {
        var clampedTake = take <= 0 ? DefaultPageSize : Math.Min(take, MaxPageSize);
        var posts = await _postRepository.GetFeedAsync(cursorCreatedAt, cursorId, clampedTake);
        var items = posts
            .Select(p => MapToDto(p, p.ProfessionalProfile.User.Username, p.ProfessionalProfile.Categories.FirstOrDefault()?.Name))
            .ToList();
        DateTime? nextCreatedAt;
        Guid? nextId;
        if (posts.Count == 0 || posts.Count < clampedTake)
        {
            nextCreatedAt = null;
            nextId = null;
        } else {
            nextCreatedAt = posts.Last().CreatedAt;
            nextId = posts.Last().Id;
        }

        return new FeedResultDto(items.AsReadOnly(), nextCreatedAt, nextId);
    }
    private static PostResponseDto MapToDto(Post post, string authorUsername, string? authorPrimaryCategory) =>
    new(
        post.Id,
        post.ProfessionalProfileId,
        post.MediaUrl,
        post.Caption,
        post.CreatedAt,
        authorUsername,
        authorPrimaryCategory);
}