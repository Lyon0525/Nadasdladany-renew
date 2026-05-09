using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Articles.Commands;
using Nadasdladany.Application.Features.Articles.DTOs;
using Nadasdladany.Application.Features.Articles.Queries;

namespace Nadasdladany.Api.Controllers;

public class ArticlesController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<ArticleDto>>> GetArticles([FromQuery] GetArticlesWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Create([FromForm] CreateArticleCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteArticleCommand(id));
        return NoContent();
    }
}