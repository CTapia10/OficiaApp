using FluentAssertions;
using NSubstitute;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.UseCases;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Tests.UseCases;

public class UserServiceTests
{
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IPasswordHasher _passwordHasher = Substitute.For<IPasswordHasher>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _sut = new UserService(_userRepository, _passwordHasher, _unitOfWork);
    }

    [Fact]
    public async Task RegisterUserAsync_WhenEmailExists_ThrowsInvalidOperationException()
    {
        var dto = new RegisterUserDto("alice", "alice@example.com", "password123");
        _userRepository.GetUserByEmailAsync(dto.Email)
            .Returns(new User("existing", "hash", dto.Email));

        var act = () => _sut.RegisterUserAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User with the same email already exists.");
        await _userRepository.DidNotReceive().AddUserAsync(Arg.Any<User>());
        await _unitOfWork.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task RegisterUserAsync_WhenEmailIsNew_HashesPasswordAddsUserAndSaves()
    {
        var dto = new RegisterUserDto("bob", "bob@example.com", "password123");
        _userRepository.GetUserByEmailAsync(dto.Email).Returns((User?)null);
        _passwordHasher.Hash(dto.Password).Returns("hashed-password");

        await _sut.RegisterUserAsync(dto);

        _passwordHasher.Received(1).Hash(dto.Password);
        await _userRepository.Received(1).AddUserAsync(Arg.Is<User>(u =>
            u != null &&
            u.Username == dto.Username &&
            u.Email == dto.Email &&
            u.PasswordHash == "hashed-password"));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task LoginAsync_WhenUserNotFound_ThrowsGenericInvalidCredentials()
    {
        var dto = new LoginUserDto("missing@example.com", "password123");
        _userRepository.GetUserByEmailAsync(dto.Email).Returns((User?)null);

        var act = () => _sut.LoginAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Invalid credentials.");
        _passwordHasher.DidNotReceive().Verify(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task LoginAsync_WhenPasswordInvalid_ThrowsGenericInvalidCredentials()
    {
        var dto = new LoginUserDto("carol@example.com", "wrong-password");
        var user = new User("carol", "stored-hash", dto.Email);
        _userRepository.GetUserByEmailAsync(dto.Email).Returns(user);
        _passwordHasher.Verify(dto.Password, user.PasswordHash).Returns(false);

        var act = () => _sut.LoginAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Invalid credentials.");
    }

    [Fact]
    public async Task LoginAsync_WhenCredentialsValid_ReturnsAuthResponseWithoutToken()
    {
        var dto = new LoginUserDto("dave@example.com", "password123");
        var user = new User("dave", "stored-hash", dto.Email);
        _userRepository.GetUserByEmailAsync(dto.Email).Returns(user);
        _passwordHasher.Verify(dto.Password, user.PasswordHash).Returns(true);

        var result = await _sut.LoginAsync(dto);

        result.Should().BeEquivalentTo(new AuthResponseDto(user.Id, user.Username, user.Email));
        result.GetType().GetProperties().Select(p => p.Name)
            .Should().NotContain(n => n.Contains("Token", StringComparison.OrdinalIgnoreCase));
    }
}
