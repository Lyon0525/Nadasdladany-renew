using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.ContactMessages;

public record CreateContactMessageCommand(string Name, string Email, string Subject, string Message) : IRequest<int>;
public class CreateContactMessageCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateContactMessageCommand, int>
{
    public async Task<int> Handle(CreateContactMessageCommand request, CancellationToken cancellationToken)
    {
        var msg = new ContactMessage { Name = request.Name, Email = request.Email, Subject = request.Subject, Message = request.Message, CreatedAt = DateTime.UtcNow };
        context.ContactMessages.Add(msg);
        await context.SaveChangesAsync(cancellationToken);
        return msg.Id;
    }
}

public record GetContactMessagesQuery : IRequest<List<ContactMessage>>;
public class GetContactMessagesQueryHandler(IApplicationDbContext context) : IRequestHandler<GetContactMessagesQuery, List<ContactMessage>>
{
    public async Task<List<ContactMessage>> Handle(GetContactMessagesQuery request, CancellationToken cancellationToken)
    {
        return await context.ContactMessages.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);
    }
}

public record MarkMessageAsReadCommand(int Id) : IRequest;
public class MarkMessageAsReadCommandHandler(IApplicationDbContext context) : IRequestHandler<MarkMessageAsReadCommand>
{
    public async Task Handle(MarkMessageAsReadCommand request, CancellationToken cancellationToken)
    {
        var msg = await context.ContactMessages.FindAsync(new object[] { request.Id }, cancellationToken);
        if (msg != null) { msg.IsRead = true; await context.SaveChangesAsync(cancellationToken); }
    }
}

public record DeleteContactMessageCommand(int Id) : IRequest;
public class DeleteContactMessageCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteContactMessageCommand>
{
    public async Task Handle(DeleteContactMessageCommand request, CancellationToken cancellationToken)
    {
        var msg = await context.ContactMessages.FindAsync(new object[] { request.Id }, cancellationToken);
        if (msg != null) { context.ContactMessages.Remove(msg); await context.SaveChangesAsync(cancellationToken); }
    }
}