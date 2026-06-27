using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record DeleteImageCommand(int Id) : IRequest;

public class DeleteImageCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteImageCommand>
{
    public async Task Handle(DeleteImageCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.GalleryImages.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(GalleryImage), request.Id);

        fileService.DeleteFile(entity.ImageUrl);

        context.GalleryImages.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}