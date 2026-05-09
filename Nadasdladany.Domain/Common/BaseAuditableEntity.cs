namespace Nadasdladany.Domain.Common;

/// <summary>
/// Base class for entities that require tracking of creation and modification metadata.
/// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
    /// <summary>
    /// The date and time when the entity was created (UTC).
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The username or ID of the user who created the entity.
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// The date and time when the entity was last modified (UTC).
    /// </summary>
    public DateTime? LastModifiedAt { get; set; }

    /// <summary>
    /// The username or ID of the user who last modified the entity.
    /// </summary>
    public string? LastModifiedBy { get; set; }
}