using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Gallery.Queries;

public class GalleryImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public record GetGalleryImagesQuery(string Slug) : IRequest<List<GalleryImageDto>>;

public class GetGalleryImagesQueryHandler : IRequestHandler<GetGalleryImagesQuery, List<GalleryImageDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGalleryImagesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GalleryImageDto>> Handle(GetGalleryImagesQuery request, CancellationToken cancellationToken)
    {
        return await _context.GalleryImages
            .Include(i => i.GalleryAlbum)
            .Where(i => i.IsPublished && i.GalleryAlbum != null && i.GalleryAlbum.Slug == request.Slug)
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new GalleryImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl
            })
            .ToListAsync(cancellationToken);
    }
}