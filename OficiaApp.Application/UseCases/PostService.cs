using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.UseCases;

public class PostService : IPostService
{
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
        return MapToDto(post);
    }
    public async Task<FeedResultDto> GetFeedAsync(DateTime? cursorCreatedAt, Guid? cursorId, int take)
    {
        var posts = await _postRepository.GetFeedAsync(cursorCreatedAt, cursorId, take);
        var items = posts.Select(MapToDto).ToList();
        DateTime? nextCreatedAt;
        Guid? nextId;
        if (posts.Count == 0 || posts.Count < take) 
        {
            nextCreatedAt = null;
            nextId = null;
        } else {
            nextCreatedAt = posts.Last().CreatedAt;
            nextId = posts.Last().Id;
        }

        return new FeedResultDto(items.AsReadOnly(), nextCreatedAt, nextId);
    }
    private static PostResponseDto MapToDto(Post post) =>
    new(
        post.Id,
        post.ProfessionalProfileId,
        post.MediaUrl,
        post.Caption,
        post.CreatedAt);



}