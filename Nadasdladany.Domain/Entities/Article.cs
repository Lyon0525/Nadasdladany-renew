using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Represents a news article or announcement published on the site.
/// </summary>
public class Article : BaseAuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Content { get; set; }
    public string? Excerpt { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;
    public string? Author { get; set; }
    public bool IsPublished { get; set; } = true;
    public int ViewCount { get; set; }

    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }
}