namespace OficiaApp.Application.DTOs;

public record JobRequestResponseDto(
    Guid Id,
    Guid ClientProfileId,
    Guid CategoryId,
    string Title,
    string Description,
    string Status,
    IReadOnlyList<string> ImageUrls,
    DateTime CreatedAt);
