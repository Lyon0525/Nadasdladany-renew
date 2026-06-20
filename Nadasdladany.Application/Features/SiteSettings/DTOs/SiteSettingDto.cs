namespace Nadasdladany.Application.Features.SiteSettings.DTOs;

public class SiteSettingDto
{
    public int Id { get; set; }
    public string MayorName { get; set; } = string.Empty;
    public string WelcomeTitle { get; set; } = string.Empty;
    public string WelcomeText { get; set; } = string.Empty;
    public string? MayorImageUrl { get; set; }
    public string HistoryText { get; set; } = string.Empty;
    public string CoatOfArmsText { get; set; } = string.Empty;
    public string CoatOfArmsImageUrl { get; set; } = string.Empty;
    public string LandmarksText { get; set; } = string.Empty;
}