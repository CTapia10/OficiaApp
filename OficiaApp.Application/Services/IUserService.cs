using OficiaApp.Application.DTOs;

namespace OficiaApp.Application.Services
{
    public interface IUserService
    {
        Task RegisterUserAsync(RegisterUserDto registerUserDto);
    }
}
