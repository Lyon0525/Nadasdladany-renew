using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Features.Institutions.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

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
        var entities = await _context.Institutions
            .AsNoTracking()
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<InstitutionDto>>(entities);
    }
}
public record GetInstitutionBySlugQuery(string Slug) : IRequest<InstitutionDto>;

public class GetInstitutionBySlugQueryHandler : IRequestHandler<GetInstitutionBySlugQuery, InstitutionDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetInstitutionBySlugQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<InstitutionDto> Handle(GetInstitutionBySlugQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Institutions
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsPublished && x.Slug == request.Slug, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Institution), request.Slug);

        return _mapper.Map<InstitutionDto>(entity);
    }
}