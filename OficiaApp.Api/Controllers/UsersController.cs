using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using OficiaApp.Api.Security;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.Settings;

namespace OficiaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public UsersController(
        IUserService userService,
        ITokenService tokenService,
        IOptions<JwtSettings> jwtSettings)
    {
        _userService = userService;
        _tokenService = tokenService;
        _jwtSettings = jwtSettings.Value;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    {
        try
        {
            await _userService.RegisterUserAsync(registerUserDto);
            return Ok(new { message = "User registered successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while registering the user." });
        }
    }

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
    {
        try
        {
            var authResponse = await _userService.LoginAsync(loginUserDto);

            var token = _tokenService.GenerateToken(
                authResponse.UserId,
                authResponse.Username,
                authResponse.Email);

            var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes);
            Response.Cookies.Append(AuthCookies.AccessToken, token, AuthCookies.BuildOptions(expiresAt));

            // JWT only travels via the httpOnly cookie — never in the response body.
            return Ok(new { username = authResponse.Username, email = authResponse.Email });
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while logging in." });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(AuthCookies.AccessToken, AuthCookies.BuildDeleteOptions());
        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        // JWT already validated by auth middleware; claims identify the user without a DB round-trip.
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;

        if (id == null || username == null || email == null)
        {
            return Unauthorized();
        }

        return Ok(new { id, username, email });
    }
}
