using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Represents a downloadable municipal document.
/// </summary>
public class Document : BaseAuditableEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string FilePath { get; set; }
    public string? FileType { get; set; }
    public long? FileSizeInBytes { get; set; }
    public bool IsPublished { get; set; } = true;

    public int DocumentCategoryId { get; set; }
    public virtual DocumentCategory? DocumentCategory { get; set; }
}