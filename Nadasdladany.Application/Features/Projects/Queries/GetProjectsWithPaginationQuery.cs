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

public class GetProjectsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetProjectsWithPaginationQuery, PaginatedList<ProjectDto>>
{
    public async Task<PaginatedList<ProjectDto>> Handle(GetProjectsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = context.Projects
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();

        return await PaginatedList<ProjectDto>.CreateAsync(
            query.ProjectTo<ProjectDto>(mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}