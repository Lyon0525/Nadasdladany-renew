using Nadasdladany.Domain.Common;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Domain.Entities;

public class Organization : BaseAuditableEntity
{
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public string? LeaderName { get; set; } // Vezető/Képviselő neve
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? ImageUrl { get; set; }
    public OrganizationType Type { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }
}