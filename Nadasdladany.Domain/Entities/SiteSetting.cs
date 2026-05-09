using System.ComponentModel.DataAnnotations;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Stores global site settings as key-value pairs.
/// </summary>
public class SiteSetting
{
    [Key]
    public required string SettingKey { get; set; }
    public required string SettingValue { get; set; }
}