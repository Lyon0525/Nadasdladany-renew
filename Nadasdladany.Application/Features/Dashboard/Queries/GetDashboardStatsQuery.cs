using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Dashboard.Queries;

public record DashboardStatsDto(int NewsCount, int EventsCount, int AlbumsCount, int DocumentsCount);

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var newsCount = await _context.Articles.CountAsync(cancellationToken);
        var eventsCount = await _context.Events.CountAsync(cancellationToken);
        var albumsCount = await _context.GalleryAlbums.CountAsync(cancellationToken);
        var documentsCount = await _context.Documents.CountAsync(cancellationToken);

        return new DashboardStatsDto(newsCount, eventsCount, albumsCount, documentsCount);
    }
}