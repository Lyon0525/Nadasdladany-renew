using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.PublicDataRequests.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.PublicDataRequests.Queries;

public record GetPublicDataRequestsQuery : IRequest<List<PublicDataRequestDto>>;

public class GetPublicDataRequestsQueryHandler : IRequestHandler<GetPublicDataRequestsQuery, List<PublicDataRequestDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPublicDataRequestsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<PublicDataRequestDto>> Handle(GetPublicDataRequestsQuery request, CancellationToken cancellationToken)
    {
        return await _context.PublicDataRequests
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<PublicDataRequestDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}