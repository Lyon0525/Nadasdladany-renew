using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Municipality.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Municipality.Queries;

public record GetRepresentativesQuery : IRequest<List<RepresentativeDto>>;

public class GetRepresentativesQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetRepresentativesQuery, List<RepresentativeDto>>
{
    public async Task<List<RepresentativeDto>> Handle(GetRepresentativesQuery request, CancellationToken cancellationToken)
    {
        return await context.Representatives
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.DisplayOrder)
            .ProjectTo<RepresentativeDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}