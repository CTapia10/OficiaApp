using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Services;

namespace OficiaApp.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/professional-profile")]
    public class ProfessionalProfilesController : ControllerBase
    {
        private readonly IProfessionalProfileService _professionalProfileService;
        public ProfessionalProfilesController(IProfessionalProfileService professionalProfileService)
        {
            _professionalProfileService = professionalProfileService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfessionalProfile([FromBody] CreateProfessionalProfileDto createProfessionalProfileDto)
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
                await _professionalProfileService.CreateProfileAsync(userId, createProfessionalProfileDto);
                return Ok(new { message = "Professional profile created successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while creating the professional profile." });
            }
        }
    }
}
