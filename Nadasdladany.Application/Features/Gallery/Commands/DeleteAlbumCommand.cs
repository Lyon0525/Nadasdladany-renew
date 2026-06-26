using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record DeleteAlbumCommand(int Id) : IRequest;

public class DeleteAlbumCommandHandler : IRequestHandler<DeleteAlbumCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteAlbumCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(DeleteAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.GalleryAlbums
            .Include(a => a.Images)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (entity == null) throw new NotFoundException(nameof(GalleryAlbum), request.Id);

        foreach (var img in entity.Images)
        {
            if (!string.IsNullOrEmpty(img.ImageUrl))
            {
                _fileService.DeleteFile(img.ImageUrl);
            }
        }

        _context.GalleryImages.RemoveRange(entity.Images);
        _context.GalleryAlbums.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}