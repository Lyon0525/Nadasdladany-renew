using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Organizations.Commands;

public record DeleteOrganizationCommand(int Id) : IRequest;

public class DeleteOrganizationCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteOrganizationCommand>
{
    public async Task Handle(DeleteOrganizationCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Organizations.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Organization), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
        {
            fileService.DeleteFile(entity.ImageUrl);
        }

        context.Organizations.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}