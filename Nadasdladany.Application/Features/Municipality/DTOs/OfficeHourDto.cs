using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.DTOs;

public class OfficeHourDto : IMapFrom<OfficeHourEntry>
{
    public int Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public string TimeDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}