namespace Nadasdladany.Application.Features.SiteSettings.DTOs;

public class SiteSettingDto
{
    public string MayorName { get; set; } = string.Empty;
    public string WelcomeTitle { get; set; } = string.Empty;
    public string WelcomeText { get; set; } = string.Empty;
    public string? MayorImageUrl { get; set; }
}