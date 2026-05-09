using Microsoft.AspNetCore.Identity;

namespace Nadasdladany.Infrastructure.Identity;

/// <summary>
/// Represents the user entity within the identity system.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// Gets or sets the full name of the user.
    /// </summary>
    public string? FullName { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the user account is active.
    /// </summary>
    public bool IsActive { get; set; } = true;
}