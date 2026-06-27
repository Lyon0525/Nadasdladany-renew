using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.Commands;

public record DeleteInstitutionCommand(int Id) : IRequest;

public class DeleteInstitutionCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteInstitutionCommand>
{
    public async Task Handle(DeleteInstitutionCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Institutions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Institution), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
            fileService.DeleteFile(entity.ImageUrl);

        context.Institutions.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}