namespace OficiaApp.Application.DTOs;

public record ExploreProfessionalDto(Guid UserId, Guid ProfileId, string Username, string Bio, int YearsOfExperience, decimal HourlyRate, IEnumerable<CategorySummaryDto> Categories);