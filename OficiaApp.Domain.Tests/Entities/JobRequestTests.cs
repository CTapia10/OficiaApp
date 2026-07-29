using FluentAssertions;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Domain.Tests.Entities;

public class JobRequestTests
{
    private static JobRequest CreateValidRequest() =>
        new(Guid.NewGuid(), Guid.NewGuid(), "Fix a leaky faucet", "Need a plumber this week.");

    [Fact]
    public void Constructor_WithValidArgs_SetsPendingStatusAndFields()
    {
        var clientProfileId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();

        var request = new JobRequest(clientProfileId, categoryId, "Install shelves", "Wall mounting job.");

        request.ClientProfileId.Should().Be(clientProfileId);
        request.CategoryId.Should().Be(categoryId);
        request.Title.Should().Be("Install shelves");
        request.Description.Should().Be("Wall mounting job.");
        request.Status.Should().Be(JobRequestStatus.Pending);
        request.ImageUrls.Should().BeEmpty();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void SetTitle_WhenNullOrWhitespace_ThrowsArgumentException(string? title)
    {
        var request = CreateValidRequest();

        var act = () => request.SetTitle(title!);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("title");
    }

    [Fact]
    public void SetTitle_WhenExceedsMaxLength_ThrowsArgumentException()
    {
        var request = CreateValidRequest();
        var tooLong = new string('a', JobRequest.TitleMaxLength + 1);

        var act = () => request.SetTitle(tooLong);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("title");
    }

    [Fact]
    public void SetTitle_WhenValid_UpdatesTitle()
    {
        var request = CreateValidRequest();

        request.SetTitle("Updated title");

        request.Title.Should().Be("Updated title");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void SetDescription_WhenNullOrWhitespace_ThrowsArgumentException(string? description)
    {
        var request = CreateValidRequest();

        var act = () => request.SetDescription(description!);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("description");
    }

    [Fact]
    public void SetDescription_WhenExceedsMaxLength_ThrowsArgumentException()
    {
        var request = CreateValidRequest();
        var tooLong = new string('b', JobRequest.DescriptionMaxLength + 1);

        var act = () => request.SetDescription(tooLong);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("description");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void AddImageUrl_WhenNullOrWhitespace_ThrowsArgumentException(string? imageUrl)
    {
        var request = CreateValidRequest();

        var act = () => request.AddImageUrl(imageUrl!);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("imageUrl");
    }

    [Fact]
    public void AddImageUrl_WhenExceedsMaxLength_ThrowsArgumentException()
    {
        var request = CreateValidRequest();
        var tooLong = new string('c', JobRequest.ImageUrlsMaxLength + 1);

        var act = () => request.AddImageUrl(tooLong);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("imageUrl");
    }

    [Fact]
    public void AddImageUrl_WhenDuplicate_DoesNotAddTwice()
    {
        var request = CreateValidRequest();
        const string url = "https://cdn.example.com/a.jpg";

        request.AddImageUrl(url);
        request.AddImageUrl(url);

        request.ImageUrls.Should().ContainSingle().Which.Should().Be(url);
    }

    [Fact]
    public void AddImageUrl_WhenAtMaxCount_ThrowsArgumentException()
    {
        var request = CreateValidRequest();
        for (var i = 0; i < JobRequest.MaxImagesUrls; i++)
        {
            request.AddImageUrl($"https://cdn.example.com/{i}.jpg");
        }

        var act = () => request.AddImageUrl("https://cdn.example.com/overflow.jpg");

        act.Should().Throw<ArgumentException>()
            .WithParameterName("imageUrl");
        request.ImageUrls.Should().HaveCount(JobRequest.MaxImagesUrls);
    }

    [Fact]
    public void Accept_WhenPending_SetsAccepted()
    {
        var request = CreateValidRequest();

        request.Accept();

        request.Status.Should().Be(JobRequestStatus.Accepted);
    }

    [Fact]
    public void Accept_WhenNotPending_ThrowsInvalidOperationException()
    {
        var request = CreateValidRequest();
        request.Accept();

        var act = () => request.Accept();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot accept a job request that is not pending.");
    }
}
