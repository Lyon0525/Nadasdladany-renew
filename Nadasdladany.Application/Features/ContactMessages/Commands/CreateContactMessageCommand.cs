using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.ContactMessages;

public record CreateContactMessageCommand(string Name, string Email, string Subject, string Message) : IRequest<int>;
public class CreateContactMessageCommandHandler : IRequestHandler<CreateContactMessageCommand, int>
{
    private readonly IApplicationDbContext _context;
    public CreateContactMessageCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<int> Handle(CreateContactMessageCommand request, CancellationToken cancellationToken)
    {
        var msg = new ContactMessage { Name = request.Name, Email = request.Email, Subject = request.Subject, Message = request.Message, CreatedAt = DateTime.UtcNow };
        _context.ContactMessages.Add(msg);
        await _context.SaveChangesAsync(cancellationToken);
        return msg.Id;
    }
}
public record GetContactMessagesQuery : IRequest<List<ContactMessage>>;
public class GetContactMessagesQueryHandler : IRequestHandler<GetContactMessagesQuery, List<ContactMessage>>
{
    private readonly IApplicationDbContext _context;
    public GetContactMessagesQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<ContactMessage>> Handle(GetContactMessagesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ContactMessages.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);
    }
}
public record MarkMessageAsReadCommand(int Id) : IRequest;
public class MarkMessageAsReadCommandHandler : IRequestHandler<MarkMessageAsReadCommand>
{
    private readonly IApplicationDbContext _context;
    public MarkMessageAsReadCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task Handle(MarkMessageAsReadCommand request, CancellationToken cancellationToken)
    {
        var msg = await _context.ContactMessages.FindAsync(new object[] { request.Id }, cancellationToken);
        if (msg != null) { msg.IsRead = true; await _context.SaveChangesAsync(cancellationToken); }
    }
}
public record DeleteContactMessageCommand(int Id) : IRequest;
public class DeleteContactMessageCommandHandler : IRequestHandler<DeleteContactMessageCommand>
{
    private readonly IApplicationDbContext _context;
    public DeleteContactMessageCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task Handle(DeleteContactMessageCommand request, CancellationToken cancellationToken)
    {
        var msg = await _context.ContactMessages.FindAsync(new object[] { request.Id }, cancellationToken);
        if (msg != null) { _context.ContactMessages.Remove(msg); await _context.SaveChangesAsync(cancellationToken); }
    }
}