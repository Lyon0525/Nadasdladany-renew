using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Newsletter.Commands;

public record SendNewsletterCommand : IRequest
{
    public required string Subject { get; init; }
    public required string Body { get; init; }
}

public class SendNewsletterCommandHandler : IRequestHandler<SendNewsletterCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public SendNewsletterCommandHandler(IApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task Handle(SendNewsletterCommand request, CancellationToken cancellationToken)
    {
        var subscribers = await _context.NewsletterSubscribers
            .Where(x => x.IsActive)
            .ToListAsync(cancellationToken);

        foreach (var sub in subscribers)
        {
            await _emailService.SendEmailAsync(sub.Email, request.Subject, request.Body);
        }
    }
}