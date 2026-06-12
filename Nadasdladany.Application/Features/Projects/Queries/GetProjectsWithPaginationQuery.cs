using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Projects.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Projects.Queries;

public record GetProjectsWithPaginationQuery : IRequest<PaginatedList<ProjectDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}

public class GetProjectsWithPaginationQueryHandler : IRequestHandler<GetProjectsWithPaginationQuery, PaginatedList<ProjectDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProjectsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ProjectDto>> Handle(GetProjectsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Projects
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();

        return await PaginatedList<ProjectDto>.CreateAsync(
            query.ProjectTo<ProjectDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}