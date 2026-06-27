using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Features.Institutions.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.Queries;

public record GetInstitutionsQuery : IRequest<List<InstitutionDto>>;

public class GetInstitutionsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetInstitutionsQuery, List<InstitutionDto>>
{
    public async Task<List<InstitutionDto>> Handle(GetInstitutionsQuery request, CancellationToken cancellationToken)
    {
        var entities = await context.Institutions
            .AsNoTracking()
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync(cancellationToken);

        return mapper.Map<List<InstitutionDto>>(entities);
    }
}

public record GetInstitutionBySlugQuery(string Slug) : IRequest<InstitutionDto>;

public class GetInstitutionBySlugQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetInstitutionBySlugQuery, InstitutionDto>
{
    public async Task<InstitutionDto> Handle(GetInstitutionBySlugQuery request, CancellationToken cancellationToken)
    {
        var entity = await context.Institutions
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsPublished && x.Slug == request.Slug, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Institution), request.Slug);

        return mapper.Map<InstitutionDto>(entity);
    }
}