using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Municipality.DTOs;

public class RepresentativeDto : IMapFrom<Representative>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public RepresentativeRole Role { get; set; }
    public string? CustomTitleOverride { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ReceptionHoursInfo { get; set; }
    public string? ImageUrl { get; set; }
    public string? Biography { get; set; }
    public int DisplayOrder { get; set; }
}