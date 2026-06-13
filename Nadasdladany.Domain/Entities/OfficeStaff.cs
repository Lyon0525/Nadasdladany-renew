using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class OfficeStaff : BaseAuditableEntity
{
    public required string Name { get; set; }
    public required string Position { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int Order { get; set; } = 0;
}