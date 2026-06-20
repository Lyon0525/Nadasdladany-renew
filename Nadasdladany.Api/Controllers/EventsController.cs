using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Events.Commands;
using Nadasdladany.Application.Features.Events.DTOs;
using Nadasdladany.Application.Features.Events.Queries;

namespace Nadasdladany.Api.Controllers;

public class EventsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EventDto>>> GetEvents()
    {
        return await Mediator.Send(new GetUpcomingEventsQuery());
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<List<EventDto>>> GetUpcomingEvents()
    {
        return await Mediator.Send(new GetUpcomingEventsQuery());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<int>> Create(CreateEventCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult> Update(int id, UpdateEventCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");

        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteEventCommand(id));
        return NoContent();
    }
}