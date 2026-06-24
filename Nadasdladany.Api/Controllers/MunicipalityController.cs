using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Municipality.Commands;
using Nadasdladany.Application.Features.Municipality.DTOs;
using Nadasdladany.Application.Features.Municipality.Queries;

namespace Nadasdladany.Api.Controllers;

[Route("api/municipality/representatives")]
public class RepresentativesController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RepresentativeDto>>> GetAll()
    {
        return await Mediator.Send(new GetRepresentativesQuery());
    }

    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateRepresentativeCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> Update(int id, [FromForm] UpdateRepresentativeCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");

        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteRepresentativeCommand(id));
        return NoContent();
    }
}