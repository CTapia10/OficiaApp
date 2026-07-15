using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;
using BCrypt.Net;

namespace OficiaApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public UserService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
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

        public async Task<AuthResponseDto> LoginAsync(LoginUserDto loginUserDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginUserDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
            {   
                throw new InvalidOperationException("Invalid credentials.");
            }
            var token = _tokenService.GenerateToken(user);
            return new AuthResponseDto(token, user.Username, user.Email);
        }
    }
}
