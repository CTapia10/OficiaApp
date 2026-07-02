using OficiaApp.Domain.Common;
using System;

namespace OficiaApp.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid JobContractId { get; private set; }
        public JobContract JobContract { get; private set; } = null!;
        public int Rating { get; private set; }
        public string Comment { get; private set; }

        public Review(Guid jobContractId, int rating, string comment)
        {
            JobContractId = jobContractId;
            Rating = rating;
            Comment = comment;
        }
    }
}
