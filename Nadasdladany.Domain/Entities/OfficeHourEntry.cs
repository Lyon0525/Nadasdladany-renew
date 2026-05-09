using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Represents an opening hour entry for the office.
/// </summary>
public class OfficeHourEntry : BaseEntity
{
    public DayOfWeek DayOfWeek { get; set; }
    public required string TimeDescription { get; set; }
    public int DisplayOrder { get; set; }
}