using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Elections.Commands;

public record DeleteElectionCommand(int Id) : IRequest;

public class DeleteElectionCommandHandler : IRequestHandler<DeleteElectionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteElectionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteElectionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Elections.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(ElectionResultEntity), request.Id);

        _context.Elections.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}