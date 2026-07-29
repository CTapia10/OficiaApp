namespace OficiaApp.Application.DTOs;

public record PostResponseDto(
    Guid Id,
    Guid ProfessionalProfileId,
    string MediaUrl,
    string? Caption,
    DateTime CreatedAt,
    string AuthorUsername,
    string? AuthorPrimaryCategory);
