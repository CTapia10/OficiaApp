using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Ports.In;

public interface IUserService
{
    Task RegisterUserAsync(RegisterUserDto registerUserDto);
    Task<AuthResponseDto> LoginAsync(LoginUserDto loginUserDto);
}
