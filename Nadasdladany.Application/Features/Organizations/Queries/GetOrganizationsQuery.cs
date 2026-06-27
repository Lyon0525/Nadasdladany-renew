using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Organizations.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Organizations.Queries;

public record GetOrganizationsQuery(OrganizationType? Type) : IRequest<List<OrganizationDto>>;

public class GetOrganizationsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetOrganizationsQuery, List<OrganizationDto>>
{
    public async Task<List<OrganizationDto>> Handle(GetOrganizationsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Organizations
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .AsQueryable();

        if (request.Type.HasValue)
        {
            query = query.Where(x => x.Type == request.Type.Value);
        }

        return await query
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Name)
            .ProjectTo<OrganizationDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}