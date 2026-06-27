using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Gallery.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Gallery.Queries;

public record GetAlbumsQuery : IRequest<List<AlbumDto>>;

public class GetAlbumsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAlbumsQuery, List<AlbumDto>>
{
    public async Task<List<AlbumDto>> Handle(GetAlbumsQuery request, CancellationToken cancellationToken)
    {
        return await context.GalleryAlbums
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.DisplayOrder)
            .ProjectTo<AlbumDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}