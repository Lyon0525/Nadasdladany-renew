using System.ComponentModel.DataAnnotations;

namespace Nadasdladany.Domain.Entities;

public class SiteSetting
{
    [Key]
    public required string SettingKey { get; set; }
    public required string SettingValue { get; set; }
    public string MayorName { get; set; } = "Pálfi Kristóf";
    public string WelcomeTitle { get; set; } = "Polgármesteri Köszöntő";
    public string WelcomeText { get; set; } = string.Empty;
    public string? MayorImageUrl { get; set; }
}