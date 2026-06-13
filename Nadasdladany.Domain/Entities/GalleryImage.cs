using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class GalleryImage : BaseAuditableEntity
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public required string ImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }

    public int? GalleryAlbumId { get; set; }
    public virtual GalleryAlbum? GalleryAlbum { get; set; }
}