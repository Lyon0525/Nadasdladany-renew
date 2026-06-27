using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.Commands;

public record DeleteRepresentativeCommand(int Id) : IRequest;

public class DeleteRepresentativeCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteRepresentativeCommand>
{
    public async Task Handle(DeleteRepresentativeCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Representatives.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Representative), request.Id);

        if (!string.IsNullOrEmpty(entity.ImageUrl))
        {
            fileService.DeleteFile(entity.ImageUrl);
        }

        context.Representatives.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}