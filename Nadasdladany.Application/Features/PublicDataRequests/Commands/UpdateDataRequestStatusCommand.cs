using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.PublicDataRequests.Commands;

public record UpdateDataRequestStatusCommand(int Id, bool IsProcessed) : IRequest;

public class UpdateDataRequestStatusCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateDataRequestStatusCommand>
{
    public async Task Handle(UpdateDataRequestStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.PublicDataRequests.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(PublicDataRequest), request.Id);

        entity.IsProcessed = request.IsProcessed;

        await context.SaveChangesAsync(cancellationToken);
    }
}