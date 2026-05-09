using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

/// <summary>
/// Represents a photo album in the gallery.
/// </summary>
public class GalleryAlbum : BaseAuditableEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Slug { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }

    public virtual ICollection<GalleryImage> Images { get; set; } = new List<GalleryImage>();
}