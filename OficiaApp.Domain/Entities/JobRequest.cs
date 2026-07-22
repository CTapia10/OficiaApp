using OficiaApp.Domain.Common;
using OficiaApp.Domain.Enums;

namespace OficiaApp.Domain.Entities
{
    public class JobRequest : BaseEntity
    {
        public Guid ClientProfileId { get; private set; }
        public ClientProfile ClientProfile { get; private set; } = null!;
        public Guid CategoryId { get; private set; }
        public Category Category { get; private set; } = null!;
        public string Title { get; private set; }
        public string Description { get; private set; }
        public JobRequestStatus Status { get; private set; } = JobRequestStatus.Pending;
        private readonly List<string> _imagesUrls = new List<string>();
        public IReadOnlyCollection<string> ImageUrls => _imagesUrls.AsReadOnly();

        public JobRequest(Guid clientProfileId, Guid categoryId, string title, string description) : base()
        {
            ClientProfileId = clientProfileId;
            CategoryId = categoryId;
            Title = SetTitle(title);
            Description = SetDescription(description);
        }

        public string SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new ArgumentException("Title cannot be null, empty, or whitespace.", nameof(title));
            }
            return title;
        }
        public string SetDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                throw new ArgumentException("Description cannot be null, empty, or whitespace.", nameof(description));
            }
            return description;
        }

        public void AddImageUrl(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                throw new ArgumentException("ImageUrl cannot be null, empty, or whitespace.", nameof(imageUrl));
            }
            if (_imagesUrls.Contains(imageUrl))
            {
                return;
            }
            _imagesUrls.Add(imageUrl);
        }

        public void Accept()
        {
            if (Status != JobRequestStatus.Pending)
            {
                throw new InvalidOperationException("Cannot accept a job request that is not pending.");
            }
            Status = JobRequestStatus.Accepted;
        }
        
        public void Start()
        {
            if (Status != JobRequestStatus.Accepted)
            {
                throw new InvalidOperationException("Cannot start a job request that is not accepted.");
            }
            Status = JobRequestStatus.InProgress;
        }

        public void Complete()
        {
            if (Status != JobRequestStatus.InProgress)
            {
                throw new InvalidOperationException("Cannot complete a job request that is not in progress.");
            }
            Status = JobRequestStatus.Completed;
        }

        public void Cancel()
        {
            if (Status != JobRequestStatus.Pending && Status != JobRequestStatus.InProgress && Status != JobRequestStatus.Accepted)
            {
                throw new InvalidOperationException("Cannot cancel a job request that is not pending, in progress, or accepted.");
            }
            Status = JobRequestStatus.Cancelled;
        }

        public void Reject()
        {
            if (Status != JobRequestStatus.Pending)
            {
                throw new InvalidOperationException("Cannot reject a job request that is not pending.");
            }
            Status = JobRequestStatus.Rejected;
        }
    }
}
