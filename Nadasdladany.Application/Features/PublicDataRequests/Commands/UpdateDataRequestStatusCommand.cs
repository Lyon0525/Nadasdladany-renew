using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.PublicDataRequests.Commands;

public record UpdateDataRequestStatusCommand(int Id, bool IsProcessed) : IRequest;

public class UpdateDataRequestStatusCommandHandler : IRequestHandler<UpdateDataRequestStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateDataRequestStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateDataRequestStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PublicDataRequests.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(PublicDataRequest), request.Id);

        entity.IsProcessed = request.IsProcessed;

        await _context.SaveChangesAsync(cancellationToken);
    }
}