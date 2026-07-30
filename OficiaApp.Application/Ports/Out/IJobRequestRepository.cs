using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IJobRequestRepository
{
    Task AddAsync(JobRequest jobRequest);
    Task<IReadOnlyList<JobRequest>> GetOpenAsync();
    Task<JobRequest?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<JobRequest>> GetByClientProfileIdAsync(Guid clientProfileId, int take, int skip);
}
