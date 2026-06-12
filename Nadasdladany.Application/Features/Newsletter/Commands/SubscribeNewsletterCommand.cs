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

public class SubscribeNewsletterCommandHandler : IRequestHandler<SubscribeNewsletterCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public SubscribeNewsletterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(SubscribeNewsletterCommand request, CancellationToken cancellationToken)
    {
        var existing = await _context.NewsletterSubscribers
            .FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (existing != null)
        {
            if (!existing.IsActive)
            {
                existing.IsActive = true;
                await _context.SaveChangesAsync(cancellationToken);
            }
            return true;
        }

        var subscriber = new NewsletterSubscriber
        {
            Email = request.Email,
            Name = request.Name,
            IsActive = true
        };

        _context.NewsletterSubscribers.Add(subscriber);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}