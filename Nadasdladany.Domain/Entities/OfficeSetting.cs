using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class OfficeSetting : BaseAuditableEntity
{
    public required string OfficialName { get; set; }
    public required string Address { get; set; }
    public required string Phone { get; set; }
    public required string Email { get; set; }
    public required string OpeningHoursJson { get; set; }
}