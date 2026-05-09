namespace Nadasdladany.Domain.Common;

/// <summary>
/// Base class for all domain entities containing a unique identifier.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Unique identifier for the entity.
    /// </summary>
    public int Id { get; set; }
}