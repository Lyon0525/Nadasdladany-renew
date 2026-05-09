using Nadasdladany.Domain.Common;
using System.Reflection.Metadata;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Categories for municipal documents (e.g., Decrees, Minutes).
/// </summary>
public class DocumentCategory : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Slug { get; set; }

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
}