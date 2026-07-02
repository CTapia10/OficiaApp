using OficiaApp.Domain.Common;
using System;

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

        private readonly List<string> _imagesurls = new List<string>();
        public IReadOnlyCollection<string> ImageUrls => _imagesurls.AsReadOnly();

        public void AddImageUrl(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                throw new ArgumentException("ImageUrl cannot be null, empty, or whitespace.", nameof(imageUrl));
            }
            if (_imagesurls.Contains(imageUrl))
            {
                return;
            }
            _imagesurls.Add(imageUrl);
        }

        public JobRequest(Guid clientProfileId, Guid categoryId, string title, string description)
        {
            ClientProfileId = clientProfileId;
            CategoryId = categoryId;
            Title = title;
            Description = description;
        }
    }
}
