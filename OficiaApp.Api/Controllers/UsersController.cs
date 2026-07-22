using Microsoft.AspNetCore.Mvc;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;

namespace OficiaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
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
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
    {
        try
        {
            var authResponse = await _userService.LoginAsync(loginUserDto);
            return Ok(authResponse);
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
}
