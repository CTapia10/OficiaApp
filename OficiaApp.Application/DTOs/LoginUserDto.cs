using System.ComponentModel.DataAnnotations;

namespace OficiaApp.Application.DTOs;

public record LoginUserDto(
    [Required, EmailAddress] string Email,
    [Required] string Password);
