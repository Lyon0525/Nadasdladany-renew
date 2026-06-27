using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Projects.Commands;

public record DeleteProjectCommand(int Id) : IRequest;

public class DeleteProjectCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteProjectCommand>
{
    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Project), request.Id);

        if (!string.IsNullOrEmpty(entity.FeaturedImageUrl))
        {
            fileService.DeleteFile(entity.FeaturedImageUrl);
        }

        context.Projects.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}