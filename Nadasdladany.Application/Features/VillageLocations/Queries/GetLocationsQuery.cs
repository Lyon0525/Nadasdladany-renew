using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.VillageLocations.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.VillageLocations.Queries;

public record GetLocationsQuery : IRequest<List<VillageLocationDto>>;

public class GetLocationsQueryHandler(IApplicationDbContext context) : IRequestHandler<GetLocationsQuery, List<VillageLocationDto>>
{
    public async Task<List<VillageLocationDto>> Handle(GetLocationsQuery request, CancellationToken cancellationToken)
    {
        return await context.VillageLocations
            .Select(x => new VillageLocationDto
            {
                Id = x.Id,
                Name = x.Name,
                IconType = x.IconType,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Address = x.Address,
                Description = x.Description
            })
            .ToListAsync(cancellationToken);
    }
}