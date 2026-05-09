using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Articles.DTOs;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Articles.Queries;

public record GetArticlesWithPaginationQuery : IRequest<PaginatedList<ArticleDto>>
{
    public int? CategoryId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}

public class GetArticlesWithPaginationQueryHandler : IRequestHandler<GetArticlesWithPaginationQuery, PaginatedList<ArticleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetArticlesWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ArticleDto>> Handle(GetArticlesWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Articles
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.PublishedDate)
            .AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == request.CategoryId);
        }

        return await PaginatedList<ArticleDto>.CreateAsync(
            query.ProjectTo<ArticleDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}