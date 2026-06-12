using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Hírlevélre feliratkozott lakos adatait tároló entitás.
/// </summary>
public class NewsletterSubscriber : BaseAuditableEntity
{
    public required string Email { get; set; }
    public string? Name { get; set; }
    public bool IsActive { get; set; } = true;
    public string UnsubscribeToken { get; set; } = Guid.NewGuid().ToString();
}