using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Institutions.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Institutions.Queries;

public record GetInstitutionsQuery : IRequest<List<InstitutionDto>>;

public class GetInstitutionsQueryHandler : IRequestHandler<GetInstitutionsQuery, List<InstitutionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetInstitutionsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<InstitutionDto>> Handle(GetInstitutionsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Institutions
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Name)
            .ProjectTo<InstitutionDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}