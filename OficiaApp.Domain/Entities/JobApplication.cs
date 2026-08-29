using OficiaApp.Domain.Common;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Domain.Entities;

public class JobApplication : BaseEntity
{
    public Guid JobRequestId { get; private set; }
    public JobRequest JobRequest { get; private set; } = null!;
    public Guid ProfessionalProfileId { get; private set; }
    public ProfessionalProfile ProfessionalProfile { get; private set; } = null!;
    public decimal ProposedPrice { get; private set; }
    public JobApplicationStatus Status { get; private set; }

    public JobApplication(Guid jobRequestId, Guid professionalProfileId, decimal proposedPrice)
    {
        if (proposedPrice <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(proposedPrice), "Proposed price must be greater than zero.");
        }

        JobRequestId = jobRequestId;
        ProfessionalProfileId = professionalProfileId;
        ProposedPrice = proposedPrice;
        Status = JobApplicationStatus.Pending;
    }

    public void Accept()
    {
        if (Status != JobApplicationStatus.Pending)
        {
            throw new InvalidOperationException("Cannot accept a job application that is not pending.");
        }

        Status = JobApplicationStatus.Accepted;
    }

    public void Reject()
    {
        if (Status != JobApplicationStatus.Pending)
        {
            throw new InvalidOperationException("Cannot reject a job application that is not pending.");
        }

        Status = JobApplicationStatus.Rejected;
    }
}
