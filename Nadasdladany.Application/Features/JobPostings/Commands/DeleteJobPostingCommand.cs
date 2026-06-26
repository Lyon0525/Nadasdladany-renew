using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.JobPostings.Commands;

public record DeleteJobPostingCommand(int Id) : IRequest;

public class DeleteJobPostingCommandHandler : IRequestHandler<DeleteJobPostingCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteJobPostingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteJobPostingCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.JobPostings.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(JobPosting), request.Id);

        _context.JobPostings.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}