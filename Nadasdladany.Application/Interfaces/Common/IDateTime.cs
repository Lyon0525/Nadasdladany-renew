namespace Nadasdladany.Application.Interfaces.Common;

/// <summary>
/// Abstraction for system clock.
/// </summary>
public interface IDateTime
{
    /// <summary>
    /// Gets the current date and time in UTC.
    /// </summary>
    DateTime Now { get; }
}