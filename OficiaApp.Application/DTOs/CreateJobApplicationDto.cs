using System.ComponentModel.DataAnnotations;

namespace OficiaApp.Application.DTOs;

public record CreateJobApplicationDto(
    [Required] Guid JobRequestId,
    [Range(typeof(decimal), "0.01", "9999999.99")] decimal ProposedPrice);
