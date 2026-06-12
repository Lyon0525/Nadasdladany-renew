using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class Institution : BaseAuditableEntity
{
    public required string Name { get; set; }

    public required string Slug { get; set; }

    public string? Description { get; set; }

    public string? Content { get; set; }
    public string? LeaderName { get; set; }  
    public string? OpeningHours { get; set; }  
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconCssClass { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }
}