using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class Project : BaseAuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Content { get; set; }
    public string? Excerpt { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? ProjectCode { get; set; }
    public string? TotalFunding { get; set; }
    public string? SupportRate { get; set; }
    public bool IsPublished { get; set; } = true;
}