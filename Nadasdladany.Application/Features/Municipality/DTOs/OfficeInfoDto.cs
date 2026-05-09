using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.DTOs;

public class OfficeInfoDto : IMapFrom<OfficeInfo>
{
    public int Id { get; set; }
    public string OfficeName { get; set; } = string.Empty;
    public string? AboutOffice { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? GoogleMapsEmbedUrl { get; set; }
}