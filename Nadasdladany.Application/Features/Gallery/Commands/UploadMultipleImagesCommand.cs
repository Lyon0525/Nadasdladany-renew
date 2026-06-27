using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record UploadMultipleImagesCommand : IRequest<bool>
{
    public int AlbumId { get; init; }
    public required List<IFormFile> Images { get; init; }
}

public class UploadMultipleImagesCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<UploadMultipleImagesCommand, bool>
{
    public async Task<bool> Handle(UploadMultipleImagesCommand request, CancellationToken cancellationToken)
    {
        var maxOrder = await context.GalleryImages
            .Where(x => x.GalleryAlbumId == request.AlbumId)
            .MaxAsync(x => (int?)x.DisplayOrder, cancellationToken) ?? 0;

        foreach (var file in request.Images)
        {
            var imageUrl = await fileService.UploadFileAsync(file, "gallery");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                maxOrder++;
                context.GalleryImages.Add(new GalleryImage
                {
                    GalleryAlbumId = request.AlbumId,
                    ImageUrl = imageUrl,
                    ThumbnailUrl = imageUrl,
                    IsPublished = true,
                    DisplayOrder = maxOrder
                });
            }
        }

        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}