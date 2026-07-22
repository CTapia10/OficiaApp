using OficiaApp.Domain.Common;

namespace OficiaApp.Domain.Entities;

public class Review : BaseEntity
{
    public Guid JobContractId { get; private set; }
    public JobContract JobContract { get; private set; } = null!;
    public int Rating { get; private set; }
    public string Comment { get; private set; } = null!;

    public Review(Guid jobContractId, int rating, string comment)
    {
        JobContractId = jobContractId;
        UpdateReview(rating, comment);
    }

    public void UpdateReview(int rating, string comment)
    {
        if (rating < 1 || rating > 5)
        {
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5.");
        }
        Rating = rating;
        Comment = comment;
    }
}
