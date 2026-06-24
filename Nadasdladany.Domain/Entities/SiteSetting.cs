using System.ComponentModel.DataAnnotations;

namespace Nadasdladany.Domain.Entities;

public class SiteSetting
{
    [Key]
    public int Id { get; set; }
    public string MayorName { get; set; }
    public string WelcomeTitle { get; set; }
    public string WelcomeText { get; set; } = string.Empty;
    public string? MayorImageUrl { get; set; }
    public string HistoryText { get; set; } = string.Empty;
    public string CoatOfArmsText { get; set; } = string.Empty;
    public string CoatOfArmsImageUrl { get; set; } = string.Empty;
    public string LandmarksText { get; set; } = string.Empty;
    public string? CommitteeText { get; set; }
    public string? ContactAddress { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
}