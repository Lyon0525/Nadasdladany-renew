using Nadasdladany.Domain.Common;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Represents a member of the representative body or municipal staff.
/// </summary>
public class Representative : BaseAuditableEntity
{
    public required string Name { get; set; }
    public RepresentativeRole Role { get; set; }
    public string? CustomTitleOverride { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ReceptionHoursInfo { get; set; }
    public string? ImageUrl { get; set; }
    public string? Biography { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }
}