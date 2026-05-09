namespace Nadasdladany.Application.Interfaces.Common;

/// <summary>
/// Utility for generating URL-friendly slugs from strings.
/// </summary>
public interface ISlugService
{
    /// <summary>
    /// Converts a string into a URL-friendly slug.
    /// </summary>
    string GenerateSlug(string phrase);
}