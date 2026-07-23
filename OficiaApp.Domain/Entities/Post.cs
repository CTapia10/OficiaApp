using OficiaApp.Domain.Common;

namespace OficiaApp.Domain.Entities;

public class Post : BaseEntity
{
    public const int MediaUrlMaxLength = 2048;
    public const int CaptionMaxLength = 500;

    public Guid ProfessionalProfileId { get; private set; }
    public ProfessionalProfile ProfessionalProfile { get; private set; } = null!;
    public string MediaUrl { get; private set; } = null!;
    public string? Caption { get; private set; }

    public Post(Guid professionalProfileId, string mediaUrl, string? caption) : base()
    {
        ProfessionalProfileId = professionalProfileId;
        SetMediaUrl(mediaUrl);
        SetCaption(caption);
    }

    public void SetMediaUrl(string mediaUrl)
    {
        if (string.IsNullOrWhiteSpace(mediaUrl))
        {
            throw new ArgumentException("Media URL cannot be null, empty, or whitespace.", nameof(mediaUrl));
        }

        if (mediaUrl.Length > MediaUrlMaxLength)
        {
            throw new ArgumentException($"Media URL cannot exceed {MediaUrlMaxLength} characters.", nameof(mediaUrl));
        }

        MediaUrl = mediaUrl;
    }

    public void SetCaption(string? caption)
    {
        if (string.IsNullOrWhiteSpace(caption))
        {
            Caption = null;
            return;
        }

        if (caption.Length > CaptionMaxLength)
        {
            throw new ArgumentException($"Caption cannot exceed {CaptionMaxLength} characters.", nameof(caption));
        }

        Caption = caption;
    }
}
