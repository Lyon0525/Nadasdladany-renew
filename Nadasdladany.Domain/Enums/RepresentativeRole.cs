namespace Nadasdladany.Domain.Enums;

/// <summary>
/// Defines the specific roles of representatives and staff members.
/// </summary>
public enum RepresentativeRole
{
    /// <summary>
    /// The Mayor of the municipality.
    /// </summary>
    Polgarmester = 0,

    /// <summary>
    /// The Deputy Mayor.
    /// </summary>
    Alpolgarmester = 1,

    /// <summary>
    /// Elected representative member of the body.
    /// </summary>
    Kepviselo = 2,

    /// <summary>
    /// The Notary / Clerk (official head of administration).
    /// </summary>
    Jegyző = 3,

    /// <summary>
    /// Member of a specific committee.
    /// </summary>
    BizottsagiTag = 4,

    /// <summary>
    /// Head of a municipal office department.
    /// </summary>
    HivataliVezető = 5,

    /// <summary>
    /// General municipal staff member.
    /// </summary>
    Munkatars = 6
}