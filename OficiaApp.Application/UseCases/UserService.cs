using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.UseCases;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(
        IUserRepository userRepository,
        ITokenService tokenService,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task RegisterUserAsync(RegisterUserDto registerUserDto)
    {
        var existingUser = await _userRepository.GetUserByEmailAsync(registerUserDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with the same email already exists.");
        }

        var hashedPassword = _passwordHasher.Hash(registerUserDto.Password);
        var newUser = new User(registerUserDto.Username, hashedPassword, registerUserDto.Email);
        await _userRepository.AddUserAsync(newUser);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<AuthResponseDto> LoginAsync(LoginUserDto loginUserDto)
    {
        var user = await _userRepository.GetUserByEmailAsync(loginUserDto.Email);
        if (user == null || !_passwordHasher.Verify(loginUserDto.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid credentials.");
        }

        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto(token, user.Username, user.Email);
    }
}
