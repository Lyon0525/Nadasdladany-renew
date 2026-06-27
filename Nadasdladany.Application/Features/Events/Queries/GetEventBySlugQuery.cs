using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Features.Events.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Events.Queries;

public record GetEventBySlugQuery(string Slug) : IRequest<EventDto>;

public class GetEventBySlugQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetEventBySlugQuery, EventDto>
{
    public async Task<EventDto> Handle(GetEventBySlugQuery request, CancellationToken cancellationToken)
    {
        var entity = await context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsPublished && x.Slug == request.Slug, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Event), request.Slug);

        return mapper.Map<EventDto>(entity);
    }
}