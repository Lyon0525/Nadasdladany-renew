using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.PublicDataRequests.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.PublicDataRequests.Queries;

public record GetPublicDataRequestsQuery : IRequest<List<PublicDataRequestDto>>;

public class GetPublicDataRequestsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetPublicDataRequestsQuery, List<PublicDataRequestDto>>
{
    public async Task<List<PublicDataRequestDto>> Handle(GetPublicDataRequestsQuery request, CancellationToken cancellationToken)
    {
        return await context.PublicDataRequests
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<PublicDataRequestDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}