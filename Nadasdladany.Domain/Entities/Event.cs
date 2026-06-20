using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class Event : BaseAuditableEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public bool IsAllDay { get; set; }
    public string? Organizer { get; set; }
    public string? ContactInfo { get; set; }
    public string? EventUrl { get; set; }
    public string? Slug { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsPublished { get; set; } = true;
}