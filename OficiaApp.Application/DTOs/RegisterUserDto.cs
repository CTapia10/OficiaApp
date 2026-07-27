using System.ComponentModel.DataAnnotations;

namespace OficiaApp.Application.DTOs;

public record RegisterUserDto(
    [Required, MinLength(3), MaxLength(50)] string Username,
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MinLength(8), MaxLength(100)] string Password);
