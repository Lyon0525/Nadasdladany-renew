using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Municipality.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Municipality.Queries;

public record GetRepresentativesQuery : IRequest<List<RepresentativeDto>>;

public class GetRepresentativesQueryHandler : IRequestHandler<GetRepresentativesQuery, List<RepresentativeDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRepresentativesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<RepresentativeDto>> Handle(GetRepresentativesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Representatives
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.DisplayOrder)
            .ProjectTo<RepresentativeDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}