using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.VillageLocations.Commands;

public record DeleteLocationCommand(int Id) : IRequest<bool>;

public class DeleteLocationCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteLocationCommand, bool>
{
    public async Task<bool> Handle(DeleteLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await context.VillageLocations.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (location == null) return false;

        context.VillageLocations.Remove(location);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}