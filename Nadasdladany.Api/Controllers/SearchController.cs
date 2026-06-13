using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Api.Controllers;

public class SearchController : ApiControllerBase
{
    private readonly IApplicationDbContext _context;

    public SearchController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<SearchResultDto>>> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            return Ok(new List<SearchResultDto>());

        var lowercaseQuery = query.ToLower();

        var newsResults = await _context.Articles
            .Where(a => a.IsPublished && (a.Title.Contains(query) || a.Content.Contains(query)))
            .Select(a => new SearchResultDto
            {
                Title = a.Title,
                Description = a.Excerpt ?? "",
                Url = $"/hirek/{a.Slug}",
                ResultType = "Hír"
            })
            .Take(5)
            .ToListAsync();

        var eventResults = await _context.Events
            .Where(e => e.IsPublished && (e.Title.Contains(query) || e.Description!.Contains(query)))
            .Select(e => new SearchResultDto
            {
                Title = e.Title,
                Description = e.Description ?? "",
                Url = "/esemenyek",
                ResultType = "Esemény"
            })
            .Take(5)
            .ToListAsync();

        var allResults = newsResults.Concat(eventResults).ToList();

        return Ok(allResults);
    }
}

public class SearchResultDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string ResultType { get; set; } = string.Empty;
}