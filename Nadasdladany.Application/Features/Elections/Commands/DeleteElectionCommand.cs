using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Elections.Commands;

public record DeleteElectionCommand(int Id) : IRequest;

public class DeleteElectionCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteElectionCommand>
{
    public async Task Handle(DeleteElectionCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Elections.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(ElectionResultEntity), request.Id);

        context.Elections.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}