using FluentAssertions;
using NSubstitute;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.UseCases;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Application.Tests.UseCases;

public class JobApplicationServiceTests
{
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IJobRequestRepository _jobRequestRepository = Substitute.For<IJobRequestRepository>();
    private readonly IJobApplicationRepository _jobApplicationRepository = Substitute.For<IJobApplicationRepository>();
    private readonly IJobContractRepository _jobContractRepository = Substitute.For<IJobContractRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly JobApplicationService _sut;

    public JobApplicationServiceTests()
    {
        _sut = new JobApplicationService(
            _userRepository,
            _jobRequestRepository,
            _jobApplicationRepository,
            _jobContractRepository,
            _unitOfWork);
    }

    [Fact]
    public async Task ApplyAsync_WhenUserHasNoProfessionalProfile_ThrowsInvalidOperationException()
    {
        var user = new User("client_only", "hash", "client@example.com");
        _userRepository.GetByIdAsync(user.Id).Returns(user);

        var act = () => _sut.ApplyAsync(user.Id, new CreateJobApplicationDto(Guid.NewGuid(), 1000m));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User does not have a professional profile.");
        await _jobApplicationRepository.DidNotReceive().AddAsync(Arg.Any<JobApplication>());
    }

    [Fact]
    public async Task ApplyAsync_WhenApplyingToOwnRequest_ThrowsInvalidOperationException()
    {
        var (user, profile) = CreateProfessional();
        var clientProfile = new ClientProfile(user.Id, "111");
        user.SetClientProfile(clientProfile);
        var request = new JobRequest(clientProfile.Id, Guid.NewGuid(), "Fix tap", "Leaking.");
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);

