using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface IJobContractRepository
{
    Task AddAsync(JobContract contract);
    Task<bool> ExistsForJobRequestAsync(Guid jobRequestId);
}
