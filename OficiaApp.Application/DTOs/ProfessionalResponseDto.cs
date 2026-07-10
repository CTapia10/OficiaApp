

namespace OficiaApp.Application.DTOs;

public record ProfessionalResponseDto(Guid Id, string Username, string Bio, int YearsOfExperience, decimal HourlyRate, IEnumerable<string> Categories);

