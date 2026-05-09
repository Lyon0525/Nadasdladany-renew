using System.Text.RegularExpressions;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Infrastructure.Services;

public class SlugService : ISlugService
{
    public string GenerateSlug(string phrase)
    {
        string str = phrase.ToLowerInvariant();

        // Hungarian accent replacement
        str = str.Replace('á', 'a').Replace('é', 'e').Replace('í', 'i')
                 .Replace('ó', 'o').Replace('ö', 'o').Replace('ő', 'o')
                 .Replace('ú', 'u').Replace('ü', 'u').Replace('ű', 'u');

        // Remove invalid chars
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        // Convert multiple spaces into one space
        str = Regex.Replace(str, @"\s+", " ").Trim();
        // Cut and trim
        str = str.Substring(0, str.Length <= 100 ? str.Length : 100).Trim();
        // Hyphens
        str = Regex.Replace(str, @"\s", "-");

        return str;
    }
}