using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Nadasdladany.Application.Features.PublicDataRequests.Commands;
using Nadasdladany.Application.Features.PublicDataRequests.DTOs;
using Nadasdladany.Application.Features.PublicDataRequests.Queries;

namespace Nadasdladany.Api.Controllers;

public class PublicDataRequestsController : ApiControllerBase
{
    [HttpPost]
    [EnableRateLimiting("StrictSubmitPolicy")]
    public async Task<ActionResult<int>> Create(CreateDataRequestCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<PublicDataRequestDto>>> GetAll()
    {
        return await Mediator.Send(new GetPublicDataRequestsQuery());
    }

    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateDataRequestStatusCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");
        await Mediator.Send(command);
        return NoContent();
    }
}