        var act = () => _sut.ApplyAsync(user.Id, new CreateJobApplicationDto(request.Id, 5000m));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Cannot apply to your own job request.");
        await _jobApplicationRepository.DidNotReceive().AddAsync(Arg.Any<JobApplication>());
    }

    [Fact]
    public async Task ApplyAsync_WhenRequestIsNotPending_ThrowsInvalidOperationException()
    {
        var (user, _) = CreateProfessional();
        var request = new JobRequest(Guid.NewGuid(), Guid.NewGuid(), "Fix tap", "Leaking.");
        request.Accept();
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);

        var act = () => _sut.ApplyAsync(user.Id, new CreateJobApplicationDto(request.Id, 5000m));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Cannot apply to a job request that is not pending.");
    }

    [Fact]
    public async Task ApplyAsync_WhenAlreadyApplied_ThrowsInvalidOperationException()
    {
        var (user, profile) = CreateProfessional();
        var request = new JobRequest(Guid.NewGuid(), Guid.NewGuid(), "Fix tap", "Leaking.");
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);
        _jobApplicationRepository.ExistsAsync(request.Id, profile.Id).Returns(true);

        var act = () => _sut.ApplyAsync(user.Id, new CreateJobApplicationDto(request.Id, 5000m));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Already applied to this job request.");
        await _jobApplicationRepository.DidNotReceive().AddAsync(Arg.Any<JobApplication>());
    }

    [Fact]
    public async Task ApplyAsync_WhenValid_AddsApplicationAndReturnsDto()
    {
        var (user, profile) = CreateProfessional();
        var request = new JobRequest(Guid.NewGuid(), Guid.NewGuid(), "Fix tap", "Leaking.");
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);
        _jobApplicationRepository.ExistsAsync(request.Id, profile.Id).Returns(false);

        var result = await _sut.ApplyAsync(user.Id, new CreateJobApplicationDto(request.Id, 8500m));

        await _jobApplicationRepository.Received(1).AddAsync(Arg.Is<JobApplication>(a =>
            a != null &&
            a.JobRequestId == request.Id &&
            a.ProfessionalProfileId == profile.Id &&
            a.ProposedPrice == 8500m &&
            a.Status == JobApplicationStatus.Pending));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
        result.ProfessionalUsername.Should().Be("pro_user");
        result.ProposedPrice.Should().Be(8500m);
        result.Status.Should().Be(nameof(JobApplicationStatus.Pending));
        result.JobRequestId.Should().Be(request.Id);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task GetByJobRequestIdAsync_WhenTakeIsZeroOrNegative_ClampsToDefaultPageSize(int take)
    {
        var (user, request) = CreateOwningClient();
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);
        _jobApplicationRepository.GetByJobRequestIdAsync(Arg.Any<Guid>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobApplication>());

        await _sut.GetByJobRequestIdAsync(user.Id, request.Id, take, skip: 0);

        await _jobApplicationRepository.Received(1).GetByJobRequestIdAsync(request.Id, 10, 0);
    }

    [Fact]
    public async Task GetByJobRequestIdAsync_WhenTakeExceedsMax_ClampsToMaxPageSize()
    {
        var (user, request) = CreateOwningClient();
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);
        _jobApplicationRepository.GetByJobRequestIdAsync(Arg.Any<Guid>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(Array.Empty<JobApplication>());

        await _sut.GetByJobRequestIdAsync(user.Id, request.Id, 999, skip: 0);

        await _jobApplicationRepository.Received(1).GetByJobRequestIdAsync(request.Id, 50, 0);
    }

    [Fact]
    public async Task GetByJobRequestIdAsync_WhenUserDoesNotOwnRequest_ThrowsInvalidOperationException()
    {
        var (user, _) = CreateOwningClient();
        var foreignRequest = new JobRequest(Guid.NewGuid(), Guid.NewGuid(), "Other", "Not mine.");
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobRequestRepository.GetByIdAsync(foreignRequest.Id).Returns(foreignRequest);

        var act = () => _sut.GetByJobRequestIdAsync(user.Id, foreignRequest.Id, 10, 0);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User does not own this job request.");
    }

    [Fact]
    public async Task AcceptAsync_WhenUserDoesNotOwnRequest_ThrowsInvalidOperationException()
    {
        var (user, _) = CreateOwningClient();
        var foreignRequest = new JobRequest(Guid.NewGuid(), Guid.NewGuid(), "Other", "Not mine.");
        var application = new JobApplication(foreignRequest.Id, Guid.NewGuid(), 2000m);
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobApplicationRepository.GetByIdAsync(application.Id).Returns(application);
        _jobRequestRepository.GetByIdAsync(foreignRequest.Id).Returns(foreignRequest);

        var act = () => _sut.AcceptAsync(user.Id, application.Id);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User does not own this job request.");
        await _jobContractRepository.DidNotReceive().AddAsync(Arg.Any<JobContract>());
    }

    [Fact]
    public async Task AcceptAsync_WhenValid_CreatesContractAcceptsRequestAndRejectsOthers()
    {
        var (user, request) = CreateOwningClient();
        var chosen = new JobApplication(request.Id, Guid.NewGuid(), 9000m);
        var other = new JobApplication(request.Id, Guid.NewGuid(), 11000m);
        _userRepository.GetByIdAsync(user.Id).Returns(user);
        _jobApplicationRepository.GetByIdAsync(chosen.Id).Returns(chosen);
        _jobRequestRepository.GetByIdAsync(request.Id).Returns(request);
        _jobContractRepository.ExistsForJobRequestAsync(request.Id).Returns(false);
        _jobApplicationRepository.GetPendingByJobRequestIdAsync(request.Id)
            .Returns(new[] { chosen, other });

        var result = await _sut.AcceptAsync(user.Id, chosen.Id);

        chosen.Status.Should().Be(JobApplicationStatus.Accepted);
        other.Status.Should().Be(JobApplicationStatus.Rejected);
        request.Status.Should().Be(JobRequestStatus.Accepted);
        await _jobContractRepository.Received(1).AddAsync(Arg.Is<JobContract>(c =>
            c != null &&
            c.JobRequestId == request.Id &&
            c.ProfessionalProfileId == chosen.ProfessionalProfileId &&
            c.AgreedPrice == 9000m));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
        result.Status.Should().Be(nameof(JobApplicationStatus.Accepted));
        result.Id.Should().Be(chosen.Id);
    }

    private static (User User, ProfessionalProfile Profile) CreateProfessional()
    {
        var user = new User("pro_user", "hash", "pro@example.com");
        var profile = new ProfessionalProfile(user.Id, "Bio", 5, 25m);
        user.SetProfessionalProfile(profile);
        return (user, profile);
    }

    private static (User User, JobRequest Request) CreateOwningClient()
    {
        var user = new User("client_user", "hash", "client@example.com");
        var clientProfile = new ClientProfile(user.Id, "222");
        user.SetClientProfile(clientProfile);
        var request = new JobRequest(clientProfile.Id, Guid.NewGuid(), "Fix tap", "Leaking.");
        return (user, request);
    }
}
