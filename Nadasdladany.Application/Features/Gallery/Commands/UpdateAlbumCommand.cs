using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record UpdateAlbumCommand : IRequest
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
}

public class UpdateAlbumCommandHandler : IRequestHandler<UpdateAlbumCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdateAlbumCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task Handle(UpdateAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.GalleryAlbums.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) throw new NotFoundException(nameof(GalleryAlbum), request.Id);

        entity.Title = request.Name;
        entity.Description = request.Description;
        entity.Slug = _slugService.GenerateSlug(request.Name);

        await _context.SaveChangesAsync(cancellationToken);
    }
}