using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IJobRequestRepository
{
    Task AddAsync(JobRequest jobRequest);
    Task<IEnumerable<JobRequest>> GetOpenAsync();
    Task<JobRequest?> GetByIdAsync(Guid id);
}
