using NSubstitute;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.UseCases;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Tests.UseCases;

public class JobRequestServiceTests
{
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly ICategoryRepository _categoryRepository = Substitute.For<ICategoryRepository>();
    private readonly IJobRequestRepository _jobRequestRepository = Substitute.For<IJobRequestRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly JobRequestService _sut;

    public JobRequestServiceTests()
    {
        _sut = new JobRequestService(_userRepository, _categoryRepository, _jobRequestRepository, _unitOfWork);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task GetOpenAsync_WhenTakeIsZeroOrNegative_ClampsToDefaultPageSize(int take)
    {
        _jobRequestRepository.GetOpenAsync(Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobRequest>());

        await _sut.GetOpenAsync(take, skip: 0);

        await _jobRequestRepository.Received(1).GetOpenAsync(10, 0);
    }

    [Fact]
    public async Task GetOpenAsync_WhenTakeExceedsMax_ClampsToMaxPageSize()
    {
        _jobRequestRepository.GetOpenAsync(Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobRequest>());

        await _sut.GetOpenAsync(999, skip: 0);

        await _jobRequestRepository.Received(1).GetOpenAsync(50, 0);
    }

    [Fact]
    public async Task GetOpenAsync_WhenTakeIsInRange_PassesTakeThrough()
    {
        _jobRequestRepository.GetOpenAsync(Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobRequest>());

        await _sut.GetOpenAsync(25, skip: 0);

        await _jobRequestRepository.Received(1).GetOpenAsync(25, 0);
    }

    [Fact]
    public async Task GetOpenAsync_WhenSkipIsNegative_ClampsToZero()
    {
        _jobRequestRepository.GetOpenAsync(Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobRequest>());

        await _sut.GetOpenAsync(take: 10, skip: -5);

        await _jobRequestRepository.Received(1).GetOpenAsync(10, 0);
    }
}
