using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface IJobRequestService
{
    Task<JobRequestResponseDto> CreateAsync(Guid userId, CreateJobRequestDto dto);
    Task<IEnumerable<JobRequestResponseDto>> GetOpenAsync();
}
