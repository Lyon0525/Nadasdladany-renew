using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Events.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Events.Queries;

public record GetUpcomingEventsQuery : IRequest<List<EventDto>>;

public class GetUpcomingEventsQueryHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime) : IRequestHandler<GetUpcomingEventsQuery, List<EventDto>>
{
    public async Task<List<EventDto>> Handle(GetUpcomingEventsQuery request, CancellationToken cancellationToken)
    {
        return await context.Events
            .AsNoTracking()
            .Where(x => x.IsPublished && x.StartDate >= dateTime.Now.Date)
            .OrderBy(x => x.StartDate)
            .ProjectTo<EventDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}