using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IJobApplicationRepository
{
    Task AddAsync(JobApplication application);
    Task<JobApplication?> GetByIdAsync(Guid id);
    Task<bool> ExistsAsync(Guid jobRequestId, Guid professionalProfileId);
    Task<IReadOnlyList<JobApplication>> GetByJobRequestIdAsync(Guid jobRequestId, int take, int skip);
    Task<IReadOnlyList<JobApplication>> GetPendingByJobRequestIdAsync(Guid jobRequestId);
}
