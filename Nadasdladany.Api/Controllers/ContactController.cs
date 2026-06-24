using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Nadasdladany.Application.Features.ContactMessages;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Api.Controllers;

public class ContactController : ApiControllerBase
{
    [HttpPost]
    [EnableRateLimiting("StrictSubmitPolicy")]
    public async Task<ActionResult<int>> Create(CreateContactMessageCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<ContactMessage>>> GetAll()
    {
        return await Mediator.Send(new GetContactMessagesQuery());
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<ActionResult> MarkAsRead(int id)
    {
        await Mediator.Send(new MarkMessageAsReadCommand(id));
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteContactMessageCommand(id));
        return NoContent();
    }
}