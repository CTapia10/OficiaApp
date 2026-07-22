using Microsoft.EntityFrameworkCore;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;
using OficiaApp.Infrastructure.Data;

namespace OficiaApp.Infrastructure.Persistence.Repositories;

public class JobRequestRepository : IJobRequestRepository
{
    private readonly ApplicationDbContext _context;

    public JobRequestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(JobRequest jobRequest)
    {
        await _context.JobRequests.AddAsync(jobRequest);
    }

    public async Task<IEnumerable<JobRequest>> GetOpenAsync()
    {
        return await _context.JobRequests
            .AsNoTracking()
            .Where(j => j.Status == JobRequestStatus.Pending)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }

    public async Task<JobRequest?> GetByIdAsync(Guid id)
    {
        return await _context.JobRequests.FirstOrDefaultAsync(j => j.Id == id);
    }
}
