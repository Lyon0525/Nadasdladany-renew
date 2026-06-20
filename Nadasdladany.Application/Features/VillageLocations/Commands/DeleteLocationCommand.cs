using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.VillageLocations.Commands;

public record DeleteLocationCommand(int Id) : IRequest<bool>;

public class DeleteLocationCommandHandler : IRequestHandler<DeleteLocationCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteLocationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await _context.VillageLocations.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (location == null) return false;

        _context.VillageLocations.Remove(location);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}