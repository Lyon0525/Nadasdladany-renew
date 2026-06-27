using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Documents.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Documents.Queries;

public record GetDocumentsWithPaginationQuery : IRequest<PaginatedList<DocumentDto>>
{
    public int? CategoryId { get; init; }
    public string? SearchTerm { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public class GetDocumentsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetDocumentsWithPaginationQuery, PaginatedList<DocumentDto>>
{
    public async Task<PaginatedList<DocumentDto>> Handle(GetDocumentsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = context.Documents
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();

        if (request.CategoryId.HasValue)
            query = query.Where(x => x.DocumentCategoryId == request.CategoryId);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            query = query.Where(x => x.Title.Contains(request.SearchTerm));

        return await PaginatedList<DocumentDto>.CreateAsync(
            query.ProjectTo<DocumentDto>(mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}