using Microsoft.AspNetCore.Mvc;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Services;

namespace OficiaApp.Api.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/professional-profile")]
    public class ProfessionalProfilesController : ControllerBase
    {
        private readonly IProfessionalProfileService _professionalProfileService;
        public ProfessionalProfilesController(IProfessionalProfileService professionalProfileService)
        {
            _professionalProfileService = professionalProfileService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfessionalProfile(Guid userId, [FromBody] CreateProfessionalProfileDto createProfessionalProfileDto)
        {
            try
            {
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
