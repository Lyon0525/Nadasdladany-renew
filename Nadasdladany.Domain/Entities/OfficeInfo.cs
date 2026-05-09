using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// General information about the Mayor's Office.
/// </summary>
public class OfficeInfo : BaseEntity
{
    public required string OfficeName { get; set; } = "Polgármesteri Hivatal";
    public string? AboutOffice { get; set; }
    public required string Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? GoogleMapsEmbedUrl { get; set; }
}