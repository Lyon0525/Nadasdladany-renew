using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Newsletter.Commands;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Api.Controllers;

public class NewsletterController : ApiControllerBase
{
    private readonly IApplicationDbContext _context;

    public NewsletterController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("subscribe")]
    public async Task<ActionResult<bool>> Subscribe(SubscribeNewsletterCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet("subscribers")]
    public async Task<ActionResult<int>> GetSubscriberCount()
    {
        var count = await _context.NewsletterSubscribers.CountAsync(x => x.IsActive);
        return Ok(count);
    }

    [HttpPost("send")]
    public async Task<ActionResult> Send(SendNewsletterCommand command)
    {
        // Elindítjuk a háttérben a logikát (Dummy lefutás)
        await Mediator.Send(command);

        // 🌟 JAVÍTÁS: Küldünk egy egyedi fejlécet vagy választ, amiből a frontend látja, hogy ez csak szimuláció
        return Ok(new { message = "Nincs SMTP implementálva", isDummy = true });
    }
}