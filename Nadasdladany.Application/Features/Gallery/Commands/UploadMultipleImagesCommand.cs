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

public class UploadMultipleImagesCommandHandler : IRequestHandler<UploadMultipleImagesCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public UploadMultipleImagesCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<bool> Handle(UploadMultipleImagesCommand request, CancellationToken cancellationToken)
    {
        var maxOrder = await _context.GalleryImages
            .Where(x => x.GalleryAlbumId == request.AlbumId)
            .MaxAsync(x => (int?)x.DisplayOrder, cancellationToken) ?? 0;

        foreach (var file in request.Images)
        {
            var imageUrl = await _fileService.UploadFileAsync(file, "gallery");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                maxOrder++;
                _context.GalleryImages.Add(new GalleryImage
                {
                    GalleryAlbumId = request.AlbumId,
                    ImageUrl = imageUrl,
                    ThumbnailUrl = imageUrl,
                    IsPublished = true,
                    DisplayOrder = maxOrder
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}