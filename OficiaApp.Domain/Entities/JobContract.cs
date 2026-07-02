using OficiaApp.Domain.Common;
using OficiaApp.Domain.Enums;
using System;

namespace OficiaApp.Domain.Entities
{
    public class JobContract : BaseEntity
    {
        public Guid JobRequestId { get; private set; }
        public JobRequest JobRequest { get; private set; } = null!;
        public Guid ProfessionalProfileId { get; private set; }
        public ProfessionalProfile ProfessionalProfile { get; private set; } = null!;
        public decimal AgreedPrice { get; private set; }
        public ContractStatus Status { get; private set; }

        public JobContract(Guid jobRequestId, Guid professionalProfileId, decimal agreedPrice)
        {
            JobRequestId = jobRequestId;
            ProfessionalProfileId = professionalProfileId;
            AgreedPrice = agreedPrice;
            Status = ContractStatus.Pending;
        }
    }
}
