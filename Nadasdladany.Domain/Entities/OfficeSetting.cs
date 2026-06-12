using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class OfficeSetting : BaseAuditableEntity
{
    public required string OfficialName { get; set; } // Pl. "Úrhidai Közös Önkormányzati Hivatal Nádasdladányi Kirendeltsége"
    public required string Address { get; set; }
    public required string Phone { get; set; }
    public required string Email { get; set; }
    public required string OpeningHoursJson { get; set; } // Az ügyfélfogadási idő strukturált tárolására
}