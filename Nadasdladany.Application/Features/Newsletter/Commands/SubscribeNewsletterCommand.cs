using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Newsletter.Commands;

public record SubscribeNewsletterCommand : IRequest<bool>
{
    public required string Email { get; init; }
    public string? Name { get; init; }
}

public class SubscribeNewsletterCommandHandler(IApplicationDbContext context) : IRequestHandler<SubscribeNewsletterCommand, bool>
{
    public async Task<bool> Handle(SubscribeNewsletterCommand request, CancellationToken cancellationToken)
    {
        var existing = await context.NewsletterSubscribers
            .FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (existing != null)
        {
            if (!existing.IsActive)
            {
                existing.IsActive = true;
                await context.SaveChangesAsync(cancellationToken);
            }
            return true;
        }

        var subscriber = new NewsletterSubscriber
        {
            Email = request.Email,
            Name = request.Name,
            IsActive = true
        };

        context.NewsletterSubscribers.Add(subscriber);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}