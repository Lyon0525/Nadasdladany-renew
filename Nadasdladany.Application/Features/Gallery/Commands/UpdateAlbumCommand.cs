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

public class UpdateAlbumCommandHandler(IApplicationDbContext context, ISlugService slugService) : IRequestHandler<UpdateAlbumCommand>
{
    public async Task Handle(UpdateAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.GalleryAlbums.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) throw new NotFoundException(nameof(GalleryAlbum), request.Id);

        entity.Title = request.Name;
        entity.Description = request.Description;
        entity.Slug = slugService.GenerateSlug(request.Name);

        await context.SaveChangesAsync(cancellationToken);
    }
}