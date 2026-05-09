using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.Events.Commands;
using Nadasdladany.Application.Features.Events.DTOs;
using Nadasdladany.Application.Features.Events.Queries;

namespace Nadasdladany.Api.Controllers;

public class EventsController : ApiControllerBase
{
    [HttpGet("upcoming")]
    public async Task<ActionResult<List<EventDto>>> GetUpcomingEvents()
    {
        return await Mediator.Send(new GetUpcomingEventsQuery());
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateEventCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteEventCommand(id));
        return NoContent();
    }
}