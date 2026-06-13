using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class OfficeHourEntry : BaseEntity
{
    public DayOfWeek DayOfWeek { get; set; }
    public required string TimeDescription { get; set; }
    public int DisplayOrder { get; set; }
}