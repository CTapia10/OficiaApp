using Microsoft.EntityFrameworkCore;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Infrastructure.Data;

namespace OficiaApp.Infrastructure.Persistence.Repositories;

public class JobContractRepository : IJobContractRepository
{
    private readonly ApplicationDbContext _context;

    public JobContractRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(JobContract contract)
    {
        await _context.JobContracts.AddAsync(contract);
    }

    public async Task<bool> ExistsForJobRequestAsync(Guid jobRequestId)
    {
        return await _context.JobContracts
            .AsNoTracking()
            .AnyAsync(c => c.JobRequestId == jobRequestId);
    }
}
