using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Application.UseCases;

public class JobApplicationService : IJobApplicationService
{
    private readonly IUserRepository _userRepository;
    private readonly IJobRequestRepository _jobRequestRepository;
    private readonly IJobApplicationRepository _jobApplicationRepository;
    private readonly IJobContractRepository _jobContractRepository;
    private readonly IUnitOfWork _unitOfWork;
    // Server-side clamp: prevents an unbounded `take` from becoming a DoS / large-payload vector (.cursorrules §6.2).
    private const int DefaultPageSize = 10;
    private const int MaxPageSize = 50;

    public JobApplicationService(
        IUserRepository userRepository,
        IJobRequestRepository jobRequestRepository,
        IJobApplicationRepository jobApplicationRepository,
        IJobContractRepository jobContractRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jobRequestRepository = jobRequestRepository;
        _jobApplicationRepository = jobApplicationRepository;
        _jobContractRepository = jobContractRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobApplicationResponseDto> ApplyAsync(Guid userId, CreateJobApplicationDto dto)
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

        var jobRequest = await _jobRequestRepository.GetByIdAsync(dto.JobRequestId);
        if (jobRequest == null)
        {
            throw new ArgumentException("Job request not found", nameof(dto.JobRequestId));
        }
        if (jobRequest.Status != JobRequestStatus.Pending)
        {
            throw new InvalidOperationException("Cannot apply to a job request that is not pending.");
        }
        if (user.ClientProfile != null && user.ClientProfile.Id == jobRequest.ClientProfileId)
        {
            throw new InvalidOperationException("Cannot apply to your own job request.");
        }

        var alreadyApplied = await _jobApplicationRepository.ExistsAsync(jobRequest.Id, user.ProfessionalProfile.Id);
        if (alreadyApplied)
        {
            throw new InvalidOperationException("Already applied to this job request.");
        }

        var application = new JobApplication(jobRequest.Id, user.ProfessionalProfile.Id, dto.ProposedPrice);
        await _jobApplicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(application, user.Username);
    }

    public async Task<IEnumerable<JobApplicationResponseDto>> GetByJobRequestIdAsync(
        Guid userId,
        Guid jobRequestId,
        int take,
        int skip)
    {
        await EnsureOwningClientAsync(userId, jobRequestId);
        var (clampedTake, clampedSkip) = ClampPage(take, skip);
        var applications = await _jobApplicationRepository.GetByJobRequestIdAsync(jobRequestId, clampedTake, clampedSkip);
        return applications.Select(a => MapToDto(a, ResolveProfessionalUsername(a)));
    }

    public async Task<JobApplicationResponseDto> AcceptAsync(Guid userId, Guid applicationId)
    {
        var application = await _jobApplicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            throw new ArgumentException("Job application not found", nameof(applicationId));
        }

        await EnsureOwningClientAsync(userId, application.JobRequestId);

        var jobRequest = await _jobRequestRepository.GetByIdAsync(application.JobRequestId);
        if (jobRequest == null)
        {
            throw new ArgumentException("Job request not found", nameof(application.JobRequestId));
        }
        if (jobRequest.Status != JobRequestStatus.Pending)
        {
            throw new InvalidOperationException("Cannot accept an application for a job request that is not pending.");
        }

        var contractExists = await _jobContractRepository.ExistsForJobRequestAsync(jobRequest.Id);
        if (contractExists)
        {
            throw new InvalidOperationException("A contract already exists for this job request.");
        }

        var pending = await _jobApplicationRepository.GetPendingByJobRequestIdAsync(jobRequest.Id);
        application.Accept();
        foreach (var other in pending)
        {
            if (other.Id != application.Id)
            {
                other.Reject();
            }
        }

        jobRequest.Accept();
        var contract = new JobContract(jobRequest.Id, application.ProfessionalProfileId, application.ProposedPrice);
        await _jobContractRepository.AddAsync(contract);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(application, ResolveProfessionalUsername(application));
    }

    private async Task<User> EnsureOwningClientAsync(Guid userId, Guid jobRequestId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found", nameof(userId));
        }
        if (user.ClientProfile == null)
        {
            throw new InvalidOperationException("User does not have a client profile.");
        }

        var jobRequest = await _jobRequestRepository.GetByIdAsync(jobRequestId);
        if (jobRequest == null)
        {
            throw new ArgumentException("Job request not found", nameof(jobRequestId));
        }
        if (jobRequest.ClientProfileId != user.ClientProfile.Id)
        {
            throw new InvalidOperationException("User does not own this job request.");
        }

        return user;
    }

    private static JobApplicationResponseDto MapToDto(JobApplication application, string professionalUsername) =>
        new(
            application.Id,
            application.JobRequestId,
            application.ProfessionalProfileId,
            professionalUsername,
            application.ProposedPrice,
            application.Status.ToString(),
            application.CreatedAt);

    private static string ResolveProfessionalUsername(JobApplication application) =>
        application.ProfessionalProfile?.User?.Username ?? string.Empty;

    private static (int Take, int Skip) ClampPage(int take, int skip)
    {
        var clampedTake = take <= 0 ? DefaultPageSize : Math.Min(take, MaxPageSize);
        var clampedSkip = skip < 0 ? 0 : skip;
        return (clampedTake, clampedSkip);
    }
}
