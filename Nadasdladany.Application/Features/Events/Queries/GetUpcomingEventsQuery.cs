using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Events.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Events.Queries;

public record GetUpcomingEventsQuery : IRequest<List<EventDto>>;

public class GetUpcomingEventsQueryHandler : IRequestHandler<GetUpcomingEventsQuery, List<EventDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public GetUpcomingEventsQueryHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<List<EventDto>> Handle(GetUpcomingEventsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Events
            .AsNoTracking()
            .Where(x => x.IsPublished && x.StartDate >= _dateTime.Now.Date)
            .OrderBy(x => x.StartDate)
            .ProjectTo<EventDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}