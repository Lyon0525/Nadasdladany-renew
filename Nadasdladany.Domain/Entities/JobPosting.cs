using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class JobPosting : BaseAuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Content { get; set; }
    public string? Excerpt { get; set; }
    public string? Department { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public bool IsActive { get; set; } = true;
}