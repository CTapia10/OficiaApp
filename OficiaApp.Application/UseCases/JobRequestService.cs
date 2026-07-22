using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.UseCases;

public class JobRequestService : IJobRequestService
{
    private readonly IUserRepository _userRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IJobRequestRepository _jobRequestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public JobRequestService(
        IUserRepository userRepository,
        ICategoryRepository categoryRepository,
        IJobRequestRepository jobRequestRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _jobRequestRepository = jobRequestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobRequestResponseDto> CreateAsync(Guid userId, CreateJobRequestDto dto)
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

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null)
        {
            throw new ArgumentException("Category not found", nameof(dto.CategoryId));
        }

        var jobRequest = new JobRequest(user.ClientProfile.Id, dto.CategoryId, dto.Title, dto.Description);
        if (dto.ImageUrls != null)
        {
            foreach (var imageUrl in dto.ImageUrls)
            {
                jobRequest.AddImageUrl(imageUrl);
            }
        }

        await _jobRequestRepository.AddAsync(jobRequest);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(jobRequest);
    }

    public async Task<IEnumerable<JobRequestResponseDto>> GetOpenAsync()
    {
        var openRequests = await _jobRequestRepository.GetOpenAsync();
        return openRequests.Select(MapToDto);
    }

    private static JobRequestResponseDto MapToDto(JobRequest jobRequest) =>
        new(
            jobRequest.Id,
            jobRequest.ClientProfileId,
            jobRequest.CategoryId,
            jobRequest.Title,
            jobRequest.Description,
            jobRequest.Status.ToString(),
            jobRequest.ImageUrls.ToList(),
            jobRequest.CreatedAt);
}
