using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IJobRequestRepository
{
    Task AddAsync(JobRequest jobRequest);
    Task<IReadOnlyList<JobRequest>> GetOpenAsync(int take, int skip);
    Task<JobRequest?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<JobRequest>> GetByClientProfileIdAsync(Guid clientProfileId, int take, int skip);
}
