using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Lakossági közérdekű adatigénylést reprezentáló entitás.
/// </summary>
public class PublicDataRequest : BaseAuditableEntity
{
    public required string ApplicantName { get; set; }
    public required string ApplicantEmail { get; set; }
    public string? ApplicantPhone { get; set; }
    public required string RequestedDataDescription { get; set; } // A kért adatok köre
    public bool IsProcessed { get; set; } = false; // Feldolgozva / Megválaszolva
    public string? InternalNotes { get; set; } // Hivatali belső megjegyzés
}