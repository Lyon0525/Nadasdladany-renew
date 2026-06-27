using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.JobPostings.Commands;

public record DeleteJobPostingCommand(int Id) : IRequest;

public class DeleteJobPostingCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteJobPostingCommand>
{
    public async Task Handle(DeleteJobPostingCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.JobPostings.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(JobPosting), request.Id);

        context.JobPostings.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}