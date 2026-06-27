using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Features.Articles.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Articles.Queries;

public record GetArticleBySlugQuery(string Slug) : IRequest<ArticleDto>;

public class GetArticleBySlugQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetArticleBySlugQuery, ArticleDto>
{
    public async Task<ArticleDto> Handle(GetArticleBySlugQuery request, CancellationToken cancellationToken)
    {
        var entity = await context.Articles
            .Include(x => x.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsPublished && x.Slug == request.Slug, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Article), request.Slug);

        return mapper.Map<ArticleDto>(entity);
    }
}