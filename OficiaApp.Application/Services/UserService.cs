using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;
using BCrypt.Net;

namespace OficiaApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task RegisterUserAsync(RegisterUserDto registerUserDto)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(registerUserDto.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("User with the same email already exists.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password);

            var newUser = new User(registerUserDto.Username,hashedPassword, registerUserDto.Email);
            await _userRepository.AddUserAsync(newUser);
        }
    }
}
