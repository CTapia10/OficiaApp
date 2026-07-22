namespace OficiaApp.Application.DTOs;

public record CreateJobRequestDto(
    Guid CategoryId,
    string Title,
    string Description,
    IReadOnlyList<string>? ImageUrls = null);
