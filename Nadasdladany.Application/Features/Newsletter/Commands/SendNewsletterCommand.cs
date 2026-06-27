using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Newsletter.Commands;

public record SendNewsletterCommand : IRequest
{
    public required string Subject { get; init; }
    public required string Body { get; init; }
}

public class SendNewsletterCommandHandler(IApplicationDbContext context, IEmailService emailService) : IRequestHandler<SendNewsletterCommand>
{
    public async Task Handle(SendNewsletterCommand request, CancellationToken cancellationToken)
    {
        var subscribers = await context.NewsletterSubscribers
            .Where(x => x.IsActive)
            .ToListAsync(cancellationToken);

        foreach (var sub in subscribers)
        {
            await emailService.SendEmailAsync(sub.Email, request.Subject, request.Body);
        }
    }
}