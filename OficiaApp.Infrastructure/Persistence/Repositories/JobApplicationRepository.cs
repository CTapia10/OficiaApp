using Microsoft.EntityFrameworkCore;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Enums;
using OficiaApp.Infrastructure.Data;

namespace OficiaApp.Infrastructure.Persistence.Repositories;

public class JobApplicationRepository : IJobApplicationRepository
{
    private readonly ApplicationDbContext _context;

    public JobApplicationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(JobApplication application)
    {
        await _context.JobApplications.AddAsync(application);
    }

    public async Task<JobApplication?> GetByIdAsync(Guid id)
    {
        return await _context.JobApplications
            .Include(a => a.ProfessionalProfile)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<bool> ExistsAsync(Guid jobRequestId, Guid professionalProfileId)
    {
        return await _context.JobApplications
            .AsNoTracking()
            .AnyAsync(a => a.JobRequestId == jobRequestId && a.ProfessionalProfileId == professionalProfileId);
    }

    public async Task<IReadOnlyList<JobApplication>> GetByJobRequestIdAsync(Guid jobRequestId, int take, int skip)
    {
        return await _context.JobApplications
            .AsNoTracking()
            .Include(a => a.ProfessionalProfile)
                .ThenInclude(p => p.User)
            .Where(a => a.JobRequestId == jobRequestId)
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<JobApplication>> GetPendingByJobRequestIdAsync(Guid jobRequestId)
    {
        return await _context.JobApplications
            .Where(a => a.JobRequestId == jobRequestId && a.Status == JobApplicationStatus.Pending)
            .ToListAsync();
    }
}
