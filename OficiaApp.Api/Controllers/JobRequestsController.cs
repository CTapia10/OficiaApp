using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;

namespace OficiaApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/job-requests")]
public class JobRequestsController : ControllerBase
{
    private readonly IJobRequestService _jobRequestService;

    public JobRequestsController(IJobRequestService jobRequestService)
    {
        _jobRequestService = jobRequestService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobRequestDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User ID not found in claims." });
            }

            var created = await _jobRequestService.CreateAsync(userId.Value, dto);
            return Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while creating the job request." });
        }
    }

    [HttpGet("open")]
    public async Task<IActionResult> GetOpen()
    {
        try
        {
            var results = await _jobRequestService.GetOpenAsync();
            return Ok(results);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while listing open job requests." });
        }
    }

    private Guid? GetUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdString, out var userId) ? userId : null;
    }
}
