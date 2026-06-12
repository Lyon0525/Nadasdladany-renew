using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Egy önkormányzati vagy európai uniós pályázatot (Magyar Falu Program, EFOP stb.) reprezentáló entitás.
/// </summary>
public class Project : BaseAuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Content { get; set; }
    public string? Excerpt { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? ProjectCode { get; set; } // Pl. "EFOP-3.9.2-16-2017-00045"
    public string? TotalFunding { get; set; } // Támogatás összege (pl. "45 000 000 Ft")
    public string? SupportRate { get; set; } // Támogatási intenzitás (pl. "100%")
    public bool IsPublished { get; set; } = true;
}