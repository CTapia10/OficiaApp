using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Services;

namespace OficiaApp.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/client-profile")]
    public class ClientProfilesController : ControllerBase
    {
        private readonly IClientProfileService _clientProfileService;
        public ClientProfilesController(IClientProfileService clientProfileService)
        {
            _clientProfileService = clientProfileService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateClientProfile([FromBody] CreateClientProfileDto createClientProfileDto)
        {
            try
            {
                // Assuming the user ID is obtained from the authenticated user's claims
                var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdString == null)
                {
                    return Unauthorized(new { message = "User ID not found in claims." });
                }
                Guid userId = Guid.Parse(userIdString);
                await _clientProfileService.CreateClientProfileAsync(userId, createClientProfileDto);
                return Ok(new { message = "Client profile created successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while creating the client profile." });
            }
        }
    }
}
