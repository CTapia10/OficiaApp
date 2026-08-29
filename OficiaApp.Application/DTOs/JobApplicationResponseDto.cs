namespace OficiaApp.Application.DTOs;

public record JobApplicationResponseDto(
    Guid Id,
    Guid JobRequestId,
    Guid ProfessionalProfileId,
    string ProfessionalUsername,
    decimal ProposedPrice,
    string Status,
    DateTime CreatedAt);
