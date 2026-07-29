using System.Reflection;
using FluentAssertions;
using NSubstitute;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.UseCases;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Tests.UseCases;

public class PostServiceTests
{
    private readonly IPostRepository _postRepository = Substitute.For<IPostRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly PostService _sut;

    public PostServiceTests()
    {
        _sut = new PostService(_postRepository, _unitOfWork, _userRepository);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task GetFeedAsync_WhenTakeIsZeroOrNegative_ClampsToDefaultPageSize(int take)
    {
        _postRepository.GetFeedAsync(null, null, Arg.Any<int>())
            .Returns(Array.Empty<Post>());

        await _sut.GetFeedAsync(null, null, take);

        await _postRepository.Received(1).GetFeedAsync(null, null, 10);
    }

    [Fact]
    public async Task GetFeedAsync_WhenTakeExceedsMax_ClampsToMaxPageSize()
    {
        _postRepository.GetFeedAsync(null, null, Arg.Any<int>())
            .Returns(Array.Empty<Post>());

        await _sut.GetFeedAsync(null, null, 999);

        await _postRepository.Received(1).GetFeedAsync(null, null, 50);
    }

    [Fact]
    public async Task GetFeedAsync_WhenPageIsFull_ReturnsNextCursor()
    {
        var posts = CreateFeedPosts(count: 10);
        _postRepository.GetFeedAsync(null, null, 10).Returns(posts);

        var result = await _sut.GetFeedAsync(null, null, 10);

        var last = posts[^1];
        result.NextCursorCreatedAt.Should().Be(last.CreatedAt);
        result.NextCursorId.Should().Be(last.Id);
        result.Items.Should().HaveCount(10);
        result.Items[0].AuthorUsername.Should().Be("pro_user");
        result.Items[0].AuthorPrimaryCategory.Should().Be("Plumbing");
    }

    [Fact]
    public async Task GetFeedAsync_WhenPageIsShort_ReturnsNullCursor()
    {
        var posts = CreateFeedPosts(count: 3);
        _postRepository.GetFeedAsync(null, null, 10).Returns(posts);

        var result = await _sut.GetFeedAsync(null, null, 10);

        result.NextCursorCreatedAt.Should().BeNull();
        result.NextCursorId.Should().BeNull();
        result.Items.Should().HaveCount(3);
    }

    [Fact]
    public async Task CreateAsync_WhenUserNotFound_ThrowsArgumentException()
    {
        var userId = Guid.NewGuid();
        _userRepository.GetByIdAsync(userId).Returns((User?)null);

        var act = () => _sut.CreateAsync(userId, new CreatePostDto("https://cdn.example.com/a.jpg", "caption"));

        await act.Should().ThrowAsync<ArgumentException>()
            .WithParameterName("userId");
    }

    [Fact]
    public async Task CreateAsync_WhenUserHasNoProfessionalProfile_ThrowsInvalidOperationException()
    {
        var user = new User("client_only", "hash", "client@example.com");
        _userRepository.GetByIdAsync(user.Id).Returns(user);

        var act = () => _sut.CreateAsync(user.Id, new CreatePostDto("https://cdn.example.com/a.jpg", "caption"));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User does not have a professional profile.");
        await _postRepository.DidNotReceive().AddAsync(Arg.Any<Post>());
    }

    [Fact]
    public async Task CreateAsync_WhenUserIsProfessional_AddsPostSavesAndReturnsDto()
    {
        var user = new User("pro_user", "hash", "pro@example.com");
        var profile = new ProfessionalProfile(user.Id, "Bio", 5, 25m);
        profile.AddCategory(new Category("Plumbing", "Pipes and taps"));
        user.SetProfessionalProfile(profile);
        _userRepository.GetByIdAsync(user.Id).Returns(user);

        var dto = new CreatePostDto("https://cdn.example.com/job.jpg", "Finished kitchen");

        var result = await _sut.CreateAsync(user.Id, dto);

        await _postRepository.Received(1).AddAsync(Arg.Is<Post>(p =>
            p != null &&
            p.ProfessionalProfileId == profile.Id &&
            p.MediaUrl == dto.MediaUrl &&
            p.Caption == dto.Caption));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
        result.AuthorUsername.Should().Be("pro_user");
        result.AuthorPrimaryCategory.Should().Be("Plumbing");
        result.MediaUrl.Should().Be(dto.MediaUrl);
        result.Caption.Should().Be(dto.Caption);
    }

    private static IReadOnlyList<Post> CreateFeedPosts(int count)
    {
        var user = new User("pro_user", "hash", "pro@example.com");
        var profile = new ProfessionalProfile(user.Id, "Bio", 3, 40m);
        profile.AddCategory(new Category("Plumbing", "Pipes and taps"));
        SetNavigation(profile, nameof(ProfessionalProfile.User), user);

        var posts = new List<Post>(count);
        for (var i = 0; i < count; i++)
        {
            var post = new Post(profile.Id, $"https://cdn.example.com/{i}.jpg", $"Caption {i}");
            SetNavigation(post, nameof(Post.ProfessionalProfile), profile);
            posts.Add(post);
        }

        return posts;
    }

    private static void SetNavigation(object target, string propertyName, object value)
    {
        var property = target.GetType().GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public)
            ?? throw new InvalidOperationException($"Property '{propertyName}' not found on {target.GetType().Name}.");
        property.SetValue(target, value);
    }
}
