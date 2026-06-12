using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Egy önkormányzati vagy intézményi álláshirdetést reprezentáló entitás.
/// </summary>
public class JobPosting : BaseAuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Content { get; set; } // HTML kiírás (Tiptap)
    public string? Excerpt { get; set; } // Rövid összefoglaló
    public string? Department { get; set; } // Pl. "Sün Balázs Óvoda", "Hivatal"
    public string? Location { get; set; } // Pl. "8145 Nádasdladány, Fő u. 1."
    public string? EmploymentType { get; set; } // Pl. "Közalkalmazotti jogviszony", "Teljes munkaidő"
    public DateTime? ApplicationDeadline { get; set; } // Jelentkezési határidő
    public bool IsActive { get; set; } = true;
}