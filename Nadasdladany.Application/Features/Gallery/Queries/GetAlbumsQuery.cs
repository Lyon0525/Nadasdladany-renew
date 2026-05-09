using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Gallery.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Gallery.Queries;

public record GetAlbumsQuery : IRequest<List<AlbumDto>>;

public class GetAlbumsQueryHandler : IRequestHandler<GetAlbumsQuery, List<AlbumDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAlbumsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<AlbumDto>> Handle(GetAlbumsQuery request, CancellationToken cancellationToken)
    {
        return await _context.GalleryAlbums
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.DisplayOrder)
            .ProjectTo<AlbumDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}