using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class PublicDataRequest : BaseAuditableEntity
{
    public required string ApplicantName { get; set; }
    public required string ApplicantEmail { get; set; }
    public string? ApplicantPhone { get; set; }
    public required string RequestedDataDescription { get; set; }
    public bool IsProcessed { get; set; } = false;
    public string? InternalNotes { get; set; }
}