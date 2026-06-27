using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record DeleteAlbumCommand(int Id) : IRequest;

public class DeleteAlbumCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<DeleteAlbumCommand>
{
    public async Task Handle(DeleteAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.GalleryAlbums
            .Include(a => a.Images)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (entity == null) throw new NotFoundException(nameof(GalleryAlbum), request.Id);

        foreach (var img in entity.Images)
        {
            if (!string.IsNullOrEmpty(img.ImageUrl))
            {
                fileService.DeleteFile(img.ImageUrl);
            }
        }

        context.GalleryImages.RemoveRange(entity.Images);
        context.GalleryAlbums.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}