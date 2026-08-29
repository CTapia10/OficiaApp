using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface IJobApplicationService
{
    Task<JobApplicationResponseDto> ApplyAsync(Guid userId, CreateJobApplicationDto dto);
    Task<IEnumerable<JobApplicationResponseDto>> GetByJobRequestIdAsync(Guid userId, Guid jobRequestId, int take, int skip);
    Task<JobApplicationResponseDto> AcceptAsync(Guid userId, Guid applicationId);
}
